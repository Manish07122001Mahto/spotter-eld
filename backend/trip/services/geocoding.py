from typing import Tuple

import requests


def geocode_location(location_name: str, api_key: str) -> Tuple[float, float]:
    url = "https://api.openrouteservice.org/geocode/search"
    params = {"api_key": api_key, "text": location_name, "size": 1}

    try:
        response = requests.get(url, params=params, timeout=10)
        response.raise_for_status()
    except requests.RequestException as exc:
        raise ConnectionError("Routing service unavailable") from exc

    features = response.json().get("features", [])
    if not features:
        raise ValueError(f"Location not found: {location_name}")

    lng, lat = features[0]["geometry"]["coordinates"]
    return round(lat, 4), round(lng, 4)
