# Wing-Go

Wing-Go is a modern **Next.js 13** project for planning personalized trips with hotel and tourist destination selection. It uses **React**, **Redux Toolkit**, **Material UI (MUI)**, and integrates with a Node.js backend for trip management.

Preferred Node Version: v20.18.3

## Features

-   Dynamic trip planning by city and tourist destinations
-   Per-day budget calculation and hotel recommendations
-   Hotel selection per city
-   State management with Redux Toolkit
-   Responsive UI with MUI
-   Persistent data with Redux-Persist
-   Integration with GraphQL & REST APIs

## Getting Started

Clone the repository and install dependencies:

```bash
git clone https://github.com/asaad2121/Wing-Go-Web
cd wing-go
pnpm install
```

Start the development server:

```bash
pnpm dev
# or
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

For a local network test (e.g., mobile devices):

```bash
pnpm run localserver
```

## Scripts

| Script                 | Description                                  |
| ---------------------- | -------------------------------------------- |
| `pnpm dev`             | Start the development server                 |
| `pnpm run localserver` | Start dev server accessible on local network |
| `pnpm build`           | Build the project for production             |
| `pnpm start`           | Start the production server                  |
| `pnpm lint`            | Run ESLint checks                            |
| `pnpm run prettier`    | Format code using Prettier                   |

## Tech Stack

-   **Next.js 13** - React framework for server-side rendering & routing
-   **React 18** - Frontend library
-   **Redux Toolkit** - State management
-   **MUI 5** - Component library for responsive design
-   **GraphQL / Axios** - API queries
-   **Mapbox GL** - Map integration
-   **Sass** - Styling

## API Integration

API requests are handled via `api-queries.ts` and integrated into Redux slices:

-   `planTouristTrip` - Plans trip based on user input
-   `tripHotelsSelect` - Saves selected hotels

Validation is implemented using **express-validator** on the backend for robustness against invalid JSON payloads.

## Learn More

-   [Next.js Documentation](https://nextjs.org/docs)
-   [React Documentation](https://reactjs.org/docs/getting-started.html)
-   [Redux Toolkit Documentation](https://redux-toolkit.js.org/)
-   [Material UI Documentation](https://mui.com/)

## Deployment

The app can be deployed on **Vercel**:

```bash
pnpm build
pnpm start
```

Check [Next.js deployment docs](https://nextjs.org/docs/deployment) for details.
