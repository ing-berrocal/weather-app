import { afterEach, beforeEach, describe, expect, test } from "bun:test";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { loadData, saveData, type Data } from "../src/storage.ts";

// Each test uses its own temp folder so cities.json is never touched
let dir: string;
let file: string;

beforeEach(async () => {
  dir = await mkdtemp(join(tmpdir(), "weather-storage-"));
  file = join(dir, "cities.json");
});

afterEach(async () => {
  await rm(dir, { recursive: true, force: true });
});

describe("loadData", () => {
  test("returns empty defaults when the file does not exist", async () => {
    const data = await loadData(file);

    expect(data).toEqual({ unit: "celsius", cities: [] });
  });

  test("returns the saved data when the file exists", async () => {
    const saved: Data = {
      unit: "fahrenheit",
      cities: [
        {
          name: "Bogotá",
          admin1: "Bogotá",
          country: "Colombia",
          latitude: 4.6097,
          longitude: -74.0817,
          isDefault: true,
        },
      ],
    };
    await Bun.write(file, JSON.stringify(saved));

    const data = await loadData(file);

    expect(data).toEqual(saved);
  });
});

describe("saveData", () => {
  test("writes the data as JSON with 2-space indentation", async () => {
    const data: Data = { unit: "celsius", cities: [] };

    await saveData(data, file);

    const text = await Bun.file(file).text();
    expect(text).toBe(JSON.stringify(data, null, 2));
  });

  test("overwrites the previous content", async () => {
    await saveData({ unit: "celsius", cities: [] }, file);

    const updated: Data = {
      unit: "fahrenheit",
      cities: [
        { name: "Medellín", latitude: 6.2442, longitude: -75.5812, isDefault: false },
      ],
    };
    await saveData(updated, file);

    expect(await loadData(file)).toEqual(updated);
  });

  test("round trips data through save and load", async () => {
    const data: Data = {
      unit: "fahrenheit",
      cities: [
        { name: "Lima", country: "Perú", latitude: -12.0464, longitude: -77.0428, isDefault: true },
      ],
    };

    await saveData(data, file);

    expect(await loadData(file)).toEqual(data);
  });
});
