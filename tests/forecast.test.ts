import { afterEach, describe, expect, test, mock, spyOn } from "bun:test";
import { getCurrentWeather, getDailyForecast } from "../src/forecast.ts";

// Restore the real fetch after each test
afterEach(() => mock.restore());

function mockCurrent(current: Record<string, number>) {
  return spyOn(globalThis, "fetch").mockResolvedValue(
    new Response(JSON.stringify({ current }), { status: 200 }),
  );
}

const sample = {
  temperature_2m: 18.5,
  apparent_temperature: 17.2,
  relative_humidity_2m: 70,
  wind_speed_10m: 12.3,
  weather_code: 2,
};

describe("getCurrentWeather", () => {
  test("sends coordinates, current variables and units as query params", async () => {
    const fetchMock = mockCurrent(sample);

    await getCurrentWeather(4.6, -74.08, "fahrenheit");

    const requested = new URL(String(fetchMock.mock.calls[0]?.[0]));
    expect(requested.origin + requested.pathname).toBe("https://api.open-meteo.com/v1/forecast");
    expect(requested.searchParams.get("latitude")).toBe("4.6");
    expect(requested.searchParams.get("longitude")).toBe("-74.08");
    expect(requested.searchParams.get("current")).toBe(
      "temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m,weather_code",
    );
    expect(requested.searchParams.get("temperature_unit")).toBe("fahrenheit");
    expect(requested.searchParams.get("wind_speed_unit")).toBe("kmh");
  });

  test("maps the API fields to the Weather type", async () => {
    mockCurrent(sample);

    const weather = await getCurrentWeather(4.6, -74.08, "celsius");

    expect(weather).toEqual({
      temperature: 18.5,
      feelsLike: 17.2,
      humidity: 70,
      windSpeed: 12.3,
      description: "Parcialmente nublado",
    });
  });

  test("uses the Spanish description for a known weather code", async () => {
    mockCurrent({ ...sample, weather_code: 95 });

    const weather = await getCurrentWeather(4.6, -74.08, "celsius");

    expect(weather.description).toBe("Tormenta");
  });

  test("returns 'Desconocido' for an unknown weather code", async () => {
    mockCurrent({ ...sample, weather_code: 999 });

    const weather = await getCurrentWeather(4.6, -74.08, "celsius");

    expect(weather.description).toBe("Desconocido");
  });
});

describe("getDailyForecast", () => {
  const daily = {
    time: ["2026-11-10", "2026-11-11"],
    weather_code: [0, 95],
    temperature_2m_max: [24.1, 19.8],
    temperature_2m_min: [12.3, 11.0],
    precipitation_probability_max: [5, 80],
  };

  function mockDaily(value: Record<string, unknown>) {
    return spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ daily: value }), { status: 200 }),
    );
  }

  test("requests 7 days of daily variables in the local time zone", async () => {
    const fetchMock = mockDaily(daily);

    await getDailyForecast(4.6, -74.08, "fahrenheit");

    const requested = new URL(String(fetchMock.mock.calls[0]?.[0]));
    expect(requested.origin + requested.pathname).toBe("https://api.open-meteo.com/v1/forecast");
    expect(requested.searchParams.get("latitude")).toBe("4.6");
    expect(requested.searchParams.get("longitude")).toBe("-74.08");
    expect(requested.searchParams.get("daily")).toBe(
      "weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max",
    );
    expect(requested.searchParams.get("forecast_days")).toBe("7");
    expect(requested.searchParams.get("timezone")).toBe("auto");
    expect(requested.searchParams.get("temperature_unit")).toBe("fahrenheit");
  });

  test("maps each day to a DailyForecast entry", async () => {
    mockDaily(daily);

    const days = await getDailyForecast(4.6, -74.08, "celsius");

    expect(days).toEqual([
      {
        date: "2026-11-10",
        maxTemperature: 24.1,
        minTemperature: 12.3,
        rainChance: 5,
        description: "Despejado",
      },
      {
        date: "2026-11-11",
        maxTemperature: 19.8,
        minTemperature: 11,
        rainChance: 80,
        description: "Tormenta",
      },
    ]);
  });

  test("returns 'Desconocido' for an unknown weather code", async () => {
    mockDaily({ ...daily, weather_code: [999, 0] });

    const days = await getDailyForecast(4.6, -74.08, "celsius");

    expect(days[0]?.description).toBe("Desconocido");
  });
});
