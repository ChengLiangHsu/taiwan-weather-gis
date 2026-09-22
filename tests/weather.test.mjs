import test from "node:test";
import assert from "node:assert/strict";
import { DatabaseSync } from "node:sqlite";

// 1. CWA API 真實連線與 F-D0047-091 一週預報資料抓取驗證
test("CWA API - F-D0047-091 真實一週預報連線與欄位驗證", async (t) => {
  const apiKey = process.env.CWAKey || process.env.CWA_API_KEY;
  assert.ok(apiKey, "環境變數中缺少 CWAKey，請確認 .env 設定");

  const url = `https://opendata.cwa.gov.tw/api/v1/rest/datastore/F-D0047-091?Authorization=${encodeURIComponent(
    apiKey
  )}`;

  const res = await fetch(url);
  assert.equal(res.status, 200, `CWA 一週預報連線失敗，HTTP 狀態碼：${res.status}`);

  const json = await res.json();
  const locations = json?.records?.Locations?.[0]?.Location;
  assert.ok(Array.isArray(locations), "CWA 回傳資料中未包含 Location 陣列");
  assert.equal(locations.length, 22, `預期應有 22 個縣市資料，實際取得：${locations.length}`);

  // 驗證臺中市是否存在且具有關鍵要素
  const taichung = locations.find((l) => l.LocationName === "臺中市");
  assert.ok(taichung, "缺少臺中市氣象資料");

  const elemNames = taichung.WeatherElement.map((e) => e.ElementName);
  const required = ["最高溫度", "最低溫度", "天氣現象", "12小時降雨機率", "平均溫度"];
  for (const req of required) {
    assert.ok(elemNames.includes(req), `臺中市缺少必要氣象要素：${req}`);
  }
});

// 2. 臺中市官方一週高低溫數值精確比對（佐證與中央氣象署官網 100% 一致）
test("官網數值對齊 - 臺中市未來一週高低溫比對", async (t) => {
  const apiKey = process.env.CWAKey || process.env.CWA_API_KEY;
  const url = `https://opendata.cwa.gov.tw/api/v1/rest/datastore/F-D0047-091?Authorization=${encodeURIComponent(
    apiKey
  )}`;

  const res = await fetch(url);
  const json = await res.json();
  const taichung = json.records.Locations[0].Location.find((l) => l.LocationName === "臺中市");

  const maxTElem = taichung.WeatherElement.find((e) => e.ElementName === "最高溫度").Time;
  const minTElem = taichung.WeatherElement.find((e) => e.ElementName === "最低溫度").Time;

  const toDateKey = (isoStr) => {
    const d = new Date(isoStr);
    return d.toLocaleDateString("en-CA", { timeZone: "Asia/Taipei" });
  };

  const days = new Map();
  for (const t of maxTElem) {
    const key = toDateKey(t.StartTime);
    if (!days.has(key)) days.set(key, {});
    const val = parseInt(t.ElementValue[0]?.MaxTemperature, 10);
    if (!t.StartTime.includes("T18:")) {
      days.get(key).dayHigh = val;
    } else if (days.get(key).dayHigh === undefined) {
      days.get(key).dayHigh = val;
    }
  }

  for (const t of minTElem) {
    const key = toDateKey(t.StartTime);
    if (!days.has(key)) days.set(key, {});
    const val = parseInt(t.ElementValue[0]?.MinTemperature, 10);
    if (t.StartTime.includes("T18:")) {
      days.get(key).nightLow = val;
    } else if (days.get(key).nightLow === undefined) {
      days.get(key).nightLow = val;
    }
  }

  const highTemps = [];
  const lowTemps = [];
  for (const [key, b] of days.entries()) {
    if (highTemps.length >= 7) break;
    highTemps.push(b.dayHigh);
    lowTemps.push(b.nightLow);
  }

  const expectedHigh = [30, 33, 33, 33, 33, 34, 34];
  const expectedLow = [26, 26, 26, 25, 25, 26, 26];

  assert.deepEqual(highTemps, expectedHigh, `白天高溫與氣象署官網不符！實際：${JSON.stringify(highTemps)}，預期：${JSON.stringify(expectedHigh)}`);
  assert.deepEqual(lowTemps, expectedLow, `夜間低溫與氣象署官網不符！實際：${JSON.stringify(lowTemps)}，預期：${JSON.stringify(expectedLow)}`);
});

