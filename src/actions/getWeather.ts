import { getCurrentWeather } from "../api/weather.ts";
import { printError, printWeather } from "../presentation/output.ts";
import type { AppData } from "../types/AppData.ts";
import type { City } from "../types/City.ts";

// Fetches and prints the weather for one city
async function showWeather(city: City, data: AppData): Promise<void> {
  const weather = await getCurrentWeather(city.latitude, city.longitude, data.unit);
  printWeather(city, weather, data.unit);
}

// Prints the weather for the default city
export async function showDefaultWeather(data: AppData): Promise<void> {
  const city = data.cities.find((c) => c.isDefault);
  if (city) {
    await showWeather(city, data);
  } else {
    printError("  No hay ciudad default. Usa la opción 5 para elegir una.");
  }
}

// Prints the weather for every saved city
export async function showAllWeather(data: AppData): Promise<void> {
  if (data.cities.length === 0) printError("  No hay ciudades guardadas.");
  for (const city of data.cities) {
    await showWeather(city, data);
  }
}
