"""Polymarket Live Dashboard — Flask Web Server.

Serves a live dashboard at http://localhost:5050

Run:
    python scripts/polymarket/dashboard.py
"""
import json
import threading
import time
from datetime import datetime, timezone
from pathlib import Path

from flask import Flask, render_template_string, jsonify, request

import sys
from pathlib import Path
WORKSPACE = Path(__file__).resolve().parent.parent.parent
sys.path.insert(0, str(WORKSPACE / "scripts" / "polymarket"))

from db import (
    init_db, get_todays_markets, get_active_markets, get_my_bets,
    get_pnl_summary, place_bet, resolve_market, get_connection,
    get_unsettled_bets
)
from fetcher import sync_to_db, fetch_today_markets, fetch_updown_markets

app = Flask(__name__)

# ── Live data cache (refreshed every 5 min) ────────────────────────────────
_cache = {"markets": [], "today": [], "updown": [], "last_sync": None, "syncing": False}
_cache_lock = threading.Lock()


def background_sync():
    """Background thread: sync every 5 minutes."""
    while True:
        try:
            with _cache_lock:
                _cache["syncing"] = True
            result = sync_to_db()
            today = fetch_today_markets()
            updown = fetch_updown_markets()
            with _cache_lock:
                _cache["markets"] = result.get("today_markets", [])
                _cache["today"] = today
                _cache["updown"] = updown
                _cache["last_sync"] = datetime.now().strftime("%H:%M:%S")
                _cache["syncing"] = False
            print(f"[{datetime.now().strftime('%H:%M:%S')}] Synced: "
                  f"{len(today)} today, {len(updown)} up/down")
        except Exception as e:
            print(f"Sync error: {e}")
            with _cache_lock:
                _cache["syncing"] = False
        time.sleep(300)  # 5 minutes


# ── HTML Dashboard ──────────────────────────────────────────────────────────

