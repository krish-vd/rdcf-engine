---
name: rdcf-run
description: Runs a full institutional reverse DCF analysis on a given ticker symbol. Triggers the reverse-dcf agent to produce a comprehensive 14-section report including WACC derivation, implied assumptions, sensitivity matrices, peer benchmarking, FCF quality, ROIC bridge, variant perception, and an IC memo.
command: rdcf
---

When the user types `/rdcf [TICKER]`, invoke the `reverse-dcf` agent on the provided ticker symbol.

## Behavior

1. Extract the ticker symbol from the user's input (e.g., `/rdcf AAPL` → ticker is `AAPL`)
2. If no ticker is provided, ask: "Please provide a ticker symbol. Usage: `/rdcf [TICKER]`"
3. Invoke the `reverse-dcf` agent with the following prompt:

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

4. Stream the agent's full response to the user.

## Usage

```
/rdcf TSLA
/rdcf MSFT
/rdcf NVDA
/rdcf META
```

## Notes

- Full analysis typically covers 14 sections and may be lengthy — this is by design
- For a faster 3-section snapshot, use `/rdcf-quick [TICKER]`
- The agent will flag which data was sourced live vs. estimated
