import type { Settings, TempUnit } from "../types/Settings.ts";
import { DATA_FILE, readDataFile, writeDataFile } from "./dataFile.ts";

// Reads saved settings, or returns the default unit on first run
export async function loadSettings(path: string = DATA_FILE): Promise<Settings> {
  const raw = await readDataFile(path);
  return { unit: (raw.unit as TempUnit | undefined) ?? "celsius" };
}

// Saves settings and keeps the cities in the same file
export async function saveSettings(settings: Settings, path: string = DATA_FILE): Promise<void> {
  const raw = await readDataFile(path);
  await writeDataFile({ ...raw, unit: settings.unit }, path);
}
