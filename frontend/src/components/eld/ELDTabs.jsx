import { useState } from "react";
import ELDGrid from "./ELDGrid";

export default function ELDTabs({ logs }) {
  const [activeDay, setActiveDay] = useState(logs[0]?.day ?? 1);
  const activeLog = logs.find((l) => l.day === activeDay);

  return (
    <div>
      <div
        style={{
          display: "flex",
          borderBottom: "1px solid #C8D8E8",
          background: "#F4F8FC",
        }}
      >
        {logs.map((log) => {
          const isActive = log.day === activeDay;
          return (
            <button
              key={log.day}
              onClick={() => setActiveDay(log.day)}
              onMouseEnter={(e) => {
                if (!isActive) e.currentTarget.style.color = "#1B3A5C";
              }}
              onMouseLeave={(e) => {
                if (!isActive) e.currentTarget.style.color = "#6A8AA8";
              }}
              style={{
                padding: "10px 20px",
                fontSize: 13,
                fontWeight: isActive ? 700 : 500,
                color: isActive ? "#1B3A5C" : "#6A8AA8",
                background: isActive ? "#fff" : "transparent",
                border: "none",
                borderBottom: isActive
                  ? "2px solid #1B3A5C"
                  : "2px solid transparent",
                cursor: "pointer",
                letterSpacing: 0.3,
                transition: "all 0.15s",
              }}
            >
              Day {log.day}
            </button>
          );
        })}
      </div>
      <div style={{ padding: "16px 20px" }}>
        {activeLog && <ELDGrid key={activeLog.day} log={activeLog} />}
      </div>
    </div>
  );
}
