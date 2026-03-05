// src/utils/eventTracker.ts
import { v4 as uuidv4 } from "uuid";

const API_BASE_URL =
  "https://functions.poehali.dev/540fd4ac-812f-4cac-b72b-9ae038b22774";

export const trackEvent = (
  visitorId: string | undefined,
  event_type: string,
  target_id: string,
  source?: string,
) => {
  const sessionId =
    sessionStorage.getItem("session_id") ||
    (() => {
      const newId = uuidv4();
      sessionStorage.setItem("session_id", newId);
      return newId;
    })();

  const page_path = window.location.pathname;
  const visitor_agent = navigator.userAgent;
  const referer = document.referrer || undefined;

  const urlParams = new URLSearchParams(window.location.search);
  const utm = {
    utm_source: urlParams.get("utm_source") || undefined,
    utm_medium: urlParams.get("utm_medium") || undefined,
    utm_campaign: urlParams.get("utm_campaign") || undefined,
    utm_term: urlParams.get("utm_term") || undefined,
    utm_content: urlParams.get("utm_content") || undefined,
  };

  const payload = {
    event_type,
    target_id,
    source,
    page_path,
    visitor_agent,
    referer,
    session_id: sessionId,
    ...utm,
  };

  console.log("📤 Sending event:", { visitorId, ...payload });

  fetch(`${API_BASE_URL}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(visitorId ? { "X-Visitor-ID": visitorId } : {}),
    },
    body: JSON.stringify(payload),
  })
    .then((res) => {
      console.log("📥 Response status:", res.status);
      if (!res.ok) {
        console.error("Event response not OK", res.status);
      } else {
        console.log("Event sent successfully");
      }
    })
    .catch((err) => console.error("Fetch error:", err));
};
