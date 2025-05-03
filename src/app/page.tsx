import Link from "next/link";
import { Station } from "../data/station";
import stations from "../data/stations.json";

export default function Home() {
  // ユニークな路線名一覧を取得
  const lines = Array.from(new Set((stations as Station[]).map((s) => s.line)));

  return (
    <main style={{ padding: 20, maxWidth: 400, margin: "0 auto" }}>
      <h1>路線を選択</h1>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {lines.map((line) => (
          <li key={line} style={{ margin: "8px 0" }}>
            <Link
              href={`/lines/${encodeURIComponent(line)}`}
              style={{
                display: "inline-block",
                padding: "8px 12px",
                background: "#0070f3",
                color: "white",
                borderRadius: 4,
                textDecoration: "none",
              }}
            >
              {line}
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
