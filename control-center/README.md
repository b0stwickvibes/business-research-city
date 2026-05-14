# Control Center (`business-research-city`)

React + Vite + Tailwind + **lucide-react** + lightweight shadcn-style primitives.

## Two modes

| Tab                 | Purpose                                                                                                                                                          |
| ------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Deal pins**       | Multi-market grid (imports `*.json` from `../cities/*/data/inventory/`). Anchors venues from `_meta.venues`, haversine miles, expandable PDP/broker breakout.    |
| **Research wizard** | Guided `/business-research-city …` composer, trade-area help text, stakeholder brief box, clipboard handoff aligned with repo layout + `cities/<slug>/_intake/`. |

To register another market add a curated inventory JSON (with `_meta.venues`) and extend `src/config/research-markets.tsx`.

Design brief, IA, tokens, tasks, and design review: **`../.design/control-center/`**.  
Regenerate review screenshots (Playwright): `npx playwright install chromium` once, then **`npm run screenshots:design-review`**.

## Quick start

```bash
cd control-center
npm install
npm run dev
```

Default **http://127.0.0.1:5173/**

### One dev server at a time

`npm run dev` uses **`--strictPort`**: if port **5173** is already taken, Vite **exits with an error** instead of silently starting on 5174 (which used to leave multiple servers running).

If you see “port already in use,” stop the old process—e.g. in Terminal:

```bash
lsof -i :5173
kill <PID>
```

(or close the terminal tab where the first `npm run dev` is still running).

```bash
npm run build && npm run preview
```

## Data model

Inventory bundles are imported via the Vite alias `@repo` → repository root. Coordinates are **approximate centroids**; miles are **straight-line**, not drive time.

## New city skeleton (repo root)

```bash
./scripts/init-city-structure.sh your-city-slug
```

Then drop stakeholder context in `cities/your-city-slug/_intake/request.yaml` (see `cities/_intake/example.request.yaml`).

## Porting components

`CityInventoryDashboard.tsx`, `CityDashboard.tsx`, and `src/config/*` can be vendored into another host app; keep `resolve.alias["@repo"]` pointed at the artifact root or replace JSON imports with fetch.
