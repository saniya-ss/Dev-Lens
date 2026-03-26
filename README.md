# Project 1

This repository contains a full-stack web application with a Node.js/Express backend and a plain JavaScript frontend.

## ⚙️ Tech stack
- Backend: Node.js, Express, Firebase (service account in `backend/config`), MongoDB/Mongoose (if used in models)
- Frontend: HTML, CSS, JavaScript
- File structure:
  - `backend/` - server code, routes, controllers, models, middleware
  - `frontend/` - static pages and client-side scripts
  - `frontend-server.js` - optional static file server entrypoint

## 🚀 Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/<your-username>/<your-repo>.git
   cd project_1
   ```
2. Install backend dependencies:
   ```bash
   cd backend
   npm install
   ```
3. Create or provide required config files:
   - `backend/config/firebase-service-account.json`
   - `.env` for secrets (if needed by your app)
4. Start backend server:
   ```bash
   npm start
   ```

## 🌐 Frontend
- Serve from `frontend/` folder, or run `node frontend-server.js` if configured as static server.
- Access app in browser at `http://localhost:3000` (or port defined in backend `app.js`).

## 🗂️ Routes
- Backend route examples (from `backend/routes`):
  - `/auth` (authentication endpoints)
  - `/projects` (project CRUD endpoints)

## 🛠️ Notes
- Make sure database credentials and Firebase service account file are secure.
- Adjust ports and API URLs in `frontend/js/api.js` and `backend/app.js` according to your local environment.

## ✅ Contribution
1. Fork the repo
2. Create a branch (`feature/xyz`)
3. Commit and push (`git commit -m "Add xyz"`)
4. Open a pull request

## � Deployment Notes
- `api.js` currently uses `API_BASE_URL = 'http://localhost:5000/api'`; for production change this to your deployed API host, e.g. `https://your-domain.com/api`.
- For same-origin deployments, use a relative base URL:
  - `const API_BASE_URL = '/api';`
- Ensure backend is actually running and reachable.
- Confirm CORS origin is allowed in `backend/app.js` (e.g., `FRONTEND_URL` in `.env`).
- `ERR_CONNECTION_REFUSED` means the browser cannot connect to your backend host (not running, wrong port, or wrong URL).

## �📄 License
Add your preferred license (e.g., MIT) here.
