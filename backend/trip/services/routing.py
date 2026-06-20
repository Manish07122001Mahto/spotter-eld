from typing import Dict, List, Tuple

import requests


def get_route(coordinates: List[Tuple[float, float]], api_key: str) -> Dict:
    url = "https://api.openrouteservice.org/v2/directions/driving-car/geojson"
    ors_coords = [[lng, lat] for lat, lng in coordinates]

    headers = {"Authorization": api_key, "Content-Type": "application/json"}

    try:
        response = requests.post(
            url,
            json={"coordinates": ors_coords, "instructions": False},
            headers=headers,
            timeout=15,
        )
        response.raise_for_status()
    except requests.RequestException as exc:
        raise ConnectionError("Routing service unavailable") from exc

    try:
        feature = response.json()["features"][0]
        total_meters: float = feature["properties"]["summary"]["distance"]
        raw_coords = feature["geometry"]["coordinates"]
        route_coordinates = [[round(c[1], 5), round(c[0], 5)] for c in raw_coords]
    except (KeyError, IndexError) as exc:
        raise ConnectionError("Routing service unavailable") from exc

    return {
        "total_miles": round(total_meters / 1609.34, 1),
        "route_coordinates": route_coordinates,
    }
