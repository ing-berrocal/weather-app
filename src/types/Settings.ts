// Temperature unit used across the app
export type TempUnit = "celsius" | "fahrenheit";

// User preferences saved in cities.json
export type Settings = {
  unit: TempUnit;
};
