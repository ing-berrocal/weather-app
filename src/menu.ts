import { createInterface } from "node:readline/promises";
import type { Weather } from "./forecast.ts";
import type { City, TempUnit } from "./storage.ts";

const rl = createInterface({ input: process.stdin, output: process.stdout });

// Colors are off when NO_COLOR is set or when output is not a terminal
const useColor = !process.env.NO_COLOR && process.stdout.isTTY;

// Wraps text in an ANSI color code, or returns it unchanged when colors are off
function paint(code: number, text: string): string {
  return useColor ? `\x1b[${code}m${text}\x1b[0m` : text;
}

export const cyan = (text: string): string => paint(36, text);
export const yellow = (text: string): string => paint(33, text);
export const green = (text: string): string => paint(32, text);
export const red = (text: string): string => paint(31, text);

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
  console.log(cyan(`════════════════════════════════════════
         WEATHER CLI
════════════════════════════════════════
  1. Clima de ciudad default
  2. Clima de todas las ciudades (1)
  3. Buscar y agregar ciudad
  4. Eliminar ciudad
  5. Establecer ciudad default
  8. Ajustes (${unitSymbol(unit)})
  9. Salir
════════════════════════════════════════`));
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
  ${yellow(`Temperatura: ${weather.temperature} ${symbol}`)}
  Sensación térmica: ${weather.feelsLike} ${symbol}
  Humedad: ${weather.humidity} %
  Viento: ${weather.windSpeed} km/h
  Descripción: ${weather.description}
`);
}
