## Project

- Console weather app built with Bun and TypeScript, using the Open-Meteo API (no API key).
- The README (in Spanish) describes the goal: ask for a city, save a default city, track several cities, and eventually ship an executable.
- `index.ts` is still a placeholder (`console.log("Hello via Bun!")`). The real app is not built yet.
- User-facing text (menus, prompts, messages) should be in Spanish, matching the README menu.

## Commands

- Install: `bun install`
- Run: `bun index.ts`
- Typecheck: `.\node_modules\.bin\tsc.exe --noEmit` (`bunx` is not on the PATH in this Windows setup)
- There is no test, lint, or format script. Do not assume one exists. If you add one, document it here.
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
