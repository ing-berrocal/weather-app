import type { City } from "./City.ts";
import type { Settings } from "./Settings.ts";

// Everything the app keeps in memory while it runs
export type AppData = Settings & {
  cities: City[];
};
