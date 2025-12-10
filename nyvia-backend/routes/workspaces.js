const express = require('express');
const db = require('../config/database');
const authMiddleware = require('../middleware/auth');

const router = express.Router();
router.use(authMiddleware);

router.get('/', (req, res) => {
  const workspaces = db.getWorkspacesByUser(req.userId);
  res.json({ workspaces });
});

router.post('/', (req, res) => {
  const { name, description } = req.body;
  const workspaceId = db.createWorkspace(req.userId, name, description);
  const workspace = db.getWorkspaceById(workspaceId);
  res.status(201).json({ workspace });
});

module.exports = router;