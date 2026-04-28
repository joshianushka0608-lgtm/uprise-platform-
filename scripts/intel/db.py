"""IntelOS Database — Work Log, Decisions & Daily Updates."""
from pathlib import Path
import sqlite3

WORKSPACE_ROOT = Path(__file__).resolve().parent.parent.parent
DB_PATH = WORKSPACE_ROOT / "data" / "intel.db"


def get_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def init_db():
    """Create all IntelOS tables if they don't exist."""
    conn = get_connection()
    cur = conn.cursor()

    # Business areas / classification
    cur.execute("""
        CREATE TABLE IF NOT EXISTS business_areas (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT UNIQUE NOT NULL,
            description TEXT,
            created_at TEXT DEFAULT (datetime('now'))
        )
    """)

    # Work log — daily entries by area
    cur.execute("""
        CREATE TABLE IF NOT EXISTS work_log (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            date TEXT NOT NULL,
            area TEXT NOT NULL,
            work_done TEXT,
            blockers TEXT,
            wins TEXT,
            notes TEXT,
            created_at TEXT DEFAULT (datetime('now'))
        )
    """)

    # Key decisions made
    cur.execute("""
        CREATE TABLE IF NOT EXISTS decisions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            date TEXT NOT NULL,
            area TEXT NOT NULL,
            decision TEXT NOT NULL,
            context TEXT,
            outcome TEXT,
            created_at TEXT DEFAULT (datetime('now'))
        )
    """)

    # Daily updates — metrics, milestones, key info
    cur.execute("""
        CREATE TABLE IF NOT EXISTS daily_updates (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            date TEXT NOT NULL,
            area TEXT NOT NULL,
            update_type TEXT NOT NULL,
            update_text TEXT NOT NULL,
            created_at TEXT DEFAULT (datetime('now'))
        )
    """)

    # Collection log — tracks when data was pulled
    cur.execute("""
        CREATE TABLE IF NOT EXISTS collection_log (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            source TEXT NOT NULL,
            collected_at TEXT DEFAULT (datetime('now')),
            records_added INTEGER DEFAULT 0,
            status TEXT
        )
    """)

    conn.commit()
    return conn


def get_work_log_stats(conn):
    """Return summary stats."""
    cur = conn.cursor()
    return {
        "work_log_entries": cur.execute("SELECT COUNT(*) FROM work_log").fetchone()[0],
        "decisions_logged": cur.execute("SELECT COUNT(*) FROM decisions").fetchone()[0],
        "daily_updates": cur.execute("SELECT COUNT(*) FROM daily_updates").fetchone()[0],
        "business_areas": cur.execute("SELECT COUNT(*) FROM business_areas").fetchone()[0],
        "latest_date": cur.execute(
            "SELECT MAX(date) FROM work_log"
        ).fetchone()[0],
    }


def add_work_log(conn, date, area, work_done, blockers=None, wins=None, notes=None):
    """Add a work log entry."""
    cur = conn.cursor()
    cur.execute("""
        INSERT INTO work_log (date, area, work_done, blockers, wins, notes)
        VALUES (?, ?, ?, ?, ?, ?)
    """, (date, area, work_done, blockers, wins, notes))
    conn.commit()
    return cur.lastrowid


def add_decision(conn, date, area, decision, context=None, outcome=None):
    """Log a key decision."""
    cur = conn.cursor()
    cur.execute("""
        INSERT INTO decisions (date, area, decision, context, outcome)
        VALUES (?, ?, ?, ?, ?)
    """, (date, area, decision, context, outcome))
    conn.commit()
    return cur.lastrowid


def add_daily_update(conn, date, area, update_type, update_text):
    """Log a daily update."""
    cur = conn.cursor()
    cur.execute("""
        INSERT INTO daily_updates (date, area, update_type, update_text)
        VALUES (?, ?, ?, ?)
    """, (date, area, update_type, update_text))
    conn.commit()
    return cur.lastrowid


def add_business_area(conn, name, description=None):
    """Add a business area."""
    cur = conn.cursor()
    cur.execute("""
        INSERT OR IGNORE INTO business_areas (name, description) VALUES (?, ?)
    """, (name, description))
    conn.commit()


def search_work_log(conn, query, area=None, limit=10):
    """Search work log entries."""
    cur = conn.cursor()
    if area:
        rows = cur.execute("""
            SELECT * FROM work_log
            WHERE (work_done LIKE ? OR blockers LIKE ? OR wins LIKE ? OR notes LIKE ?)
            AND area = ?
            ORDER BY date DESC LIMIT ?
        """, (f"%{query}%", f"%{query}%", f"%{query}%", f"%{query}%", area, limit)).fetchall()
    else:
        rows = cur.execute("""
            SELECT * FROM work_log
            WHERE work_done LIKE ? OR blockers LIKE ? OR wins LIKE ? OR notes LIKE ?
            ORDER BY date DESC LIMIT ?
        """, (f"%{query}%", f"%{query}%", f"%{query}%", f"%{query}%", limit)).fetchall()
    return rows


def get_area_work(conn, area, days=7):
    """Get recent work for a specific area."""
    cur = conn.cursor()
    rows = cur.execute("""
        SELECT * FROM work_log
        WHERE area = ? AND date >= date('now', ?)
        ORDER BY date DESC
    """, (area, f"-{days} days")).fetchall()
    return rows


if __name__ == "__main__":
    conn = init_db()
    print(f"IntelOS database initialized at: {DB_PATH}")
    stats = get_work_log_stats(conn)
    print(f"Tables: business_areas={stats['business_areas']}, "
          f"work_log={stats['work_log_entries']}, "
          f"decisions={stats['decisions_logged']}, "
          f"daily_updates={stats['daily_updates']}")
    conn.close()
