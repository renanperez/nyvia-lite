require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./config/database');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

const authRoutes = require('./routes/auth');
const chatRoutes = require('./routes/chat');
const workspaceRoutes = require('./routes/workspaces');

app.use('/auth', authRoutes);
app.use('api/chat', chatRoutes);
console.log('✅ Rota /chat registrada');
app.use('/workspaces', workspaceRoutes);

app.get('/', (req, res) => {
  res.json({
    name: 'Nyvia Lite Backend',
    version: '1.0.0',
    status: 'operational'
  });
});

app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    database: db.isConnected() ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString()
  });
});

app.listen(PORT, () => {
  console.log(`\n🚀 Nyvia Lite Backend rodando em http://localhost:${PORT}`);
  console.log(`✅ Teste: http://localhost:${PORT}/health\n`);
});