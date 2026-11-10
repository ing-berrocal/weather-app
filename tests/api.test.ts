import { afterEach, describe, expect, test, mock, spyOn } from "bun:test";
import { getJson } from "../src/api.ts";

const url = new URL("https://example.com/data");

// Restore the real fetch after each test
afterEach(() => mock.restore());

describe("getJson", () => {
  test("returns the parsed JSON when the response is ok", async () => {
    spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ value: 42 }), { status: 200 }),
    );

    const data = await getJson<{ value: number }>(url);

    expect(data).toEqual({ value: 42 });
  });

  test("calls fetch with the given URL", async () => {
    const fetchMock = spyOn(globalThis, "fetch").mockResolvedValue(
      new Response("{}", { status: 200 }),
    );

    await getJson(url);

    expect(fetchMock).toHaveBeenCalledWith(url);
  });

  test("throws a Spanish connection error when fetch fails", async () => {
    spyOn(globalThis, "fetch").mockRejectedValue(new TypeError("fetch failed"));

    await expect(getJson(url)).rejects.toThrow(
      "No hay conexión con Open-Meteo. Revisa tu internet.",
    );
  });

  test("throws a Spanish error with the status code when the response is not ok", async () => {
    spyOn(globalThis, "fetch").mockResolvedValue(new Response("oops", { status: 500 }));

    await expect(getJson(url)).rejects.toThrow("Open-Meteo respondió con error 500.");
  });
});
