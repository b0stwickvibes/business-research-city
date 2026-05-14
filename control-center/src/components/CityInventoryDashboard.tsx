import {
  Fragment,
  useEffect,
  useId,
  useMemo,
  useState,
  type SyntheticEvent,
} from "react";
import {
  ChevronRight,
  DollarSign,
  ExternalLink,
  ImageIcon,
  Mail,
  MapPin,
  Phone,
  Ruler,
  SearchX,
  User,
} from "lucide-react";

import {
  buildFallbackPortalLinks,
  mergeListingLinks,
} from "../lib/externalListingLinks";
import { cn } from "../lib/utils";
import { Badge, type DealStatusBadge } from "./ui/badge";
import { Button, buttonVariants } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";

type Agent = {
  name: string | null;
  email: string | null;
  phone: string | null;
  company?: string | null;
  title?: string | null;
};

/** Curated comps / operators nearby (research notes; revenue is illustrative unless sourced). */
export type NearbyVenueComp = {
  name: string;
  category?: string;
  /** Qualitative revenue draw, cited sources in text when possible */
  note?: string;
  url?: string;
};

export type PropertyRow = {
  id: string;
  headline: string;
  addressLine: string;
  city: string;
  state: string;
  zip: string;
  lat: number;
  lng: number;
  corridor: string;
  sfDisplay: string;
  rentDisplay: string | null;
  rentNotes: string | null;
  listingSource: string;
  /** Broker portal, Crexi, LoopNet shell, PDP, etc. */
  listingLinks?: { label: string; href: string }[];
  /** Similar envelope / high-traffic hospitality nearby */
  nearbyComps?: NearbyVenueComp[];
  agents: Agent[];
  images: string[];
  artifactPaths: string[];
  flags: string[];
  /** Playbook gate; omitted JSON → Reference in UI */
  status?: string;
};

const STATUS_LABELS: Record<DealStatusBadge, string> = {
  diligence: "Under review",
  "rejected-policy": "Not advancing (criteria)",
  appendix: "On hold",
  reference: "Background only",
};

/** Turn corridor keys (e.g. ut-moody-core) into readable place labels. */
function formatCorridorLabel(raw: string): string {
  return raw
    .split(/[-_]+/)
    .filter(Boolean)
    .map((w) => {
      const lower = w.toLowerCase();
      if (/^ih-?35$/i.test(lower)) return "IH-35";
      if (w.length <= 2) return w.toUpperCase();
      return w.charAt(0).toUpperCase() + w.slice(1).toLowerCase();
    })
    .join(" ");
}

function normalizeDealStatus(raw: string | undefined): DealStatusBadge {
  if (
    raw === "diligence" ||
    raw === "rejected-policy" ||
    raw === "appendix" ||
    raw === "reference"
  ) {
    return raw;
  }
  return "reference";
}

export type InventoryBundle = {
  _meta: {
    city: string;
    state: string;
    generatedFrom?: string[];
    coordinateDisclaimer: string;
    venues: Record<string, { label: string; lat: number; lng: number }>;
  };
  properties: PropertyRow[];
};

type Props = {
  bundle: InventoryBundle;
};

function listingPrimaryAlt(headline: string): string {
  const t = headline.trim();
  return t ? `Listing photo: ${t}` : "Listing photo";
}

function listingGalleryAlt(headline: string, index: number): string {
  const t = headline.trim();
  return t ? `Listing photo ${index + 1}: ${t}` : `Listing photo ${index + 1}`;
}

