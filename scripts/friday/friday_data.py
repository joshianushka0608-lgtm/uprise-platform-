"""
Friday Intelligence Bridge — connects your AIOS to Friday's live Supabase data.
No extra API keys needed — uses Friday's existing Supabase project.

Data available:
- News (real, from Exa AI — needs EXA_API_KEY in friday's env, falls back to seed stories)
- Flight tracking (real, from OpenSky Network — free, no key needed)
- Prediction markets: Polymarket (real, free) + Kalshi (needs API key)
- Country indexes (seed data currently, needs real feed)
- Geo events / conflict pins (seed data currently)
- Live ticker data (seed data, needs real feeds)

Run standalone:
    python scripts/friday/friday_data.py --news
    python scripts/friday/friday_data.py --flights
    python scripts/friday/friday_data.py --markets
    python scripts/friday/friday_data.py --all
"""

import argparse
import sys
import json
from datetime import datetime, timedelta

try:
    from supabase import create_client, Client
except ImportError:
    print("Installing supabase client...")
    import subprocess
    subprocess.check_call([sys.executable, "-m", "pip", "install", "supabase", "-q"])
    from supabase import create_client, Client

# Friday's Supabase credentials (from friday13/.env)
SUPABASE_URL = "https://pcubzwojlpgtclbxbpzq.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBjdWJ6d29qbHBndGNsYnhicHpxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQyMzkwNDgsImV4cCI6MjA4OTgxNTA0OH0.EEOxToiimEKMZ0pQNsPWc1y8k8G1uGICnFWvcj_ZJyU"

# OpenSky free API for live flights
OPENSKY_URL = "https://opensky-network.org/api/states/all"


def get_supabase() -> Client:
    return create_client(SUPABASE_URL, SUPABASE_KEY)


def fetch_news(limit: int = 20):
    """Fetch latest news from Friday's database (Exa AI sourced, needs EXA_API_KEY in Supabase).

    If DB is empty, this returns [] — call get_live_geopolitics_news() instead
    to get real news via web search (no API key needed).
    """
    sb = get_supabase()
    result = sb.table("news").select("*").order("fetched_at", desc=True).limit(limit).execute()
    stories = result.data
    if not stories:
        print("Note: Friday DB news table is empty. Run with --live-news instead for live geopolitics headlines via web search.")
    return stories


def fetch_live_flights():
    """Fetch live flight data directly from OpenSky (free, no key)."""
    import urllib.request
    url = f"{OPENSKY_URL}?lamin=-90&lamax=90&lomin=-180&lomax=180"
    req = urllib.request.Request(url, headers={"Accept": "application/json"})
    try:
        with urllib.request.urlopen(req, timeout=10) as resp:
            data = json.loads(resp.read())
        states = data.get("states", []) or []
        flights = []
        for s in states[:100]:
            if s[5] and s[6] and not s[8]:  # has pos, not on ground
                flights.append({
                    "icao24": s[0],
                    "callsign": s[1].strip() if s[1] else "",
                    "country": s[2],
                    "lat": round(s[6], 4),
                    "lon": round(s[5], 4),
                    "alt_m": s[7] or 0,
                    "speed_mps": s[9] or 0,
                    "heading": s[10] or 0,
                })
        return flights
    except Exception as e:
        print(f"OpenSky error: {e}")
        return []


def fetch_polymarket():
    """Fetch Polymarket events via Friday's Supabase edge function proxy."""
    import urllib.request
    url = f"{SUPABASE_URL}/functions/v1/polymarket-proxy"
    payload = json.dumps({
        "api": "gamma",
        "endpoint": "events",
        "params": {"limit": "20", "active": "true", "closed": "false"}
    }).encode()
    try:
        req = urllib.request.Request(url, data=payload, headers={
            "Content-Type": "application/json",
            "Authorization": f"Bearer {SUPABASE_KEY}"
        })
        with urllib.request.urlopen(req, timeout=15) as resp:
            data = json.loads(resp.read())
        markets = data if isinstance(data, list) else data.get("events", data.get("data", []))
        result = []
        for m in (markets or []):
            try:
                prices = json.loads(m.get("outcomePrices", "[]"))
                outcomes = json.loads(m.get("outcomes", "[]"))
                result.append({
                    "question": m.get("question", m.get("title", "")),
                    "slug": m.get("slug", ""),
                    "volume": m.get("volume", "0"),
                    "liquidity": m.get("liquidity", "0"),
                    "outcomes": list(zip(outcomes, prices)) if outcomes else [],
                    "end_date": m.get("endDate", ""),
                })
            except:
                pass
        return result
    except Exception as e:
        print(f"Polymarket error: {e}")
        return []


def fetch_country_indexes():
    """Fetch country stability/fear indexes from Friday's DB."""
    sb = get_supabase()
    result = sb.table("country_indexes").select("*").order("recorded_at", desc=True).limit(30).execute()
    return result.data


def fetch_geo_events():
    """Fetch geo events / conflict pins from Friday's DB."""
    sb = get_supabase()
    result = sb.table("geo_events").select("*").order("created_at", desc=True).limit(30).execute()
    return result.data


def fetch_betting_markets():
    """Fetch betting market data from Friday's DB."""
    sb = get_supabase()
    result = sb.table("betting_markets").select("*").order("created_at", desc=True).limit(20).execute()
    return result.data


