import sys
sys.stdout.reconfigure(encoding='utf-8')
import json, urllib.request, time

BASE = 'https://gamma-api.polymarket.com'

def api(path, params=None):
    url = BASE + path
    if params:
        url += '?' + '&'.join(f'{k}={v}' for k, v in params.items())
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0', 'Accept': 'application/json'})
    with urllib.request.urlopen(req, timeout=15) as r:
        return json.loads(r.read())

slugs = [
    # Apr 16 (remaining unresolved)
    'bitcoin-up-or-down-on-april-16-2026', 'ethereum-up-or-down-on-april-16-2026',
    'coin-up-or-down-on-april-16-2026', 'meta-up-or-down-on-april-16-2026',
    'xrp-up-or-down-on-april-16-2026', 'open-up-or-down-on-april-16-2026',
    'ndx-up-or-down-on-april-16-2026', 'spx-up-or-down-on-april-16-2026',
    'spx-opens-up-or-down-on-april-16-2026', 'bitcoin-etf-flows-on-april-16',
    # Apr 17
    'bitcoin-up-or-down-on-april-17-2026', 'ethereum-up-or-down-on-april-17-2026',
    'spx-up-or-down-on-april-17-2026', 'meta-up-or-down-on-april-17-2026',
    'xrp-up-or-down-on-april-17-2026', 'coin-up-or-down-on-april-17-2026',
    'open-up-or-down-on-april-17-2026', 'ndx-up-or-down-on-april-17-2026',
    'will-there-be-a-us-iran-nuclear-deal-by-april-17-2026',
    'will-there-be-a-russia-ukraine-ceasefire-by-april-17',
    'will-the-iranian-regime-fall-by-the-end-of-2026',
]

markets = {}
for slug in slugs:
    try:
        data = api('/markets', {'slug': slug})
        if data:
            m = data[0] if isinstance(data, list) else data
            mid = m.get('id', '')
            if mid not in markets:
                markets[mid] = m
    except:
        pass
    time.sleep(0.12)

def payout(amt, price):
    return (amt / price) * (1.0 - price) if price > 0.01 else 0

today = []
tomorrow = []
iran_deal = None
iran_regime = None

for mid, m in markets.items():
    q = m.get('question', '')
    outs = json.loads(m.get('outcomePrices', '[]'))
    yes = float(outs[0]) if outs else 0
    no = float(outs[1]) if len(outs) > 1 else 0
    vol = float(m.get('volumeNum', 0))
    ends = m.get('endDate', '')[:16]

    if 'april-16' in q.lower() or 'april 16' in q.lower():
        if yes >= 0.99:
            continue  # already resolved at YES
        today.append({'q': q, 'yes': yes, 'no': no, 'vol': vol, 'ends': ends})
    elif 'april-17' in q.lower() or 'april 17' in q.lower():
        if 'iran' in q.lower() and 'nuclear deal' in q.lower():
            iran_deal = {'q': q, 'yes': yes, 'no': no, 'vol': vol, 'ends': ends}
        elif 'iran' in q.lower() and 'regime' in q.lower():
            iran_regime = {'q': q, 'yes': yes, 'no': no, 'vol': vol, 'ends': ends}
        else:
            tomorrow.append({'q': q, 'yes': yes, 'no': no, 'vol': vol, 'ends': ends})

PER = 100.0 / max(len(tomorrow), 1)

# ═══════════════════════════════════════════════════════════════════════════
print('=' * 110)
print('  WHALE WATCH 24HR — LIVE PRICES')
print('  Updated: Apr 16, 2026 | Source: Polymarket Gamma API')
print('=' * 110)

# ── TODAY (Apr 16) — unresolved ──────────────────────────────────────────────
print()
print('  HOUR 0-6  |  RESOLVING TODAY (Apr 16) — Still Open')
print('  ' + '-' * 105)
print(f'  {"Market":<55} {"YES":>6} {"NO":>6} {"VOL":>10} {"ENDS":>14} {"$100 YES":>10} {"$100 NO":>10}')
print('  ' + '-' * 105)

