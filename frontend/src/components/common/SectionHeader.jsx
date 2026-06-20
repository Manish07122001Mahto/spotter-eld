export default function SectionHeader({ icon, title, subtitle }) {
  return (
    <div
      style={{
        background: "#EEF4FB",
        borderBottom: "1px solid #C8D8E8",
        padding: "10px 20px",
        display: "flex",
        alignItems: "center",
        gap: 8,
      }}
    >
      {icon}
      <span
        style={{
          fontWeight: 700,
          fontSize: 12,
          color: "#1B3A5C",
          textTransform: "uppercase",
          letterSpacing: 0.5,
        }}
      >
        {title}
      </span>
      {subtitle && (
        <span style={{ fontSize: 11, color: "#7AA8CC", marginLeft: 6 }}>
          {subtitle}
        </span>
      )}
    </div>
  );
}
