import { NextRequest, NextResponse } from "next/server";
import { fetchCWAWeekForecast, fetchCWA36hForecast } from "@/lib/cwa/client";
import { normalizeCWAWeekLocation, normalizeCWALocation } from "@/lib/cwa/normalize";
import {
  getCountyWeatherFromCache,
  saveCountyWeatherToCache,
  getAllCachedWeather,
} from "@/lib/db";
import { CountyWeather } from "@/lib/cwa/types";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const requestedCounty = searchParams.get("county");

    // 1. 若要求特定縣市且快取有效
    if (requestedCounty) {
      const cached = getCountyWeatherFromCache(requestedCounty);
      if (cached) {
        return NextResponse.json({
          source: "sqlite-cache",
          data: cached,
        });
      }
    }

    // 2. 若快取過期或查詢全部，向 CWA 抓取真實一週資料集 (F-D0047-091)
    const weatherMap: Record<string, CountyWeather> = {};

    try {
      const weekLocations = await fetchCWAWeekForecast();
      for (const loc of weekLocations) {
        const normalized = normalizeCWAWeekLocation(loc);
        weatherMap[normalized.county] = normalized;
        saveCountyWeatherToCache(normalized.county, normalized);
      }
    } catch (weekErr) {
      console.warn("F-D0047-091 fetch failed, fallback to 36h:", weekErr);
      const raw36h = await fetchCWA36hForecast();
      for (const loc of raw36h) {
        const normalized = normalizeCWALocation(loc);
        weatherMap[normalized.county] = normalized;
        saveCountyWeatherToCache(normalized.county, normalized);
      }
    }

    if (requestedCounty) {
      // 處理臺北市 / 台北市 相容性
      const normalizedTarget = requestedCounty.replace("台", "臺");
      const matched =
        weatherMap[requestedCounty] ||
        weatherMap[normalizedTarget] ||
        Object.values(weatherMap)[0];

      return NextResponse.json({
        source: "cwa-live",
        data: matched,
      });
    }

    return NextResponse.json({
      source: "cwa-live",
      total: Object.keys(weatherMap).length,
      data: weatherMap,
    });
  } catch (err: any) {
    console.error("Weather API error:", err);

    // 發生錯誤時嘗試回傳現有快取
    const allCached = getAllCachedWeather();
    if (Object.keys(allCached).length > 0) {
      return NextResponse.json({
        source: "fallback-stale-cache",
        data: allCached,
        error: err.message,
      });
    }

    return NextResponse.json(
      {
        error: "Failed to fetch weather data",
        message: err.message,
      },
      { status: 500 }
    );
  }
}
