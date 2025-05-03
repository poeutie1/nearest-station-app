// Stations.tsx や stationsData の import
import Stations from "./Stations";
import stationsData from "../../../types/stations.json";
import { Station } from "../../../data/station";

// ① generateStaticParams は１回だけ
export function generateStaticParams() {
  const allLines = (stationsData as Station[]).map((s) => s.line);
  return Array.from(new Set(allLines)).map((line) => ({ line }));
}

// ② 動的ページは async にして params を await
export default async function LinePage({
  params,
}: {
  params: Promise<{ line: string }>;
}) {
  const { line } = await params;
  const lineName = decodeURIComponent(line);

  return (
    <main style={{ padding: 20, maxWidth: 600, margin: "0 auto" }}>
      <h1>「{lineName}」の駅一覧</h1>
      <Stations line={lineName} />
    </main>
  );
}