function haversineMiles(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number {
  const R = 3959;
  const r1 = (lat1 * Math.PI) / 180;
  const r2 = (lat2 * Math.PI) / 180;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(r1) * Math.cos(r2) * Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

type Assumption = {
  annualRentK?: number;
  annualSalesK?: number;
  marginPct?: number;
};

type RowVm = PropertyRow & { miles: number };

type VenueDatum = { label: string; lat: number; lng: number };

function PropertyBreakdownPanel({
  row,
  venue,
  distanceLabel,
  assumptions,
  setAsm,
  onInteract,
}: {
  row: RowVm;
  venue: VenueDatum;
  distanceLabel: string;
  assumptions: Record<string, Assumption>;
  setAsm: (id: string, patch: Partial<Assumption>) => void;
  onInteract?: (e: SyntheticEvent) => void;
}) {
  const sandboxFieldId = useId();
  const a = assumptions[row.id] ?? {};
  const sales = (a.annualSalesK ?? 0) * 1000;
  const rent = (a.annualRentK ?? 0) * 1000;
  const margin = (a.marginPct ?? 0) / 100;
  const contrib = sales * margin - rent;

  const showContribAmt =
    a.annualSalesK !== undefined ||
    a.annualRentK !== undefined ||
    a.marginPct !== undefined;

  return (
    <Card
      className="border border-border shadow-sm"
      role="region"
      aria-label={`Details for ${row.headline}`}
      onMouseDown={onInteract}
      onClick={onInteract}
    >
      <CardHeader className="border-b">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <Badge status={normalizeDealStatus(row.status)}>
                {STATUS_LABELS[normalizeDealStatus(row.status)]}
              </Badge>
            </div>
            <p className="mt-2 text-lg font-semibold leading-snug tracking-tight text-card-foreground">
              {row.headline}
            </p>
            <CardDescription className="mt-2 leading-relaxed">
              {row.addressLine}, {row.city}, {row.state} {row.zip}
            </CardDescription>
            <p className="mt-2 text-xs font-medium text-muted-foreground">
              <span className="text-[0.65rem] font-semibold uppercase tracking-wide text-muted-foreground">
                How we sourced this
              </span>
              <span className="mt-1 block font-normal normal-case tracking-normal">
                {row.listingSource}
              </span>
            </p>
          </div>
          <div className="shrink-0 rounded-lg border bg-muted px-3 py-2 text-center">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Distance
            </p>
            <p className="text-lg font-semibold tabular-nums leading-none text-foreground">
              {haversineMiles(row.lat, row.lng, venue.lat, venue.lng).toFixed(
                2,
              )}
            </p>
            <p className="mt-1 max-w-[6.5rem] truncate text-xs leading-tight text-muted-foreground">
              mi to {distanceLabel}
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-5 pt-5">
        <section className="space-y-2">
          <h4 className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            <ExternalLink className="h-4 w-4 text-muted-foreground" aria-hidden />
            Listings & maps
          </h4>
          <p className="text-xs leading-relaxed text-muted-foreground">
            Saved listing links appear first when we have them. The other buttons
            look up this address on public sites. Many leases are marketed only on
            industry platforms your team opens separately.
          </p>
          <div className="flex flex-wrap gap-2">
            {mergeListingLinks(
              row.listingLinks,
              buildFallbackPortalLinks(row),
            ).map((link) => (
              <a
                key={`${link.label}-${link.href}`}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  buttonVariants({ variant: "outline", size: "sm" }),
                  "gap-1.5 font-normal min-h-11 px-4 sm:min-h-10 sm:h-8 sm:px-3",
                )}
              >
                {link.label}
                <ExternalLink className="h-3 w-3 opacity-70" aria-hidden />
              </a>
            ))}
          </div>
        </section>

        <div className="grid grid-cols-3 gap-2">
          {(row.images.length ? row.images : [null]).map((src, i) => (
            <div
              key={src ?? `ph-${i}`}
              className="aspect-[4/3] overflow-hidden rounded-lg border bg-muted"
            >
              {src ? (
                <img
                  src={src}
                  alt={listingGalleryAlt(row.headline, i)}
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-muted-foreground">
                  <ImageIcon className="h-8 w-8" />
                </div>
              )}
            </div>
          ))}
        </div>

        <dl className="space-y-3 text-sm">
          <div className="flex gap-3">
            <dt className="w-32 shrink-0 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Size
            </dt>
            <dd className="leading-snug text-foreground">{row.sfDisplay}</dd>
          </div>
          <div className="flex gap-3">
            <dt className="w-32 shrink-0 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Rent (if listed)
            </dt>
            <dd className="leading-snug text-foreground">
              {row.rentDisplay ?? (
                <span className="text-muted-foreground">
                  Not publicly listed; confirm with broker or offering package
                </span>
              )}
              {row.rentNotes ? (
                <span className="mt-1 block text-xs leading-snug text-muted-foreground">
                  {row.rentNotes}
                </span>
              ) : null}
            </dd>
          </div>
        </dl>

        {row.nearbyComps?.length ? (
          <section className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Similar venues nearby
            </h4>
            <p className="text-xs leading-relaxed text-muted-foreground">
              Examples of nightlife or dining draw in the trade area for context.
              Notes are directional; treat rent and revenue as unverified unless
              your diligence cites a source.
            </p>
            <ul className="divide-y divide-border text-sm">
              {row.nearbyComps.map((comp) => (
                <li key={comp.name} className="py-3 first:pt-0 last:pb-0">
                  <div className="font-medium text-foreground">
                    {comp.url ? (
                      <a
                        href={comp.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 underline-offset-4 hover:underline"
                      >
                        {comp.name}
                        <ExternalLink
                          className="h-3 w-3 shrink-0 opacity-70"
                          aria-hidden
                        />
                      </a>
                    ) : (
                      comp.name
                    )}
                  </div>
                  {comp.category ? (
                    <p className="mt-1 text-xs text-muted-foreground">
                      {comp.category}
                    </p>
                  ) : null}
                  {comp.note ? (
                    <p className="mt-2 text-sm leading-relaxed text-foreground">
                      {comp.note}
                    </p>
                  ) : null}
                </li>
              ))}
            </ul>
          </section>
        ) : null}
      </CardContent>

      <div className="space-y-3 border-t px-6 py-4">
        <h4 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          <User className="h-4 w-4 text-muted-foreground" aria-hidden />
          Brokers
        </h4>
        {row.agents.filter((x) => x.name).length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No broker contacts on file for this summary. Ask the deal team for
            the listing package if you need names and phones.
          </p>
        ) : (
          <ul className="space-y-3 text-sm">
            {row.agents.map((agent, idx) =>
              agent.name ? (
                <li key={`${agent.name}-${idx}`}>
                  <div className="font-medium text-foreground">
                    {agent.name}
                  </div>
                  {(agent.title || agent.company) && (
                    <div className="text-xs text-muted-foreground">
                      {[agent.title, agent.company].filter(Boolean).join(" · ")}
                    </div>
                  )}
                  <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs">
                    {agent.email ? (
                      <a
                        href={`mailto:${agent.email}`}
                        className="inline-flex items-center gap-1 font-medium text-foreground underline-offset-4 hover:underline"
                      >
                        <Mail className="h-3 w-3" />
                        {agent.email}
                      </a>
                    ) : null}
                    {agent.phone ? (
                      <a
                        href={`tel:${agent.phone.replace(/\D/g, "")}`}
                        className="inline-flex items-center gap-1 font-medium text-foreground underline-offset-4 hover:underline"
                      >
                        <Phone className="h-3 w-3" />
                        {agent.phone}
                      </a>
                    ) : null}
                  </div>
                </li>
              ) : null,
            )}
          </ul>
        )}
      </div>

      <div className="border-t px-6 py-4">
        <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Diligence notes
        </h4>
        <ul className="mt-2 space-y-2 text-sm text-foreground">
          {row.flags.map((f) => (
            <li key={f} className="flex gap-2">
              <ChevronRight className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
              {f}
            </li>
          ))}
        </ul>
      </div>

      <div className="border-t px-6 py-5">
        <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Rough economics (illustrative only)
        </h4>
        <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
          Estimates annual contribution before build-out costs, shared building
          charges, taxes, and financing. Not a valuation or underwriting model.
        </p>
        <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-3">
          <label
            className="text-xs font-medium text-muted-foreground"
            htmlFor={`${sandboxFieldId}-sales`}
          >
            Estimated annual sales ($ thousands)
            <input
              id={`${sandboxFieldId}-sales`}
              type="number"
              inputMode="decimal"
              value={a.annualSalesK ?? ""}
              onChange={(e) =>
                setAsm(row.id, {
                  annualSalesK: e.target.value
                    ? Number(e.target.value)
                    : undefined,
                })
              }
              className="mt-1 flex h-11 w-full rounded-md border border-input bg-background px-2 text-sm tabular-nums shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-ring sm:h-10"
              placeholder=""
            />
          </label>
          <label
            className="text-xs font-medium text-muted-foreground"
            htmlFor={`${sandboxFieldId}-margin`}
          >
            Margin (%)
            <input
              id={`${sandboxFieldId}-margin`}
              type="number"
              inputMode="decimal"
              value={a.marginPct ?? ""}
              onChange={(e) =>
                setAsm(row.id, {
                  marginPct: e.target.value
                    ? Number(e.target.value)
                    : undefined,
                })
              }
              className="mt-1 flex h-11 w-full rounded-md border border-input bg-background px-2 text-sm tabular-nums shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-ring sm:h-10"
              placeholder=""
            />
          </label>
          <label
            className="text-xs font-medium text-muted-foreground"
            htmlFor={`${sandboxFieldId}-rent`}
          >
            Estimated annual rent ($ thousands)
            <input
              id={`${sandboxFieldId}-rent`}
              type="number"
              inputMode="decimal"
              value={a.annualRentK ?? ""}
              onChange={(e) =>
                setAsm(row.id, {
                  annualRentK: e.target.value
                    ? Number(e.target.value)
                    : undefined,
                })
              }
              className="mt-1 flex h-11 w-full rounded-md border border-input bg-background px-2 text-sm tabular-nums shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-ring sm:h-10"
              placeholder=""
            />
          </label>
        </div>
        <p className="mt-4 text-sm font-semibold tabular-nums text-foreground">
          Illustrative yearly contribution before other operating costs:{" "}
          <span className="text-emerald-700">
            {showContribAmt
              ? new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: "USD",
                  maximumFractionDigits: 0,
                }).format(contrib)
              : "-"}
          </span>
        </p>
      </div>

      <CardFooter className="flex-col items-start gap-0 border-t bg-muted/40 py-0">
        <details className="group w-full border-t border-border bg-muted/40 py-0">
          <summary className="mx-6 my-5 cursor-pointer list-none rounded-md text-xs font-semibold uppercase tracking-wide text-muted-foreground outline-none [&::-webkit-details-marker]:hidden focus-visible:ring-2 focus-visible:ring-ring">
            Research team: internal file references
          </summary>
          <ul className="mx-6 mb-5 mt-2 space-y-1.5 text-xs leading-relaxed text-muted-foreground">
            {row.artifactPaths.map((ap) => (
              <li key={ap} className="break-all font-mono">
                {ap}
              </li>
            ))}
          </ul>
        </details>
      </CardFooter>
    </Card>
  );
}

