import { useEffect, useMemo, useState } from "react";
import { GitBranch, LayoutGrid, RefreshCw, Terminal } from "lucide-react";

import {
  RESEARCH_MARKETS,
  type ResearchMarketId,
} from "./config/research-markets";
import CityExpansionDashboard from "./components/CityDashboard";
import CityInventoryDashboard from "./components/CityInventoryDashboard";

type Tab = "pins" | "launcher";

const DEFAULT_TAB: Tab = "pins";

function parseTabParam(params: URLSearchParams): Tab | null {
  const raw = params.get("tab")?.trim().toLowerCase();
  if (raw === "pins" || raw === "deal-pins") return "pins";
  if (raw === "launcher" || raw === "wizard" || raw === "research-wizard")
    return "launcher";
  return null;
}

function parseMarketParam(params: URLSearchParams): ResearchMarketId | null {
  const raw = params.get("market")?.trim();
  if (!raw) return null;
  const hit = RESEARCH_MARKETS.find((m) => m.id === raw);
  return hit ? (hit.id as ResearchMarketId) : null;
}

function readStateFromSearch(search: string): {
  tab: Tab;
  marketId: ResearchMarketId;
} {
  const params = new URLSearchParams(search);
  const tab = parseTabParam(params) ?? DEFAULT_TAB;
  const marketId =
    parseMarketParam(params) ?? (RESEARCH_MARKETS[0]?.id as ResearchMarketId);
  return { tab, marketId };
}

function replaceAppSearchParams(tab: Tab, marketId: ResearchMarketId) {
  const params = new URLSearchParams();
  params.set("tab", tab);
  params.set("market", marketId);
  const qs = params.toString();
  const path = window.location.pathname || "/";
  const next = `${path}?${qs}`;
  if (`${window.location.pathname}${window.location.search}` !== next) {
    window.history.replaceState(null, "", next);
  }
}

export default function App() {
  const [tab, setTab] = useState<Tab>(
    () => readStateFromSearch(window.location.search).tab,
  );
  const [marketId, setMarketId] = useState<ResearchMarketId>(
    () => readStateFromSearch(window.location.search).marketId,
  );

  useEffect(() => {
    replaceAppSearchParams(tab, marketId);
  }, [tab, marketId]);

  useEffect(() => {
    const onPop = () => {
      const next = readStateFromSearch(window.location.search);
      setTab(next.tab);
      setMarketId(next.marketId);
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  const activeMarket = useMemo(() => {
    const m = RESEARCH_MARKETS.find((x) => x.id === marketId);
    return m?.bundle ?? RESEARCH_MARKETS[0]!.bundle;
  }, [marketId]);

  const activeRecord = useMemo(
    () =>
      RESEARCH_MARKETS.find((x) => x.id === marketId) ?? RESEARCH_MARKETS[0]!,
    [marketId],
  );

  const tabHint =
    tab === "pins"
      ? "Straight-line miles vs anchor venues — curated inventory JSON."
      : "Step-by-step `/business-research-city` command builder + agent handoff package.";

  const builtAt = new Date(__BUILD_TIME__);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <a
        href="#research-main"
        className="fixed left-4 top-4 z-[100] -translate-y-24 rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground opacity-0 transition focus:translate-y-0 focus:opacity-100"
      >
        Skip to workspace
      </a>

      <header className="sticky top-0 z-40 border-b border-border bg-card/95 shadow-dashboard backdrop-blur">
        <div className="mx-auto flex max-w-[1600px] flex-col gap-4 px-4 py-4 sm:px-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-border bg-muted">
                <GitBranch className="h-[22px] w-[22px] text-muted-foreground" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Site selection artifacts
                </p>
                <h1 className="text-xl font-semibold tracking-tight sm:text-[1.35rem]">
                  business-research-city
                </h1>
              </div>
            </div>

            <nav
              className="flex w-full rounded-xl border border-border bg-muted/50 p-1 sm:w-auto sm:min-w-[22rem]"
              aria-label="Primary"
            >
              <button
                type="button"
                onClick={() => setTab("pins")}
                className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:flex-initial sm:justify-center sm:px-4 ${
                  tab === "pins"
                    ? "border border-border bg-card text-card-foreground shadow-dashboard"
                    : "text-muted-foreground hover:bg-background/70 hover:text-foreground"
                }`}
              >
                <LayoutGrid className="h-4 w-4" />
                Deal pins
              </button>
              <button
                type="button"
                onClick={() => setTab("launcher")}
                className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:flex-initial sm:justify-center sm:px-4 ${
                  tab === "launcher"
                    ? "border border-border bg-card text-card-foreground shadow-dashboard"
                    : "text-muted-foreground hover:bg-background/70 hover:text-foreground"
                }`}
              >
                <Terminal className="h-4 w-4" />
                Research wizard
              </button>
            </nav>

            <div className="flex w-full shrink-0 flex-wrap items-center justify-end gap-2 sm:w-auto">
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="inline-flex h-10 items-center gap-2 rounded-lg border border-border bg-card px-3 text-xs font-semibold uppercase tracking-wide text-foreground shadow-sm transition hover:bg-muted/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                title="Reload the app (use after a deploy or data refresh on Zo)"
              >
                <RefreshCw className="h-4 w-4" aria-hidden />
                Refresh
              </button>
              <span
                className="hidden text-[11px] text-muted-foreground sm:inline"
                title="Time this build was produced (Vite)"
              >
                Built{" "}
                {builtAt.toLocaleString(undefined, {
                  dateStyle: "medium",
                  timeStyle: "short",
                })}
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-2 border-t border-border pt-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
            <p className="max-w-xl text-xs leading-relaxed text-muted-foreground sm:text-[13px]">
              {tabHint}
            </p>

            {tab === "pins" ? (
              <label className="flex shrink-0 flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Market
                <select
                  value={marketId}
                  onChange={(e) =>
                    setMarketId(e.target.value as ResearchMarketId)
                  }
                  className="min-h-10 min-w-[14rem] rounded-lg border border-input bg-background px-3 py-2 text-sm font-medium normal-case tracking-normal text-foreground shadow-sm outline-none transition focus-visible:ring-2 focus-visible:ring-ring"
                  aria-label="Select research market"
                >
                  {RESEARCH_MARKETS.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.label}
                    </option>
                  ))}
                </select>
              </label>
            ) : (
              <span className="rounded-lg border border-dashed border-border bg-muted/30 px-4 py-2 text-xs leading-snug text-muted-foreground">
                Wizard targets any city slug — pinned markets live only on Deal
                pins.
              </span>
            )}
          </div>

          {tab === "pins" ? (
            <p className="text-[11px] text-muted-foreground">
              {activeRecord.bundle._meta.city},{" "}
              {activeRecord.bundle._meta.state} ·{" "}
              <span className="font-medium text-foreground">
                {activeRecord.subtitle}
              </span>{" "}
              · repo{" "}
              <code className="rounded-md bg-muted px-1 py-px font-mono text-[11px]">
                cities/{activeRecord.repoSlug}/…
              </code>
            </p>
          ) : null}
        </div>
      </header>

      <main id="research-main" tabIndex={-1}>
        {tab === "launcher" ? (
          <CityExpansionDashboard />
        ) : (
          <CityInventoryDashboard key={marketId} bundle={activeMarket} />
        )}
      </main>
    </div>
  );
}
