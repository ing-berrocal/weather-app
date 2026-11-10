import { afterEach, beforeEach, describe, expect, test } from "bun:test";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { loadCities, saveCities } from "../src/storage/citiesStorage.ts";
import type { City } from "../src/types/City.ts";

// Each test uses its own temp folder so cities.json is never touched
let dir: string;
let file: string;

beforeEach(async () => {
  dir = await mkdtemp(join(tmpdir(), "weather-cities-"));
  file = join(dir, "cities.json");
});

afterEach(async () => {
  await rm(dir, { recursive: true, force: true });
});

const bogota: City = {
  name: "Bogotá",
  admin1: "Bogotá",
  country: "Colombia",
  latitude: 4.6097,
  longitude: -74.0817,
  isDefault: true,
};

describe("loadCities", () => {
  test("returns an empty list when the file does not exist", async () => {
    expect(await loadCities(file)).toEqual([]);
  });

  test("returns the saved cities when the file exists", async () => {
    await Bun.write(file, JSON.stringify({ unit: "fahrenheit", cities: [bogota] }));

    expect(await loadCities(file)).toEqual([bogota]);
  });
});

describe("saveCities", () => {
  test("keeps the unit already saved in the file", async () => {
    await Bun.write(file, JSON.stringify({ unit: "fahrenheit", cities: [] }));

    await saveCities([bogota], file);

    const text = await Bun.file(file).json();
    expect(text).toEqual({ unit: "fahrenheit", cities: [bogota] });
  });

  test("writes the data as JSON with 2-space indentation", async () => {
    await saveCities([], file);

    const text = await Bun.file(file).text();
    expect(text).toBe(JSON.stringify({ cities: [] }, null, 2));
  });

  test("overwrites the previous cities", async () => {
    await saveCities([bogota], file);

    const medellin: City = { name: "Medellín", latitude: 6.2442, longitude: -75.5812, isDefault: false };
    await saveCities([medellin], file);

    expect(await loadCities(file)).toEqual([medellin]);
  });

  test("round trips cities through save and load", async () => {
    const lima: City = {
      name: "Lima",
      country: "Perú",
      latitude: -12.0464,
      longitude: -77.0428,
      isDefault: true,
    };

    await saveCities([lima], file);

    expect(await loadCities(file)).toEqual([lima]);
  });
});
