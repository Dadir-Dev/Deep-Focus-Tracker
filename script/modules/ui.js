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
        window.location.hash = targetPage;
        switchPage(targetPage, navLinks, pages, onPageChange);
      }
    });
  });
  // Handle browser back/forward buttons
  window.addEventListener("hashchange", () => {
    const targetPage = window.location.hash.replace("#", "") || "home";
    switchPage(targetPage, navLinks, pages, onPageChange);
  });

  // Initial page from URL
  const initialPage = window.location.hash.replace("#", "") || "home";
  switchPage(initialPage, navLinks, pages, onPageChange);
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

// ===== Data Visualization Functions =====
export function renderWeeklyCharts(
  container,
  legendContainer,
  sessions,
  timeframe = "week"
) {
  if (!container) return;

  const chartData = getChartData(sessions, timeframe);

  const maxDuration = Math.max(...chartData.map((item) => item.duration));
  const scale = maxDuration > 0 ? 180 / maxDuration : 0; // 180px max height

  // Clear previous chart
  container.innerHTML = "";
  if (legendContainer) legendContainer.innerHTML = "";

  // Create chart bars
  const chartBars = document.createElement("div");
  chartBars.className = "chart-bars";
  chartBars.style.cssText = `
        display: flex;
        align-items: end;
        gap: 12px;
        height: 200px;
        padding: 20px 0;
        justify-content: center;
    `;

  chartData.forEach((item, index) => {
    const barContainer = document.createElement("div");
    barContainer.style.cssText = `
            display: flex;
            flex-direction: column;
            align-items: center;
            flex: 1;
            max-width: 60px;
        `;

    const bar = document.createElement("div");
    const barHeight = item.duration * scale;
    bar.style.cssText = `
            background: linear-gradient(to top, var(--primary-500), var(--primary-600));
            border-radius: 4px 4px 0 0;
            width: 100%;
            height: ${barHeight}px;
            min-height: 4px;
            transition: all 0.3s ease;
            cursor: pointer;
            position: relative;
        `;
    bar.title = `${item.label}: ${item.duration}m`;

    // Add hover effect
    bar.addEventListener("mouseenter", () => {
      bar.style.transform = "scaleY(1.1)";
      bar.style.background =
        "linear-gradient(to top, var(--primary-400), var(--primary-500))";
    });

    bar.addEventListener("mouseleave", () => {
      bar.style.transform = "scaleY(1)";
      bar.style.background =
        "linear-gradient(to top, var(--primary-500), var(--primary-600))";
    });

    // Add value label on bar
    if (item.duration > 0) {
      const valueLabel = document.createElement("div");
      valueLabel.textContent = item.duration;
      valueLabel.style.cssText = `
                position: absolute;
                top: -25px;
                left: 50%;
                transform: translateX(-50%);
                font-size: var(--fs-12);
                font-weight: 600;
                color: var(--text-primary);
                background: var(--bg-surface);
                padding: 2px 6px;
                border-radius: var(--radius-sm);
                box-shadow: var(--shadow-sm);
                white-space: nowrap;
            `;
      bar.appendChild(valueLabel);
    }

    const label = document.createElement("div");
    label.textContent = item.label;
    label.style.cssText = `
            margin-top: 8px;
            font-size: var(--fs-12);
            color: var(--text-secondary);
            font-weight: 500;
            text-align: center;
        `;

    barContainer.appendChild(bar);
    barContainer.appendChild(label);
    chartBars.appendChild(barContainer);
  });

  container.appendChild(chartBars);

  // Create legend
  if (legendContainer) {
    renderChartLegend(legendContainer, chartData, maxDuration);
  }
}

function getChartData(sessions, timeframe) {
  switch (timeframe) {
    case "today":
      return getHourlyData(sessions);
    case "week":
      return getWeeklyData(sessions);
    case "month":
      return getMonthlyData(sessions);
    default:
      return getWeeklyData(sessions); // Default to weekly
  }
}

export function getWeeklyData(sessions) {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const weekData = [];

  // Get last 7 days including today
  const today = new Date();
  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);

    const dayName = days[date.getDay()];

    const daySessions = sessions.filter((session) => {
      const sessionDate = new Date(session.date);
      return sessionDate.toDateString() === date.toDateString();
    });

    const totalDuration = daySessions.reduce((sum, session) => {
      return sum + session.duration;
    }, 0);

    weekData.push({
      label: dayName,
      duration: totalDuration,
      date: date.toISOString(),
    });
  }

  return weekData;
}

function getMonthlyData(sessions) {
  const monthData = [];
  const today = new Date();
  const daysInMonth = new Date(
    today.getFullYear(),
    today.getMonth() + 1,
    0
  ).getDate();

  // Show last 30 days in weekly chunks
  for (let i = 3; i >= 0; i--) {
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - i * 7 - 6);
    const weekEnd = new Date(today);
    weekEnd.setDate(today.getDate() - i * 7);

    const weekSessions = sessions.filter((session) => {
      const sessionDate = new Date(session.date);
      return sessionDate >= weekStart && sessionDate <= weekEnd;
    });

    const totalDuration = weekSessions.reduce(
      (sum, session) => sum + session.duration,
      0
    );

    monthData.push({
      label: `Week ${4 - i}`,
      duration: totalDuration,
      period: `${weekStart.getDate()}-${weekEnd.getDate()}`,
    });
  }

  return monthData;
}

function getHourlyData(sessions) {
  const hours = Array.from({ length: 12 }, (_, i) => {
    const hour = i + 7; // 7 AM to 6 PM
    return `${hour}:00`;
  });

  const today = new Date().toDateString();
  const todaySessions = sessions.filter(
    (session) => new Date(session.date).toDateString() === today
  );

  return hours.map((hourLabel) => {
    const [hour] = hourLabel.split(":");
    const hourStart = new Date();
    hourStart.setHours(parseInt(hour), 0, 0, 0);
    const hourEnd = new Date();
    hourEnd.setHours(parseInt(hour) + 1, 0, 0, 0);

    const hourSessions = todaySessions.filter((session) => {
      const sessionTime = new Date(session.date);
      return sessionTime >= hourStart && sessionTime < hourEnd;
    });

    const totalDuration = hourSessions.reduce(
      (sum, session) => sum + session.duration,
      0
    );

    return {
      label: hourLabel,
      duration: totalDuration,
    };
  });
}

function renderChartLegend(container, chartData, maxDuration) {
  const totalDuration = chartData.reduce((sum, item) => sum + item.duration, 0);
  const avgDuration = totalDuration / chartData.length;

  container.innerHTML = `
        <div class="legend-stats">
            <div class="legend-stat">
                <span class="legend-label">Total:</span>
                <span class="legend-value">${totalDuration}m</span>
            </div>
            <div class="legend-stat">
                <span class="legend-label">Average:</span>
                <span class="legend-value">${Math.round(avgDuration)}m</span>
            </div>
            <div class="legend-stat">
                <span class="legend-label">Peak:</span>
                <span class="legend-value">${maxDuration}m</span>
            </div>
        </div>
    `;
}
