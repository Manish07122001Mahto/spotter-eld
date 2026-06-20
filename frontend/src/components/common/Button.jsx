import { useState } from "react";

export default function Button({ onClick, disabled, loading, children }) {
  const [hovered, setHovered] = useState(false);

  const bg = disabled ? "#7A9AB8" : hovered ? "#14304E" : "#1B3A5C";

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: bg,
        color: "#fff",
        border: "none",
        borderRadius: 5,
        padding: "9px 24px",
        fontSize: 13,
        fontWeight: 700,
        letterSpacing: 0.5,
        cursor: disabled ? "not-allowed" : "pointer",
      }}
    >
      {loading ? "Planning..." : children}
    </button>
  );
}
