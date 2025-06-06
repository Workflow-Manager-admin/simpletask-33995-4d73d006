// Main app file now using async mock API for CRUD operations
import React, { useState, useRef, useEffect } from "react";
import "./App.css";
import DateTimeDisplay from "./DateTimeDisplay";
import PremiumWelcomeBanner from "./PremiumWelcomeBanner";
import NotificationsDropdown from "./NotificationsDropdown";
import {
  fetchTasks,
  addTask as apiAddTask,
  updateTask as apiUpdateTask,
  deleteTask as apiDeleteTask,
} from "./api";
/*
 * App component refactored for async API and CRUD state management.
 */
function App() {
  // Task state
  const [tasks, setTasks] = useState([]);
  // loading/error state for various actions
  const [loading, setLoading] = useState(false);
  const [adding, setAdding] = useState(false);
  const [actionError, setActionError] = useState(null);
  const [input, setInput] = useState("");
  const inputRef = useRef(null);

  // load tasks on first mount
  useEffect(() => {
    setLoading(true);
    setActionError(null);
    fetchTasks()
      .then(ts => setTasks(ts))
      .catch(e => setActionError(e.message || "Failed to load tasks."))
      .finally(() => setLoading(false));
  }, []);

  // PUBLIC_INTERFACE
  const handleAddTask = async () => {
    // Add via API (simulate)
    const trimmed = input.trim();
    if (!trimmed) return;
    setAdding(true);
    setActionError(null);
    try {
      const newTask = await apiAddTask(trimmed);
      setTasks(prev => [...prev, newTask]);
      setInput("");
      inputRef.current?.focus();
    } catch (e) {
      setActionError(e.message || "Failed to add task.");
    } finally {
      setAdding(false);
    }
  };

  // PUBLIC_INTERFACE
  const handleDeleteTask = async (id) => {
    setActionError(null);
    try {
      await apiDeleteTask(id);
      setTasks(ts => ts.filter(t => t.id !== id));
    } catch (e) {
      setActionError(e.message || "Failed to delete task.");
    }
  };

  // PUBLIC_INTERFACE
  const handleToggleTask = async (id) => {
    setActionError(null);
    try {
      // find task
      const task = tasks.find(t => t.id === id);
      if (!task) return;
      const updated = await apiUpdateTask(id, { completed: !task.completed });
      setTasks(ts =>
        ts.map(t => (t.id === id ? updated : t))
      );
    } catch (e) {
      setActionError(e.message || "Failed to update task.");
    }
  };

  // PUBLIC_INTERFACE
  const handleInputKeyDown = (e) => {
    if (e.key === "Enter" && input.trim() && !adding) handleAddTask();
  };

  const remainingTasks = tasks.filter(t => !t.completed).length;

  return (
    <div className="app">
      {/* Header */}
      <header
        className="taskapp-header"
        style={{
          padding: "32px 0 16px",
          background: "var(--base-dark)",
          boxShadow: "0 1px 8px #0e1624",
          position: "relative",
          zIndex: 2
        }}
      >
        <div className="container">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
              minHeight: 56,
              gap: 14,
              flexWrap: "wrap"
            }}
          >
            {/* Title */}
            <h1
              style={{
                flex: "1 1 auto",
                textAlign: "center",
                fontWeight: 700,
                fontSize: "2.2rem",
                margin: 0,
                fontFamily:
                  "'Inter','Roboto','Helvetica','Arial',sans-serif",
                whiteSpace: "nowrap"
              }}
            >
              My Tasks
            </h1>
            {/* Clock and Date, right of title */}
            <span
              style={{
                position: "absolute",
                right: 56,
                top: "50%",
                transform: "translateY(-50%)",
                zIndex: 1,
                display: "flex",
                alignItems: "center",
                gap: 12
              }}
            >
              {/* Notification Bell */}
              <span>
                <NotificationsDropdown />
              </span>
              <DateTimeDisplay />
            </span>
            {/* Optional + Button (top right) */}
            <button
              aria-label="Quick Add Task"
              title="Add"
              className="btn"
              type="button"
              style={{
                position: "absolute",
                right: 0,
                top: "50%",
                transform: "translateY(-50%)",
                fontWeight: "700",
                fontSize: "1.75rem",
                width: "48px",
                height: "48px",
                borderRadius: "50%",
                background: "var(--base-light)",
                color: "white",
                boxShadow: "0 1px 8px rgba(0,0,0,0.10)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 2,
                opacity: adding || !input.trim() ? 0.67 : 1,
                cursor: adding || !input.trim() ? "not-allowed" : "pointer"
              }}
              onClick={handleAddTask}
              disabled={adding || !input.trim()}
              tabIndex={0}
            >
              {adding ? (
                <span style={{ fontSize: "1rem" }}>...</span>
              ) : (
                "+"
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Premium Welcome Banner */}
      <PremiumWelcomeBanner />

      {/* Main Content */}
      <main>
        <section
          className="container"
          style={{
            marginTop: "40px",
            maxWidth: 500,
            width: "100%"
          }}
        >
          {/* Error banner */}
          {actionError && (
            <div
              style={{
                background: "#2a181c",
                color: "#ff4242",
                border: "1px solid #492a32",
                borderRadius: 8,
                padding: "10px 16px",
                marginBottom: 14,
                fontWeight: 500,
                textAlign: "center",
                boxShadow: "0 2px 8px #d3202050"
              }}
              role="alert"
              aria-live="assertive"
            >
              {actionError}
            </div>
          )}

          {/* Add Task Input */}
          <div className="task-input-row">
            <input
              className="task-input"
              value={input}
              ref={inputRef}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleInputKeyDown}
              type="text"
              placeholder="Add a new task..."
              autoFocus
              aria-label="Task input"
              maxLength={120}
              disabled={adding}
              style={{
                flex: 1
              }}
            />
            <button
              className="btn"
              onClick={handleAddTask}
              disabled={adding || !input.trim()}
              aria-label="Add Task"
              type="button"
              style={{
                opacity: adding || !input.trim() ? 0.65 : 1,
                cursor: adding || !input.trim() ? "not-allowed" : "pointer"
              }}
            >
              {adding ? "Adding..." : "Add"}
            </button>
          </div>

          {/* Task List */}
          <ul
            className="task-list"
            style={{
              listStyle: "none",
              padding: 0,
              margin: 0,
              display: "flex",
              flexDirection: "column",
              gap: 14,
              minHeight: 75
            }}
          >
            {loading ? (
              <li
                style={{
                  textAlign: "center",
                  color: "var(--text-secondary)",
                  fontSize: "1.06rem",
                  opacity: 0.62,
                  marginTop: 15
                }}
              >
                Loading tasks...
              </li>
            ) : tasks.length === 0 ? (
              <li
                style={{
                  textAlign: "center",
                  color: "var(--text-secondary)",
                  fontSize: "1.02rem",
                  letterSpacing: "0.03em",
                  margin: "0 auto",
                  opacity: 0.85
                }}
              >
                No tasks yet. Add your first task!
              </li>
            ) : (
              tasks.map((task) => (
                <li key={task.id}>
                  <div className="task-card">
                    <input
                      type="checkbox"
                      checked={!!task.completed}
                      onChange={() => handleToggleTask(task.id)}
                      aria-label={`Mark task "${task.text}" as complete`}
                      disabled={loading}
                    />
                    <span
                      className={`task-text${task.completed ? " completed" : ""}`}
                      style={{
                        transition: "opacity 0.13s"
                      }}
                    >
                      {task.text}
                    </span>
                    {/* Delete icon */}
                    <button
                      className="del-btn"
                      onClick={() => handleDeleteTask(task.id)}
                      aria-label="Delete task"
                      title="Delete"
                      type="button"
                      disabled={loading}
                      style={{
                        cursor: loading ? "not-allowed" : "pointer"
                      }}
                    >
                      <svg
                        width="22"
                        height="22"
                        fill="none"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path
                          d="M7 6V4a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v2m2 0H5m2 0h10M6 6v14a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V6"
                          stroke="#ff5252"
                          strokeWidth="1.6"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M9 10v6M15 10v6"
                          stroke="#ff5252"
                          strokeWidth="1.6"
                          strokeLinecap="round"
                        />
                      </svg>
                    </button>
                  </div>
                </li>
              ))
            )}
          </ul>

          {/* Optional Footer */}
          <footer
            className="task-footer"
            style={{
              marginTop: tasks.length ? 32 : 45,
              padding: "7px 0 20px",
              textAlign: "center",
              color: "var(--text-secondary)",
              fontSize: "1.02rem",
              letterSpacing: "0.01em"
            }}
          >
            {tasks.length > 0 &&
              (remainingTasks === 0 ? (
                <span>All tasks complete. 🎉</span>
              ) : (
                <span>
                  {remainingTasks} task
                  {remainingTasks > 1 ? "s" : ""} remaining
                </span>
              ))}
          </footer>
        </section>
      </main>
    </div>
  );
}

export default App;
