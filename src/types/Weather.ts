// Current weather for one city
export type Weather = {
  temperature: number;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  description: string;
};

// Forecast for one day
export type DailyForecast = {
  date: string;
  maxTemperature: number;
  minTemperature: number;
  rainChance: number;
  description: string;
};
