from __future__ import annotations

import math
from datetime import date, timedelta
from typing import Any, Dict, List, Tuple

# FMCSA 49 CFR Part 395 — 70hr/8day property carrier cycle
MAX_DRIVING_HOURS_PER_DAY: float = 11.0
MAX_ON_DUTY_WINDOW_HOURS: float = 14.0
REQUIRED_BREAK_AFTER_DRIVING: float = 8.0
REQUIRED_BREAK_DURATION: float = 0.5
REQUIRED_REST_HOURS: float = 10.0
MAX_CYCLE_HOURS: float = 70.0
PRE_TRIP_INSPECTION_HOURS: float = 0.5
AVERAGE_SPEED_MPH: float = 55.0
FUEL_STOP_INTERVAL_MILES: float = 1000.0
FUEL_STOP_DURATION_HOURS: float = 0.5
PICKUP_DURATION_HOURS: float = 1.0
DROPOFF_DURATION_HOURS: float = 1.0
DAY_START_HOUR: float = 6.0

_EPS = 0.01


def _interpolate_coords(
    route_coords: List[List[float]],
    total_miles: float,
    miles_at_point: float,
) -> List[float]:
    if total_miles <= 0 or not route_coords:
        return route_coords[0] if route_coords else [0.0, 0.0]

    fraction = min(miles_at_point / total_miles, 1.0)
    raw_idx = fraction * (len(route_coords) - 1)
    i = int(raw_idx)

    if i >= len(route_coords) - 1:
        return list(route_coords[-1])

    t = raw_idx - i
    lat = route_coords[i][0] + t * (route_coords[i + 1][0] - route_coords[i][0])
    lng = route_coords[i][1] + t * (route_coords[i + 1][1] - route_coords[i][1])
    return [round(lat, 4), round(lng, 4)]


def _seg(status: str, start: float, end: float) -> Dict[str, Any]:
    return {"status": status, "start_hour": round(start, 4), "end_hour": round(end, 4)}


