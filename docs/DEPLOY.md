# Deploy: GitHub + Zo (live dashboard)

This repo is the **single source of truth** for site-selection artifacts and the **control center** static UI.

## 1. Git remote (GitHub: `b0stwicvibes`)

Create an empty repo **without** initializing README (local tree already exists), then:

```bash
cd /path/to/business-research-city
git remote add origin git@github.com:b0stwicvibes/business-research-city.git
git branch -M main
git push -u origin main
```

HTTPS:

```bash
git remote add origin https://github.com/b0stwicvibes/business-research-city.git
```

## 2. Production build (control center)

From repo root:

```bash
cd control-center
npm ci
npm run build
```

Static assets are in **`control-center/dist/`**. That folder is what you serve on Zo (or any static host).

## 3. Zo platform

**Goal:** serve `control-center/dist` as the live dashboard, and redeploy when `main` updates.

Implementation on Zo varies by feature set (static site upload, git pull + build, automation). Typical pattern:

1. Point Zo’s site root at the built **`dist`** output (upload once, or sync on each release).
2. After you **push** new inventory JSON + run **`npm run build`**, upload/sync **`dist`** again — or wire Zo automation to run build on push.

The in-app **Refresh** button runs `window.location.reload()` so the browser picks up **a new deploy** after you publish updated `dist`. It does not re-pull git by itself (that’s server-side).

## 4. Staying up to date (content)

| Layer | How it stays fresh |
| ----- | ------------------- |
| Inventory JSON | Commit under `cities/<slug>/data/inventory/`, extend `research-markets.tsx` when adding markets, then rebuild. |
| Live site | Redeploy `dist` to Zo (manual or automated). |
| Browser | User clicks **Refresh** after a new deploy to avoid stale cached HTML (hard refresh still available). |

## 5. Optional automation (later)

- GitHub Action on `push` to `main`: `npm ci && npm run build` in `control-center/`, artifact `dist`, then Zo API or SSH deploy (if Zo exposes it).
- Or Zo scheduled job: `git pull` → `npm run build` → publish static dir.
