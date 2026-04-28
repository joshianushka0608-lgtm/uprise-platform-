"""Hermes-compatible Polymarket MCP tools.

Add this to Hermes config to access Polymarket data via chat/voice commands.
"""
import json
import urllib.request
from datetime import datetime, timezone
from pathlib import Path

import sys
sys.path.insert(0, str(Path(__file__).resolve().parent))
from db import init_db, get_connection, get_pnl_summary, get_my_bets, place_bet

BASE_URL = "https://gamma-api.polymarket.com"


def api_get(path, params=None):
    url = f"{BASE_URL}{path}"
    if params:
        url += "?" + "&".join(f"{k}={v}" for k, v in params.items())
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0", "Accept": "application/json"})
    with urllib.request.urlopen(req, timeout=15) as r:
        return json.loads(r.read())


def fetch_market_by_slug(slug: str):
    try:
        data = api_get("/markets", {"slug": slug})
        if data:
            return data[0] if isinstance(data, list) else data
    except:
        return None


def hermes_get_todays_bets():
    """[HERMES TOOL] Get today's Polymarket bets with current odds and payouts."""
    conn = get_connection()
    bets = get_my_bets(conn)
    active = [b for b in bets if not b.get("resolved")]
    conn.close()

    lines = ["**Today's Active Bets:**\n"]
    if not active:
        lines.append("No active bets. Check the dashboard for today's markets.")
        return "\n".join(lines)

    for b in active:
        outs = json.loads(b.get("outcome_prices", "[]"))
        yes_p = float(outs[0]) if outs else 0.5
        potential = (float(b["amount"]) / float(b["price_bought"])) * (1.0 - float(b["price_bought"]))
        lines.append(f"- *{b['question'][:60]}*")
        lines.append(f"  Side: {b['side']} at ${float(b['price_bought']):.2f} | Stake: ${float(b['amount']):.2f}")
        lines.append(f"  Potential win: ${potential:.2f} | Ends: {b.get('end_date','?')[:16]}Z\n")
    return "\n".join(lines)


def hermes_get_today_markets():
    """[HERMES TOOL] Get all Polymarket markets resolving today with current odds."""
    slugs = [
        ("Bitcoin Up/Down", "bitcoin-up-or-down-on-april-16-2026"),
        ("SPX Up/Down", "spx-up-or-down-on-april-16-2026"),
        ("Ethereum Up/Down", "ethereum-up-or-down-on-april-16-2026"),
        ("Meta Up/Down", "meta-up-or-down-on-april-16-2026"),
        ("XRP Up/Down", "xrp-up-or-down-on-april-16-2026"),
        ("Coinbase Up/Down", "coin-up-or-down-on-april-16-2026"),
        ("Opendoor Up/Down", "open-up-or-down-on-april-16-2026"),
        ("SPX Open Up/Down", "spx-opens-up-or-down-on-april-16-2026"),
        ("NDX Up/Down", "ndx-up-or-down-on-april-16-2026"),
        ("BTC ETF Flows", "bitcoin-etf-flows-on-april-16"),
    ]
    import time
    lines = ["**Today's Markets Resolving Today (April 16, 2026):**\n"]

    for name, slug in slugs:
        m = fetch_market_by_slug(slug)
        if m:
            outs = json.loads(m.get("outcomePrices", "[]"))
            yes = float(outs[0]) if outs else 0.5
            no = float(outs[1]) if len(outs) > 1 else 0.5
            vol = float(m.get("volumeNum", 0))
            ends = m.get("endDate", "?")[:16]
            profit_100 = (100 / yes) * (1 - yes)
            lines.append(f"**{name}**")
            lines.append(f"  YES: ${yes:.2f} ({yes*100:.0f}%) | NO: ${no:.2f} ({no*100:.0f}%)")
            lines.append(f"  $100 bet on YES wins: ${profit_100:.2f} | Vol: ${vol:.0f} | Ends: {ends}Z")
            lines.append("")
        time.sleep(0.2)
    return "\n".join(lines)


