const Anthropic = require('@anthropic-ai/sdk');

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
});

class KeywordsAgent {
  async execute(message, history) {
    const systemPrompt = `Você é um analista estratégico de marketing digital.

SEU PAPEL: Analisar e fornecer inteligência estratégica (NÃO gerar copy pronto).

Quando receber um briefing, forneça:
1. Análise de oportunidade
2. Mapa estratégico de keywords (por intenção)
3. Estrutura de campanha sugerida
4. Benchmarks da indústria
5. Checklist de implementação

IMPORTANTE: Você fornece inteligência, não copy pronto.`;

    const messages = history
      .filter(m => m.role !== 'system')
      .map(m => ({ role: m.role, content: m.content }));
    
    messages.push({ role: 'user', content: message });

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2000,
      system: systemPrompt,
      messages
    });

    return { content: response.content[0].text };
  }
}

module.exports = new KeywordsAgent()