import { useState } from "react";
import { tripService } from "../api/tripService";

export function useTripPlanner() {
  const [form, setForm] = useState({
    current_location: "",
    pickup_location: "",
    dropoff_location: "",
    current_cycle_used: "",
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async () => {
    const {
      current_location,
      pickup_location,
      dropoff_location,
      current_cycle_used,
    } = form;
    if (
      !current_location ||
      !pickup_location ||
      !dropoff_location ||
      !current_cycle_used
    ) {
      setError("All four fields are required.");
      return;
    }
    const cycleNum = parseFloat(current_cycle_used);
    if (isNaN(cycleNum) || cycleNum < 0 || cycleNum > 70) {
      setError("Cycle used must be between 0 and 70 hours.");
      return;
    }
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const data = await tripService.planTrip(form);
      setResult(data);
      data.daily_logs.forEach((log) => {
        const total = log.log_segments.reduce(
          (sum, seg) => sum + (seg.end_hour - seg.start_hour),
          0,
        );
        console.log(`Day ${log.day} total hours: ${total}`);
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => setError("");

  return {
    form,
    result,
    loading,
    error,
    clearError,
    handleChange,
    handleSubmit,
  };
}
