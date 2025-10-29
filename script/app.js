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
}

// ===== Load the App =====
document.addEventListener("DOMContentLoaded", initializeApp);
