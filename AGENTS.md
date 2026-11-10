## Project

- Console weather app built with Bun and TypeScript, using the Open-Meteo API (no API key).
- The README (in Spanish) describes the goal and the menu layout. Menu option numbers are fixed: 7 does not exist.
- User-facing text (menus, prompts, messages) should be in Spanish, matching the README menu.
- `index.ts`: menu loop and actions. It saves state after each action, except option 9 (exit).
- `src/api.ts`: shared `fetch` helper with Spanish error messages.
- `src/geocoding.ts`: city search (Open-Meteo geocoding).
- `src/forecast.ts`: current weather, 7-day forecast, plus WMO weather code to Spanish description map.
- `src/storage.ts`: loads and saves `cities.json` in the project root. Both functions take an optional file path, which the tests use to avoid touching real data.
- `tests/`: Bun tests for storage, `src/api.ts`, `src/geocoding.ts`, and `src/forecast.ts`. See Commands.
- `src/menu.ts`: readline prompt, printing helpers, and ANSI colors (cyan menu, yellow temperature, green success, red errors). Colors are off when `NO_COLOR` is set or output is not a terminal.
- `cities.json` is user data created at runtime and is not gitignored. Do not commit it.
- Piped stdin can lose lines because readline drops input that arrives before a question is asked. To test flows, send one line at a time with pauses.

## Commands

- Install: `bun install`
- Run: `bun index.ts`
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
