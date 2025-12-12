const express = require('express');
const db = require('../config/database');
const coordinator = require('../agents/coordinator');

const router = express.Router();
// Middleware de autenticação pode ser adicionado aqui se necessário.
router.post('/', async (req, res) => {  // Rota para processar mensagens de chat
  console.log('🔵 REQUISIÇÃO CHEGOU NO HANDLER');
  console.log('📦 Body:', req.body);
  try {
    const { workspaceId, conversationId, message } = req.body;
    console.log('🔍 Buscando workspace:', workspaceId);
    const workspace = db.getWorkspaceById(workspaceId);
    console.log('🗂️ Workspace:', workspace);
    if (!workspace) {
      return res.status(404).json({ error: 'Workspace não encontrado' });
    }
    let convId = conversationId || db.createConversation(workspaceId);
    db.addMessage(convId, 'user', message);
    
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
    console.error('Erro ao processar mensagem:', error);
    res.write(`data: ${JSON.stringify({ error: 'Erro ao processar mensagem' })}\n\n`);
    res.end();
  }
});

module.exports = router;