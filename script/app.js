import {
  createTimerState,
  startTimer,
  pauseTimer,
  stopTimer,
  resetTimer,
  formatTimerDisplay,
} from "./modules/timer.js";
import { saveSessions, loadSessions } from "./modules/storage.js";
import {
  calculateSessionStats,
  getRecentSessions,
} from "./modules/statistics.js";
import { TIMEFRAME_FILTERS } from "./constants.js";
import {
  updateTimerDisplay,
  updateButtonStates,
  renderSessionList,
  updateStatsDisplay,
  setupNavigation,
} from "./modules/ui.js";

// ===== App State =====
export let state = {
  timer: createTimerState(), // Use the factory function
  sessions: [],
  currentTimeframe: TIMEFRAME_FILTERS.WEEK,
  currentPage: "home",
};

// ===== domElements =====
export const elements = {
  // Navigation
  navLinks: document.querySelectorAll(".js-nav-link"),
  pages: document.querySelectorAll(".js-page"),

  // Timer
  timerDisplay: document.getElementById("timerDisplay"),
  minutesInput: document.getElementById("minutesInput"),
  startBtn: document.getElementById("startBtn"),
  pauseBtn: document.getElementById("pauseBtn"),
  stopBtn: document.getElementById("stopBtn"),

  // Home Page Stats
  todayTotal: document.getElementById("todayTotal"),
  todaySessions: document.getElementById("todaySessions"),
  todayAverage: document.getElementById("todayAvg"),
  recentSessions: document.getElementById("recentSessions"),

  // Report Page Stats
  timeframeBtns: document.querySelectorAll(".timeframe-btn"),
  reportTotal: document.getElementById("reportTotal"),
  reportSessions: document.getElementById("reportSessions"),
  reportAvg: document.getElementById("reportAvg"),
  reportLongest: document.getElementById("reportLongest"),
};

// ===== Initialize the App =====
function initializeApp() {
  console.log("Deep Focus Tracker App initialized 🚀");
  state.sessions = loadSessions();
  setupEventHandlers();
  setupNavigation(elements.navLinks, elements.pages, handlePageChange);
  updateTodayStats();
  updateReportStats();
}

// ===== Timer Functions =====
function updateDisplay() {
  updateTimerDisplay(elements.timerDisplay, state.timer.remainingSeconds);
  // updateButtonStates(elements, state.timer);
}

function startTimerHandler() {
  const minutes = parseInt(elements.minutesInput.value) || 25;
  resetTimer(state.timer, minutes);
  startTimer(state.timer, updateDisplay, onTimerComplete);
  updateDisplay();
}

function pauseTimerHandler() {
  pauseTimer(state.timer);
}

function stopTimerHandler() {
  stopTimer(state.timer);
  saveSession();
  resetTimer(state.timer, parseInt(elements.minutesInput.value) || 25);
  updateTimerDisplay(elements.timerDisplay, state.timer.remainingSeconds);
}

function onTimerComplete() {
  console.log("🎉 Timer completed!");
  saveSession();
  alert("Focus session completed! 🎉");
}

// ===== Session Management =====
export function saveSession() {
  const session = {
    id: Date.now(),
    date: new Date().toISOString(),
    duration: Math.floor(
      (state.timer.totalSeconds - state.timer.remainingSeconds) / 60
    ), // in minutes
    completed: state.timer.remainingSeconds <= 0,
  };

  state.sessions.unshift(session);
  saveSessions(state.sessions);

  console.log("✅ Session saved:", session.duration + "min");
  updateStats();
}

// ===== Stats Calculation =====

function updateStats() {
  updateTodayStats();
  updateReportStats();
}

function updateTodayStats() {
  const todayStats = calculateSessionStats(state.sessions, "today");

  updateStatsDisplay(elements, todayStats);

  // elements.todayTotal.textContent = todayStats.totalFormatted;
  // elements.todaySessions.textContent = todayStats.count;
  // elements.todayAverage.textContent = todayStats.averageFormatted;

  // Update recent sessions
  const recentSessions = getRecentSessions(state.sessions, 5);
  renderSessionList(elements.recentSessions, recentSessions);
}

function updateReportStats() {
  const stats = calculateSessionStats(state.sessions, state.currentTimeframe); // stats object

  elements.reportTotal.textContent = stats.totalFormatted;
  elements.reportSessions.textContent = stats.count;
  elements.reportAvg.textContent = stats.averageFormatted;
  elements.reportLongest.textContent = stats.longestFormatted;
}

// ===== Page Navigation Handler =====
function handlePageChange(newPage) {
  state.currentPage = newPage;
  console.log(`Page changed to: ${newPage}`);
  if (newPage === "report") {
    // Refresh report data when navigating to reports
    updateReportStats();
  }

  // Timer continues running uninterrupted!
  if (state.timer.isRunning) {
    console.log("⏰ Timer continues running in background");
  }
}

// ===== Event Listeners =====
function setupEventHandlers() {
  elements.startBtn.addEventListener("click", startTimerHandler);
  elements.pauseBtn.addEventListener("click", pauseTimerHandler);
  elements.stopBtn.addEventListener("click", stopTimerHandler);
}

// ===== Load the App =====
document.addEventListener("DOMContentLoaded", initializeApp);
// console.log(elements.recentSessions.innerHTML);
