import Button from "@/components/Button";
import { Station } from "../data/station";
import stations from "../types/stations.json";
import NearestStation from "@/components/NearestStation ";

export default function Home() {
  // ユニークな路線名一覧を取得
  const colors = ["f62e36", "8f76d6", "c1a470", "00bb85", "ff9500"];
  const lines = Array.from(new Set((stations as Station[]).map((s) => s.line)));

  return (
    <main
      style={{
        padding: 20,
        maxWidth: 400,
        margin: "0 auto",
        textAlign: "center",
      }}
    >
      <NearestStation stations={stations} />
      <h1>路線を選択</h1>

      <ul style={{ listStyle: "none", padding: 0, textAlign: "center" }}>
        {lines.map((line, i) => (
          <li key={line} style={{ margin: "8px 0" }}>
            <Button
              href={`/lines/${encodeURIComponent(line)}`}
              color={`#${colors[i % colors.length]}`}
            >
              {line}
            </Button>
          </li>
        ))}
      </ul>
    </main>
  );
}
