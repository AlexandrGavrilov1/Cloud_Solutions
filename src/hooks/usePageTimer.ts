// src/hooks/usePageTimer.ts
import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { getVisitorId } from "@/utils/visitor";
import { trackEvent } from "@/utils/eventTracker";

export const usePageTimer = (
  pageType: "page_view" | "section_visit",
  targetId: string,
) => {
  const location = useLocation();
  const startTime = useRef<number>(Date.now());
  const prevPath = useRef<string>(location.pathname);
  const prevPageType = useRef<string>(pageType);
  const prevTargetId = useRef<string>(targetId);

  // 1. Отслеживаем изменение пути (SPA-переходы)
  useEffect(() => {
    const currentPath = location.pathname;
    const now = Date.now();

    // Если путь изменился – мы покинули предыдущую страницу
    if (prevPath.current !== currentPath) {
      const duration = Math.round((now - startTime.current) / 1000);
      console.log(
        `[usePageTimer] LEAVE due to path change: ${prevPageType.current}:${prevTargetId.current}, duration=${duration}s`,
      );

      const visitorId = getVisitorId();
      trackEvent(
        visitorId,
        "page_leave",
        prevTargetId.current,
        prevPageType.current,
        duration,
      );

      // Сбрасываем таймер для новой страницы
      startTime.current = now;
      prevPath.current = currentPath;
    }

    // В любом случае обновляем сохранённые тип и идентификатор (на случай, если они изменились без смены пути)
    prevPageType.current = pageType;
    prevTargetId.current = targetId;
  }, [location.pathname, pageType, targetId]);

  // 2. Отправка при размонтировании компонента (на случай, если компонент всё-таки размонтируется)
  useEffect(() => {
    return () => {
      const duration = Math.round((Date.now() - startTime.current) / 1000);
      console.log(
        `[usePageTimer] LEAVE on unmount: ${pageType}:${targetId}, duration=${duration}s`,
      );
      const visitorId = getVisitorId();
      trackEvent(visitorId, "page_leave", targetId, pageType, duration);
    };
  }, [pageType, targetId]);

  // 3. Обработка закрытия/перезагрузки вкладки (beforeunload)
  useEffect(() => {
    const handleBeforeUnload = () => {
      const duration = Math.round((Date.now() - startTime.current) / 1000);
      console.log(
        `[usePageTimer] LEAVE on beforeunload: ${pageType}:${targetId}, duration=${duration}s`,
      );
      const visitorId = getVisitorId();

      // Для beforeunload лучше использовать sendBeacon, но fetch тоже часто успевает
      if (navigator.sendBeacon) {
        const payload = new Blob(
          [
            JSON.stringify({
              event_type: "page_leave",
              target_id: targetId,
              source: pageType,
              duration,
              page_path: window.location.pathname,
              visitor_agent: navigator.userAgent,
              referer: document.referrer,
              session_id: getSessionId(), // предполагается, что getSessionId доступна
            }),
          ],
          { type: "application/json" },
        );
        navigator.sendBeacon(
          "https://functions.poehali.dev/540fd4ac-812f-4cac-b72b-9ae038b22774",
          payload,
        );
      } else {
        // fallback на fetch (не гарантирует доставку)
        trackEvent(visitorId, "page_leave", targetId, pageType, duration);
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [pageType, targetId]);
};
