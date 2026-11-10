import type { City } from "../types/City.ts";
import type { Place } from "../types/Place.ts";
import type { TempUnit } from "../types/Settings.ts";
import type { DailyForecast, Weather } from "../types/Weather.ts";
import { green, red, yellow } from "../utils/colors.ts";
import { placeLabel, unitSymbol } from "../utils/format.ts";

// Prints an error message in red
export function printError(message: string): void {
  console.log(red(message));
}

// Prints a success message in green
export function printSuccess(message: string): void {
  console.log(green(message));
}

// Prints a numbered list of cities, marking the default one
export function printCities(cities: City[]): void {
  cities.forEach((city, i) => {
    const mark = city.isDefault ? " (default)" : "";
    console.log(`  ${i + 1}. ${placeLabel(city)}${mark}`);
  });
}

// Prints a numbered list of places found by the geocoding API
export function printPlaces(places: Place[]): void {
  places.forEach((place, i) => console.log(`  ${i + 1}. ${placeLabel(place)}`));
}

export function printWeather(city: City, weather: Weather, unit: TempUnit): void {
  const symbol = unitSymbol(unit);
  console.log(`
  Clima en ${placeLabel(city)}
  ${yellow(`Temperatura: ${weather.temperature} ${symbol}`)}
  Sensación térmica: ${weather.feelsLike} ${symbol}
  Humedad: ${weather.humidity} %
  Viento: ${weather.windSpeed} km/h
  Descripción: ${weather.description}
`);
}

// Prints one line per day with max, min, rain chance and description
export function printForecast(city: City, days: DailyForecast[], unit: TempUnit): void {
  const symbol = unitSymbol(unit);
  console.log(`
  Pronóstico 7 días en ${placeLabel(city)}`);
  for (const day of days) {
    console.log(
      `  ${day.date}  ${yellow(`Máx ${day.maxTemperature} ${symbol}`)}  Mín ${day.minTemperature} ${symbol}  Lluvia ${day.rainChance} %  ${day.description}`,
    );
  }
  console.log("");
}
