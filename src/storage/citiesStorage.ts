import type { City } from "../types/City.ts";
import { DATA_FILE, readDataFile, writeDataFile } from "./dataFile.ts";

// Reads saved cities, or returns an empty list on first run
export async function loadCities(path: string = DATA_FILE): Promise<City[]> {
  const raw = await readDataFile(path);
  return (raw.cities as City[] | undefined) ?? [];
}

// Saves cities and keeps the other settings in the same file
export async function saveCities(cities: City[], path: string = DATA_FILE): Promise<void> {
  const raw = await readDataFile(path);
  await writeDataFile({ ...raw, cities }, path);
}
