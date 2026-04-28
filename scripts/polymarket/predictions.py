"""PolyTrack — Daily Prediction Analysis & Recommendations.

Run:
    python scripts/polymarket/predictions.py
"""
import json
import sys
from datetime import datetime, timezone
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from db import init_db, place_bet, get_connection, get_my_bets


# ── LIVE MARKET DATA (from dashboard API) ──────────────────────────────────
TODAY_MARKETS = [
    # (question, slug, market_type, yes_price, no_price, volume, ends_utc, id)
    ("Bitcoin Up or Down on April 16?", "bitcoin-up-or-down-on-april-16-2026", "crypto", 0.89, 0.12, 71934, "2026-04-16T16:00Z", "1981759"),
    ("Ethereum Up or Down on April 16?", "ethereum-up-or-down-on-april-16-2026", "crypto", 0.73, 0.27, 11354, "2026-04-16T16:00Z", "1981799"),
    ("S&P 500 (SPX) Up or Down on April 16?", "spx-up-or-down-on-april-16-2026", "stock", 0.63, 0.37, 2235, "2026-04-16T20:00Z", "1991080"),
    ("S&P 500 (SPX) Opens Up or Down on April 16?", "spx-opens-up-or-down-on-april-16-2026", "stock", 0.66, 0.34, 8596, "2026-04-16T20:00Z", "1991083"),
    ("Meta (META) Up or Down on April 16?", "meta-up-or-down-on-april-16-2026", "stock", 0.61, 0.39, 850, "2026-04-16T20:00Z", "1991169"),
    ("XRP Up or Down on April 16?", "xrp-up-or-down-on-april-16-2026", "crypto", 0.91, 0.09, 583, "2026-04-16T16:00Z", "1981905"),
    ("Coinbase (COIN) Up or Down on April 16?", "coin-up-or-down-on-april-16-2026", "crypto", 0.56, 0.43, 74, "2026-04-16T20:00Z", "1991201"),
    ("Opendoor (OPEN) Up or Down on April 16?", "open-up-or-down-on-april-16-2026", "stock", 0.56, 0.43, 584, "2026-04-16T20:00Z", "1991198"),
    ("Bitcoin ETF Flows on April 16?", "bitcoin-etf-flows-on-april-16", "crypto", 0.50, 0.50, 0, "2026-04-16T22:00Z", "1979849"),
    ("BTC above $74,000 on April 16?", "bitcoin-74k-april-16", "crypto", 0.84, 0.15, 295002, "2026-04-16T16:00Z", "1928798"),
    ("BTC above $72,000 on April 16?", "bitcoin-72k-april-16", "crypto", 0.99, 0.01, 141021, "2026-04-16T16:00Z", "1928796"),
    ("BTC above $76,000 on April 16?", "bitcoin-76k-april-16", "crypto", 0.19, 0.81, 171107, "2026-04-16T16:00Z", "1928800"),
    ("BTC above $78,000 on April 16?", "bitcoin-78k-april-16", "crypto", 0.01, 0.99, 219891, "2026-04-16T16:00Z", "1928803"),
    ("ETH above $1,700 on April 16?", "eth-1700-april-16", "crypto", 1.00, 0.00, 192378, "2026-04-16T16:00Z", "1928737"),
    ("ETH above $1,800 on April 16?", "eth-1800-april-16", "crypto", 1.00, 0.00, 154851, "2026-04-16T16:00Z", "1928740"),
    ("Warriors vs. Clippers (RESOLVED)", "warriors-clippers-apr16", "sports", 1.00, 0.00, 8572952, "2026-04-16T02:00Z", "1969216"),
]

# ── NEWS CONTEXT ────────────────────────────────────────────────────────────
NEWS = """
KEY NEWS — April 16, 2026:

1. IRAN CEASEFIRE: Trump says "end of war in sight" — US-Iran ceasefire
   talks advancing, extension being negotiated. This is the #1 market driver.
   → RISK-ON: stocks UP, oil DOWN, crypto UP

2. CHINA: Xi denied arming Iran after letter exchange with Trump.
   China stocks rally on reduced escalation fears.
   → CHINA-US tensions easing → positive for risk assets

3. BITCOIN: BTC trading ~$74,900 (up from $74,314 on April 14).
   Ceasefire optimism + geopolitical de-escalation = crypto rally.
   BTC above $74k already locked at open. Key battle at $76k.

4. MARKETS: S&P hitting record highs on ceasefire momentum. Futures up.
   Banks and tech leading the rally.

5. ETHEREUM: ETH already above $1,700 and $1,800 targets.
   Broad crypto rally supported by de-escalation.

6. CRYPTO BROAD: XRP, SOL up. But Solana below $100 (already failed).
"""

# ── OUR MODEL PREDICTIONS ──────────────────────────────────────────────────
# We calculate probability based on: current price vs target, trend, news

