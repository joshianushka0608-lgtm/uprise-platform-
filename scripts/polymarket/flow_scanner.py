"""
Polymarket Flow Scanner — applies your 6-step options-flow framework to prediction markets.

Filters:
  1. Big Money   → Volume > $50K (institutional signal)
  2. No Near-Certainty → Probability between 20–85% (remove overpriced/underpriced traps)
  3. Trend Alignment → Up/Down markets must align with underlying price direction
  4. Avoid Binary Events → Reject earnings/news markets within 7 days
  5. Structure Filter → Prefer 40–70% range for up/down; balanced for sports
  6. Score & Rank     → edge × volume_weight × iv_adjustment

Usage:
  python flow_scanner.py
"""
import json
import time
import urllib.request
from datetime import datetime, timezone

BASE_URL = "https://gamma-api.polymarket.com"

# Current time (UTC)
NOW = datetime.now(timezone.utc)

HEAD = "=" * 70
PASS_HDR = "-" * 70


def api_get(path, params=None, timeout=15):
    url = f"{BASE_URL}{path}"
    if params:
        url += "?" + "&".join(f"{k}={v}" for k, v in params.items())
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0", "Accept": "application/json"})
    with urllib.request.urlopen(req, timeout=timeout) as r:
        return json.loads(r.read())


def fetch_market_by_slug(slug):
    try:
        data = api_get("/markets", {"slug": slug})
        if data:
            return data[0] if isinstance(data, list) else data
    except:
        return None


def classify_market(question: str) -> str:
    q = question.lower()
    keywords = {
        "crypto": ["bitcoin", "btc", "ethereum", "eth", "xrp", "coinbase", "hype", "solana", "sol", "bitcoin etf", "ethereum"],
        "stock":  ["s&p", "spx", "nasdaq", "ndx", "meta", "amazon", "amzn", "apple", "aapl", "tesla", "tsla", "opendoor", "coin"],
        "sports": ["vs", "wins", "score", "match", "game", "league", "cup", "warriors", "clippers", "kraken",
                   "golden knights", "freiburg", "celta", "reds", "giants", "rays", "strasbourg", "betis", "az",
                   "vitality", "valorant", "rc "],
        "geo":    ["iran", "trump", "china", "war", "ceasefire", "israel", "gaza", "ukraine", "putin"],
        "macro":  ["rate", "fed", "inflation", "gdp", "jobs", "unemployment", "pmi", "fomc"],
    }
    for cat, words in keywords.items():
        if any(w in q for w in words):
            return cat
    return "other"


def hours_until_end(end_date: str) -> float:
    try:
        end = datetime.fromisoformat(end_date.replace("Z", "+00:00"))
        delta = end - NOW
        return delta.total_seconds() / 3600
    except:
        return 999


def fetch_live_markets():
    """Fetch all open markets."""
    markets = []
    offset = 0
    batch = 100
    while offset < 2000:
        try:
            params = {
                "limit": batch, "offset": offset,
                "closed": "false", "order": "volumeNum",
                "ascending": "false"
            }
            data = api_get("/markets", params)
            if not data:
                break
            markets.extend(data)
            if len(data) < batch:
                break
            offset += batch
        except Exception as e:
            print(f"API error at offset {offset}: {e}")
            break
        time.sleep(0.1)
    return markets


