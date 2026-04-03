const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const app = express();

// Middleware
const allowedOrigins = [
  process.env.FRONTEND_URL,
  'http://localhost:3000',
  'http://127.0.0.1:5500',
  'http://127.0.0.1:5501',
  'http://localhost:3001',
  'http://127.0.0.1:3001',
  'http://localhost:3002',
  'http://127.0.0.1:3002',
  'http://localhost:3003',
  'http://127.0.0.1:3003'
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS policy: origin ${origin} is not allowed`));
    }
  },
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());

// Routes
const authRoutes = require('./routes/auth');
const projectRoutes = require('./routes/projects');

app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;