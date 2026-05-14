# Build Tasks: Control Center

Generated from: `.design/control-center/DESIGN_BRIEF.md`  
Date: 2026-05-14

## Foundation

- [x] **Design artifacts**: Brief, IA, tokens documented under `.design/control-center/`.
- [x] **Inventory schema alignment**: `status` on properties used consistently (Austin + Fort Lauderdale JSON).

## Core UI

- [x] **Deal status visibility**: `Badge` with `status` variant on table, mobile cards, and breakdown header.
- [x] **Status filter**: `<select>` All | Diligence | Rejected (policy) | Appendix | Reference — filters pin list.
- [x] **Market switcher + anchor venue**: Already in `App.tsx` / `CityInventoryDashboard` — verified against IA.

## Interactions & States

- [x] Expandable rows with keyboard-focusable photo control and `aria-expanded` (existing).
- [x] Empty: no inventory / no search match (existing).

## Responsive & Polish

- [x] Table horizontal scroll + caption (existing).
- [x] Mobile card stack mirrors status (same badge).

## Review

- [x] **Design review**: `DESIGN_REVIEW.md` — screenshot script: `cd control-center && npm run screenshots:design-review`.

## Ship / infra

- [x] **GitHub Actions**: `.github/workflows/control-center.yml` uploads **`control-center-dist`** artifact on `main`.
- [x] **Large receipt JSON**: `*-zips-full-*.json` gitignored; `cities/austin/data/receipts/README.md` documents re-download.
- [x] **Zo hosting guide**: `docs/ZO.md` (+ `docs/DEPLOY.md` links).

## Deferred (backlog)

- [x] **URL query sync**: `?market=<id>` (e.g. `austin`, `fort-lauderdale`) and `?tab=pins|launcher` — aliases: `wizard` → launcher, `deal-pins` → pins. Hydrate on load; `replaceState` on change; `popstate` for back/forward.
- [ ] Glob-based market discovery instead of static `research-markets.tsx` imports.
- [ ] Dark mode token pair.
- [ ] **Rewrite git history** to drop the 59 MB file from past commits (optional — use BFG / `git filter-repo` if clone size matters).
