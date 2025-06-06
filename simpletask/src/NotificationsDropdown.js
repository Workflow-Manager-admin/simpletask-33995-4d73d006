import React, { useState, useRef, useEffect } from "react";
import { fetchNotifications } from "./api";

/**
 * NotificationsDropdown
 * - Renders a premium-style bell button with animated unread badge
 * - Clicking bell fetches notifications via async API (loading+error states)
 * - Responsive dropdown panel, closes on outside click/ESC
 * - Premium animation for dropdown/panel, lively badge, and luxury-palette
 * - Designed for minimal dependencies & no UI kits.
 */

// PUBLIC_INTERFACE
function NotificationsDropdown() {
  // State managed here (unread, open, fetched data, error)
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const btnRef = useRef(null);
  const dropdownRef = useRef(null);

  // Stylized bell with badge
  useEffect(() => {
    // Close on outside click/esc
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target) &&
          btnRef.current && !btnRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    function handleEsc(e) {
      if (e.key === "Escape") setOpen(false);
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEsc);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEsc);
    };
  }, [open]);

  // Fetch notifications when opening (only fetch again on explicit open)
  useEffect(() => {
    if (open) {
      setLoading(true);
      setError(null);
      fetchNotifications()
        .then(data => {
          setNotifications(data);
          setUnreadCount(data.filter(n => !n.read).length);
          setError(null);
        })
        .catch(e => setError(e.message || "Couldn't fetch notifications."))
        .finally(() => setLoading(false));
    }
  }, [open]);

  // Handlers
  function handleBellClick() {
    setOpen((prev) => !prev);
    // Reset unread when opening dropdown and fetching (for demonstration)
    // This mimics marking notifications as read on open
    if (!open) setUnreadCount(0);
  }

  // Animation/Panel classes
  const dropdownClass =
    "notifications-dropdown-panel" +
    (open ? " open" : "");

  // Bell SVG for premium look
  function BellIcon({filled = false, animated = false}) {
    return (
      <svg
        width="27"
        height="27"
        viewBox="0 0 26 26"
        fill="none"
        style={{
          transition: "transform 0.16s cubic-bezier(.45,1.08,.27,.95)",
          transform: animated && open ? "rotate(-15deg) scale(1.06)" : "none"
        }}
        aria-hidden="true"
      >
        <path
          d="M13 23c1.38 0 2.5-1.12 2.5-2.5h-5c0 1.38 1.12 2.5 2.5 2.5Zm8.66-6.84c-.77-.8-2.13-2-2.13-6.16 0-3.73-2.61-6.73-6.03-7.32V2.5a1.5 1.5 0 1 0-3 0v.18C6.47 3.11 3.86 6.11 3.86 9.84c0 4.16-1.36 5.36-2.13 6.16a1.25 1.25 0 0 0 .94 2.15h17.7a1.25 1.25 0 0 0 .94-2.15ZM4.56 17.52h16.87c.1.15.16.33.16.52 0 .69-.56 1.25-1.25 1.25H5.64a1.25 1.25 0 0 1-1.25-1.25c0-.19.06-.37.17-.52Z"
          fill={filled ? "var(--accent)" : "var(--text-secondary)"}
          stroke="var(--accent)"
          strokeWidth="1.21"
        />
      </svg>
    );
  }

  // Premium dropdown
  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      <button
        ref={btnRef}
        className="notif-bell-btn"
        aria-label="Notifications"
        aria-haspopup="true"
        aria-expanded={open}
        onClick={handleBellClick}
        style={{
          background: "var(--card-bg)",
          borderRadius: "50%",
          width: 48,
          height: 48,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          border: "2.5px solid var(--accent)",
          boxShadow: open
            ? "0 2px 20px #129acf61, 0 1px 8px #17488e22"
            : "0 1px 5px #20234c33",
          cursor: "pointer",
          transition: "box-shadow 0.22s",
          outline: open ? "2.5px solid var(--base-light)" : "none",
          position: "relative",
        }}
      >
        <BellIcon animated={true} />
        {unreadCount > 0 && (
          <span className="notif-unread-badge" aria-label={`${unreadCount} unread`}>
            {unreadCount>9 ? "9+" : unreadCount}
          </span>
        )}
      </button>
      {/* The Dropdown Panel */}
      <div
        ref={dropdownRef}
        className={dropdownClass}
        role="menu"
        tabIndex={-1}
        aria-label="Notifications"
        style={{
          display: open ? "block" : "none",
          position: "absolute",
          top: "120%",
          right: 0,
          minWidth: 290,
          maxWidth: 340,
          background: "linear-gradient(99deg,var(--card-bg),#193847 85%)",
          borderRadius: 18,
          border: "2.5px solid var(--accent)",
          boxShadow:
            "0 12px 48px #129acf44, 0 2px 24px #25aef022",
          zIndex: 91,
          padding: "0 0 0 0",
          animation: open
            ? "notif-dropdown-fadein 0.32s cubic-bezier(.87,.01,.19,.96)"
            : "none",
        }}
      >
        <div style={{
          fontWeight: 700,
          fontSize: "1.09rem",
          color: "var(--accent)",
          borderBottom: "1px solid var(--border-color)",
          padding: "15px 24px 9px 22px",
          letterSpacing: "0.02em"
        }}>
          Notifications
        </div>
        <div style={{ maxHeight: 325, overflowY: "auto" }}>
          {loading ? (
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "20px 22px 23px",
              color: "var(--text-secondary)",
              fontSize: "1.10rem"
            }}>
              <span className="notif-loader" />
              Fetching notifications...
            </div>
          ) : error ? (
            <div style={{
              color: "#f74b62",
              background: "#2c1219",
              borderRadius: 12,
              padding: "18px",
              margin: "16px",
              fontWeight: 500,
              textAlign: "center",
              fontSize: "1.06rem"
            }}>
              <span role="img" aria-label="Error" style={{marginRight:6}}>⚠️</span>
              {error}
            </div>
          ) : notifications.length === 0 ? (
            <div style={{
              color: "var(--text-secondary)",
              opacity: 0.77,
              textAlign: "center",
              padding: "24px"
            }}>
              No notifications at this time.
            </div>
          ) : (
            <ul
              style={{
                listStyle: "none",
                margin: 0,
                padding: 0,
                display: "flex",
                flexDirection: "column",
                gap: 0,
              }}
            >
              {notifications.map((notif, idx) => (
                <li
                  key={notif.id}
                  style={{
                    background: notif.read
                      ? "transparent"
                      : "linear-gradient(97deg,#19537c22 23%,#245cae13 100%)",
                    fontWeight: notif.read ? 400 : 600,
                    color: notif.read ? "var(--text-secondary)" : "var(--accent)",
                    borderBottom: idx !== notifications.length - 1
                      ? "1px solid #1a2740"
                      : "none",
                    padding: "13px 22px 13px 26px",
                    fontSize: "1.01rem",
                    letterSpacing: ".01em",
                    transition: "background 0.14s"
                  }}
                >
                  {notif.text}
                  <span style={{
                    marginLeft: 9,
                    fontSize: "0.98em",
                    color: notif.read ? "var(--text-secondary)" : "var(--base-light)",
                  }}>
                    {notif.date}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      {/* Animations and styles - injected for premium look */}
      <style>{`
      .notif-unread-badge {
        position: absolute;
        top: 8px;
        right: 8px;
        background: linear-gradient(91deg,#f65815 65%,#e7671c 100%);
        color: #fff;
        font-size: 0.85em;
        font-weight: 800;
        min-width: 21px;
        min-height: 18px;
        padding: 2px 4.5px;
        border-radius: 10px;
        box-shadow: 0 2px 9px #ca661755;
        display: flex;
        align-items: center;
        justify-content: center;
        border: 1.5px solid #ffddcf;
        animation: notif-badge-bounce 0.85s cubic-bezier(.45,.88,.46,1.05) ${unreadCount>0 && open ? "1" : "infinite"};
      }
      @keyframes notif-badge-bounce {
        0%,100% { transform: scale(.92); }
        15% { transform: scale(1.20) translateY(-2px);}
        27% { transform: scale(.97) }
        47% { transform: scale(1.13);}
        80% { transform: scale(1);}
      }
      .notifications-dropdown-panel.open {
        opacity: 1;
        pointer-events: auto;
      }
      @keyframes notif-dropdown-fadein {
        from {
          opacity: 0;
          transform: translateY(18px) scale(0.98);
        }
        to {
          opacity: 1;
          transform: translateY(0) scale(1);
        }
      }
      .notif-loader {
        width: 24px;
        height: 24px;
        border: 3px solid #39bbff33;
        border-top: 3px solid var(--accent);
        border-radius: 50%;
        animation: notif-spin 0.9s linear infinite;
      }
      @keyframes notif-spin {
        0% { transform: rotate(0); }
        100% { transform: rotate(360deg);}
      }
      `}</style>
    </div>
  );
}

export default NotificationsDropdown;
