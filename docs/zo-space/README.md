# Zo Space routes (Navigator)

Source of truth for the **shared sticky nav** and **page shells** on your Zo Space (Home, Trading, Inventory, Research, Green room). The live Space pulls the same chrome documented in [`ZO.md`](../ZO.md).

## Nav behavior (2026 refresh)

| Item           | Change                                                                                                                                                                                                                                                |
| -------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Review**     | Removed from the nav — it was redundant with Research / workflow.                                                                                                                                                                                     |
| **Green room** | Link target is centralized as `GREENROOM_HREF` in [`SpaceNav.tsx`](./SpaceNav.tsx) (default **`/greenroom`**). If your host only serves `greenroom.html`, set `GREENROOM_HREF` to **`/greenroom.html`** once. Label reads **Green room** (two words). |
| **A11y**       | Skip link, Escape closes mobile menu, `aria-current="page"` on the active item, external links marked ↗.                                                                                                                                              |

## Files

| File                 | Zo route                                 | Role                                                    |
| -------------------- | ---------------------------------------- | ------------------------------------------------------- |
| `SpaceNav.tsx`       | (import)                                 | Sticky header + mobile menu.                            |
| `constants.ts`       | (import)                                 | `BRC_CONTROL_CENTER_ORIGIN` for the research iframe.    |
| `HomeRoute.tsx`      | `/`                                      | Launch pad (hero + bento destinations + BrainOS strip). |
| `TradingRoute.tsx`   | `/trading`                               | Shell — replace body with your trading UI.              |
| `InventoryRoute.tsx` | `/inventory`                             | Shell — replace with long-book content.                 |
| `ResearchRoute.tsx`  | `/research`                              | Iframes the control-center Zo Site.                     |
| `GreenroomRoute.tsx` | `/greenroom` (or match `GREENROOM_HREF`) | Staging / pre-show placeholder.                         |

## Deploying on Zo

1. Copy each route’s **default export** into your Space route (same paths as today), **or** upload this folder and use relative imports if your bundler resolves them.
2. Ensure **`/research`** iframe origin matches your live site (`constants.ts` → publish URL).
3. After `control-center` deploy, only **`/research`** needs the new `dist/`; Home/Trading/etc. are independent.

## Single-file fallback

If you must paste one file per route with no shared imports, copy **`SpaceNav.tsx`** into the same file as each route (dedupe once per file) or concatenate in build order: constants → SpaceNav → page.
