"use client";

import React, { useEffect, useRef, useState } from "react";
import { CountyWeather } from "@/lib/cwa/types";

interface TaiwanMapProps {
  weatherData: Record<string, CountyWeather>;
  selectedCounty: string;
  onCountySelect: (county: string) => void;
  unit: "C" | "F";
}

interface CountyGeo {
  name: string;
  shortName: string;
  lat: number;
  lng: number;
}

const COUNTIES_GEO: CountyGeo[] = [
  { name: "基隆市", shortName: "基隆", lat: 25.1276, lng: 121.7392 },
  { name: "臺北市", shortName: "臺北", lat: 25.0375, lng: 121.5637 },
  { name: "新北市", shortName: "新北", lat: 25.0117, lng: 121.4659 },
  { name: "桃園市", shortName: "桃園", lat: 24.9936, lng: 121.301 },
  { name: "新竹市", shortName: "新竹", lat: 24.8138, lng: 120.9675 },
  { name: "新竹縣", shortName: "竹縣", lat: 24.8383, lng: 121.0178 },
  { name: "苗栗縣", shortName: "苗栗", lat: 24.5602, lng: 120.8214 },
  { name: "臺中市", shortName: "臺中", lat: 24.1477, lng: 120.6736 },
  { name: "彰化縣", shortName: "彰化", lat: 24.0817, lng: 120.5385 },
  { name: "南投縣", shortName: "南投", lat: 23.9609, lng: 120.9719 },
  { name: "雲林縣", shortName: "雲林", lat: 23.7092, lng: 120.4313 },
  { name: "嘉義市", shortName: "嘉義", lat: 23.4801, lng: 120.4491 },
  { name: "嘉義縣", shortName: "嘉縣", lat: 23.4518, lng: 120.2555 },
  { name: "臺南市", shortName: "臺南", lat: 22.9997, lng: 120.227 },
  { name: "高雄市", shortName: "高雄", lat: 22.6273, lng: 120.3014 },
  { name: "屏東縣", shortName: "屏東", lat: 22.5519, lng: 120.5487 },
  { name: "宜蘭縣", shortName: "宜蘭", lat: 24.7021, lng: 121.7377 },
  { name: "花蓮縣", shortName: "花蓮", lat: 23.9871, lng: 121.6015 },
  { name: "臺東縣", shortName: "臺東", lat: 22.7583, lng: 121.1444 },
  { name: "澎湖縣", shortName: "澎湖", lat: 23.5712, lng: 119.5793 },
  { name: "金門縣", shortName: "金門", lat: 24.4493, lng: 118.3766 },
  { name: "連江縣", shortName: "馬祖", lat: 26.1505, lng: 119.9499 },
];