export default function CityInventoryDashboard({ bundle }: Props) {
  const props = bundle.properties as PropertyRow[];
  const venues = bundle._meta.venues;
  const venueKeys = useMemo(() => Object.keys(venues), [venues]);
  const filterFieldId = useId();

  const [venueKey, setVenueKey] = useState(
    () => Object.keys(bundle._meta.venues)[0] ?? "",
  );
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | DealStatusBadge>(
    "all",
  );
  const [selectedId, setSelectedId] = useState<string | null>(
    props[0]?.id ?? null,
  );
  const [assumptions, setAssumptions] = useState<Record<string, Assumption>>(
    {},
  );

  const fallbackVenueKey = venueKeys[0] ?? "";
  const effectiveVenueKey =
    venueKeys.length === 0
      ? ""
      : venues[venueKey]
        ? venueKey
        : fallbackVenueKey;

  const venue = effectiveVenueKey ? venues[effectiveVenueKey] : undefined;

  const rows: RowVm[] = useMemo(() => {
    if (!venue) {
      return [];
    }
    const q = query.trim().toLowerCase();
    return props
      .map((p) => ({
        ...p,
        miles: haversineMiles(p.lat, p.lng, venue.lat, venue.lng),
      }))
      .filter((p) => {
        if (statusFilter !== "all") {
          if (normalizeDealStatus(p.status) !== statusFilter) return false;
        }
        if (!q) return true;
        const st = STATUS_LABELS[normalizeDealStatus(p.status)].toLowerCase();
        return [p.headline, p.addressLine, p.zip, p.corridor, st, ...p.flags]
          .join(" ")
          .toLowerCase()
          .includes(q);
      })
      .sort((a, b) => a.miles - b.miles);
  }, [props, venue, query, statusFilter]);

  useEffect(() => {
    if (
      fallbackVenueKey &&
      venueKey !== fallbackVenueKey &&
      !venues[venueKey]
    ) {
      setVenueKey(fallbackVenueKey);
    }
  }, [fallbackVenueKey, venueKey, venues]);

  useEffect(() => {
    if (rows.length === 0) {
      setSelectedId(null);
      return;
    }
    if (!rows.some((r) => r.id === selectedId)) {
      setSelectedId(rows[0].id);
    }
  }, [rows, selectedId]);

  useEffect(() => {
    if (!selectedId) return;
    const el = document.getElementById(`pin-detail-${selectedId}`);
    if (!el) return;
    window.requestAnimationFrame(() => {
      const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      el.scrollIntoView({
        behavior: reduceMotion ? "auto" : "smooth",
        block: "nearest",
      });
    });
  }, [selectedId]);

  const setAsm = (id: string, patch: Partial<Assumption>) => {
    setAssumptions((prev) => ({
      ...prev,
      [id]: { ...prev[id], ...patch },
    }));
  };

  const clearFilters = () => {
    setQuery("");
    setStatusFilter("all");
  };

  if (!venue || venueKeys.length === 0) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center p-12 text-center text-sm text-muted-foreground">
        <p className="max-w-md">
          We can&apos;t show distances for this city yet because no benchmark
          locations are on file. Ask the research team to add venues for this
          market so the shortlist can sort by mileage.
        </p>
      </div>
    );
  }

  const distanceLabel =
    venue.label.charAt(0).toUpperCase() + venue.label.slice(1);

  const noInventory = props.length === 0;
  const filteredOut =
    !noInventory &&
    rows.length === 0 &&
    (query.trim().length > 0 || statusFilter !== "all");

  return (
    <div className="min-h-screen bg-background pb-16">
      <div className="border-b bg-card px-4 py-5 sm:px-8">
        <div className="mx-auto flex max-w-[1600px] flex-col gap-4 lg:flex-row lg:items-start lg:justify-between lg:gap-8">
          <div className="min-w-0 max-w-2xl space-y-1">
            <h2 className="text-xl font-semibold tracking-tight text-card-foreground sm:text-2xl">
              {bundle._meta.city}, {bundle._meta.state}
            </h2>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Shortlist sorted by crow-flight distance from{" "}
              <span className="font-medium text-foreground">
                {venue.label}
              </span>
              .{" "}
              <span className="tabular-nums font-medium text-foreground">
                {rows.length === props.length
                  ? `${rows.length} sites`
                  : `${rows.length} of ${props.length} sites`}
              </span>{" "}
              match your filters. Open a row for maps, size, contacts, and
              notes.
            </p>
          </div>

          <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2 lg:max-w-xl lg:flex-1 xl:max-w-3xl">
            <label
              className="flex flex-col gap-1.5 text-xs font-medium uppercase tracking-wide text-muted-foreground"
              htmlFor={`${filterFieldId}-anchor`}
            >
              Benchmark location
              <select
                id={`${filterFieldId}-anchor`}
                value={effectiveVenueKey}
                onChange={(e) => setVenueKey(e.target.value)}
                className="min-h-11 rounded-lg border border-input bg-background px-3 text-sm font-normal shadow-sm outline-none ring-offset-background transition focus-visible:ring-2 focus-visible:ring-ring"
              >
                {venueKeys.map((k) => (
                  <option key={k} value={k}>
                    {venues[k].label}
                  </option>
                ))}
              </select>
            </label>
            <label
              className="flex flex-col gap-1.5 text-xs font-medium uppercase tracking-wide text-muted-foreground"
              htmlFor={`${filterFieldId}-search`}
            >
              Search
              <input
                id={`${filterFieldId}-search`}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Address, neighborhood, or note…"
                className="min-h-11 rounded-lg border border-input bg-background px-3 text-sm shadow-sm outline-none placeholder:text-muted-foreground/70 focus-visible:ring-2 focus-visible:ring-ring"
              />
            </label>
            <label
              className="flex flex-col gap-1.5 text-xs font-medium uppercase tracking-wide text-muted-foreground sm:col-span-2 xl:col-span-1"
              htmlFor={`${filterFieldId}-status`}
            >
              Screening stage
              <select
                id={`${filterFieldId}-status`}
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(e.target.value as "all" | DealStatusBadge)
                }
                className="min-h-11 rounded-lg border border-input bg-background px-3 text-sm font-normal shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value="all">All stages</option>
                <option value="diligence">{STATUS_LABELS.diligence}</option>
                <option value="rejected-policy">
                  {STATUS_LABELS["rejected-policy"]}
                </option>
                <option value="appendix">{STATUS_LABELS.appendix}</option>
                <option value="reference">{STATUS_LABELS.reference}</option>
              </select>
            </label>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[1600px] space-y-6 px-4 pt-8 sm:px-8">
        <div className="space-y-6">
          {/* Desktop table */}
          <Card className="hidden overflow-hidden border border-border shadow-sm md:block">
            <CardHeader className="flex flex-row items-start justify-between space-y-0 border-b pb-4">
              <div>
                <CardTitle>Shortlisted sites</CardTitle>
                <CardDescription>
                  {rows.length} site
                  {rows.length === 1 ? "" : "s"} vs {distanceLabel}. Wider table:
                  scroll sideways.
                </CardDescription>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="-mr-3 min-h-11 text-muted-foreground sm:min-h-9"
                onClick={() => clearFilters()}
                type="button"
              >
                Clear filters
              </Button>
            </CardHeader>
            <CardContent className="p-0 pb-px">
              <Table className="min-w-[800px]">
                <caption className="sr-only">
                  Sites sorted by straight-line mileage to {distanceLabel}.
                  Showing {rows.length} after filters.
                </caption>
                <TableHeader>
                  <TableRow className="hover:bg-transparent border-0">
                    <TableHead scope="col" className="pl-6 w-[88px]">
                      Photo
                    </TableHead>
                    <TableHead scope="col">Property</TableHead>
                    <TableHead scope="col" className="hidden lg:table-cell">
                      Area tag
                    </TableHead>
                    <TableHead scope="col">Size</TableHead>
                    <TableHead scope="col">Rent</TableHead>
                    <TableHead scope="col">Stage</TableHead>
                    <TableHead scope="col" className="text-right">
                      Miles (approx.)
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {noInventory ? (
                    <TableRow className="hover:bg-transparent">
                      <TableCell
                        colSpan={7}
                        className="py-16 text-center text-muted-foreground"
                      >
                        <ImageIcon className="mx-auto mb-3 h-10 w-10 opacity-35" />
                        <p className="text-sm font-medium text-foreground">
                          Nothing in this portfolio yet
                        </p>
                        <p className="mt-2 max-w-md text-xs leading-relaxed text-muted-foreground">
                          When diligence adds saved sites for this city, they
                          will appear here for review and touring.
                        </p>
                      </TableCell>
                    </TableRow>
                  ) : null}
                  {!noInventory && filteredOut ? (
                    <TableRow className="hover:bg-transparent">
                      <TableCell
                        colSpan={7}
                        className="py-16 text-center text-muted-foreground"
                      >
                        <SearchX className="mx-auto mb-3 h-10 w-10 opacity-45" />
                        <p className="text-sm font-medium text-foreground">
                          No matching sites
                        </p>
                        <p className="mt-1 max-w-sm text-xs text-muted-foreground">
                          Try resetting search or set screening stage to{" "}
                          <strong className="font-medium text-foreground">
                            All stages
                          </strong>
                          .
                        </p>
                        <Button
                          variant="outline"
                          size="sm"
                          className="mt-5 min-h-11 sm:min-h-9"
                          type="button"
                          onClick={() => clearFilters()}
                        >
                          Clear filters
                        </Button>
                      </TableCell>
                    </TableRow>
                  ) : null}
                  {!noInventory && !filteredOut
                    ? rows.map((p) => {
                        const selectedRow = selectedId === p.id;
                        return (
                          <Fragment key={p.id}>
                            <TableRow
                              data-state={selectedRow ? "selected" : undefined}
                              tabIndex={0}
                              className={cn(
                                "cursor-pointer border-border outline-none focus-visible:bg-muted/80 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring",
                                selectedRow ? "bg-muted" : "",
                              )}
                              onClick={() => setSelectedId(p.id)}
                              onKeyDown={(e) => {
                                if (e.key === "Enter" || e.key === " ") {
                                  e.preventDefault();
                                  setSelectedId(p.id);
                                }
                              }}
                            >
                              <TableCell className="pl-6">
                                <button
                                  type="button"
                                  className="relative block h-14 min-h-11 w-[4.75rem] overflow-hidden rounded-md border bg-muted text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                                  aria-expanded={selectedRow}
                                  aria-controls={
                                    selectedRow
                                      ? `pin-detail-${p.id}`
                                      : undefined
                                  }
                                  aria-label={`${selectedRow ? "Hide" : "Show"} details for ${p.headline}`}
                                  onClick={() => setSelectedId(p.id)}
                                >
                                  {p.images[0] ? (
                                    <img
                                      src={p.images[0]}
                                      alt={listingPrimaryAlt(p.headline)}
                                      className="h-full w-full object-cover"
                                      loading="lazy"
                                    />
                                  ) : (
                                    <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                                      <ImageIcon
                                        className="h-5 w-5"
                                        aria-hidden
                                      />
                                    </div>
                                  )}
                                </button>
                              </TableCell>
                              <TableCell className="max-w-[280px]">
                                <div className="font-medium text-foreground">
                                  {p.headline}
                                </div>
                                <div className="mt-1 flex items-start gap-1 text-xs text-muted-foreground">
                                  <MapPin className="mt-0.5 h-3 shrink-0" />
                                  <span>
                                    {p.addressLine}, {p.city} {p.zip}
                                  </span>
                                </div>
                              </TableCell>
                              <TableCell className="hidden lg:table-cell">
                                <span className="inline-flex rounded-md border border-border bg-muted/50 px-2 py-0.5 text-xs font-medium text-muted-foreground">
                                  {formatCorridorLabel(p.corridor)}
                                </span>
                              </TableCell>
                              <TableCell>
                                <span className="inline-flex items-start gap-1 text-sm text-foreground">
                                  <Ruler className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                                  <span className="leading-snug">
                                    {p.sfDisplay}
                                  </span>
                                </span>
                              </TableCell>
                              <TableCell>
                                <span className="inline-flex items-start gap-1 text-sm text-foreground">
                                  <DollarSign className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                                  <span>
                                    {p.rentDisplay ?? (
                                      <span className="text-muted-foreground">
                                        Unknown
                                      </span>
                                    )}
                                  </span>
                                </span>
                                {p.rentNotes ? (
                                  <p className="mt-1 max-w-[12rem] text-xs leading-snug text-muted-foreground">
                                    {p.rentNotes}
                                  </p>
                                ) : null}
                              </TableCell>
                              <TableCell>
                                <Badge
                                  status={normalizeDealStatus(p.status)}
                                  className="whitespace-nowrap"
                                >
                                  {STATUS_LABELS[normalizeDealStatus(p.status)]}
                                </Badge>
                              </TableCell>
                              <TableCell className="pr-6 text-right font-medium tabular-nums text-foreground">
                                {p.miles.toFixed(2)}
                              </TableCell>
                            </TableRow>
                            {selectedRow ? (
                              <TableRow className="cursor-default border-t border-border bg-muted/25 hover:bg-muted/25">
                                <TableCell
                                  colSpan={7}
                                  className="p-3 pt-4 sm:p-5 sm:pt-6"
                                >
                                  <div id={`pin-detail-${p.id}`}>
                                    <PropertyBreakdownPanel
                                      row={p}
                                      venue={venue}
                                      distanceLabel={distanceLabel}
                                      assumptions={assumptions}
                                      setAsm={setAsm}
                                      onInteract={(e) => {
                                        e.stopPropagation();
                                      }}
                                    />
                                  </div>
                                </TableCell>
                              </TableRow>
                            ) : null}
                          </Fragment>
                        );
                      })
                    : null}
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter className="flex flex-col gap-2 border-t bg-muted/40 px-6 py-3 text-xs leading-relaxed text-muted-foreground">
              {bundle._meta.coordinateDisclaimer}
            </CardFooter>
          </Card>

          {/* Mobile stacked cards */}
          <div className="space-y-3 md:hidden">
            <div className="flex min-h-11 items-center justify-between gap-3 px-1 sm:min-h-0">
              <span className="text-sm font-semibold text-foreground">
                {noInventory
                  ? "0 sites"
                  : `${rows.length} site${rows.length === 1 ? "" : "s"}`}
              </span>
              <Button
                variant="outline"
                size="sm"
                type="button"
                className="min-h-11 sm:min-h-9"
                onClick={() => clearFilters()}
              >
                Clear filters
              </Button>
            </div>
            {noInventory ? (
              <Card className="border-dashed border-border shadow-sm">
                <CardContent className="flex flex-col items-center py-12 text-center">
                  <ImageIcon className="mb-3 h-9 w-9 text-muted-foreground/45" />
                  <p className="text-sm font-medium text-foreground">
                    Nothing in this portfolio yet
                  </p>
                  <p className="mt-2 max-w-xs text-xs leading-relaxed text-muted-foreground">
                    Saved sites will show up here after diligence loads this
                    market.
                  </p>
                </CardContent>
              </Card>
            ) : null}
            {!noInventory && filteredOut ? (
              <Card className="border-dashed border-border shadow-sm">
                <CardContent className="flex flex-col items-center py-12 text-center">
                  <SearchX className="mb-3 h-9 w-9 text-muted-foreground/50" />
                  <p className="text-sm font-medium text-foreground">
                    No matching sites
                  </p>
                  <p className="mt-2 max-w-xs text-xs text-muted-foreground">
                    Relax your search or set screening to All stages.
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-4 min-h-11 sm:min-h-9"
                    type="button"
                    onClick={() => clearFilters()}
                  >
                    Clear filters
                  </Button>
                </CardContent>
              </Card>
            ) : null}
            {!noInventory && !filteredOut
              ? rows.map((p) => {
                  const open = selectedId === p.id;
                  return (
                    <Card
                      key={p.id}
                      className={`overflow-hidden border border-border shadow-sm ${
                        open
                          ? "ring-2 ring-ring ring-offset-2 ring-offset-background"
                          : ""
                      }`}
                    >
                      <button
                        type="button"
                        aria-expanded={open}
                        aria-controls={open ? `pin-detail-${p.id}` : undefined}
                        aria-label={`${open ? "Hide" : "Show"} details for ${p.headline}`}
                        className="w-full min-h-11 cursor-pointer py-1 text-left outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                        onClick={() => setSelectedId(p.id)}
                      >
                        <CardContent className="flex gap-3 p-4">
                          <div className="relative h-20 w-24 shrink-0 overflow-hidden rounded-md border bg-muted">
                            {p.images[0] ? (
                              <img
                                src={p.images[0]}
                                alt={listingPrimaryAlt(p.headline)}
                                className="h-full w-full object-cover"
                                loading="lazy"
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center">
                                <ImageIcon
                                  className="h-8 w-8 text-muted-foreground"
                                  aria-hidden
                                />
                              </div>
                            )}
                          </div>
                          <div className="min-w-0 flex-1 space-y-2">
                            <Badge
                              status={normalizeDealStatus(p.status)}
                              className="w-fit"
                            >
                              {STATUS_LABELS[normalizeDealStatus(p.status)]}
                            </Badge>
                            <div className="font-medium leading-snug text-foreground">
                              {p.headline}
                            </div>
                            <p className="text-xs text-muted-foreground">
                              {p.sfDisplay}
                            </p>
                            <span className="inline-flex rounded-md border px-2 py-0.5 text-[11px] font-medium tabular-nums">
                              {p.miles.toFixed(2)} mi
                            </span>
                          </div>
                        </CardContent>
                      </button>
                      {open ? (
                        <div
                          id={`pin-detail-${p.id}`}
                          className="border-t border-border bg-muted/30 p-3"
                        >
                          <PropertyBreakdownPanel
                            row={p}
                            venue={venue}
                            distanceLabel={distanceLabel}
                            assumptions={assumptions}
                            setAsm={setAsm}
                            onInteract={(e) => {
                              e.stopPropagation();
                            }}
                          />
                        </div>
                      ) : null}
                    </Card>
                  );
                })
              : null}
          </div>
        </div>
      </div>
    </div>
  );
}
