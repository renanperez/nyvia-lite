#!/usr/bin/env node
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";import { z } from "zod";

// Importar utils (CommonJS) usando createRequire
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const metricsCalculator = require('../../../utils/metricsCalculator.js');
const benchmarkValidator = require('../../../utils/benchmarkValidator.js');

const server = new McpServer({
  name: "nyvia-metrics",
  version: "1.0.0",
  description: "Metrics calculation server for Nyvia"
});

// TOOL 1: Coletar dados da campanha
server.tool(
  "collect_campaign_data",
  "Coleta os 5 dados essenciais da campanha: orçamento, setor, objetivo, ticket médio e distribuição Display/Search",
  {
    orcamento: z.number().positive().describe("Orçamento mensal em reais (ex: 5000)"),
    setor: z.enum(["E-commerce", "Serviços", "B2B", "Educação"]).describe("Setor do negócio"),
    objetivo: z.enum(["Leads", "Vendas", "Brand"]).describe("Objetivo principal da campanha"),
    ticketMedio: z.number().positive().describe("Valor médio do ticket em reais (ex: 100)"),
    distribuicaoDisplay: z.number().min(0).max(1).describe("Percentual para Display Ads (0 a 1, ex: 0.4 = 40%)"),
    distribuicaoSearch: z.number().min(0).max(1).describe("Percentual para Search Ads (0 a 1, ex: 0.6 = 60%)")
  },
  async (params) => {
    // Validar que soma = 100%
    const soma = params.distribuicaoDisplay + params.distribuicaoSearch;
    if (Math.abs(soma - 1) > 0.001) {
      return {
        content: [{
          type: "text",
          text: `❌ ERRO: Distribuição Display (${params.distribuicaoDisplay * 100}%) + Search (${params.distribuicaoSearch * 100}%) = ${soma * 100}%. Deve somar 100%.`
        }],
        isError: true
      };
    }
    
    // Dados validados
    return {
      content: [{
        type: "text",
        text: "✅ Dados coletados. Próximo: buscar benchmarks."
      }]
    };
  }
);

// TOOL 2: Buscar benchmarks de mercado
server.tool(
  "fetch_benchmarks",
  "Busca benchmarks de mercado para o setor especificado. Retorna métricas como CTR, taxa de conversão, COGS, etc.",
  {
    setor: z.enum(["E-commerce", "Serviços", "B2B", "Educação"]).describe("Setor para buscar benchmarks")
  },
  async ({ setor }) => {
    // Obter fallbacks do validator (valores conservadores)
    const benchmarks = benchmarkValidator.getFallbacksSetor(setor);
    
    return {
      content: [{
        type: "text",
        text: `📊 Benchmarks de mercado para ${setor}:

**Display Ads:**
- CTR Display: ${(benchmarks.ctrDisplay * 100).toFixed(1)}%
- Impressões por R$: ${benchmarks.impressoesPorRealDisplay}

**Search Ads:**
- CTR Search: ${(benchmarks.ctrSearch * 100).toFixed(1)}%
- Impressões por R$: ${benchmarks.impressoesPorRealSearch}

**Conversão:**
- Taxa de Conversão: ${(benchmarks.taxaConversao * 100).toFixed(1)}%
- Sessões por Usuário: ${benchmarks.sessoesPorUsuario}

**Financeiro:**
- COGS: ${(benchmarks.cogsPercentual * 100).toFixed(1)}%
- Customer Lifespan: ${benchmarks.customerLifespan} meses

Estes são valores conservadores baseados em médias do setor.`
      }]
    };
  }
);

