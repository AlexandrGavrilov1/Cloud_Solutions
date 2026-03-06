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
    console.log(`[usePageTimer] START ${pageType}:${targetId}`);

    const sendLeaveEvent = () => {
      const duration = Math.round((Date.now() - startTime.current) / 1000);
      console.log(
        `[usePageTimer] LEAVE ${pageType}:${targetId}, duration=${duration}s`,
      );
      // Убираем проверку duration < 1 для отладки, позже можно вернуть
      // if (duration < 1) return;

      const visitorId = getVisitorId();
      trackEvent(visitorId, "page_leave", targetId, pageType, duration);
    };

    const handleBeforeUnload = () => {
      console.log("[usePageTimer] beforeunload");
      sendLeaveEvent();
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      console.log(`[usePageTimer] CLEANUP ${pageType}:${targetId}`);
      window.removeEventListener("beforeunload", handleBeforeUnload);
      sendLeaveEvent(); // отправка при SPA-переходе
    };
  }, [pageType, targetId]);
};
