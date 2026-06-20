export const ROW_INDEX = {
  off_duty: 0,
  sleeper_berth: 1,
  driving: 2,
  on_duty: 3,
};

export const ROW_LABELS = [
  "1: Off duty",
  "2: Sleeper berth",
  "3: Driving",
  "4: On duty",
];

export const ROW_SUBS = ["", "", "", "(not driving)"];

export const STOP_COLORS = {
  start: "#1B4F8A",
  pickup: "#1B7A5A",
  fuel: "#8A6200",
  rest: "#5A1B8A",
  dropoff: "#8A1B1B",
};

export const STOP_LABELS = {
  start: "Origin",
  pickup: "Pickup",
  fuel: "Fuel",
  rest: "Rest",
  dropoff: "Dropoff",
};

export const STOP_ICONS = {
  start: `
    <circle cx="8" cy="7" r="3.2" fill="none" stroke="white" stroke-width="1.6"/>
    <circle cx="8" cy="7" r="1.4" fill="white"/>
    <line x1="8" y1="10.2" x2="8" y2="13.5" stroke="white" stroke-width="1.6" stroke-linecap="round"/>
  `,
  pickup: `
    <path d="M8 2v8M5.5 7L8 9.5 10.5 7" stroke="white" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <line x1="2.5" y1="13" x2="13.5" y2="13" stroke="white" stroke-width="1.5" stroke-linecap="round"/>
  `,
  dropoff: `
    <path d="M8 14V5M5.5 7.5L8 5 10.5 7.5" stroke="white" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <line x1="2.5" y1="2.5" x2="13.5" y2="2.5" stroke="white" stroke-width="1.5" stroke-linecap="round"/>
  `,
  fuel: `
    <rect x="2" y="3" width="8" height="11" rx="1" fill="none" stroke="white" stroke-width="1.4"/>
    <rect x="3.5" y="5" width="5" height="3" rx="0.5" fill="white"/>
    <path d="M10 6l2 1.5v4a1 1 0 0 0 2 0V9l-2-2" stroke="white" stroke-width="1.3" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
  `,
  rest: `
    <path d="M1 13V8M1 11h14M15 13v-2M3 11V9a1 1 0 0 1 1-1h3M9 8h3a1 1 0 0 1 1 1v2" stroke="white" stroke-width="1.4" fill="none" stroke-linecap="round"/>
    <circle cx="3.5" cy="8" r="1.2" fill="white"/>
  `,
};
