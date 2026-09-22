import { CWALocation, CWAWeekLocation } from "./types";

export function getCWAKey(): string {
  return (
    process.env.CWA_API_KEY ||
    process.env.CWAKey ||
    process.env.NEXT_PUBLIC_CWA_API_KEY ||
    ""
  );
}

export async function fetchCWA36hForecast(): Promise<CWALocation[]> {
  const apiKey = getCWAKey();
  if (!apiKey) {
    throw new Error("Missing CWA API Key in environment variables (.env)");
  }

  const url = `https://opendata.cwa.gov.tw/fileapi/v1/opendataapi/F-C0032-001?Authorization=${encodeURIComponent(
    apiKey
  )}&downloadType=WEB&format=JSON`;

  const res = await fetch(url, {
    next: { revalidate: 1800 }, // 快取 30 分鐘
  });

  if (!res.ok) {
    throw new Error(`CWA API request failed with status: ${res.status}`);
  }

  const data = await res.json();
  const locations: CWALocation[] =
    data?.cwaopendata?.dataset?.location || [];

  return locations;
}

export async function fetchCWAWeekForecast(): Promise<CWAWeekLocation[]> {
  const apiKey = getCWAKey();
  if (!apiKey) {
    throw new Error("Missing CWA API Key in environment variables (.env)");
  }

  const url = `https://opendata.cwa.gov.tw/api/v1/rest/datastore/F-D0047-091?Authorization=${encodeURIComponent(
    apiKey
  )}`;

  const res = await fetch(url, {
    next: { revalidate: 1800 }, // 快取 30 分鐘
  });

  if (!res.ok) {
    throw new Error(`CWA Week Forecast API request failed with status: ${res.status}`);
  }

  const data = await res.json();
  const locations: CWAWeekLocation[] =
    data?.records?.Locations?.[0]?.Location || [];

  return locations;
}

export async function fetchCWASunriseSunset(): Promise<
  Record<string, { sunrise: string; sunset: string }>
> {
  const apiKey = getCWAKey();
  if (!apiKey) return {};

  try {
    const today = new Date().toLocaleDateString("en-CA", {
      timeZone: "Asia/Taipei",
    });
    const nextDate = new Date(Date.now() + 86400000).toLocaleDateString(
      "en-CA",
      { timeZone: "Asia/Taipei" }
    );
    const url = `https://opendata.cwa.gov.tw/api/v1/rest/datastore/A-B0062-001?Authorization=${encodeURIComponent(
      apiKey
    )}&timeFrom=${today}&timeTo=${nextDate}`;

    const res = await fetch(url, { next: { revalidate: 3600 } });
    if (!res.ok) return {};

    const data = await res.json();
    const locs = data?.records?.locations?.location || [];
    const resultMap: Record<string, { sunrise: string; sunset: string }> = {};

    for (const loc of locs) {
      const county = loc.CountyName || loc.locationName;
      const todayTime =
        loc.time?.find((t: any) => t.Date === today) || loc.time?.[0];
      if (county && todayTime) {
        resultMap[county] = {
          sunrise: todayTime.SunRiseTime || "05:46",
          sunset: todayTime.SunSetTime || "17:54",
        };
      }
    }
    return resultMap;
  } catch (err) {
    console.warn("Fetch CWA sunrise sunset failed:", err);
    return {};
  }
}


