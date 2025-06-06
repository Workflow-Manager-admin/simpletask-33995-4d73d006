//
// Mock async API for core task CRUD operations
// Simulates real network/API for demo/development with in-memory data and artificial delays.
//

let tasksDb = [
  // Optional: initial dummy data (empty on app start)
];

// Mock user profile data
const mockUserProfile = {
  username: "Alexandra Rivers",
  avatar: "https://randomuser.me/api/portraits/women/68.jpg"
};

let nextId = 1;

// PUBLIC_INTERFACE
/**
 * Simulate network latency and optional error.
 * @param {*} data Data to resolve.
 * @param {boolean} shouldFail Whether to randomly fail (for error simulation).
 * @returns {Promise<any>}
 */
function simulateDelay(data, shouldFail = false) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (shouldFail && Math.random() < 0.1) {
        reject(new Error("Simulated network error!"));
      } else {
        resolve(data);
      }
    }, 450 + Math.random() * 500); // 450-950ms delay
  });
}

// PUBLIC_INTERFACE
/**
 * Fetch the user's profile (mock API).
 * Simulates network latency and occasional errors for premium polish.
 * Returns: { username: string, avatar?: string }
 */
export async function fetchUserProfile() {
  // 10% chance to fail, to demonstrate error handling
  return simulateDelay({ ...mockUserProfile }, true);
}

export async function fetchTasks() {
  // GET /tasks
  return simulateDelay([...tasksDb]);
}

// PUBLIC_INTERFACE
export async function addTask(text) {
  // POST /tasks
  const task = { id: nextId++, text, completed: false };
  tasksDb = [...tasksDb, task];
  return simulateDelay(task);
}

// PUBLIC_INTERFACE
export async function updateTask(id, updates) {
  // PUT /tasks/:id
  let updatedTask;
  tasksDb = tasksDb.map(task => {
    if (task.id === id) {
      updatedTask = { ...task, ...updates };
      return updatedTask;
    }
    return task;
  });
  return simulateDelay(updatedTask);
}

// PUBLIC_INTERFACE
export async function deleteTask(id) {
  // DELETE /tasks/:id
  const found = tasksDb.find(t => t.id === id);
  tasksDb = tasksDb.filter(task => task.id !== id);
  return simulateDelay(found || { id });
}
