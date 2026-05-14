# Design Review: Control Center (Deal pins)

Reviewed against: `.design/control-center/DESIGN_BRIEF.md`  
Philosophy: Operational clarity — dense, scannable, honest provenance  
Date: 2026-05-14 (updated 2026-05-14)

## Screenshots Captured

| Screenshot                                                             | Breakpoint         | Description                                                                                       |
| ---------------------------------------------------------------------- | ------------------ | ------------------------------------------------------------------------------------------------- |
| `.design/control-center/screenshots/review-deal-pins-desktop-1280.png` | Desktop (1280×800) | Full-page Deal pins — run `npm run screenshots:design-review` in `control-center/` to regenerate. |
| `.design/control-center/screenshots/review-deal-pins-tablet-768.png`   | Tablet (768×1024)  | Same.                                                                                             |
| `.design/control-center/screenshots/review-deal-pins-mobile-375.png`   | Mobile (375×812)   | Same.                                                                                             |
| `screenshots/design-review-control-center/debug.png`                   | —                  | Legacy ad-hoc capture (optional).                                                                 |

**Regenerate:** `cd control-center` → `npx playwright install chromium` (once) → `npm run screenshots:design-review`.

## Summary

The shell (header, tabs, market switcher, skip link, **Refresh** + build stamp) matches the brief’s **instrument-like** direction. **Deal status** is first-class: **badge** + **filter** + search includes status labels. Token usage stays centralized in `index.css` / `tailwind.config.js`.

**Ops:** GitHub Actions builds the control center and uploads the **`control-center-dist`** artifact. **Zo** options are documented in **`docs/ZO.md`**.

## Must Fix

_(none)_ — Re-run the screenshot script after major UI changes.

## Should Fix

1. **Table width**: `min-w-[800px]` may clip on small laptops — horizontal scroll + footer copy.
2. **`CardDescription` in breakdown**: Spot-check long addresses vs miles chip on narrow viewports.

## Could Improve

1. **Reduced motion** for expandable row (`prefers-reduced-motion` + `scrollIntoView`).

## What Works Well

- **Badge status variants** surface policy outcomes without reading flags only.
- **Clear filters** resets **both** search and status.
- **Expandable row** keeps table → detail context without a new route.
- **Contribution sandbox** copy stays honest (“not underwriting”).

## Files verified

- `control-center/src/App.tsx`
- `control-center/src/components/CityInventoryDashboard.tsx`
- `control-center/src/components/ui/badge.tsx`
- `.design/control-center/DESIGN_BRIEF.md`
