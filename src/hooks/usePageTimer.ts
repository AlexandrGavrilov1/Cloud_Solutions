// src/hooks/usePageTimer.ts
import { useEffect, useRef } from 'react';
import { getVisitorId } from '@/utils/visitor';
import { trackEvent } from '@/utils/eventTracker';

/**
 * Хук для измерения времени, проведённого на странице.
 * При уходе отправляет событие 'page_leave' с полем duration (секунды).
 * @param pageType – тип страницы ('page_view' или 'section_visit')
 * @param targetId – идентификатор страницы (slug или 'vpn-list')
 */
export const usePageTimer = (pageType: 'page_view' | 'section_visit', targetId: string) => {
  const startTime = useRef<number>(Date.now());

  useEffect(() => {
    startTime.current = Date.now();

    const sendLeaveEvent = () => {
      const duration = Math.round((Date.now() - startTime.current) / 1000);
      if (duration < 1) return; // игнорируем слишком быстрые уходы

      const visitorId = getVisitorId();
      // Используем trackEvent напрямую, так как нужно передать duration
      // (если вы модифицировали trackEvent для поддержки duration)
      trackEvent(visitorId, 'page_leave', targetId, pageType, duration);
    };

    // Отправка при размонтировании (переход по SPA)
    return () => {
      sendLeaveEvent();
    };

    // Отправка при закрытии/перезагрузке вкладки
    const handleBeforeUnload = () => {
      sendLeaveEvent();
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [pageType, targetId]);
};
