const YM_COUNTER_ID = 109411709;

export const trackProviderClick = () => {
  if (
    typeof window !== "undefined" &&
    (window as unknown as { ym?: (...args: unknown[]) => void }).ym
  ) {
    (window as unknown as { ym: (...args: unknown[]) => void }).ym(
      YM_COUNTER_ID,
      "reachGoal",
      "provider_click",
    );
  }
};
