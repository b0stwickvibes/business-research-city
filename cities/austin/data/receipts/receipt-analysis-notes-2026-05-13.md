# Mixed Beverage Receipts Analysis Notes (automated appendix)

Date: **2026-05-13**  
Portal: Texas Open Data `naix-2893` — [Mixed Beverage Gross Receipts](https://data.texas.gov/resource/naix-2893).

## Files

| File                                                            |  Rows | Description                                                                                                                          |
| --------------------------------------------------------------- | ----: | ------------------------------------------------------------------------------------------------------------------------------------ |
| `mixed-beverage-travis-core-downtown-zips-full-2026-05-13.json` | 69311 | Obligation filings where `location_zip` ∈ {78701,78703,78705} (~`ut-moody-core` hotel/campus wedge + west campus adjacency proxies). |

## Food vs alcohol limitation (critical)

Dataset columns include `liquor_receipts`, `wine_receipts`, `beer_receipts`, `cover_charge_receipts`, `total_receipts` across categories that sum to taxed mixed beverage totals for the reporting obligation — **there is NO separate FOOD receipts field in `naix-2893`** per row introspection on **2026-05-13**. Any “alcohol vs food” ratio targeting the user formula must **wait for alternate Comptroller / TABC exports** or modeled estimates.

Proxy used in playbook narrative: **`liquor_receipts / (liquor+wine+beer+cover_charge)` per reporting row** labeled clearly as **spirit-forward mix**, not beverage-vs-food economics.

## Key quantitative outputs (HIGH/MEDIUM confidence where stated below)

Population: obligation rows in JSON file above.

### A) Downtown wedge aggregate seasonality (`78701+78703+78705`)

Rolling sum of taxed beverage categories by obligation month, summing liquor+wine+beer+cover_charge across all outlets in ZIP slice.

| Metric                                     | Interpretation                                    |
| ------------------------------------------ | ------------------------------------------------- |
| Σ(Sep+Oct+Nov obligation months 2024+2025) | `$229.3M` (two-year sum of summed monthly totals) |
| Compare to simplistic July uplift proxy    | Interpret cautiously                              |

**Confidence on raw sums:** MEDIUM — mechanically correct from extracted JSON file; linkage to causal “football” is LOW.

### B) 78701-only same comparison

Σ(Sep+Oct+Nov 2024+2025 obligation months)=**$198.7M**.

### C) Venue fall vs summer (78701 fuzzy name match — MEDIUM name risk)

Per-venue averages of summed beverage categories comparing obligation months ending in `09–11` (“fall”) vs `06–08` (“summer”) restricted to **`location_zip=='78701'`** and substring rules:

| Label              | Venue match rule                                       |
| ------------------ | ------------------------------------------------------ |
| ACL/3TEN MOODY     | `acl live`, `3ten`                                     |
| MOODY AMPHITHEATER | `moody amphitheater`, `waterloo greenway amphitheater` |
| COMEDY MOTHERSHIP  | `comed` / `mothership`                                 |

| Venue bucket       | Ratio (avg fall month ÷ avg summer month) | Confidence                     |
| ------------------ | ----------------------------------------: | ------------------------------ |
| ACL/3TEN MOODY     |                                  **1.70** | MEDIUM (name dedupe imperfect) |
| MOODY AMPHITHEATER |                                  **2.05** | MEDIUM                         |
| COMEDY MOTHERSHIP  |                                  **1.04** | MEDIUM                         |

### D) Citywide wedge median “spirit share” heuristic

Median `liquor/(liquor+wine+beer+cover)` among all `78701` rows with summed categories ≥ `$40k` across obligation window **2025-06 .. 2026-03**:

**Median = 0.693** (`n = 1813` rows passing filter)

**Confidence:** LOW–MEDIUM — reflects excise-tax category bucketing on mixed beverage filings, NOT margin mix vs food revenue.
