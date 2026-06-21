# Movie Database

A web application for searching movies via the [OMDb API](https://www.omdbapi.com/), viewing movie details, and saving favourites locally.

## Features

- **Homepage**: search movies by title, filter by release year and genre, browse paginated results.
- **Movie details**: view full movie information including title, plot, year, genre, runtime, director, cast, ratings, and poster.
- **Favourites**: mark and unmark movies as favourites; favourites persist in `localStorage` and are shown on a dedicated page.
- **Error handling**: graceful handling of API errors, network errors, missing posters, and unknown movie IDs.
- **Accessibility & SEO**: semantic HTML, keyboard navigation, ARIA labels, and meaningful page metadata.

## Tech stack

- [Next.js 16](https://nextjs.org/) with App Router
- [React 19](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/) (strict mode)
- [Tailwind CSS v4](https://tailwindcss.com/)
- [Feature Sliced Design (FSD)](https://feature-sliced.design/) architectural methodology

## Project structure

The project follows the Feature Sliced Design methodology:

```
movie-database/
├── app/                 # Next.js App Router pages and Route Handlers
├── entities/            # Domain entities (movie types, API client, cards)
├── features/            # User-facing features (search, filters, pagination, favourites)
├── widgets/             # Composable UI blocks (navbar, movie list, movie details)
├── shared/              # Reusable UI primitives, utilities, and configuration
└── public/              # Static assets
```

Business logic lives in `model/` segments and custom hooks; UI components remain presentational.

## Dependencies

Production dependencies:

- `next`, `react`, `react-dom` — core framework and UI library.
- `lucide-react` — icon set used across the UI.
- `clsx` + `tailwind-merge` — utility for composing and merging Tailwind classes cleanly.

Development dependencies:

- `typescript` — type safety.
- `eslint` + `eslint-config-next` + `eslint-config-prettier` + `eslint-plugin-prettier` — linting and formatting.
- `prettier` — code formatting.
- `jest` + `jest-environment-jsdom` + `@testing-library/react` + `@testing-library/jest-dom` + `@testing-library/user-event` — unit and integration testing.

## Getting started

### 1. Install dependencies

```bash
npm install
```

### 2. Set up the OMDb API key

Create a `.env` file in the root of the repo and add your OMDb API key:

```env
OMDB_API_KEY=your_api_key_here
```

You can request a free API key at [https://www.omdbapi.com/apikey.aspx](https://www.omdbapi.com/apikey.aspx).

The key is used only on the server side through a Next.js Route Handler (`app/api/movies/route.ts`), so it is never exposed to the browser.

### 3. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available scripts

| Script                  | Description                                          |
| ----------------------- | ---------------------------------------------------- |
| `npm run dev`           | Start the development server with Turbopack.         |
| `npm run build`         | Create an optimized production build.                |
| `npm start`             | Start the production server (after building).        |
| `npm run lint`          | Run ESLint.                                          |
| `npm run lint:fix`      | Run ESLint and auto-fix issues.                      |
| `npm run format`        | Format all files with Prettier.                      |
| `npm run format:check`  | Check formatting without writing files.              |
| `npm run type-check`    | Run TypeScript type checking without emitting files. |
| `npm test`              | Run the Jest test suite.                             |
| `npm run test:watch`    | Run Jest in watch mode.                              |
| `npm run test:coverage` | Run Jest with coverage report.                       |

## Notes

- The OMDb search API supports filtering by a single year only; the app uses a year input for that.
- Genre filtering is applied client-side on the current page of results by fetching details for each result, because OMDb search responses do not include genre information.
- Favourites are stored in the browser’s `localStorage`.
