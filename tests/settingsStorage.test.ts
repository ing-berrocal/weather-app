import { afterEach, beforeEach, describe, expect, test } from "bun:test";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { loadSettings, saveSettings } from "../src/storage/settingsStorage.ts";

// Each test uses its own temp folder so cities.json is never touched
let dir: string;
let file: string;

beforeEach(async () => {
  dir = await mkdtemp(join(tmpdir(), "weather-settings-"));
  file = join(dir, "cities.json");
});

afterEach(async () => {
  await rm(dir, { recursive: true, force: true });
});

describe("loadSettings", () => {
  test("returns celsius when the file does not exist", async () => {
    expect(await loadSettings(file)).toEqual({ unit: "celsius" });
  });

  test("returns the saved unit when the file exists", async () => {
    await Bun.write(file, JSON.stringify({ unit: "fahrenheit", cities: [] }));

    expect(await loadSettings(file)).toEqual({ unit: "fahrenheit" });
  });
});

describe("saveSettings", () => {
  test("keeps the cities already saved in the file", async () => {
    const cities = [
      { name: "Lima", latitude: -12.0464, longitude: -77.0428, isDefault: true },
    ];
    await Bun.write(file, JSON.stringify({ unit: "celsius", cities }));

    await saveSettings({ unit: "fahrenheit" }, file);

    expect(await Bun.file(file).json()).toEqual({ unit: "fahrenheit", cities });
  });

  test("round trips the unit through save and load", async () => {
    await saveSettings({ unit: "fahrenheit" }, file);

    expect(await loadSettings(file)).toEqual({ unit: "fahrenheit" });
  });
});