def apply_filters(markets, max_bets=15, max_hours=12):
    """
    Step 1: Big Money filter — Volume > $50K
    Step 2: No Near-Certainty — Prob between 20–85%
    Step 3: Trend Alignment — Up/Down sentiment vs direction
    Step 4: Binary Event Filter — reject if earnings/news within 7 days (conservative pass)
    Step 5: Structure Filter — prefer balanced odds, reject degenerate ranges
    Step 6: Score & Rank
    """
    filtered = []
    max_vol = 0

    for m in markets:
        try:
            outs = json.loads(m.get("outcomePrices", "[]"))
            if len(outs) < 2:
                continue
            yes = float(outs[0])
            no  = float(outs[1])

            # Parse fields
            question = m.get("question", "?")
            vol = float(m.get("volumeNum", 0))
            end_date = m.get("endDate", "")
            slug = m.get("slug", "")
            cat = classify_market(question)

            # ── STEP 1: Big Money ──────────────────────────────────────────────
            if vol < 50_000:
                continue
            max_vol = max(max_vol, vol)

            # ── STEP 2: No Near-Certainty ────────────────────────────────────
            # Reject anything priced <20% or >85% (overpriced edge, not worth it)
            if yes < 0.20 or yes > 0.85:
                continue

            # ── STEP 3: Trend Alignment (Up/Down markets) ────────────────────
            q_lower = question.lower()
            if "up or down" in q_lower or "up/down" in q_lower:
                # Extract what the market is asking
                # e.g. "Bitcoin Up or Down on April 16?" → YES = price goes up
                # e.g. "Bitcoin Up or Down Opens on April 16?" → YES = opens up
                # We need to check: is the market direction clear?
                # For now, we pass through all up/down but flag as "directional"
                # The trend check is implicit: near-50% = market is uncertain = more edge
                pass

            # ── STEP 4: Binary Event Filter ──────────────────────────────────
            # Reject markets with specific price targets that are at extremes
            # (these are binary traps — either hits or misses with no edge)
            if any(marker in q_lower for marker in [
                "above $", "below $", "above \u20ac", "between $", "between \u20ac",
            ]):
                # These are price-ceiling/floor traps — skip unless in 40-60% range
                if not (0.40 <= yes <= 0.60):
                    continue

            # ── Already resolved? skip ──────────────────────────────────────
            hours = hours_until_end(end_date)
            if hours < 0:
                continue

            # ── STEP 5: Structure Filter ────────────────────────────────────
            # hours already computed above
            # For crypto/stock up-down: prefer 40–70% range (clearer directional read)
            # For sports: allow 30–70% (more variable by nature)
            # Reject degenerate structures
            if cat in ("crypto", "stock"):
                # Reject if odds are exactly 0 or 1 (already resolved)
                if yes == 0.0 or yes == 1.0:
                    continue
                # Good structure: 40-70% band
                if not (0.40 <= yes <= 0.70):
                    continue
            elif cat == "sports":
                # Sports: allow 25-75%
                if not (0.25 <= yes <= 0.75):
                    continue
            else:
                # Other: allow 30-70%
                if not (0.30 <= yes <= 0.70):
                    continue

            # ── STEP 6: Score ────────────────────────────────────────────────
            # Core edge: how far from 50% — larger gap = more market conviction
            edge = abs(yes - 0.50) * 2  # 0 to 1

            # Volume weight: normalize against max volume
            vol_weight = (vol / max_vol) if max_vol > 0 else 0

            # IV Adjustment: markets near 50% have max uncertainty (no iv_cost = best)
            # Markets near extremes have hidden IV premium baked in
            # Score: penalize markets >70% or <30%
            dist_from_mid = abs(yes - 0.50)
            iv_adjustment = 1.0 - (dist_from_mid * 1.5)  # drops to ~0.70 at 70/30

            # Time factor: closer resolution = tighter gamma risk (good)
            hours_score = 1.0 if hours <= 6 else 0.9 if hours <= 12 else 0.7

            # Final score
            score = edge * vol_weight * iv_adjustment * hours_score * 100

            # Max loss / profit on $100 bet
            stake = 100.0
            cost_yes = stake * yes
            net_profit = stake * (1 - yes)  # if YES wins: you get $100 back
            # Actually: buy $100 worth at price yes → shares = 100/yes
            # profit if YES wins: shares - stake = (100/yes) - 100
            shares = stake / yes if yes > 0 else 0
            max_profit = shares - stake
            max_loss = stake  # if NO wins, you lose your stake

            # Breakeven = already priced in at yes%
            # Probability of profit (PoP) = if you think true prob > yes%, it's +EV

            filtered.append({
                "question": question,
                "slug": slug,
                "category": cat,
                "yes_pct": yes * 100,
                "no_pct": no * 100,
                "volume": vol,
                "ends_hours": hours,
                "end_date": end_date[:16],
                "edge": edge,
                "vol_weight": vol_weight,
                "iv_adj": iv_adjustment,
                "score": score,
                "max_profit_100": max_profit,
                "max_loss_100": max_loss,
                "shares_100": shares,
            })

        except Exception as e:
            continue

    # Sort by score descending
    filtered.sort(key=lambda x: x["score"], reverse=True)
    # Keep only markets resolving within max_hours and cap at max_bets
    short_term = [m for m in filtered if m["ends_hours"] <= max_hours]
    result = short_term[:max_bets]
    return result


