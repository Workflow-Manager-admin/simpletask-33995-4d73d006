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

// Demo/mock notification data
let notifDb = [
  {
    id: 9901,
    text: "🎉 You unlocked premium welcome banner!",
    date: "Today",
    read: false,
  },
  {
    id: 9902,
    text: "🔔 Tasks support batch operations soon.",
    date: "1d ago",
    read: true,
  },
  {
    id: 9903,
    text: "📅 Don’t forget to complete your first task.",
    date: "2d ago",
    read: false,
  },
];

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

/**
 * Fetch notifications (demo/mock)
 * Simulates latency and occasional network error
 * Returns [{id, text, date, read}]
 */
// PUBLIC_INTERFACE
export async function fetchNotifications() {
  // 15% chance to fail, for demo polish
  return simulateDelay([...notifDb], true);
}

/**
 * Fetch productivity statistics.
 * Simulates delay and random errors, generates plausible premium stats.
 * Returns: {tasksCompleted, pomodoros, insights, last5Days: [{day, value}]}
 */
// PUBLIC_INTERFACE
export async function fetchStats() {
  // 12% chance to fail
  function sample(arr) { return arr[Math.floor(Math.random()*arr.length)]; }
  const insightsArr = [
    "You complete 95% of tasks on Mondays! 🚀",
    "Afternoon Pomodoros boost your focus by 38%",
    "You're 24% faster than last week 🔥",
    "You haven't missed your daily target this week!",
    "Great job, you completed a tough task streak!",
    "Every task marked done is a step forward 🌱"
  ];
  const res = {
    tasksCompleted: 13 + Math.floor(Math.random()*15),
    pomodoros: 10 + Math.floor(Math.random()*15),
    insights: sample(insightsArr),
    last5Days: Array.from({length: 5}, (_,i) => ({
      day: ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"][(new Date().getDay()+i)%7],
      value: Math.max(2, Math.floor(Math.random()*8+2))
    }))
  };
  return simulateDelay(res, true);
}

// PUBLIC_INTERFACE
export async function deleteTask(id) {
  // DELETE /tasks/:id
  const found = tasksDb.find(t => t.id === id);
  tasksDb = tasksDb.filter(task => task.id !== id);
  return simulateDelay(found || { id });
}