def calculate_hos(
    total_miles: float,
    pickup_mile: float,
    current_cycle_used: float,
    route_coordinates: List[List[float]],
    start_label: str,
    pickup_label: str,
    dropoff_label: str,
    start_date: date,
) -> Dict[str, Any]:
    miles_driven: float = 0.0
    pickup_done: bool = False
    dropoff_done: bool = False
    next_fuel_at: float = FUEL_STOP_INTERVAL_MILES
    cycle_used: float = current_cycle_used

    daily_logs: List[Dict] = []
    stops: List[Dict] = []

    stops.append({
        "type": "start",
        "label": start_label,
        "lat": route_coordinates[0][0],
        "lng": route_coordinates[0][1],
        "duration_hrs": 0,
        "mile_marker": 0.0,
    })

    day_number = 0

    while not dropoff_done and day_number < 14:
        day_number += 1

        if cycle_used >= MAX_CYCLE_HOURS:
            break

        current_day_date: date = start_date + timedelta(days=day_number - 1)
        window_end: float = DAY_START_HOUR + MAX_ON_DUTY_WINDOW_HOURS

        segments: List[Dict] = []
        driving_today: float = 0.0
        on_duty_today: float = 0.0
        miles_today: float = 0.0
        current_hour: float = 0.0
        driving_since_break: float = 0.0

        segments.append(_seg("off_duty", 0.0, DAY_START_HOUR))
        current_hour = DAY_START_HOUR

        segments.append(_seg("on_duty", current_hour, current_hour + PRE_TRIP_INSPECTION_HOURS))
        current_hour += PRE_TRIP_INSPECTION_HOURS
        on_duty_today += PRE_TRIP_INSPECTION_HOURS
        cycle_used += PRE_TRIP_INSPECTION_HOURS

        if not pickup_done and pickup_mile <= _EPS:
            coord = _interpolate_coords(route_coordinates, total_miles, 0.0)
            stops.append({
                "type": "pickup",
                "label": pickup_label,
                "lat": coord[0],
                "lng": coord[1],
                "duration_hrs": PICKUP_DURATION_HOURS,
                "mile_marker": 0.0,
            })
            pickup_end = current_hour + PICKUP_DURATION_HOURS
            segments.append(_seg("on_duty", current_hour, pickup_end))
            current_hour = pickup_end
            on_duty_today += PICKUP_DURATION_HOURS
            cycle_used += PICKUP_DURATION_HOURS
            pickup_done = True
            driving_since_break = 0.0

        day_driving_done = False

        while not day_driving_done and not dropoff_done:

            if cycle_used >= MAX_CYCLE_HOURS - _EPS:
                day_driving_done = True
                break

            drive_hours_left: float = MAX_DRIVING_HOURS_PER_DAY - driving_today
            window_left: float = window_end - current_hour
            break_left: float = REQUIRED_BREAK_AFTER_DRIVING - driving_since_break
            cycle_hours_left: float = MAX_CYCLE_HOURS - cycle_used

            hrs_to_pickup: float = (
                (pickup_mile - miles_driven) / AVERAGE_SPEED_MPH
                if not pickup_done
                else math.inf
            )
            hrs_to_fuel: float = (next_fuel_at - miles_driven) / AVERAGE_SPEED_MPH
            hrs_to_dropoff: float = (total_miles - miles_driven) / AVERAGE_SPEED_MPH

            positive = [
                c for c in [
                    drive_hours_left, window_left, break_left, cycle_hours_left,
                    hrs_to_pickup, hrs_to_fuel, hrs_to_dropoff,
                ] if c > _EPS
            ]
            if not positive:
                day_driving_done = True
                break

            next_drive = min(positive)

            drive_end = current_hour + next_drive
            segments.append(_seg("driving", current_hour, drive_end))
            current_hour = drive_end
            driving_today += next_drive
            driving_since_break += next_drive
            miles_today += next_drive * AVERAGE_SPEED_MPH
            miles_driven += next_drive * AVERAGE_SPEED_MPH
            cycle_used += next_drive

            at_dropoff = miles_driven >= total_miles - _EPS * AVERAGE_SPEED_MPH
            at_pickup = (not pickup_done) and miles_driven >= pickup_mile - _EPS * AVERAGE_SPEED_MPH
            at_fuel = miles_driven >= next_fuel_at - _EPS * AVERAGE_SPEED_MPH
            need_break = driving_since_break >= REQUIRED_BREAK_AFTER_DRIVING - _EPS
            hit_limit = (
                driving_today >= MAX_DRIVING_HOURS_PER_DAY - _EPS
                or current_hour >= window_end - _EPS
            )

            if at_dropoff:
                coord = _interpolate_coords(route_coordinates, total_miles, miles_driven)
                stops.append({
                    "type": "dropoff",
                    "label": dropoff_label,
                    "lat": coord[0],
                    "lng": coord[1],
                    "duration_hrs": DROPOFF_DURATION_HOURS,
                    "mile_marker": round(miles_driven, 1),
                })
                dropoff_end = current_hour + DROPOFF_DURATION_HOURS
                segments.append(_seg("on_duty", current_hour, dropoff_end))
                current_hour = dropoff_end
                on_duty_today += DROPOFF_DURATION_HOURS
                cycle_used += DROPOFF_DURATION_HOURS
                dropoff_done = True
                day_driving_done = True

            elif at_pickup:
                coord = _interpolate_coords(route_coordinates, total_miles, miles_driven)
                stops.append({
                    "type": "pickup",
                    "label": pickup_label,
                    "lat": coord[0],
                    "lng": coord[1],
                    "duration_hrs": PICKUP_DURATION_HOURS,
                    "mile_marker": round(miles_driven, 1),
                })
                pickup_end = current_hour + PICKUP_DURATION_HOURS
                segments.append(_seg("on_duty", current_hour, pickup_end))
                current_hour = pickup_end
                on_duty_today += PICKUP_DURATION_HOURS
                cycle_used += PICKUP_DURATION_HOURS
                pickup_done = True
                driving_since_break = 0.0

            elif at_fuel:
                coord = _interpolate_coords(route_coordinates, total_miles, miles_driven)
                stops.append({
                    "type": "fuel",
                    "label": "Fuel Stop",
                    "lat": coord[0],
                    "lng": coord[1],
                    "duration_hrs": FUEL_STOP_DURATION_HOURS,
                    "mile_marker": round(miles_driven, 1),
                })
                fuel_end = current_hour + FUEL_STOP_DURATION_HOURS
                segments.append(_seg("on_duty", current_hour, fuel_end))
                current_hour = fuel_end
                on_duty_today += FUEL_STOP_DURATION_HOURS
                cycle_used += FUEL_STOP_DURATION_HOURS
                next_fuel_at += FUEL_STOP_INTERVAL_MILES
                driving_since_break = 0.0

            elif need_break:
                brk_end = current_hour + REQUIRED_BREAK_DURATION
                segments.append(_seg("on_duty", current_hour, brk_end))
                current_hour = brk_end
                on_duty_today += REQUIRED_BREAK_DURATION
                cycle_used += REQUIRED_BREAK_DURATION
                driving_since_break = 0.0

            elif hit_limit:
                day_driving_done = True

        if not dropoff_done:
            coord = _interpolate_coords(route_coordinates, total_miles, miles_driven)
            stops.append({
                "type": "rest",
                "label": f"Rest Stop — End of Day {day_number}",
                "lat": coord[0],
                "lng": coord[1],
                "duration_hrs": REQUIRED_REST_HOURS,
                "mile_marker": round(miles_driven, 1),
            })

        if current_hour < 24.0:
            segments.append(_seg("off_duty", current_hour, 24.0))

        total_hours = sum(s["end_hour"] - s["start_hour"] for s in segments)
        if abs(total_hours - 24.0) > 0.01:
            raise ValueError(
                f"Day {day_number} segment hours total {total_hours:.2f}, "
                f"must equal exactly 24.0. Segments: {segments}"
            )
        if segments[0]["start_hour"] != 0.0:
            raise ValueError(f"Day {day_number} must start at 0.0")
        if segments[-1]["end_hour"] != 24.0:
            raise ValueError(f"Day {day_number} must end at 24.0")
        for i in range(1, len(segments)):
            if abs(segments[i]["start_hour"] - segments[i - 1]["end_hour"]) > 0.001:
                raise ValueError(
                    f"Day {day_number} has a gap between segment {i - 1} "
                    f"(ends {segments[i - 1]['end_hour']}) and "
                    f"segment {i} (starts {segments[i]['start_hour']})"
                )

        total_on_duty = on_duty_today + driving_today
        daily_logs.append({
            "day": day_number,
            "date": current_day_date.isoformat(),
            "total_miles_today": round(miles_today),
            "driving_hours": round(driving_today, 1),
            "on_duty_hours": round(total_on_duty, 1),
            "cycle_used_so_far": round(cycle_used, 1),
            "log_segments": segments,
        })

    trip_summary: Dict[str, Any] = {
        "total_miles": round(total_miles, 1),
        "total_driving_hours": round(sum(d["driving_hours"] for d in daily_logs), 1),
        "total_trip_days": len(daily_logs),
        "cycle_used_after_trip": round(cycle_used, 1),
        "cycle_remaining": round(MAX_CYCLE_HOURS - cycle_used, 1),
    }

    return {
        "trip_summary": trip_summary,
        "daily_logs": daily_logs,
        "stops": stops,
    }
