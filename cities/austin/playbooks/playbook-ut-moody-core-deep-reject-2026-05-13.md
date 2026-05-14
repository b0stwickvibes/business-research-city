# Austin Site Selection Playbook — **`ut-moody-core` · deep · rejection filters**

COMMAND: **business-research-city**

| Field                       | Value                                                                                                                              |
| --------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| **CITY**                    | austin                                                                                                                             |
| **STATE**                   | TX                                                                                                                                 |
| **TRADE_AREA**              | ut-moody-core                                                                                                                      |
| **DEPTH**                   | deep                                                                                                                               |
| **CONDO_POLICY**            | **reject** (shared-shell condominium retail strata / HOA-heavy pads → hard appendix only)                                          |
| **CORPORATE_PODIUM_POLICY** | **reject** (Class-A CBD office pedestal / flagship tower lobby-ring retail → appendix only absent `tower_podium_exception_review`) |
| **MODE**                    | Anchor → Parallel sweep → Conductor synthesis                                                                                      |

**Epistemic health check:** `--depth=deep` here means **tiered PDP coverage under real-world brokerage paywalls.** LoopNet + Crexi property HTML returned **Akamai/login interstitials / HTTP 403** on scripted pulls (Firecrawl + Zo `read_webpage`, **2026-05-13** attempt log embedded in PDP notes). PDP depth therefore combines **broker-hosted marketing pages (RRG Wix)** + **Urbanspace PDF-derived markdown** + **CityFeet open listing HTML** where available. Confidence on any single pin’s rent/CAM/roof-rights wording is capped accordingly.

---

## 1. Market thesis — West Sixth / Warehouse **wealth spine** versus **Red River → Moody funnel**

**Structural split (do NOT merge corridors for noise math):**

1. **West 6th / Warehouse-adjacent hospitality spine.** Premium hotel gravitational pull (JW Marriott, Fairmont-adjacent energy, supper-club / mature-F&B comps like Jeffrey’s corridor per receipt leaderboards below) biases **steady-state affluent spend**, not collegiate shot-bar velocity. Fits **hotel-spill ultralounge ladder** positioning if shell verticality survives.

2. **Red River Cultural District funnel toward Moody.** Pedestrian + rideshare egress from Moody Center cluster + Waterloo Greenway Amphitheater lift supplies **celebratory beverage-forward spikes**. Land use tolerances for entertainment uses **traditionally outperform Rainey’s residential canyon** for loud programming — entitlement still bespoke but **neighbor vector differs materially**.

**Geographic nuance (Phase 0 guardrail upheld):**

- **510–512 Neches** is marketed as **Sixth/Neches / Historic Old Sixth** corridor — Zo distance snapshot labels **walk to Moody ~1.5 miles** (**MEDIUM confidence** phrasing fidelity; retracing pedestrian route not regenerated here). Treat as **NOT Rainey orbit** regardless of conversational shorthand in bars.
- **Rainey towers + Camden-style multifamily canyon:** separate **severe red flag tier** vs Red River overlays for aggressive outdoor amplified envelopes.

---

## 2. Top physical targets (rank = investigative priority for broker follow-up · **≠** carte-blanche suitability)

Pins below are **explicitly gated** against `condo_policy=reject` + `corporate_podium_policy=reject`. Anything breaching gates remains **footnote-only** regardless of billboard SF.

### Target table

