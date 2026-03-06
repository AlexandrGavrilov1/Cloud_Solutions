// src/hooks/usePageTimer.ts
import { useEffect, useRef } from "react";
import { getVisitorId } from "@/utils/visitor";
import { trackEvent } from "@/utils/eventTracker";

export const usePageTimer = (
  pageType: "page_view" | "section_visit",
  targetId: string,
) => {
  const startTime = useRef<number>(Date.now());

  useEffect(() => {
    startTime.current = Date.now();
    console.log(`🕒 usePageTimer START for ${pageType}:${targetId}`); // отладка

    const sendLeaveEvent = () => {
      const duration = Math.round((Date.now() - startTime.current) / 1000);
      console.log(
        `🕒 usePageTimer LEAVE for ${pageType}:${targetId}, duration=${duration}s`,
      ); // отладка
      if (duration < 1) return;

      const visitorId = getVisitorId();
      trackEvent(visitorId, "page_leave", targetId, pageType, duration);
    };

    const handleBeforeUnload = () => {
      console.log("🕒 beforeunload"); // отладка
      sendLeaveEvent();
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      console.log(`🕒 usePageTimer CLEANUP for ${pageType}:${targetId}`); // отладка
      window.removeEventListener("beforeunload", handleBeforeUnload);
      sendLeaveEvent(); // отправка при размонтировании (SPA-переход)
    };
  }, [pageType, targetId]);
};
