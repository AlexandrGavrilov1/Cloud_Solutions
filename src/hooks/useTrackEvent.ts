import { useVisitor } from './useVisitor';
import { trackEvent } from '@/utils/eventTracker';

/**
 * Хук для отправки событий с автоматической подстановкой visitorId.
 * @returns функция (event_type, target_id, source?) – вызывает trackEvent с текущим visitorId.
 */
export const useTrackEvent = () => {
  const visitorId = useVisitor();

  return (event_type: string, target_id: string, source?: string) => {
    trackEvent(visitorId, event_type, target_id, source);
  };
};
