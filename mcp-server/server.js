#!/usr/bin/env node
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';

async function fetchStockData(ticker) {
  const headers = {
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
    'Accept': 'application/json',
    'Accept-Language': 'en-US,en;q=0.9',
  };

  const url = `https://query1.finance.yahoo.com/v10/finance/quoteSummary/${ticker}?modules=price,defaultKeyStatistics,incomeStatementHistory,cashflowStatementHistory,balanceSheetHistory`;
  const res = await fetch(url, { headers });

  if (!res.ok) throw new Error(`HTTP ${res.status} from Yahoo Finance`);

  const json = await res.json();
  if (json.quoteSummary?.error) throw new Error(json.quoteSummary.error.description);

  const r = json.quoteSummary.result[0];
  const price = r.price;
  const stats = r.defaultKeyStatistics;
  const income = r.incomeStatementHistory?.incomeStatementHistory[0];
  const cf = r.cashflowStatementHistory?.cashflowStatements[0];
  const bs = r.balanceSheetHistory?.balanceSheetStatements[0];

  const operatingCF = cf?.totalCashFromOperatingActivities?.raw ?? null;
  const capex = cf?.capitalExpenditures?.raw ?? null; // Yahoo returns negative

  return {
    ticker: ticker.toUpperCase(),
    companyName: price.longName || price.shortName || ticker,
    currentPrice: price.regularMarketPrice?.raw ?? null,
    marketCap: price.marketCap?.raw ?? null,
    enterpriseValue: stats.enterpriseValue?.raw ?? null,
    beta: stats.beta?.raw ?? null,
    totalRevenue: income?.totalRevenue?.raw ?? null,
    ebit: income?.ebit?.raw ?? null,
    operatingCF,
    capex,
    fcf: operatingCF != null && capex != null ? operatingCF + capex : null, // capex is negative
    totalDebt: bs?.longTermDebt?.raw ?? 0,
    cash: bs?.cash?.raw ?? 0,
    netDebt: (bs?.longTermDebt?.raw ?? 0) - (bs?.cash?.raw ?? 0),
  };
}

function fmt(value) {
  if (value == null) return 'N/A';
  const abs = Math.abs(value);
  const sign = value < 0 ? '-' : '';
  if (abs >= 1e12) return `${sign}$${(abs / 1e12).toFixed(2)}T`;
  if (abs >= 1e9) return `${sign}$${(abs / 1e9).toFixed(2)}B`;
  if (abs >= 1e6) return `${sign}$${(abs / 1e6).toFixed(2)}M`;
  return `${sign}$${abs.toFixed(2)}`;
}

function buildDataBlock(d) {
  const evRevenue = d.enterpriseValue && d.totalRevenue
    ? (d.enterpriseValue / d.totalRevenue).toFixed(1) + 'x'
    : 'N/A';
  const fcfYield = d.fcf && d.marketCap
    ? (d.fcf / d.marketCap * 100).toFixed(1) + '%'
    : 'N/A';

  return `## Live Data — ${d.companyName} (${d.ticker})

| Metric | Value |
|---|---|
| Current Price | ${fmt(d.currentPrice)} |
| Market Cap | ${fmt(d.marketCap)} |
| Enterprise Value | ${fmt(d.enterpriseValue)} |
| LTM Revenue | ${fmt(d.totalRevenue)} |
| Operating Cash Flow | ${fmt(d.operatingCF)} |
| CapEx | ${fmt(d.capex)} |
| LTM FCF | ${fmt(d.fcf)} |
| Net Debt | ${fmt(d.netDebt)} |
| EV / Revenue | ${evRevenue} |
| FCF Yield | ${fcfYield} |
| Beta | ${d.beta?.toFixed(2) ?? 'N/A'} |`;
}

