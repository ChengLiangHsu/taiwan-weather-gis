import { CWALocation } from "./types";

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
