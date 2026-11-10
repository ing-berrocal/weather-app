// A saved city, with its coordinates and whether it is the default
export type City = {
  name: string;
  admin1?: string;
  country?: string;
  latitude: number;
  longitude: number;
  isDefault: boolean;
};
