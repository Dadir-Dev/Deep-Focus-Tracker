// Timer States - Explicit(stopped, paused..) is better than implicit(true, false)
export const TIMER_STATES = {
  STOPPED: "stopped",
  RUNNING: "running",
  PAUSED: "paused",
};

// Timeframe Filters - Prevent typos
export const TIMEFRAME_FILTERS = {
  TODAY: "today",
  WEEK: "week",
  MONTH: "month",
  ALL: "all",
};

// Storage Keys - Single source of truth
export const STORAGE_KEYS = {
  SESSIONS: "focusedSessions",
};

// Default Values
export const DEFAULT_TIMER_DURATION = 25; // minutes
