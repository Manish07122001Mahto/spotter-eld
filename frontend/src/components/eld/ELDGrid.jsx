import { ROW_INDEX, ROW_LABELS, ROW_SUBS } from "../../constants/stopConfig";

export default function ELDGrid({ log }) {
  const W = 672;
  const ROW_H = 40;
  const LABEL_W = 108;
  const HEADER_H = 26;
  const BOTTOM_LABEL_H = 20;
  const PR = 14;
  const cellW = W / 24;
  const TOTAL_H = HEADER_H + ROW_H * 4 + BOTTOM_LABEL_H + 4;

  const segments = log.log_segments;

  const linePoints = [];
  segments.forEach((seg) => {
    const row = ROW_INDEX[seg.status] ?? 0;
    const y = HEADER_H + row * ROW_H + ROW_H / 2;
    const x1 = LABEL_W + seg.start_hour * cellW;
    const x2 = LABEL_W + seg.end_hour * cellW;
    linePoints.push([x1, y]);
    linePoints.push([x2, y]);
  });
  const polyline = linePoints
    .map(([x, y]) => `${x.toFixed(2)},${y.toFixed(2)}`)
    .join(" ");

  const offDutyHrs = segments
    .filter((s) => s.status === "off_duty")
    .reduce((a, s) => a + s.end_hour - s.start_hour, 0);
  const sleeperHrs = segments
    .filter((s) => s.status === "sleeper_berth")
    .reduce((a, s) => a + s.end_hour - s.start_hour, 0);
  const onDutyHrs = segments
    .filter((s) => s.status === "on_duty")
    .reduce((a, s) => a + s.end_hour - s.start_hour, 0);

  const hours = Array.from({ length: 25 }, (_, i) => i);

  return (
    <div
      style={{
        background: "#fff",
        border: "1px solid #B8C8DC",
        borderRadius: 6,
        overflow: "hidden",
        marginBottom: 20,
      }}
    >
      <div
        style={{
          background: "#1B3A5C",
          padding: "8px 16px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 8,
        }}
      >
        <div
          style={{
            color: "#fff",
            fontWeight: 700,
            fontSize: 13,
            letterSpacing: 0.3,
          }}
        >
          Driver's Daily Log - Day {log.day}
          <span
            style={{
              fontWeight: 400,
              color: "#93C5FD",
              fontSize: 12,
              marginLeft: 10,
            }}
          >
            {log.date}
          </span>
        </div>
        <div
          style={{ display: "flex", gap: 18, fontSize: 12, color: "#93C5FD" }}
        >
          <span>
            Miles:{" "}
            <strong style={{ color: "#fff" }}>{log.total_miles_today}</strong>
          </span>
          <span>
            Driving:{" "}
            <strong style={{ color: "#fff" }}>{log.driving_hours}h</strong>
          </span>
          <span>
            On-duty:{" "}
            <strong style={{ color: "#fff" }}>{log.on_duty_hours}h</strong>
          </span>
          <span>
            Cycle:{" "}
            <strong style={{ color: "#FDE047" }}>
              {log.cycle_used_so_far}h / 70h
            </strong>
          </span>
        </div>
      </div>

      <div style={{ background: "#EEF4FB" }}>
        <svg
          viewBox={`0 0 ${LABEL_W + W + PR} ${TOTAL_H}`}
          style={{ display: "block", width: "100%", height: "auto" }}
        >
          {ROW_LABELS.map((_, i) => (
            <rect
              key={i}
              x={LABEL_W}
              y={HEADER_H + i * ROW_H}
              width={W + PR}
              height={ROW_H}
              fill={i % 2 === 0 ? "#D8E8F4" : "#C8DCEE"}
            />
          ))}

          {Array.from({ length: 5 }, (_, i) => (
            <line
              key={i}
              x1={LABEL_W}
              y1={HEADER_H + i * ROW_H}
              x2={LABEL_W + W + PR}
              y2={HEADER_H + i * ROW_H}
              stroke="#8AAABF"
              strokeWidth={0.8}
            />
          ))}

          {hours.map((h) => (
            <g key={h}>
              <line
                x1={LABEL_W + h * cellW}
                y1={HEADER_H}
                x2={LABEL_W + h * cellW}
                y2={HEADER_H + ROW_H * 4}
                stroke="#A8C0D0"
                strokeWidth={0.7}
              />
              {h < 24 &&
                Array.from({ length: 4 }, (_, rowIdx) => {
                  const rowTop = HEADER_H + rowIdx * ROW_H;
                  const rowBot = rowTop + ROW_H;
                  return [
                    <line
                      key={`${h}-${rowIdx}-15`}
                      x1={LABEL_W + (h + 0.25) * cellW}
                      y1={rowBot - ROW_H * 0.3}
                      x2={LABEL_W + (h + 0.25) * cellW}
                      y2={rowBot}
                      stroke="#8AAABF"
                      strokeWidth={0.5}
                    />,
                    <line
                      key={`${h}-${rowIdx}-30`}
                      x1={LABEL_W + (h + 0.5) * cellW}
                      y1={rowBot - ROW_H * 0.55}
                      x2={LABEL_W + (h + 0.5) * cellW}
                      y2={rowBot}
                      stroke="#8AAABF"
                      strokeWidth={0.6}
                    />,
                    <line
                      key={`${h}-${rowIdx}-45`}
                      x1={LABEL_W + (h + 0.75) * cellW}
                      y1={rowBot - ROW_H * 0.3}
                      x2={LABEL_W + (h + 0.75) * cellW}
                      y2={rowBot}
                      stroke="#8AAABF"
                      strokeWidth={0.5}
                    />,
                  ];
                })}
            </g>
          ))}

          {hours.map((h) => {
            const x = LABEL_W + h * cellW;
            if (h === 0 || h === 24)
              return (
                <g key={`t${h}`}>
                  <text
                    x={x}
                    y={HEADER_H - 13}
                    fontSize={8}
                    fill="#3A5A78"
                    textAnchor="middle"
                    fontFamily="Arial,sans-serif"
                    fontWeight="bold"
                  >
                    Mid-
                  </text>
                  <text
                    x={x}
                    y={HEADER_H - 5}
                    fontSize={8}
                    fill="#3A5A78"
                    textAnchor="middle"
                    fontFamily="Arial,sans-serif"
                    fontWeight="bold"
                  >
                    night
                  </text>
                </g>
              );
            return (
              <text
                key={`t${h}`}
                x={x}
                y={HEADER_H - 6}
                fontSize={9}
                fill="#3A5A78"
                textAnchor="middle"
                fontFamily="Arial,sans-serif"
                fontWeight="normal"
              >
                {h === 12 ? "Noon" : h}
              </text>
            );
          })}

          {hours.map((h) => {
            const x = LABEL_W + h * cellW;
            const yBase = HEADER_H + ROW_H * 4;
            if (h === 0 || h === 24)
              return (
                <g key={`b${h}`}>
                  <text
                    x={x}
                    y={yBase + 10}
                    fontSize={8}
                    fill="#3A5A78"
                    textAnchor="middle"
                    fontFamily="Arial,sans-serif"
                    fontWeight="bold"
                  >
                    Mid-
                  </text>
                  <text
                    x={x}
                    y={yBase + 18}
                    fontSize={8}
                    fill="#3A5A78"
                    textAnchor="middle"
                    fontFamily="Arial,sans-serif"
                    fontWeight="bold"
                  >
                    night
                  </text>
                </g>
              );
            return (
              <text
                key={`b${h}`}
                x={x}
                y={yBase + 14}
                fontSize={9}
                fill="#3A5A78"
                textAnchor="middle"
                fontFamily="Arial,sans-serif"
                fontWeight="normal"
              >
                {h === 12 ? "Noon" : h}
              </text>
            );
          })}

          {ROW_LABELS.map((label, i) => (
            <g key={i}>
              <text
                x={6}
                y={HEADER_H + i * ROW_H + ROW_H / 2 + (ROW_SUBS[i] ? -3 : 4)}
                fontSize={9}
                fill="#1B3A5C"
                textAnchor="start"
                fontFamily="Arial,sans-serif"
                fontWeight="bold"
              >
                {label}
              </text>
              {ROW_SUBS[i] && (
                <text
                  x={6}
                  y={HEADER_H + i * ROW_H + ROW_H / 2 + 9}
                  fontSize={8}
                  fill="#4A6A88"
                  textAnchor="start"
                  fontFamily="Arial,sans-serif"
                >
                  {ROW_SUBS[i]}
                </text>
              )}
            </g>
          ))}

          <polyline
            points={polyline}
            fill="none"
            stroke="#0A1A2C"
            strokeWidth={3.5}
            strokeLinejoin="miter"
            strokeLinecap="square"
          />
        </svg>
      </div>

      <div
        style={{
          display: "flex",
          borderTop: "1px solid #B8C8DC",
          background: "#F4F8FC",
        }}
      >
        {[
          { label: "Off duty", val: offDutyHrs },
          { label: "Sleeper berth", val: sleeperHrs },
          { label: "Driving", val: log.driving_hours },
          { label: "On duty (not drv)", val: onDutyHrs },
          { label: "Total on-duty", val: log.on_duty_hours, bold: true },
        ].map(({ label, val, bold }) => (
          <div
            key={label}
            style={{
              flex: 1,
              padding: "6px 10px",
              borderRight: "1px solid #D0DDE8",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: 10, color: "#5A7A98", marginBottom: 2 }}>
              {label}
            </div>
            <div
              style={{
                fontSize: 14,
                fontWeight: bold ? 700 : 600,
                color: bold ? "#1B3A5C" : "#2A5070",
                fontFamily: "monospace",
              }}
            >
              {Number(val).toFixed(1)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
