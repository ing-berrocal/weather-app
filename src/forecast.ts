import { getJson } from "./api.ts";
import type { TempUnit } from "./storage.ts";

export type Weather = {
  temperature: number;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  description: string;
};

export type DailyForecast = {
  date: string;
  maxTemperature: number;
  minTemperature: number;
  rainChance: number;
  description: string;
};

type ForecastResponse = {
  current: {
    temperature_2m: number;
    apparent_temperature: number;
    relative_humidity_2m: number;
    wind_speed_10m: number;
    weather_code: number;
  };
};

type DailyForecastResponse = {
  daily: {
    time: string[];
    weather_code: number[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    precipitation_probability_max: number[];
  };
};

// Weather codes from Open-Meteo (WMO), in Spanish
const WEATHER_CODES: Record<number, string> = {
  0: "Despejado",
  1: "Mayormente despejado",
  2: "Parcialmente nublado",
  3: "Nublado",
  45: "Niebla",
  48: "Niebla con escarcha",
  51: "Llovizna ligera",
  53: "Llovizna moderada",
  55: "Llovizna intensa",
  56: "Llovizna helada ligera",
  57: "Llovizna helada intensa",
  61: "Lluvia ligera",
  63: "Lluvia moderada",
  65: "Lluvia intensa",
  66: "Lluvia helada ligera",
  67: "Lluvia helada intensa",
  71: "Nevada ligera",
  73: "Nevada moderada",
  75: "Nevada intensa",
  77: "Granos de nieve",
  80: "Chubascos ligeros",
  81: "Chubascos moderados",
  82: "Chubascos violentos",
  85: "Chubascos de nieve ligeros",
  86: "Chubascos de nieve intensos",
  95: "Tormenta",
  96: "Tormenta con granizo ligero",
  99: "Tormenta con granizo intenso",
};

// Returns the current weather for the given coordinates
export async function getCurrentWeather(
  latitude: number,
  longitude: number,
  unit: TempUnit,
): Promise<Weather> {
  const url = new URL("https://api.open-meteo.com/v1/forecast");
  url.searchParams.set("latitude", String(latitude));
  url.searchParams.set("longitude", String(longitude));
  url.searchParams.set(
    "current",
    "temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m,weather_code",
  );
  url.searchParams.set("temperature_unit", unit);
  url.searchParams.set("wind_speed_unit", "kmh");

  const { current } = await getJson<ForecastResponse>(url);
  return {
    temperature: current.temperature_2m,
    feelsLike: current.apparent_temperature,
    humidity: current.relative_humidity_2m,
    windSpeed: current.wind_speed_10m,
    description: WEATHER_CODES[current.weather_code] ?? "Desconocido",
  };
}

// Returns the forecast for today and the next 6 days (7 days in total)
export async function getDailyForecast(
  latitude: number,
  longitude: number,
  unit: TempUnit,
): Promise<DailyForecast[]> {
  const url = new URL("https://api.open-meteo.com/v1/forecast");
  url.searchParams.set("latitude", String(latitude));
  url.searchParams.set("longitude", String(longitude));
  url.searchParams.set(
    "daily",
    "weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max",
  );
  url.searchParams.set("forecast_days", "7");
  url.searchParams.set("timezone", "auto");
  url.searchParams.set("temperature_unit", unit);

  const { daily } = await getJson<DailyForecastResponse>(url);
  return daily.time.map((date, i) => ({
    date,
    maxTemperature: daily.temperature_2m_max[i] ?? 0,
    minTemperature: daily.temperature_2m_min[i] ?? 0,
    rainChance: daily.precipitation_probability_max[i] ?? 0,
    description: WEATHER_CODES[daily.weather_code[i] ?? -1] ?? "Desconocido",
  }));
}
