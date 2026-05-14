# Cloud Agent task — Tampa, FL (`tampa-city` deep review)

Paste everything in **Instructions** below into a new **Cursor Cloud Agent** run targeting repo **`business-research-city`** (same branch or a feature branch opened from latest main).

---

## Repo & scope

- **Artifact root:** `~/Projects/business-research-city/`
- **City slug:** `tampa`
- **Command (run logic / echo in playbook header, do not treat as executable without your toolchain):**

```text
/business-research-city --city=tampa --state=FL --trade-area=tampa-city --depth=deep --condo_policy=review --corporate_podium_policy=review
```

---

## Stakeholder context (prioritize)

- **Channel-side** hospitality / affluent spend thesis: prioritize **Channelside / Channel District / Water Street Tampa / waterfront** corridors that align with nautical channel adjacency—not generic “downtown Tampa” without water/spine specificity.
- **Stadium halo:** weave **professional + collegiate** spikes—**Amalie Arena (Lightning)** and **Raymond James Stadium (Buccaneers)** as primary spikes; cite **future USF on-campus stadium (opening fall 2027)** as emerging programmed calendar overlay (confidence: schedule-dependent).
- **Policies on this run:** `condo_policy=review`, `corporate_podium_policy=review` ⇒ **HoA/shared-shell condos** and **Class-A tower podiums** may appear only with **explicit yellow appendix flags**—never silently in core shortlist without PDP/broker rationale.

---

## Deliverables (must land in git)

Match Austin / Fort Lauderdale shape:

| Output                        | Path                                                                                                                                                                                                                            |
| ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Phase 0 anchors               | `cities/tampa/anchors.json`                                                                                                                                                                                                     |
| Playbook(s)                   | `cities/tampa/playbooks/playbook-tampa-city-deep-review-YYYY-MM-DD.md` (dated)                                                                                                                                                  |
| Index / search scrapes        | `cities/tampa/data/scrapes/*.md`                                                                                                                                                                                                |
| PDP captures (`--depth=deep`) | `cities/tampa/data/scrapes/pdp/*.md` for promoted targets                                                                                                                                                                       |
| Receipts ladder               | FL has **no** TX Comptroller-style public mixed-beverage ladder—leave `data/receipts/` sparse with a **confidence note**, or ingest only defensible substitutes (subscriber comps, Beverage Digest–class sources, OM extracts). |
| Optional dashboard pins       | `cities/tampa/data/inventory/tampa-properties.json` with `_meta.venues` (Amalie Channelside centroid, Raymond James, Sparkman Wharf / waterfront anchor, USF Tampa centroid or future stadium pad—label clearly).               |

---

## Phase checklist (mirror command spec)

1. **Phase 0** — Zo `maps_search` + web research → structured `anchors.json` (Florida-specific receipts honesty; Tampa building permits / amplified sound controls; Arena + Historic overlays).
2. **Phase 1a** — Listing miner → candidate JSON (`min_sqft` default **6500** unless stakeholder override baked into request).
3. **Phase 1 (deep)** — Mandatory **PDP pass** top 5–15 URLs → markdown under `data/scrapes/pdp/`.
4. **Phase 1c** — Noise / entitlement defense (historic districts, CRA Channel District overlays).
5. **Phase 2** — Email-ready playbook: thesis, **Top 5 physical targets** with geometry + flags, zoning/noise summary, broker one-pager bullets echoing **`--condo_policy` / `--corporate_podium_policy`** in header table.

---

## Done means

- [ ] `anchors.json` committed with Tampa-specific corridors + honest receipts limitation.
- [ ] Dated playbook in `playbooks/` references PDP filenames for deep-ranked deals.
- [ ] ≥1 substantive index scrape markdown + PDP folder populated for prioritized listings (where portals allow scripted capture).
- [ ] Inventory JSON optional but if omitted, playbook states “pins manifest pending QA.”

---

## Copy-paste one-liner (task title)

**Tampa `tampa-city` deep playbook + scrapes (`condo=review`, `podium=review`) — Channelside thesis + Bucs/Lightning/USF halo**
