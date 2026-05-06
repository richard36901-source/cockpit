# Cockpit

Personal mission control. Read-only dashboard. Today + Work + Market in one glance.

> **Status: v0.1 · MOCK MODE.** All data is hard-coded. APIs to be wired later.

---

## Files

```
cockpit/
├── index.html              ← the cockpit (single-file UI)
├── manifest.json           ← PWA manifest
├── sw.js                   ← service worker (offline cache)
├── vercel.json             ← deploy config (headers + clean URLs)
├── icon-180.png            ← iOS apple-touch-icon
├── icon-192.png            ← PWA standard
├── icon-512.png            ← PWA splash
├── icon-512-maskable.png   ← Android safe-zone icon
└── favicon-32.png          ← browser tab
```

---

## Deploy to Vercel

**Option A — Vercel CLI (fastest):**
```bash
cd cockpit
npx vercel --prod
```
Pick a project name like `cockpit` and confirm. Done. URL: `cockpit-<hash>.vercel.app`.

**Option B — GitHub + Vercel dashboard:**
1. Push the `cockpit/` folder to a private GitHub repo.
2. In Vercel dashboard → New Project → Import the repo.
3. Framework Preset: **Other**. Build command: empty. Output dir: `./`.
4. Deploy.

**Custom domain (recommended):**
- In Vercel project settings → Domains → add `cockpit.autoscale.co.il` (or whatever).
- In Cloudflare DNS → add CNAME `cockpit` → `cname.vercel-dns.com` (proxy OFF).

---

## Install as iPhone PWA

Once deployed:
1. Open the URL in **Safari** on your iPhone (must be Safari, not Chrome).
2. Tap the share icon (square with arrow up).
3. Scroll down → **Add to Home Screen**.
4. Name it "Cockpit" → Add.
5. Now it sits on your home screen with the reticle icon and opens fullscreen — no Safari chrome.

It works offline (cached shell). When the data layer is wired, it will refresh on launch.

---

## Hooking up real data (later)

The mock arrays in `index.html` need to be replaced with real fetches. Recommended path:

| Source | How |
|---|---|
| Apple Calendar | iOS Shortcut → POST events to a Make.com webhook → write to Supabase |
| Reminders | Same as above (separate Shortcut runs daily) |
| monday.com | GraphQL with AutoScale API token → Vercel serverless function → cache 60s |
| Crypto prices | CoinGecko `/simple/price` (free, public) → direct fetch from client |
| Holdings | Supabase table, manual entry (or Binance/Bybit API) |
| Trades | Exchange API for crypto · manual log for FTMO/funded accounts |

Architecture:
```
Cockpit (Vercel static)
    │
    ├─ /api/today    → Supabase (cal + reminders)
    ├─ /api/work     → monday.com GraphQL (cached)
    ├─ /api/market   → CoinGecko + Supabase holdings
    └─ Cron every 60s refreshes cache
```

When you're ready, this becomes a Next.js project (or stays static + Vercel functions). Either way the UI stays the same.

---

## Updating

Bump `VERSION` in `sw.js` whenever you ship a change, otherwise the service worker will keep serving the cached version on the iPhone.

```js
const VERSION = 'cockpit-v0.1.1';  // ← bump this
```

---

## Brand

- Background: `#060d1a`
- Blue: `#3a8ef6`
- Teal: `#1dffd4`
- Amber: `#ffb547`
- Red: `#ff5d6c`
- Violet: `#a78bff`
- Fonts: Sora (display) + Space Mono (data)