for m in today:
    print(f'  {m["q"][:55]:<55} {m["yes"]:>6.2f} {m["no"]:>6.2f} {m["vol"]:>10,.0f} {m["ends"]:>14} {payout(100,m["yes"]):>10.2f} {payout(100,m["no"]):>10.2f}')

# Already resolved today
locked = [mid for mid, m in markets.items() if ('april-16' in m['question'].lower() or 'april 16' in m['question'].lower()) and float(json.loads(m.get('outcomePrices','[]'))[0]) >= 0.99]
if locked:
    print()
    print('  ALREADY RESOLVED TODAY (Apr 16):')
    for mid, m in markets.items():
        q = m.get('question','')
        outs = json.loads(m.get('outcomePrices','[]'))
        yes = float(outs[0]) if outs else 0
        if ('april-16' in q.lower() or 'april 16' in q.lower()) and yes >= 0.99:
            print(f'    {q[:55]:<55} — RESOLVED YES at ${yes:.2f}')

print()
print('  WHALE VERDICT — TODAY (Apr 16):')
print('  ' + '-' * 80)

# Today's recommendations
btc16 = next((m for m in today if 'bitcoin' in m['q'].lower()), None)
coin16 = next((m for m in today if 'coin' in m['q'].lower() and 'bitcoin' not in m['q'].lower()), None)
meta16 = next((m for m in today if 'meta' in m['q'].lower()), None)
ndx16 = next((m for m in today if 'ndx' in m['q'].lower()), None)
spx16 = next((m for m in today if 'spx' in m['q'].lower() and 'opens' not in m['q'].lower()), None)
etf16 = next((m for m in today if 'etf' in m['q'].lower()), None)

recs_today = []
if btc16 and btc16['yes'] < 0.99:
    recs_today.append(('BTC Apr 16', 'YES', btc16['yes']))
if coin16:
    recs_today.append(('COIN Apr 16', 'YES', coin16['yes']))
if meta16:
    recs_today.append(('META Apr 16', 'YES', meta16['yes']))
if ndx16:
    recs_today.append(('NDX Apr 16', 'YES', ndx16['yes']))
if spx16:
    recs_today.append(('SPX Apr 16', 'YES', spx16['yes']))

for name, rec, price in recs_today:
    ev = payout(100, price)
    print(f'    {name:<20} BET {rec:<4} at ${price:.2f}  |  ${ev:.2f} per $100')

# ── TOMORROW (Apr 17) ───────────────────────────────────────────────────────
print()
print('=' * 110)
print('  HOUR 6-24  |  RESOLVING TOMORROW (Apr 17)')
print('=' * 110)

print()
print(f'  {"Market":<55} {"YES":>6} {"NO":>6} {"VOL":>10} {"ENDS":>14} {"$100 YES":>10} {"$100 NO":>10}')
print('  ' + '-' * 105)
for m in tomorrow:
    print(f'  {m["q"][:55]:<55} {m["yes"]:>6.2f} {m["no"]:>6.2f} {m["vol"]:>10,.0f} {m["ends"]:>14} {payout(100,m["yes"]):>10.2f} {payout(100,m["no"]):>10.2f}')

# Iran geopolitical
if iran_deal:
    print()
    print('  GEOPOLITICAL — IRAN DEAL BY APRIL 17')
    print('  ' + '-' * 80)
    print(f'    {iran_deal["q"][:65]}')
    print(f'    YES: ${iran_deal["yes"]:.2f} ({iran_deal["yes"]*100:.0f}%) | NO: ${iran_deal["no"]:.2f} ({iran_deal["no"]*100:.0f}%)')
    print(f'    Pakistan-mediated talks FRI Apr 17 — deal announcement possible')
    print(f'    WHALE: BET NO at ${iran_deal["no"]:.2f}  |  ${payout(100,iran_deal["no"]):.2f} per $100')

