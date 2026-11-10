import type { TempUnit } from "../types/Settings.ts";

// Returns the symbol for a temperature unit
export function unitSymbol(unit: TempUnit): string {
  return unit === "celsius" ? "°C" : "°F";
}

// Builds a label like "Ottawa, Ontario, Canadá"
export function placeLabel(place: { name: string; admin1?: string; country?: string }): string {
  return [place.name, place.admin1, place.country].filter(Boolean).join(", ");
}
