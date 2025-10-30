// ===== App State =====
let state = {
  timer: {
    isRunning: false,
    isPaused: false,
    totalSeconds: 1800,
    remainingSeconds: 1800,
    interval: null,
  },
  sessions: [],
};

// ===== domElements =====
const elements = {
  // Navigation
  navLinks: document.querySelectorAll(".js-nav-link"),
  pages: document.querySelectorAll(".js-page"),

  // Timer
  timerDisplay: document.getElementById("timerDisplay"),
  minutesInput: document.getElementById("minutesInput"),
  startBtn: document.getElementById("startBtn"),
  pauseBtn: document.getElementById("pauseBtn"),
  stopBtn: document.getElementById("stopBtn"),

  // Today Stats
  todayTotal: document.getElementById("todayTotal"),
  todaySessions: document.getElementById("todaySessions"),
  todayAverage: document.getElementById("todayAvg"),
};

// ===== Initialize the App =====
function initializeApp() {
  console.log("Deep Focus Tracker App initialized 🚀");
  setupEventHandlers();
}

// ===== Timer Functions =====
function updateTimerDisplay() {
  const minutes = Math.floor(state.timer.remainingSeconds / 60);
  const seconds = state.timer.remainingSeconds % 60;
  elements.timerDisplay.textContent = `${minutes
    .toString()
    .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
}
function startTimer() {
  if (!state.timer.isRunning) {
    if (state.timer.isPaused) {
      // Resume from paused state
      state.timer.isPaused = false;
    } else {
      // Start new timer
      resetTimer();
      // const minutes = Number(elements.minutesInput.value) || 30;
      // state.timer.totalSeconds = minutes * 60;
      // state.timer.remainingSeconds = minutes * 60;
    }

    state.timer.isRunning = true;
    console.log("Focus Timer Started▶️");
    state.timer.interval = setInterval(() => {
      updateTimer();
      // console.log(state.timer.remainingSeconds);
    }, 1000);

    updateTimerDisplay(); // initial timer display
  }
}

function pauseTimer() {
  if (state.timer.isRunning && !state.timer.isPaused) {
    state.timer.isPaused = true;
    console.log("Focus Timer Paused⏸️");
    state.timer.isRunning = false;
    clearInterval(state.timer.interval);
  }
}

function stopTimer() {
  if (state.timer.isRunning || state.timer.isPaused) {
    state.timer.isRunning = false;
    state.timer.isPaused = false;
    console.log("Focus Timer Stopped⏹️");
    clearInterval(state.timer.interval);

    saveSession();
    updateTodayStats();
    resetTimer();
    updateTimerDisplay();
  }
}

function resetTimer() {
  const minutes = Number(elements.minutesInput.value) || 30;
  state.timer.totalSeconds = minutes * 60;
  state.timer.remainingSeconds = minutes * 60;
}
// const input = Number(elements.minutesInput.value);
// console.log(input);
// console.log(typeof input);

function updateTimer() {
  state.timer.remainingSeconds--;

  if (state.timer.remainingSeconds <= 0) {
    // Timer completed
    clearInterval(state.timer.interval);
    state.timer.isRunning = false;
    resetTimer();
  }
  updateTimerDisplay();
}

// ===== Session Management =====
function saveSession() {
  const session = {
    id: Date.now(),
    date: new Date().toISOString(),
    duration: Math.floor(
      (state.timer.totalSeconds - state.timer.remainingSeconds) / 60
    ), // in minutes
    completed: state.timer.remainingSeconds <= 0,
  };

  state.sessions.unshift(session);
  localStorage.setItem("focusSessions", JSON.stringify(state.sessions));
  console.log(state.sessions);
  // console.log(state.timer.remainingSeconds);
  // console.log(state.timer.totalSeconds);
}

// ===== Stats Calculation =====
function updateTodayStats() {
  const today = new Date().toDateString();
  const todaySessions = state.sessions.filter(
    (session) => new Date(session.date).toDateString() === today
  );

  const totalMinutes = todaySessions.reduce(
    (sum, session) => sum + session.duration,
    0
  ); // in minutes
  const sessionCount = todaySessions.length;
  const average =
    sessionCount > 0 ? Math.round(totalMinutes / sessionCount) : 0; // in minutes

  elements.todayTotal.textContent = formatTime(totalMinutes);
  elements.todaySessions.textContent = sessionCount;
  elements.todayAverage.textContent = formatTime(average);
  console.log(totalMinutes);
  console.log(sessionCount);
  console.log(average);
}

// ===== Utility Functions =====
function formatTime(minutes) {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return hours > 0 ? `${hours}hrs ${mins}min` : ` ${mins}min`;
}

// ===== Event Listeners =====
function setupEventHandlers() {
  elements.startBtn.addEventListener("click", startTimer);
  elements.pauseBtn.addEventListener("click", pauseTimer);
  elements.stopBtn.addEventListener("click", stopTimer);
}

// ===== Load the App =====
document.addEventListener("DOMContentLoaded", initializeApp);

// const date = new Date();
// const formatted = date.toISOString();
// console.log(new Date().toDateString());
