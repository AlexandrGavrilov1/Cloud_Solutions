import { v4 as uuidv4 } from 'uuid';
import Cookies from 'js-cookie';

const VISITOR_COOKIE_NAME = 'visitor_id';
const COOKIE_EXPIRY_DAYS = 365;
const SESSION_STORAGE_KEY = 'session_id';

export const getVisitorId = (): string | undefined => {
  let visitorId = Cookies.get(VISITOR_COOKIE_NAME);
  if (!visitorId) {
    visitorId = uuidv4();
    Cookies.set(VISITOR_COOKIE_NAME, visitorId, { expires: COOKIE_EXPIRY_DAYS });
  }
  return visitorId;
};

export const getSessionId = (): string => {
  let sessionId = sessionStorage.getItem(SESSION_STORAGE_KEY);
  if (!sessionId) {
    sessionId = uuidv4();
    sessionStorage.setItem(SESSION_STORAGE_KEY, sessionId);
  }
  return sessionId;
};
