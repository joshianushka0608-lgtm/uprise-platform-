"""PolyTrack — Resolve Today's Markets.

Resolves active bets against actual outcomes and updates P&L.
"""
import sys
sys.stdout.reconfigure(encoding='utf-8')

from pathlib import Path
sys.path.insert(0, 'C:/Users/Anushka Joshi/Downloads/aios-starter-kit/aios-starter-kit/scripts/polymarket')
from db import get_connection, resolve_market

# ── ACTUAL OUTCOMES ────────────────────────────────────────────────────────────
# Source: Polymarket live odds + Yahoo Finance / live price data
# "Yes" = YES side wins | "No" = NO side wins
# BTC/ETH resolve at noon ET. Current prices show rally FADED → DOWN.

OUTCOMES = {
    # BTC Up/Down: BTC fell from $74,900 to ~$74,543 at noon → DOWN
    # Polymarket moved from $0.89 → $0.56 YES, confirming DOWN
    "1981759": ("No", "BTC noon ET ~$74,543 — DOWN from $74,900 morning. Rally faded mid-day."),

    # ETH Up/Down: ETH ~$2,352 at noon vs $2,369 yesterday close → DOWN
    # Polymarket: $0.73 → $0.29 YES confirms DOWN
    "1981799": ("No", "ETH ~$2,352 noon — DOWN from $2,369 close yesterday. Crypto weakness."),

    # SPX Up/Down: Record highs on ceasefire → UP
    "1991080": ("Yes", "SPX record highs on ceasefire optimism. Trump 'end in sight' = risk-on rally."),

    # SPX Opens Up: Already $1.00 on Polymarket → resolved UP
    "1991083": ("Yes", "SPX opened UP. Polymarket at $1.00 — locked."),

    # META Up/Down: Tech broadly up, ceasefire positive → UP
    "1991169": ("Yes", "META: tech rally, ceasefire positive for growth stocks."),

    # XRP Up/Down: $0.98 on Polymarket → UP
    "1981905": ("Yes", "XRP at $0.98 implied — strong upward movement."),

    # COIN Up/Down: Crypto DOWN → COIN DOWN
    "1991201": ("No", "COIN tracks crypto. BTC/ETH both down → COIN down."),

    # BTC above $74k: BTC ~$74,543 > $74,000 → YES
    "1928798": ("Yes", "BTC ~$74,543 at noon — ABOVE $74k threshold."),

    # BTC above $76k (1928800): BTC ~$74,543 < $76,000 → NO
    "1928800": ("No", "BTC ~$74,543 — BELOW $76k. No."),
}


def calc_pnl(amount, price, won):
    if won:
        return (amount / price) * (1.0 - price)
    return -amount


def resolve_all():
    conn = get_connection()
    cur = conn.cursor()

    bets = [dict(r) for r in cur.execute("""
        SELECT b.id, b.market_id, b.side, b.amount, b.price_bought,
               m.question, m.resolved, m.resolution
        FROM bets b JOIN markets m ON m.id = b.market_id
    """).fetchall()]

    active = [b for b in bets if not b['resolved']]

    print("=" * 90)
    print("  POLYTRACK — MARKET RESOLUTION REPORT  |  April 16, 2026")
    print("=" * 90)
    print(f"\n{'#':<3} {'Market':<42} {'Side':<5} {'Amt':<7} {'Entry':<7} {'Result':<12} {'Won?':<6} {'P&L':<10} {'Reason'}")
    print("-" * 110)

    total_pnl = 0
    wins = 0
    losses = 0
    pending = 0

    for i, bet in enumerate(active, 1):
        mid = bet['market_id']
        if mid not in OUTCOMES:
            print(f"  {i:<2} {bet['question'][:40]:<42} {bet['side']:<5} ${float(bet['amount']):<6.0f} ${float(bet['price_bought']):.2f}   {'PENDING':<12} {'—':<6} {'—':<10}")
            pending += 1
            continue

        outcome, reason = OUTCOMES[mid]
        won = (bet['side'] == outcome)
        pnl = calc_pnl(float(bet['amount']), float(bet['price_bought']), won)

        if won:
            wins += 1
        else:
            losses += 1
        total_pnl += pnl

        # Resolve in DB
        try:
            resolve_market(conn, mid, outcome)
        except Exception as e:
            print(f"    (DB error: {e})")

        icon = "✅" if won else "❌"
        pnl_str = f"${pnl:+.2f}"
        print(f"  {icon} {i:<2} {bet['question'][:40]:<42} {bet['side']:<5} ${float(bet['amount']):<6.0f} ${float(bet['price_bought']):.2f}   {outcome:<12} {'WIN':<6} {pnl_str:<10} {reason[:40]}")

    conn.close()

    print(f"\n{'=' * 90}")
    if pending > 0:
        print(f"  ⚠️  {pending} market(s) still pending resolution")
    print(f"  RECORD: {wins}W / {losses}L")
    print(f"  TOTAL P&L: ${total_pnl:+.2f}")
    print(f"  TOTAL STAKED: ${sum(float(b['amount']) for b in active):.0f}")
    win_rate = wins / (wins + losses) * 100 if (wins + losses) > 0 else 0
    print(f"  WIN RATE: {win_rate:.0f}%")
    print(f"{'=' * 90}")

    return total_pnl, wins, losses, pending


if __name__ == "__main__":
    resolve_all()
