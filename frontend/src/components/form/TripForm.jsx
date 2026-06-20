import SectionHeader from "../common/SectionHeader";
import InputField from "./InputField";
import CycleInput from "./CycleInput";
import Button from "../common/Button";

const infoIcon = (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#1B3A5C"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="12" />
    <line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
);

export default function TripForm({ form, loading, onChange, onSubmit }) {
  return (
    <div
      style={{
        background: "#fff",
        border: "1px solid #C8D8E8",
        borderRadius: 8,
        marginBottom: 24,
        overflow: "hidden",
      }}
    >
      <SectionHeader icon={infoIcon} title="Trip Details" />
      <div
        style={{
          padding: "20px",
          display: "flex",
          gap: 16,
          alignItems: "flex-end",
          flexWrap: "wrap",
        }}
      >
        <div style={{ flex: 1, minWidth: 180 }}>
          <InputField
            name="current_location"
            label="Current Location"
            placeholder="e.g. Chicago, IL"
            value={form.current_location}
            onChange={onChange}
          />
        </div>
        <div style={{ flex: 1, minWidth: 180 }}>
          <InputField
            name="pickup_location"
            label="Pickup Location"
            placeholder="e.g. St. Louis, MO"
            value={form.pickup_location}
            onChange={onChange}
          />
        </div>
        <div style={{ flex: 1, minWidth: 180 }}>
          <InputField
            name="dropoff_location"
            label="Dropoff Location"
            placeholder="e.g. Dallas, TX"
            value={form.dropoff_location}
            onChange={onChange}
          />
        </div>
        <div style={{ minWidth: 200 }}>
          <CycleInput value={form.current_cycle_used} onChange={onChange} />
        </div>
        <div>
          <Button onClick={onSubmit} disabled={loading} loading={loading}>
            Plan Trip
          </Button>
        </div>
      </div>
    </div>
  );
}
