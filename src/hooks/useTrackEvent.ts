import { useCallback } from "react";
import { getVisitorId } from "@/utils/visitor";
import { trackEvent } from "@/utils/eventTracker";

export const useTrackEvent = () => {
  const track = useCallback(
    (event_type: string, target_id: string, source?: string) => {
      const visitorId = getVisitorId(); // синхронно получаем ID
      trackEvent(visitorId, event_type, target_id, source);
    },
    [],
  );

  return track;
};
