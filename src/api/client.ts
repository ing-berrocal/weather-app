// Fetches a URL and returns the parsed JSON, with Spanish error messages
export async function getJson<T>(url: URL): Promise<T> {
  let response: Response;
  try {
    response = await fetch(url);
  } catch {
    throw new Error("No hay conexión con Open-Meteo. Revisa tu internet.");
  }

  if (!response.ok) {
    throw new Error(`Open-Meteo respondió con error ${response.status}.`);
  }

  return (await response.json()) as T;
}
