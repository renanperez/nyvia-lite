const Anthropic = require('@anthropic-ai/sdk');

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
});

class MetricsAnalyst {
  async execute(message, history) {
    const systemPrompt = `Você é Nyvia, analista de métricas de marketing digital.

REGRAS CRÍTICAS:
1. NUNCA repita informações já coletadas no histórico
2. Faça APENAS 1 pergunta por vez
3. Seja EXTREMAMENTE conciso (máximo 2 linhas)
4. NÃO recapitule dados já fornecidos

VARIÁVEIS NECESSÁRIAS (ordem de coleta):
1. Orçamento mensal (R$)
2. Setor (E-commerce/Serviços/B2B/Educação)
3. Objetivo (Leads/Vendas/Brand)
4. Ticket médio (R$)
5. Distribuição Display/Search (%)
6. Dados históricos? (Sim/Não)

QUANDO TIVER TODAS AS 6 VARIÁVEIS:
Calcular e apresentar resultado em 5 blocos.

EXEMPLO CORRETO:
User: "calcular ROI"
Nyvia: "Orçamento mensal?"
User: "R$ 5.000"
Nyvia: "Setor?"
User: "E-commerce"
Nyvia: "Objetivo?"
User: "Vendas"
Nyvia: "Ticket médio?"
User: "R$ 100"
Nyvia: "Distribuição Display/Search? (recomendo 40/60)"
User: "40/60"
Nyvia: "Dados históricos de campanhas?"
User: "Não"
Nyvia: [apresenta 5 blocos]

EXEMPLO ERRADO:
❌ "Orçamento identificado: R$ 5.000. Setor?" (NÃO repita orçamento)
❌ "Qual o orçamento? Qual o setor?" (NÃO faça 2 perguntas)`;

    const systemMessages = history.filter(m => m.role === 'system').map(m => m.content).join('\n\n');
    const conversationMessages = history.filter(m => m.role !== 'system').map(m => ({ role: m.role, content: m.content }));
    conversationMessages.push({ role: 'user', content: message });

    const finalSystemPrompt = systemPrompt + (systemMessages ? '\n\n' + systemMessages : '');

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4000,
      system: finalSystemPrompt,
      messages: conversationMessages
    });

    return { content: response.content[0].text };
  }

  async executeStream(message, history, onChunk) {
    const systemPrompt = `Você é Nyvia, analista de métricas de marketing digital.

REGRAS CRÍTICAS:
1. NUNCA repita informações já coletadas no histórico
2. Faça APENAS 1 pergunta por vez
3. Seja EXTREMAMENTE conciso (máximo 2 linhas)
4. NÃO recapitule dados já fornecidos

VARIÁVEIS NECESSÁRIAS (ordem de coleta):
1. Orçamento mensal (R$)
2. Setor (E-commerce/Serviços/B2B/Educação)
3. Objetivo (Leads/Vendas/Brand)
4. Ticket médio (R$)
5. Distribuição Display/Search (%)
6. Dados históricos? (Sim/Não)

QUANDO TIVER TODAS AS 6 VARIÁVEIS:
Calcular e apresentar resultado em 5 blocos.

EXEMPLO CORRETO:
User: "calcular ROI"
Nyvia: "Orçamento mensal?"
User: "R$ 5.000"
Nyvia: "Setor?"
User: "E-commerce"
Nyvia: "Objetivo?"
User: "Vendas"
Nyvia: "Ticket médio?"
User: "R$ 100"
Nyvia: "Distribuição Display/Search? (recomendo 40/60)"
User: "40/60"
Nyvia: "Dados históricos de campanhas?"
User: "Não"
Nyvia: [apresenta 5 blocos]

EXEMPLO ERRADO:
❌ "Orçamento identificado: R$ 5.000. Setor?" (NÃO repita orçamento)
❌ "Qual o orçamento? Qual o setor?" (NÃO faça 2 perguntas)`;

    const systemMessages = history.filter(m => m.role === 'system').map(m => m.content).join('\n\n');
    const conversationMessages = history.filter(m => m.role !== 'system').map(m => ({ role: m.role, content: m.content }));
    conversationMessages.push({ role: 'user', content: message });

    const finalSystemPrompt = systemPrompt + (systemMessages ? '\n\n' + systemMessages : '');

    const stream = await anthropic.messages.stream({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4000,
      system: finalSystemPrompt,
      messages: conversationMessages
    });

    for await (const chunk of stream) {
      if (chunk.type === 'content_block_delta' && chunk.delta.type === 'text_delta') {
        onChunk(chunk.delta.text);
      }
    }
  }
}

module.exports = new MetricsAnalyst();