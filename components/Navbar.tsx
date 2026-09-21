"use client";

import React from "react";

interface NavbarProps {
  activeTab: "today" | "weekly";
  setActiveTab: (tab: "today" | "weekly") => void;
  selectedCounty: string;
  onCountySelect: (county: string) => void;
  counties: string[];
  unit: "C" | "F";
  setUnit: (u: "C" | "F") => void;
}

export default function Navbar({
  activeTab,
  setActiveTab,
  selectedCounty,
  onCountySelect,
  counties,
  unit,
  setUnit,
}: NavbarProps) {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);

  const filteredCounties = counties.filter((c) =>
    c.includes(searchQuery.trim())
  );

  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-[#f8f9ff]/90 backdrop-blur-xl shadow-[0_1px_12px_rgba(0,97,148,0.06)] border-b border-outline-variant/30">
      <div className="h-20 max-w-[1280px] mx-auto px-4 lg:px-8 flex items-center justify-between gap-4">
        {/* Brand & Location */}
        <div className="flex items-center gap-6">
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              setActiveTab("today");
            }}
            className="flex items-center gap-2.5 group"
          >
            <div className="w-10 h-10 rounded-xl bg-primary-fixed flex items-center justify-center text-primary transition-transform group-hover:scale-105 shadow-sm">
              <span className="material-symbols-outlined text-[24px]">
                partly_cloudy_day
              </span>
            </div>
            <div className="flex flex-col">
              <span className="font-heading font-semibold text-[17px] text-[#0b1c30] tracking-tight leading-tight">
                台灣天氣通
              </span>
              <span className="text-[11px] text-[#3f4850] font-medium leading-none">
                Taiwan Weather GIS
              </span>
            </div>
          </a>

          {/* Quick County Picker Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface-low text-primary hover:bg-surface-container transition-colors shadow-sm text-sm font-medium"
              type="button"
            >
              <span className="material-symbols-outlined text-[18px]">
                location_on
              </span>
              <span>{selectedCounty}</span>
              <span className="material-symbols-outlined text-[16px] text-[#3f4850]">
                arrow_drop_down
              </span>
            </button>

            {isDropdownOpen && (
              <div className="absolute top-full left-0 mt-2 w-48 max-h-64 overflow-y-auto bg-white rounded-xl shadow-xl border border-outline-variant/40 p-2 z-50 scrollbar-none">
                <div className="text-xs text-[#707881] px-2 py-1 font-semibold">
                  選擇觀測縣市
                </div>
                {counties.map((c) => (
                  <button
                    key={c}
                    onClick={() => {
                      onCountySelect(c);
                      setIsDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 rounded-lg text-sm transition-colors ${
                      selectedCounty === c
                        ? "bg-primary-fixed text-primary font-semibold"
                        : "hover:bg-surface-low text-[#0b1c30]"
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Search input */}
        <div className="flex-1 max-w-sm hidden md:block relative">
          <div className="relative flex items-center">
            <span className="material-symbols-outlined absolute left-3 text-outline text-[18px] pointer-events-none">
              search
            </span>
            <input
              className="w-full pl-9 pr-4 py-2 bg-white rounded-lg text-sm text-[#0b1c30] placeholder:text-outline border border-outline-variant/50 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
              placeholder="搜尋縣市 (如：臺北市、高雄市、花蓮縣)..."
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          {searchQuery.trim() && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-lg border border-outline-variant/40 p-1.5 max-h-48 overflow-y-auto z-50">
              {filteredCounties.length > 0 ? (
                filteredCounties.map((c) => (
                  <button
                    key={c}
                    className="w-full text-left px-3 py-1.5 text-sm hover:bg-surface-low rounded text-[#0b1c30]"
                    onClick={() => {
                      onCountySelect(c);
                      setSearchQuery("");
                    }}
                  >
                    {c}
                  </button>
                ))
              ) : (
                <div className="p-2 text-xs text-[#707881]">查無相關縣市</div>
              )}
            </div>
          )}
        </div>

        {/* Unit switch & profile */}
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-[#e5eeff] p-0.5 rounded-full">
            <button
              className={`px-2.5 py-1 rounded-full text-xs transition-all ${
                unit === "C"
                  ? "bg-white text-primary shadow-sm font-semibold"
                  : "text-[#3f4850] hover:text-[#0b1c30]"
              }`}
              type="button"
              onClick={() => setUnit("C")}
            >
              °C
            </button>
            <button
              className={`px-2.5 py-1 rounded-full text-xs transition-all ${
                unit === "F"
                  ? "bg-white text-primary shadow-sm font-semibold"
                  : "text-[#3f4850] hover:text-[#0b1c30]"
              }`}
              type="button"
              onClick={() => setUnit("F")}
            >
              °F
            </button>
          </div>
          <div
            className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shadow-sm"
            title="中央氣象署 CWA 聯名認證"
          >
            <span className="material-symbols-outlined text-white text-[18px]">
              cloud_done
            </span>
          </div>
        </div>
      </div>

      {/* Tabs bar */}
      <div className="bg-[#eff4ff]/60 border-t border-outline-variant/20">
        <div className="max-w-[1280px] mx-auto px-4 lg:px-8">
          <nav className="flex items-center gap-6 overflow-x-auto py-2 scrollbar-none text-sm">
            <button
              onClick={() => setActiveTab("today")}
              className={`transition-colors whitespace-nowrap py-1 border-b-2 font-medium ${
                activeTab === "today"
                  ? "text-primary font-semibold border-primary"
                  : "text-[#3f4850] border-transparent hover:text-[#0b1c30]"
              }`}
            >
              今日天氣與互動地圖
            </button>
            <button
              onClick={() => setActiveTab("weekly")}
              className={`transition-colors whitespace-nowrap py-1 border-b-2 font-medium ${
                activeTab === "weekly"
                  ? "text-primary font-semibold border-primary"
                  : "text-[#3f4850] border-transparent hover:text-[#0b1c30]"
              }`}
            >
              一週生活預報與走勢圖
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
}
