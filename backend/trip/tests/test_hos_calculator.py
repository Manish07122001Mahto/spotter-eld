from datetime import date
from unittest import TestCase

from trip.services.hos_calculator import (
    MAX_CYCLE_HOURS,
    MAX_DRIVING_HOURS_PER_DAY,
    AVERAGE_SPEED_MPH,
    FUEL_STOP_INTERVAL_MILES,
    calculate_hos,
)

# Minimal fake route: straight line, two points
FAKE_ROUTE = [[41.0, -87.0], [32.0, -96.0]]


def _run(leg1: float, leg2: float, cycle: float = 0.0):
    """Helper: run calculate_hos with simple straight-line route."""
    return calculate_hos(
        total_miles=leg1 + leg2,
        pickup_mile=leg1,
        current_cycle_used=cycle,
        route_coordinates=FAKE_ROUTE,
        start_label="Start",
        pickup_label="Pickup",
        dropoff_label="Dropoff",
        start_date=date(2024, 1, 1),
    )


class TestSegmentCoverage(TestCase):
    """Each day's log_segments must cover exactly 0–24 hours with no gaps."""

    def _assert_full_coverage(self, result):
        for day in result["daily_logs"]:
            segs = day["log_segments"]
            self.assertAlmostEqual(segs[0]["start_hour"], 0.0, places=3)
            self.assertAlmostEqual(segs[-1]["end_hour"], 24.0, places=3)
            for i in range(len(segs) - 1):
                self.assertAlmostEqual(
                    segs[i]["end_hour"], segs[i + 1]["start_hour"], places=3,
                    msg=f"Gap between segments {i} and {i+1} on day {day['day']}",
                )

    def test_short_trip_single_day(self):
        result = _run(leg1=100, leg2=150)
        self.assertEqual(result["trip_summary"]["total_trip_days"], 1)
        self._assert_full_coverage(result)

    def test_long_trip_multi_day(self):
        result = _run(leg1=300, leg2=700)
        self.assertGreater(result["trip_summary"]["total_trip_days"], 1)
        self._assert_full_coverage(result)


class TestDrivingLimits(TestCase):
    """No day should exceed 11 driving hours."""

    def test_driving_hours_capped(self):
        result = _run(leg1=400, leg2=600)
        for day in result["daily_logs"]:
            self.assertLessEqual(
                day["driving_hours"], MAX_DRIVING_HOURS_PER_DAY + 0.05,
                msg=f"Day {day['day']} exceeded drive limit",
            )


class TestMandatoryBreak(TestCase):
    """A 30-min on_duty break must appear after 8 consecutive driving hours."""

    def test_break_inserted_on_long_driving_day(self):
        # 700-mile single leg forces 11 hrs driving → break must appear
        result = _run(leg1=10, leg2=700)
        day1 = result["daily_logs"][0]
        # Look for a 0.5-hr on_duty segment that is not the pre-trip inspection (6.0–6.5)
        break_segs = [
            s for s in day1["log_segments"]
            if s["status"] == "on_duty"
            and s["start_hour"] > 6.5  # after pre-trip ends
            and round(s["end_hour"] - s["start_hour"], 2) == 0.5
            and s["end_hour"] < 24.0
        ]
        self.assertTrue(
            len(break_segs) > 0,
            "Expected a 30-min on_duty break mid-day but found none",
        )


class TestFuelStop(TestCase):
    """A fuel stop must appear in stops and log_segments when the trip exceeds 1000 miles."""

    def test_fuel_stop_over_1000_miles(self):
        result = _run(leg1=200, leg2=900)  # total 1100 miles
        fuel_stops = [s for s in result["stops"] if s["type"] == "fuel"]
        self.assertGreater(len(fuel_stops), 0, "Expected at least one fuel stop")

    def test_no_fuel_stop_under_1000_miles(self):
        result = _run(leg1=200, leg2=600)  # total 800 miles
        fuel_stops = [s for s in result["stops"] if s["type"] == "fuel"]
        self.assertEqual(len(fuel_stops), 0, "Expected no fuel stop under 1000 miles")


class TestCycleTracking(TestCase):
    """cycle_used_so_far must increase each day and never exceed MAX_CYCLE_HOURS."""

    def test_cycle_increases_each_day(self):
        result = _run(leg1=300, leg2=700, cycle=10.0)
        logs = result["daily_logs"]
        for i in range(1, len(logs)):
            self.assertGreater(
                logs[i]["cycle_used_so_far"],
                logs[i - 1]["cycle_used_so_far"],
            )

    def test_cycle_never_exceeds_max(self):
        result = _run(leg1=300, leg2=700, cycle=50.0)
        for day in result["daily_logs"]:
            self.assertLessEqual(day["cycle_used_so_far"], MAX_CYCLE_HOURS + 0.1)


class TestStopOrder(TestCase):
    """Stops must appear in trip order: start → pickup → [fuel] → [rest] → dropoff."""

    def test_start_first_dropoff_last(self):
        result = _run(leg1=200, leg2=400)
        stops = result["stops"]
        self.assertEqual(stops[0]["type"], "start")
        self.assertEqual(stops[-1]["type"], "dropoff")

    def test_pickup_before_dropoff(self):
        result = _run(leg1=200, leg2=400)
        stops = result["stops"]
        types = [s["type"] for s in stops]
        self.assertLess(types.index("pickup"), types.index("dropoff"))


class TestTripSummary(TestCase):
    """Trip summary fields must be self-consistent."""

    def test_cycle_remaining_adds_up(self):
        result = _run(leg1=100, leg2=200, cycle=20.0)
        summary = result["trip_summary"]
        self.assertAlmostEqual(
            summary["cycle_used_after_trip"] + summary["cycle_remaining"],
            MAX_CYCLE_HOURS,
            places=1,
        )

    def test_total_miles_matches_legs(self):
        result = _run(leg1=100, leg2=200)
        self.assertAlmostEqual(result["trip_summary"]["total_miles"], 300.0, places=1)