def print_news(stories):
    if not stories:
        print("No news found.")
        return
    print(f"\n{'='*70}")
    print(f"  FRIDAY NEWS — Latest {len(stories)} stories")
    print(f"{'='*70}")
    for i, s in enumerate(stories, 1):
        published = s.get("published_at", s.get("fetched_at", ""))
        age = ""
        if published:
            try:
                dt = datetime.fromisoformat(published.replace("Z", "+00:00"))
                age = f"({format_age(dt)})"
            except:
                pass
        print(f"\n{i}. [{s.get('source', 'unknown')}] {age}")
        print(f"   {s.get('title', '')}")
        desc = s.get("description", "")
        if desc:
            print(f"   {desc[:150]}...")


def print_flights(flights):
    if not flights:
        print("No live flights.")
        return
    print(f"\n{'='*70}")
    print(f"  LIVE FLIGHTS — {len(flights)} aircraft in view (OpenSky, free)")
    print(f"{'='*70}")
    for f in flights[:30]:
        country = f.get("country", "")
        callsign = f.get("callsign", "???")
        lat, lon = f.get("lat", 0), f.get("lon", 0)
        alt = f.get("alt_m", 0)
        speed = round(f.get("speed_mps", 0) * 1.944, 1)  # knots
        print(f"  {callsign:<12} {country:<20} ALT:{alt:>8.0f}m  SPD:{speed:>6.1f}kt  ({lat:.2f}, {lon:.2f})")


def print_markets(markets):
    if not markets:
        print("No markets found.")
        return
    print(f"\n{'='*70}")
    print(f"  POLYMARKET — Top {len(markets)} prediction markets")
    print(f"{'='*70}")
    for i, m in enumerate(markets, 1):
        vol = float(m.get("volume", 0))
        liq = float(m.get("liquidity", 0))
        outcomes = m.get("outcomes", [])
        print(f"\n{i}. {m.get('question', '')}")
        print(f"   Vol: ${vol:,.0f} | Liq: ${liq:,.0f}")
        for label, price in outcomes:
            pct = float(price) * 100
            print(f"   {label:<30} {pct:>6.1f}%")


def print_indexes(indexes):
    if not indexes:
        print("No country indexes found — DB may be empty (seed data only).")
        return
    print(f"\n{'='*70}")
    print(f"  COUNTRY INDEXES — {len(indexes)} records")
    print(f"{'='*70}")
    print(f"{'Country':<25} {'Fear':>5} {'Opt':>5} {'Stab':>5} {'Econ':>5} {'Unrest':<10}")
    print("-" * 70)
    for idx in indexes[:20]:
        print(f"{idx.get('country_name',''):<25} {idx.get('fear_index',0):>5} {idx.get('optimism_index',0):>5} "
              f"{idx.get('stability_score',0):>5} {idx.get('economic_score',0):>5} {idx.get('unrest_risk','?'):<10}")


def print_events(events):
    if not events:
        print("No geo events found — DB may be empty (seed data only).")
        return
    print(f"\n{'='*70}")
    print(f"  GEO EVENTS — {len(events)} conflict/unrest pins")
    print(f"{'='*70}")
    for e in events[:20]:
        severity = e.get("severity", "?")
        icon = {"critical": "🔴", "high": "🟠", "moderate": "🟡", "low": "🟢"}.get(severity, "⚪")
        print(f"{icon} [{severity.upper():>8}] {e.get('title', e.get('event_type',''))}")
        if e.get("description"):
            print(f"   {e.get('description', '')[:120]}")


def format_age(dt: datetime) -> str:
    delta = datetime.now(dt.tzinfo) - dt
    mins = int(delta.total_seconds() / 60)
    if mins < 60:
        return f"{mins}m ago"
    hrs = int(mins / 60)
    if hrs < 24:
        return f"{hrs}h ago"
    return f"{int(hrs/24)}d ago"


def main():
    parser = argparse.ArgumentParser(description="Friday Intelligence Bridge")
    parser.add_argument("--news", action="store_true", help="Fetch latest news")
    parser.add_argument("--flights", action="store_true", help="Fetch live flights (OpenSky)")
    parser.add_argument("--markets", action="store_true", help="Fetch Polymarket prediction markets")
    parser.add_argument("--indexes", action="store_true", help="Fetch country stability indexes")
    parser.add_argument("--events", action="store_true", help="Fetch geo events / conflict pins")
    parser.add_argument("--bets", action="store_true", help="Fetch betting markets")
    parser.add_argument("--all", action="store_true", help="Fetch all data")
    parser.add_argument("--limit", type=int, default=20, help="Limit results")
    args = parser.parse_args()

    if not any([args.news, args.flights, args.markets, args.indexes, args.events, args.bets, args.all]):
        parser.print_help()
        print("\n\nEXAMPLES:")
        print("  python scripts/friday/friday_data.py --news       # latest news")
        print("  python scripts/friday/friday_data.py --flights    # live flights")
        print("  python scripts/friday/friday_data.py --markets  # Polymarket odds")
        print("  python scripts/friday/friday_data.py --all      # everything")
        return

    if args.all or args.news:
        stories = fetch_news(args.limit)
        print_news(stories)

    if args.all or args.flights:
        flights = fetch_live_flights()
        print_flights(flights)

    if args.all or args.markets:
        markets = fetch_polymarket()
        print_markets(markets)

    if args.all or args.indexes:
        indexes = fetch_country_indexes()
        print_indexes(indexes)

    if args.all or args.events:
        events = fetch_geo_events()
        print_events(events)

    if args.all or args.bets:
        bets = fetch_betting_markets()
        if bets:
            print(f"\nBETTING MARKETS: {len(bets)} records")


if __name__ == "__main__":
    main()
