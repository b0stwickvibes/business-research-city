/**
 * Supported `--trade-area` values aligned with playbook keys in-repo.
 * Used by the research wizard; keep in sync with new city playbooks.
 */
export type TradePreset = {
  value: string;
  label: string;
  description: string;
};

export function tradeAreaChoicesForSlug(slug: string): TradePreset[] {
  if (slug === "austin") {
    return [
      {
        value: "ut-moody-core",
        label: "UT · Moody corridor",
        description:
          "University / downtown music district gravity (Moody Center, Sixth, Red River). Use when scouting around campus-adjacent night-life and game-day halo.",
      },
      {
        value: "q2-north",
        label: "Q2 · Domain north",
        description:
          "North Austin / Domain–Q2 corridor. Use when the thesis is suburban sports and mixed-use rather than collegiate core.",
      },
      {
        value: "both",
        label: "Both Austin corridors",
        description:
          "Runs the pipeline across Moody core and Q2-north presets in one orchestration-friendly label (see Austin playbooks for how filters combine).",
      },
    ];
  }
  if (slug === "fort-lauderdale") {
    return [
      {
        value: "hard-rock-hospitality-core",
        label: "Hard Rock Stadium · hospitality halo",
        description:
          "Broward / Las Olas–beach affluent spend anchored on mega-events at Hard Rock Stadium (Dolphins + concerts / World Cup). Matches `anchors.json` trade_area_label.",
      },
    ];
  }
  return [];
}
