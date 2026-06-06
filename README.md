# RDCF Engine

Institutional-grade reverse DCF analyst. Back-solves from the current stock price to the implied operating assumptions baked in, stress-tests them against company history, peers, and consensus, and produces a probability-weighted investment memo.

Works in two ways:
- **Claude Desktop** — chat naturally, no terminal needed
- **Claude Code CLI** — slash commands `/rdcf` and `/rdcf-quick`

---

## Option A — Claude Desktop (recommended for most users)

No terminal required. Just chat with Claude Desktop after a one-time setup.

### 1. Clone the repo and install dependencies

```bash
git clone https://github.com/krish-vd/rdcf-engine
cd rdcf-engine/mcp-server
npm install
```

### 2. Add to Claude Desktop config

Open this file (create it if it doesn't exist):

- **Mac:** `~/Library/Application Support/Claude/claude_desktop_config.json`
- **Windows:** `%APPDATA%\Claude\claude_desktop_config.json`

Add the `mcpServers` block (replace the path with wherever you cloned the repo):

```json
{
  "mcpServers": {
    "rdcf-engine": {
      "command": "node",
      "args": ["/absolute/path/to/rdcf-engine/mcp-server/server.js"]
    }
  }
}
```

**Mac example:**
```json
{
  "mcpServers": {
    "rdcf-engine": {
      "command": "node",
      "args": ["/Users/YOUR_USERNAME/rdcf-engine/mcp-server/server.js"]
    }
  }
}
```

### 3. Restart Claude Desktop

Fully quit and reopen. Then just ask:

> "Run a reverse DCF on AAPL"

> "Quick DCF check on NVDA"

> "Analyze MSFT using reverse DCF"

Claude fetches live financial data automatically and produces the full analysis.

---

## Option B — Claude Code CLI

For users who prefer the terminal.

```bash
git clone https://github.com/krish-vd/rdcf-engine ~/Documents/Claude\ Project
cd ~/Documents/Claude\ Project
claude
```

Then use slash commands:

| Command | Description |
|---|---|
| `/rdcf [TICKER]` | Full 14-section institutional analysis |
| `/rdcf-quick [TICKER]` | Fast 3-section screening snapshot |

```
/rdcf NVDA
/rdcf-quick MSFT
/rdcf TSLA
/rdcf-quick META
```

---

## What It Produces

### Full Analysis — 14 Sections

1. **Company Snapshot & Market Pricing** — EV anchoring, capital structure confirmation
2. **Historical Financial Foundation** — 3-year P&L, FCF, margin trend
3. **WACC Derivation** — Bottom-up CAPM: Rf, ERP, beta, size premium, after-tax Kd
4. **Terminal Value Assumptions** — Bear/base/bull terminal growth and margin
5. **Core Reverse DCF** — Solves for implied revenue CAGR and FCF margin at current EV
6. **Sensitivity Matrices** — Three 5×5 tables: price vs. CAGR/WACC, margin/g, feasibility frontier
7. **Scenario Analysis** — Bear/base/bull with full assumption sets and narratives
8. **Comparables Benchmark** — 5 peers: EV/Revenue, EV/EBITDA, FCF yield, NTM P/E
9. **Implied vs. Consensus Cross-Check** — Gap vs. sell-side NTM and FY+2 estimates
10. **FCF Quality Assessment** — Conversion, SBC, CapEx intensity, working capital, accruals
11. **ROIC Bridge** — Sustainable growth = ROIC × Reinvestment Rate consistency check
12. **Variant Perception** — Where the market has it wrong and why
13. **Conviction & Risk Framework** — Probability-weighted expected value, risk table, catalysts
14. **One-Page IC Memo** — Rating, price target, market-implied narrative, variant view, sizing

### Quick Snapshot — 3 Sections

1. Market pricing snapshot (EV, FCF yield, trading multiples)
2. Implied assumptions vs. history with achievability verdict (Achievable / Aggressive / Heroic)
3. Quick verdict and screening recommendation

---

## Methodology

**Framework:** Reverse DCF — fix the enterprise value, solve backward for operating assumptions

**FCF Definition:** Unlevered Free Cash Flow (UFCF) = NOPAT + D&A − CapEx − ΔNWC − SBC

**Discount Rate:** WACC via CAPM (bottom-up, not assumed)

**Terminal Value:** Gordon Growth Model primary; EV/EBITDA exit multiple as cross-check

**Assumption Benchmarking:** Each implied metric rated Achievable / Aggressive / Heroic vs. company history, sector peers, and sell-side consensus

**Output:** Suitable for distribution to a portfolio manager or investment committee

---

## Requirements

- **Claude Desktop** path: Node.js 18+, Claude Desktop app
- **Claude Code** path: Claude Code CLI, model `claude-sonnet-4-6` or later

---

## File Structure

```
rdcf-engine/
├── .claude/
│   ├── agents/
│   │   └── reverse-dcf.md        # Agent definition + full system prompt
│   └── skills/
│       ├── rdcf/
│       │   └── SKILL.md          # /rdcf command (Claude Code)
│       └── rdcf-quick/
│           └── SKILL.md          # /rdcf-quick command (Claude Code)
├── mcp-server/
│   ├── server.js                 # MCP server (Claude Desktop)
│   └── package.json
└── README.md
```

---

## Author

**Krish Desai** — [github.com/krish-vd](https://github.com/krish-vd)

---

*Methodology: Reverse DCF | Framework: UFCF, Gordon Growth Terminal Value, CAPM WACC | Version: 1.0.0*
