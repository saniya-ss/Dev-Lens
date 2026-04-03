// Main Application Logic
let currentPage = 'home';

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    checkAuth();
    loadPages();
});

// Load HTML pages
async function loadPages() {
    const pages = ['home', 'dashboard', 'add-project'];

    for (const page of pages) {
        try {
            const response = await fetch(`pages/${page}.html`);
            const html = await response.text();
            document.getElementById('main-content').innerHTML += html;
        } catch (error) {
            console.error(`Failed to load ${page}.html:`, error);
        }
    }
}

// Page navigation
function showPage(pageName) {
    // Hide all pages
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => page.style.display = 'none');

    // Show selected page
    const targetPage = document.getElementById(`${pageName}-page`);
    if (targetPage) {
        targetPage.style.display = 'block';
        targetPage.classList.add('active');
        currentPage = pageName;

        // Load page-specific data
        if (pageName === 'dashboard') {
            loadProjects();
        }
    }
}

function hideAllPages() {
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => {
        page.style.display = 'none';
        page.classList.remove('active');
    });
}

// Project Management Functions
async function loadProjects() {
    showLoading();

    try {
        const response = await API.getProjects();
        let projects = response.data || [];

        // Sort by score (highest first)
        projects.sort((a, b) => {
            const scoreA = a.aiInsights?.score || 0;
            const scoreB = b.aiInsights?.score || 0;
            return scoreB - scoreA;
        });

        const container = document.getElementById('projects-container');
        const noProjects = document.getElementById('no-projects');

        if (projects.length === 0) {
            container.innerHTML = '';
            noProjects.style.display = 'block';
        } else {
            noProjects.style.display = 'none';
            container.innerHTML = projects.map(project => createProjectCard(project)).join('');
        }

        updateDashboardStats(projects);

    } catch (error) {
        showMessage('Failed to load projects', 'error');
        console.error('Load projects error:', error);
    } finally {
        hideLoading();
    }
}

function updateDashboardStats(projects) {
    const total = projects.length;
    const inProgress = projects.filter(p => p.status === 'in-progress').length;
    const completed = projects.filter(p => p.status === 'completed').length;

    const totalEl = document.getElementById('total-projects');
    const inProgEl = document.getElementById('in-progress');
    const completedEl = document.getElementById('completed');

    if (totalEl) totalEl.textContent = total;
    if (inProgEl) inProgEl.textContent = inProgress;
    if (completedEl) completedEl.textContent = completed;
}

function createProjectCard(project) {
    const aiInsights = project.aiInsights || {};
    const completionPercentage = aiInsights.completionPercentage || 0;
    const riskLevel = aiInsights.riskLevel || 'N/A';
    const riskColor = riskLevel === 'Low' ? '#28a745' : riskLevel === 'Medium' ? '#ffc107' : '#dc3545';

    return `
        <div class="project-card">
            <div class="card-header">
                <h3>${project.name}</h3>
                <span class="risk-badge" style="background-color: ${riskColor};">${riskLevel} Risk</span>
            </div>
            <p>${project.description}</p>
            <div class="project-meta">
                <span class="project-status ${project.status}">${project.status.replace('-', ' ')}</span>
                <span class="project-priority ${project.priority}">${project.priority}</span>
            </div>
            <div class="ai-insights">
                <h4>AI Insights</h4>
                <p><strong>Score:</strong> ${aiInsights.score || 0}/100</p>
                <p><strong>Risk level:</strong> ${riskLevel}</p>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${completionPercentage}%"></div>
                </div>
                <p>Completion: ${completionPercentage}%</p>
                ${aiInsights.analysis ? `<p>${aiInsights.analysis}</p>` : ''}
                ${aiInsights.recommendations ? `
                    <ul class="ai-recommendations">
                        ${aiInsights.recommendations.map(r => `<li>${r}</li>`).join('')}
                    </ul>
                ` : ''}
                <button class="btn-reanalyze" onclick="reanalyzeProject('${project.id}')">🔄 Re-run Analysis</button>
                <button class="btn-delete" onclick="deleteProject('${project.id}')">🗑️ Delete</button>
            </div>
        </div>
    `;
}

async function reanalyzeProject(projectId) {
    showLoading();

    try {
        await API.request(`/projects/${projectId}/reanalyze`, {
            method: 'POST'
        });

        showMessage('Project re-analyzed successfully!', 'success');
        loadProjects();

    } catch (error) {
        showMessage('Failed to re-analyze project', 'error');
        console.error('Reanalyze error:', error);
    } finally {
        hideLoading();
    }
}

async function deleteProject(projectId) {
    if (!confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
        return;
    }

    showLoading();

    try {
        await API.deleteProject(projectId);

        showMessage('Project deleted successfully!', 'success');
        loadProjects();

    } catch (error) {
        showMessage('Failed to delete project', 'error');
        console.error('Delete error:', error);
    } finally {
        hideLoading();
    }
}

async function handleAddProject(event) {
    event.preventDefault();

    const name = document.getElementById('project-name').value;
    const description = document.getElementById('project-description').value;
    const status = document.getElementById('project-status').value;
    const priority = document.getElementById('project-priority').value;

    if (!name || !description) {
        showMessage('Please fill in all fields', 'error');
        return;
    }

    showLoading();

    try {
        await API.createProject({
            name,
            description,
            status,
            priority
        });

        showMessage('Project added successfully!', 'success');

        // Clear form
        event.target.reset();

        // Go back to dashboard
        showPage('dashboard');

    } catch (error) {
        showMessage(error.message || 'Failed to add project', 'error');
    } finally {
        hideLoading();
    }
}

// Utility function to format dates
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

// Check authentication on page load
function checkAuthOnLoad() {
    const token = localStorage.getItem('token');
    if (!token) {
        showPage('home');
        return false;
    }
    return true;
}