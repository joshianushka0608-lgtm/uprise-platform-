"""IntelOS Custom Work Log Collector.

Reads from context/daily-work-log.md — a simple daily log format.
Run this daily to collect yesterday's updates into the database.
"""
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))

from datetime import date, timedelta
from db import get_connection, add_work_log, add_decision, add_daily_update, init_db

WORK_LOG_PATH = Path(__file__).resolve().parent.parent.parent / "context" / "daily-work-log.md"


def collect(days=1):
    """Collect work log entries from the last N days."""
    if not WORK_LOG_PATH.exists():
        return 0

    conn = get_connection()
    init_db()

    content = WORK_LOG_PATH.read_text(encoding="utf-8")
    entries_added = 0

    for i in range(days):
        log_date = (date.today() - timedelta(days=i)).isoformat()

        # Find section for this date
        section_header = f"## {log_date}"
        if section_header not in content:
            continue

        idx = content.index(section_header)
        end_idx = content.index("## ", idx + len(section_header)) if "## " in content[idx + len(section_header):] else len(content)
        section = content[idx:end_idx].strip()

        # Parse each area within the section
        areas = ["Resob.ai", "Corntub", "Father's Business", "Personal"]
        for area in areas:
            area_header = f"### {area}"
            if area_header in section:
                area_idx = section.index(area_header)
                next_area = None
                for next_area_candidate in areas:
                    if next_area_candidate != area and f"### {next_area_candidate}" in section[area_idx:]:
                        na_idx = section.index(f"### {next_area_candidate}", area_idx + len(area_header))
                        if next_area is None or na_idx < next_area:
                            next_area = na_idx
                area_end = next_area if next_area else len(section)
                area_section = section[area_idx + len(area_header):area_end].strip()

                work_done = blockers = wins = notes = None
                for line in area_section.split("\n"):
                    line = line.strip()
                    if line.startswith("- **Work:**") or line.startswith("- Work:"):
                        work_done = line.split(":", 1)[1].strip().lstrip("- ").strip()
                    elif line.startswith("- **Blockers:**") or line.startswith("- Blockers:"):
                        blockers = line.split(":", 1)[1].strip().lstrip("- ").strip()
                    elif line.startswith("- **Wins:**") or line.startswith("- Wins:"):
                        wins = line.split(":", 1)[1].strip().lstrip("- ").strip()
                    elif line.startswith("- **Notes:**") or line.startswith("- Notes:"):
                        notes = line.split(":", 1)[1].strip().lstrip("- ").strip()

                if work_done or blockers or wins:
                    add_work_log(conn, log_date, area, work_done, blockers, wins, notes)
                    entries_added += 1

        # Also check for decisions in this date section
        if "### Decisions" in section:
            dec_idx = section.index("### Decisions")
            dec_section = section[dec_idx + len("### Decisions"):].strip()
            dec_lines = [l.strip() for l in dec_section.split("\n") if l.strip().startswith("-")]
            for line in dec_lines:
                # Format: "- [Area] Decision text"
                if line.startswith("-"):
                    rest = line.lstrip("- ").strip()
                    if " — " in rest:
                        area_part, decision_text = rest.split(" — ", 1)
                        area_clean = area_part.strip("[] ")
                        add_decision(conn, log_date, area_clean, decision_text)

        # Also check for key updates in this date section
        if "### Key Updates" in section:
            upd_idx = section.index("### Key Updates")
            upd_section = section[upd_idx + len("### Key Updates"):].strip()
            upd_lines = [l.strip() for l in upd_section.split("\n") if l.strip().startswith("-")]
            for line in upd_lines:
                if line.startswith("-") and ":" in line:
                    rest = line.lstrip("- ").strip()
                    if " — " in rest:
                        update_type, update_text = rest.split(" — ", 1)
                        area_name = area  # use last parsed area
                        add_daily_update(conn, log_date, area_name, update_type.strip("[] "), update_text)

    conn.close()
    return entries_added


if __name__ == "__main__":
    entries = collect(days=7)
    print(f"Work log collector: {entries} entries added")
