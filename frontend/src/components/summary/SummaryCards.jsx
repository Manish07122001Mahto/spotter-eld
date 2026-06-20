export default function SummaryCards({ tripSummary, cycleVal }) {
  const s = tripSummary;
  const cards = [
    {
      label: "Total Miles",
      val: s.total_miles.toLocaleString(),
      unit: "mi",
      warn: false,
    },
    {
      label: "Trip Duration",
      val: s.total_trip_days,
      unit: "days",
      warn: false,
    },
    {
      label: "Total Drive Time",
      val: s.total_driving_hours,
      unit: "hrs",
      warn: false,
    },
    { label: "Current Cycle", val: cycleVal, unit: "/ 70 hrs", warn: false },
    {
      label: "Cycle After Trip",
      val: s.cycle_used_after_trip,
      unit: "/ 70 hrs",
      warn: s.cycle_used_after_trip > 60,
    },
    {
      label: "Cycle Remaining",
      val: s.cycle_remaining,
      unit: "hrs left",
      warn: s.cycle_remaining < 10,
    },
  ];

  return (
    <div
      className="summary-cards"
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(155px, 1fr))",
        gap: 12,
        marginBottom: 20,
      }}
    >
      {cards.map((c) => (
        <div
          key={c.label}
          style={{
            background: "#fff",
            border: `1px solid ${c.warn ? "#E8C8C8" : "#C8D8E8"}`,
            borderTop: `3px solid ${c.warn ? "#B22222" : "#1B3A5C"}`,
            borderRadius: 6,
            padding: "13px 15px",
          }}
        >
          <div
            style={{
              fontSize: 11,
              color: "#6A8AA8",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: 0.5,
              marginBottom: 5,
            }}
          >
            {c.label}
          </div>
          <div
            style={{
              fontSize: 24,
              fontWeight: 700,
              color: c.warn ? "#B22222" : "#1B3A5C",
              lineHeight: 1,
            }}
          >
            {c.val}
            <span
              style={{
                fontSize: 12,
                fontWeight: 500,
                color: "#6A8AA8",
                marginLeft: 4,
              }}
            >
              {c.unit}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
