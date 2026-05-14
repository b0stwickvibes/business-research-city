import {
  Fragment,
  useEffect,
  useMemo,
  useState,
  type SyntheticEvent,
} from "react";
import {
  ChevronRight,
  DollarSign,
  ImageIcon,
  LayoutDashboard,
  Mail,
  MapPin,
  Phone,
  Ruler,
  SearchX,
  User,
} from "lucide-react";

import { cn } from "../lib/utils";
import { Badge, type DealStatusBadge } from "./ui/badge";
import { Button } from "./ui/button";
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
  agents: Agent[];
  images: string[];
  artifactPaths: string[];
  flags: string[];
  /** Playbook gate; omitted JSON → Reference in UI */
  status?: string;
};

const STATUS_LABELS: Record<DealStatusBadge, string> = {
  diligence: "Diligence",
  "rejected-policy": "Rejected (policy)",
  appendix: "Appendix",
  reference: "Reference",
};

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
      className="shadow-dashboard"
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
            <CardTitle className="mt-2 text-lg leading-snug">
              {row.headline}
            </CardTitle>
            <CardDescription className="mt-2 leading-relaxed">
              {row.addressLine}, {row.city}, {row.state} {row.zip}
            </CardDescription>
            <p className="mt-2 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
              Source · {row.listingSource}
            </p>
          </div>
          <div className="shrink-0 rounded-lg border bg-muted px-3 py-2 text-center">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
              Miles
            </p>
            <p className="text-lg font-semibold tabular-nums leading-none text-foreground">
              {haversineMiles(row.lat, row.lng, venue.lat, venue.lng).toFixed(
                2,
              )}
            </p>
            <p className="mt-0.5 max-w-[5rem] truncate text-[10px] leading-tight text-muted-foreground">
              to {distanceLabel}
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 pt-6">
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
            <dt className="w-28 shrink-0 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Envelope
            </dt>
            <dd className="leading-snug text-foreground">{row.sfDisplay}</dd>
          </div>
          <div className="flex gap-3">
            <dt className="w-28 shrink-0 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Rent signal
            </dt>
            <dd className="leading-snug text-foreground">
              {row.rentDisplay ?? (
                <span className="text-muted-foreground">
                  Undisclosed—verify OM
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
      </CardContent>

      <div className="space-y-3 border-t px-6 py-4">
        <h3 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          <User className="h-4 w-4 text-muted-foreground" />
          Brokers
        </h3>
        {row.agents.filter((x) => x.name).length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No brokers parsed inline—pull from PDP markdown artifacts.
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
        <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Flags & diligence
        </h3>
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
        <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Contribution sandbox
        </h3>
        <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
          Annual sales × margin − annual rent. Ignores TI, CAM, tax, and
          debt—not underwriting.
        </p>
        <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-3">
          <label className="text-[11px] font-medium text-muted-foreground">
            Sales ($k)
            <input
              type="number"
              value={a.annualSalesK ?? ""}
              onChange={(e) =>
                setAsm(row.id, {
                  annualSalesK: e.target.value
                    ? Number(e.target.value)
                    : undefined,
                })
              }
              className="mt-1 flex h-9 w-full rounded-md border border-input bg-background px-2 text-sm tabular-nums shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
              placeholder="—"
            />
          </label>
          <label className="text-[11px] font-medium text-muted-foreground">
            Margin %
            <input
              type="number"
              value={a.marginPct ?? ""}
              onChange={(e) =>
                setAsm(row.id, {
                  marginPct: e.target.value
                    ? Number(e.target.value)
                    : undefined,
                })
              }
              className="mt-1 flex h-9 w-full rounded-md border border-input bg-background px-2 text-sm tabular-nums shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
              placeholder="—"
            />
          </label>
          <label className="text-[11px] font-medium text-muted-foreground">
            Rent ($k)
            <input
              type="number"
              value={a.annualRentK ?? ""}
              onChange={(e) =>
                setAsm(row.id, {
                  annualRentK: e.target.value
                    ? Number(e.target.value)
                    : undefined,
                })
              }
              className="mt-1 flex h-9 w-full rounded-md border border-input bg-background px-2 text-sm tabular-nums shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
              placeholder="—"
            />
          </label>
        </div>
        <p className="mt-4 text-sm font-semibold tabular-nums text-foreground">
          Contribution (pre other OpEx):{" "}
          <span className="text-emerald-700">
            {showContribAmt
              ? new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: "USD",
                  maximumFractionDigits: 0,
                }).format(contrib)
              : "—"}
          </span>
        </p>
      </div>

      <CardFooter className="flex-col items-start gap-2 border-t bg-muted/40 py-5">
        <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Repo artifacts
        </span>
        <ul className="w-full space-y-1 font-mono text-[11px] leading-relaxed text-muted-foreground">
          {row.artifactPaths.map((ap) => (
            <li key={ap} className="break-all">
              {ap}
            </li>
          ))}
        </ul>
      </CardFooter>
    </Card>
  );
}

