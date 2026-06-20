import http from "./http";

export const tripService = {
  planTrip: (formData) =>
    http.post("/api/trip/plan/", {
      current_location: formData.current_location,
      pickup_location: formData.pickup_location,
      dropoff_location: formData.dropoff_location,
      current_cycle_used: parseFloat(formData.current_cycle_used),
    }),
};
