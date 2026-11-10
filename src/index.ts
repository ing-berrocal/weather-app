import { addCity } from "./actions/addCity.ts";
import { showAllWeather, showDefaultWeather } from "./actions/getWeather.ts";
import { getForecast } from "./actions/getForecast.ts";
import { removeCity } from "./actions/removeCity.ts";
import { setDefaultCity } from "./actions/setDefaultCity.ts";
import { toggleUnit } from "./actions/toggleUnit.ts";
import { closeMenu } from "./presentation/input.ts";
import { askMenuOption, printMenu } from "./presentation/menu.ts";
import { printError } from "./presentation/output.ts";
import { loadCities, saveCities } from "./storage/citiesStorage.ts";
import { loadSettings, saveSettings } from "./storage/settingsStorage.ts";
import type { AppData } from "./types/AppData.ts";

async function main(): Promise<void> {
  const data: AppData = { ...(await loadSettings()), cities: await loadCities() };

  while (true) {
    printMenu(data.unit);
    const option = await askMenuOption();

    try {
      switch (option) {
        case "1":
          await showDefaultWeather(data);
          break;
        case "2":
          await showAllWeather(data);
          break;
        case "3":
          await addCity(data);
          break;
        case "4":
          await removeCity(data);
          break;
        case "5":
          await setDefaultCity(data);
          break;
        case "6":
          await getForecast(data);
          break;
        case "8":
          toggleUnit(data);
          break;
        case "9":
          closeMenu();
          return;
        default:
          printError("  Opción no válida.");
      }
    } catch (error) {
      printError(`  Error: ${error instanceof Error ? error.message : String(error)}`);
    }

    await saveCities(data.cities);
    await saveSettings({ unit: data.unit });
  }
}

main();