DASHBOARD_HTML = """
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>PolyTrack — Live Prediction Market Dashboard</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg: #0d0d0f;
    --surface: #16161a;
    --border: #2a2a30;
    --text: #e8e8ec;
    --muted: #8888a0;
    --green: #00d97e;
    --red: #ff4d6a;
    --yellow: #ffc107;
    --blue: #4dabf7;
    --purple: #da77f2;
  }

  body { font-family: 'Segoe UI', system-ui, sans-serif; background: var(--bg); color: var(--text); min-height: 100vh; }

  /* Header */
  header {
    background: var(--surface);
    border-bottom: 1px solid var(--border);
    padding: 16px 24px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: sticky; top: 0; z-index: 100;
  }
  header h1 { font-size: 20px; font-weight: 700; color: var(--blue); letter-spacing: -0.5px; }
  .header-right { display: flex; align-items: center; gap: 16px; }
  .sync-status { font-size: 12px; color: var(--muted); }
  .sync-status.live { color: var(--green); }
  .btn {
    padding: 8px 16px;
    border-radius: 6px;
    border: none;
    cursor: pointer;
    font-size: 13px;
    font-weight: 600;
    transition: all 0.2s;
  }
  .btn-primary { background: var(--blue); color: #000; }
  .btn-primary:hover { background: #6dbfff; }
  .btn-ghost { background: transparent; color: var(--muted); border: 1px solid var(--border); }
  .btn-ghost:hover { border-color: var(--text); color: var(--text); }
  .spinner { display: inline-block; width: 12px; height: 12px; border: 2px solid var(--muted); border-top-color: var(--blue); border-radius: 50%; animation: spin 0.8s linear infinite; }
  @keyframes spin { to { transform: rotate(360deg); } }

  /* Stats bar */
  .stats-bar {
    display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
    gap: 12px; padding: 20px 24px;
    background: var(--surface); border-bottom: 1px solid var(--border);
  }
  .stat-card {
    background: var(--bg); border: 1px solid var(--border);
    border-radius: 8px; padding: 14px 16px;
  }
  .stat-label { font-size: 11px; color: var(--muted); text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px; }
  .stat-value { font-size: 22px; font-weight: 700; }
  .stat-value.positive { color: var(--green); }
  .stat-value.negative { color: var(--red); }
  .stat-value.neutral { color: var(--blue); }

  /* Tabs */
  .tabs { display: flex; padding: 0 24px; border-bottom: 1px solid var(--border); background: var(--surface); }
  .tab {
    padding: 12px 20px; cursor: pointer; font-size: 13px; font-weight: 600;
    color: var(--muted); border-bottom: 2px solid transparent;
    transition: all 0.2s; display: flex; align-items: center; gap: 6px;
  }
  .tab:hover { color: var(--text); }
  .tab.active { color: var(--blue); border-bottom-color: var(--blue); }
  .tab .badge {
    background: var(--blue); color: #000; font-size: 11px;
    border-radius: 10px; padding: 1px 7px;
  }

  /* Main content */
  .content { padding: 20px 24px; max-width: 1400px; margin: 0 auto; }

  /* Market cards */
  .section-title { font-size: 14px; color: var(--muted); text-transform: uppercase; letter-spacing: 1px; margin-bottom: 12px; margin-top: 8px; }
  .market-list { display: flex; flex-direction: column; gap: 8px; }

  .market-card {
    background: var(--surface); border: 1px solid var(--border);
    border-radius: 10px; padding: 16px; transition: border-color 0.2s;
  }
  .market-card:hover { border-color: var(--muted); }
  .market-card.crypto { border-left: 3px solid var(--yellow); }
  .market-card.stock { border-left: 3px solid var(--blue); }
  .market-card.sports { border-left: 3px solid var(--green); }
  .market-card.geo { border-left: 3px solid var(--red); }
  .market-card.other { border-left: 3px solid var(--purple); }

  .market-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 10px; }
  .market-question { font-size: 14px; font-weight: 600; line-height: 1.4; max-width: 70%; }
  .market-meta { display: flex; align-items: center; gap: 10px; font-size: 12px; color: var(--muted); }
  .market-type { font-size: 11px; padding: 3px 8px; border-radius: 4px; text-transform: uppercase; font-weight: 700; }
  .market-type.crypto { background: rgba(255,193,7,0.15); color: var(--yellow); }
  .market-type.stock { background: rgba(77,171,247,0.15); color: var(--blue); }
  .market-type.sports { background: rgba(0,217,126,0.15); color: var(--green); }
  .market-type.geo { background: rgba(255,77,106,0.15); color: var(--red); }
  .market-type.other { background: rgba(218,119,242,0.15); color: var(--purple); }

  .odds-row { display: flex; align-items: center; gap: 8px; margin-bottom: 10px; flex-wrap: wrap; }
  .odds-btn {
    flex: 1; min-width: 80px; padding: 10px 12px; border-radius: 8px;
    border: 1px solid var(--border); cursor: pointer; text-align: center;
    transition: all 0.2s; background: var(--bg);
  }
  .odds-btn.yes { border-color: var(--green); }
  .odds-btn.no { border-color: var(--red); }
  .odds-btn:hover { transform: translateY(-2px); }
  .odds-btn .label { font-size: 12px; color: var(--muted); margin-bottom: 4px; }
  .odds-btn .price { font-size: 20px; font-weight: 700; }
  .odds-btn .implied { font-size: 11px; color: var(--muted); }
  .odds-btn.yes .price { color: var(--green); }
  .odds-btn.no .price { color: var(--red); }

  .market-actions { display: flex; align-items: center; gap: 10px; }
  .bet-input {
    background: var(--bg); border: 1px solid var(--border); border-radius: 6px;
    padding: 6px 10px; color: var(--text); font-size: 13px; width: 90px;
  }
  .bet-input:focus { outline: none; border-color: var(--blue); }
  .place-btn {
    padding: 6px 14px; border-radius: 6px; border: none;
    background: var(--blue); color: #000; font-size: 13px; font-weight: 600;
    cursor: pointer; transition: all 0.2s;
  }
  .place-btn:hover { background: #6dbfff; }
  .payout-info { font-size: 12px; color: var(--muted); }
  .payout-info span { color: var(--green); font-weight: 600; }

  .market-footer { display: flex; justify-content: space-between; align-items: center; margin-top: 8px; padding-top: 8px; border-top: 1px solid var(--border); }
  .market-vol { font-size: 12px; color: var(--muted); }
  .market-ends { font-size: 12px; color: var(--muted); }
  .market-ends.soon { color: var(--yellow); font-weight: 600; }

  /* P&L / My Bets */
  .pnl-table { width: 100%; border-collapse: collapse; margin-top: 12px; }
  .pnl-table th, .pnl-table td { padding: 10px 12px; text-align: left; border-bottom: 1px solid var(--border); font-size: 13px; }
  .pnl-table th { color: var(--muted); font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; }
  .pnl-badge { display: inline-block; padding: 3px 10px; border-radius: 12px; font-size: 12px; font-weight: 600; }
  .pnl-badge.yes { background: rgba(0,217,126,0.15); color: var(--green); }
  .pnl-badge.no { background: rgba(255,77,106,0.15); color: var(--red); }
  .profit { color: var(--green); }
  .loss { color: var(--red); }
  .win-badge { background: rgba(0,217,126,0.15); color: var(--green); padding: 2px 8px; border-radius: 4px; font-size: 11px; }
  .lose-badge { background: rgba(255,77,106,0.15); color: var(--red); padding: 2px 8px; border-radius: 4px; font-size: 11px; }

  /* Toast notification */
  .toast {
    position: fixed; bottom: 24px; right: 24px; background: var(--surface);
    border: 1px solid var(--green); border-radius: 8px; padding: 12px 20px;
    font-size: 13px; z-index: 1000; animation: slideIn 0.3s ease;
    max-width: 300px;
  }
  @keyframes slideIn { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }

  /* Auto-refresh indicator */
  .refresh-bar {
    height: 3px; background: var(--border); position: fixed; top: 0; left: 0;
    transition: width 5s linear; z-index: 200;
  }
  .refresh-bar.active { background: var(--blue); }

  /* Grid layout for market cards on wider screens */
  @media (min-width: 900px) {
    .market-list { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
  }

  .empty-state { text-align: center; padding: 60px 20px; color: var(--muted); }
  .empty-state h3 { font-size: 16px; margin-bottom: 8px; color: var(--text); }
  .empty-state p { font-size: 13px; }
  .win-rate { font-size: 13px; }
  .win-rate .wr { font-size: 20px; font-weight: 700; color: var(--green); }
</style>
</head>
<body>

<div class="refresh-bar" id="refreshBar"></div>

<header>
  <h1>PolyTrack</h1>
  <div class="header-right">
    <span class="sync-status" id="syncStatus">Loading...</span>
    <button class="btn btn-primary" onclick="refreshNow()">Refresh Now</button>
    <button class="btn btn-ghost" onclick="location.reload()">Reload</button>
  </div>
</header>

<!-- Stats Bar -->
<div class="stats-bar" id="statsBar">
  <div class="stat-card">
    <div class="stat-label">Today's Markets</div>
    <div class="stat-value neutral" id="statToday">—</div>
  </div>
  <div class="stat-card">
    <div class="stat-label">Total P&L</div>
    <div class="stat-value" id="statPnl">—</div>
  </div>
  <div class="stat-card">
    <div class="stat-label">Win / Loss</div>
    <div class="stat-value neutral" id="statRecord">—</div>
  </div>
  <div class="stat-card">
    <div class="stat-label">My Active Bets</div>
    <div class="stat-value neutral" id="statBets">—</div>
  </div>
</div>

<!-- Tabs -->
<div class="tabs">
  <div class="tab active" onclick="switchTab('today')" id="tab-today">
    Today <span class="badge" id="badge-today">0</span>
  </div>
  <div class="tab" onclick="switchTab('updown')" id="tab-updown">
    Up or Down
  </div>
  <div class="tab" onclick="switchTab('mybets')" id="tab-mybets">
    My Bets
  </div>
  <div class="tab" onclick="switchTab('history')" id="tab-history">
    History
  </div>
</div>

<!-- Main Content -->
<div class="content">

  <!-- TODAY TAB -->
  <div id="panel-today">
    <div class="section-title">Resolving Today</div>
    <div id="today-list"></div>
  </div>

  <!-- UP OR DOWN TAB -->
  <div id="panel-updown" style="display:none">
    <div class="section-title">Crypto & Stock Daily Markets</div>
    <div id="updown-list"></div>
  </div>

  <!-- MY BETS TAB -->
  <div id="panel-mybets" style="display:none">
    <div class="section-title">Active Bets</div>
    <div id="mybets-list"></div>
  </div>

  <!-- HISTORY TAB -->
  <div id="panel-history" style="display:none">
    <div class="section-title">All Settled Bets</div>
    <div id="history-list"></div>
  </div>

</div>

<script>
// ── State ──────────────────────────────────────────────────────────────────
let currentTab = 'today';
let data = { markets: [], today: [], updown: [], pnl: {}, bets: [] };
let autoRefresh = setInterval(refreshNow, 5 * 60 * 1000);

// ── Init ───────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  refreshNow();
  setInterval(updateRefreshBar, 1000);
});

// ── Refresh bar ────────────────────────────────────────────────────────────
let refreshStart = Date.now();
function updateRefreshBar() {
  const bar = document.getElementById('refreshBar');
  const elapsed = (Date.now() - refreshStart) / 1000;
  const pct = Math.min(100, (elapsed / 300) * 100);
  bar.style.width = pct + '%';
  bar.classList.toggle('active', !document.getElementById('syncStatus').textContent.includes('Synced'));
}

// ── API calls ──────────────────────────────────────────────────────────────
async function refreshNow() {
  document.getElementById('syncStatus').textContent = 'Syncing...';
  document.getElementById('syncStatus').className = 'sync-status';
  refreshStart = Date.now();

  try {
    const [statsRes, todayRes, updownRes, betsRes] = await Promise.all([
      fetch('/api/stats'),
      fetch('/api/today'),
      fetch('/api/updown'),
      fetch('/api/bets'),
    ]);
    const [stats, today, updown, bets] = await Promise.all([
      statsRes.json(), todayRes.json(), updownRes.json(), betsRes.json()
    ]);

    data = { stats, today, updown, bets };
    renderAll();
    document.getElementById('syncStatus').textContent = 'Synced ' + stats.last_sync;
    document.getElementById('syncStatus').className = 'sync-status live';
  } catch (e) {
    document.getElementById('syncStatus').textContent = 'Error: ' + e.message;
    document.getElementById('syncStatus').className = 'sync-status';
  }
}

function switchTab(tab) {
  currentTab = tab;
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  document.getElementById('tab-' + tab).classList.add('active');
  document.querySelectorAll('[id^=panel-]').forEach(p => p.style.display = 'none');
  document.getElementById('panel-' + tab).style.display = 'block';
  renderAll();
}

// ── Render ─────────────────────────────────────────────────────────────────
function renderAll() {
  renderStats();
  renderToday();
  renderUpdown();
  renderMyBets();
  renderHistory();
}

function renderStats() {
  const s = data.stats || {};
  const pnl = s.total_pnl || 0;
  document.getElementById('statToday').textContent = (data.today || []).length;
  document.getElementById('statPnl').textContent = pnl >= 0 ? '+$' + pnl.toFixed(2) : '-$' + Math.abs(pnl).toFixed(2);
  document.getElementById('statPnl').className = 'stat-value ' + (pnl >= 0 ? 'positive' : 'negative');
  document.getElementById('statRecord').textContent = (s.wins || 0) + ' / ' + (s.losses || 0);
  document.getElementById('statBets').textContent = (data.bets || []).length;
  document.getElementById('badge-today').textContent = (data.today || []).length;
}

function renderToday() {
  const container = document.getElementById('today-list');
  const markets = data.today || [];
  if (!markets.length) {
    container.innerHTML = '<div class="empty-state"><h3>No markets resolving today</h3><p>Check back as new markets are created throughout the day.</p></div>';
    return;
  }
  container.innerHTML = markets.map(m => renderMarketCard(m)).join('');
}

function renderUpdown() {
  const container = document.getElementById('updown-list');
  const markets = data.updown || [];
  if (!markets.length) {
    container.innerHTML = '<div class="empty-state"><h3>No Up or Down markets found</h3><p>Pull fresh data to load latest crypto/stock markets.</p></div>';
    return;
  }
  container.innerHTML = markets.map(m => renderMarketCard(m)).join('');
}

function renderMyBets() {
  const container = document.getElementById('mybets-list');
  const bets = (data.bets || []).filter(b => !b.resolved);
  if (!bets.length) {
    container.innerHTML = '<div class="empty-state"><h3>No active bets</h3><p>Place a bet on a market to see it here.</p></div>';
    return;
  }
  container.innerHTML = '<table class="pnl-table"><thead><tr><th>Market</th><th>Side</th><th>Amount</th><th>Price</th><th>Potential P&L</th><th>Ends</th></tr></thead><tbody>' +
    bets.map(b => {
      const outs = JSON.parse(b.outcome_prices || '[]');
      const implied = outs[0] || 0;
      const outcome_text = b.side === 'Yes' ? (outs[0] > outs[1] ? 'YES price' : 'NO price') : (outs[0] > outs[1] ? 'YES price' : 'NO price');
      const potential = (parseFloat(b.amount) / parseFloat(b.price_bought)) * 1.0 - parseFloat(b.amount);
      return '<tr>' +
        '<td style="max-width:300px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap" title="' + b.question + '">' + (b.question || '').slice(0, 50) + '</td>' +
        '<td><span class="pnl-badge ' + b.side.toLowerCase() + '">' + b.side + '</span></td>' +
        '<td>$' + parseFloat(b.amount).toFixed(2) + '</td>' +
        '<td>$' + parseFloat(b.price_bought).toFixed(2) + '</td>' +
        '<td class="' + (potential >= 0 ? 'profit' : 'loss') + '">$' + potential.toFixed(2) + '</td>' +
        '<td>' + (b.end_date || '').slice(0, 16) + '</td>' +
        '</tr>';
    }).join('') + '</tbody></table>';
}

function renderHistory() {
  const container = document.getElementById('history-list');
  const bets = (data.bets || []).filter(b => b.resolved);
  if (!bets.length) {
    container.innerHTML = '<div class="empty-state"><h3>No settled bets yet</h3><p>Your resolved bets will appear here.</p></div>';
    return;
  }
  container.innerHTML = '<table class="pnl-table"><thead><tr><th>Market</th><th>Side</th><th>Amount</th><th>Result</th><th>P&L</th></tr></thead><tbody>' +
    bets.map(b => {
      const won = b.side === b.resolution;
      return '<tr>' +
        '<td style="max-width:300px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap" title="' + b.question + '">' + (b.question || '').slice(0, 50) + '</td>' +
        '<td><span class="pnl-badge ' + b.side.toLowerCase() + '">' + b.side + '</span></td>' +
        '<td>$' + parseFloat(b.amount).toFixed(2) + '</td>' +
        '<td><span class="' + (won ? 'win-badge' : 'lose-badge') + '">' + b.resolution + '</span></td>' +
        '<td class="' + (parseFloat(b.pnl || 0) >= 0 ? 'profit' : 'loss') + '">$' + parseFloat(b.pnl || 0).toFixed(2) + '</td>' +
        '</tr>';
    }).join('') + '</tbody></table>';
}

function renderMarketCard(m) {
  const outs = JSON.parse(m.outcome_prices || '[]');
  const outcomes = JSON.parse(m.outcomes || '[]');
  const yesPrice = parseFloat(outs[0] || 0.5);
  const noPrice = parseFloat(outs[1] || 0.5);
  const yesImplied = Math.round(yesPrice * 100);
  const noImplied = Math.round(noPrice * 100);
  const marketType = m.market_type || 'other';
  const ends = (m.end_date || '').replace('T', ' ').replace('Z', ' UTC');
  const isSoon = ends.includes('2026-04-16');
  const volume = parseFloat(m.volume || 0);

  return '<div class="market-card ' + marketType + '">' +
    '<div class="market-header">' +
      '<div class="market-question" title="' + (m.question || '') + '">' + (m.question || 'Unknown Market').slice(0, 80) + '</div>' +
      '<div class="market-meta">' +
        '<span class="market-type ' + marketType + '">' + marketType + '</span>' +
        '<span>$' + (volume >= 1000 ? (volume/1000).toFixed(1) + 'K' : volume.toFixed(0)) + ' vol</span>' +
      '</div>' +
    '</div>' +
    '<div class="odds-row">' +
      '<div class="odds-btn yes">' +
        '<div class="label">YES</div>' +
        '<div class="price">$' + yesPrice.toFixed(2) + '</div>' +
        '<div class="implied">' + yesImplied + '% implied</div>' +
      '</div>' +
      '<div class="odds-btn no">' +
        '<div class="label">NO</div>' +
        '<div class="price">$' + noPrice.toFixed(2) + '</div>' +
        '<div class="implied">' + noImplied + '% implied</div>' +
      '</div>' +
    '</div>' +
    '<div class="market-actions">' +
      '<button class="place-btn" onclick="placeBet(\'' + m.id + '\', \'Yes\', ' + yesPrice + ', this)">Bet YES $</button>' +
      '<button class="place-btn" style="background:var(--red)" onclick="placeBet(\'' + m.id + '\', \'No\', ' + noPrice + ', this)">Bet NO $</button>' +
      '<input class="bet-input" type="number" placeholder="100" id="amt-' + m.id + '" min="1" step="1">' +
      '<span class="payout-info">Max payout: <span>$' + ((100 / yesPrice) * (1 - yesPrice)).toFixed(2) + '</span> on $100</span>' +
    '</div>' +
    '<div class="market-footer">' +
      '<span class="market-vol">Vol: $' + volume.toLocaleString() + '</span>' +
      '<span class="market-ends ' + (isSoon ? 'soon' : '') + '">Ends: ' + ends + '</span>' +
    '</div>' +
  '</div>';
}

// ── Place Bet ───────────────────────────────────────────────────────────────
async function placeBet(marketId, side, price, btn) {
  const input = document.getElementById('amt-' + marketId);
  const amount = parseFloat(input.value) || 100;

  try {
    const res = await fetch('/api/bet', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ market_id: marketId, side, amount, price_bought: price })
    });
    const data = await res.json();
    showToast(data.message || 'Bet placed!');
    input.value = '';
    await refreshNow();
  } catch (e) {
    showToast('Error placing bet: ' + e.message);
  }
}

function showToast(msg) {
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = msg;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}
</script>
</body>
</html>
"""


