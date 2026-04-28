"""Polymarket API Fetcher — pulls live data and syncs to DB.

Runs on demand or can be scheduled. Fetches markets from Polymarket's
public Gamma API, categorizes them, and stores in polymarket.db.
"""
import json
import time
import urllib.request
from datetime import datetime, timezone
from pathlib import Path

import sys
sys.path.insert(0, str(Path(__file__).resolve().parent))
from db import init_db, upsert_market, log_odds_snapshot

BASE_URL = "https://gamma-api.polymarket.com"


def api_get(path, params=None, timeout=15):
    url = f"{BASE_URL}{path}"
    if params:
        url += "?" + "&".join(f"{k}={v}" for k, v in params.items())
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0", "Accept": "application/json"})
    with urllib.request.urlopen(req, timeout=timeout) as r:
        return json.loads(r.read())


def classify_market(question: str) -> str:
    q = question.lower()
    keywords = {
        "crypto": ["bitcoin", "btc", "ethereum", "eth", "xrp", "coinbase", "hype", "solana", "sol"],
        "stock": ["s&p", "spx", "nasdaq", "ndx", "meta", "amazon", "amzn", "apple", "aapl", "tesla", "tsla", "opendoor"],
        "sports": ["vs", "wins", "score", "match", "game", "league", "cup", "warriors", "clippers", "kraken", "golden knights", "freiburg", "celta"],
        "geo": ["iran", "trump", "china", "war", "ceasefire", "israel", "gaza", "ukraine", "putin", " regime"],
    }
    for cat, words in keywords.items():
        if any(w in q for w in words):
            return cat
    return "other"


def fetch_market_by_slug(slug: str) -> dict | None:
    try:
        data = api_get("/markets", {"slug": slug})
        if data:
            return data[0] if isinstance(data, list) else data
    except Exception as e:
        print(f"  Error fetching {slug}: {e}")
    return None


def fetch_all_markets(limit=2000, closed=False):
    markets = []
    offset = 0
    batch = 100
    while offset < limit:
        try:
            params = {"limit": batch, "offset": offset, "closed": str(closed).lower(),
                     "order": "volumeNum", "ascending": "false"}
            batch_data = api_get("/markets", params)
            if not batch_data:
                break
            markets.extend(batch_data)
            if len(batch_data) < batch:
                break
            offset += batch
        except Exception as e:
            print(f"Error at offset {offset}: {e}")
            break
    return markets


def fetch_updown_markets():
    """Fetch Up-or-Down daily markets by known slugs + general search."""
    today_slugs = [
        "bitcoin-up-or-down-on-april-16-2026",
        "spx-up-or-down-on-april-16-2026",
        "ethereum-up-or-down-on-april-16-2026",
        "meta-up-or-down-on-april-16-2026",
        "coin-up-or-down-on-april-16-2026",
        "open-up-or-down-on-april-16-2026",
        "xrp-up-or-down-on-april-16-2026",
        "spx-opens-up-or-down-on-april-16-2026",
        "ndx-up-or-down-on-april-16-2026",
        "bitcoin-etf-flows-on-april-16",
    ]
    markets = []
    seen = set()
    for slug in today_slugs:
        m = fetch_market_by_slug(slug)
        if m:
            m["market_type"] = classify_market(m["question"])
            markets.append(m)
            seen.add(m["id"])
        time.sleep(0.3)

    # Also grab any up/down markets from general list
    try:
        all_m = fetch_all_markets(limit=2000)
        for m in all_m:
            q = m.get("question", "").lower()
            if ("up or down" in q or "up/down" in q) and m["id"] not in seen:
                m["market_type"] = classify_market(m["question"])
                markets.append(m)
                seen.add(m["id"])
    except:
        pass

    return markets


def fetch_today_markets():
    """Fetch all markets resolving April 16, 2026."""
    today_start = datetime(2026, 4, 16, tzinfo=timezone.utc)
    today_end = datetime(2026, 4, 17, tzinfo=timezone.utc)
    markets = []
    seen = set()

    # First get up/down markets (they resolve today)
    for m in fetch_updown_markets():
        if m["id"] not in seen:
            markets.append(m)
            seen.add(m["id"])

    # Then get sports / other markets from general list
    try:
        all_m = fetch_all_markets(limit=2000)
        for m in all_m:
            try:
                end = datetime.fromisoformat(m["endDate"].replace("Z", "+00:00"))
                if today_start <= end < today_end and m["id"] not in seen:
                    m["market_type"] = classify_market(m["question"])
                    markets.append(m)
                    seen.add(m["id"])
            except:
                pass
    except:
        pass

    # Add sports markets by known slugs
    sports_slugs = [
        "wta-muchova-mertens-2026-04-16",
        "uel-cel4-scf-2026-04-16",
        "atp-smit-tu-2026-04-16",
        "atp-bolt-noguchi-2026-04-16",
    ]
    for slug in sports_slugs:
        m = fetch_market_by_slug(slug)
        if m and m["id"] not in seen:
            m["market_type"] = classify_market(m["question"])
            markets.append(m)
            seen.add(m["id"])
        time.sleep(0.3)

    return markets


def sync_to_db():
    """Fetch latest data and write to DB. Returns summary."""
    conn = init_db()
    count = 0
    errors = 0

    try:
        markets = fetch_today_markets()
        for m in markets:
            try:
                upsert_market(conn, m)
                log_odds_snapshot(conn, m["id"], m.get("outcomePrices", ""))
                count += 1
            except Exception as e:
                errors += 1
                print(f"Error upserting {m.get('id')}: {e}")
    except Exception as e:
        print(f"API error: {e}")

    return {
        "markets_synced": count,
        "errors": errors,
        "today_count": count,
        "today_markets": markets,
    }


if __name__ == "__main__":
    result = sync_to_db()
    print(f"Synced {result['markets_synced']} markets, {result['errors']} errors")
    for m in result.get("today_markets", []):
        outs = json.loads(m.get("outcomePrices", "[]"))
        yes = float(outs[0]) if outs else 0.5
        no = float(outs[1]) if len(outs) > 1 else 0.5
        print(f"  [{m.get('market_type','?')}] {m['question'][:55]}")
        print(f"    Yes: ${yes:.2f} ({yes*100:.0f}%) | No: ${no:.2f} ({no*100:.0f}%)")
        print(f"    Ends: {m['endDate'][:16]}Z | Vol: ${float(m.get('volumeNum',0)):.0f}")
