// 動的パラメータ line の一覧をビルド時に教える
import { Station } from "../../../data/station";
import stations from "../../../data/stations.json";
import Stations from "./Stations";

// ① ルートとして pre-render したい line の一覧を返す
export function generateStaticParams() {
  const allLines = (stations as Station[]).map((s) => s.line);
  const uniqueLines = Array.from(new Set(allLines));
  return uniqueLines.map((line) => ({ line }));
}

export default async function LinePage({
  params,
}: {
  params: Promise<{ line: string }>;
}) {
  // await the promise to get your real params
  const { line } = await params;
  const lineName = decodeURIComponent(line);

  return (
    <main style={{ padding: 20, maxWidth: 600, margin: "0 auto" }}>
      <h1>「{lineName}」の駅一覧</h1>
      <Stations line={lineName} />
    </main>
  );
}
export function generateStaticParams() {
  const allLines = stationsData.map((s) => s.line);
  return Array.from(new Set(allLines)).map((line) => ({ line }));
}
