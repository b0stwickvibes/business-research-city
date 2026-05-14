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

- [x] **Design review**: `DESIGN_REVIEW.md` in `.design/control-center/` + link to `screenshots/design-review-control-center/` for visual evidence.

## Deferred (backlog)

- [ ] URL query sync (`?market=` / `?tab=`).
- [ ] Glob-based market discovery instead of static `research-markets.tsx` imports.
- [ ] Dark mode token pair.
