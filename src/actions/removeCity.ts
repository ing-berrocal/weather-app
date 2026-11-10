import { pickCity } from "../presentation/input.ts";
import { printSuccess } from "../presentation/output.ts";
import type { AppData } from "../types/AppData.ts";
import { placeLabel } from "../utils/format.ts";

// Lets the user pick a city and removes it from the list
export async function removeCity(data: AppData): Promise<void> {
  const city = await pickCity(data.cities);
  if (city) {
    data.cities = data.cities.filter((c) => c !== city);
    printSuccess(`  Ciudad eliminada: ${placeLabel(city)}`);
  }
}
