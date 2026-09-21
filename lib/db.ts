import path from "path";
import fs from "fs";
import { CountyWeather } from "./cwa/types";

// 快取介面
interface CacheItem {
  county: string;
  data: CountyWeather;
  savedAt: number;
}

let sqliteDb: any = null;
const memoryCache = new Map<string, CacheItem>();

// 初始化 SQLite（使用 Node.js 22 內建 node:sqlite，免外掛 C++ 編譯）
function getDatabase() {
  if (sqliteDb) return sqliteDb;

  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { DatabaseSync } = require("node:sqlite");
    const dbPath = path.resolve(process.cwd(), "weather.db");
    const db = new DatabaseSync(dbPath);

    db.exec(`
      CREATE TABLE IF NOT EXISTS weather_cache (
        county TEXT PRIMARY KEY,
        data_json TEXT NOT NULL,
        updated_at INTEGER NOT NULL
      );
    `);

    sqliteDb = db;
    return sqliteDb;
  } catch (err) {
    console.warn("SQLite init fallback to in-memory cache:", err);
    return null;
  }
}

export function saveCountyWeatherToCache(county: string, weather: CountyWeather) {
  const now = Date.now();
  // 記憶體快取
  memoryCache.set(county, { county, data: weather, savedAt: now });

  // SQLite 快取持久化
  const db = getDatabase();
  if (db) {
    try {
      const stmt = db.prepare(`
        INSERT INTO weather_cache (county, data_json, updated_at)
        VALUES (?, ?, ?)
        ON CONFLICT(county) DO UPDATE SET
          data_json = excluded.data_json,
          updated_at = excluded.updated_at;
      `);
      stmt.run(county, JSON.stringify(weather), now);
    } catch (e) {
      console.error("Failed to write SQLite cache:", e);
    }
  }
}

export function getCountyWeatherFromCache(county: string): CountyWeather | null {
  const maxAge = 30 * 60 * 1000; // 30 分鐘快取效期
  const now = Date.now();

  // 1. 先查記憶體
  const mem = memoryCache.get(county);
  if (mem && now - mem.savedAt < maxAge) {
    return mem.data;
  }

  // 2. 次查 SQLite
  const db = getDatabase();
  if (db) {
    try {
      const stmt = db.prepare(
        "SELECT data_json, updated_at FROM weather_cache WHERE county = ?"
      );
      const row = stmt.get(county) as { data_json: string; updated_at: number } | undefined;
      if (row && now - row.updated_at < maxAge) {
        const data = JSON.parse(row.data_json);
        memoryCache.set(county, { county, data, savedAt: row.updated_at });
        return data;
      }
    } catch (e) {
      console.error("Failed to read SQLite cache:", e);
    }
  }

  return null;
}

export function getAllCachedWeather(): Record<string, CountyWeather> {
  const result: Record<string, CountyWeather> = {};
  const db = getDatabase();
  if (db) {
    try {
      const stmt = db.prepare("SELECT county, data_json FROM weather_cache");
      const rows = stmt.all() as { county: string; data_json: string }[];
      for (const row of rows) {
        result[row.county] = JSON.parse(row.data_json);
      }
      return result;
    } catch (e) {
      console.error("Failed to read all SQLite cache:", e);
    }
  }

  // Fallback to memory
  Array.from(memoryCache.entries()).forEach(([k, v]) => {
    result[k] = v.data;
  });
  return result;
}
