// components/NearestStation.tsx
"use client";

import { useState, useEffect } from "react";
import { Station } from "../data/station";
import haversine from "@/utils/haversine";
// — あるいは相対パスなら—
// import haversine, { Position } from "../../utils/haversine";

type Position = { lat: number; lng: number };

export default function NearestStation({ stations }: { stations: Station[] }) {
  const [position, setPosition] = useState<Position | null>(null);
  const [nearest, setNearest] = useState<Station | null>(null);
  const [geoError, setGeoError] = useState<string | null>(null);

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

  if (geoError) {
    return <p style={{ color: "red" }}>位置情報エラー: {geoError}</p>;
  }
  if (!nearest || !position) {
    return null; // まだ位置取得中 or まだ計算前なら何も表示しない
  }

  return (
    <div
      style={{
        background: "#ffeb3b",
        padding: 12,
        borderRadius: 4,
        marginBottom: 16,
        textAlign: "center",
      }}
    >
      📍 現在地 ({position.lat.toFixed(4)}, {position.lng.toFixed(4)}) から
      <strong>「{nearest.name}」</strong> が最寄り駅です（
      {haversine(position, nearest).toFixed(2)} km）
    </div>
  );
}
