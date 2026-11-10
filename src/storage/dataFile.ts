import { fileURLToPath } from "node:url";

// cities.json is saved in the project root
export const DATA_FILE = fileURLToPath(new URL("../../cities.json", import.meta.url));

// Reads the whole file as an object, or returns an empty object on first run
export async function readDataFile(path: string): Promise<Record<string, unknown>> {
  const file = Bun.file(path);
  if (!(await file.exists())) {
    return {};
  }
  return (await file.json()) as Record<string, unknown>;
}

// Writes the whole object as JSON with 2-space indentation
export async function writeDataFile(value: Record<string, unknown>, path: string): Promise<void> {
  await Bun.write(path, JSON.stringify(value, null, 2));
}
