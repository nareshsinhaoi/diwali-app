# Shubh Diwali Dhamaka

An interactive, eco-friendly Diwali celebration app built with React and Vite. Users can light diyas, send virtual light to Indian cities, burst virtual crackers, control sound effects, and reveal festive gifts.

## Features

- Light individual diyas or all diyas from the home section
- Track diya and cracker activity locally
- Unlock playful diya achievement badges
- Send virtual diyas to major Indian cities
- View community city diya totals with Firebase Firestore sync
- Use virtual Anar, Chakri, Rocket, Ladi, and Phuljhari effects
- Create canvas-based fireworks and spark trails
- Reveal randomly generated festive gifts
- Save a display name and mobile number locally
- Toggle synthesized sound effects on or off

## Tech Stack

- React 19
- Vite 8
- Firebase Authentication and Cloud Firestore
- Lucide React icons
- Tailwind CSS-style utility classes
- Web Audio API
- HTML Canvas API

## Getting Started

### Prerequisites

- Node.js 20 or newer
- npm

### Install

```bash
npm install
```

### Run Locally

```bash
npm run dev
```

Open the local URL printed by Vite, usually:

```text
http://localhost:5173
```

### Production Build

```bash
npm run build
```

To preview the production build:

```bash
npm run preview
```

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Vite development server |
| `npm run build` | Create a production build in `dist/` |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run Oxlint |

## Firebase Configuration

The app includes a demo Firebase configuration fallback so it can run without project credentials. It uses Firebase globals when available:

- `__firebase_config` - Firebase configuration JSON
- `__app_id` - Firestore artifact application ID
- `__initial_auth_token` - Optional custom authentication token

If these globals are not provided, the app uses a demo configuration and the app ID `diwali-fest-app`. Firestore operations are protected with error handling and automatically fall back to local or in-memory behavior when authentication or database permissions are unavailable.

For a real deployment, configure Firebase Authentication and Firestore, provide valid project credentials through the supported globals, and set appropriate Firestore security rules.

## Local Storage

The app stores the following browser values locally:

- `diwali_user_name`
- `diwali_user_mobile`
- `diwali_home_diyas`
- `diwali_crackers_burst`

Clearing these values from browser storage resets the saved profile and activity counters.

## Project Structure

```text
src/
  App.jsx       Main application UI and interactions
  App.css       Additional component styles
  index.css     Global styles
  main.jsx      React entry point
public/
  favicon.svg
  icons.svg
```
