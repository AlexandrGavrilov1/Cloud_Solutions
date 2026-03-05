import { v4 as uuidv4 } from "uuid";

const VISITOR_STORAGE_KEY = "visitor_id";
const SESSION_STORAGE_KEY = "session_id";

/**
 * Получает или создаёт уникальный идентификатор посетителя (хранится в localStorage).
 * Используется для передачи в заголовке X-Visitor-ID.
 */
export const getVisitorId = (): string => {
  let storedId = localStorage.getItem(VISITOR_STORAGE_KEY);
  if (!storedId) {
    storedId = uuidv4();
    localStorage.setItem(VISITOR_STORAGE_KEY, storedId);
  }
  return storedId;
};

/**
 * Получает или создаёт идентификатор сессии (хранится в sessionStorage).
 * Сессия живёт до закрытия вкладки.
 */
export const getSessionId = (): string => {
  let sessionId = sessionStorage.getItem(SESSION_STORAGE_KEY);
  if (!sessionId) {
    sessionId = uuidv4();
    sessionStorage.setItem(SESSION_STORAGE_KEY, sessionId);
  }
  return sessionId;
};