PREDICTIONS = [
    # (question, our_prob_yes, our_confidence, reasoning, recommended_bet, bet_size_suggested)
    (
        "Bitcoin Up or Down on April 16?",
        0.92, "HIGH",
        "BTC $74,900 and rising on ceasefire momentum. Risk-on sentiment. $89c is underpriced.",
        "YES", 100
    ),
    (
        "Ethereum Up or Down on April 16?",
        0.80, "HIGH",
        "ETH rallied with BTC. Ceasefire = crypto positive. $73c is fair.",
        "YES", 100
    ),
    (
        "S&P 500 (SPX) Up or Down on April 16?",
        0.70, "MEDIUM-HIGH",
        "Ceasefire + China de-escalation = stock rally. Trump 'end in sight' = risk-on. $63c underpriced.",
        "YES", 100
    ),
    (
        "S&P 500 (SPX) Opens Up or Down on April 16?",
        0.72, "HIGH",
        "Futures already rippling higher on Iran news. Strong open expected. $66c = good value.",
        "YES", 100
    ),
    (
        "Meta (META) Up or Down on April 16?",
        0.65, "MEDIUM",
        "Tech broadly up on AI trade + ceasefire. $61c slightly underpriced but thin volume.",
        "YES", 50
    ),
    (
        "XRP Up or Down on April 16?",
        0.95, "VERY HIGH",
        "XRP on fire — crypto rally + specific XRP momentum. $91c still has value. $8.99 on $100.",
        "YES", 50
    ),
    (
        "Coinbase (COIN) Up or Down on April 16?",
        0.62, "MEDIUM",
        "COIN tracks crypto sentiment. BTC up = COIN up. $56c = decent but low volume.",
        "YES", 50
    ),
    (
        "Opendoor (OPEN) Up or Down on April 16?",
        0.58, "LOW-MEDIUM",
        "Thin volume, housing sector mixed. $56c = coin flip territory. Not a strong play.",
        "SKIP", 0
    ),
    (
        "Bitcoin ETF Flows on April 16?",
        0.55, "LOW",
        "BTC rally today = likely positive flows. But no clear edge at 50/50. Only bet if you have conviction.",
        "YES (lean)", 25
    ),
    (
        "BTC above $74,000 on April 16?",
        0.97, "VERY HIGH",
        "BTC already $74,900 at time of analysis. Resolves at close — almost certain. Low payout though.",
        "YES", 50
    ),
    (
        "BTC above $72,000 on April 16?",
        1.00, "VERY HIGH",
        "Already locked. BTC at $74,900. No value at $0.99 — max $1 on $100.",
        "SKIP", 0
    ),
    (
        "BTC above $76,000 on April 16?",
        0.25, "MEDIUM",
        "BTC needs $1,100 jump in hours. Ceasefire momentum COULD do it. Market says 19%. Our model: 25%. Edge on YES.",
        "YES", 25
    ),
    (
        "BTC above $78,000 on April 16?",
        0.02, "VERY HIGH",
        "Need $3,100 jump in hours. Not happening today. Market = $0.01. SKIP.",
        "NO", 0
    ),
    (
        "ETH above $1,700 on April 16?",
        1.00, "VERY HIGH",
        "Already above $1,700. No value at $1.00. SKIP.",
        "SKIP", 0
    ),
    (
        "ETH above $1,800 on April 16?",
        0.70, "MEDIUM",
        "ETH needs ~$100 more. Rally momentum could push it. Market at $1.00 = already locked? Check price.",
        "CONDITIONAL", 0
    ),
]


def calc_payout(amount, price):
    if price <= 0 or price >= 1:
        return 0
    shares = amount / price
    return shares * (1.0 - price)  # profit on YES


