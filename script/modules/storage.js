import { STORAGE_KEYS } from "../constants.js";

export function saveSessions(sessions) {
  try {
    localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(sessions));
    console.log("💾 Sessions saved:", sessions.length, "total sessions");
    return true;
  } catch (error) {
    console.error("Failed to save sessions:", error);
    return false;
  }
}

export function loadSessions() {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.SESSIONS);
    const sessions = data ? JSON.parse(data) : [];
    console.log("💾 Sessions loaded:", sessions.length, "total sessions");
    return sessions;
  } catch (error) {
    console.error("❌ Failed to load sessions:", error);
    return [];
  }
}
