import os
from datetime import date
from typing import Any, Dict, Tuple

from .geocoding import geocode_location
from .routing import get_route
from .hos_calculator import calculate_hos


def plan_trip(
    current_location: str,
    pickup_location: str,
    dropoff_location: str,
    current_cycle_used: float,
) -> Dict[str, Any]:
    api_key = os.getenv("OPENROUTE_API_KEY", "")

    current_coords: Tuple[float, float] = geocode_location(current_location, api_key)

    pickup_coords: Tuple[float, float] = (
        current_coords
        if pickup_location.strip().lower() == current_location.strip().lower()
        else geocode_location(pickup_location, api_key)
    )

    dropoff_coords: Tuple[float, float] = (
        pickup_coords
        if dropoff_location.strip().lower() == pickup_location.strip().lower()
        else geocode_location(dropoff_location, api_key)
    )

    if pickup_coords == current_coords:
        route_data = get_route([current_coords, dropoff_coords], api_key)
    else:
        route_data = get_route([current_coords, pickup_coords, dropoff_coords], api_key)
    total_miles: float = route_data["total_miles"]
    route_coordinates = route_data["route_coordinates"]

    if pickup_coords == current_coords:
        pickup_mile: float = 0.0
    else:
        pickup_mile = get_route([current_coords, pickup_coords], api_key)["total_miles"]

    hos_result = calculate_hos(
        total_miles=total_miles,
        pickup_mile=pickup_mile,
        current_cycle_used=current_cycle_used,
        route_coordinates=route_coordinates,
        start_label=current_location,
        pickup_label=pickup_location,
        dropoff_label=dropoff_location,
        start_date=date.today(),
    )

    return {
        "trip_summary": hos_result["trip_summary"],
        "map_data": {
            "route_coordinates": route_coordinates,
            "stops": hos_result["stops"],
        },
        "daily_logs": hos_result["daily_logs"],
    }
