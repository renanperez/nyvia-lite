# Análise da Planilha Revenue_Growth.xlsx

## 📊 DADOS DE ENTRADA (Inputs do Usuário)

| Coluna | Nome | Tipo | Valor Exemplo |
|--------|------|------|---------------|
| **D** | **Marketing Budget** | **INPUT PRINCIPAL** | 5000 |
| E | Budget Alocated | Input | 1 (100%) |
| AA | Ticket | Input | 100 |
| AL | Average Customer Life Span (ACL) | Input | 1 |

---

## 🔢 FÓRMULAS IDENTIFICADAS (Cálculos Encadeados)

### **BLOCO 1: DISPLAY ADS (Google Display Network)**

| Col | Métrica | Fórmula Excel | Multiplicador | Descrição |
|-----|---------|---------------|---------------|-----------|
| F | Ad Spend | `=D4*E4` | - | Orçamento total alocado |
| **G** | **Display** | `=F4*0.4` | **× 0.4** | **40% do budget vai para Display** |
| **H** | **Impressions/Month** | `=G4*5` | **× 5** | **5 impressões por real gasto** |
| **I** | **Clicks** | `=H4*0.05` | **× 0.05** | **5% CTR (Click Through Rate)** |
| J | CPM | `=H4/G4` | - | Custo por mil impressões |
| K | CTR | `=I4/H4` | - | Taxa de cliques |

**Multiplicadores identificados:**
- `0.4` = Percentual do budget para Display (40%)
- `5` = Impressões por unidade monetária
- `0.05` = CTR de 5%

---

### **BLOCO 2: SEARCH ADS (Google Search/Meta)**

| Col | Métrica | Fórmula Excel | Multiplicador | Descrição |
|-----|---------|---------------|---------------|-----------|
| **L** | **Search** | `=F4*0.6` | **× 0.6** | **60% do budget vai para Search** |
| **M** | **Impressions** | `=L4*4` | **× 4** | **4 impressões por real gasto** |
| **N** | **Clicks** | `=M4*0.1` | **× 0.1** | **10% CTR** |
| O | CPC | `=N4/L4` | - | Custo por clique |
| P | CTR | `=N4/M4` | - | Taxa de cliques |

**Multiplicadores identificados:**
- `0.6` = Percentual do budget para Search (60%)
- `4` = Impressões por unidade monetária
- `0.1` = CTR de 10%

---

### **BLOCO 3: VISITANTES E CONVERSÕES**

| Col | Métrica | Fórmula Excel | Multiplicador | Descrição |
|-----|---------|---------------|---------------|-----------|
| R | Visitors/Users | `=I4+N4` | - | Total de visitantes (Display + Search) |
| **S** | **Visits/Sessions** | `=R4*2` | **× 2** | **2 sessões por usuário** |
| T | Sessions Per User | `=S4/R4` | - | Sessões por usuário |
| **U** | **New Orders** | `=R4*0.05` | **× 0.05** | **5% taxa de conversão** |
| V | Conversion Rate (CRO%) | `=U4/R4` | - | Taxa de conversão |

**Multiplicadores identificados:**
- `2` = Número médio de sessões por visitante
- `0.05` = Taxa de conversão de 5% (CRO)

---

### **BLOCO 4: RECEITA E ROI**

| Col | Métrica | Fórmula Excel | Descrição |
|-----|---------|---------------|-----------|
| Z | Customer Acquisition | `=U4` | Clientes adquiridos |
| AB | Total Sales | `=AA4*Z4` | Ticket × Clientes |
| Q | ROAS | `=D4/F4` | Return on Ad Spend |
| X | Revenue - Ad Spend | `=AB4-F4` | ROI em valor absoluto |
| Y | ROI | `=X4/F4` | ROI percentual |
| AC | Difference | `=AB4-F4` | Diferença receita - investimento |
| AD | Percentage Variation | `=AC4/D4` | Variação percentual |

---

### **BLOCO 5: MÉTRICAS AVANÇADAS (LTV, CAC, Margem)**

| Col | Métrica | Fórmula Excel | Multiplicador | Descrição |
|-----|---------|---------------|---------------|-----------|
| AE | CAC | `=F4/Z4` | - | Custo de Aquisição por Cliente |
| AF | Revenue Per Customer (RPC) | `=AB4*C4/Z4` | - | Receita média por cliente |
| **AG** | **COGS (48%)** | `=AF4*48/100` | **× 0.48** | **Custo dos produtos = 48% da receita** |
| AH | Gross Profit Per Customer | `=AF4-AG4` | - | Lucro bruto por cliente |
| AI | Gross Profit Margin | `=AH4/AF4` | - | Margem de lucro bruta |
| AJ | AOV (Average Order Value) | `=AB4/U4` | - | Valor médio do pedido |
| AK | APF (Purchase Frequency) | `=Z4/U4` | - | Frequência de compra |
| AM | CLTV (Customer Lifetime Value) | `=AJ4*AK4*AL4` | - | Valor do cliente ao longo da vida |
| AN | Revenue Profit in Lifetime | `=AM4-AG4` | - | Lucro líquido do cliente |
| AO | Break Even CAC | `=AM4*AI4` | - | CAC de equilíbrio |
| AP | LTV/CAC Ratio | `=AM4/AE4` | - | Relação LTV/CAC |
| W | Break Even ROAS | `=1/AI4` | - | ROAS de equilíbrio |