def hermes_place_bet(market_slug: str, side: str, amount: float):
    """[HERMES TOOL] Place a bet on a Polymarket market. Args: market_slug, side (Yes/No), amount ($)."""
    m = fetch_market_by_slug(market_slug)
    if not m:
        return f"Could not find market: {market_slug}"

    outs = json.loads(m.get("outcomePrices", "[]"))
    prices = {"Yes": float(outs[0]) if outs else 0.5, "No": float(outs[1]) if len(outs) > 1 else 0.5}
    price = prices.get(side, 0.5)

    conn = get_connection()
    bet_id = place_bet(conn, m["id"], side, amount, price)
    conn.close()

    profit = (amount / price) * (1 - price)
    return (f"Bet placed: **{side}** on *{m['question'][:60]}*\n"
            f"  Amount: ${amount:.2f} at ${price:.2f}\n"
            f"  If {side}, you win: ${profit:.2f}\n"
            f"  Bet ID: {bet_id}")


def hermes_get_pnl():
    """[HERMES TOOL] Get current P&L summary for all Polymarket bets."""
    conn = get_connection()
    pnl = get_pnl_summary(conn)
    bets = get_my_bets(conn)
    active = [b for b in bets if not b.get("resolved")]
    settled = [b for b in bets if b.get("resolved")]
    conn.close()

    win_rate = (pnl["wins"] / max(pnl["total_settled"], 1)) * 100
    lines = ["**PolyTrack P&L Summary:**\n"]
    lines.append(f"Total P&L: ${pnl['total_pnl']:.2f}")
    lines.append(f"Record: {pnl['wins']}W / {pnl['losses']}L ({win_rate:.0f}% win rate)")
    lines.append(f"Active bets: {len(active)} | Settled: {pnl['total_settled']}")
    return "\n".join(lines)


def hermes_check_market(question_keyword: str):
    """[HERMES TOOL] Check the current odds for a market by keyword. Eg: 'bitcoin', 'spx', 'iran'."""
    try:
        results = api_get("/markets", {"search": question_keyword, "closed": "false", "limit": 5})
    except:
        return f"Could not reach Polymarket API."

    if not results:
        return f"No markets found matching: {question_keyword}"

    lines = [f"**Markets matching '{question_keyword}':**\n"]
    for m in results:
        outs = json.loads(m.get("outcomePrices", "[]"))
        yes = float(outs[0]) if outs else 0.5
        no = float(outs[1]) if len(outs) > 1 else 0.5
        lines.append(f"- {m.get('question', '?')[:70]}")
        lines.append(f"  YES: ${yes:.2f} ({yes*100:.0f}%) | NO: ${no:.2f} ({no*100:.0f}%)")
        lines.append(f"  Ends: {m.get('endDate','?')[:10]} | Vol: ${float(m.get('volumeNum',0)):.0f}\n")
    return "\n".join(lines)


# ── CLI for Hermes integration ──────────────────────────────────────────────

if __name__ == "__main__":
    import sys
    if len(sys.argv) < 2:
        print("Hermes Polymarket Tools")
        print("Usage: python hermes_tools.py <command> [args]")
        print("Commands:")
        print("  today          - Show today's markets")
        print("  mybets         - Show active bets")
        print("  pnl            - Show P&L summary")
        print("  check <keyword> - Search markets by keyword")
        print("  bet <slug> <side> <amount> - Place a bet")
        sys.exit(0)

    cmd = sys.argv[1]

    if cmd == "today":
        print(hermes_get_today_markets())
    elif cmd == "mybets":
        print(hermes_get_todays_bets())
    elif cmd == "pnl":
        print(hermes_get_pnl())
    elif cmd == "check" and len(sys.argv) >= 3:
        print(hermes_check_market(sys.argv[2]))
    elif cmd == "bet" and len(sys.argv) >= 5:
        print(hermes_place_bet(sys.argv[2], sys.argv[3], float(sys.argv[4])))
    else:
        print(f"Unknown command: {cmd}")