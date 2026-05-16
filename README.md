<p align="center">
   <img src="assets/images/icon.png" alt="Expo App Icon" width="96" height="96" style="border-radius: 18px;" />
</p>

<h1 align="center">ReactNativeApp</h1>

<p align="center">A learning-focused React Native project built with Expo. This repo is for exploring core React Native concepts, Expo tooling, and file-based routing with real screens and components.</p>

## Why this project exists

This is for learning React Native: building screens, wiring data, organizing components, and getting comfortable with the Expo workflow. It is intentionally hands-on and structured to grow as new lessons and experiments are added.

## What you will find

- `app/`: Main app routes and screens (Expo Router)
- `components/`: Shared UI and feature components
- `services/`: App services (data, notifications, APIs)
- `types/`: Shared TypeScript types
- `app-example/`: The original starter template, kept for reference

## Run the app

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the development server

   ```bash
   npx expo start
   ```

In the output, choose how to open the app:

- Development build
- Android emulator
- iOS simulator
- Expo Go

## Reset to a blank app

```bash
npm run reset-project
```

Moves the starter code to `app-example/` and creates a clean `app/` directory for fresh experiments.

## Learning goals

- Build real screens with Expo Router
- Practice component composition and state
- Experiment with services and simple data flows
- Keep TypeScript types tidy and reusable

## Helpful resources

- [Expo documentation](https://docs.expo.dev/)
- [Expo Router](https://docs.expo.dev/router/introduction/)
- [React Native docs](https://reactnative.dev/docs/getting-started)