**Multiplicador identificado:**
- `0.48` = COGS de 48% (Custo dos Produtos Vendidos)

---

## 📋 RESUMO DOS MULTIPLICADORES (Estimativas de Mercado)

### **Alocação de Budget:**
- **0.4** (40%) → Display Ads
- **0.6** (60%) → Search Ads

### **Performance de Anúncios:**
- **5** → Impressões/$ no Display
- **4** → Impressões/$ no Search
- **0.05** (5%) → CTR Display
- **0.1** (10%) → CTR Search

### **Conversão e Comportamento:**
- **2** → Sessões por visitante
- **0.05** (5%) → Taxa de conversão geral

### **Custos e Margens:**
- **0.48** (48%) → COGS (Custo dos Produtos)

---

## ✅ O QUE CADA MULTIPLICADOR SIGNIFICA

| Multiplicador | Significado | Contexto | Justificativa |
|---------------|-------------|----------|---------------|
| **0.4** | 40% para Display | Distribuição de budget | Estratégia comum: mais em Search que gera conversão direta |
| **0.6** | 60% para Search | Distribuição de budget | Search tem maior intenção de compra |
| **5** | 5 impressões/$ | Performance Display | Estimativa de alcance em campanhas display |
| **4** | 4 impressões/$ | Performance Search | Search é mais caro mas mais qualificado |
| **0.05** | CTR 5% Display | Taxa de cliques | Média de mercado para display ads |
| **0.1** | CTR 10% Search | Taxa de cliques | Search tem CTR maior (intenção) |
| **2** | 2 sessões/usuário | Comportamento | Usuário retorna ou navega múltiplas páginas |
| **0.05** | CR 5% | Conversão | Taxa típica e-commerce B2C |
| **0.48** | COGS 48% | Margem | Custo dos produtos vendidos |

---

## 🎯 FLUXO DE CÁLCULO COMPLETO

```
INPUT: Marketing Budget (D) = 5000

PASSO 1: Distribuir Budget
├─ Ad Spend (F) = 5000 × 1 = 5000
├─ Display (G) = 5000 × 0.4 = 2000
└─ Search (L) = 5000 × 0.6 = 3000

PASSO 2: Calcular Impressões
├─ Display Impressions (H) = 2000 × 5 = 10.000
└─ Search Impressions (M) = 3000 × 4 = 12.000

PASSO 3: Calcular Cliques
├─ Display Clicks (I) = 10.000 × 0.05 = 500
└─ Search Clicks (N) = 12.000 × 0.1 = 1.200

PASSO 4: Visitantes e Conversão
├─ Total Visitors (R) = 500 + 1.200 = 1.700
├─ Sessions (S) = 1.700 × 2 = 3.400
└─ New Orders (U) = 1.700 × 0.05 = 85

PASSO 5: Receita
├─ Ticket (AA) = 100
├─ Total Sales (AB) = 100 × 85 = 8.500
└─ ROI (Y) = (8.500 - 5.000) / 5.000 = 70%

PASSO 6: Métricas Avançadas
├─ CAC (AE) = 5.000 / 85 = 58,82
├─ COGS (AG) = (8.500/85) × 0.48 = 48
├─ LTV (AM) = calculado com base em AOV × Frequência × Lifespan
└─ LTV/CAC (AP) = relação de viabilidade
```

---

## 🚨 ATENÇÃO: Estimativas que Precisam Validação

Estes multiplicadores são **ESTIMATIVAS GENÉRICAS**. Você deve:

1. ✅ **Validar com dados reais** do mercado brasileiro
2. ✅ **Ajustar por setor** (e-commerce, serviços, B2B, etc)
3. ✅ **Diferenciar por plataforma** (Google Ads vs Meta Ads)
4. ✅ **Considerar sazonalidade** (Black Friday, Natal, etc)
5. ✅ **Atualizar periodicamente** conforme dados dos clientes

---

## 💡 PRÓXIMOS PASSOS RECOMENDADOS

1. Criar arquivo de configuração em JavaScript com estas constantes
2. Permitir ajuste manual de multiplicadores no SaaS
3. Implementar diferentes "perfis" de mercado (e-commerce, serviços, etc)
4. Coletar dados reais dos usuários para refinar estimativas
