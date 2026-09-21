export interface WeatherElementTime {
  startTime: string;
  endTime: string;
  parameter: {
    parameterName: string;
    parameterValue?: string;
    parameterUnit?: string;
  };
}

export interface WeatherElement {
  elementName: "Wx" | "MaxT" | "MinT" | "CI" | "PoP" | string;
  time: WeatherElementTime[];
}

export interface CWALocation {
  locationName: string;
  weatherElement: WeatherElement[];
}

export interface NormalizedForecastPeriod {
  startTime: string;
  endTime: string;
  weather: string;
  weatherCode: string;
  maxTemp: number;
  minTemp: number;
  comfort: string;
  rainProb: number;
}

export interface CountyWeather {
  county: string;
  updatedAt: string;
  current: {
    temp: number;
    apparentTemp: number;
    weather: string;
    weatherCode: string;
    comfort: string;
    rainProb: number;
    uvIndex: number;
    aqi: number;
    advice: string;
  };
  periods: NormalizedForecastPeriod[];
  weekly: {
    date: string;
    dayOfWeek: string;
    weather: string;
    weatherCode: string;
    maxTemp: number;
    minTemp: number;
    rainProb: number;
    tag?: string;
  }[];
}
