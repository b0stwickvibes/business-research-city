# Design Review: Control Center (Deal pins)

Reviewed against: `.design/control-center/DESIGN_BRIEF.md`  
Philosophy: Operational clarity — dense, scannable, honest provenance  
Date: 2026-05-14

## Screenshots Captured

| Screenshot                                           | Breakpoint   | Description                                                                                                                               |
| ---------------------------------------------------- | ------------ | ----------------------------------------------------------------------------------------------------------------------------------------- |
| `screenshots/design-review-control-center/debug.png` | _(see file)_ | Existing capture in repo (design-review run).                                                                                             |
| _(not re-captured this session)_                     | —            | Re-run `npm run dev` and save full-page desktop/tablet/mobile per `/design-review` skill when validating visually after this code change. |

> **Note:** Responsive PNGs from this session were not re-taken automatically. Visual proof for the **new Status column and filter** should be added under `.design/control-center/screenshots/` on the next manual or scripted pass. Legacy assets remain under `screenshots/design-review-control-center/`.

## Summary

The shell (header, tabs, market switcher, skip link) matches the brief’s **instrument-like** direction. **Deal status** is now first-class: **badge** + **filter** + search includes status labels—closing the gap where playbook gates were JSON-only. Token usage stays centralized in `index.css` / `tailwind.config.js`. Remaining gap is **URL state** and **automated screenshot refresh** for regression-proof reviews.

## Must Fix

1. **Screenshot refresh**: After adding the Status column, replace or supplement `debug.png` with named captures (`review-deal-pins-desktop-1280.png`, etc.) so the review is visually traceable. _Fix: run dev server, use Playwright or IDE browser, save to `.design/control-center/screenshots/`._

## Should Fix

1. **Table width**: `min-w-[800px]` may still clip on small laptops — verify horizontal scroll affordance remains obvious (footer disclaimer already copy-supports this).
2. **`CardDescription` in breakdown**: Ensure long addresses don’t collide with the miles chip on narrow split (spot-check Fort Lauderdale long headlines).

## Could Improve

1. **URL query params** for `market` + `tab` to make pins shareable (noted in `TASKS.md` deferred).
2. **Reduced motion** for expandable row (optional `prefers-reduced-motion` on `scrollIntoView`).

## What Works Well

- **Semantic color tokens** and **Badge status variants** givepolicy outcomes without reading flags only.
- **Clear filters** resets **both** search and status—avoids “empty table” confusion.
- **Expandable row** keeps context (table → detail) without a separate route.
- **Contribution sandbox** language stays non-deceptive (“not underwriting”).

## Files verified this pass

- `control-center/src/components/CityInventoryDashboard.tsx` — status column, filter, `clearFilters`, colspan 7.
- `control-center/src/components/ui/badge.tsx` — `DealStatusBadge` variants.
- `.design/control-center/DESIGN_BRIEF.md` — aligns with implementation intent.
