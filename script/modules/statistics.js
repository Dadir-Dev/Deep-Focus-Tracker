import { TIMEFRAME_FILTERS } from "../constants.js";

export function calculateSessionStats(
  sessions,
  timeframe = TIMEFRAME_FILTERS.ALL
) {
  const filteredSessions = filterSessionsByTimeframe(sessions, timeframe);

  if (filteredSessions.length === 0) {
    return {
      total: 0,
      average: 0,
      count: 0,
      longest: 0,
      totalFormatted: "0min",
      averageFormatted: "0min",
      longestFormatted: "0min",
    };
  }

  const total = filteredSessions.reduce(
    (sum, session) => sum + session.duration,
    0
  );
  const count = filteredSessions.length;
  const average = Math.round(total / count);
  const longest = Math.max(...filteredSessions.map((s) => s.duration));
  console.log(filteredSessions.map((s) => s.duration));

  return {
    total,
    average,
    count,
    longest,
    totalFormatted: formatTime(total),
    averageFormatted: formatTime(average),
    longestFormatted: formatTime(longest),
  };
}

export function filterSessionsByTimeframe(sessions, timeframe) {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  switch (timeframe) {
    case TIMEFRAME_FILTERS.TODAY:
      return sessions.filter(
        (session) =>
          new Date(session.date).toDateString() === today.toDateString()
      );

    case TIMEFRAME_FILTERS.WEEK:
      const weekAgo = new Date(today);
      weekAgo.setDate(today.getDate() - 7);
      return sessions.filter((session) => new Date(session.date) >= weekAgo);

    case TIMEFRAME_FILTERS.MONTH:
      const monthAgo = new Date(today);
      monthAgo.setDate(today.getDate() - 30);
      return sessions.filter((session) => new Date(session.date) >= monthAgo);

    case TIMEFRAME_FILTERS.ALL:
    default:
      return sessions;
  }
}

export function formatTime(minutes) {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;

  if (hours > 0 && mins > 0) {
    return `${hours} h ${mins} mins`;
  } else if (hours > 0) {
    return `${hours} h`;
  } else {
    return `${mins} mins`;
  }
}

export function getRecentSessions(sessions, limit = 5) {
  return sessions
    .slice(0, limit)
    .sort((a, b) => new Date(b.date) - new Date(a.date));
}
