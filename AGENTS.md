## Project

- Console weather app built with Bun and TypeScript, using the Open-Meteo API (no API key).
- The README (in Spanish) describes the goal and the menu layout. Menu option numbers are fixed: 7 does not exist.
- User-facing text (menus, prompts, messages) should be in Spanish, matching the README menu.
- `src/index.ts`: menu loop. It loads data at start and saves after each action, except option 9 (exit).
- `src/actions/`: one file per user action (`getWeather.ts`, `getForecast.ts`, `addCity.ts`, `removeCity.ts`, `setDefaultCity.ts`, `toggleUnit.ts`).
- `src/presentation/`: `menu.ts` (menu text and option prompt), `input.ts` (readline prompt, city picker), `output.ts` (printing helpers and messages).
- `src/api/`: `client.ts` (shared `fetch` helper with Spanish error messages), `geocoding.ts` (city search), `weather.ts` (current weather and 7-day forecast).
- `src/storage/`: `dataFile.ts` (reads and writes `cities.json` in the project root), `citiesStorage.ts` (saved cities), `settingsStorage.ts` (temperature unit). Both storage modules keep the other key in the same file. Functions take an optional file path, which the tests use to avoid touching real data.
- `src/types/`: shared types (`City`, `Settings`, `AppData`, `Place`, `Weather`, `MenuOption`).
- `src/utils/`: `colors.ts` (ANSI colors: cyan menu, yellow temperature, green success, red errors; off when `NO_COLOR` is set or output is not a terminal), `format.ts` (place labels, unit symbols), `constants.ts` (WMO weather code to Spanish description map).
- `tests/`: Bun tests for `src/storage/`, `src/api/`. See Commands.
- `cities.json` is user data created at runtime and is not gitignored. Do not commit it.
- Piped stdin can lose lines because readline drops input that arrives before a question is asked. To test flows, send one line at a time with pauses.

## Commands

- Install: `bun install`
- Run: `bun src/index.ts`
- Typecheck: `.\node_modules\.bin\tsc.exe --noEmit` (`bunx` is not on the PATH in this Windows setup)
- Test: `bun test` (files in `tests/`). API calls are mocked with a fake `fetch`, and storage tests use a temp folder, so `cities.json` is never touched.
- There is no lint or format script. Do not assume one exists.
- Do not run `bun init` again. The project is already initialized, and the README step is done.

## Toolchain

- `typescript` is a peer dependency (`^7`) and is locked at 7.0.2, not a devDependency. Keep it at major 7.
- `tsconfig.json` uses `noEmit`, `verbatimModuleSyntax` (use `import type` for type-only imports), `allowImportingTsExtensions`, `noUncheckedIndexedAccess`, and `strict`. Expect array and object index access to be possibly `undefined`.
- Types come only from `bun` (`"types": ["bun"]`).

## API flow

- Step 1: geocoding (`https://geocoding-api.open-meteo.com/v1/search`) turns a city name into latitude and longitude. Use `language=es` to match the app language.
- Step 2: forecast (`https://api.open-meteo.com/v1/forecast`) takes latitude and longitude.
- Example requests are in `README.md`.

## Repo state

- Not a git repo yet. Follow the global git rules before committing.
- Tests are in `tests/` and run with the `test` script in `package.json`. Add new tests there and mock network calls. Do not hit the real Open-Meteo API from tests.
