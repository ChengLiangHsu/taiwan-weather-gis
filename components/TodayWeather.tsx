"use client";

import React from "react";
import { CountyWeather } from "@/lib/cwa/types";

interface TodayWeatherProps {
  weather: CountyWeather | null;
  unit: "C" | "F";
  onFocusMap: () => void;
}

export default function TodayWeather({
  weather,
  unit,
  onFocusMap,
}: TodayWeatherProps) {
  const [commuterAlert, setCommuterAlert] = React.useState(true);

  if (!weather) {
    return (
      <div className="p-8 text-center text-[#707881] bg-white rounded-2xl border border-outline-variant/30">
        正在為您載入即時氣象資料...
      </div>
    );
  }

  const { current, periods, weekly, county } = weather;
  const todayHigh = weekly?.[0]?.maxTemp ?? periods[0]?.maxTemp ?? 33;
  const todayLow = weekly?.[0]?.minTemp ?? periods[0]?.minTemp ?? 26;

  // 轉換溫度
  const formatTemp = (tempC: number) => {
    if (unit === "F") {
      return `${Math.round((tempC * 9) / 5 + 32)}°`;
    }
    return `${tempC}°`;
  };

  // 天氣圖示對應
  const getWeatherIcon = (wName: string) => {
    if (wName.includes("雨") || wName.includes("陣雨")) return "rainy";
    if (wName.includes("晴") && wName.includes("雲")) return "partly_cloudy_day";
    if (wName.includes("晴")) return "wb_sunny";
    if (wName.includes("陰") || wName.includes("雲")) return "cloud";
    return "partly_cloudy_day";
  };



  return (
    <div className="flex flex-col gap-6">
      {/* Broadcast Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-xs">
          <span className="inline-flex items-center justify-center w-2.5 h-2.5 rounded-full bg-tertiary animate-ping"></span>
          <span className="text-tertiary font-semibold tracking-wider uppercase">
            即時氣象廣播
          </span>
          <span className="text-outline-variant">•</span>
          <span className="text-[#3f4850] font-medium">
            中央氣象署 CWA 即時觀測更新
          </span>
        </div>
        <div className="flex items-center gap-1.5 self-start sm:self-auto bg-[#eff4ff] px-3 py-1 rounded-full text-xs text-[#3f4850] shadow-sm">
          <span className="material-symbols-outlined text-[15px] text-secondary">
            wb_twilight
          </span>
          <span>日出 {current.sunrise || "05:46"} • 日落 {current.sunset || "17:54"}</span>
        </div>
      </div>

      {/* Hero Condition Card */}
      <section className="relative overflow-hidden bg-white rounded-2xl shadow-sm border border-outline-variant/30 p-6 sm:p-8">
        <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-primary-fixed/30 blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 right-1/4 w-40 h-40 rounded-full bg-secondary-fixed/20 blur-2xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col gap-4">
          <div className="flex items-start justify-between">
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[24px]">
                  location_on
                </span>
                <h1 className="font-heading font-bold text-2xl sm:text-3xl text-[#0b1c30] tracking-tight">
                  {county}
                </h1>
                <button
                  type="button"
                  onClick={onFocusMap}
                  className="ml-2 px-2.5 py-1 rounded-full bg-[#e5eeff] hover:bg-[#dce9ff] transition-colors text-xs font-semibold text-primary flex items-center gap-0.5"
                >
                  切換縣市
                  <span className="material-symbols-outlined text-[14px]">
                    unfold_more
                  </span>
                </button>
              </div>
              <p className="text-xs text-[#707881] mt-1">
                行政中心區域 • 今日氣候平穩舒適
              </p>
            </div>
            {periods[0] && (
              <div className="hidden sm:flex flex-col items-end">
                <span className="px-3 py-1 rounded-full bg-primary-fixed text-[#004b73] text-xs font-semibold">
                  今日最高 {formatTemp(todayHigh)} / 最低 {formatTemp(todayLow)}
                </span>
              </div>
            )}
          </div>

          <div className="my-2 flex items-center justify-between gap-4">
            <div className="flex items-baseline gap-4">
              <span className="font-heading font-bold text-5xl sm:text-6xl text-[#0b1c30] leading-none tracking-tight">
                {formatTemp(current.temp)}
              </span>
              <div className="flex flex-col">
                <span className="font-heading font-semibold text-lg text-[#0b1c30]">
                  {current.weather}
                </span>
                <span className="text-xs sm:text-sm text-[#3f4850] flex items-center gap-1">
                  體感溫度{" "}
                  <span className="text-primary font-bold text-sm sm:text-base">
                    {formatTemp(current.apparentTemp)}
                  </span>
                </span>
              </div>
            </div>
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-[#eff4ff] flex items-center justify-center text-primary-container shadow-inner">
              <span className="material-symbols-outlined text-[42px] sm:text-[52px]">
                {getWeatherIcon(current.weather)}
              </span>
            </div>
          </div>

          {/* Living Advice Bar */}
          <div className="p-3.5 sm:p-4 rounded-xl bg-[#eff4ff]/70 flex items-start gap-3 border border-outline-variant/20">
            <div className="w-8 h-8 rounded-lg bg-secondary-fixed flex items-center justify-center text-secondary shrink-0 mt-0.5">
              <span className="material-symbols-outlined text-[20px]">
                umbrella
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-bold text-[#0b1c30]">
                生活出門貼心叮嚀
              </span>
              <p className="text-xs sm:text-sm text-[#3f4850] leading-relaxed mt-0.5">
                {current.advice}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4 Metric Cards */}
      <section className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* Rain Prob */}
        <div className="bg-white p-4 rounded-xl border border-outline-variant/30 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-primary">
            <span className="text-xs text-[#3f4850] font-medium">降雨機率</span>
            <span className="material-symbols-outlined text-[20px]">
              water_drop
            </span>
          </div>
          <div className="my-2">
            <span className="font-heading font-bold text-2xl text-primary">
              {current.rainProb}%
            </span>
          </div>
          <span className="text-[11px] text-[#707881] flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-primary-fixed inline-block"></span>
            {current.rainProb > 40 ? "午後局部陣雨" : "天氣穩定乾燥"}
          </span>
        </div>

        {/* Comfort */}
        <div className="bg-white p-4 rounded-xl border border-outline-variant/30 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-secondary">
            <span className="text-xs text-[#3f4850] font-medium">舒適度感受</span>
            <span className="material-symbols-outlined text-[20px]">
              thermostat
            </span>
          </div>
          <div className="my-2">
            <span className="font-heading font-bold text-lg sm:text-xl text-secondary">
              {current.comfort}
            </span>
          </div>
          <span className="text-[11px] text-[#707881] truncate">
            {current.temp > 28 ? "適穿輕薄透氣排汗" : "適穿棉質薄長袖外衫"}
          </span>
        </div>

        {/* AQI */}
        <div className="bg-white p-4 rounded-xl border border-outline-variant/30 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-tertiary">
            <span className="text-xs text-[#3f4850] font-medium">空氣品質 AQI</span>
            <span className="material-symbols-outlined text-[20px]">air</span>
          </div>
          <div className="my-2 flex items-baseline gap-1.5">
            <span className="font-heading font-bold text-2xl text-tertiary">
              {current.aqi}
            </span>
            <span className="px-1.5 py-0.5 rounded-full bg-tertiary-fixed text-tertiary text-[10px] font-bold">
              良好
            </span>
          </div>
          <span className="text-[11px] text-[#707881]">空氣清新，適合開窗</span>
        </div>

        {/* UV Index */}
        <div className="bg-white p-4 rounded-xl border border-outline-variant/30 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-secondary">
            <span className="text-xs text-[#3f4850] font-medium">紫外線指數</span>
            <span className="material-symbols-outlined text-[20px]">
              wb_sunny
            </span>
          </div>
          <div className="my-2 flex items-baseline gap-1.5">
            <span className="font-heading font-bold text-2xl text-secondary">
              {current.uvIndex}
            </span>
            <span className="px-1.5 py-0.5 rounded-full bg-secondary-fixed text-secondary text-[10px] font-bold">
              {current.uvIndex > 5 ? "中高量" : "中量"}
            </span>
          </div>
          <span className="text-[11px] text-[#707881]">正午出門注意防曬</span>
        </div>
      </section>

      {/* 36-Hour Period Forecast (對齊氣象署官網三大時段卡片) */}
      <section className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-outline-variant/30">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[20px]">
              calendar_view_day
            </span>
            <h2 className="font-heading font-semibold text-base sm:text-lg text-[#0b1c30]">
              中央氣象署 今明 36 小時預報
            </h2>
          </div>
          <span className="text-xs text-[#707881]">官方分段預報</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {periods.slice(0, 3).map((p, idx) => (
            <div
              key={idx}
              className={`flex flex-col items-center justify-between p-4 rounded-xl text-center shadow-sm border transition-all ${
                idx === 0
                  ? "bg-[#eff4ff] border-primary/30"
                  : "bg-white border-outline-variant/20 hover:bg-[#eff4ff]/40"
              }`}
            >
              <div className="w-full flex items-center justify-between border-b border-outline-variant/20 pb-2 mb-2">
                <span className="font-semibold text-sm text-primary">
                  {p.periodName || (idx === 0 ? "今日白天" : idx === 1 ? "今晚明晨" : "明日白天")}
                </span>
                <span className="text-xs text-[#707881]">
                  {p.timeRangeDisplay || ""}
                </span>
              </div>

              <span className="material-symbols-outlined text-[36px] text-primary my-2">
                {getWeatherIcon(p.weather)}
              </span>

              <span className="text-sm font-medium text-[#3f4850] mb-1">
                {p.weather}
              </span>

              <span className="font-heading font-bold text-xl text-[#0b1c30]">
                {formatTemp(p.minTemp)} ~ {formatTemp(p.maxTemp)}
              </span>

              <div className="mt-3 w-full flex items-center justify-between text-xs text-[#707881] pt-2 border-t border-outline-variant/20">
                <div className="flex items-center gap-1 text-primary">
                  <span className="material-symbols-outlined text-[14px]">
                    water_drop
                  </span>
                  <span>{p.rainProb}%</span>
                </div>
                <span className="px-2 py-0.5 rounded bg-surface-container-low text-[#3f4850] font-medium">
                  {p.comfort}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Living Indices Bento */}
      <section className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-outline-variant/30">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[20px]">
              checklist
            </span>
            <h2 className="font-heading font-semibold text-base sm:text-lg text-[#0b1c30]">
              市民日常生活指南
            </h2>
          </div>
          <span className="text-xs text-tertiary font-semibold flex items-center gap-1">
            <span className="material-symbols-outlined text-[16px]">
              sentiment_satisfied
            </span>
            日常舒適度優
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Laundry */}
          <div className="p-4 rounded-xl bg-[#eff4ff]/80 flex flex-col gap-1 border border-outline-variant/20">
            <div className="flex items-center gap-2 text-primary">
              <span className="material-symbols-outlined text-[20px]">
                local_laundry_service
              </span>
              <span className="text-xs font-bold text-[#0b1c30]">晾衣指數</span>
            </div>
            <span className="font-heading font-semibold text-sm text-secondary mt-1">
              {current.rainProb > 40 ? "建議室內晾曬" : "極佳・半日即乾"}
            </span>
            <p className="text-xs text-[#707881] mt-0.5">
              {current.rainProb > 40
                ? "午後偶有短暫陣雨，建議移入陽台內側通風。"
                : "日照與微風充足，適合洗曬大件厚床單被套。"}
            </p>
          </div>

          {/* Car Wash */}
          <div className="p-4 rounded-xl bg-[#eff4ff]/80 flex flex-col gap-1 border border-outline-variant/20">
            <div className="flex items-center gap-2 text-[#ba1a1a]">
              <span className="material-symbols-outlined text-[20px]">
                directions_car
              </span>
              <span className="text-xs font-bold text-[#0b1c30]">洗車指數</span>
            </div>
            <span className="font-heading font-semibold text-sm text-[#3f4850] mt-1">
              {current.rainProb > 30 ? "暫不建議洗車" : "非常適合"}
            </span>
            <p className="text-xs text-[#707881] mt-0.5">
              {current.rainProb > 30
                ? "今日降雨機率高易泥濺，可再觀察明日放晴狀況。"
                : "未來數日天晴乾燥，洗車可維持潔淨多天！"}
            </p>
          </div>

          {/* Sports */}
          <div className="p-4 rounded-xl bg-[#eff4ff]/80 flex flex-col gap-1 border border-outline-variant/20">
            <div className="flex items-center gap-2 text-tertiary">
              <span className="material-symbols-outlined text-[20px]">
                directions_run
              </span>
              <span className="text-xs font-bold text-[#0b1c30]">運動指數</span>
            </div>
            <span className="font-heading font-semibold text-sm text-tertiary mt-1">
              傍晚戶外散步佳
            </span>
            <p className="text-xs text-[#707881] mt-0.5">
              氣溫涼爽微風吹拂，公園綠地或河濱自行車道漫遊舒適。
            </p>
          </div>
        </div>
      </section>

      {/* Commuter Alert Push Section */}
      <section className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-outline-variant/30 flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-tertiary-fixed flex items-center justify-center text-tertiary shrink-0">
          <span className="material-symbols-outlined text-[24px]">
            notifications_active
          </span>
        </div>
        <div className="flex-1 flex flex-col">
          <span className="text-sm font-bold text-[#0b1c30]">
            上班與通勤降雨推播提醒
          </span>
          <span className="text-xs text-[#707881]">
            預先掌握通勤時段雨況與是否攜帶雨具，輕鬆出門不狼狽
          </span>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={commuterAlert}
            onChange={(e) => setCommuterAlert(e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-[#dce9ff] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
        </label>
      </section>
    </div>
  );
}
