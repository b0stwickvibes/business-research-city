import { useEffect, useMemo, useState } from "react";
import {
  BookOpen,
  Building2,
  Check,
  ClipboardCopy,
  MapPin,
  Route,
  Settings2,
} from "lucide-react";

import { cn } from "../lib/utils";
import { wizardQuickPickOptions } from "../config/research-markets";
import { tradeAreaChoicesForSlug } from "../config/trade-presets";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";

const DEPTH_OPTIONS: {
  value: string;
  label: string;
  tagline: string;
  bullets: string[];
  pickWhen: string;
}[] = [
  {
    value: "standard",
    label: "Standard — index-first",
    tagline: "Fast corridor scan without full PDP capture.",
    bullets: [
      "Pulls portal index / search markdown you can skim in under an hour.",
      "Best first pass before you commit scraping budget on a corridor.",
      "Less broker PDF / PDP capture — expect more “call broker” follow-up.",
    ],
    pickWhen: "New city diligence, scout-only, or you only need breadth.",
  },
  {
    value: "deep",
    label: "Deep — PDP & guardrails",
    tagline: "Property-level pulls where portals allow scripted HTML.",
    bullets: [
      "Attempts PDP markdown (`data/scrapes/pdp/`), receipts bundles when available (Texas mixed beverage ladder, etc.).",
      "Heavier automation; portals may degrade (Akamai / login)—captures vary by broker host.",
      "Pairs with playbook synthesis for email-ready rejects + ranked targets.",
    ],
    pickWhen: "You are ready for FTL / Austin–style dossiers and OM follow-up.",
  },
];

const STEP_LABELS = [
  "Market",
  "Trade area",
  "Scrape depth",
  "Guardrails",
  "Review & handoff",
] as const;