// TOOL 3: Calcular métricas completas
server.tool(
  "calculate_metrics",
  "Calcula todas as métricas de campanha (ROI, CAC, LTV, ROAS, etc) usando os dados coletados e benchmarks validados",
  {
    orcamento: z.number().positive(),
    setor: z.string(),
    objetivo: z.string(),
    ticketMedio: z.number().positive(),
    distribuicaoDisplay: z.number().min(0).max(1),
    distribuicaoSearch: z.number().min(0).max(1),
    benchmarks: z.object({
      ctrDisplay: z.number(),
      ctrSearch: z.number(),
      taxaConversao: z.number(),
      sessoesPorUsuario: z.number(),
      cogsPercentual: z.number(),
      customerLifespan: z.number(),
      impressoesPorRealDisplay: z.number(),
      impressoesPorRealSearch: z.number()
    })
  },
  async (params) => {
    try {
      // 1. Validar benchmarks
      const { validados, warnings } = benchmarkValidator.validarBenchmarks(
        params.benchmarks,
        params.setor
      );
      
      // 2. Preparar variáveis para cálculo
      const variaveis = {
        ticketMedio: params.ticketMedio,
        budgetAlocado: 0.95, // 95% do orçamento alocado em ads
        percentualDisplay: params.distribuicaoDisplay,
        percentualSearch: params.distribuicaoSearch,
        ...validados
      };
      
      // 3. Executar cálculo determinístico
      const resultado = metricsCalculator.calcularMetricas(
        params.orcamento,
        variaveis
      );

      // 4. Formatar resposta
      let resposta = `🎯 **RESULTADOS DA ANÁLISE DE CAMPANHA**\n\n`;
      
      // Warnings (se houver)
      if (warnings.length > 0) {
        resposta += `⚠️ **Avisos:**\n`;
        warnings.forEach(w => resposta += `- ${w.mensagem}\n`);
        resposta += `\n`;
      }
      
      // Bloco 1: Display Ads
      resposta += `📱 **DISPLAY ADS**\n`;
      resposta += `- Budget Alocado: R$ ${resultado.bloco1_displayAds.budgetAlocado.toLocaleString('pt-BR', {minimumFractionDigits: 2})}\n`;
      resposta += `- Impressões: ${resultado.bloco1_displayAds.impressoes.toLocaleString('pt-BR')}\n`;
      resposta += `- Cliques: ${resultado.bloco1_displayAds.cliques.toLocaleString('pt-BR')}\n`;
      resposta += `- CPM: R$ ${resultado.bloco1_displayAds.cpm.toFixed(2)}\n`;
      resposta += `- CTR: ${(resultado.bloco1_displayAds.ctr * 100).toFixed(2)}%\n\n`;
      
      // Bloco 2: Search Ads
      resposta += `🔍 **SEARCH ADS**\n`;
      resposta += `- Budget Alocado: R$ ${resultado.bloco2_searchAds.budgetAlocado.toLocaleString('pt-BR', {minimumFractionDigits: 2})}\n`;
      resposta += `- Impressões: ${resultado.bloco2_searchAds.impressoes.toLocaleString('pt-BR')}\n`;
      resposta += `- Cliques: ${resultado.bloco2_searchAds.cliques.toLocaleString('pt-BR')}\n`;
      resposta += `- CPC: R$ ${resultado.bloco2_searchAds.cpc.toFixed(2)}\n`;
      resposta += `- CTR: ${(resultado.bloco2_searchAds.ctr * 100).toFixed(2)}%\n\n`;
      
      // Bloco 3: Conversão
      resposta += `🎯 **CONVERSÃO**\n`;
      resposta += `- Total Visitantes: ${resultado.bloco3_conversao.totalVisitantes.toLocaleString('pt-BR')}\n`;
      resposta += `- Total Sessões: ${resultado.bloco3_conversao.totalSessoes.toLocaleString('pt-BR')}\n`;
      resposta += `- Sessões/Usuário: ${resultado.bloco3_conversao.sessoesPorUsuario.toFixed(2)}\n`;
      resposta += `- Novos Pedidos: ${resultado.bloco3_conversao.novosPedidos.toLocaleString('pt-BR')}\n`;
      resposta += `- Taxa Conversão: ${(resultado.bloco3_conversao.taxaConversao * 100).toFixed(2)}%\n\n`;
      
      // Bloco 4: Receita e ROI (DESTAQUE)
      resposta += `💰 **RECEITA E ROI**\n`;
      resposta += `- Clientes Adquiridos: ${resultado.bloco4_receitaROI.clientesAdquiridos.toLocaleString('pt-BR')}\n`;
      resposta += `- Total Vendas: R$ ${resultado.bloco4_receitaROI.totalVendas.toLocaleString('pt-BR', {minimumFractionDigits: 2})}\n`;
      resposta += `- **ROAS: ${resultado.bloco4_receitaROI.roas.toFixed(2)}x**\n`;
      resposta += `- Receita Líquida: R$ ${resultado.bloco4_receitaROI.receitaLiquida.toLocaleString('pt-BR', {minimumFractionDigits: 2})}\n`;
      resposta += `- **ROI: ${(resultado.bloco4_receitaROI.roi * 100).toFixed(1)}%**\n\n`;
      
      // Bloco 5: Métricas Avançadas
      resposta += `📊 **MÉTRICAS AVANÇADAS**\n`;
      resposta += `- CAC: R$ ${resultado.bloco5_metricasAvancadas.cac.toFixed(2)}\n`;
      resposta += `- LTV: R$ ${resultado.bloco5_metricasAvancadas.cltv.toFixed(2)}\n`;
      resposta += `- **LTV/CAC Ratio: ${resultado.bloco5_metricasAvancadas.ltvCacRatio.toFixed(2)}x**\n`;
      resposta += `- Margem Lucro Bruta: ${(resultado.bloco5_metricasAvancadas.margemLucroBruta * 100).toFixed(1)}%\n`;
      resposta += `- Break Even ROAS: ${resultado.bloco5_metricasAvancadas.breakEvenROAS.toFixed(2)}x\n\n`;
      
      // Status Final
      resposta += `📈 **STATUS: ${resultado.bloco5_metricasAvancadas.status}**`;
      
      return {
        content: [{
          type: "text",
          text: resposta
        }]
      };
      } catch (error) {
      return {
        content: [{
          type: "text",
          text: `❌ Erro no cálculo: ${error.message}`
        }],
        isError: true
      };
    }
  }
);

// Iniciar servidor MCP
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((error) => {
  console.error("Erro fatal no MCP server:", error);
  process.exit(1);
});