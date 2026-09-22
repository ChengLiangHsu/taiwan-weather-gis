"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Navbar from "@/components/Navbar";
import TodayWeather from "@/components/TodayWeather";
import WeeklyForecast from "@/components/WeeklyForecast";
import { CountyWeather } from "@/lib/cwa/types";

const TaiwanMap = dynamic(() => import("@/components/TaiwanMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full aspect-[4/5] rounded-2xl bg-[#eff4ff] flex flex-col items-center justify-center text-primary text-sm gap-2">
      <span className="material-symbols-outlined text-[32px] animate-spin">
        sync
      </span>
      <span>正在為您載入 Google 地圖圖資...</span>
    </div>
  ),
});

const ALL_COUNTIES = [
  "基隆市", "臺北市", "新北市", "桃園市", "新竹市", "新竹縣", "苗栗縣",
  "臺中市", "彰化縣", "南投縣", "雲林縣", "嘉義市", "嘉義縣", "臺南市",
  "高雄市", "屏東縣", "宜蘭縣", "花蓮縣", "臺東縣", "澎湖縣", "金門縣", "連江縣",
];

export default function Home() {
  const [activeTab, setActiveTab] = useState<"today" | "weekly">("today");
  // 預設為臺中市（方便對照中央氣象署官方預報）
  const [selectedCounty, setSelectedCounty] = useState<string>("臺中市");
  const [weatherMap, setWeatherMap] = useState<Record<string, CountyWeather>>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [unit, setUnit] = useState<"C" | "F">("C");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // 載入即時天氣預報
  useEffect(() => {
    async function loadWeather() {
      try {
        setLoading(true);
        const res = await fetch("/api/weather");
        if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
        const json = await res.json();
        if (json.data) {
          setWeatherMap(json.data);
        }
      } catch (err: any) {
        console.error("Failed to load weather data:", err);
        setErrorMessage("連線至中央氣象署 API 發生錯誤，目前使用離線預覽資料。");
      } finally {
        setLoading(false);
      }
    }
    loadWeather();
  }, []);

  // 取得當前選定縣市的氣象資料（支援台/臺相容）
  const getSelectedCountyWeather = (): CountyWeather | null => {
    const direct = weatherMap[selectedCounty];
    if (direct) return direct;
    const normalized = selectedCounty.replace("台", "臺");
    if (weatherMap[normalized]) return weatherMap[normalized];
    const reverse = selectedCounty.replace("臺", "台");
    if (weatherMap[reverse]) return weatherMap[reverse];

    // 若 API 尚未回傳，回傳預設結構
    return {
      county: selectedCounty,
      updatedAt: new Date().toISOString(),
      current: {
        temp: 26,
        apparentTemp: 27,
        weather: "多雲時晴",
        weatherCode: "2",
        comfort: "舒適",
        rainProb: 20,
        uvIndex: 5.5,
        aqi: 35,
        advice: "午後對流雲系穩定，微風吹拂，適合外出散步與晾曬衣物。",
        sunrise: "05:46",
        sunset: "17:54",
      },
      periods: [
        {
          startTime: "",
          endTime: "",
          weather: "多雲時晴",
          weatherCode: "2",
          maxTemp: 28,
          minTemp: 22,
          comfort: "舒適",
          rainProb: 20,
        },
      ],
      weekly: [
        { date: "今天", dayOfWeek: "今天", weather: "多雲時晴", weatherCode: "2", maxTemp: 28, minTemp: 22, rainProb: 20 },
        { date: "明天", dayOfWeek: "明天", weather: "晴時多雲", weatherCode: "1", maxTemp: 29, minTemp: 23, rainProb: 15 },
        { date: "後天", dayOfWeek: "後天", weather: "晴朗好天", weatherCode: "1", maxTemp: 30, minTemp: 23, rainProb: 10 },
        { date: "10/24", dayOfWeek: "週四", weather: "短暫陣雨", weatherCode: "4", maxTemp: 25, minTemp: 20, rainProb: 60 },
        { date: "10/25", dayOfWeek: "週五", weather: "多雲轉陰", weatherCode: "2", maxTemp: 26, minTemp: 21, rainProb: 30 },
        { date: "10/26", dayOfWeek: "週六", weather: "溫暖晴朗", weatherCode: "1", maxTemp: 29, minTemp: 22, rainProb: 10, tag: "週末推薦" },
        { date: "10/27", dayOfWeek: "週日", weather: "晴空萬里", weatherCode: "1", maxTemp: 30, minTemp: 23, rainProb: 5, tag: "週末推薦" },
      ],
    };
  };

  const currentWeather = getSelectedCountyWeather();

  const handleFocusMap = () => {
    const mapElem = document.getElementById("taiwanMain");
    if (mapElem) {
      mapElem.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        selectedCounty={selectedCounty}
        onCountySelect={(c) => setSelectedCounty(c)}
        counties={ALL_COUNTIES}
        unit={unit}
        setUnit={setUnit}
      />

      {/* Main Content Area */}
      <main className="w-full pt-32 flex-1 max-w-[1280px] mx-auto px-4 lg:px-8 pb-12">
        {errorMessage && (
          <div className="mb-6 p-3.5 rounded-xl bg-[#ffdad6] text-[#93000a] text-xs font-semibold flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">
              warning
            </span>
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Tab 1: 今日天氣與互動地圖 */}
        {activeTab === "today" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left 7 Columns: Hero & Weather Details */}
            <div className="lg:col-span-7">
              <TodayWeather
                weather={currentWeather}
                unit={unit}
                onFocusMap={handleFocusMap}
              />
            </div>

            {/* Right 5 Columns: Interactive SVG Map */}
            <div className="lg:col-span-5">
              <TaiwanMap
                weatherData={weatherMap}
                selectedCounty={selectedCounty}
                onCountySelect={(c) => setSelectedCounty(c)}
                unit={unit}
              />
            </div>
          </div>
        )}

        {/* Tab 2: 一週生活預報與走勢圖 */}
        {activeTab === "weekly" && (
          <WeeklyForecast weather={currentWeather} unit={unit} />
        )}
      </main>

      {/* Footer */}
      <footer className="w-full bg-[#eff4ff] mt-auto border-t border-outline-variant/30">
        <div className="max-w-[1280px] mx-auto px-4 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
            <div className="flex flex-col gap-1">
              <div className="flex items-center justify-center md:justify-start gap-1.5 text-primary">
                <span className="material-symbols-outlined text-[20px]">
                  verified
                </span>
                <span className="font-heading font-semibold text-sm text-[#0b1c30]">
                  台灣天氣通 Taiwan Weather GIS
                </span>
              </div>
              <p className="text-xs text-[#707881]">
                資料來源：交通部中央氣象署 (CWA) 開放資料平臺。以 SQLite
                快取為核心，提供即時生活氣象指引。
              </p>
            </div>
            <div className="flex items-center gap-4 text-xs text-[#3f4850]">
              <a
                href="https://opendata.cwa.gov.tw/"
                target="_blank"
                rel="noreferrer"
                className="hover:text-primary transition-colors"
              >
                中央氣象署開放平臺
              </a>
              <span>•</span>
              <button
                type="button"
                onClick={() => setActiveTab("today")}
                className="hover:text-primary transition-colors"
              >
                回到首頁預報
              </button>
            </div>
          </div>
          <div className="mt-6 pt-4 border-t border-outline-variant/20 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-[#707881]">
            <p>© 2026 台灣天氣通 Taiwan Weather. 極簡、明確、好管理。</p>
            <p>即時觀測資料自動快取運作中</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
