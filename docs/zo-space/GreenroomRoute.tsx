import { SpaceTopNav } from "./SpaceNav";

/**
 * Green room — staging / pre-show. Path should match `GREENROOM_HREF` in `SpaceNav.tsx`
 * (default `/greenroom`). If you still serve `greenroom.html`, set `GREENROOM_HREF` to that path.
 */
export default function GreenroomPage() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0c0e12",
        color: "#e4e4e7",
        fontFamily: "ui-sans-serif, system-ui, 'Inter', sans-serif",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <SpaceTopNav active="greenroom" />
      <main
        id="zo-main"
        style={{
          flex: 1,
          maxWidth: 720,
          margin: "0 auto",
          padding: "40px 20px",
        }}
      >
        <h1
          style={{
            fontSize: 24,
            fontWeight: 700,
            color: "#fafafa",
            margin: "0 0 12px",
          }}
        >
          Green room
        </h1>
        <p
          style={{
            fontSize: 14,
            lineHeight: 1.65,
            color: "#a1a1aa",
            margin: "0 0 20px",
          }}
        >
          Use this route for run-of-show notes, mic checks, and links you do not
          want mixed into Trading or Research. Replace this copy with your live
          checklist or embedded doc.
        </p>
        <ul
          style={{
            margin: 0,
            paddingLeft: 18,
            fontSize: 14,
            lineHeight: 1.7,
            color: "#d4d4d8",
          }}
        >
          <li>Audio / video links</li>
          <li>Guest briefing bullets</li>
          <li>Time cues and handoffs</li>
        </ul>
      </main>
    </div>
  );
}
