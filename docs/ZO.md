# Zo: live control center dashboard

The control center is a **static Vite build** (`control-center/dist/`). Zo’s first-class [Sites](https://docs.zocomputer.com/sites) product targets **Hono + Bun** templates; this repo is a **pre-built SPA**, so use one of the patterns below.

## Option A — User service (static file server) _(flexible)_

Per [Hosting on Zo](https://www.zo.computer/app/hosting), run a long-lived **service** that serves `dist/` (e.g. `npx serve dist -l PORT` or any static server), with your workspace path pointing at a clone of this repo after `npm ci && npm run build` in `control-center/`.

**Update loop:** `git pull` → `cd control-center && npm ci && npm run build` → restart service (or use a process manager).

## Option B — GitHub Actions artifact + manual sync

The repo’s **GitHub Action** uploads `control-center-dist` on every push to `main` (see `.github/workflows/control-center.yml`). Download the artifact, copy `dist/` to your Zo workspace, then serve as in Option A or attach to a Zo static host if available.

## Option C — `publish_site` (Zo Sites)

[`publish_site`](https://docs.zocomputer.com/tools/publish-site) expects a Zo **site folder** containing **`zosite.json`** (workspace-relative path). Native Zo sites are usually generated from **Create site** in the UI.

Practical path: create a minimal Zo site whose build/output is replaced by this repo’s `dist`, or ask Zo (in product chat) to wire **static export** from a workspace subfolder—details depend on your Zo workspace layout.

**Public URL shape:** `sitename-yourhandle.zocomputer.io` after publish (see Zo docs).

## Browser refresh

After any deploy, use the app’s **Refresh** button (full reload). It does not replace `git pull` + rebuild on the server.

## Related

- `docs/DEPLOY.md` — GitHub remote and build commands.