| Priority | PIN                                                    | Size / envelope (claims)                                                                                                                                    | Arrival geometry (PDP)                                                                                                                                                                                                                                                                                                                     | PDP receipt file(s)                                                                                       |
| :------: | ------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------- |
|  **1**   | **510–512 Neches St**, 78701 (RRG marketing)           | **3,900 SF** shell historic freestanding (**FAIL** ≥6.5 k expansion gate) · patio/courtyard **language only** (“potential enclosed courtyard or patio”).    | Historic **freestanding**, **HIGH VISIBILITY**, **two sides for signs**, **street parking**. **Corners:** marketed “historic end-cap” → implied corner but **explicit corner lot line not plotted here** ⇒ mark **corner = LIKELY, confidence MEDIUM**. Alley / dock: **UNKNOWN** PDP. **Zoning marketed:** **DMU** (verify live COA GIS). | `data/scrapes/pdp/510-512-neches-rrgcre.md`, cross-check Showcase mirror `showcase-510-neches.md`         |
|  **2**   | **710 W 6th St**, 78701 (LoopNet teaser; HTML blocked) | **UNKNOWN SF** teaser copy only                                                                                                                             | **UNKNOWN** geometry — blockbuster West 6th spine thesis only                                                                                                                                                                                                                                                                              | `data/scrapes/pdp/teaser-loopnet-710-w-6th.md`, failed raw scrape artifacts `loopnet-710-w-6th-austin.md` |
|  **3**   | **44 East Ave #100**, 78701 (**Urbanspace PDF**)       | Claim **7,050 SF interior + 2,108 SF exterior** (**≥6.5 k interior gate PASS**) + stacked mezzanine plan                                                    | HOA / condo strata — flyers enumerate surrounding condo towers (**policy REJECT**)                                                                                                                                                                                                                                                         | Appendix only: `data/scrapes/pdp/44-east-flyer-extracted.md`                                              |
|  **4**   | **1915 E MLK Jr Blvd**, 78702 (RRG PDP)                | **2,895 SF** interior (+ **~1 k SF courtyard** labeled shared) ⇒ **FAIL** ≥6.5 k                                                                            | Interior courtyard loading; plentiful parking flagged; geography **east of core CBD hotels** ⇒ **YELLOW** vs thesis                                                                                                                                                                                                                        | `data/scrapes/pdp/1915-mlk-rrgcre-251001.md`                                                              |
|  **5**   | **5610 N Interstate Hwy 35**, 78751 (CityFeet)         | Billboard **≤8,376 SF contiguous** (**numeric gate plausible PASS**) BUT marketing = **commercial commissary / ghost kitchens** (**FAIL concept typology**) | Large Class **A**, built **2020**, multi-tenant; **HIGH parking** vibe for logistics not hospitality spectacle                                                                                                                                                                                                                             | `data/scrapes/pdp/cityfeet-5610-n-interstate-35.md`                                                       |

**Hard filtering appendix — Crexi headline only (INDEX pass, NO verified PDP owing to CDN gate):**

- **90 Rainey basement retail** ⇒ basement + tower residential strata ⇒ **reject / condo appendix** (**HIGH confidence labeling from marketing type** vs unknown legal stack). Source: `data/scrapes/crexi-downtown-restaurants-2026-05-13.md`.
- **100 Congress (~7.6 k SF) & 501 Congress (~7.7–12.5 k SF)** ⇒ Endeavor-listed Congress podium archetypes ⇒ **`corporate_podium_policy` reject SHORTLIST veto** (**MEDIUM-HIGH archetype certainty**, **UNKNOWN** nuanced landlord carve-out without OM). Same Crexi INDEX file cited above.

**Operational conclusion (honesty statement):**

> After applying **dual rejection policies** plus **≥6.5 k SF** operating gate, **no unsullied PDP-verified “A-grade hunt pin” surfaced entirely in open portals on this crawl date.** Target **#1/#2** nonetheless anchor **Red River funnel** vs **West 6 spine** strategy — continue **broker-off-market shells** Endeavor/Urbanspace/RRG desks already advertising adjacent inventory.

Quantitative confidence tagging echoes the PDP footnotes table above verbatim; availability + pricing flagged “CALL” in broker marketing — treat **revocation risk MEDIUM**.

---

## 3. Texas mixed beverage receipts (Phase **`1b` mandatory**) — aggregates + caveat on “food ratio”

**Downloaded slice:** obligation rows (~**69 k** filings) ZIP-filtered **`78701 ∪ 78703 ∪ 78705`** → `data/receipts/mixed-beverage-travis-core-downtown-zips-full-2026-05-13.json` + narrative stats `data/receipts/receipt-analysis-notes-2026-05-13.md`.