if iran_regime:
    print()
    print('  GEOPOLITICAL — IRAN REGIME FALLS BY END OF 2026')
    print('  ' + '-' * 80)
    print(f'    {iran_regime["q"][:65]}')
    print(f'    YES: ${iran_regime["yes"]:.2f} ({iran_regime["yes"]*100:.0f}%) | NO: ${iran_regime["no"]:.2f} ({iran_regime["no"]*100:.0f}%)')
    print(f'    Vol: ${iran_regime["vol"]:,.0f} — Whale market, near-certain')
    print(f'    WHALE: BET NO at ${iran_regime["no"]:.2f}  |  ${payout(100,iran_regime["no"]):.2f} per $100')

# ── WHALE ANALYSIS + RECOMMENDATIONS ───────────────────────────────────────
print()
print('=' * 110)
print('  WHALE ANALYSIS — APR 17 MARKETS')
print('=' * 110)

btc17   = next((m for m in tomorrow if 'bitcoin'    in m['q'].lower()), None)
eth17   = next((m for m in tomorrow if 'ethereum'  in m['q'].lower()), None)
spx17   = next((m for m in tomorrow if 'spx'       in m['q'].lower()), None)
meta17  = next((m for m in tomorrow if 'meta'        in m['q'].lower()), None)
xrp17   = next((m for m in tomorrow if 'xrp'         in m['q'].lower()), None)
coin17  = next((m for m in tomorrow if 'coin'       in m['q'].lower() and 'bitcoin' not in m['q'].lower()), None)
open17  = next((m for m in tomorrow if 'open'        in m['q'].lower() and 'up' in m['q'].lower()), None)
ndx17   = next((m for m in tomorrow if 'ndx'         in m['q'].lower()), None)

# (market_dict, recommendation, our_probability, signal)
analyses = []
if btc17:   analyses.append((btc17,  'NO',  0.44, 'BTC DOWN: fell from $74,900 peak to $74,500. Rally faded. No catalyst.'))
if eth17:   analyses.append((eth17,  'NO',  0.48, 'ETH DOWN: correlated with BTC. Both fell. No recovery catalyst.'))
if spx17:   analyses.append((spx17,  'YES', 0.62, 'SPX UP: ceasefire = stocks UP. 51% market vs our 62% = +11% EDGE.'))
if meta17:  analyses.append((meta17, 'YES', 0.60, 'META UP: tech rally + ceasefire. 50% vs our 60% = +10% EDGE.'))
if xrp17:   analyses.append((xrp17,  'NO',  0.50, 'XRP DOWN: 52% NO market. Low conviction. Skip or tiny.'))
if coin17:  analyses.append((coin17, 'NO',  0.52, 'COIN DOWN: tracks crypto. BTC/ETH both DOWN.'))
if ndx17:   analyses.append((ndx17,  'YES', 0.58, 'NDX UP: ceasefire bullish for tech. Marginal edge.'))
if open17:  analyses.append((open17, 'YES', 0.52, 'OPEN: thin volume, low confidence. Skip.'))

print()
print(f'  {"#":<3} {"Market":<30} {"Rec":<5} {"Our%":<6} {"Mkt%":<6} {"Edge":<7} {"Price":<7} {"Win$100":<11} {"Signal"}')
print('  ' + '-' * 130)
for i, (m, rec, our_pct, signal) in enumerate(analyses, 1):
    price = m['yes'] if rec == 'YES' else m['no']
    mkt_pct = m['yes'] if rec == 'YES' else m['no']
    edge = our_pct - mkt_pct
    edge_str = f'+{edge:.0%}' if edge >= 0 else f'{edge:.0%}'
    ev = payout(100, price)
    conf = 'HIGH EDGE' if edge >= 0.10 else ('MEDIUM' if edge >= 0.05 else 'LOW EDGE')
    print(f'  {i:<3} {m["q"][:30]:<30} {rec:<5} {our_pct:.0%}    {mkt_pct:.0%}    {edge_str:<7} ${price:.2f}  ${ev:<10.2f} {conf}: {signal}')

