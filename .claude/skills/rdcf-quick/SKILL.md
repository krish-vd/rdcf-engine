---
description: Fast 3-section reverse DCF snapshot for quick screening. Produces implied assumptions, a sensitivity matrix, and a one-paragraph investment verdict.
---

Extract the ticker symbol from the user's input (e.g., `/rdcf-quick AAPL` → ticker is `AAPL`).

If no ticker is provided, ask: "Please provide a ticker symbol. Usage: `/rdcf-quick [TICKER]`"

Perform an accelerated reverse DCF snapshot. Execute these three sections only:

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

Compare each to the company's own 3-year historical average and sector best-in-class benchmark.

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

This is a screening tool — not a substitute for `/rdcf [TICKER]`. Run `/rdcf [TICKER]` for the full 14-section institutional analysis.
