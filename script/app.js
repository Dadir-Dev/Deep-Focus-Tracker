import { startTimer, pauseTimer, stopTimer } from "./modules/timer.js";
import { saveSessions, loadSessions } from "./modules/storage.js";
import { calculateSessionStats } from "./modules/statistics.js";
// ===== App State =====
export let state = {
  timer: {
    isRunning: false,
    isPaused: false,
    totalSeconds: 1800,
    remainingSeconds: 1800,
    interval: null,
  },
  sessions: [],
  currentTimeframe: "today",
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
  updateTodayStats();
  updateReportStats();
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

  // console.log(state.timer.remainingSeconds);
  // console.log(state.timer.totalSeconds);
  console.log("✅ Session saved:", session.duration + "min");
  updateStats();
}

// ===== Stats Calculation =====
/*
function updateStats() {
  updateTodayStats();
  updateReportStats();
}
  */

function updateTodayStats() {
  const stats = calculateSessionStats(state.sessions, "today");
  /*
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
  */

  elements.todayTotal.textContent = stats.totalFormatted;
  elements.todaySessions.textContent = stats.count;
  elements.todayAverage.textContent = stats.averageFormatted;
}

function updateReportStats() {
  const stats = calculateSessionStats(state.sessions, state.currentTimeframe);
  /*
  const filteredSessions = filterSessionsByTimeframe(state.currentTimeframe);

  const totalMinutes = filteredSessions.reduce(
    (sum, session) => sum + session.duration,
    0
  );
  const sessionCount = filteredSessions.length;
  const average =
    sessionCount > 0 ? Math.round(totalMinutes / sessionCount) : 0;
  const longest =
    sessionCount > 0 ? Math.max(...filteredSessions.map((s) => s.duration)) : 0;
    */

  elements.reportTotal.textContent = stats.totalFormatted;
  elements.reportSessions.textContent = stats.count;
  elements.reportAvg.textContent = stats.averageFormatted;
  elements.reportLongest.textContent = stats.longestFormatted;
}

/* function filterSessionsByTimeframe(timeframe) {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  switch (timeframe) {
    case "today":
      return state.sessions.filter(
        (session) =>
          new Date(session.date).toDateString() === today.toDateString()
      );

    case "week":
      const weekAgo = new Date(today); // makes a copy of the today object
      weekAgo.setDate(today.getDate() - 7); // rewinds the copy by 7 days
      return state.sessions.filter(
        (session) => new Date(session.date) >= weekAgo
      );

    case "month":
      const monthAgo = new Date(today);
      monthAgo.setDate(today.getDate() - 30);
      return (
        state.sessions.filter((session) => new Date(session.date)) >= monthAgo
      );

    case "all":
      return state.sessions;
    default:
      return state.sessions;
  }
}
  */

// ===== Utility Functions =====

/* function formatTime(minutes) {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return hours > 0 ? `${hours}hrs ${mins}min` : ` ${mins}min`;
}
  */

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
// console.log(new Date(formatted).toDateString());
