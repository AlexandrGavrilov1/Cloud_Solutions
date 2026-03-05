import { useCallback } from "react";
import { useVisitor } from "./useVisitor";
import { trackEvent } from "@/utils/eventTracker";

export const useTrackEvent = () => {
  const visitorId = useVisitor();

  const track = useCallback(
    (event_type: string, target_id: string, source?: string) => {
      trackEvent(visitorId, event_type, target_id, source);
    },
    [visitorId],
  );

  return track;
};
