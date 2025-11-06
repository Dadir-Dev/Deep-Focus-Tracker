import { state, elements, saveSession } from "../app.js";
// ===== Timer Logic =====

export function startTimer() {
  if (!state.timer.isRunning) {
    if (state.timer.isPaused) {
      // Resume from paused state
      state.timer.isPaused = false;
    } else {
      // Start new timer
      resetTimer();
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

export function pauseTimer() {
  if (state.timer.isRunning && !state.timer.isPaused) {
    state.timer.isPaused = true;
    console.log("Focus Timer Paused⏸️");
    state.timer.isRunning = false;
    clearInterval(state.timer.interval);
  }
}

export function stopTimer() {
  if (state.timer.isRunning || state.timer.isPaused) {
    state.timer.isRunning = false;
    state.timer.isPaused = false;
    console.log("Focus Timer Stopped⏹️");
    clearInterval(state.timer.interval);

    saveSession();
    resetTimer();
    updateTimerDisplay();
  }
}

function updateTimerDisplay() {
  const minutes = Math.floor(state.timer.remainingSeconds / 60);
  const seconds = state.timer.remainingSeconds % 60;
  elements.timerDisplay.textContent = `${minutes
    .toString()
    .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
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
