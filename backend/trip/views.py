import requests
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from .serializers import TripRequestSerializer
from .services.trip_planner import plan_trip
from .services.hos_calculator import MAX_CYCLE_HOURS


class HealthCheckView(APIView):
    def get(self, request):
        return Response({"status": "ok"})


class PlanTripView(APIView):
    def post(self, request):
        serializer = TripRequestSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        data = serializer.validated_data

        if data["current_cycle_used"] >= MAX_CYCLE_HOURS:
            return Response(
                {"error": "Cycle hours exhausted. Driver cannot start a new trip."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            result = plan_trip(
                current_location=data["current_location"],
                pickup_location=data["pickup_location"],
                dropoff_location=data["dropoff_location"],
                current_cycle_used=data["current_cycle_used"],
            )
            return Response(result)
        except ValueError as exc:
            return Response({"error": str(exc)}, status=status.HTTP_400_BAD_REQUEST)
        except requests.exceptions.RequestException:
            return Response(
                {"error": "Routing service unavailable"},
                status=status.HTTP_503_SERVICE_UNAVAILABLE,
            )
        except Exception:
            return Response(
                {"error": "An unexpected error occurred."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
