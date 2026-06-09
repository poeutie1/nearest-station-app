// components/NearestStation.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Station } from "../data/station";
import haversine from "@/utils/haversine";

type Position = { lat: number; lng: number };

export default function NearestStation({ stations }: { stations: Station[] }) {
  const [position, setPosition] = useState<Position | null>(null);
  const [nearest, setNearest] = useState<Station | null>(null);
  const [geoError, setGeoError] = useState<string | null>(null);
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);
  const userMarker = useRef<L.Marker | null>(null);
  const stationMarker = useRef<L.Marker | null>(null);

  // 初期 Leaflet 地図のセットアップ
  useEffect(() => {
    if (mapContainer.current && !mapInstance.current) {
      mapInstance.current = L.map(mapContainer.current).setView(
        [35.68, 139.75],
        13
      );
      L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(mapInstance.current);
    }
  }, []);

  // 位置情報取得
  useEffect(() => {
    if (!navigator.geolocation) {
      setGeoError("このブラウザは位置情報に対応していません");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setPosition(coords);
      },
      (err) => setGeoError(err.message)
    );
  }, []);

  // ユーザーマーカー更新 & 地図をユーザー位置にセンター
  useEffect(() => {
    if (position && mapInstance.current) {
      mapInstance.current.setView([position.lat, position.lng], 14);

      // 既存のマーカーを削除
      userMarker.current?.remove();
      userMarker.current = L.marker([position.lat, position.lng])
        .addTo(mapInstance.current)
        .bindPopup("現在地");
    }
  }, [position]);

  // 最寄り駅の計算
  useEffect(() => {
    if (!position) return;
    let best: Station | null = null;
    let minDist = Infinity;
    for (const s of stations) {
      const d = haversine(position, { lat: s.lat, lng: s.lng });
      if (d < minDist) {
        best = s;
        minDist = d;
      }
    }
    setNearest(best);
  }, [position, stations]);

  // 最寄り駅マーカー更新
  useEffect(() => {
    if (nearest && mapInstance.current) {
      // 既存の駅マーカーを削除
      stationMarker.current?.remove();
      stationMarker.current = L.marker([nearest.lat, nearest.lng])
        .addTo(mapInstance.current)
        .bindPopup(
          `${nearest.name}\n距離: ${haversine(position!, nearest).toFixed(
            2
          )} km`
        )
        .openPopup();
    }
  }, [nearest]);

  if (geoError) {
    return <p style={{ color: "red" }}>位置情報エラー: {geoError}</p>;
  }

  return (
    <>
      <div
        ref={mapContainer}
        style={{ width: "100%", height: 300, marginBottom: 16 }}
      />
      {position && nearest && (
        <div
          style={{
            background: "#996633",
            color: "white",
            padding: 12,
            textAlign: "center",
          }}
        >
          📍 現在地 ({position.lat.toFixed(4)}, {position.lng.toFixed(4)}) から
          <strong>「{nearest.name}」</strong> が最寄り駅です （
          {haversine(position, nearest).toFixed(2)} km）
        </div>
      )}
    </>
  );
}
