// src/hooks/usePageTimer.ts
import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { getVisitorId } from "@/utils/visitor";
import { trackEvent } from "@/utils/eventTracker";

export const usePageTimer = (
  pageType: "page_view" | "section_visit",
  targetId: string,
) => {
  console.log("✅ usePageTimer initialized", pageType, targetId);

  const location = useLocation();
  const startTime = useRef<number>(Date.now());
  const prevPath = useRef<string>(location.pathname);
  const prevPageType = useRef<string>(pageType);
  const prevTargetId = useRef<string>(targetId);

  // 1. ОТСЛЕЖИВАНИЕ СМЕНЫ ПУТИ (SPA-переходы без размонтирования)
  useEffect(() => {
    console.log("[usePageTimer] useEffect [path] running", {
      path: location.pathname,
    });
    const currentPath = location.pathname;
    const now = Date.now();

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

    // Обновляем сохранённые тип и идентификатор (на случай, если они изменились без смены пути)
    prevPageType.current = pageType;
    prevTargetId.current = targetId;
  }, [location.pathname, pageType, targetId]);

  // 2. ОТПРАВКА ПРИ РАЗМОНТИРОВАНИИ КОМПОНЕНТА (переходы между разными компонентами)
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

  // 3. ОБРАБОТКА ЗАКРЫТИЯ/ПЕРЕЗАГРУЗКИ ВКЛАДКИ
  useEffect(() => {
    const handleBeforeUnload = () => {
      const duration = Math.round((Date.now() - startTime.current) / 1000);
      console.log(
        `[usePageTimer] LEAVE on beforeunload: ${pageType}:${targetId}, duration=${duration}s`,
      );
      const visitorId = getVisitorId();
      trackEvent(visitorId, "page_leave", targetId, pageType, duration);
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [pageType, targetId]);
};
