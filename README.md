# Shared Tasks

Shared Tasks is a collaborative to‑do list built with [React](https://reactjs.org/) and [Jazz](https://jazz.tools/). It lets you organize tasks into lists and sections, then share them with others in real time.

## Quick Start

1. Install dependencies
   ```bash
   yarn install
   ```
2. Start the development server
   ```bash
   yarn start
   ```
   The app opens at [http://localhost:3000](http://localhost:3000) and reloads on changes.

### Building for production

```bash
yarn build
```
The optimized build is output to the `build/` folder.

### Running tests

There are currently no unit tests, but the project is configured for [Jest](https://jestjs.io/).
Run the test runner with:
```bash
CI=true yarn test --watchAll=false --passWithNoTests
```

## Features

- Real-time collaboration powered by **jazz-react**
- Multiple lists with sections and tasks
- Share lists via link or QR code
- Simple authentication using the demo auth flow

## Project Structure

```
src/
  index.tsx       # Application entry, sets up Jazz provider and demo auth
  models.ts       # Collaborative data models (lists, tasks, account)
  ui/             # React components
  util/           # Helper functions
```

To learn more about Jazz, check the [Jazz documentation](https://docs.jazz.tools/). This project was originally bootstrapped with Create React App.