# ── P&L COMPARISON ───────────────────────────────────────────────────────────
print()
print('=' * 110)
print('  P&L — GOING WITH vs GOING AGAINST RECOMMENDATION')
print(f'  Equal distribution: $100 / {len(analyses)} markets = ${PER:.2f} each')
print('=' * 110)

total_with = 0
total_against = 0
for m, rec, our_pct, signal in analyses:
    price = m['yes'] if rec == 'YES' else m['no']
    opp = m['no'] if rec == 'YES' else m['yes']
    w = payout(PER, price)
    a = payout(PER, opp)
    total_with += w
    total_against += a
    name = m['q'][:35]
    print(f'  {name:<35} WITH: ${w:>+7.2f}  |  AGAINST: ${a:>+7.2f}')

print(f'  {"TOTAL":<35} WITH: ${total_with:>+7.2f}  |  AGAINST: ${total_against:>+7.2f}')
print()
diff = total_with - total_against
print(f'  Net difference: ${diff:+.2f} — going WITH saves ${abs(diff):.2f} vs going AGAINST')
if total_against > total_with:
    print(f'  NOTE: Going AGAINST pays more IF predictions are right — but higher risk')

# ── EXPECTED VALUE ───────────────────────────────────────────────────────────
print()
print('=' * 110)
print('  EXPECTED VALUE — APR 17 WHALE BETS')
print('=' * 110)
total_ev = 0
for m, rec, our_pct, signal in analyses:
    price = m['yes'] if rec == 'YES' else m['no']
    win = payout(PER, price)
    lose = -PER
    ev = (our_pct * win) + ((1 - our_pct) * lose)
    total_ev += ev
    conf = 'HIGH' if abs(our_pct - 0.5) >= 0.10 else 'MED' if abs(our_pct - 0.5) >= 0.05 else 'LOW'
    print(f'  {m["q"][:35]:<35} {rec} at ${price:.2f} — EV: ${ev:+.2f}  (conf: {conf})')
print(f'  {"TOTAL EXPECTED VALUE":<35} ${total_ev:+.2f} per $100 distributed')
print(f'  {"Per dollar staked":<35} ${total_ev/100:+.4f}')

# ── WHALE VERDICT ────────────────────────────────────────────────────────────
print()
print('=' * 110)
print('  WHALE VERDICT — 24HR WATCH')
print('=' * 110)
strong = [(m, rec, our_pct) for m, rec, our_pct, s in analyses if our_pct - (m['yes'] if rec == 'YES' else m['no']) >= 0.10]
weak   = [(m, rec, our_pct) for m, rec, our_pct, s in analyses if our_pct - (m['yes'] if rec == 'YES' else m['no']) < 0.05]
print(f'  {len(strong)} STRONG EDGE BETS (>= +10% edge):')
for m, rec, our_pct in strong:
    price = m['yes'] if rec == 'YES' else m['no']
    print(f'    - {m["q"][:45]:<45} BET {rec} at ${price:.2f}  (our {our_pct:.0%} vs market {price:.0%})')
print(f'  {len(weak)} WEAK/NO EDGE BETS:')
for m, rec, our_pct in weak:
    price = m['yes'] if rec == 'YES' else m['no']
    print(f'    - {m["q"][:45]:<45} {rec} at ${price:.2f}  (SKIP)')
if iran_deal:
    print(f'  + GEOPOLITICAL — Iran Deal Apr 17: BET NO at ${iran_deal["no"]:.2f}')
if iran_regime:
    print(f'  + LONG-TERM — Iran Regime Falls: BET NO at ${iran_regime["no"]:.2f}')
print()
print('  BEST WHALE PLAYS:')
print('    1. SPX Apr 17 — BET YES at ~$0.51 — +11% edge, ceasefire bullish')
print('    2. META Apr 17 — BET YES at ~$0.50 — +10% edge, 50/50 whale spot')
print('    3. BTC Apr 17  — BET NO at ~$0.59 — DOWN momentum confirmed today')
print(f'  EXPECTED PROFIT on $100 equal stake: ${total_ev:+.2f}')
print('=' * 110)
