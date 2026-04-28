"""Polymarket Dashboard — SQLite Database.

Stores markets, odds history, my bets, and resolution results.
"""
import sqlite3
from pathlib import Path
from datetime import datetime

WORKSPACE = Path(__file__).resolve().parent.parent.parent
DB_PATH = WORKSPACE / "data" / "polymarket.db"


def get_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def init_db():
    conn = get_connection()
    cur = conn.cursor()

    # Markets from Polymarket
    cur.execute("""
        CREATE TABLE IF NOT EXISTS markets (
            id TEXT PRIMARY KEY,
            slug TEXT,
            question TEXT,
            end_date TEXT,
            outcomes TEXT,           -- JSON array ["Yes","No"]
            outcome_prices TEXT,    -- JSON array ["0.65","0.35"]
            volume REAL DEFAULT 0,
            liquidity REAL DEFAULT 0,
            market_type TEXT,        -- 'crypto', 'stock', 'sports', 'geo', 'other'
            resolved INTEGER DEFAULT 0,
            resolution TEXT,         -- the winning outcome
            last_fetched TEXT DEFAULT (datetime('now'))
        )
    """)

    # My placed bets
    cur.execute("""
        CREATE TABLE IF NOT EXISTS bets (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            market_id TEXT NOT NULL,
            side TEXT NOT NULL,      -- 'Yes' or 'No'
            amount REAL NOT NULL,   -- $ amount staked
            price_bought REAL NOT NULL, -- price per share when I bought
            placed_at TEXT DEFAULT (datetime('now')),
            FOREIGN KEY (market_id) REFERENCES markets(id)
        )
    """)

    # Odds history (snapshot every fetch)
    cur.execute("""
        CREATE TABLE IF NOT EXISTS odds_history (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            market_id TEXT NOT NULL,
            outcome_prices TEXT NOT NULL,  -- snapshot of prices
            fetched_at TEXT DEFAULT (datetime('now')),
            FOREIGN KEY (market_id) REFERENCES markets(id)
        )
    """)

    # Resolved results
    cur.execute("""
        CREATE TABLE IF NOT EXISTS resolved (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            market_id TEXT UNIQUE NOT NULL,
            resolved_outcome TEXT NOT NULL,
            resolved_at TEXT DEFAULT (datetime('now')),
            FOREIGN KEY (market_id) REFERENCES markets(id)
        )
    """)

    # P&L tracking
    cur.execute("""
        CREATE TABLE IF NOT EXISTS pnl (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            bet_id INTEGER NOT NULL,
            market_id TEXT NOT NULL,
            side TEXT NOT NULL,
            amount REAL NOT NULL,
            price_bought REAL NOT NULL,
            resolved_outcome TEXT,
            pnl REAL DEFAULT 0,      -- positive = profit, negative = loss
            settled INTEGER DEFAULT 0,
            settled_at TEXT,
            FOREIGN KEY (bet_id) REFERENCES bets(id),
            FOREIGN KEY (market_id) REFERENCES markets(id)
        )
    """)

    conn.commit()
    return conn


# ── Market helpers ──────────────────────────────────────────────────────────

def upsert_market(conn, market):
    cur = conn.cursor()
    cur.execute("""
        INSERT INTO markets (id, slug, question, end_date, outcomes, outcome_prices,
                            volume, liquidity, market_type)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(id) DO UPDATE SET
            question=excluded.question,
            end_date=excluded.end_date,
            outcomes=excluded.outcomes,
            outcome_prices=excluded.outcome_prices,
            volume=excluded.volume,
            liquidity=excluded.liquidity,
            market_type=CASE WHEN excluded.market_type IS NOT NULL
                             THEN excluded.market_type ELSE markets.market_type END,
            last_fetched=datetime('now')
    """, (
        market.get("id"),
        market.get("slug"),
        market.get("question"),
        market.get("endDate"),
        market.get("outcomes"),
        market.get("outcomePrices"),
        float(market.get("volumeNum", 0)),
        float(market.get("liquidityNum", 0)),
        market.get("market_type"),
    ))
    conn.commit()


def get_active_markets(conn, days=1):
    """Markets resolving within N days, not yet resolved."""
    cur = conn.cursor()
    rows = cur.execute("""
        SELECT * FROM markets
        WHERE resolved = 0
          AND end_date >= date('now', ?)
        ORDER BY end_date ASC
    """, (f"-{days} days",)).fetchall()
    return rows


