import austinInventory from "@repo/cities/austin/data/inventory/austin-properties.json";
import ftlauderdaleInventory from "@repo/cities/fort-lauderdale/data/inventory/fort-lauderdale-properties.json";
import tampaInventory from "@repo/cities/tampa/data/inventory/tampa-properties.json";

import type { InventoryBundle } from "../components/CityInventoryDashboard";

/** Markets with curated inventory surfaced in Deal pins */
export type ResearchMarketRecord = {
  id: string;
  label: string;
  subtitle: string;
  repoSlug: string;
  bundle: InventoryBundle;
};

export const RESEARCH_MARKETS = [
  {
    id: "austin",
    label: "Austin, TX",
    subtitle: "Moody · DKR · Q2 anchors",
    repoSlug: "austin",
    bundle: austinInventory as InventoryBundle,
  },
  {
    id: "fort-lauderdale",
    label: "Fort Lauderdale, FL",
    subtitle: "Hard Rock halo · Las Olas · Beach",
    repoSlug: "fort-lauderdale",
    bundle: ftlauderdaleInventory as InventoryBundle,
  },
  {
    id: "tampa",
    label: "Tampa, FL",
    subtitle: "Channelside · Water Street · arena overlays",
    repoSlug: "tampa",
    bundle: tampaInventory as InventoryBundle,
  },
] as const satisfies readonly ResearchMarketRecord[];

export type ResearchMarketId = (typeof RESEARCH_MARKETS)[number]["id"];

/** Seeds the wizard from markets that already have inventory manifests. */
export function wizardQuickPickOptions(): readonly {
  id: ResearchMarketId;
  label: string;
  city: string;
  state: string;
}[] {
  return RESEARCH_MARKETS.map((m) => ({
    id: m.id,
    label: m.label,
    city: m.bundle._meta.city,
    state: m.bundle._meta.state,
  }));
}
