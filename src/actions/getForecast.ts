import { getDailyForecast } from "../api/weather.ts";
import { pickCity } from "../presentation/input.ts";
import { printForecast } from "../presentation/output.ts";
import type { AppData } from "../types/AppData.ts";
import type { City } from "../types/City.ts";

// Fetches and prints the 7-day forecast for one city
async function showForecast(city: City, data: AppData): Promise<void> {
  const days = await getDailyForecast(city.latitude, city.longitude, data.unit);
  printForecast(city, days, data.unit);
}

// Lets the user pick a city and prints its 7-day forecast
export async function getForecast(data: AppData): Promise<void> {
  const city = await pickCity(data.cities);
  if (city) await showForecast(city, data);
}