**Food vs spirits gap (CRITICAL METHODOLOGY):** `naix-2893` rows contain **liquor / wine / beer / cover_charge** taxed receipt buckets tying to Mixed Beverage tax reporting obligations — **explicit food revenue columns are absent** verified **2026-05-13** schema introspection. Therefore the user-commanded **Alcohol-vs-Food ratio cannot be faithfully executed against this dataset** without importing **alternate Comptroller views** **or merchant P&L**.

**Operational proxy used consistently this run:**

\[
\textbf{spirit_mix_row}=\frac{\text{liquor}}{\text{liquor}+\text{wine}+\text{beer}+\text{cover_charge}}
\]

Median across heavily reporting `78701` rows (months **2025-06 .. 2026-03**, row-level summed categories ≥ **$40 k**) ⇒ **median `0.693`, n = `1813` rows (**LOW–MEDIUM confidence** interpreting as “spirit skew within taxed beverage carve-out,” **NOT\*\* FOH margin economics).

**Seasonality vs event thesis (HIGH mechanical confidence on sums, LOW causal attribution confidence):**

- Aggregated summed beverage filings for wedge ZIPs (**78701 ∪ 78703 ∪ 78705**) — obligation months **Sep+Oct+Nov 2024–2025** total **≈ $229.3M** vs **`78701` alone ~$198.7M**.  
  **Causal linkage to UT football Saturdays** ⇒ **SPECULATIVE** pending schedule intersection @ venue grain (next modeling pass).

**Named venue uplift heuristics (MEDIUM statistical confidence · MEDIUM name-mapping risk · LOW causal specificity):**

Fuzzy substring matches on **`location_zip == 78701`** outlet names comparing average obligation-month totals **Jun–Aug vs Sep–Nov**:

| Venue bucket label                     | Ratio (avg fall months ÷ avg summer months) | Confidence commentary                                                                                      |
| -------------------------------------- | ------------------------------------------: | ---------------------------------------------------------------------------------------------------------- |
| ACL / ACL Live · 3TEN cluster          |                                   **1.70×** | Moody-adjacency entertainment anchor aligns with spike story — still confounded by touring calendar        |
| Moody Amphitheater (Waterloo branding) |                                   **2.05×** | Highest ratio — confounded seasonal amphitheater schedule                                                  |
| Comedy Mothership                      |                                   **1.04×** | Essentially flat ⇒ **supports NOT treating all “entertainment” comps as mechanically football-correlated** |

**Raw receipt leaders (HIGH confidence as ranked sums · MEDIUM entity dedupe noise):**

Top cumulative obligated beverage buckets **2024-06→2026-04** by `location_name` string grouping include **JW MARRIOTT AUSTIN ~$22.7M**, **PROPER HOTEL**, **Fairmont**, **Comedy Mothership**, etc. ⇒ capital placement thesis should **piggyback booster/hotel gravitational pools** feeding **discretionary beverage bursts** anchored around Moody / Waterloo **(qualitative MEDIUM confidence bridge)**.

Correlation “>50 % alcohol baseline + event spikes” reinterpreted ⇒ **Median spirit-mix heuristic >69 %** qualifies **spirit-skew wedge** surrogate; causal spike claims limited to enumerated venue lifts above.

---

## 4. Entitlements · noise defense · permitting skim (`1c`)

| Thread                                       | Observation                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   | Confidence               |
| -------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------ |
| City outdoor permit legacy URL               | **`austintexas.gov/page/outdoor-events-permit-information` → CMS 404 skeleton** (**2026-05-13** scrape) ⇒ portal drift                                                                                                                                                                                                                                                                                                                                                                        | HIGH on dead link status |
| Municode anchored deep-node link             | Returned **generic “Content Not Found”** SPA shell ⇒ deep links brittle                                                                                                                                                                                                                                                                                                                                                                                                                       | MEDIUM                   |
| Code Chapter **9‑2 Noise & Amplified Sound** | Confirmed corpus existence via ancillary official PDF citations surfacing ordinance amendment packages (`edims` refs returned in programmatic search snippets). Operators must reconcile **Sections 25-2-808 + 9-2** interplay for outdoor amplification via **paid legal zoning memo** (**legal advice disclaim**). Example discovery seed: municipal PDF route `https://www.austintexas.gov/edims/document.cfm?id=148299` (**MEDIUM reliability** landing without full content audit here). |

