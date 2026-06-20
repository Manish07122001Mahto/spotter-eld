# ELD Trip Planner - Frontend

React + Vite frontend for the ELD Trip Planner. Plan HOS-compliant truck routes with a live map and daily ELD log sheets.

---

## Prerequisites

| Tool    | Minimum version |
| ------- | --------------- |
| Node.js | 18              |
| npm     | 9               |

---

## Setup

```bash
# Install dependencies
npm install
```

Copy `.env.example` to `.env` and set your backend URL:

```bash
cp .env.example .env
```

```env
# Replace with your actual backend URL (local or deployed)
VITE_API_BASE_URL=https://your-backend-url.com
```

---

## Development

```bash
npm run dev
```

Opens at `http://localhost:5173`. Requires the backend running and `VITE_API_BASE_URL` set to its URL.

---

## Available scripts

| Script            | Description                            |
| ----------------- | -------------------------------------- |
| `npm run dev`     | Start dev server with hot reload       |
| `npm run build`   | Build for production (output: `dist/`) |
| `npm run preview` | Preview the production build locally   |

---

## Project structure

```
src/
├── api/
│   ├── http.js            Axios instance with error handling
│   └── tripService.js     Trip planning API call
├── components/
│   ├── common/
│   │   ├── Button.jsx
│   │   ├── ErrorToast.jsx
│   │   ├── ScrollToTop.jsx
│   │   └── SectionHeader.jsx
│   ├── eld/
│   │   ├── ELDGrid.jsx    SVG log sheet grid
│   │   ├── ELDSection.jsx
│   │   └── ELDTabs.jsx
│   ├── form/
│   │   ├── CycleInput.jsx
│   │   ├── InputField.jsx
│   │   └── TripForm.jsx
│   ├── layout/
│   │   ├── Footer.jsx
│   │   └── Navbar.jsx
│   ├── map/
│   │   └── TripMap.jsx    Leaflet map with colored pins
│   └── summary/
│       └── SummaryCards.jsx
├── constants/
│   └── stopConfig.js      Stop types, colors, labels
├── hooks/
│   └── useTripPlanner.js  Form state and API logic
├── App.jsx
├── index.css
└── main.jsx
```

---

## Tech stack

- **React 18** + **Vite 5**
- **react-leaflet 4** - interactive map
- **axios** - HTTP client with error normalisation
- **Inter** (Google Fonts) - UI font