// 3. CWA API - A-B0062-001 日出日沒時刻真實資料驗證
test("CWA API - A-B0062-001 官方日出日落時間驗證", async (t) => {
  const apiKey = process.env.CWAKey || process.env.CWA_API_KEY;
  const today = new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Taipei" });
  const nextDate = new Date(Date.now() + 86400000).toLocaleDateString("en-CA", { timeZone: "Asia/Taipei" });

  const url = `https://opendata.cwa.gov.tw/api/v1/rest/datastore/A-B0062-001?Authorization=${encodeURIComponent(
    apiKey
  )}&timeFrom=${today}&timeTo=${nextDate}`;

  const res = await fetch(url);
  assert.equal(res.status, 200, `日出日沒 API 連線失敗，HTTP 狀態碼：${res.status}`);

  const json = await res.json();
  const locs = json?.records?.locations?.location || [];
  assert.ok(locs.length >= 22, "日出日沒應涵蓋 22 個縣市");

  const taichung = locs.find((l) => (l.CountyName || l.locationName) === "臺中市");
  assert.ok(taichung, "缺少臺中市日出日落資料");

  const tcToday = taichung.time?.find((item) => item.Date === today) || taichung.time?.[0];
  assert.ok(tcToday, "缺少今日時間資訊");

  // 驗證格式與實測時間 (臺中市今日應為 05:46 / 17:54)
  assert.match(tcToday.SunRiseTime, /^\d{2}:\d{2}$/, "日出時間格式不符 HH:mm");
  assert.match(tcToday.SunSetTime, /^\d{2}:\d{2}$/, "日沒時間格式不符 HH:mm");
  assert.equal(tcToday.SunRiseTime, "05:46", "臺中市官方日出時間不符");
  assert.equal(tcToday.SunSetTime, "17:54", "臺中市官方日沒時間不符");
});

// 4. SQLite 快取讀寫機制驗證
test("SQLite 快取 - 寫入與讀取持久化驗證", (t) => {
  const db = new DatabaseSync(":memory:");
  db.exec(`
    CREATE TABLE weather_cache (
      county TEXT PRIMARY KEY,
      data_json TEXT NOT NULL,
      updated_at INTEGER NOT NULL
    );
  `);

  const mockCounty = "臺中市";
  const mockPayload = {
    county: "臺中市",
    current: { temp: 30, weather: "晴時多雲", sunrise: "05:46", sunset: "17:54" },
    weekly: [
      { date: "9/22", maxTemp: 33, minTemp: 26 },
      { date: "9/23", maxTemp: 33, minTemp: 26 }
    ]
  };
  const now = Date.now();

  const insertStmt = db.prepare(`
    INSERT INTO weather_cache (county, data_json, updated_at)
    VALUES (?, ?, ?)
  `);
  insertStmt.run(mockCounty, JSON.stringify(mockPayload), now);

  const selectStmt = db.prepare("SELECT data_json, updated_at FROM weather_cache WHERE county = ?");
  const row = selectStmt.get(mockCounty);

  assert.ok(row, "快取資料庫查無寫入之資料");
  const parsed = JSON.parse(row.data_json);
  assert.equal(parsed.county, "臺中市");
  assert.equal(parsed.current.sunrise, "05:46");
  assert.equal(parsed.current.sunset, "17:54");
  assert.equal(parsed.weekly[0].maxTemp, 33);
  assert.equal(parsed.weekly[0].minTemp, 26);
});
