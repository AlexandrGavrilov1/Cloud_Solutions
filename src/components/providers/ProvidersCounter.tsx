// src/components/providers/ProvidersCounter.tsx

interface ProvidersCounterProps {
  currentCount: number;
  totalCount: number;
  className?: string;
}

export const ProvidersCounter = ({
  currentCount,
  totalCount,
  className = "",
}: ProvidersCounterProps) => {
  return (
    <div
      className={`text-sm text-muted-foreground font-medium w-full sm:w-[200px] text-center sm:text-left ${className}`}
    >
      Показано: <span className="font-bold text-primary">{currentCount}</span>{" "}
      из <span className="font-bold text-primary">{totalCount}</span>{" "}
      провайдеров
    </div>
  );
};
