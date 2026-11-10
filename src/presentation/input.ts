import { createInterface } from "node:readline/promises";
import type { City } from "../types/City.ts";
import { printCities, printError } from "./output.ts";

const rl = createInterface({ input: process.stdin, output: process.stdout });

// Asks a question and returns the trimmed answer
export async function ask(question: string): Promise<string> {
  return (await rl.question(question)).trim();
}

export function closeMenu(): void {
  rl.close();
}

// Lists saved cities and returns the one the user picks
export async function pickCity(cities: City[]): Promise<City | undefined> {
  if (cities.length === 0) {
    printError("  No hay ciudades guardadas.");
    return undefined;
  }

  printCities(cities);
  const index = Number(await ask("  Elige un número: ")) - 1;
  const city = cities[index];
  if (!city) printError("  Opción no válida.");
  return city;
}