**Rainey canyon vs RR cultural overlays** must be mapped **parcel-by-parcel** with residential adjacency setbacks — global district labels inadequate (**site counsel — NOT legal verdict**).

---

## 5. Development / rumor radar (`1d`) — skim level

Deferred heavy permit-mining (**Build + Connect / Accela rebrands**) due to migrated web IA + authenticated commercial listing firewalls ⇒ **HIGH process confidence that automation debt remains**, qualitative **confidence LOW** on embargoed rumor capture this pass only.

Suggested manual monitor list (no proprietary pulls here):

- Waterfront / Waller Creek capital projects press (City + Waterloo nonprofit channels)
- Moody Center promoter calendar churn (premium concert density nights)
- Local business journals for **CBD hotel expansion** footprints shifting rideshare deltas

Confidence on “no major supply shocks detected here” ⇒ **NONE STATED**.

---

## 6. Calendar correlation scaffolding (`1e`)

| Calendar                                                                         | Operational use                              | Confidence                                                                                             |
| -------------------------------------------------------------------------------- | -------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| **Texas Longhorns football** canonical schedule page                             | Spike weekends overlay vs Sep–Nov aggregates | MEDIUM on URL stability — consult `https://www.texassports.com/` athletics football schedule navigator |
| **Moody Center atx** promoter calendar (`https://www.moodycenteratx.com/events`) | Non-football uplift driver                   | MEDIUM                                                                                                 |

No automated pairwise join executed on this workstation pass beyond qualitative alignment described in receipts section.

---

## 7. Zoning · noise dual-track reality check (**Rainey canyon vs RR / Sixth-Neches)**

| Corridor archetype                                               | Neighbor-risk vector                                                                                                           | Operational inference                                                                                                                          |
| ---------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| **Rainey lakeshore residential towers / basement retail shells** | **High-density HOA + STR-style visitor churn** ⇒ noise complaints & balcony line-of-sight hostility                            | Assume **severe friction** validating **reject / extreme caution for outdoor amplified envelopes** absent counsel sign-off + measured SPL plan |
| **Red River Cultural · Old Sixth pins (incl. 510 Neches PDP)**   | **Entertainment-heavy adjacency baseline** ⇒ historically **Amplified tolerant relative to canyon towers** (**relative only**) | Opportunity for **controlled outdoor** still requires **engineering + entitlement stack** (**NO blanket pass**)                                |
| **CBD Congress pedestal retail** (`100/501 archetype`)           | **Landlord uniformity + daytime office adjacency CAM** ⇒ conflict with MILA spectacle build                                    | **Excluded** absent `corporate_podium_policy=review` + documented entertainment precedent carve-out                                            |

**Specific mis-geography correction:** Urbanspace **44 East flyer** insists “Rainey Street District” condominium retail — aligns **tower condo HOA vector** reinforcing reject policy even while physically proximate to broader entertainment blob.

---

## 8. Broker one-pager (copy-ready)

**Use case:** collegiate-adjacent **ultra-lounge** bridging **premium hotel afternoons → late-night spectacle** rideshed to Moody/DKR (~8–25 min curb-to-curb depending on chokepoints — **LOW confidence quantitative band** anecdotal rideshare variability).

Hard filters reiterated:

