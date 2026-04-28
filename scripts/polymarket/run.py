"""PolyTrack — Polymarket Live Dashboard Runner.

Usage:
    python scripts/polymarket/run.py

Or run the dashboard directly:
    python scripts/polymarket/dashboard.py

Opens at: http://localhost:5050
"""
import sys
from pathlib import Path

# Ensure scripts/polymarket is in path
sys.path.insert(0, str(Path(__file__).resolve().parent))

from dashboard import run

if __name__ == "__main__":
    print("Starting PolyTrack Dashboard...")
    print("  Dashboard: http://localhost:5050")
    print("  Press Ctrl+C to stop")
    run()
