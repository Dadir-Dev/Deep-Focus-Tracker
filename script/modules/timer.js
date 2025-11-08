import { state, elements, saveSession } from "../app.js";
// ===== Timer Logic =====
export function createTimerState() {
  return {
    isRunning: false,
    isPaused: false,
    totalSeconds: 25 * 60, // Default 25 minutes
    remainingSeconds: 25 * 60,
    intervalId: null,
  };
}

export function startTimer(timerState, onTick, onComplete) {
  if (timerState.isRunning) {
    console.log("❌ Timer is already running");
    return;
  }

  if (timerState.isPaused) {
    // Resume from paused state
    timerState.isPaused = false;
  }

  timerState.isRunning = true;
  if (onTick) {
    onTick(timerState.remainingSeconds);
  }
  timerState.intervalId = setInterval(() => {
    timerState.remainingSeconds--;

    // Notify about the tick
    if (onTick) {
      onTick(timerState.remainingSeconds);
    }

    // Check if completed
    if (timerState.remainingSeconds <= 0) {
      stopTimer(timerState);
      if (onComplete) {
        onComplete();
      }
    }
  }, 1000);

  console.log("Focus Timer Started▶️");
}

export function pauseTimer(timerState) {
  if (timerState.isRunning && !timerState.isPaused) {
    timerState.isPaused = true;
    timerState.isRunning = false;
    clearInterval(timerState.intervalId);
    timerState.intervalId = null;
    console.log("Focus Timer Paused⏸️");
  }
}

export function stopTimer(timerState) {
  if (timerState.isRunning || timerState.isPaused) {
    timerState.isRunning = false;
    timerState.isPaused = false;

    if (timerState.intervalId) {
      clearInterval(state.timer.intervalId);
      timerState.intervalId = null;
    }

    console.log("Focus Timer Stopped⏹️");
  }
}

export function resetTimer(timerState, minutes = 25) {
  if (!timerState.isRunning && !timerState.isPaused) {
    timerState.totalSeconds = minutes * 60;
    timerState.remainingSeconds = minutes * 60;
  }
}

export function formatTimerDisplay(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
    .toString()
    .padStart(2, "0")}`;
}
