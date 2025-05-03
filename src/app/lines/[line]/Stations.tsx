"use client";

import { useState, useEffect } from "react";
import { Station } from "../../../data/station";
import stationsData from "../../../data/stations.json";
import Link from "next/link";

type Position = { lat: number; lng: number };

// Haversine公式で距離計算
function haversine(p1: Position, p2: Position): number {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(p2.lat - p1.lat);
  const dLon = toRad(p2.lng - p1.lng);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(p1.lat)) * Math.cos(toRad(p2.lat)) * Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export default function Stations({ line }: { line: string }) {
  const stations = (stationsData as Station[]).filter((s) => s.line === line);
  const [position, setPosition] = useState<Position | null>(null);
  const [nearest, setNearest] = useState<Station | null>(null);
  const [geoError, setGeoError] = useState<string | null>(null);

  // 位置情報取得
  useEffect(() => {
    if (!navigator.geolocation) {
      setGeoError("このブラウザは位置情報に対応していません");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) =>
        setPosition({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        }),
      (err) => setGeoError(err.message)
    );
  }, []);

  // 最寄り駅を判定
  useEffect(() => {
    if (!position) return;
    let best: Station | null = null;
    let minDist = Infinity;
    for (const s of stations) {
      const d = haversine(position, { lat: s.lat, lng: s.lng });
      if (d < minDist) {
        minDist = d;
        best = s;
      }
    }
    setNearest(best);
  }, [position, stations]);

  return (
    <>
      {geoError && <p style={{ color: "red" }}>位置情報エラー: {geoError}</p>}

      {nearest && position && (
        <div
          style={{
            background: "#ffeb3b",
            padding: 12,
            borderRadius: 4,
            marginBottom: 16,
          }}
        >
          📍 現在地 ({position.lat.toFixed(4)}, {position.lng.toFixed(4)}) から
          <strong>「{nearest.name}」</strong> が最寄り駅です（
          {haversine(position, nearest).toFixed(2)} km）
        </div>
      )}

      <ul style={{ listStyle: "none", padding: 0 }}>
        {stations.map((s) => (
          <li key={s.name} style={{ margin: "4px 0" }}>
            {s.name} — ({s.lat.toFixed(4)}, {s.lng.toFixed(4)})
          </li>
        ))}
      </ul>

      <p style={{ marginTop: 24 }}>
        <Link href="/">← 路線選択へ戻る</Link>
      </p>
    </>
  );
}
