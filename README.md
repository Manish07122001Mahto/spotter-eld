# ELD Trip Planner

A simple web application and production-ready monorepo for the ELD (Electronic Logging Device) Trip Planner.

## Motive

Commercial truck drivers in the United States are legally required to follow **Hours of Service (HOS)** regulations enforced by the FMCSA. These rules govern how many hours a driver can operate a vehicle before mandatory rest, with violations resulting in fines, out-of-service orders, and safety risks.

Planning a long-haul trip manually — accounting for driving windows, 30-minute breaks, 10-hour rest periods, fuel stops, and the 70-hour/8-day cycle — is error-prone and time-consuming. This tool exists to remove that friction: a driver enters their current location, pickup, and dropoff, and the system automatically produces a fully HOS-compliant itinerary with a day-by-day ELD log sheet, ready for review or submission.

## What It Does

1. **Trip Planning** — Takes a current location, pickup, and dropoff address and computes a route using the OpenRouteService API.
2. **HOS Compliance Engine** — Breaks the route into legally compliant driving segments, inserting mandatory 30-minute rest breaks, 10-hour overnight rests, and fuel stops at correct intervals.
3. **ELD Log Sheet Generation** — Produces per-day Electronic Logging Device grid sheets (Off Duty, Sleeper Berth, Driving, On Duty) exactly as required by FMCSA regulations.
4. **Interactive Trip Map** — Renders the full route on a Leaflet map with color-coded pins for each stop type (pickup, dropoff, rest, fuel).
5. **Trip Summary** — Shows total distance, estimated driving time, number of rest stops, and cycle hours used at a glance.

## Tech Stack

| Layer    | Technology                              |
| -------- | --------------------------------------- |
| Backend  | Python 3, Django 5, Django REST Framework |
| Routing  | OpenRouteService API                    |
| Frontend | React 18, Vite 5                        |
| Map      | react-leaflet 4 / Leaflet               |
| HTTP     | axios                                   |

## Structure

```
spotter-eld/
├── backend/    ← Django REST API (HOS engine, trip planner, ELD log generator)
├── frontend/   ← React + Vite app (map, ELD grid, trip form)
├── .gitignore
└── README.md
```

## Quick Start

See [`backend/README.md`](backend/README.md) for backend setup instructions.

See [`frontend/README.md`](frontend/README.md) for frontend setup instructions.
