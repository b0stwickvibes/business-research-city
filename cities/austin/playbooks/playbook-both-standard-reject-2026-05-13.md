# Austin — Site Selection Playbook

## Run metadata

| Argument         | Parsed value                                                                                |
| ---------------- | ------------------------------------------------------------------------------------------- |
| `--city`         | Austin → slug **`austin`**                                                                  |
| `--state`        | TX                                                                                          |
| `--trade-area`   | **`both`** _(default when unspecified — covers ut-moody-core + q2-north)_                   |
| `--depth`        | **`standard`** _(single orchestrated pass — receipts + Build+Connect not batch-downloaded)_ |
| `--condo_policy` | **`reject`**                                                                                |

**Artifact paths**

- Anchors: `~/Projects/business-research-city/cities/austin/anchors.json`
- This playbook: `~/Projects/business-research-city/cities/austin/playbooks/playbook-both-standard-reject-2026-05-13.md`
- Crexi scrape: `~/Projects/business-research-city/cities/austin/data/scrapes/crexi-downtown-restaurants-2026-05-13.md`

**Overall confidence:** **Medium** on corridor thesis (maps-backed); **Low–medium** on specific pins (Crexi index only; many rows are **not** Austin 787xx — filtered below).

---

## 1. Market thesis — two corridors (`both`)

### A. `ut-moody-core`

**Booster / visitor wallet** concentrates along **CBD + Rainey/Lakeshore hospitality** with **short rideshare** to **Moody Center** and **DKR**. Zo **`maps_search`** surfaced **Fairmont, JW, Thompson, ZaZa, W, LINE, Hyatt Regency, Hilton**, plus upscale dining (**Jeffrey’s, Red Ash, Olamaie, Hestia, ATX Cocina**, etc.) — consistent with **mature-money** positioning (not Dirty Sixth).

**Avoid polygons (anchors):** East 6th (Congress–I-35); dense West Campus dive clusters.

### B. `q2-north`

**Different geometry:** **Q2 Stadium** + **Domain** office/hotel ecosystem (**Westin Domain, Archer, Renaissance**, etc.). Better for **soccer + concert spikes** and **tech/domain daytime**, weaker automatic overlap with **UT football / Moody** unless you explicitly want **two concepts or dual flagship**.

---

## 2. Top physical targets (on-market — **787xx only**, ≥6,500 SF from Crexi scrape)

Source file: `data/scrapes/crexi-downtown-restaurants-2026-05-13.md`. Crexi **pollutes** with Hutto, Boerne, San Antonio — **discarded** unless ZIP Austin metro core.

| Rank  | Address                                          | SF (index)          | Corridor                     | Arrival / geometry                                                               | Flags                                                                                                                                  |
| ----- | ------------------------------------------------ | ------------------- | ---------------------------- | -------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| **1** | **501 Congress Ave**, Austin TX 78701            | **7,663 – 12,524**  | ut-moody-core                | **Verify** corner vs mid-block, loading, alley — listing does not prove geometry | **Yellow:** tower podium lease / CAM; **`condo_policy=reject`** → reject **fee-simple retail condo** only — NNN ground still diligence |
| **2** | **100 Congress**, Austin TX 78701                | **7,601**           | ut-moody-core                | Same                                                                             | Same                                                                                                                                   |
| **3** | **510 Neches St** — Restaurant & Bar Opportunity | **SF not on index** | ut-moody-core / Rainey orbit | **Must broker-verify ≥6,500** + curb/alley                                       | **Red–yellow:** **Rainey / tower residential** adjacency → **severe caution** outdoor amplified (see §3)                               |
| **—** | **90 Rainey St** — The Modern basement retail    | Basement retail     | Rainey                       | —                                                                                | **Red:** residential canyon + **`condo_policy`** stance                                                                                |

**Not promoted:** **816 Congress** (max ~3,100 SF); smaller Frost/Frost-adjacent pads.

### `q2-north` — this pass

No dedicated Crexi scrape for Domain-only restaurant inventory in artifact set. **Firecrawl search** surfaced [**LoopNet Domain restaurants**](https://www.loopnet.com/search/restaurants/domain-austin-tx/for-lease/), [**Simon Domain leasing**](https://business.simon.com/leasing/the-domain), and [**Domain X4**](https://www.endeavor-re.com/properties/domain-x4/) (office-focused). **Next step:** scrape LoopNet Domain filtered URL + Simon PDFs, or broker pull for **pad / freestanding** opportunities near **Burnet / Braker / Q2**.

---

## 3. Zoning / noise reality check _(not legal advice)_

- **Rainey / Neches / lakeshore:** Treat **high-rise residential adjacency** as **severe Red Flag** for **new outdoor amplified** programs until counsel reviews **sound ordinance** + **permit history**.
- **Congress CBD:** Typically **office/hotel** neighbors — outdoor still regulated but **less inherently hostile** than Rainey towers.
- **q2-north:** Different council context; still map **new multifamily** within **500–800 ft** if ordinance uses distance tests — **verify on Build + Connect** next pass.

---

## 4. Phase 1b — Receipts proxy _(pending this run)_

**Not executed:** bulk CSV pull / alcohol÷food ratio / event spikes.

**Where to pull:** Texas Open Data — search **“Mixed Beverage Gross Receipts”** on [data.texas.gov](https://data.texas.gov) and Comptroller [open-data catalog](https://comptroller.texas.gov/transparency/open-data/search-datasets).

**Hypothesis to test:** outlets maintaining **>50% alcohol-weighted mix** in slow months + **spikes** on **UT home football**, **Moody A-list**, **Q2 concerts**.

---

## 5. Broker one-pager _(paste into email)_

- **Who we are:** Collegiate-adjacent ultra-lounge operator; proven high-energy **SEC-market** monetization + Miami-style **day→night** spectacle expansion thesis.
- **Use flags:** **`both`** Austin corridors — prioritize **ut-moody-core** for booster/Moody/DKR wallet; parallel **q2-north** if soccer/Domain thesis justifies second hunt.
- **Hard requirements:** **≥6,500 SF**, **multi-level or roof rights**, **second-gen F&B** preferred, **corner / valet / surface / alley** arrival — down-rank landlocked mid-block.
- **Ownership:** **`condo_policy=reject`** — **no retail condo / shared-shell HOA** expansion envelopes.
- **Off-market:** pads, freestanding, parking-field restaurants, redevelopment shells **within 5–10 min rideshare** of **Moody/DKR** (corridor A) and/or **Q2** (corridor B).
- **Kill zones:** **Outdoor amplified** uncertainty **Rainey-adjacent** without legal clearance.

---

## 6. Command-line replay

```bash
# Exact replay of inferred defaults from natural-language “Austin, TX”:
/business-research-city --city=austin --state=TX --trade-area=both --depth=standard --condo_policy=reject
```

Deep dive next:

```bash
/business-research-city --city=austin --state=TX --trade-area=ut-moody-core --depth=deep --condo_policy=reject
```
