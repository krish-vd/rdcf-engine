---
name: rdcf-quick
description: Fast 3-section reverse DCF snapshot for a given ticker. Produces implied assumptions, a single sensitivity matrix, and a one-paragraph investment verdict — suitable for quick screening before committing to a full /rdcf analysis.
command: rdcf-quick
---

When the user types `/rdcf-quick [TICKER]`, perform an accelerated reverse DCF snapshot on the provided ticker.

## Behavior

1. Extract the ticker symbol from the user's input (e.g., `/rdcf-quick AAPL` → ticker is `AAPL`)
2. If no ticker is provided, ask: "Please provide a ticker symbol. Usage: `/rdcf-quick [TICKER]`"
3. Execute the following three sections only — be fast, direct, and quantitative:

---

### SECTION 1 — Market Pricing Snapshot

Use WebSearch to retrieve the current share price, market cap, net debt, and enterprise value. Pull the most recent fiscal year revenue and FCF.

Present as:

| Field | Value |
|---|---|
| Current Price | `$X` |
| Market Cap | `$XB` |
| Enterprise Value | `$XB` |
| LTM Revenue | `$XB` |
| LTM FCF | `$XB` |
| EV/Revenue | `Xx` |
| FCF Yield | `X%` |

---

### SECTION 2 — Implied Assumptions (Reverse DCF Core)

Using a simplified 10-year 3-stage DCF with a base-case WACC derived from CAPM, solve for:

- **Implied 10-year Revenue CAGR** (holding FCF margin and WACC constant at reasonable base)
- **Implied Terminal FCF Margin** (holding growth and WACC constant)
- **Implied WACC** (holding growth and margins constant)

Compare each to:
- Company's own 3-year historical average
- Sector best-in-class benchmark

State verdict for each: **Achievable / Aggressive / Heroic**

Then produce a single 5×5 sensitivity table — implied share price vs. Revenue CAGR × WACC.

---

### SECTION 3 — Quick Verdict

Write a single structured paragraph covering:
- What the current price demands to be true
- Whether those assumptions are realistic given history and peers
- The single biggest risk to the implied scenario
- A one-line recommendation: **Worth deeper digging / Fairly priced / Avoid at current levels**

---

## Usage

```
/rdcf-quick AAPL
/rdcf-quick AMZN
/rdcf-quick GOOGL
```

## Notes

- This is a screening tool — not a substitute for `/rdcf [TICKER]`
- Run `/rdcf [TICKER]` for the full 14-section institutional analysis
- Assumptions are clearly flagged as estimates; treat output as directional, not definitive
