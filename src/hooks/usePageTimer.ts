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

  // 1️⃣ ОТСЛЕЖИВАЕМ СМЕНУ ПУТИ (SPA-переходы)
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

  // 2️⃣ ОБРАБОТКА ЗАКРЫТИЯ/ПЕРЕЗАГРУЗКИ ВКЛАДКИ (beforeunload)
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
  }, [pageType, targetId]); // при изменении pageType/targetId обработчик обновится
};
