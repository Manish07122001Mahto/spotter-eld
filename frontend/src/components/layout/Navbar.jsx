import { useState } from "react";

export default function Navbar() {
  const [profileHovered, setProfileHovered] = useState(false);

  return (
    <nav
      className="navbar-inner"
      style={{
        background: "#1B3A5C",
        borderBottom: "3px solid #E8C84A",
        height: 52,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#FBBF24"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="1" y="3" width="15" height="13" rx="1" />
          <path d="M16 8h4l3 5v3h-7V8z" />
          <circle cx="5.5" cy="18.5" r="2.5" />
          <circle cx="18.5" cy="18.5" r="2.5" />
        </svg>
        <span
          style={{
            color: "#fff",
            fontWeight: 700,
            fontSize: 15,
            letterSpacing: 0.5,
          }}
        >
          ELD Trip Planner
        </span>
      </div>

      <div
        onMouseEnter={() => setProfileHovered(true)}
        onMouseLeave={() => setProfileHovered(false)}
        style={{
          width: 36,
          height: 36,
          borderRadius: "50%",
          border: `1.5px solid ${profileHovered ? "#7AA8CC" : "#4A7AA0"}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
        }}
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#7AA8CC"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      </div>
    </nav>
  );
}
