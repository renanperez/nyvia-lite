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
    
    // Configura headers para Server-Sent Events
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    
    const history = db.getConversationHistory(convId);
    let fullResponse = '';
    
    await coordinator.processStream(message, history, (chunk) => {
      fullResponse += chunk;
      res.write(`data: ${JSON.stringify({ chunk })}\n\n`);
    });
    
    db.addMessage(convId, 'assistant', fullResponse);
    res.write(`data: ${JSON.stringify({ done: true, conversationId: convId })}\n\n`);
    res.end();
  } catch (error) {
    res.write(`data: ${JSON.stringify({ error: 'Erro ao processar mensagem' })}\n\n`);
    res.end();
  }
});

module.exports = router;

// Server-Sent Events: envia dados incrementalmente ao cliente
// res.write: envia cada chunk conforme Claude gera
// fullResponse: acumula texto completo para salvar no banco