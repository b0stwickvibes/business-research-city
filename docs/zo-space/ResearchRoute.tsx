import { BRC_CONTROL_CENTER_ORIGIN } from "./constants";
import { SpaceTopNav } from "./SpaceNav";

/**
 * Zo Space `/research` — iframes the Vite control-center build on Zo.
 * Mirror path (repo): `docs/zo-space-research-route.tsx` re-exports this.
 */
export default function ResearchPage() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0c0e12",
        color: "#e6edf3",
        fontFamily: "ui-sans-serif, system-ui, 'Inter', sans-serif",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <SpaceTopNav active="research" />
      <iframe
        title="business-research-city — site selection control center"
        src={`${BRC_CONTROL_CENTER_ORIGIN}/`}
        style={{
          flex: 1,
          width: "100%",
          minHeight: 0,
          border: "none",
          display: "block",
        }}
      />
    </div>
  );
}
