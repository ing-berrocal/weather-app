import { getJson } from "./api.ts";

export type Place = {
  name: string;
  admin1?: string;
  country?: string;
  latitude: number;
  longitude: number;
};

type GeocodingResponse = {
  results?: Place[];
};

// Returns up to 5 cities that match the name, with labels in Spanish
export async function searchCity(name: string): Promise<Place[]> {
  const url = new URL("https://geocoding-api.open-meteo.com/v1/search");
  url.searchParams.set("name", name);
  url.searchParams.set("count", "5");
  url.searchParams.set("language", "es");
  url.searchParams.set("format", "json");

  const data = await getJson<GeocodingResponse>(url);
  return data.results ?? [];
}
