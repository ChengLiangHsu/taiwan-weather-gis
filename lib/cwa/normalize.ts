import { CWALocation, CWAWeekLocation, CountyWeather, NormalizedForecastPeriod } from "./types";

export function normalizeCWALocation(loc: CWALocation): CountyWeather {
  const elements = loc.weatherElement || [];

  const getElement = (name: string) =>
    elements.find((e) => e.elementName === name)?.time || [];

  const wxList = getElement("Wx");
  const maxTList = getElement("MaxT");
  const minTList = getElement("MinT");
  const ciList = getElement("CI");
  const popList = getElement("PoP");

  const periods: NormalizedForecastPeriod[] = [];
  const maxPeriods = Math.max(
    wxList.length,
    maxTList.length,
    minTList.length,
    popList.length
  );

  for (let i = 0; i < maxPeriods; i++) {
    const wx = wxList[i]?.parameter?.parameterName || "多雲";
    const wxCode = wxList[i]?.parameter?.parameterValue || "2";
    const maxTemp = parseInt(maxTList[i]?.parameter?.parameterName || "26", 10);
    const minTemp = parseInt(minTList[i]?.parameter?.parameterName || "20", 10);
    const comfort = ciList[i]?.parameter?.parameterName || "舒適";
    const pop = parseInt(popList[i]?.parameter?.parameterName || "20", 10);

    periods.push({
      startTime: wxList[i]?.startTime || "",
      endTime: wxList[i]?.endTime || "",
      weather: wx,
      weatherCode: wxCode,
      maxTemp: isNaN(maxTemp) ? 26 : maxTemp,
      minTemp: isNaN(minTemp) ? 20 : minTemp,
      comfort,
      rainProb: isNaN(pop) ? 20 : pop,
    });
  }

  const p0 = periods[0] || {
    maxTemp: 26,
    minTemp: 21,
    weather: "多雲時晴",
    weatherCode: "2",
    comfort: "舒適",
    rainProb: 15,
  };

  const currentTemp = Math.round((p0.maxTemp + p0.minTemp) / 2);
  const apparentTemp = p0.rainProb > 40 ? currentTemp - 1 : currentTemp + 1;

  let advice = "天氣平穩舒適，適合外出散步與洗衣晾曬。";
  if (p0.rainProb >= 60) {
    advice = "降雨機率高，出門請務必攜帶雨具，通勤請注意行車安全！";
  } else if (p0.rainProb >= 30) {
    advice = "局部有短暫陣雨機率，建議隨身攜帶折疊傘，出門可加件防風薄外套。";
  } else if (p0.maxTemp >= 30) {
    advice = "陽光充沛氣溫偏高，正午紫外線較強，戶外活動請注意防曬並補水。";
  } else if (p0.minTemp <= 19) {
    advice = "早晚偏涼溫差明顯，洋蔥式穿搭最不易著涼，出門備一件薄外套。";
  }

  // 7 天走勢推估（基於 CWA 36h 延伸）
  const dayNames = ["週日", "週一", "週二", "週三", "週四", "週五", "週六"];
  const now = new Date();
  const weekly: CountyWeather["weekly"] = [];

  for (let d = 0; d < 7; d++) {
    const targetDate = new Date(now.getTime() + d * 86400000);
    const dayOfWeek = dayNames[targetDate.getDay()];
    const dateStr = `${targetDate.getMonth() + 1}/${targetDate.getDate()}`;

    // 偏移量微調模擬未來幾天
    const offset = Math.sin(d) * 2;
    const dayMax = Math.round(p0.maxTemp + offset);
    const dayMin = Math.round(p0.minTemp + offset * 0.7);
    const dayPop = Math.max(5, Math.min(85, Math.round(p0.rainProb + Math.cos(d) * 20)));

    let wText = p0.weather;
    if (dayPop > 50) wText = "短暫陣雨";
    else if (dayPop < 15) wText = "晴朗好天";

    weekly.push({
      date: dateStr,
      dayOfWeek: d === 0 ? "今天" : dayOfWeek,
      weather: wText,
      weatherCode: p0.weatherCode,
      maxTemp: dayMax,
      minTemp: dayMin,
      rainProb: dayPop,
      tag: dayOfWeek === "週六" || dayOfWeek === "週日" ? "週末推薦" : undefined,
    });
  }

  return {
    county: loc.locationName,
    updatedAt: new Date().toISOString(),
    current: {
      temp: currentTemp,
      apparentTemp,
      weather: p0.weather,
      weatherCode: p0.weatherCode,
      comfort: p0.comfort,
      rainProb: p0.rainProb,
      uvIndex: p0.rainProb > 50 ? 3.2 : 6.5,
      aqi: 35,
      advice,
    },
    periods,
    weekly,
  };
}

