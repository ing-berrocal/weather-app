import { getCurrentWeather } from "./src/forecast.ts";
import { searchCity } from "./src/geocoding.ts";
import { loadData, saveData, type City, type Data } from "./src/storage.ts";
import {
  ask,
  closeMenu,
  green,
  placeLabel,
  printCities,
  printMenu,
  printWeather,
  red,
  unitSymbol,
} from "./src/menu.ts";

// Fetches and prints the weather for one city
async function showWeather(city: City, data: Data): Promise<void> {
  const weather = await getCurrentWeather(city.latitude, city.longitude, data.unit);
  printWeather(city, weather, data.unit);
}

// Searches a city by name, lets the user pick a match, and adds it to the list
async function addCity(data: Data): Promise<void> {
  const name = await ask("  Nombre de la ciudad: ");
  if (!name) return;

  const places = await searchCity(name);
  if (places.length === 0) {
    console.log(red("  No se encontró ninguna ciudad con ese nombre."));
    return;
  }

  places.forEach((place, i) => console.log(`  ${i + 1}. ${placeLabel(place)}`));
  const index = Number(await ask("  Elige un número (0 para cancelar): ")) - 1;
  if (index === -1) return;

  const place = places[index];
  if (!place) {
    console.log(red("  Opción no válida."));
    return;
  }

  const exists = data.cities.some(
    (city) => city.latitude === place.latitude && city.longitude === place.longitude,
  );
  if (exists) {
    console.log(red("  Esa ciudad ya está registrada."));
    return;
  }

  // The first city added becomes the default
  data.cities.push({
    name: place.name,
    admin1: place.admin1,
    country: place.country,
    latitude: place.latitude,
    longitude: place.longitude,
    isDefault: data.cities.length === 0,
  });
  console.log(green(`  Ciudad agregada: ${placeLabel(place)}`));
}

// Lists saved cities and returns the one the user picks
async function pickCity(data: Data): Promise<City | undefined> {
  if (data.cities.length === 0) {
    console.log(red("  No hay ciudades guardadas."));
    return undefined;
  }

  printCities(data.cities);
  const index = Number(await ask("  Elige un número: ")) - 1;
  const city = data.cities[index];
  if (!city) console.log(red("  Opción no válida."));
  return city;
}

async function main(): Promise<void> {
  const data = await loadData();

  while (true) {
    printMenu(data.unit);
    const option = await ask("  Selecciona una opción: ");

    try {
      switch (option) {
        case "1": {
          const city = data.cities.find((c) => c.isDefault);
          if (city) {
            await showWeather(city, data);
          } else {
            console.log(red("  No hay ciudad default. Usa la opción 5 para elegir una."));
          }
          break;
        }
        case "2": {
          if (data.cities.length === 0) console.log(red("  No hay ciudades guardadas."));
          for (const city of data.cities) {
            await showWeather(city, data);
          }
          break;
        }
        case "3":
          await addCity(data);
          break;
        case "4": {
          const city = await pickCity(data);
          if (city) {
            data.cities = data.cities.filter((c) => c !== city);
            console.log(green(`  Ciudad eliminada: ${placeLabel(city)}`));
          }
          break;
        }
        case "5": {
          const city = await pickCity(data);
          if (city) {
            data.cities.forEach((c) => (c.isDefault = c === city));
            console.log(green(`  Ciudad default: ${placeLabel(city)}`));
          }
          break;
        }
        case "8":
          data.unit = data.unit === "celsius" ? "fahrenheit" : "celsius";
          console.log(green(`  Unidad cambiada a ${unitSymbol(data.unit)}`));
          break;
        case "9":
          closeMenu();
          return;
        default:
          console.log(red("  Opción no válida."));
      }
    } catch (error) {
      console.log(red(`  Error: ${error instanceof Error ? error.message : String(error)}`));
    }

    await saveData(data);
  }
}

main();
