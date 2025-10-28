// ===== DOM Elements =====

const domElements = {
  timerDisplay: document.getElementById("timer-display"),
  startBtn: document.getElementById("start"),
  pauseBtn: document.getElementById("pause"),
  continueBtn: document.getElementById("continue"),
  stopBtn: document.getElementById("stop"),
};

// ====== Variables/States =====

let variables = {
  seconds: 0,
  minutes: 0,
  hours: 0,
  interval: null,
  isRunning: false,
  sessions: [],
};

// ===== Initialize the App =====
function initializeApp() {
  console.log("Deep Focus Tracker App initialized 🚀");
  loadSessions();
  updateDisplay();
  updateSessionList();
  updateTodayStats();
  setupEventHandlers();
}

// ===== Function to update the display =====
function updateDisplay() {
  const s = String(variables.seconds).padStart(2, "0");
  const m = String(variables.minutes).padStart(2, "0");
  const h = String(variables.hours).padStart(2, "0");

  domElements.timerDisplay.textContent = `${h}:${m}:${s}`;
}

// ===== Function to start the timer =====
function startTimer() {
  if (variables.isRunning) return; // prevent double start
  variables.isRunning = true;

  variables.interval = setInterval(() => {
    variables.seconds++;
    if (variables.seconds === 60) {
      variables.seconds = 0;
      variables.minutes++;
      if (variables.minutes === 60) {
        variables.minutes = 0;
        variables.hours++;
      }
    }
    updateDisplay();
  }, 1000);
}

// ===== Function to pause =====
function pauseTimer() {
  if (!variables.isRunning) return;
  clearInterval(variables.interval);
  variables.isRunning = false;
}

// ===== Function to continue timer =====
function continueTimer() {
  if (!variables.isRunning) startTimer();
}

// ===== Function to stop the timer =====
function stopTimer() {
  if (!variables.isRunning) return;
  clearInterval(variables.interval);
  variables.isRunning = false;

  saveSessions(); // Save the session when user clicks “Stop”
  updateSessionList(); //
  updateTodayStats();
  resetTimer();
}

function resetTimer() {
  variables.seconds = 0;
  variables.minutes = 0;
  variables.hours = 0;

  updateDisplay();
}

// ===== Function to save sessions =====
function saveSessions() {
  const duration = `${String(variables.hours).padStart(2, "0")}:${String(
    variables.minutes
  ).padStart(2, "0")}:${String(variables.seconds).padStart(2, "0")}`;
  const date = new Date().toISOString();

  const session = { duration, date };
  variables.sessions.push(session);
  localStorage.setItem("sessions", JSON.stringify(variables.sessions));
  console.log(variables.sessions);
}

function loadSessions() {
  const saved = JSON.parse(localStorage.getItem("sessions"));
  if (saved) {
    variables.sessions = saved;
  }
}

// ===== Display session records =====
function updateSessionList() {
  const list = document.getElementById("session-list");

  if (variables.sessions.length === 0) {
    list.innerHTML = "<li>No sessions yet. Start focusing! ✨</li>";
    return;
  }
  list.innerHTML = ""; // clear old list

  variables.sessions.forEach((session) => {
    const li = document.createElement("li");
    li.textContent = `${session.duration} — ${new Date(
      session.date
    ).toLocaleTimeString()}`;
    list.appendChild(li);
  });
}

function updateTodayStats() {
  const today = new Date().toDateString();
  const todaySessions = variables.sessions.filter(
    (session) => new Date(session.date).toDateString() === today
  );

  // console.log(todaySessions);
  const totaltodaySessions = todaySessions.length;

  let totalSeconds = 0;
  todaySessions.forEach((session) => {
    const [h, m, s] = session.duration.split(":").map(Number);
    totalSeconds += h * 3600 + m * 60 + s;
  });

  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  document.getElementById("today-total").textContent = `${String(
    hours
  ).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(
    seconds
  ).padStart(2, "0")}`;
  document.getElementById("today-sessions").textContent = totaltodaySessions;
}

// ===== Event handlers and Interactivity =====
function setupEventHandlers() {
  domElements.startBtn.addEventListener("click", startTimer);
  domElements.pauseBtn.addEventListener("click", pauseTimer);
  domElements.continueBtn.addEventListener("click", continueTimer);
  domElements.stopBtn.addEventListener("click", stopTimer);
}

// ===== Start the Application =====
document.addEventListener("DOMContentLoaded", initializeApp);
