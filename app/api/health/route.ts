import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    status: "ok",
    service: "taiwan-weather-gis",
    timestamp: new Date().toISOString(),
  });
}
