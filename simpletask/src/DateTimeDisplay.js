import React, { useEffect, useState } from "react";

// PUBLIC_INTERFACE
/**
 * Digital clock and today's date component (live updating).
 * Format: 'Wednesday, March 13 · 2:34 PM'
 */
function DateTimeDisplay() {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    // Update every 10 seconds (saves energy, still shows clock as "real-time")
    const interval = setInterval(() => {
      setNow(new Date());
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  // Format: 'Wednesday, March 13 · 2:34 PM'
  const formatted = now.toLocaleString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  // Insert a '·' separator (the format above usually gives 'Wednesday, March 13, 2:34 PM')
  const parts = formatted.replace(",", "").split(" ");
  const formattedDateTime = `${parts[0]}, ${parts[1]} ${parts[2]} · ${parts.slice(3).join(" ")}`;

  return (
    <div
      className="datetime-display"
      aria-label="Current date and time"
      style={{
        marginLeft: 14,
        fontWeight: 500,
        color: "var(--text-secondary)",
        fontSize: "1.07rem",
        background: "rgba(23,32,33,0.35)",
        borderRadius: 8,
        padding: "6px 14px",
        letterSpacing: "0.01em",
        boxShadow: "0 1px 4px #0e162455",
        minWidth: 200,
        textAlign: "center",
        userSelect: "none"
      }}
    >
      {formattedDateTime}
    </div>
  );
}

export default DateTimeDisplay;
