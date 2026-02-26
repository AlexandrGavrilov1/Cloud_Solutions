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
      className={`text-sm text-muted-foreground  w-full sm:w-[200px] text-center sm:text-left whitespace-nowrap ${className}`}
    >
      Показано: <span className=" text-[#FF931F]">{currentCount}</span> из{" "}
      <span className=" text-[#FF931F]">{totalCount}</span> провайдеров
    </div>
  );
};
