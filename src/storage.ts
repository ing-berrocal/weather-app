import { fileURLToPath } from "node:url";

export type TempUnit = "celsius" | "fahrenheit";

export type City = {
  name: string;
  admin1?: string;
  country?: string;
  latitude: number;
  longitude: number;
  isDefault: boolean;
};

export type Data = {
  unit: TempUnit;
  cities: City[];
};

// cities.json is saved in the project root
const FILE = fileURLToPath(new URL("../cities.json", import.meta.url));

// Reads saved cities and settings, or returns empty defaults on first run
export async function loadData(): Promise<Data> {
  const file = Bun.file(FILE);
  if (!(await file.exists())) {
    return { unit: "celsius", cities: [] };
  }
  return (await file.json()) as Data;
}

export async function saveData(data: Data): Promise<void> {
  await Bun.write(FILE, JSON.stringify(data, null, 2));
}