export default function CityInventoryDashboard({ bundle }: Props) {
  const props = bundle.properties as PropertyRow[];
  const venues = bundle._meta.venues;
  const venueKeys = useMemo(() => Object.keys(venues), [venues]);

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
    window.requestAnimationFrame(() => {
      document
        .getElementById(`pin-detail-${selectedId}`)
        ?.scrollIntoView({ behavior: "smooth", block: "nearest" });
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
        <p>
          Inventory missing <strong>_meta.venues</strong> distance anchors — add{" "}
          <code className="font-mono text-xs">venues</code> to{" "}
          <code className="font-mono text-xs">inventory/*.json</code> for this
          city.
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
      <div className="border-b bg-card px-4 py-8 shadow-dashboard sm:px-8">
        <div className="mx-auto max-w-[1600px]">
          <div className="flex flex-wrap items-start justify-between gap-6">
            <div className="flex gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl border bg-muted">
                <LayoutDashboard className="h-6 w-6 text-muted-foreground" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {bundle._meta.city}, {bundle._meta.state} · Expansion
                  inventory
                </p>
                <h1 className="mt-1 text-3xl font-semibold tracking-tight text-card-foreground">
                  Lease targets
                </h1>
                <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                  Curated from playbook pins plus Crexi and PDP scrapes. Miles
                  are straight-line miles to{" "}
                  <span className="font-medium text-foreground">
                    {venue.label}
                  </span>
                  . Rent is rarely public—use the contribution sandbox as a
                  scratchpad only.
                </p>
              </div>
            </div>

            <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-end">
              <label className="flex flex-1 flex-col gap-2 text-xs font-medium uppercase tracking-wide text-muted-foreground sm:min-w-[200px]">
                Anchor venue
                <select
                  value={effectiveVenueKey}
                  onChange={(e) => setVenueKey(e.target.value)}
                  className="h-10 rounded-lg border border-input bg-background px-3 text-sm font-normal shadow-sm outline-none ring-offset-background transition focus-visible:ring-2 focus-visible:ring-ring"
                >
                  {venueKeys.map((k) => (
                    <option key={k} value={k}>
                      {venues[k].label}
                    </option>
                  ))}
                </select>
              </label>
              <label className="flex min-w-[200px] flex-1 flex-col gap-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Search
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Address, corridor, flag…"
                  className="h-10 rounded-lg border border-input bg-background px-3 text-sm shadow-sm outline-none placeholder:text-muted-foreground/70 focus-visible:ring-2 focus-visible:ring-ring"
                />
              </label>
              <label className="flex min-w-[180px] flex-1 flex-col gap-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Deal status
                <select
                  value={statusFilter}
                  onChange={(e) =>
                    setStatusFilter(e.target.value as "all" | DealStatusBadge)
                  }
                  className="h-10 rounded-lg border border-input bg-background px-3 text-sm font-normal shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  aria-label="Filter by deal status"
                >
                  <option value="all">All statuses</option>
                  <option value="diligence">Diligence</option>
                  <option value="rejected-policy">Rejected (policy)</option>
                  <option value="appendix">Appendix</option>
                  <option value="reference">Reference</option>
                </select>
              </label>
            </div>
          </div>

          <div className="mt-8 max-w-md">
            <Card className="shadow-dashboard">
              <CardHeader className="pb-2">
                <CardDescription>Inventoried pins</CardDescription>
                <CardTitle className="text-3xl tabular-nums text-foreground">
                  {props.length}
                </CardTitle>
              </CardHeader>
              <CardContent className="pb-6 text-xs text-muted-foreground">
                {rows.length === props.length
                  ? `All ${rows.length} pins match anchor and search filters.`
                  : `${rows.length} of ${props.length} pins match filters (anchor, status, search).`}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[1600px] space-y-6 px-4 pt-8 sm:px-8">
        <div className="space-y-6">
          {/* Desktop table */}
          <Card className="hidden overflow-hidden shadow-dashboard md:block">
            <CardHeader className="flex flex-row items-start justify-between space-y-0 border-b pb-4">
              <div>
                <CardTitle>Pins vs anchor</CardTitle>
                <CardDescription>
                  Showing {rows.length} row{rows.length === 1 ? "" : "s"} ·
                  Distance to {distanceLabel}. Scroll horizontally if columns
                  are clipped.
                </CardDescription>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="-mr-3 text-muted-foreground"
                onClick={() => clearFilters()}
                type="button"
              >
                Clear filters
              </Button>
            </CardHeader>
            <CardContent className="p-0 pb-px">
              <Table className="min-w-[800px]">
                <TableHeader>
                  <TableRow className="hover:bg-transparent border-0">
                    <TableHead scope="col" className="pl-6 w-[88px]">
                      Photo
                    </TableHead>
                    <TableHead scope="col">Property</TableHead>
                    <TableHead scope="col" className="hidden lg:table-cell">
                      Corridor
                    </TableHead>
                    <TableHead scope="col">SF envelope</TableHead>
                    <TableHead scope="col">Rent signal</TableHead>
                    <TableHead scope="col">Status</TableHead>
                    <TableHead scope="col" className="text-right">
                      Straight-line mi
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
                          No curated pins in this manifest yet
                        </p>
                        <p className="mt-2 max-w-md text-xs text-muted-foreground">
                          Add properties via the research pipeline (
                          <code className="rounded bg-muted px-1 py-px font-mono text-[11px]">
                            data/inventory/*.json
                          </code>
                          ). The Research wizard outlines the upstream anchors,
                          scrapes, and playbook deliverables.
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
                          No pins match this search
                        </p>
                        <p className="mt-1 max-w-sm text-xs text-muted-foreground">
                          Try clearing search, widening the query, or setting
                          deal status to{" "}
                          <strong className="font-medium text-foreground">
                            All statuses
                          </strong>
                        </p>
                        <Button
                          variant="outline"
                          size="sm"
                          className="mt-5"
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
                              className={cn(
                                "cursor-pointer border-border",
                                selectedRow ? "bg-muted" : "",
                              )}
                              onClick={() => setSelectedId(p.id)}
                            >
                              <TableCell className="pl-6">
                                <button
                                  type="button"
                                  className="relative block h-14 w-[4.75rem] overflow-hidden rounded-md border bg-muted text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
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
                                <span className="inline-flex rounded-md border border-border bg-muted/50 px-2 py-0.5 font-mono text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                                  {p.corridor}
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
                                      <span className="italic text-muted-foreground">
                                        N/D
                                      </span>
                                    )}
                                  </span>
                                </span>
                                {p.rentNotes ? (
                                  <p className="mt-1 max-w-[12rem] text-[11px] leading-snug text-muted-foreground">
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
                              <TableRow className="cursor-default border-t-2 border-primary/35 bg-muted/40 hover:bg-muted/40">
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
            <CardFooter className="flex flex-col gap-2 border-t bg-muted/40 px-6 py-3 text-[11px] leading-relaxed text-muted-foreground">
              {bundle._meta.coordinateDisclaimer}
            </CardFooter>
          </Card>

          {/* Mobile stacked cards */}
          <div className="space-y-3 md:hidden">
            <div className="flex items-center justify-between px-1">
              <span className="text-sm font-semibold text-foreground">
                {noInventory
                  ? "0 pins"
                  : `${rows.length} pin${rows.length === 1 ? "" : "s"}`}
              </span>
              <Button
                variant="outline"
                size="sm"
                type="button"
                onClick={() => clearFilters()}
              >
                Clear filters
              </Button>
            </div>
            {noInventory ? (
              <Card className="border-dashed shadow-dashboard">
                <CardContent className="flex flex-col items-center py-12 text-center">
                  <ImageIcon className="mb-3 h-9 w-9 text-muted-foreground/45" />
                  <p className="text-sm font-medium text-foreground">
                    No curated pins in this manifest yet
                  </p>
                  <p className="mt-2 max-w-xs text-xs text-muted-foreground">
                    Populate{" "}
                    <code className="rounded bg-muted px-1 font-mono text-[11px]">
                      data/inventory/
                    </code>{" "}
                    after the research run.
                  </p>
                </CardContent>
              </Card>
            ) : null}
            {!noInventory && filteredOut ? (
              <Card className="border-dashed shadow-dashboard">
                <CardContent className="flex flex-col items-center py-12 text-center">
                  <SearchX className="mb-3 h-9 w-9 text-muted-foreground/50" />
                  <p className="text-sm font-medium text-foreground">
                    No pins match filters
                  </p>
                  <p className="mt-2 max-w-xs text-xs text-muted-foreground">
                    Adjust search or set deal status to All statuses.
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-4"
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
                      className={`overflow-hidden shadow-dashboard ${
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
                        className="w-full cursor-pointer text-left outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
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
