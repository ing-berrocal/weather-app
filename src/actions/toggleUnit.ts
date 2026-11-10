import { printSuccess } from "../presentation/output.ts";
import type { AppData } from "../types/AppData.ts";
import { unitSymbol } from "../utils/format.ts";

// Switches between Celsius and Fahrenheit
export function toggleUnit(data: AppData): void {
  data.unit = data.unit === "celsius" ? "fahrenheit" : "celsius";
  printSuccess(`  Unidad cambiada a ${unitSymbol(data.unit)}`);
}
