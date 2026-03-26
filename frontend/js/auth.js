// Authentication Functions
async function handleLogin(event) {
    event.preventDefault();

    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    if (!email || !password) {
        showMessage('Please fill in all fields', 'error');
        return;
    }

    showLoading();

    try {
        const response = await API.login({ email, password });

        // Store token
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));

        showMessage('Login successful!', 'success');
        updateNavbar(true);
        showPage('dashboard');

        // Clear form
        event.target.reset();

    } catch (error) {
        showMessage(error.message || 'Login failed', 'error');
    } finally {
        hideLoading();
    }
}

async function handleRegister(event) {
    event.preventDefault();

    const name = document.getElementById('register-name').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;

    if (!name || !email || !password) {
        showMessage('Please fill in all fields', 'error');
        return;
    }

    if (password.length < 6) {
        showMessage('Password must be at least 6 characters', 'error');
        return;
    }

    showLoading();

    try {
        const response = await API.register({ name, email, password });

        // Store token
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));

        showMessage('Registration successful!', 'success');
        updateNavbar(true);
        showPage('dashboard');

        // Clear form
        event.target.reset();

    } catch (error) {
        showMessage(error.message || 'Registration failed', 'error');
    } finally {
        hideLoading();
    }
}

function logout() {
    // Clear local storage
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    // Update navbar
    updateNavbar(false);

    // Show home page
    showPage('home');

    showMessage('Logged out successfully', 'info');
}

function checkAuth() {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');

    if (token && user) {
        updateNavbar(true);
        showPage('dashboard');
    } else {
        updateNavbar(false);
        showPage('home');
    }
}

function updateNavbar(isLoggedIn) {
    const navHome = document.getElementById('nav-home');
    const navDashboard = document.getElementById('nav-dashboard');
    const navLogout = document.getElementById('nav-logout');

    if (isLoggedIn) {
        navHome.style.display = 'none';
        navDashboard.style.display = 'inline-block';
        navLogout.style.display = 'inline-block';
    } else {
        navHome.style.display = 'inline-block';
        navDashboard.style.display = 'none';
        navLogout.style.display = 'none';
    }
}

function showAuthTab(tab) {
    const loginTab = document.getElementById('login-tab');
    const registerTab = document.getElementById('register-tab');
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');

    if (tab === 'login') {
        loginTab.classList.add('active');
        registerTab.classList.remove('active');
        loginForm.style.display = 'block';
        registerForm.style.display = 'none';
    } else {
        registerTab.classList.add('active');
        loginTab.classList.remove('active');
        registerForm.style.display = 'block';
        loginForm.style.display = 'none';
    }
}