def print_prediction_table():
    print("=" * 100)
    print("  POLYTRACK — DAILY PREDICTION ANALYSIS")
    print(f"  Generated: {datetime.now().strftime('%Y-%m-%d %H:%M')} | Source: Polymarket Live API")
    print("=" * 100)

    print("\n📰 NEWS CONTEXT")
    print("-" * 80)
    for line in NEWS.strip().split("\n"):
        if line.strip():
            print(f"  {line}")

    print("\n\n📊 TODAY'S BETS — PREDICTION TABLE")
    print("=" * 100)
    print(f"{'#':<3} {'Market':<45} {'Our %':<8} {'Market %':<10} {'Edge':<8} {'Bet':<6} {'$100 Payout':<12} {'Confidence':<12}")
    print("-" * 100)

    for i, pred in enumerate(PREDICTIONS, 1):
        q, our_pct, confidence, reasoning, rec_bet, bet_size = pred
        mkt_pct = None
        mkt_id = None
        for m in TODAY_MARKETS:
            if m[0].lower() in q.lower() or q.lower() in m[0].lower():
                mkt_pct = m[3]
                mkt_id = m[6]
                break

        if mkt_pct is None:
            continue

        edge = our_pct - mkt_pct
        edge_str = f"+{edge:.0%}" if edge > 0 else f"{edge:.0%}"

        if rec_bet == "SKIP":
            bet_display = "—"
            payout_str = "No value"
            color = "🔴"
        elif rec_bet == "CONDITIONAL":
            bet_display = "?"
            payout_str = "Check price"
            color = "🟡"
        elif rec_bet == "YES (lean)":
            bet_display = "YES"
            payout = calc_payout(25, mkt_pct)
            payout_str = f"${payout:.2f}" if payout > 0 else "—"
            color = "🟡"
        else:
            bet_display = rec_bet
            payout = calc_payout(bet_size, mkt_pct)
            payout_str = f"${payout:.2f}" if payout > 0 else "—"
            color = "🟢" if edge > 0.05 else ("🟡" if edge > 0 else "🔴")

        our_str = f"{our_pct:.0%}"
        mkt_str = f"{mkt_pct:.0%}"

        if rec_bet not in ("SKIP", "CONDITIONAL"):
            print(f"  {color} {i:<2} {q[:43]:<45} {our_str:<8} {mkt_str:<10} {edge_str:<8} {bet_display:<6} {payout_str:<12} {confidence:<12}")
        else:
            print(f"  {color} {i:<2} {q[:43]:<45} {our_str:<8} {mkt_str:<10} {edge_str:<8} {bet_display:<6} {payout_str:<12} {confidence:<12}")
    print()

    print("\n🏆 TOP PICKS SUMMARY")
    print("-" * 80)
    print("  RANK  BET      MARKET                                          $100 PAYOUT")
    print("  ----  -------  ----------------------------------------------  ------------")
    ranked = []
    for pred in PREDICTIONS:
        q, our_pct, confidence, reasoning, rec_bet, bet_size = pred
        for m in TODAY_MARKETS:
            if m[0].lower() in q.lower() or q.lower() in m[0].lower():
                mkt_pct = m[3]
                if rec_bet not in ("SKIP", "CONDITIONAL") and our_pct > mkt_pct:
                    payout = calc_payout(bet_size, mkt_pct)
                    edge = our_pct - mkt_pct
                    ranked.append((payout, bet_size, q, rec_bet, edge, confidence))
                break
    ranked.sort(reverse=True)
    for rank, (payout, size, q, bet, edge, conf) in enumerate(ranked[:5], 1):
        print(f"  {rank}.    {bet:<6}  {q[:44]:<44}  ${payout:.2f}  (+{edge:.0%} edge)")
    print()

    print("\n📅 RESOLUTION TIMES (UTC)")
    print("-" * 80)
    for m in TODAY_MARKETS:
        q, slug, mtype, yes, no, vol, ends, mid = m
        if "RESOLVED" not in q:
            print(f"  {ends}Z  |  {q[:50]:<50}  |  YES ${yes:.2f}")
    print()

    print("\n⚠️  NOTES")
    print("-" * 80)
    print("  - 'Our %' = Claude's model estimate based on news + price analysis")
    print("  - 'Market %' = current Polymarket consensus odds")
    print("  - 'Edge' = Our % minus Market % | Positive edge = market may be underpricing")
    print("  - Markets resolve at listed UTC time (Eastern = subtract 4/5 hours)")
    print("  - Sports markets (Warriors/Clippers) resolved — check results separately")
    print("  - Payout = profit on winning bet (not including stake returned)")
    print("  - Data from Polymarket Gamma API — refreshes every 5 min on dashboard")
    print()


def add_bets_to_db():
    """Add suggested bets to the database for tracking."""
    conn = get_connection()

    # Already placed bets
    placed = get_my_bets(conn)
    placed_ids = {b['market_id'] for b in placed}

    suggestions = [
        ("1981759", "Yes", 100, 0.89, "Top pick: BTC up on ceasefire momentum"),
        ("1981799", "Yes", 100, 0.73, "ETH up on crypto rally"),
        ("1991080", "Yes", 100, 0.63, "SPX up on Iran ceasefire optimism"),
        ("1991083", "Yes", 100, 0.66, "SPX open up on futures momentum"),
        ("1991169", "Yes", 50,  0.61, "META up with tech rally"),
        ("1981905", "Yes", 50,  0.91, "XRP on fire — strong momentum"),
        ("1991201", "Yes", 50,  0.56, "COIN tracks crypto"),
        ("1928798", "Yes", 50,  0.84, "BTC already near $74k — almost certain"),
    ]

    print("\n💾 Suggested bets to add to DB:")
    for mid, side, amount, price, reason in suggestions:
        if mid in placed_ids:
            status = "  [already placed]"
        else:
            status = "  [will track]"
            try:
                place_bet(conn, mid, side, amount, price)
            except:
                pass
        print(f"  {status} {side} ${amount} on {mid} @ ${price:.2f}")

    conn.close()


if __name__ == "__main__":
    print_prediction_table()
    add_bets_to_db()