# ── Flask Routes ───────────────────────────────────────────────────────────

@app.route("/")
def index():
    return render_template_string(DASHBOARD_HTML)


@app.route("/api/stats")
def api_stats():
    conn = get_connection()
    pnl = get_pnl_summary(conn)
    bets = get_my_bets(conn)
    active = [b for b in bets if not b["resolved"]]
    conn.close()
    with _cache_lock:
        last = _cache.get("last_sync")
    return jsonify({**pnl, "active_bets": len(active), "last_sync": last or "never"})


@app.route("/api/today")
def api_today():
    with _cache_lock:
        markets = _cache.get("today", [])
    if not markets:
        # Fallback: pull fresh
        try:
            markets = fetch_today_markets()
        except:
            markets = []
    return jsonify(markets)


@app.route("/api/updown")
def api_updown():
    with _cache_lock:
        markets = _cache.get("updown", [])
    if not markets:
        try:
            markets = fetch_updown_markets()
        except:
            markets = []
    return jsonify(markets)


@app.route("/api/bets")
def api_bets():
    conn = get_connection()
    bets = get_my_bets(conn)
    conn.close()
    return jsonify([dict(b) for b in bets])


@app.route("/api/bet", methods=["POST"])
def api_place_bet():
    body = request.get_json()
    market_id = body.get("market_id")
    side = body.get("side")
    amount = float(body.get("amount", 100))
    price = float(body.get("price_bought", 0.5))

    if not market_id or side not in ("Yes", "No"):
        return jsonify({"error": "Invalid request"}), 400

    conn = get_connection()
    try:
        bet_id = place_bet(conn, market_id, side, amount, price)
        message = f"Bet placed: {side} on market for ${amount:.2f} at ${price:.2f}"
    except Exception as e:
        message = f"Bet recorded: {e}"
    conn.close()
    return jsonify({"success": True, "message": message, "bet_id": bet_id})


