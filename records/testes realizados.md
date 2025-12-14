TESTES REALIZADOS

Nesse documento que foram descritos o problema/solução/resultado dos testes, a fim de criar um padrão (método para os testes) que devem estar de acordo com a adoção de critérios. O critério dos testes, deve ser orientados para rodar os fluxos completos e funcionais, sejam para os testes locais, em produção, ou em camadas de teste intermediárias (entre dev e produção), se necessário.

TESTES LOCAIS:
 
Desenvolvimento (Padrão) moderno:

Frontend local (localhost:3000)
Backend local (localhost:3001)
Fetch entre portas diferentes

Problema/solução: integração Backend -> frontend não funciona. 

Problema: Next.js está interceptando o fetch e bloqueando.
Solução: Usar proxy interno -> Executar Solução -> Criar pasta api/chat:"nyvia-frontend\app\api\chat"
Resultado: Desenvolvimento local: Funciona (frontend → Next.js API → Express)



Como funcionam testes: temos 3 servidores rodando:

Next.js Dev Server (3000) - serve frontend + API Routes
Express Backend (3001) - processa lógica + Claude API
Browser - roda React

Problema/solução: Sem proxy não funciona, criar Proxy interno

Problema: Sem proxy: Frontend (3000) → Backend (3001) = fluxo bloqueado pelo browser
Solução: Fluxo COM proxy interno: Frontend (3000) → Next.js API Route (3000) → Backend (3001) = 
Resultado: Next.js repassa requisição internamente (servidor → servidor, não browser → servidor).

Browser (React) 
  ↓ fetch('/api/chat') - origem porta 3000
Next.js API Route (servidor Node.js na porta 3000) -> mesma origem, não bloqueia
  ↓ fetch('http://localhost:3001/api/chat') - servidor para servidor
Express Backend (3001)
  ↓ processa + Claude API
  ↓ retorna resposta
Next.js repassa para Browser
**Next.js = intermediário. Backend Express continua fazendo todo o trabalho pesado.



Integração Frontend ↔ Backend

Problema/solução: Mensagem digitada no frontend Não Foi Enviada ao Backend, Iniciar Backend e Testar Integração

Problema:Requisição sem token JWT. 
Solução: Remover Autenticação Temporariamente (Desabilitar auth no backend) -> Editar routes/chat.js - remover linha: router.use(authMiddleware);
Resultado: Backend Rodando, MAS Sem Logs de Requisição



Problema/solução: Backend da Rota /chat existe, mas Nenhuma Resposta do Claude 

Problema: Frontend Next.js não consegue fazer POST para backend Express standalone na porta 3001.
Solução: Mover rota /chat para dentro do Next.js (API Routes em app/api/chat/route.ts). Backend Express vira só database + processamento, Next.js gerencia HTTP.
Resultado: Requisição NÃO Chega ao Backend. Terminal vazio = Express não recebe a requisição.



Problema/solução: Frontend está fazendo requisição, mas algo bloqueia ANTES de chegar ao Express.

Problema:Frontend envia corretamente, mas backend responde 404
Solução: Verificar se chat.js Tem o Console.log -> Adicionar Log
 router.post('/', async (req, res) => {
  console.log('🔵 REQUISIÇÃO CHEGOU NO HANDLER');
  try {

Resultado: PS D:\nyvia\nyvia-backend> npm start
> nyvia-backend@1.0.0 start
> node server.js
✅ Banco de dados inicializado
✅ Rota /api/chat registrada
🚀 Nyvia Lite Backend rodando em http://localhost:3001
✅ Teste: http://localhost:3001/health
🔵 REQUISIÇÃO CHEGOU NO HANDLER  -> mostrou isso no terminal


Problema/solução:  Fluxo Ainda Precisa do Banco (dependência do Banco)

Problema: não tinhamos nenhum registro no banco para realizar testes (criar_dependências)
Solução: Criar workspace ID 1 no banco permanentemente, para validação e funcionamento do banco(Mock = temporário)
Resultado: Fluxo para testes ok

1. Cria conversação no banco (createConversation  
2. Salva mensagem do usuário (addMessage)
3. Busca histórico (getConversationHistory)
4. Salva resposta do Claude (addMessage)	
** Banco continua essencial para: salvar histórico de conversas.




MUDANÇAS DE DEV LOCAL PARA PRODUÇÃO

Antes e depois do Proxy:

Antes: Testando SEM autenticação (workspace ID 1 hardcoded). E, authMiddleware removido APENAS de /api/chat para testes.
Depois: Reativar authMiddleware + implementar login no frontend.


Em produção:

✅ /api/chat precisa authMiddleware (segurança)
✅ /workspaces tem authMiddleware
✅ /auth/me tem authMiddleware


Fluxo correto depois:

User faz login → recebe token JWT
Frontend guarda token
Todas requisições enviam token
Backend valida token com authMiddleware



TESTES EM PRODUÇÃO:

Depois do Proxy (deploy em produção)

Frontend: Vercel/Netlify
Backend: VPS/Railway/Render (separado)
Frontend chama backend via URL pública (ex: https://api.nyvia.com)

Problema/solução: 

Problema: Proxy é APENAS para desenvolvimento local.
Solução: Em produção, remove proxy e usa variável de ambiente:
Resultado: const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'
fetch(`${API_URL}/api/chat`)



Problema/solução: Projeto real precisa Sistema de autenticação funcionando.

Problema: Testando sem autenticação = sempre vai falhar na validação de workspace.
Solução:  Implementar tela de login/registro no frontend (correto)
Resultado: Fluxo para Produção ok

1. User faz /auth/register → cria user + workspace automaticamente
2. User faz /auth/login → recebe token JWT
3. Frontend guarda token no localStorage
4. Frontend usa token em todas requisições
5. Backend valida token, pega userId, valida workspace


