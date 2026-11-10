import { afterEach, describe, expect, test, mock, spyOn } from "bun:test";
import { searchCity } from "../src/api/geocoding.ts";

// Restore the real fetch after each test
afterEach(() => mock.restore());

describe("searchCity", () => {
  test("sends the city name, count, language and format as query params", async () => {
    const fetchMock = spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ results: [] }), { status: 200 }),
    );

    await searchCity("Bogotá");

    const requested = new URL(String(fetchMock.mock.calls[0]?.[0]));
    expect(requested.origin + requested.pathname).toBe(
      "https://geocoding-api.open-meteo.com/v1/search",
    );
    expect(requested.searchParams.get("name")).toBe("Bogotá");
    expect(requested.searchParams.get("count")).toBe("5");
    expect(requested.searchParams.get("language")).toBe("es");
    expect(requested.searchParams.get("format")).toBe("json");
  });

  test("returns the places from the API response", async () => {
    const results = [
      {
        name: "Bogotá",
        admin1: "Bogotá",
        country: "Colombia",
        latitude: 4.6097,
        longitude: -74.0817,
      },
      {
        name: "Bogotá",
        admin1: "Cundinamarca",
        country: "Colombia",
        latitude: 4.7,
        longitude: -74.1,
      },
    ];
    spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ results }), { status: 200 }),
    );

    const places = await searchCity("Bogotá");

    expect(places).toEqual(results);
  });

  test("returns an empty list when the API has no results", async () => {
    spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ generationtime_ms: 0.5 }), { status: 200 }),
    );

    const places = await searchCity("Zzzzzz");

    expect(places).toEqual([]);
  });
});