def get_todays_markets(conn):
    """Markets resolving today."""
    cur = conn.cursor()
    rows = cur.execute("""
        SELECT * FROM markets
        WHERE resolved = 0
          AND date(end_date) = date('now', 'localtime')
        ORDER BY end_date ASC
    """).fetchall()
    return rows


def get_all_markets(conn, limit=100):
    cur = conn.cursor()
    return cur.execute("""
        SELECT * FROM markets ORDER BY last_fetched DESC LIMIT ?
    """, (limit,)).fetchall()


# ── Betting helpers ────────────────────────────────────────────────────────

def place_bet(conn, market_id, side, amount, price_bought):
    cur = conn.cursor()
    cur.execute("""
        INSERT INTO bets (market_id, side, amount, price_bought)
        VALUES (?, ?, ?, ?)
    """, (market_id, side, amount, price_bought))
    conn.commit()
    bet_id = cur.lastrowid

    # Create P&L row
    cur.execute("""
        INSERT INTO pnl (bet_id, market_id, side, amount, price_bought)
        VALUES (?, ?, ?, ?, ?)
    """, (bet_id, market_id, side, amount, price_bought))
    conn.commit()
    return bet_id


def get_my_bets(conn, limit=50):
    cur = conn.cursor()
    return cur.execute("""
        SELECT b.*, m.question, m.outcomes, m.outcome_prices,
               m.end_date, m.resolved, m.resolution, m.market_type
        FROM bets b
        JOIN markets m ON m.id = b.market_id
        ORDER BY b.placed_at DESC
        LIMIT ?
    """, (limit,)).fetchall()


def get_unsettled_bets(conn):
    cur = conn.cursor()
    return cur.execute("""
        SELECT b.*, m.question, m.outcomes, m.outcome_prices,
               m.end_date, m.resolution, m.market_type
        FROM bets b
        JOIN markets m ON m.id = b.market_id
        WHERE b.id NOT IN (SELECT bet_id FROM pnl WHERE settled = 1)
        ORDER BY m.end_date ASC
    """).fetchall()


# ── Resolution helpers ──────────────────────────────────────────────────────

def resolve_market(conn, market_id, winning_outcome):
    cur = conn.cursor()
    cur.execute("UPDATE markets SET resolved=1, resolution=? WHERE id=?",
                (winning_outcome, market_id))
    cur.execute("INSERT OR REPLACE INTO resolved (market_id, resolved_outcome) VALUES (?, ?)",
                (market_id, winning_outcome))
    conn.commit()

    # Settle all bets on this market
    bets = cur.execute("""
        SELECT * FROM pnl WHERE market_id = ? AND settled = 0
    """, (market_id,)).fetchall()

    for bet in bets:
        side = bet["side"]
        if side == winning_outcome:
            pnl = bet["amount"] / bet["price_bought"] * (1.0 - bet["price_bought"])
        else:
            pnl = -bet["amount"]
        cur.execute("""
            UPDATE pnl SET resolved_outcome=?, pnl=?, settled=1,
                          settled_at=datetime('now')
            WHERE id=?
        """, (winning_outcome, pnl, bet["id"]))
    conn.commit()


def get_pnl_summary(conn):
    cur = conn.cursor()
    settled = cur.execute("""
        SELECT SUM(pnl) as total, COUNT(*) as count
        FROM pnl WHERE settled = 1
    """).fetchone()

    all_bets = cur.execute("""
        SELECT SUM(CASE WHEN settled=1 THEN pnl ELSE 0 END) as total_pnl,
               SUM(CASE WHEN settled=1 AND pnl > 0 THEN 1 ELSE 0 END) as wins,
               SUM(CASE WHEN settled=1 AND pnl < 0 THEN 1 ELSE 0 END) as losses,
               COUNT(CASE WHEN settled=1 THEN 1 END) as total_settled
        FROM pnl
    """).fetchone()

    return {
        "total_pnl": all_bets["total_pnl"] or 0,
        "wins": all_bets["wins"] or 0,
        "losses": all_bets["losses"] or 0,
        "total_settled": all_bets["total_settled"] or 0,
    }


def log_odds_snapshot(conn, market_id, outcome_prices):
    cur = conn.cursor()
    cur.execute("""
        INSERT INTO odds_history (market_id, outcome_prices) VALUES (?, ?)
    """, (market_id, outcome_prices))
    conn.commit()


if __name__ == "__main__":
    conn = init_db()
    print(f"Polymarket DB initialized at: {DB_PATH}")
