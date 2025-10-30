// ===== App State =====
let state = {
  timer: {
    isRunning: false,
    isPaused: false,
    totalSeconds: 1800,
    remainingSeconds: 1800,
    interval: null,
  },
  session: [],
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
      const minutes = elements.minutesInput.value || 30;
      state.timer.totalSeconds = minutes * 60;
      state.timer.remainingSeconds = minutes * 60;
    }

    state.timer.isRunning = true;
    console.log("Focus Timer Started▶️");
    state.timer.interval = setInterval(() => {
      state.timer.remainingSeconds--;

      if (state.timer.remainingSeconds <= 0) {
        // Timer completed
        clearInterval(state.timer.interval);
        state.timer.isRunning = false;
        resetTimer();
      }
      updateTimerDisplay();
    }, 1000);

    updateTimerDisplay();
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

// ===== Event Listeners =====
function setupEventHandlers() {
  elements.startBtn.addEventListener("click", startTimer);
  elements.pauseBtn.addEventListener("click", pauseTimer);
  elements.stopBtn.addEventListener("click", stopTimer);
}

// ===== Load the App =====
document.addEventListener("DOMContentLoaded", initializeApp);
