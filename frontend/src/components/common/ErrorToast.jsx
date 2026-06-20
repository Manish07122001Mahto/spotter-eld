import { useEffect, useState } from "react";

export default function ErrorToast({ message, onDismiss }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!message) return;
    setVisible(true);
    const hide = setTimeout(() => setVisible(false), 5000);
    const clear = setTimeout(onDismiss, 5350);
    return () => {
      clearTimeout(hide);
      clearTimeout(clear);
    };
  }, [message]);

  if (!message) return null;

  return (
    <>
      <style>{`
        @keyframes slideIn  { from { transform: translateX(120%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
        @keyframes slideOut { from { transform: translateX(0); opacity: 1; } to { transform: translateX(120%); opacity: 0; } }
      `}</style>
      <div
        style={{
          position: "fixed",
          bottom: 28,
          right: 28,
          zIndex: 9999,
          maxWidth: 380,
          background: "#fff",
          border: "1px solid #E8C8C8",
          borderLeft: "4px solid #B22222",
          borderRadius: 8,
          boxShadow: "0 4px 20px rgba(0,0,0,0.12)",
          display: "flex",
          alignItems: "flex-start",
          gap: 12,
          padding: "14px 16px",
          animation: `${visible ? "slideIn" : "slideOut"} 0.35s ease forwards`,
        }}
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#B22222"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ flexShrink: 0, marginTop: 1 }}
        >
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
        <div style={{ flex: 1 }}>
          <div
            style={{
              fontSize: 12,
              fontWeight: 700,
              color: "#B22222",
              marginBottom: 3,
            }}
          >
            Error
          </div>
          <div style={{ fontSize: 13, color: "#3A2020", lineHeight: 1.5 }}>
            {message}
          </div>
        </div>
        <button
          onClick={() => {
            setVisible(false);
            setTimeout(onDismiss, 350);
          }}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: 0,
            color: "#9A7A7A",
            lineHeight: 1,
            marginTop: 1,
          }}
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>
    </>
  );
}
