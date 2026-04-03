const express = require('express');
const { getProjects, createProject, getProject, updateProject, deleteProject, reanalyzeProject } = require('../controllers/projectController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.route('/')
  .get(protect, getProjects)
  .post(protect, createProject);

router.route('/:id')
  .get(protect, getProject)
  .put(protect, updateProject)
  .delete(protect, deleteProject);

router.post('/:id/reanalyze', protect, reanalyzeProject);

module.exports = router;