1. **`≥ ~6.5 k SF` contiguous programmable floorplate** (+ vertical hook / plausible roof negotiation story).
2. **NO retail condominium shells / HOA-pad choke** (`condo_policy=reject`).
3. **NO flagship Class‑A Congressional skyscraper podium ring** akin **100 / 501 Congress** morphology (`corporate_podium_policy=reject`) absent written `tower_podium_exception_review` evidence (prior nightclub + sound carve-out archival).
4. **Arrival geometry diligence package:** alley / dock, staged valet choke, curb cut multiplicity, freight elevator to mezz/roof (**unknown on LoopNet teaser #2** ⇒ priority diligence).
5. **Noise overlay split:** articulate **Rainey canyon** vs **Red River / Sixth-Neches overlays** parcel-by-parcel before LOI drafts.
6. **Receipt anchor:** wedge ZIP aggregate fall beverage totals + moody venue uplift ratios support **premium hospitality adjacency budgeting** (**methodology caveat on missing food splits** enumerated above).

**Dead ends explicitly removed from SHORTLIST**

- Condo podium flyers (`44 East` marketing PDF PDP).
- Class-A pedestal Congress bands (Crexi index-only evidence).
- Commissary kitchen flex plays masquerading as hospitality shells (`5610 IH-35` PDP).

Broker teams already surfacing contiguous downtown deals: Endeavor (**Congress listings** ⇒ treat as veto archetype baseline), Urbanspace (Rainey strata flyers ⇒ verify legal stack), Restaurant Realty Group (RRG corridor inventory).

---

## 9. Source inventory (artifacts)

### Index / exploratory scrapes (`data/scrapes/`)

| File                                                                               | Purpose                                                                    |
| ---------------------------------------------------------------------------------- | -------------------------------------------------------------------------- |
| `crexi-downtown-restaurants-2026-05-13.md`                                         | CRE index pass (Crexi Restaurants · Downtown preset) listing URLs inferred |
| `loopnet-warehouse-restaurants-index.md` / `loopnet-sixth-st-restaurants-index.md` | CDN-gated stubs — mostly nav chrome (**LOW fidelity**)                     |
| `cityfeet-austin-restaurants-index.md`                                             | Alternate portal surfacing unusually large footprints                      |
| `austin-outdoor-events-permit.md`                                                  | Demonstrates migrated City web content gap                                 |
| `austin-dsd-build-connect-skim.md`                                                 | DS landing skim — deep portal path not locked                              |
| `austin-search-amplified-placeholder.md`                                           | City search experiment stub                                                |

### PDP / PDP-equivalent dossiers (`data/scrapes/pdp/`)

Enumerate active analytic PDP set used in scoring footnotes:

- `510-512-neches-rrgcre.md`
- `teaser-loopnet-710-w-6th.md` (+ degraded `loopnet-710-w-6th-austin.md` artefact evidencing CDN wall)
- `44-east-flyer-extracted.md` (\*\*appendix disqualification dossier under condo_policy=reject`)
- `1915-mlk-rrgcre-251001.md`
- `cityfeet-5610-n-interstate-35.md`
- ancillary mirrors `showcase-510-neches.md`, `showcase-1915-mlk.md` (thin nav chrome — corroborative only)

### Receipt receipts (`data/receipts/`)

- `mixed-beverage-travis-core-downtown-zips-full-2026-05-13.json`
- `receipt-analysis-notes-2026-05-13.md`
- legacy exploratory sample retained (optional prune): `mixed-beverage-austin-787.zip-sample-5000.json`

---

### Closing confidence rollup

| Layer                                                                        | Grade                                                                          |
| ---------------------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| Strategic corridor bifurcation (West 6 spine vs Moody funnel / RR tolerance) | **MEDIUM-HIGH** qualitative                                                    |
| PDP geometry where broker-hosted flyers exist                                | **MEDIUM-HIGH** on verbatim claims, **LOW** translating to entitlement outcome |
| Open-market SHORTLIST fullness after veto gates                              | **LOW** completeness                                                           |
| Aggregated wedge receipt sums                                                | **HIGH** computational fidelity from JSON artifact                             |
| Causal athletics calendar spike attribution                                  | **LOW** without merge keys                                                     |
| Amplified-noise entitlement pass/fail for any discrete parcel                | **UNSTATED until counsel + acoustic study**                                    |

_This memorandum synthesizes programmatic open data plus marketing collateral; it does NOT constitute legal entitlement advice, OM verification, appraisal, acoustic engineering sign-off, broker representation, nor substitute for toured landlord diligence._
