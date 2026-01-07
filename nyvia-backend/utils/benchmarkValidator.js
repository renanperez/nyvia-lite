/**
 * Validador de Benchmarks com Ranges Aceitáveis
 * Garante que benchmarks buscados pelo Claude estejam dentro de ranges realistas
 */

const RANGES = {
  ctrDisplay: { min: 0.03, max: 0.08, nome: 'CTR Display' },
  ctrSearch: { min: 0.08, max: 0.15, nome: 'CTR Search' },
  taxaConversao: { min: 0.02, max: 0.10, nome: 'Taxa de Conversão' },
  sessoesPorUsuario: { min: 1.5, max: 3, nome: 'Sessões por Usuário' },
  cogsPercentual: { min: 0.30, max: 0.70, nome: 'COGS Percentual' },
  customerLifespan: { min: 6, max: 24, nome: 'Customer Lifespan (meses)' },
  impressoesPorRealDisplay: { min: 3, max: 8, nome: 'Impressões/R$ Display' },
  impressoesPorRealSearch: { min: 2, max: 6, nome: 'Impressões/R$ Search' }
};

const FALLBACKS = {
  'E-commerce': {
    ctrDisplay: 0.05,
    ctrSearch: 0.10,
    taxaConversao: 0.05,
    sessoesPorUsuario: 2,
    cogsPercentual: 0.48,
    customerLifespan: 12,
    impressoesPorRealDisplay: 5,
    impressoesPorRealSearch: 4
  },
  'Serviços': {
    ctrDisplay: 0.045,
    ctrSearch: 0.09,
    taxaConversao: 0.04,
    sessoesPorUsuario: 2,
    cogsPercentual: 0.35,
    customerLifespan: 18,
    impressoesPorRealDisplay: 5,
    impressoesPorRealSearch: 4
  },
  'B2B': {
    ctrDisplay: 0.04,
    ctrSearch: 0.08,
    taxaConversao: 0.03,
    sessoesPorUsuario: 2.5,
    cogsPercentual: 0.40,
    customerLifespan: 24,
    impressoesPorRealDisplay: 4,
    impressoesPorRealSearch: 3
  },
  'Educação': {
    ctrDisplay: 0.045,
    ctrSearch: 0.09,
    taxaConversao: 0.035,
    sessoesPorUsuario: 2,
    cogsPercentual: 0.30,
    customerLifespan: 12,
    impressoesPorRealDisplay: 5,
    impressoesPorRealSearch: 4
  }
};

/**
 * Valida benchmarks e retorna warnings para valores suspeitos
 */
function validarBenchmarks(benchmarks, setor, anoBenchmark = null) {
  const validados = {};
  const warnings = [];
  
  // Validar ano
  const anoAtual = new Date().getFullYear();
  if (anoBenchmark && anoBenchmark < anoAtual - 1) {
    warnings.push({
      tipo: 'ano_defasado',
      mensagem: `⚠️ Benchmarks de ${anoBenchmark}. Resultados podem variar da realidade atual.`
    });
  }
  
  // Validar cada benchmark
  for (const [key, value] of Object.entries(benchmarks)) {
    if (RANGES[key]) {
      const { min, max, nome } = RANGES[key];
      
      // Valor dentro do range?
      if (value >= min && value <= max) {
        validados[key] = value;
      } else {
        // Fora do range → Avisa + usa fallback
        const fallbackValue = FALLBACKS[setor]?.[key] || value;
        warnings.push({
          tipo: 'fora_range',
          campo: key,
          mensagem: `⚠️ ${nome}: ${formatarValor(value, key)} fora da média (${formatarValor(min, key)}-${formatarValor(max, key)}). Usando valor conservador: ${formatarValor(fallbackValue, key)}`
        });
        validados[key] = fallbackValue;
      }
    } else {
      validados[key] = value;
    }
  }
  
  // Verificar se todos benchmarks necessários foram fornecidos
  const necessarios = Object.keys(RANGES);
  const faltantes = necessarios.filter(k => !validados[k]);
  
  if (faltantes.length > 0) {
    faltantes.forEach(key => {
      const fallbackValue = FALLBACKS[setor]?.[key];
      if (fallbackValue) {
        validados[key] = fallbackValue;
        warnings.push({
          tipo: 'faltante',
          campo: key,
          mensagem: `⚠️ ${RANGES[key].nome} não encontrado. Usando valor padrão: ${formatarValor(fallbackValue, key)}`
        });
      }
    });
  }
  
  return { validados, warnings };
}

/**
 * Formata valor conforme tipo de métrica
 */
function formatarValor(valor, tipo) {
  if (tipo.includes('ctr') || tipo.includes('taxa') || tipo.includes('cogs')) {
    return `${(valor * 100).toFixed(1)}%`;
  }
  if (tipo.includes('Lifespan')) {
    return `${valor} meses`;
  }
  return valor.toFixed(1);
}

/**
 * Retorna fallbacks completos para um setor
 */
function getFallbacksSetor(setor) {
  return FALLBACKS[setor] || FALLBACKS['E-commerce'];
}

module.exports = {
  validarBenchmarks,
  getFallbacksSetor,
  RANGES
};