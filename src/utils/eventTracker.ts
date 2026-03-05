import { getVisitorId, getSessionId } from './visitor';

// Базовый URL вашей функции
const API_BASE_URL = 'https://functions.poehali.dev/540fd4ac-812f-4cac-b72b-9ae038b22774';

export const trackEvent = (
  event_type: string,
  target_id: string,
  source?: string
) => {
  const visitorId = getVisitorId();
  const sessionId = getSessionId();
  const page_path = window.location.pathname;
  const visitor_agent = navigator.userAgent;
  const referer = document.referrer || undefined;

  // Парсим UTM-метки из текущего URL
  const urlParams = new URLSearchParams(window.location.search);
  const utm = {
    utm_source: urlParams.get('utm_source') || undefined,
    utm_medium: urlParams.get('utm_medium') || undefined,
    utm_campaign: urlParams.get('utm_campaign') || undefined,
    utm_term: urlParams.get('utm_term') || undefined,
    utm_content: urlParams.get('utm_content') || undefined,
  };

  fetch(`${API_BASE_URL}/event`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(visitorId ? { 'X-Visitor-ID': visitorId } : {}),
    },
    body: JSON.stringify({
      event_type,
      target_id,
      source,
      page_path,
      visitor_agent,
      referer,
      session_id: sessionId,
      ...utm,
    }),
  }).catch(err => console.error('Error tracking event:', err));
};
