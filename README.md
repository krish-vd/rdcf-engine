# Reverse DCF Analyst — Claude Plugin

An institutional-grade reverse DCF plugin for Claude Code. Back-solves from the current stock price to the implied operating assumptions baked in, stress-tests them against company history, peers, and consensus, and produces a probability-weighted investment memo.

---

## Commands

| Command | Description |
|---|---|
| `/rdcf [TICKER]` | Full 14-section institutional analysis |
| `/rdcf-quick [TICKER]` | Fast 3-section screening snapshot |

### Examples

```
/rdcf NVDA
/rdcf-quick MSFT
/rdcf TSLA
/rdcf-quick META
```

---

## What It Produces

### `/rdcf [TICKER]` — Full Analysis (14 Sections)

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

### `/rdcf-quick [TICKER]` — Snapshot (3 Sections)

1. Market pricing snapshot (EV, FCF yield, trading multiples)
2. Implied assumptions vs. history with achievability verdict
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

## Installation

1. Clone or copy this repository into your Claude Project directory:

```bash
git clone https://github.com/krish-vd/rdcf-engine ~/Documents/Claude\ Project
```

2. Open Claude Code in the project directory:

```bash
cd ~/Documents/Claude\ Project
claude
```

3. Run your first analysis:

```
/rdcf AAPL
```

---

## File Structure

```
Claude Project/
├── agents/
│   └── reverse-dcf.md       # Agent definition + full system prompt
├── skills/
│   ├── rdcf-run.md          # /rdcf command handler
│   └── rdcf-quick.md        # /rdcf-quick command handler
├── .claude-plugin/
│   └── plugin.json          # Plugin manifest
└── README.md
```

---

## Requirements

- Claude Code (CLI)
- Model: `claude-sonnet-4-6` or later
- Tools enabled: `WebSearch`, `Read`

---

## Author

**Krish Desai**

---

*Methodology: Reverse DCF | Framework: UFCF, Gordon Growth Terminal Value, CAPM WACC | Version: 1.0.0*
