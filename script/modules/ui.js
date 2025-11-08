export function updateTimerDisplay(displayElement, seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  displayElement.textContent = `${minutes
    .toString()
    .padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
}

export function updateStatsDisplay(elements, stats) {
  if (elements.todayTotal)
    elements.todayTotal.textContent = stats.totalFormatted;
  if (elements.todaySessions) elements.todaySessions.textContent = stats.count;
  if (elements.todayAverage)
    elements.todayAverage.textContent = stats.averageFormatted;
}

export function updateButtonStates(buttons, timerState) {
  const { startBtn, pauseBtn, stopBtn } = buttons;

  if (startBtn) startBtn.disabled = timerState.isRunning;
  if (pauseBtn)
    pauseBtn.disabled = !timerState.isRunning || timerState.isPaused;
  if (stopBtn) stopBtn.disabled = !timerState.isRunning && !timerState.isPaused;
}

export function renderSessionList(container, sessions) {
  if (!container) return;

  if (sessions.length === 0) {
    container.innerHTML = `
  <div class="session-item">
    <span>No sessions yet</span>
    <span class="session-duration">-</span>
  </div>`;
    return;
  }

  container.innerHTML = sessions
    .map(
      (session) =>
        `
  <div class="session-item">
    <span>${formatSessionDate(session.date)}</span>
    <span class="session-duration">${session.duration}m</span>
  </div>
  `
    )
    .join("");
}

function formatSessionDate(dateString) {
  const date = new Date(dateString);
  return (
    date.toLocaleDateString() +
    " " +
    date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })
  );
}

// ===== Navigation Function =====
export function setupNavigation(navLinks, pages, onPageChange = null) {
  navLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const targetPage = link.getAttribute("data-page");
      if (targetPage) {
        switchPage(targetPage, navLinks, pages, onPageChange);
      }
    });
  });
}

export function switchPage(targetPage, navLinks, pages, onPageChange = null) {
  // Update active nav link
  navLinks.forEach((link) => {
    const isActive = link.getAttribute("data-page") === targetPage;
    link.classList.toggle("active", isActive);
  });

  pages.forEach((page) => {
    const isTarget = page.id === targetPage;
    page.classList.toggle("active", isTarget);
  });

  // Notify about page change
  if (onPageChange) {
    onPageChange(targetPage);
  }

  console.log(`📍 Navigated to: ${targetPage}`);
}

export function getCurrentPage(pages) {
  return (
    Array.from(pages).find((page) => page.classList.contains("active"))?.id ||
    "home"
  );
}
