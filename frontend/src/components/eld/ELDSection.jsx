import SectionHeader from "../common/SectionHeader";
import ELDTabs from "./ELDTabs";

const gridIcon = (
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
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <line x1="3" y1="9" x2="21" y2="9" />
    <line x1="3" y1="15" x2="21" y2="15" />
    <line x1="9" y1="3" x2="9" y2="21" />
  </svg>
);

export default function ELDSection({ dailyLogs }) {
  return (
    <div
      style={{
        background: "#fff",
        border: "1px solid #C8D8E8",
        borderRadius: 8,
        overflow: "hidden",
        marginBottom: 12,
      }}
    >
      <SectionHeader
        icon={gridIcon}
        title="ELD Daily Log Sheets"
        subtitle="Record of Duty Status"
      />
      <ELDTabs logs={dailyLogs} />
    </div>
  );
}