export default function CityExpansionDashboard() {
  const pinnedMarkets = useMemo(() => wizardQuickPickOptions(), []);
  const [step, setStep] = useState(0);
  const [city, setCity] = useState("Austin");
  const [state, setState] = useState("TX");
  const [depth, setDepth] = useState("deep");
  const [condoPolicy, setCondoPolicy] = useState("reject");
  const [corporatePodiumPolicy, setCorporatePodiumPolicy] = useState("reject");
  const [tradeArea, setTradeArea] = useState("ut-moody-core");
  const [tradeCustom, setTradeCustom] = useState("");
  /** Optional operator notes—for Datablist / inbox handoff pasted into Cursor. */
  const [externalBrief, setExternalBrief] = useState("");

  const slug = useMemo(
    () => city.trim().toLowerCase().replace(/\s+/g, "-"),
    [city],
  );

  const presets = useMemo(() => tradeAreaChoicesForSlug(slug), [slug]);

  useEffect(() => {
    if (!presets.length) return;
    setTradeArea((prev) => {
      if (presets.some((p) => p.value === prev)) return prev;
      return presets[0].value;
    });
  }, [presets]);

  const effectiveTradeArea =
    presets.length === 0 ? tradeCustom.trim() : tradeArea;

  const command = useMemo(
    () =>
      `/business-research-city --city=${slug} --state=${state}` +
      ` --trade-area=${effectiveTradeArea}` +
      ` --depth=${depth}` +
      ` --condo_policy=${condoPolicy}` +
      ` --corporate_podium_policy=${corporatePodiumPolicy}`,
    [
      slug,
      state,
      effectiveTradeArea,
      depth,
      condoPolicy,
      corporatePodiumPolicy,
    ],
  );

  const agentBriefBody = useMemo(
    () =>
      [
        `New market: ${city.trim()}, ${state}.`,
        `Run the pinned slash command verbatim (clipboard on final step):`,
        command,
        ``,
        `Deliver the same filesystem package we use for Austin & Fort Lauderdale:`,
        `- cities/${slug}/anchors.json`,
        `- cities/${slug}/playbooks/*.md (trade-area keyed)`,
        `- cities/${slug}/data/scrapes/*.md (+ data/scrapes/pdp/*.md when depth=deep)`,
        `- Optional curated pins file: cities/${slug}/data/inventory/${slug}-properties.json with _meta.venues for dashboard distance anchors`,
        externalBrief.trim()
          ? `\nStakeholder context:\n${externalBrief.trim()}`
          : ``,
      ]
        .filter(Boolean)
        .join("\n"),
    [city, command, externalBrief, slug, state],
  );

  const canAdvanceStep0 =
    city.trim().length >= 2 && /^[a-z]{2}$/i.test(state.trim());

  const canAdvanceStep1 = presets.length
    ? Boolean(tradeArea)
    : tradeCustom.trim().length >= 2;

  const copyCommand = async () => {
    if (!effectiveTradeArea.trim()) {
      window.alert(
        'Add a trade-area label on Step 2 before copying (use the hyphenated playbook key — e.g. "waterfront-core").',
      );
      return;
    }
    try {
      await navigator.clipboard.writeText(command);
      window.alert(
        "Copied slash command.\nPaste into Cursor chat or paste into Rules / Tasks for whichever agent runs ~/Projects/business-research-city.",
      );
    } catch {
      window.alert(command);
    }
  };

  const copyAgentBrief = async () => {
    try {
      await navigator.clipboard.writeText(agentBriefBody);
      window.alert("Copied full agent briefing to clipboard.");
    } catch {
      window.alert(agentBriefBody);
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="mx-auto max-w-4xl px-4 pt-8 sm:px-8">
        <header className="mb-8 space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            business-research-city
          </p>
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">
            New city research wizard
          </h1>
          <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
            Builds the same{" "}
            <code className="rounded-md bg-muted px-1 py-px font-mono text-xs">
              /business-research-city
            </code>{" "}
            command we used for Austin and Fort Lauderdale—with plain-language
            choices instead of unexplained presets. Coming next: wiring
            Datablist or Git so an intake agent forwards the stakeholder brief
            straight into this flow.
          </p>
        </header>

        <ol className="mb-10 flex flex-wrap gap-2" aria-label="Wizard progress">
          {STEP_LABELS.map((label, i) => {
            const active = i === step;
            const complete = i < step;
            return (
              <li key={label}>
                <button
                  type="button"
                  disabled={i > step}
                  onClick={() => i <= step && setStep(i)}
                  className={cn(
                    "rounded-full px-4 py-1.5 text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                    active &&
                      "bg-primary text-primary-foreground shadow-dashboard",
                    complete && !active && "bg-muted text-foreground",
                    !active &&
                      !complete &&
                      "border border-input bg-background text-muted-foreground",
                  )}
                  aria-current={active ? "step" : undefined}
                >
                  {complete ? <Check className="mr-1 inline h-3 w-3" /> : null}{" "}
                  {label}
                </button>
              </li>
            );
          })}
        </ol>

        <Card className="shadow-dashboard">
          <CardHeader className="border-b pb-6">
            <CardTitle className="flex items-center gap-2 text-xl">
              {step === 0 ? (
                <MapPin className="h-5 w-5 text-muted-foreground" />
              ) : null}
              {step === 1 ? (
                <Route className="h-5 w-5 text-muted-foreground" />
              ) : null}
              {step === 2 ? (
                <BookOpen className="h-5 w-5 text-muted-foreground" />
              ) : null}
              {step === 3 ? (
                <Settings2 className="h-5 w-5 text-muted-foreground" />
              ) : null}
              {step === 4 ? (
                <ClipboardCopy className="h-5 w-5 text-muted-foreground" />
              ) : null}
              Step {step + 1} · {STEP_LABELS[step]}
            </CardTitle>
            <CardDescription className="text-base leading-relaxed">
              {step === 0 &&
                "City name becomes the filesystem slug; state drives postal + regulatory context cues in playbooks."}
              {step === 1 &&
                "Trade-area is only a playbook + tagging key—not a GIS polygon. Pick the narrative anchor that matches whose thesis brief you owe."}
              {step === 2 &&
                "Depth controls portal capture budget. Nothing here automatically blocks bad HTML from brokers—Akamai-heavy sites still degrade."}
              {step === 3 &&
                "Condo HOA shells and tower podiums violate the flagship thesis until leadership signs an explicit exception."}
              {step === 4 &&
                "Copy once for tooling, paste again for whoever runs the Cursor agent backlog."}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6 pt-8">
            {step === 0 ? (
              <div className="space-y-6">
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    Quick-fill from Deal pins markets
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {pinnedMarkets.map((m) => (
                      <Button
                        key={m.id}
                        variant="outline"
                        size="sm"
                        type="button"
                        onClick={() => {
                          setCity(m.city);
                          setState(m.state.toUpperCase().slice(0, 2));
                        }}
                      >
                        Use · {m.label}
                      </Button>
                    ))}
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground">
                    Same cities as the Deal pins dropdown; tweak fields below
                    when the brief differs (neighborhood nickname, typo, metro
                    edge cases).
                  </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="flex flex-col gap-2 text-sm font-medium">
                    Target city name
                    <input
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="Fort Lauderdale"
                      className="h-11 rounded-lg border border-input bg-background px-3 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring"
                    />
                    <span className="text-xs font-normal text-muted-foreground">
                      Repo slug:{" "}
                      <code className="font-mono">{slug || "…"}</code>
                    </span>
                  </label>
                  <label className="flex flex-col gap-2 text-sm font-medium">
                    State abbreviation
                    <input
                      value={state}
                      onChange={(e) =>
                        setState(e.target.value.toUpperCase().slice(0, 2))
                      }
                      placeholder="TX"
                      maxLength={2}
                      className="h-11 rounded-lg border border-input bg-background px-3 font-mono text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    />
                  </label>
                </div>

                <div className="rounded-xl border bg-muted/40 p-4 text-sm leading-relaxed text-muted-foreground">
                  <p className="font-semibold text-foreground">
                    What this creates downstream
                  </p>
                  <p className="mt-2">
                    A coherent tree under{" "}
                    <code className="font-mono text-xs">
                      ~/Projects/business-research-city/cities/
                      {slug || "slug"}/
                    </code>{" "}
                    mirrors Austin & Fort Lauderdale: anchors snapshot, markdown
                    playbooks keyed to the trade label, scraped indices, PDP
                    drops when depth is deep, and (optionally) a curated{" "}
                    <code className="font-mono text-xs">
                      data/inventory/*.json
                    </code>{" "}
                    for the Deal pins tab once coordinates + venues finish.
                  </p>
                </div>

                <label className="flex flex-col gap-2">
                  <span className="text-sm font-semibold text-foreground">
                    Intake brief (optional)
                  </span>
                  <span className="text-xs text-muted-foreground">
                    When Datablist, email, or Git issues flag a requested city,
                    paste the verbatim stakeholder bullets here—they travel into
                    the agent package on the Review step but never hit the CLI
                    command.
                  </span>
                  <textarea
                    rows={5}
                    value={externalBrief}
                    onChange={(e) => setExternalBrief(e.target.value)}
                    placeholder={`Example:\n"Austin-equivalent playbook for Savannah — anchored on Enmarket Arena nightlife + Savannah Bananas halo. Avoid riverfront HOA shells."`}
                    className="min-h-[120px] rounded-xl border border-input bg-background p-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  />
                </label>
              </div>
            ) : null}

            {step === 1 ? (
              <div className="space-y-5">
                {presets.length > 0 ? (
                  <>
                    <p className="text-sm text-muted-foreground">
                      Presets are checked into this repo&apos;s playbooks /
                      anchors. Choose the storyline that fits the expansion
                      brief.
                    </p>
                    <div className="space-y-3">
                      {presets.map((p) => (
                        <button
                          key={p.value}
                          type="button"
                          onClick={() => setTradeArea(p.value)}
                          className={cn(
                            "w-full rounded-xl border px-4 py-4 text-left transition-colors hover:bg-accent/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                            tradeArea === p.value
                              ? "border-primary ring-2 ring-primary/25"
                              : "border-border bg-card",
                          )}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <p className="font-semibold text-foreground">
                                {p.label}
                              </p>
                              <code className="mt-1 block font-mono text-[11px] text-muted-foreground">
                                --trade-area={p.value}
                              </code>
                            </div>
                            <span
                              className={cn(
                                "mt-1 h-5 w-5 shrink-0 rounded-full border",
                                tradeArea === p.value
                                  ? "border-primary bg-primary"
                                  : "border-muted-foreground/40",
                              )}
                              aria-hidden
                            />
                          </div>
                          <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
                            {p.description}
                          </p>
                        </button>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="space-y-3">
                    <p className="text-sm text-muted-foreground">
                      No baked-in presets for{" "}
                      <strong className="text-foreground">{slug}</strong> yet.
                      Type a hyphenated playbook key—the orchestrator prompts
                      you to align naming when the first playbook lands (e.g.{" "}
                      <code className="rounded bg-muted px-1 font-mono text-[11px]">
                        waterfront-hospitality-core
                      </code>
                      ).
                    </p>
                    <input
                      value={tradeCustom}
                      onChange={(e) => setTradeCustom(e.target.value)}
                      placeholder="metro-core"
                      className="h-11 w-full rounded-lg border border-input bg-background px-3 font-mono text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    />
                  </div>
                )}
              </div>
            ) : null}

            {step === 2 ? (
              <div className="grid gap-4 md:grid-cols-2">
                {DEPTH_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setDepth(opt.value)}
                    className={cn(
                      "rounded-xl border p-5 text-left transition-colors hover:bg-accent/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                      depth === opt.value
                        ? "border-primary ring-2 ring-primary/25"
                        : "border-border bg-card",
                    )}
                  >
                    <p className="font-semibold text-foreground">{opt.label}</p>
                    <p className="mt-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      {opt.pickWhen}
                    </p>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {opt.tagline}
                    </p>
                    <ul className="mt-4 space-y-2 border-t pt-4 text-xs text-muted-foreground">
                      {opt.bullets.map((b) => (
                        <li key={b}>• {b}</li>
                      ))}
                    </ul>
                  </button>
                ))}
              </div>
            ) : null}

            {step === 3 ? (
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2 rounded-xl border border-destructive/25 bg-destructive/5 p-4">
                  <label className="text-sm font-semibold text-foreground">
                    Condo / shared HOA shell
                  </label>
                  <p className="text-xs text-muted-foreground">
                    Flagship concepts expect fee-simple control of frontage /
                    acoustics—retail condominium stacks default to appendix or
                    hard reject depending on posture here.
                  </p>
                  <select
                    value={condoPolicy}
                    onChange={(e) => setCondoPolicy(e.target.value)}
                    className="mt-3 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <option value="reject">
                      Hard reject (default playbook posture)
                    </option>
                    <option value="review">
                      Route to HOA appendix lane for leadership opt-in
                    </option>
                  </select>
                </div>

                <div className="space-y-2 rounded-xl border border-amber-600/25 bg-amber-50 p-4 dark:border-amber-500/35 dark:bg-amber-950/30">
                  <label className="text-sm font-semibold text-foreground">
                    Corporate Class-A podium
                  </label>
                  <p className="text-xs text-muted-foreground">
                    Institutional tower bases carry operating agreement drag and
                    late-night amplified music conflicts—normally routed out of
                    the core thesis until there is sponsor cover.
                  </p>
                  <select
                    value={corporatePodiumPolicy}
                    onChange={(e) => setCorporatePodiumPolicy(e.target.value)}
                    className="mt-3 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <option value="reject">
                      Hard reject (tower podium appendix excluded)
                    </option>
                    <option value="review">
                      Allow tower appendix scouting with explicit caveat
                      language
                    </option>
                  </select>
                </div>
              </div>
            ) : null}

            {step === 4 ? (
              <div className="space-y-8">
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    Slash command
                  </p>
                  <pre className="mt-3 whitespace-pre-wrap break-all rounded-xl border bg-muted px-4 py-3 font-mono text-xs leading-relaxed text-foreground">
                    {command}
                  </pre>
                  <Button
                    className="mt-4 shadow-dashboard"
                    onClick={copyCommand}
                  >
                    <ClipboardCopy className="h-4 w-4" />
                    Copy command only
                  </Button>
                  <p className="mt-3 text-xs text-muted-foreground">
                    Effective trade area on the CLI:{" "}
                    <code className="font-mono">{effectiveTradeArea}</code>
                  </p>
                </div>

                <div>
                  <p className="text-sm font-semibold text-foreground">
                    Deliverables checklist for operator + agent parity
                  </p>
                  <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                    <li>• Structured anchors snapshot + narrative notes.</li>
                    <li>
                      • At least one email-ready playbook with ranked targets +
                      rejects + source table.
                    </li>
                    <li>
                      • Portal index markdown dumps + (
                      {depth === "deep" ? (
                        <>
                          PDP captures under{" "}
                          <code className="rounded bg-muted px-1 font-mono text-[11px]">
                            data/scrapes/pdp/
                          </code>
                        </>
                      ) : (
                        "skipping PDP pass until depth flips to deep"
                      )}
                      ).
                    </li>
                    <li>
                      • Optional pins manifest powering this UI after manual QA
                      of coords + `_meta.venues`.
                    </li>
                  </ul>
                  <textarea
                    readOnly
                    rows={17}
                    className="mt-4 w-full rounded-xl border bg-muted/50 p-4 font-mono text-[11px] leading-relaxed text-foreground outline-none"
                    value={agentBriefBody}
                  />
                  <Button
                    variant="outline"
                    className="mt-3"
                    onClick={copyAgentBrief}
                  >
                    Copy full briefing for intake agent / Cursor scratchpad
                  </Button>
                </div>

                <div className="rounded-xl border border-dashed bg-muted/30 p-4 text-sm leading-relaxed text-muted-foreground">
                  <Building2 className="mb-2 inline h-5 w-5 align-text-bottom text-muted-foreground" />
                  <p className="font-semibold text-foreground">
                    Near-term automation stance
                  </p>
                  <p className="mt-2">
                    Datablist (or whichever intake queue is live) should mint a
                    Git issue / branch + deposit stakeholder context and
                    requested trade thesis. First agent extracts those fields,
                    echoes this package, uploads scrapes—the second agent
                    (Composer / Sonnet / Gemini) consumes the synced repo
                    exactly like we iterated for{" "}
                    <span className="font-medium text-foreground">Austin</span>{" "}
                    & Fort Lauderdale pins.
                  </p>
                </div>
              </div>
            ) : null}
          </CardContent>

          <CardFooter className="flex flex-wrap items-center justify-between gap-4 border-t bg-muted/20 px-6 py-6">
            <Button
              variant="outline"
              type="button"
              disabled={step === 0}
              onClick={() => setStep((s) => Math.max(0, s - 1))}
            >
              Back
            </Button>

            <div className="flex flex-wrap gap-3">
              {step < STEP_LABELS.length - 1 ? (
                <Button
                  type="button"
                  disabled={
                    (step === 0 && !canAdvanceStep0) ||
                    (step === 1 && !canAdvanceStep1)
                  }
                  onClick={() =>
                    setStep((s) => Math.min(STEP_LABELS.length - 1, s + 1))
                  }
                >
                  Continue
                </Button>
              ) : null}
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
