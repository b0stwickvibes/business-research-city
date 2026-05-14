# Deploy: GitHub + Zo (live dashboard)

This repo is the **single source of truth** for site-selection artifacts and the **control center** static UI.

## 1. Git remote (GitHub: `b0stwickvibes`)

**Org/user name uses `b0stwickvibes`** (with **ck** in “wick”).

Create an empty repo **without** initializing README (local tree already exists), then:

```bash
cd /path/to/business-research-city
git remote add origin git@github.com:b0stwickvibes/business-research-city.git
git branch -M main
git push -u origin main
```

If `origin` already exists but points at a typo URL:

```bash
git remote set-url origin git@github.com:b0stwickvibes/business-research-city.git
```

HTTPS:

```bash
git remote set-url origin https://github.com/b0stwickvibes/business-research-city.git
```

## 2. Production build (control center)

From repo root:

```bash
cd control-center
npm ci
npm run build
```

Static assets are in **`control-center/dist/`**. That folder is what you serve on Zo (or any static host).

## 3. CI build artifact (GitHub Actions)

On push to **`main`**, when `control-center/**` or `.github/workflows/control-center.yml` changes, Actions runs **`npm ci` + `npm run build`** and uploads the **`control-center-dist`** artifact. Download it for Zo or attach to a release.

## 4. Zo platform

See **`docs/ZO.md`** for hosting options (static service, artifact download, Zo Sites / `publish_site`).

The in-app **Refresh** button runs `window.location.reload()` after a new deploy. It does not run `git pull` on the server.

## 5. Staying up to date (content)

| Layer          | How it stays fresh                                                                                             |
| -------------- | -------------------------------------------------------------------------------------------------------------- |
| Inventory JSON | Commit under `cities/<slug>/data/inventory/`, extend `research-markets.tsx` when adding markets, then rebuild. |
| Live site      | Redeploy `dist` to Zo (manual or automated).                                                                   |
| Browser        | User clicks **Refresh** after a new deploy to avoid stale cached HTML (hard refresh still available).          |

## 6. Further automation

- Wire Zo (or another host) to **poll or webhook** on new Actions artifacts / `main` and redeploy `dist`.
- Zo scheduled job: `git pull` → `npm run build` → restart static service.