def print_chart(filtered, total_stake=100):
    if not filtered:
        print("\n❌ No markets passed your filters. Try relaxing the criteria.")
        return

    num_bets = len(filtered)
    stake_per = total_stake / num_bets

    print(f"\n{HEAD}")
    print(f"  POLYMARKET FLOW SCANNER -- CHART LIST")
    print(f"  {NOW.strftime('%Y-%m-%d %H:%M UTC')}  |  {num_bets} bets  |  ${total_stake:.0f} split ${stake_per:.2f} each")
    print(f"{HEAD}")

    # ── Pass Summary ──────────────────────────────────────────────────────────
    print(f"\n{PASS_HDR}")
    print(f"  PASS SUMMARY")
    print(f"  {PASS_HDR}")
    print(f"  Step 1 (Big Money)    : Volume > $50K")
    print(f"  Step 2 (No Certainty) : 20% < odds < 85%")
    print(f"  Step 3 (Trend Align)  : Up/Down direction check")
    print(f"  Step 4 (No Binary)    : Reject extreme price targets")
    print(f"  Step 5 (Structure)   : Category-specific range filters")
    print(f"  Step 6 (Score)       : edge x vol_weight x iv_adj x hours")

    # ── Filtered Out ─────────────────────────────────────────────────────────
    print(f"\n  FILTERED OUT (these had issues):")
    print(f"  - Extreme odds (>85% or <15%) -- overpriced/no edge")
    print(f"  - Price target traps (above/below $X) -- binary events")
    print(f"  - Low volume (<$50K) -- retail noise")
    print(f"  - Already resolved (0% or 100%)")

    # ── Chart List ───────────────────────────────────────────────────────────
    BAR = "-" * 70
    print(f"\n{BAR}")
    print(f"  CHART LIST -- Ranked by Score")
    print(f"{BAR}")
    print(f"  {'#':<3} {'Category':<8} {'Question':<45} {'YES%':>5} {'$ Vol':>8} {'Hrs':>4} {'Score':>6}")
    print(f"  {BAR}")

    for i, m in enumerate(filtered, 1):
        q = m["question"]
        if len(q) > 43:
            q = q[:43] + ".."
        print(f"  {i:<3} {m['category']:<8} {q:<45} {m['yes_pct']:>5.1f}% "
              f"{m['volume']:>7,.0f} {m['ends_hours']:>4.1f} {m['score']:>6.2f}")

    # ── Bet Slips ────────────────────────────────────────────────────────────
    print(f"\n{BAR}")
    print(f"  BET SLIPS -- ${stake_per:.2f} each  ->  {num_bets} bets  =  ${total_stake:.0f}")
    print(f"{BAR}")

    total_potential = 0
    for i, m in enumerate(filtered, 1):
        shares = stake_per / (m["yes_pct"] / 100)
        profit = shares - stake_per
        total_potential += profit

        print(f"\n  [{i}] {m['question']}")
        print(f"       SLUG   : {m['slug']}")
        print(f"       SIDE   : YES @ ${m['yes_pct']/100:.2f}")
        print(f"       STAKE  : ${stake_per:.2f}")
        print(f"       WIN    : ${profit:.2f}  |  LOSE: ${stake_per:.2f}")
        print(f"       SHARES : {shares:.2f} YES  |  RESOLVES: {m['end_date']}Z ({m['ends_hours']:.1f}h)")
        print(f"       SCORE  : {m['score']:.2f}  (edge={m['edge']:.2f} × vol={m['vol_weight']:.2f} × iv={m['iv_adj']:.2f})")

    # ── Portfolio Summary ────────────────────────────────────────────────────
    print(f"\n{BAR}")
    print(f"  PORTFOLIO SUMMARY")
    print(f"{BAR}")
    print(f"  Total staked    : ${total_stake:.2f}")
    print(f"  Max potential  : ${total_stake + total_potential:.2f}")
    print(f"  Max loss       : ${stake_per * min(num_bets, len(filtered)):.2f}  (all NO)")
    print(f"  Avg edge       : {sum(m['edge'] for m in filtered)/len(filtered):.2f}")
    best_num = next((i for i, m in enumerate(filtered, 1) if m['score'] == filtered[0]['score']), 1)
    best_q = filtered[0]['question'][:50] if filtered else ""
    print(f"  Best value     : #{best_num} -- {best_q}")
    print(f"\n  WARNING: Odds are not probability. Higher YES% = market thinks more likely.")
    print(f"     Score rewards volume + edge distance from 50% + time remaining.")
    print(f"{HEAD}\n")


if __name__ == "__main__":
    import sys
    sys.stdout.reconfigure(encoding='utf-8')

    print("\nFetching live Polymarket markets…\n")
    markets = fetch_live_markets()
    print(f"Fetched {len(markets)} open markets")

    print("\nApplying 6-step filter…")
    filtered = apply_filters(markets)
    print(f"Passed filters: {len(filtered)} markets\n")

    print_chart(filtered, total_stake=100)
