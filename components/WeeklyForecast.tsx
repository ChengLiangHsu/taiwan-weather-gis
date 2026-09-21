"use client";

import React from "react";
import { CountyWeather } from "@/lib/cwa/types";

interface WeeklyForecastProps {
  weather: CountyWeather | null;
  unit: "C" | "F";
}

export default function WeeklyForecast({ weather, unit }: WeeklyForecastProps) {
  if (!weather) {
    return (
      <div className="p-8 text-center text-[#707881] bg-white rounded-2xl border border-outline-variant/30">
        正在載入一週天氣預報數據...
      </div>
    );
  }

  const { weekly, county } = weather;

  const formatTemp = (tempC: number) => {
    if (unit === "F") {
      return `${Math.round((tempC * 9) / 5 + 32)}°`;
    }
    return `${tempC}°`;
  };

  const getWeatherIcon = (wName: string) => {
    if (wName.includes("雨")) return "rainy";
    if (wName.includes("晴") && wName.includes("雲")) return "partly_cloudy_day";
    if (wName.includes("晴")) return "wb_sunny";
    return "cloud";
  };

  // SVG 曲線圖坐標生成 (7 個點，寬度 700，高度 160)
  // X 坐標: 50, 150, 250, 350, 450, 550, 650
  const xCoords = [50, 150, 250, 350, 450, 550, 650];
  const maxTemps = weekly.map((d) => d.maxTemp);
  const minTemps = weekly.map((d) => d.minTemp);

  const highestOverall = Math.max(...maxTemps, 32);
  const lowestOverall = Math.min(...minTemps, 16);
  const tempRange = highestOverall - lowestOverall || 10;

  // 映射溫度到 Y 坐標 (高溫在 20~80, 低溫在 90~140)
  const getY = (t: number, minBound: number, maxBound: number) => {
    const ratio = (highestOverall - t) / tempRange;
    return minBound + ratio * (maxBound - minBound);
  };

  const highPoints = weekly.map((d, i) => ({
    x: xCoords[i],
    y: Math.round(getY(d.maxTemp, 25, 75)),
    temp: d.maxTemp,
  }));

  const lowPoints = weekly.map((d, i) => ({
    x: xCoords[i],
    y: Math.round(getY(d.minTemp, 95, 140)),
    temp: d.minTemp,
  }));

  // 生成平滑路徑
  const createSmoothPath = (pts: { x: number; y: number }[]) => {
    if (pts.length === 0) return "";
    let d = `M ${pts[0].x},${pts[0].y}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[i];
      const p1 = pts[i + 1];
      const mx = (p0.x + p1.x) / 2;
      d += ` Q ${p0.x + 20},${p0.y} ${mx},${(p0.y + p1.y) / 2} T ${p1.x},${p1.y}`;
    }
    return d;
  };

  const highPath = createSmoothPath(highPoints);
  const lowPath = createSmoothPath(lowPoints);

  return (
    <div className="flex flex-col gap-8">
      {/* Friendly Island Notification Banner */}
      <section className="bg-white rounded-2xl shadow-sm p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border border-outline-variant/30">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-tertiary-fixed flex items-center justify-center text-tertiary shrink-0">
            <span className="material-symbols-outlined text-[22px]">eco</span>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-tertiary/10 text-tertiary">
                氣象觀測
              </span>
              <span className="text-sm font-semibold text-[#0b1c30]">
                目前全島氣候穩定・無劇烈颱風警報
              </span>
            </div>
            <p className="text-xs text-[#707881] mt-0.5">
              {county} 未來一週以多雲時晴與午後短暫陣雨為主，適合洗曬衣物與戶外行程！
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 self-end sm:self-auto text-xs text-[#707881]">
          <span>CWA 官方預報同步中</span>
        </div>
      </section>

      {/* 7-Day Visual Forecast Timeline */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[22px]">
              calendar_month
            </span>
            <h3 className="font-heading font-bold text-lg text-[#0b1c30]">
              {county} 未來 7 天生活走勢
            </h3>
          </div>
          <div className="hidden sm:flex items-center gap-4 text-xs text-[#707881]">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#fea619] inline-block"></span>
              溫暖好天
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-primary inline-block"></span>
              陣雨留意
            </span>
          </div>
        </div>

        {/* 7 Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          {weekly.map((day, idx) => {
            const isWeekend = day.dayOfWeek.includes("六") || day.dayOfWeek.includes("日");
            return (
              <div
                key={idx}
                className={`bg-white rounded-2xl p-4 shadow-sm border flex flex-col justify-between hover:shadow-md transition-shadow relative overflow-hidden group ${
                  isWeekend
                    ? "border-secondary/40 ring-1 ring-secondary-fixed/50"
                    : "border-outline-variant/30"
                }`}
              >
                {day.tag && (
                  <div className="absolute top-0 right-0 px-2 py-0.5 rounded-bl-lg bg-secondary-container text-white text-[10px] font-bold">
                    {day.tag}
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <span
                      className={`text-sm font-bold ${
                        idx === 0 ? "text-primary" : isWeekend ? "text-secondary" : "text-[#0b1c30]"
                      }`}
                    >
                      {day.dayOfWeek}
                    </span>
                    <span className="text-[11px] text-[#707881]">{day.date}</span>
                  </div>
                </div>

                <div className="my-4 flex flex-col items-center">
                  <div className="w-12 h-12 rounded-xl bg-[#eff4ff] flex items-center justify-center text-primary mb-1.5 group-hover:scale-110 transition-transform">
                    <span className="material-symbols-outlined text-[28px]">
                      {getWeatherIcon(day.weather)}
                    </span>
                  </div>
                  <span className="text-sm font-semibold text-[#0b1c30]">
                    {day.weather}
                  </span>
                </div>

                <div className="flex flex-col gap-1.5 mt-auto">
                  <div className="flex items-baseline justify-between text-xs font-semibold">
                    <span className="text-secondary font-bold text-base">
                      {formatTemp(day.maxTemp)}
                    </span>
                    <span className="text-[#707881]">
                      {formatTemp(day.minTemp)}
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-[#eff4ff] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-secondary-container rounded-full"
                      style={{ width: `${Math.min(100, day.maxTemp * 3)}%` }}
                    ></div>
                  </div>
                  <div className="mt-1 flex items-center justify-center gap-1 py-1 rounded-lg bg-[#eff4ff] text-primary text-[11px] font-medium">
                    <span className="material-symbols-outlined text-[13px]">
                      water_drop
                    </span>
                    <span>{day.rainProb}%</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 7-Day SVG Temperature Waveform Chart */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-outline-variant/30">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-6">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[22px]">
              show_chart
            </span>
            <h3 className="font-heading font-bold text-lg text-[#0b1c30]">
              7 天日夜氣溫走勢圖 (°C)
            </h3>
          </div>
          <div className="flex items-center gap-4 text-xs font-semibold">
            <span className="flex items-center gap-1.5 text-secondary">
              <span className="w-3 h-1 bg-[#fea619] rounded-full"></span> 最高氣溫
            </span>
            <span className="flex items-center gap-1.5 text-primary">
              <span className="w-3 h-1 bg-primary rounded-full"></span> 最低氣溫
            </span>
          </div>
        </div>

        {/* SVG Chart */}
        <div className="w-full overflow-x-auto">
          <div className="min-w-[680px] h-48 py-2">
            <svg
              className="w-full h-full overflow-visible"
              viewBox="0 0 700 160"
            >
              {/* Grid lines */}
              <line
                stroke="#707881"
                strokeDasharray="4"
                strokeOpacity="0.15"
                x1="20"
                x2="680"
                y1="35"
                y2="35"
              />
              <line
                stroke="#707881"
                strokeDasharray="4"
                strokeOpacity="0.15"
                x1="20"
                x2="680"
                y1="75"
                y2="75"
              />
              <line
                stroke="#707881"
                strokeDasharray="4"
                strokeOpacity="0.15"
                x1="20"
                x2="680"
                y1="115"
                y2="115"
              />

              {/* High Temp Curve */}
              <path
                d={highPath}
                fill="none"
                stroke="#fea619"
                strokeWidth="3.5"
                strokeLinecap="round"
              />

              {/* Low Temp Curve */}
              <path
                d={lowPath}
                fill="none"
                stroke="#006194"
                strokeWidth="3"
                strokeDasharray="4 2"
                strokeLinecap="round"
              />

              {/* High Temp Dots and Labels */}
              {highPoints.map((pt, i) => (
                <g key={`h-${i}`}>
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r="4.5"
                    fill="#ffffff"
                    stroke="#fea619"
                    strokeWidth="3"
                  />
                  <text
                    x={pt.x}
                    y={pt.y - 10}
                    textAnchor="middle"
                    className="text-xs font-bold fill-[#855300] font-heading"
                  >
                    {formatTemp(pt.temp)}
                  </text>
                </g>
              ))}

              {/* Low Temp Dots and Labels */}
              {lowPoints.map((pt, i) => (
                <g key={`l-${i}`}>
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r="3.5"
                    fill="#ffffff"
                    stroke="#006194"
                    strokeWidth="2.5"
                  />
                  <text
                    x={pt.x}
                    y={pt.y + 16}
                    textAnchor="middle"
                    className="text-xs font-medium fill-[#006194]"
                  >
                    {formatTemp(pt.temp)}
                  </text>
                </g>
              ))}
            </svg>
          </div>
        </div>

        <div className="mt-2 flex items-center justify-between text-xs text-[#707881] px-4">
          {weekly.map((d, i) => (
            <span key={i} className={i === 0 ? "font-bold text-primary" : ""}>
              {d.dayOfWeek} ({d.date})
            </span>
          ))}
        </div>
      </section>

      {/* 2-Column Split: Clothing Advice & Living Indices */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (7 cols): Clothing Advice */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[22px]">
                apparel
              </span>
              <h3 className="font-heading font-bold text-lg text-[#0b1c30]">
                出門穿著指南
              </h3>
            </div>
            <span className="text-xs text-[#707881]">分段天候穿搭建議</span>
          </div>

          {/* Segment 1: Rain & Chill */}
          <div className="bg-[#eff4ff]/80 rounded-2xl p-5 shadow-sm border border-outline-variant/30 flex flex-col sm:flex-row items-center gap-4">
            <div className="w-20 h-20 rounded-2xl bg-white shrink-0 flex flex-col items-center justify-center text-primary shadow-sm">
              <span className="material-symbols-outlined text-[36px]">
                dry_cleaning
              </span>
              <span className="text-xs font-bold text-primary mt-1">陰雨微涼</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-md bg-[#ffdad6] text-[#93000a] text-xs font-bold">
                  防風防水 + 長袖
                </span>
                <span className="text-sm font-bold text-[#0b1c30]">
                  體感涼爽 (19°~24°)
                </span>
              </div>
              <p className="text-xs sm:text-sm text-[#3f4850] mt-1.5 leading-relaxed">
                推薦穿搭：<strong>純棉薄長袖 + 薄風衣或防潑水外套</strong>。早晚通勤機車族建議拉好拉鍊，隨身備好輕量折疊傘。
              </p>
            </div>
          </div>

          {/* Segment 2: Weekend Warm & Sunny */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-outline-variant/30 flex flex-col sm:flex-row items-center gap-4">
            <div className="w-20 h-20 rounded-2xl bg-[#ffddb8]/40 shrink-0 flex flex-col items-center justify-center text-secondary shadow-sm">
              <span className="material-symbols-outlined text-[36px]">
                styler
              </span>
              <span className="text-xs font-bold text-secondary mt-1">
                晴空暖熱
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-md bg-secondary-fixed text-[#2a1700] text-xs font-bold">
                  透氣短袖 + 防曬
                </span>
                <span className="text-sm font-bold text-[#0b1c30]">
                  陽光明媚 (22°~30°)
                </span>
              </div>
              <p className="text-xs sm:text-sm text-[#3f4850] mt-1.5 leading-relaxed">
                推薦穿搭：<strong>透氣短T恤、亞麻襯衫搭配遮陽帽</strong>。正午紫外線穿透力強，戶外踏青記得配戴太陽眼鏡並定時補水。
              </p>
            </div>
          </div>

          {/* Segment 3: Layering Daily */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-outline-variant/30 flex flex-col sm:flex-row items-center gap-4">
            <div className="w-20 h-20 rounded-2xl bg-[#eff4ff] shrink-0 flex flex-col items-center justify-center text-primary shadow-sm">
              <span className="material-symbols-outlined text-[36px]">
                checkroom
              </span>
              <span className="text-xs font-bold text-primary mt-1">平日通勤</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-md bg-primary-fixed text-[#001d31] text-xs font-bold">
                  洋蔥式穿法
                </span>
                <span className="text-sm font-bold text-[#0b1c30]">
                  溫差明顯 (21°~28°)
                </span>
              </div>
              <p className="text-xs sm:text-sm text-[#3f4850] mt-1.5 leading-relaxed">
                推薦穿搭：<strong>舒適內搭 + 開襟罩衫</strong>。早晨與夜間微涼，辦公室冷氣房備妥一件薄針織外套最合適。
              </p>
            </div>
          </div>
        </div>

        {/* Right Column (5 cols): Bento Living Indices */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[22px]">
                health_and_safety
              </span>
              <h3 className="font-heading font-bold text-lg text-[#0b1c30]">
                本週生活指數
              </h3>
            </div>
            <span className="text-xs text-primary font-medium">即時指標</span>
          </div>

          <div className="grid grid-cols-2 gap-3 h-full">
            {/* Laundry */}
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-outline-variant/30 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <div className="w-9 h-9 rounded-xl bg-tertiary/10 flex items-center justify-center text-tertiary">
                  <span className="material-symbols-outlined text-[22px]">
                    local_laundry_service
                  </span>
                </div>
                <span className="text-xs px-2 py-0.5 rounded-full bg-tertiary-fixed text-tertiary font-bold">
                  極佳
                </span>
              </div>
              <div className="mt-3">
                <span className="font-heading font-bold text-sm text-[#0b1c30] block">
                  洗曬衣物
                </span>
                <p className="text-xs text-[#707881] mt-1">
                  週一、週二日照充足，大件厚被半日即乾透！
                </p>
              </div>
              <div className="mt-3 flex items-center gap-1 text-[11px] text-tertiary font-medium">
                <span className="material-symbols-outlined text-[15px]">
                  check_circle
                </span>
                <span>日照通風佳</span>
              </div>
            </div>

            {/* AQI */}
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-outline-variant/30 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <div className="w-9 h-9 rounded-xl bg-primary-fixed flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined text-[22px]">
                    air
                  </span>
                </div>
                <span className="text-xs px-2 py-0.5 rounded-full bg-[#e5eeff] text-primary font-bold">
                  AQI 35
                </span>
              </div>
              <div className="mt-3">
                <span className="font-heading font-bold text-sm text-[#0b1c30] block">
                  運動空品
                </span>
                <p className="text-xs text-[#707881] mt-1">
                  全台微風擴散佳，晨跑與河濱騎車非常舒暢。
                </p>
              </div>
              <div className="mt-3 flex items-center gap-1 text-[11px] text-primary font-medium">
                <span className="material-symbols-outlined text-[15px]">
                  nature_people
                </span>
                <span>綠色安全等級</span>
              </div>
            </div>

            {/* UV */}
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-outline-variant/30 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <div className="w-9 h-9 rounded-xl bg-secondary-fixed flex items-center justify-center text-secondary">
                  <span className="material-symbols-outlined text-[22px]">
                    wb_sunny
                  </span>
                </div>
                <span className="text-xs px-2 py-0.5 rounded-full bg-secondary-container text-white font-bold">
                  UV 7 高量
                </span>
              </div>
              <div className="mt-3">
                <span className="font-heading font-bold text-sm text-[#0b1c30] block">
                  紫外線防曬
                </span>
                <p className="text-xs text-[#707881] mt-1">
                  正午 11:00 至 14:00 陽光穿透強，外出請備陽傘。
                </p>
              </div>
              <div className="mt-3 flex items-center gap-1 text-[11px] text-secondary font-medium">
                <span className="material-symbols-outlined text-[15px]">
                  light_mode
                </span>
                <span>備妥遮陽用品</span>
              </div>
            </div>

            {/* Car Wash */}
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-outline-variant/30 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <div className="w-9 h-9 rounded-xl bg-[#eff4ff] flex items-center justify-center text-[#707881]">
                  <span className="material-symbols-outlined text-[22px]">
                    directions_car
                  </span>
                </div>
                <span className="text-xs px-2 py-0.5 rounded-full bg-[#dce9ff] text-primary font-bold">
                  週末宜
                </span>
              </div>
              <div className="mt-3">
                <span className="font-heading font-bold text-sm text-[#0b1c30] block">
                  愛車清洗
                </span>
                <p className="text-xs text-[#707881] mt-1">
                  建議排定週末洗車，可連續保持潔淨多天！
                </p>
              </div>
              <div className="mt-3 flex items-center gap-1 text-[11px] text-primary font-medium">
                <span className="material-symbols-outlined text-[15px]">
                  schedule
                </span>
                <span>週末洗車適宜</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Weekend Destination Cards */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-outline-variant/30">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-md bg-secondary-container text-white text-xs font-bold">
                WEEKEND ESCAPE
              </span>
              <h3 className="font-heading font-bold text-lg sm:text-xl text-[#0b1c30]">
                週末出遊天氣企劃・活動指南
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-[#707881] mt-1">
              全台處於高壓迴流環境，陽光明媚！以下為推薦活動適宜度：
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Card 1: Picnic */}
          <div className="bg-[#f8f9ff] rounded-2xl overflow-hidden border border-outline-variant/30 flex flex-col group hover:shadow-md transition-shadow">
            <div className="p-5 flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-tertiary px-2 py-0.5 rounded bg-tertiary/10">
                    草地野餐 ★★★★★
                  </span>
                  <span className="text-xs text-secondary font-bold">
                    29°C 暖和
                  </span>
                </div>
                <h4 className="font-heading font-bold text-base text-[#0b1c30] mt-2">
                  都市森林公園・河濱自行車
                </h4>
                <p className="text-xs text-[#707881] mt-2 leading-relaxed">
                  草皮乾燥、微風徐徐，極度適合攜帶野餐墊與小朋友放風箏。建議午後三點前往，避開中午熾熱陽光最舒適。
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-outline-variant/20 flex items-center justify-between text-[11px] text-[#707881]">
                <span className="text-tertiary font-semibold">降雨率 &lt; 10%</span>
                <span>推薦時段: 15:00-18:00</span>
              </div>
            </div>
          </div>

          {/* Card 2: Mountain Camping */}
          <div className="bg-[#f8f9ff] rounded-2xl overflow-hidden border border-outline-variant/30 flex flex-col group hover:shadow-md transition-shadow">
            <div className="p-5 flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-primary px-2 py-0.5 rounded bg-primary-fixed">
                    高山露營 ★★★★★
                  </span>
                  <span className="text-xs text-primary font-bold">
                    16°~24°C 清爽
                  </span>
                </div>
                <h4 className="font-heading font-bold text-base text-[#0b1c30] mt-2">
                  中高海拔山區・星空露營
                </h4>
                <p className="text-xs text-[#707881] mt-2 leading-relaxed">
                  中高海拔能見度極佳，入夜星空清晰耀眼！高山夜晚體感降溫明顯，請務必準備防風外套與保暖睡袋。
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-outline-variant/20 flex items-center justify-between text-[11px] text-[#707881]">
                <span className="text-primary font-semibold">日夜溫差 8 度</span>
                <span>觀星指數 100分</span>
              </div>
            </div>
          </div>

          {/* Card 3: Beach */}
          <div className="bg-[#f8f9ff] rounded-2xl overflow-hidden border border-outline-variant/30 flex flex-col group hover:shadow-md transition-shadow">
            <div className="p-5 flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-secondary px-2 py-0.5 rounded bg-secondary-fixed">
                    海灘踏浪 ★★★★☆
                  </span>
                  <span className="text-xs text-secondary font-bold">
                    30°C 豔陽
                  </span>
                </div>
                <h4 className="font-heading font-bold text-base text-[#0b1c30] mt-2">
                  東海岸・南島海灣踏浪
                </h4>
                <p className="text-xs text-[#707881] mt-2 leading-relaxed">
                  潮汐平穩、風浪輕柔，適合SUP立槳或海邊慢跑漫步。氣溫近 30 度，請適時塗抹海洋友善防曬乳防曬傷。
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-outline-variant/20 flex items-center justify-between text-[11px] text-[#707881]">
                <span className="text-secondary font-semibold">風浪平緩</span>
                <span>水溫約 26°C</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
