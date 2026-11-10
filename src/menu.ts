import { createInterface } from "node:readline/promises";
import type { Weather } from "./forecast.ts";
import type { City, TempUnit } from "./storage.ts";

const rl = createInterface({ input: process.stdin, output: process.stdout });

// Asks a question and returns the trimmed answer
export async function ask(question: string): Promise<string> {
  return (await rl.question(question)).trim();
}

export function closeMenu(): void {
  rl.close();
}

export function unitSymbol(unit: TempUnit): string {
  return unit === "celsius" ? "°C" : "°F";
}

// Builds a label like "Ottawa, Ontario, Canadá"
export function placeLabel(place: { name: string; admin1?: string; country?: string }): string {
  return [place.name, place.admin1, place.country].filter(Boolean).join(", ");
}

export function printMenu(unit: TempUnit): void {
  console.log(`════════════════════════════════════════
         WEATHER CLI
════════════════════════════════════════
  1. Clima de ciudad default
  2. Clima de todas las ciudades (1)
  3. Buscar y agregar ciudad
  4. Eliminar ciudad
  5. Establecer ciudad default
  8. Ajustes (${unitSymbol(unit)})
  9. Salir
════════════════════════════════════════`);
}

export function printCities(cities: City[]): void {
  cities.forEach((city, i) => {
    const mark = city.isDefault ? " (default)" : "";
    console.log(`  ${i + 1}. ${placeLabel(city)}${mark}`);
  });
}

export function printWeather(city: City, weather: Weather, unit: TempUnit): void {
  const symbol = unitSymbol(unit);
  console.log(`
  Clima en ${placeLabel(city)}
  Temperatura: ${weather.temperature} ${symbol}
  Sensación térmica: ${weather.feelsLike} ${symbol}
  Humedad: ${weather.humidity} %
  Viento: ${weather.windSpeed} km/h
  Descripción: ${weather.description}
`);
}