export default function TaiwanMap({
  weatherData,
  selectedCounty,
  onCountySelect,
  unit,
}: TaiwanMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const markersRef = useRef<Record<string, any>>({});
  const [mapType, setMapType] = useState<"streets" | "satellite">("streets");
  const tileLayerRef = useRef<any>(null);

  const getDisplayTemp = (cName: string) => {
    const cKey = cName.replace("台", "臺");
    const info = weatherData[cName] || weatherData[cKey];
    if (!info) return "25°";
    const tempC = info.current.temp;
    if (unit === "F") {
      return `${Math.round((tempC * 9) / 5 + 32)}°`;
    }
    return `${tempC}°`;
  };

  const getRainColor = (cName: string) => {
    const cKey = cName.replace("台", "臺");
    const info = weatherData[cName] || weatherData[cKey];
    if (!info) return "#fea619";
    const pop = info.current.rainProb;
    if (pop >= 50) return "#006194"; // 藍色雨水
    if (pop >= 25) return "#707881"; // 灰色陰天
    return "#fea619"; // 暖色晴朗
  };

  // 初始化 Leaflet 地圖 (Client-side only)
  useEffect(() => {
    let isMounted = true;

    async function initLeaflet() {
      if (typeof window === "undefined" || !mapContainerRef.current) return;
      if (mapRef.current) return; // 避免重複建立

      const L = (await import("leaflet")).default;

      if (!isMounted || !mapContainerRef.current) return;

      // 建立地圖實例：台灣中心
      const map = L.map(mapContainerRef.current, {
        center: [23.75, 120.95],
        zoom: 7.5,
        minZoom: 6,
        maxZoom: 15,
        zoomControl: false, // 自訂控制鈕
      });

      // 街道底圖（正宗 Google 地圖道路底圖）
      const streetTile = L.tileLayer(
        "https://mt{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}",
        {
          attribution: "&copy; Google Maps",
          maxZoom: 20,
          subdomains: ["0", "1", "2", "3"],
        }
      );

      streetTile.addTo(map);
      tileLayerRef.current = streetTile;
      mapRef.current = map;

      // 地圖初始化後立即繪製標記
      renderMarkers(map, L);

      // 監聽視窗縮放以確保圖資尺寸精準
      setTimeout(() => {
        map.invalidateSize();
      }, 200);
    }

    initLeaflet();

    return () => {
      isMounted = false;
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // 切換底圖（Google 街道 vs Google 衛星混合）
  const toggleMapType = async () => {
    if (!mapRef.current) return;
    const L = (await import("leaflet")).default;

    if (tileLayerRef.current) {
      mapRef.current.removeLayer(tileLayerRef.current);
    }

    if (mapType === "streets") {
      // 切換為 Google 混合衛星圖層（衛星影像 + 地名道路）
      const satTile = L.tileLayer(
        "https://mt{s}.google.com/vt/lyrs=y&x={x}&y={y}&z={z}",
        {
          attribution: "&copy; Google Maps Satellite",
          maxZoom: 20,
          subdomains: ["0", "1", "2", "3"],
        }
      );
      satTile.addTo(mapRef.current);
      tileLayerRef.current = satTile;
      setMapType("satellite");
    } else {
      // 切回 Google 街道道路底圖
      const streetTile = L.tileLayer(
        "https://mt{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}",
        {
          attribution: "&copy; Google Maps",
          maxZoom: 20,
          subdomains: ["0", "1", "2", "3"],
        }
      );
      streetTile.addTo(mapRef.current);
      tileLayerRef.current = streetTile;
      setMapType("streets");
    }
  };

  // 重設為全台中心
  const handleResetCenter = () => {
    if (mapRef.current) {
      mapRef.current.flyTo([23.75, 120.95], 7.5, { duration: 1 });
    }
  };

  // 繪製各縣市氣溫標記之輔助函式
  const renderMarkers = (map: any, L: any) => {
    if (!map) return;

    // 清除舊標記
    Object.values(markersRef.current).forEach((m) => map.removeLayer(m));
    markersRef.current = {};

    COUNTIES_GEO.forEach((county) => {
      const isSelected =
        selectedCounty === county.name ||
        selectedCounty.replace("台", "臺") ===
          county.name.replace("台", "臺");

      const temp = getDisplayTemp(county.name);
      const dotColor = getRainColor(county.name);

      // 自訂氣象標記 HTML
      const html = `
        <div style="cursor: pointer; display: flex; align-items: center; gap: 6px; padding: 4px 10px; border-radius: 9999px; box-shadow: 0 2px 8px rgba(0,0,0,0.15); transition: all 0.2s; user-select: none; ${
          isSelected
            ? "background-color: #006194; color: white; border: 2px solid white; transform: scale(1.1); font-weight: bold;"
            : "background-color: rgba(255, 255, 255, 0.95); color: #0b1c30; border: 1px solid #bfc7d2; font-weight: 600;"
        }">
          <span style="width: 8px; height: 8px; border-radius: 9999px; display: inline-block; flex-shrink: 0; background-color: ${
            isSelected ? "#ffffff" : dotColor
          };"></span>
          <span style="font-size: 12px; white-space: nowrap;">${county.shortName}</span>
          <span style="font-size: 12px; color: ${isSelected ? "#ffffff" : "#006194"}; font-weight: bold;">${temp}</span>
        </div>
      `;

      const customIcon = L.divIcon({
        className: "leaflet-div-icon",
        html,
        iconSize: [84, 30],
        iconAnchor: [42, 15],
      });

      const marker = L.marker([county.lat, county.lng], {
        icon: customIcon,
      }).addTo(map);

      marker.on("click", () => {
        onCountySelect(county.name);
        map.flyTo([county.lat, county.lng], 9, { duration: 0.8 });
      });

      markersRef.current[county.name] = marker;
    });
  };

  // 當氣象資料或選定縣市更新時重繪標記
  useEffect(() => {
    if (!mapRef.current) return;
    import("leaflet").then((mod) => {
      renderMarkers(mapRef.current, mod.default);
    });
  }, [weatherData, selectedCounty, unit]);

  return (
    <section className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-outline-variant/30 relative overflow-hidden flex flex-col">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-4">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-[22px]">
            explore
          </span>
          <h2 className="font-heading font-semibold text-lg text-[#0b1c30]">
            全台氣象 GIS 地圖
          </h2>
        </div>
        <span className="text-xs text-[#707881]">
          Google 地圖模式・可自由拖曳、縮放與點選
        </span>
      </div>

      {/* Map Action Toolbar */}
      <div className="flex items-center justify-between gap-2 mb-3 bg-[#eff4ff]/60 px-3 py-1.5 rounded-xl text-xs">
        <div className="flex items-center gap-3 text-[#3f4850]">
          <span className="font-semibold text-outline">圖例：</span>
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-[#fea619] inline-block"></span>
            <span>晴天</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-[#707881] inline-block"></span>
            <span>陰雲</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-primary inline-block"></span>
            <span>雨區</span>
          </div>
        </div>

        {/* Buttons: Switch Layer & Reset Center */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={toggleMapType}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white hover:bg-surface-high transition-colors shadow-sm font-medium text-primary text-xs border border-outline-variant/30"
            title="切換街道／衛星空照圖"
          >
            <span className="material-symbols-outlined text-[15px]">
              layers
            </span>
            <span>{mapType === "streets" ? "衛星底圖" : "街道底圖"}</span>
          </button>
          <button
            type="button"
            onClick={handleResetCenter}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white hover:bg-surface-high transition-colors shadow-sm font-medium text-[#0b1c30] text-xs border border-outline-variant/30"
            title="回全台中心"
          >
            <span className="material-symbols-outlined text-[15px]">
              my_location
            </span>
            <span>全台</span>
          </button>
        </div>
      </div>

      {/* Interactive Map Viewport */}
      <div className="relative w-full aspect-[4/5] sm:aspect-square lg:aspect-[4/5] rounded-xl overflow-hidden border border-outline-variant/30 shadow-inner">
        <div
          ref={mapContainerRef}
          className="w-full h-full z-0"
          style={{ minHeight: "440px" }}
        />
      </div>

      {/* Quick Select Buttons */}
      <div className="mt-4 pt-2 flex flex-col gap-2">
        <span className="text-xs font-medium text-[#3f4850]">
          熱門縣市一鍵聚焦：
        </span>
        <div className="flex flex-wrap gap-1.5">
          {["臺北市", "新北市", "臺中市", "臺南市", "高雄市", "宜蘭縣", "花蓮縣"].map(
            (c) => {
              const isSelected =
                selectedCounty === c ||
                selectedCounty.replace("台", "臺") === c.replace("台", "臺");
              const target = COUNTIES_GEO.find((g) => g.name === c);
              return (
                <button
                  key={c}
                  type="button"
                  onClick={() => {
                    onCountySelect(c);
                    if (target && mapRef.current) {
                      mapRef.current.flyTo([target.lat, target.lng], 9, {
                        duration: 0.8,
                      });
                    }
                  }}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                    isSelected
                      ? "bg-primary text-white shadow-sm font-semibold"
                      : "bg-[#eff4ff] hover:bg-[#e5eeff] text-[#0b1c30]"
                  }`}
                >
                  {c}
                </button>
              );
            }
          )}
        </div>
      </div>
    </section>
  );
}