@app.route("/api/resolve", methods=["POST"])
def api_resolve():
    body = request.get_json()
    market_id = body.get("market_id")
    outcome = body.get("outcome")
    if not market_id or not outcome:
        return jsonify({"error": "Invalid request"}), 400
    conn = get_connection()
    resolve_market(conn, market_id, outcome)
    conn.close()
    return jsonify({"success": True, "message": f"Market resolved: {outcome}"})


@app.route("/api/sync", methods=["POST"])
def api_sync():
    threading.Thread(target=lambda: sync_to_db(), daemon=True).start()
    return jsonify({"success": True, "message": "Sync triggered"})


# ── Start ───────────────────────────────────────────────────────────────────

def run():
    print("Starting Polymarket Dashboard server...")
    print("Open http://localhost:5050 in your browser")
    # Start background sync thread
    t = threading.Thread(target=background_sync, daemon=True)
    t.start()
    # Initial sync
    try:
        result = sync_to_db()
        print(f"Initial sync: {result['markets_synced']} markets, {result['today_count']} resolving today")
        with _cache_lock:
            _cache["today"] = result.get("today_markets", [])
            _cache["updown"] = fetch_updown_markets()
            _cache["last_sync"] = datetime.now().strftime("%H:%M:%S")
    except Exception as e:
        print(f"Initial sync error: {e}")

    app.run(host="0.0.0.0", port=5050, debug=False, use_reloader=False)


if __name__ == "__main__":
    run()
