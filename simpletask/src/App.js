import React, { useState, useRef } from "react";
import "./App.css";

// PUBLIC_INTERFACE
function App() {
  // State for tasks
  const [tasks, setTasks] = useState([
    // Example initial data (empty list by default)
    // { id: 1, text: "Try adding a new task!", completed: false },
  ]);
  const [input, setInput] = useState("");
  const inputRef = useRef(null);

  // Add task -- triggered by button or optional "+" in header
  // PUBLIC_INTERFACE
  const handleAddTask = () => {
    const trimmed = input.trim();
    if (trimmed) {
      setTasks([
        ...tasks,
        { id: Date.now(), text: trimmed, completed: false }
      ]);
      setInput("");
      // Optional: return focus to input
      inputRef.current?.focus();
    }
  };

  // PUBLIC_INTERFACE
  const handleDeleteTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  // PUBLIC_INTERFACE
  const handleToggleTask = (id) => {
    setTasks(
      tasks.map((task) =>
        task.id === id
          ? { ...task, completed: !task.completed }
          : task
      )
    );
  };

  // Enter key in input = add task
  // PUBLIC_INTERFACE
  const handleInputKeyDown = (e) => {
    if (e.key === "Enter") handleAddTask();
  };

  const remainingTasks = tasks.filter(t => !t.completed).length;

  return (
    <div className="app" style={{ background: "var(--base-dark)" }}>
      {/* Header */}
      <header
        className="taskapp-header"
        style={{
          padding: "32px 0 16px",
          background: "var(--base-dark)",
          boxShadow: "0 1px 8px rgba(0,0,0,0.03)",
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
              minHeight: 48
            }}
          >
            {/* Title */}
            <h1
              style={{
                flex: 1,
                textAlign: "center",
                fontWeight: 700,
                fontSize: "2.2rem",
                margin: 0,
                fontFamily:
                  "'Inter','Roboto','Helvetica','Arial',sans-serif"
              }}
            >
              My Tasks
            </h1>
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
                zIndex: 2
              }}
              onClick={handleAddTask}
              disabled={!input.trim()}
              tabIndex={0}
            >
              +
            </button>
          </div>
        </div>
      </header>

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
          {/* Add Task Input */}
          <div
            className="task-input-row"
            style={{
              display: "flex",
              gap: 8,
              alignItems: "center",
              margin: "0 auto 32px",
              background: "white",
              borderRadius: 12,
              boxShadow: "0 2px 14px rgba(0,0,0,0.07)",
              padding: "8px 12px",
              minHeight: 52,
              maxWidth: 460
            }}
            >
            <input
              className="task-input"
              value={input}
              ref={inputRef}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleInputKeyDown}
              type="text"
              placeholder="Add a new task..."
              autoFocus
              style={{
                flex: 1,
                border: "none",
                outline: "none",
                fontSize: "1.08rem",
                background: "transparent",
                color: "#222",
                fontFamily:
                  "'Inter','Roboto','Helvetica','Arial',sans-serif",
                padding: "4px 8px"
              }}
              aria-label="Task input"
              maxLength={120}
            />
            <button
              className="btn"
              style={{
                background: "var(--base-light)",
                color: "#fff",
                borderRadius: 8,
                fontWeight: 600,
                fontSize: "1.1rem",
                padding: "8px 17px",
                border: "none",
                boxShadow: "0 1px 7px rgba(0,0,0,0.08)",
                transition: "opacity 0.18s",
                opacity: input.trim() ? 1 : 0.65,
                cursor: input.trim() ? "pointer" : "not-allowed"
              }}
              onClick={handleAddTask}
              disabled={!input.trim()}
              aria-label="Add Task"
              type="button"
            >
              Add
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
            {tasks.length === 0 && (
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
            )}

            {tasks.map((task) => (
              <li key={task.id}>
                <div
                  className="task-card"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    background: "#fff",
                    borderRadius: 11,
                    boxShadow: "0 1px 10px rgba(0,0,0,0.08)",
                    padding: "10px 14px",
                    minHeight: 46,
                    position: "relative",
                    transition: "box-shadow 0.15s"
                  }}
                >
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => handleToggleTask(task.id)}
                    style={{
                      width: 22,
                      height: 22,
                      marginRight: 14,
                      accentColor: "var(--base-light)",
                      cursor: "pointer"
                    }}
                    aria-label={`Mark task "${task.text}" as complete`}
                  />
                  <span
                    style={{
                      flex: 1,
                      fontSize: "1.09rem",
                      color: "#153",
                      fontFamily:
                        "'Inter','Roboto','Helvetica','Arial',sans-serif",
                      textDecoration: task.completed
                        ? "line-through"
                        : undefined,
                      opacity: task.completed ? 0.54 : 1,
                      transition: "opacity 0.13s"
                    }}
                  >
                    {task.text}
                  </span>
                  {/* Delete icon */}
                  <button
                    onClick={() => handleDeleteTask(task.id)}
                    aria-label="Delete task"
                    title="Delete"
                    type="button"
                    style={{
                      background: "none",
                      border: "none",
                      borderRadius: "50%",
                      width: 36,
                      height: 36,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#ff5252",
                      fontSize: "1.25rem",
                      marginLeft: 4,
                      cursor: "pointer",
                      transition: "background 0.15s"
                    }}
                  >
                    {/* Simple SVG trash icon */}
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
            ))}
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