export function normalizeCWAWeekLocation(loc: CWAWeekLocation): CountyWeather {
  const elements = loc.WeatherElement || [];
  const getElem = (name: string) =>
    elements.find((e) => e.ElementName === name)?.Time || [];

  const maxTElem = getElem("最高溫度");
  const minTElem = getElem("最低溫度");
  const tempElem = getElem("平均溫度");
  const maxAppElem = getElem("最高體感溫度");
  const minAppElem = getElem("最低體感溫度");
  const wxElem = getElem("天氣現象");
  const popElem = getElem("12小時降雨機率");
  const uvElem = getElem("紫外線指數");
  const ciElem = getElem("最大舒適度指數");

  // 1. 36 小時預報（取前 3 個時段）
  const periods: NormalizedForecastPeriod[] = [];
  const periodCount = Math.min(3, maxTElem.length, minTElem.length, wxElem.length);

  for (let i = 0; i < periodCount; i++) {
    const maxT = parseInt(maxTElem[i]?.ElementValue[0]?.MaxTemperature || "26", 10);
    const minT = parseInt(minTElem[i]?.ElementValue[0]?.MinTemperature || "20", 10);
    const wx = wxElem[i]?.ElementValue[0]?.Weather || "晴時多雲";
    const wxCode = wxElem[i]?.ElementValue[0]?.WeatherCode || "02";
    const popRaw = popElem[i]?.ElementValue[0]?.ProbabilityOfPrecipitation;
    const pop = popRaw === "-" || !popRaw ? 0 : parseInt(popRaw, 10);
    const comfort = ciElem[i]?.ElementValue[0]?.MaxComfortIndexDescription || "舒適";

    periods.push({
      startTime: maxTElem[i]?.StartTime || "",
      endTime: maxTElem[i]?.EndTime || "",
      weather: wx,
      weatherCode: wxCode,
      maxTemp: isNaN(maxT) ? 26 : maxT,
      minTemp: isNaN(minT) ? 20 : minT,
      comfort,
      rainProb: isNaN(pop) ? 0 : pop,
    });
  }

  // 2. 當前摘要數值
  const curTemp = parseInt(tempElem[0]?.ElementValue[0]?.Temperature || "", 10);
  const currentTemp = !isNaN(curTemp)
    ? curTemp
    : periods[0]
    ? Math.round((periods[0].maxTemp + periods[0].minTemp) / 2)
    : 26;

  const maxApp = parseInt(maxAppElem[0]?.ElementValue[0]?.MaxApparentTemperature || "", 10);
  const minApp = parseInt(minAppElem[0]?.ElementValue[0]?.MinApparentTemperature || "", 10);
  const apparentTemp =
    !isNaN(maxApp) && !isNaN(minApp)
      ? Math.round((maxApp + minApp) / 2)
      : currentTemp;

  const uvRaw = uvElem[0]?.ElementValue[0]?.UVIndex;
  const uvIndex = uvRaw ? parseFloat(uvRaw) : (periods[0]?.rainProb || 0) > 50 ? 3.2 : 6.5;

  const p0 = periods[0] || {
    maxTemp: 26,
    minTemp: 21,
    weather: "晴時多雲",
    weatherCode: "02",
    comfort: "舒適",
    rainProb: 0,
  };

  let advice = "天氣平穩舒適，適合外出散步與洗衣晾曬。";
  if (p0.rainProb >= 60) {
    advice = "降雨機率高，出門請務必攜帶雨具，通勤請注意行車安全！";
  } else if (p0.rainProb >= 30) {
    advice = "局部有短暫陣雨機率，建議隨身攜帶折疊傘，出門可加件防風薄外套。";
  } else if (p0.maxTemp >= 30) {
    advice = "陽光充沛氣溫偏高，正午紫外線較強，戶外活動請注意防曬並補水。";
  } else if (p0.minTemp <= 19) {
    advice = "早晚偏涼溫差明顯，洋蔥式穿搭最不易著涼，出門備一件薄外套。";
  }

  // 3. 真實 7 天一週預報（依每日台北時區 YYYY-MM-DD 精準對齊官方發布）
  const dayNames = ["週日", "週一", "週二", "週三", "週四", "週五", "週六"];
  const toDateKey = (isoStr: string) => {
    const d = new Date(isoStr);
    return d.toLocaleDateString("en-CA", { timeZone: "Asia/Taipei" });
  };

  interface DayBucket {
    dateKey: string;
    dayHigh: number | null;
    nightLow: number | null;
    wxDay: string | null;
    wxCode: string | null;
    popDay: number;
    popNight: number;
  }

  const dayMap = new Map<string, DayBucket>();

  for (const t of maxTElem) {
    const key = toDateKey(t.StartTime);
    if (!dayMap.has(key)) {
      dayMap.set(key, {
        dateKey: key,
        dayHigh: null,
        nightLow: null,
        wxDay: null,
        wxCode: null,
        popDay: 0,
        popNight: 0,
      });
    }
    const val = parseInt(t.ElementValue[0]?.MaxTemperature, 10);
    // 白天時段（非 18:00 起）代表日間高溫
    if (!t.StartTime.includes("T18:")) {
      dayMap.get(key)!.dayHigh = val;
    } else if (dayMap.get(key)!.dayHigh === null) {
      dayMap.get(key)!.dayHigh = val;
    }
  }

  for (const t of minTElem) {
    const key = toDateKey(t.StartTime);
    if (!dayMap.has(key)) {
      dayMap.set(key, {
        dateKey: key,
        dayHigh: null,
        nightLow: null,
        wxDay: null,
        wxCode: null,
        popDay: 0,
        popNight: 0,
      });
    }
    const val = parseInt(t.ElementValue[0]?.MinTemperature, 10);
    // 夜間時段（18:00 起）代表夜間低溫
    if (t.StartTime.includes("T18:")) {
      dayMap.get(key)!.nightLow = val;
    } else if (dayMap.get(key)!.nightLow === null) {
      dayMap.get(key)!.nightLow = val;
    }
  }

  for (const t of wxElem) {
    const key = toDateKey(t.StartTime);
    if (dayMap.has(key)) {
      const b = dayMap.get(key)!;
      const wName = t.ElementValue[0]?.Weather || "晴時多雲";
      const wCode = t.ElementValue[0]?.WeatherCode || "02";
      if (!t.StartTime.includes("T18:") || !b.wxDay) {
        b.wxDay = wName;
        b.wxCode = wCode;
      }
    }
  }

  for (const t of popElem) {
    const key = toDateKey(t.StartTime);
    if (dayMap.has(key)) {
      const b = dayMap.get(key)!;
      const rawPop = t.ElementValue[0]?.ProbabilityOfPrecipitation;
      const popVal = rawPop === "-" || !rawPop ? 0 : parseInt(rawPop, 10);
      if (t.StartTime.includes("T18:")) {
        b.popNight = popVal;
      } else {
        b.popDay = popVal;
      }
    }
  }

  const weekly: CountyWeather["weekly"] = [];
  let dayIndex = 0;

  for (const [key, b] of dayMap.entries()) {
    if (weekly.length >= 7) break;
    const [year, month, day] = key.split("-").map(Number);
    const dObj = new Date(year, month - 1, day);
    const dayOfWeek = dayNames[dObj.getDay()];
    const dateStr = `${month}/${day}`;

    const maxTemp = b.dayHigh ?? 28;
    const minTemp = b.nightLow ?? Math.max(16, maxTemp - 6);

    weekly.push({
      date: dateStr,
      dayOfWeek: dayIndex === 0 ? "今天" : dayOfWeek,
      weather: b.wxDay || "晴朗好天",
      weatherCode: b.wxCode || "01",
      maxTemp,
      minTemp,
      rainProb: Math.max(b.popDay, b.popNight),
      tag: dayOfWeek === "週六" || dayOfWeek === "週日" ? "週末推薦" : undefined,
    });
    dayIndex++;
  }

  return {
    county: loc.LocationName,
    updatedAt: new Date().toISOString(),
    current: {
      temp: currentTemp,
      apparentTemp,
      weather: p0.weather,
      weatherCode: p0.weatherCode,
      comfort: p0.comfort,
      rainProb: p0.rainProb,
      uvIndex,
      aqi: 35,
      advice,
    },
    periods,
    weekly,
  };
}

