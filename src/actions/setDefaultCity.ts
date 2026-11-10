import { pickCity } from "../presentation/input.ts";
import { printSuccess } from "../presentation/output.ts";
import type { AppData } from "../types/AppData.ts";
import { placeLabel } from "../utils/format.ts";

// Lets the user pick a city and makes it the default
export async function setDefaultCity(data: AppData): Promise<void> {
  const city = await pickCity(data.cities);
  if (city) {
    data.cities.forEach((c) => (c.isDefault = c === city));
    printSuccess(`  Ciudad default: ${placeLabel(city)}`);
  }
}
