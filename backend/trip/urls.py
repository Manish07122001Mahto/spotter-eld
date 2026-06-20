from django.urls import path
from . import views

urlpatterns = [
    path("health/", views.HealthCheckView.as_view(), name="health"),
    path("trip/plan/", views.PlanTripView.as_view(), name="plan_trip"),
]
