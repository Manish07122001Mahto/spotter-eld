export default function Footer() {
  return (
    <footer
      style={{
        borderTop: "1px solid #D8E4EE",
        background: "#F8FBFD",
        padding: "14px 32px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: 8,
      }}
    >
      <span style={{ fontSize: 12, color: "#7A9AB8" }}>
        © {new Date().getFullYear()} ELD Trip Planner
      </span>
    </footer>
  );
}
