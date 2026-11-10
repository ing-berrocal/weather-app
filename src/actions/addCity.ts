import { searchCity } from "../api/geocoding.ts";
import { ask } from "../presentation/input.ts";
import { printError, printPlaces, printSuccess } from "../presentation/output.ts";
import type { AppData } from "../types/AppData.ts";
import { placeLabel } from "../utils/format.ts";

// Searches a city by name, lets the user pick a match, and adds it to the list
export async function addCity(data: AppData): Promise<void> {
  const name = await ask("  Nombre de la ciudad: ");
  if (!name) return;

  const places = await searchCity(name);
  if (places.length === 0) {
    printError("  No se encontró ninguna ciudad con ese nombre.");
    return;
  }

  printPlaces(places);
  const index = Number(await ask("  Elige un número (0 para cancelar): ")) - 1;
  if (index === -1) return;

  const place = places[index];
  if (!place) {
    printError("  Opción no válida.");
    return;
  }

  const exists = data.cities.some(
    (city) => city.latitude === place.latitude && city.longitude === place.longitude,
  );
  if (exists) {
    printError("  Esa ciudad ya está registrada.");
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
  printSuccess(`  Ciudad agregada: ${placeLabel(place)}`);
}