const server = new Server(
  { name: 'rdcf-engine', version: '1.0.0' },
  { capabilities: { tools: {} } }
);

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    {
      name: 'run_rdcf',
      description: 'Full 14-section institutional reverse DCF analysis on a stock. Back-solves from current EV to implied revenue CAGR, FCF margin, and WACC. Produces a complete IC memo.',
      inputSchema: {
        type: 'object',
        properties: {
          ticker: { type: 'string', description: 'Stock ticker symbol, e.g. AAPL' },
        },
        required: ['ticker'],
      },
    },
    {
      name: 'run_rdcf_quick',
      description: 'Fast 3-section reverse DCF screening snapshot. Implied assumptions vs. history, a 5×5 sensitivity table, and a one-paragraph verdict.',
      inputSchema: {
        type: 'object',
        properties: {
          ticker: { type: 'string', description: 'Stock ticker symbol, e.g. AAPL' },
        },
        required: ['ticker'],
      },
    },
  ],
}));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;
  const ticker = (args.ticker || '').toUpperCase().trim();

  if (!ticker) {
    return { content: [{ type: 'text', text: 'Please provide a ticker symbol.' }], isError: true };
  }

  let d;
  try {
    d = await fetchStockData(ticker);
  } catch (err) {
    return {
      content: [{ type: 'text', text: `Could not fetch data for ${ticker}: ${err.message}` }],
      isError: true,
    };
  }

  const dataBlock = buildDataBlock(d);

  if (name === 'run_rdcf') {
    return {
      content: [{
        type: 'text',
        text: `${dataBlock}

---

Using the live data above, perform a full 14-section institutional reverse DCF analysis for ${d.ticker}. Supplement with web search for 3–5 year historical financials, management guidance, and sell-side consensus.

Execute every section:

1. **Company Snapshot & Market Pricing** — EV anchoring, capital structure, float
2. **Historical Financial Foundation** — 3-year revenue/FCF/margin trends
3. **WACC Derivation** — Bottom-up CAPM: Rf (~4.5%), ERP (~5%), β=${d.beta?.toFixed(2) ?? 'estimate'}, size/company-specific premium, after-tax Kd
4. **Terminal Value Assumptions** — Bear/base/bull terminal growth rate and FCF margin
5. **Core Reverse DCF** — Fix EV at ${fmt(d.enterpriseValue)}. Solve for implied 10-year revenue CAGR and terminal FCF margin. 3-stage model (high growth → fade → terminal).
6. **Sensitivity Matrices** — Three 5×5 tables: (a) implied price vs. CAGR/WACC, (b) implied price vs. terminal margin/growth, (c) feasibility frontier
7. **Scenario Analysis** — Bear/base/bull with full assumption sets and narrative
8. **Comparables Benchmark** — 5 sector peers: EV/Revenue, EV/EBITDA, FCF yield, NTM P/E
9. **Implied vs. Consensus Cross-Check** — Gap between implied and sell-side NTM/FY+2 estimates
10. **FCF Quality Assessment** — Conversion, SBC%, CapEx intensity, working capital, accruals ratio
11. **ROIC Bridge** — Sustainable growth = ROIC × Reinvestment Rate vs. implied CAGR
12. **Variant Perception** — Where the market misprices this and why
13. **Conviction & Risk Framework** — Probability-weighted expected value, risk table, key catalysts
14. **One-Page IC Memo** — Rating, price target, market narrative, variant view, position sizing

FCF = UFCF: NOPAT + D&A − CapEx − ΔNWC − SBC. Terminal value via Gordon Growth Model; cross-check with EV/EBITDA exit. Be precise, quantitative, and form a clear investment recommendation.`,
      }],
    };
  }

  if (name === 'run_rdcf_quick') {
    return {
      content: [{
        type: 'text',
        text: `${dataBlock}

---

Using the live data above, perform a fast 3-section reverse DCF screening snapshot for ${d.ticker}:

**SECTION 1 — Market Pricing Snapshot**
Present the metrics above in a clean table. Calculate and add: EV/EBITDA (search for LTM EBITDA), NTM P/E if available.

**SECTION 2 — Implied Assumptions**
Using a simplified 10-year 3-stage DCF with CAPM WACC (β=${d.beta?.toFixed(2) ?? 'estimate'}, Rf≈4.5%, ERP≈5%), fix EV at ${fmt(d.enterpriseValue)} and solve for:
- Implied 10-year revenue CAGR (hold FCF margin and WACC at base estimates)
- Implied terminal FCF margin (hold growth and WACC)
- Implied WACC (hold growth and margins)

Compare each to company's 3-year historical average and sector best-in-class. Rate each: **Achievable / Aggressive / Heroic**.

Produce a 5×5 sensitivity table: implied share price vs. Revenue CAGR (rows) × WACC (columns).

**SECTION 3 — Quick Verdict**
One structured paragraph: what the current price demands to be true, whether those assumptions are realistic given history and peers, the single biggest risk, and a one-line recommendation: **Worth deeper digging / Fairly priced / Avoid at current levels**.`,
      }],
    };
  }

  return { content: [{ type: 'text', text: `Unknown tool: ${name}` }], isError: true };
});

const transport = new StdioServerTransport();
await server.connect(transport);
