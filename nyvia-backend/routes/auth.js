const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/database');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

router.post('/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email e senha obrigatórios' });
    }
    const existing = db.getUserByEmail(email);
    if (existing) {
      return res.status(400).json({ error: 'Email já cadastrado' });
    }
    const passwordHash = await bcrypt.hash(password, 10);
    const userId = db.createUser(email, passwordHash, name);
    db.createWorkspace(userId, 'Meu Primeiro Cliente', 'Workspace padrão');
    const token = jwt.sign({ userId, email }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.status(201).json({ token, user: { id: userId, email, name } });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar usuário' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = db.getUserByEmail(email);
    if (!user || !await bcrypt.compare(password, user.password_hash)) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }
    const token = jwt.sign({ userId: user.id, email }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user.id, email: user.email, name: user.name } });
  } catch (error) {
    res.status(500).json({ error: 'Erro no login' });
  }
});

router.get('/me', authMiddleware, (req, res) => {
  const user = db.getUserById(req.userId);
  res.json({ user });
});

module.exports = router;