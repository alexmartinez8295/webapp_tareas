const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const auth = require('../middleware/authMiddleware');

// Middleware to get project by ID
async function getProject(req, res, next) {
  let project;
  try {
    project = await Project.findById(req.params.id);
    if (project == null) {
      return res.status(404).json({ message: 'Cannot find project' });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }

  res.project = project;
  next();
}

// GET all projects
router.get('/', auth, async (req, res) => {
  try {
    const projects = await Project.find({ user: req.user.id });
    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET one project
router.get('/:id', getProject, (req, res) => {
  res.json(res.project);
});

// POST a new project
router.post('/', auth, async (req, res) => {
  
  const project = new Project({
    name: req.body.name,
    description: req.body.description,
    user: req.user.id,
  });

  try {
    const newProject = await project.save();
    res.status(201).json(newProject);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;