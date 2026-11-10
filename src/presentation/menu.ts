import type { MenuOption } from "../types/MenuOption.ts";
import type { TempUnit } from "../types/Settings.ts";
import { cyan } from "../utils/colors.ts";
import { unitSymbol } from "../utils/format.ts";
import { ask } from "./input.ts";

export function printMenu(unit: TempUnit): void {
  console.log(cyan(`════════════════════════════════════════
         WEATHER CLI
════════════════════════════════════════
  1. Clima de ciudad default
  2. Clima de todas las ciudades (1)
  3. Buscar y agregar ciudad
  4. Eliminar ciudad
  5. Establecer ciudad default
  6. Pronóstico 7 días de una ciudad
  8. Ajustes (${unitSymbol(unit)})
  9. Salir
════════════════════════════════════════`));
}

// Asks for a menu option; values outside the menu reach the default case in index.ts
export async function askMenuOption(): Promise<MenuOption> {
  return (await ask("  Selecciona una opción: ")) as MenuOption;
}
