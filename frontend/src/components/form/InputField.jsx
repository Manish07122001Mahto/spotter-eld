import { useState } from "react";

export default function InputField({
  name,
  label,
  placeholder,
  value,
  onChange,
}) {
  const [focused, setFocused] = useState(false);

  return (
    <div>
      <label
        style={{
          display: "block",
          fontSize: 12,
          fontWeight: 700,
          color: "#4A6A88",
          textTransform: "uppercase",
          letterSpacing: 0.5,
          marginBottom: 6,
        }}
      >
        {label}
      </label>
      <input
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          width: "100%",
          padding: "9px 11px",
          border: `1px solid ${focused ? "#1B3A5C" : "#B8CCDC"}`,
          borderRadius: 5,
          fontSize: 14,
          color: "#1B2A3A",
          background: "#F8FBFD",
          outline: "none",
          boxSizing: "border-box",
        }}
      />
    </div>
  );
}
