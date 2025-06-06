import React, { useEffect, useState } from "react";
import { fetchStats } from "./api";

// PUBLIC_INTERFACE
/**
 * StatisticsSidebar:
 * - Premium flyout/modal for stats
 * - Animated counters for tasks, Pomodoros, insights
 * - Loading, error, and success UI
 * - Premium styling, responsive, animated fly-in/out
 */
function StatisticsSidebar({ open, onClose }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    if (!open) return;
    setLoading(true);
    setError(null);
    setStats(null);
    fetchStats()
      .then(data => {
        setStats(data);
        setError(null);
      })
      .catch(e => setError(e.message || "Couldn't fetch stats."))
      .finally(() => setLoading(false));
  }, [open]);

  // Focus trap + close ESC
  useEffect(() => {
    if (!open) return;
    function handleEsc(e) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [open, onClose]);

  // Animated Counter
  function AnimatedCounter({ value, duration = 750 }) {
    const [val, setVal] = useState(0);
    useEffect(() => {
      if (!open) return;
      let start = 0;
      const delta = value - start;
      let t0 = null, raf;
      function animate(ts) {
        if (t0 === null) t0 = ts;
        const progress = Math.min((ts - t0) / duration, 1);
        setVal(Math.round(start + delta * progress));
        if (progress < 1) raf = requestAnimationFrame(animate);
        else setVal(value);
      }
      raf = requestAnimationFrame(animate);
      return () => cancelAnimationFrame(raf);
    }, [value, open]);
    return <span className="stat-counter">{val}</span>;
  }

  return (
    <aside className={`stats-sidebar${open ? " open" : ""}`} role="dialog" aria-modal="true" tabIndex={-1}>
      <button
        className="stats-sidebar-close"
        aria-label="Close"
        onClick={onClose}
        tabIndex={0}
      >
        ×
      </button>
      <h2 className="stats-sidebar-title">Productivity Stats</h2>
      <div className="stats-sidebar-content">
        {loading ? (
          <div className="stats-loader">
            <span className="stats-spin" /> Loading stats...
          </div>
        ) : error ? (
          <div className="stats-error">
            <span role="img" aria-label="Error" style={{marginRight:5}}>⚠️</span>
            {error}
          </div>
        ) : stats ? (
          <div className="stats-panels">
            <div className="stat-panel stat-panel-tasks">
              <div className="stat-label">Tasks Completed</div>
              <AnimatedCounter value={stats.tasksCompleted} />
            </div>
            <div className="stat-panel stat-panel-pomodoro">
              <div className="stat-label">Pomodoro Sessions</div>
              <AnimatedCounter value={stats.pomodoros} />
            </div>
            <div className="stat-panel stat-panel-insight">
              <div className="stat-label">Insight</div>
              <div className="stat-insight">{stats.insights}</div>
            </div>
            <div className="stat-mini-bar">
              <MiniBarChart bars={stats.last5Days} />
            </div>
          </div>
        ) : (
          <div style={{color:"var(--text-secondary)", opacity:0.8, margin:"16px 0"}}>[No Data]</div>
        )
        }
      </div>
      {/* Styles for visual polish */}
      <style>{`
        .stats-sidebar {
          position: fixed;
          right: -410px;
          top: 0;
          width: 370px;
          max-width: 97vw;
          height: 100vh;
          background: linear-gradient(94deg,var(--card-bg) 60%,#174168 100%);
          border-left: 3.5px solid var(--accent);
          box-shadow: -2px 0 40px #23b7f044, -1px 0 16px #17588d55;
          z-index: 111;
          color: var(--text-color);
          transition: right 0.45s cubic-bezier(.69,.04,.23,1.12), box-shadow 0.28s;
          padding: 0 0 0 0;
          display: flex;
          flex-direction: column;
          opacity: 0.95;
        }
        .stats-sidebar.open {
          right: 0;
          opacity: 1;
        }
        .stats-sidebar-close {
          position: absolute;
          top: 10px;
          right: 14px;
          border: none;
          background: none;
          color: var(--accent);
          font-weight: bold;
          font-size: 2.3rem;
          line-height: 1.1;
          cursor: pointer;
          z-index: 2;
          padding: 4px 8px;
          border-radius: 8px;
          transition: background 0.13s;
        }
        .stats-sidebar-close:hover {
          background: #253e6159;
        }
        .stats-sidebar-title {
          text-align: left;
          margin: 42px 0 22px 35px;
          font-size: 1.68rem;
          font-weight: 700;
          color: var(--accent);
          text-shadow: 0 2px 16px #23b7f044;
          letter-spacing: .012em;
        }
        .stats-sidebar-content {
          flex: 1;
          padding: 0 32px 20px 35px;
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
        }
        .stats-loader {
          color: var(--accent);
          font-size: 1.11rem;
          margin-top: 42px;
          display: flex;
          align-items: center;
          gap: 11px;
        }
        .stats-error {
          background: #312227;
          border: 1.7px solid #e8544f;
          color: #f74b56;
          border-radius: 11px;
          margin: 32px 0;
          padding: 13px 18px;
          font-weight: 540;
          font-size: 1.05rem;
        }
        .stat-panels {
          display: flex;
          flex-direction: column;
          gap: 22px;
          margin-top: 5px;
          align-items: start;
        }
        .stat-panel {
          background: linear-gradient(92deg,#2d323d 56%,var(--accent) 200%);
          border-radius: 14px;
          box-shadow: 0 3px 18px #0877f022;
          padding: 14px 19px 10px 17px;
          margin-right: 24px;
          min-width: 0;
          min-height: 60px;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
        }
        .stat-panel-tasks {
          border-left: 6px solid var(--accent);
        }
        .stat-panel-pomodoro {
          border-left: 6px solid #f5a350;
        }
        .stat-panel-insight {
          border-left: 6px solid #1af285;
        }
        .stat-label {
          color: var(--text-secondary);
          font-size: 1.09rem;
          margin-bottom: 3px;
        }
        .stat-counter {
          font-size: 2.14rem;
          font-weight: 750;
          color: var(--accent);
          text-shadow: 0 3.5px 15px #229cff33;
          line-height: 1.2;
          letter-spacing: 0.025em;
          transition: color 0.16s;
        }
        .stat-insight {
          color: #1af285;
          letter-spacing: 0.012em;
          font-size: 1.13rem;
          font-weight: 650;
          margin-top: 2px;
        }
        .stats-spin {
          width: 24px; height: 24px;
          border: 3px solid #23b7f033;
          border-top: 3px solid var(--accent);
          border-radius: 50%;
          display: inline-block;
          animation: notif-spin 0.9s linear infinite;
          vertical-align: middle;
        }
        .stat-mini-bar {
          margin-top: 23px;
          width: 98%;
          max-width: 270px;
          min-height: 38px;
        }
        @keyframes notif-spin {
          0% { transform: rotate(0); }
          100% { transform: rotate(360deg);}
        }
        @media (max-width:670px) {
          .stats-sidebar {
            width: 96vw;
            max-width: 98vw;
            right: -101vw;
            font-size: 0.94em;
          }
          .stats-sidebar.open {
            right: 0;
          }
          .stats-sidebar-title, .stats-sidebar-content {
            margin-left: 6vw;
            padding-left: 7vw;
          }
        }
      `}</style>
    </aside>
  );
}

// Minimal animated bar chart for 5 days
function MiniBarChart({ bars }) {
  // bars: [{day, value}]
  const max = Math.max(...bars.map(b=>b.value), 1);
  return (
    <svg width="100%" height="36" viewBox="0 0 120 36" style={{overflow:"visible"}}>
      {bars.map((bar, i) => (
        <g key={i}>
          <rect
            x={8 + i*22}
            y={36 - (28*Math.max(bar.value,1)/max)}
            width={14}
            rx={4}
            height={28*Math.max(bar.value,1)/max}
            fill={i===bars.length-1 ? "var(--accent)" : "#257fdc"}
            style={{transition:"height 0.75s cubic-bezier(.55,.04,.28,.98)"}}
          />
          <text
            x={15 + i*22}
            y={34}
            fontSize="8"
            textAnchor="middle"
            fill="var(--text-secondary)"
          >
            {bar.day}
          </text>
        </g>
      ))}
    </svg>
  );
}

export default StatisticsSidebar;
