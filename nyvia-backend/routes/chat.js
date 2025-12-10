const express = require('express');
const db = require('../config/database');
const authMiddleware = require('../middleware/auth');
const coordinator = require('../agents/coordinator');

const router = express.Router();
router.use(authMiddleware);

router.post('/', async (req, res) => {
  try {
    const { workspaceId, conversationId, message } = req.body;
    const workspace = db.getWorkspaceById(workspaceId);
    if (!workspace || workspace.user_id !== req.userId) {
      return res.status(403).json({ error: 'Acesso negado' });
    }
    let convId = conversationId || db.createConversation(workspaceId);
    db.addMessage(convId, 'user', message);
    const history = db.getConversationHistory(convId);
    const response = await coordinator.process(message, history);
    db.addMessage(convId, 'assistant', response.content);
    res.json({ conversationId: convId, response: response.content });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao processar mensagem' });
  }
});

module.exports = router;