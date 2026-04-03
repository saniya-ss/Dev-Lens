const Project = require('../models/Project');

const AI_API_KEY = process.env.AI_API_KEY || null;

// AI Recommendations Generator
function generateAIRecommendations(name, description, status, priority) {
  const recommendations = [];

  // Status-based recommendations
  if (status === 'planning') {
    recommendations.push('Break down the project into smaller, actionable tasks.');
    recommendations.push('Define clear milestones and deadlines.');
  } else if (status === 'in-progress') {
    recommendations.push('Regularly review progress and adjust timelines as needed.');
    recommendations.push('Communicate frequently with team members.');
  } else if (status === 'completed') {
    recommendations.push('Document lessons learned for future projects.');
    recommendations.push('Celebrate achievements and recognize team contributions.');
  }

  // Priority-based recommendations
  if (priority === 'high' || priority === 'urgent') {
    recommendations.push('Allocate additional resources to ensure timely completion.');
    recommendations.push('Set up daily check-ins to monitor progress.');
  }

  // Content-based recommendations
  if (description.toLowerCase().includes('web') || description.toLowerCase().includes('app')) {
    recommendations.push('Consider implementing automated testing for better quality assurance.');
  }

  if (description.toLowerCase().includes('team') || description.toLowerCase().includes('collaboration')) {
    recommendations.push('Use collaboration tools to enhance team communication.');
  }

  // Default recommendations if none generated
  if (recommendations.length === 0) {
    recommendations.push('Focus on delivering value incrementally.');
    recommendations.push('Maintain clear documentation throughout the project.');
  }

  return recommendations.slice(0, 3); // Return top 3 recommendations
}

// @desc    Get all projects for a user
// @route   GET /api/projects
// @access  Private
const getProjects = async (req, res) => {
  try {
    const projects = await Project.findByUserId(req.user.id);
    res.status(200).json({ data: projects, success: true });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new project
// @route   POST /api/projects
// @access  Private
const createProject = async (req, res) => {
  try {
    const { name, description, status, priority } = req.body;

    if (!name || !description) {
      return res.status(400).json({ message: 'Please add name and description' });
    }

    // AI key from environment
    console.debug('AI_API_KEY present:', AI_API_KEY ? 'yes' : 'no');
    // Generate AI insights based on project data
    const completionPercentage = Math.floor(Math.random() * 100) + 1; // 1-100%
    const recommendations = generateAIRecommendations(name, description, status, priority);

    const statusFactor = status === 'completed' ? 1 : status === 'in-progress' ? 0.82 : status === 'planning' ? 0.68 : 0.55;
    const priorityFactor = priority === 'urgent' ? 1 : priority === 'high' ? 0.9 : priority === 'medium' ? 0.78 : 0.65;
    const descriptionScore = Math.min(1, description.length / 300);

    let projectScore = Math.round((completionPercentage * 0.5 + statusFactor * 30 + priorityFactor * 15 + descriptionScore * 5));
    if (projectScore > 100) projectScore = 100;
    if (projectScore < 1) projectScore = 1;

    const riskLevel = projectScore >= 80 ? 'Low' : projectScore >= 55 ? 'Medium' : 'High';

    const aiInsights = {
      completionPercentage,
      score: projectScore,
      riskLevel,
      recommendations,
      analysis: `Project "${name}" scored ${projectScore}/100 with risk level ${riskLevel}.`,
      lastUpdated: new Date().toISOString()
    };

    const project = await Project.create({
      name,
      description,
      status: status || 'planning',
      priority: priority || 'medium',
      userId: req.user.id,
      aiInsights,
    });

    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single project
// @route   GET /api/projects/:id
// @access  Private
const getProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Check if user owns the project
    if (project.userId !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    res.status(200).json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update project
// @route   PUT /api/projects/:id
// @access  Private
const updateProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Check if user owns the project
    if (project.userId !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const updatedProject = await Project.update(req.params.id, req.body);

    res.status(200).json(updatedProject);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Re-analyze project with AI
// @route   POST /api/projects/:id/reanalyze
// @access  Private
const reanalyzeProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Check if user owns the project
    if (project.userId !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const { name, description, status, priority } = project;

    // AI key from environment
    console.debug('AI_API_KEY present:', AI_API_KEY ? 'yes' : 'no');

    const completionPercentage = Math.floor(Math.random() * 100) + 1;
    const recommendations = generateAIRecommendations(name, description, status, priority);

    const statusFactor = status === 'completed' ? 1 : status === 'in-progress' ? 0.82 : status === 'planning' ? 0.68 : 0.55;
    const priorityFactor = priority === 'urgent' ? 1 : priority === 'high' ? 0.9 : priority === 'medium' ? 0.78 : 0.65;
    const descriptionScore = Math.min(1, description.length / 300);

    let projectScore = Math.round((completionPercentage * 0.5 + statusFactor * 30 + priorityFactor * 15 + descriptionScore * 5));
    if (projectScore > 100) projectScore = 100;
    if (projectScore < 1) projectScore = 1;

    const riskLevel = projectScore >= 80 ? 'Low' : projectScore >= 55 ? 'Medium' : 'High';

    const updatedAiInsights = {
      completionPercentage,
      score: projectScore,
      riskLevel,
      recommendations,
      analysis: `Project "${name}" scored ${projectScore}/100 with risk level ${riskLevel}.`,
      lastUpdated: new Date().toISOString()
    };

    const updatedProject = await Project.update(req.params.id, { aiInsights: updatedAiInsights });

    res.status(200).json(updatedProject);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete project
// @route   DELETE /api/projects/:id
// @access  Private
const deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Check if user owns the project
    if (project.userId !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await Project.delete(req.params.id);

    res.status(200).json({ message: 'Project deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getProjects,
  createProject,
  getProject,
  updateProject,
  deleteProject,
  reanalyzeProject,
};