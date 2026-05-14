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
    label: "Standard coverage",
    tagline: "Fast scan of marketed listings across the corridor.",
    bullets: [
      "Pulls summarized listing pulls the team can read in roughly an hour.",
      "Strong first cut before committing to heavier research hours.",
      "Expect more broker follow-up versus a deeply captured pass.",
    ],
    pickWhen: "Brand-new market mapping, scouting only, or you only need breadth.",
  },
  {
    value: "deep",
    label: "Full property pull",
    tagline:
      "Property-by-property saves where portals allow scripted downloads.",
    bullets: [
      "Adds richer listing worksheets and supplemental source packs where they exist.",
      "Login-heavy broker sites may block parts of the sweep.",
      "Pairs with narrative playbooks describing rejects and shortlisted names.",
    ],
    pickWhen:
      "You want Austin-style or Fort Lauderdale-style dossiers and broker outreach.",
  },
];

const STEP_LABELS = [
  "Market",
  "Focus area",
  "Depth",
  "Screening rules",
  "Copy brief",
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
        'Choose or enter a corridor label on Step 2 before copying the command.',
      );
      return;
    }
    try {
      await navigator.clipboard.writeText(command);
      window.alert(
        "Copied. Paste into the team's automation chat or playbook runner.",
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
            Site research
          </p>
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">
            Plan a new market run
          </h1>
          <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
            This wizard packages the briefing and command your research team runs
            in Cursor. Outputs mirror what Austin and Fort Lauderdale already use.
            Incoming intakes should land here instead of scattering half-context
            in chat.
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
                "City drives taxes, permitting tone, and how we label files later."}
              {step === 1 &&
                "Pick the storyline that anchors the playbook (often an arena district, downtown spine, or beach hotel strip)."}
              {step === 2 &&
                "Depth decides how exhaustive the listing capture needs to be for this briefing."}
              {step === 3 &&
                "Default rules exclude condo HOA shells and certain tower podiums unless leadership opts in."}
              {step === 4 &&
                "Copy the command plus the narrative briefing for whoever runs automation next."}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6 pt-8">
            {step === 0 ? (
              <div className="space-y-6">
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    Quick-fill pinned markets
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
                    Mirrors the Site shortlist dropdown; adjust spelling if HQ
                    uses nicknames versus the legal mailing address.
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
                      Internal folder name:{" "}
                      <span className="font-mono text-[0.8125rem]">{slug || "…"}</span>
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
                    What lands in the workspace
                  </p>
                  <p className="mt-2">
                    You get a repeatable folder bundle for{" "}
                    <span className="font-medium text-foreground">
                      {city.trim() || "the city"}
                    </span>
                    , mirroring prior markets: a snapshot of anchors, written
                    playbooks tied to your focus choice, scraped listing dumps,
                    and optional deeper captures when Depth is Full. Saving
                    coordinates unlocks today&apos;s distance table after QA.
                  </p>
                </div>

                <label className="flex flex-col gap-2">
                  <span className="text-sm font-semibold text-foreground">
                    Intake brief (optional)
                  </span>
                  <span className="text-xs text-muted-foreground">
                    Paste stakeholder bullets from intake email or chat. They ride
                    along in the briefing on the final step and never change the
                    copyable command itself.
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
                      Presets bundle the corridors we already modeled. Pick the one
                      that matches the sponsoring thesis.
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
                              <p className="mt-1 text-xs text-muted-foreground">
                                Internal key{" "}
                                <span className="font-mono">{p.value}</span>
                              </p>
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
                      No presets exist for{" "}
                      <strong className="text-foreground">{city.trim()}</strong>{" "}
                      yet. Describe a hyphenated corridor label aligned with how
                      the first playbook should read (examples: waterfront core,
                      beach strip, arena district).
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
                    Flagship concepts assume control of entrances and noise.
                    Shared condo retail stacks usually sit on hold or exit until
                    there is sponsor cover.
                  </p>
                  <select
                    value={condoPolicy}
                    onChange={(e) => setCondoPolicy(e.target.value)}
                    className="mt-3 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <option value="reject">
                      Standard out (default posture)
                    </option>
                    <option value="review">
                      Send to HOA review lane for leadership opt-in
                    </option>
                  </select>
                </div>

                <div className="space-y-2 rounded-xl border border-amber-600/25 bg-amber-50 p-4 dark:border-amber-500/35 dark:bg-amber-950/30">
                  <label className="text-sm font-semibold text-foreground">
                    Corporate Class-A podium
                  </label>
                  <p className="text-xs text-muted-foreground">
                    Major office podium bases bundle operating friction and noise
                    curfews. Normally held outside the flagship thesis unless
                    you explicitly widen scope.
                  </p>
                  <select
                    value={corporatePodiumPolicy}
                    onChange={(e) => setCorporatePodiumPolicy(e.target.value)}
                    className="mt-3 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <option value="reject">
                      Standard out (tower podium appendix excluded)
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
                    Automated command line
                  </p>
                  <pre className="mt-3 whitespace-pre-wrap break-all rounded-xl border bg-muted px-4 py-3 font-mono text-xs leading-relaxed text-foreground">
                    {command}
                  </pre>
                  <Button
                    className="mt-4 shadow-dashboard"
                    onClick={copyCommand}
                  >
                    <ClipboardCopy className="h-4 w-4" />
                    Copy automation command
                  </Button>
                  <p className="mt-3 text-xs text-muted-foreground">
                    Focus corridor passed to tooling:{" "}
                    <span className="font-mono text-[11px]">
                      {effectiveTradeArea}
                    </span>
                  </p>
                </div>

                <div>
                  <p className="text-sm font-semibold text-foreground">
                    Deliverables the team expects back
                  </p>
                  <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                    <li>Structured anchor recap plus narrative rationale.</li>
                    <li>
                      At least one decision-ready playbook with ranked targets,
                      exclusions, and source notes.
                    </li>
                    <li>
                      Marketed listings captured at the depth you selected{" "}
                      {depth === "deep"
                        ? "(including richer property worksheets when portals cooperate)."
                        : "(lighter pass until you select Full property pull in Step 3)."}{" "}
                    </li>
                    <li>
                      Optional shortlist powering the investor table after QA on
                      addresses and benchmarks.
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
                    Copy full briefing (handoff-ready)
                  </Button>
                </div>

                <div className="rounded-xl border border-dashed bg-muted/30 p-4 text-sm leading-relaxed text-muted-foreground">
                  <Building2 className="mb-2 inline h-5 w-5 align-text-bottom text-muted-foreground" />
                  <p className="font-semibold text-foreground">
                    Coordination stance
                  </p>
                  <p className="mt-2">
                    Intakes should mint a tracked request with stakeholder copy,
                    then point automation at the synced workspace the same way
                    Austin and Fort Lauderdale iterations already do.
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
