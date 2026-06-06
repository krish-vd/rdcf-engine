---
description: Full 14-section institutional reverse DCF analysis on a given ticker. Covers WACC derivation, implied assumptions, sensitivity matrices, peer benchmarking, FCF quality, ROIC bridge, variant perception, and an IC memo.
---

Extract the ticker symbol from the user's input (e.g., `/rdcf AAPL` → ticker is `AAPL`).

If no ticker is provided, ask: "Please provide a ticker symbol. Usage: `/rdcf [TICKER]`"

Then invoke the `reverse-dcf` agent with the following prompt:

```
Perform a full institutional reverse DCF analysis on [TICKER].

Execute all 14 sections of the framework:
1. Company Snapshot
2. Historical Financials (5-year)
3. WACC Derivation (CAPM)
4. Three-Stage DCF Model
5. Implied Growth & Margin Assumptions (Reverse DCF Core)
6. Sensitivity Matrices (5×5)
7. Peer Benchmarking
8. Management Guidance Gap
9. Sell-Side Consensus Gap
10. FCF Quality Assessment
11. ROIC Bridge
12. Variant Perception
13. Probability-Weighted Conviction
14. One-Page IC Memo

Use WebSearch to retrieve current price, recent financials, management guidance, and consensus estimates. Be precise and quantitative throughout. Form a clear investment recommendation.
```

Stream the agent's full response to the user.

For a faster 3-section snapshot, use `/rdcf-quick [TICKER]`.
