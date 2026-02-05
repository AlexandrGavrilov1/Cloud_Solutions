import { useState, useEffect } from "react";

interface MonthlyData {
  month: string;
  uptime: number;
  downtime: number;
  year?: number;
}

interface YearlyData {
  year: number;
  data: MonthlyData[];
}

interface MonthlyUptimeGraphProps {
  data: YearlyData[];
  providerId: number;
}

export const MonthlyUptimeGraph = ({
  data,
  providerId,
}: MonthlyUptimeGraphProps) => {
  const [selectedYear, setSelectedYear] = useState<number>(
    data[0]?.year || 2025,
  );

  if (!data || data.length === 0) return null;

  // Получаем данные для выбранного года
  const selectedYearData =
    data.find((y) => y.year === selectedYear)?.data || [];
  const availableYears = data.map((y) => y.year).sort((a, b) => b - a);
  const hasMultipleYears = availableYears.length > 1;

  return (
    <div className="border-t border-border pt-3 md:pt-4">
      {/* Заголовок с переключателем лет */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3 md:mb-4">
        <h4 className="text-xs md:text-sm font-bold text-foreground">
          График Uptime по месяцам {selectedYear}
        </h4>

        {hasMultipleYears && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Год:</span>
            <div className="flex bg-accent rounded-lg p-0.5">
              {availableYears.map((year) => (
                <button
                  key={year}
                  onClick={() => setSelectedYear(year)}
                  className={`px-2 py-1 rounded-md transition-colors text-xs ${
                    selectedYear === year
                      ? "bg-background text-foreground font-semibold shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {year}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="relative h-48 md:h-64 mb-2">
        {/* Ось Y */}
        <div className="absolute left-0 top-0 bottom-6 md:bottom-8 w-10 md:w-16 flex flex-col justify-between text-[7px] md:text-[9px] text-muted-foreground">
          {Array.from({ length: 81 }, (_, i) => (100.3 - i * 0.01).toFixed(2))
            .filter((_, idx) => idx % 8 === 0)
            .map((value, idx) => (
              <span key={idx}>{value}%</span>
            ))}
        </div>

        {/* График */}
        <div className="absolute left-[44px] md:left-[68px] right-0 top-0 bottom-6 md:bottom-8 border-l border-b border-border md:border-l-2 md:border-b-2">
          {/* Горизонтальные линии сетки */}
          {Array.from({ length: 11 }, (_, i) => i * 10).map((percent) => (
            <div
              key={percent}
              className="absolute left-0 right-0 border-t border-border/30"
              style={{ top: `${percent}%` }}
            ></div>
          ))}

          {/* Линейный график */}
          <div className="relative h-full">
            <svg
              className="w-full h-full"
              viewBox="0 0 1000 200"
              preserveAspectRatio="none"
            >
              {/* Вертикальные линии от точек до оси X (только десктоп) */}
              {selectedYearData.map((dataPoint, idx) => {
                const minUptime = 99.5;
                const maxUptime = 100.3;
                const normalizedHeight =
                  ((dataPoint.uptime - minUptime) / (maxUptime - minUptime)) *
                  100;
                const segmentWidth = 1000 / selectedYearData.length;
                const x = segmentWidth * idx + segmentWidth / 2;
                const y = 200 - (normalizedHeight / 100) * 200;

                return (
                  <line
                    key={`line-${idx}`}
                    x1={x}
                    y1={y}
                    x2={x}
                    y2={200}
                    stroke="darkgrey"
                    strokeWidth="12"
                    className="hidden md:block"
                    style={{
                      animation: `lineGrow 0.6s ease-out ${idx * 0.05}s both`,
                    }}
                  />
                );
              })}

              {/* Соединительная линия для мобильных */}
              <polyline
                points={selectedYearData
                  .map((dataPoint, idx) => {
                    const minUptime = 99.5;
                    const maxUptime = 100.3;
                    const normalizedHeight =
                      ((dataPoint.uptime - minUptime) /
                        (maxUptime - minUptime)) *
                      100;
                    const segmentWidth = 1000 / selectedYearData.length;
                    const x = segmentWidth * idx + segmentWidth / 2;
                    let y = 200 - (normalizedHeight / 100) * 200;
                    if (dataPoint.uptime < 99.5) {
                      y = 200;
                    }
                    return `${x},${y}`;
                  })
                  .join(" ")}
                fill="none"
                stroke="hsl(var(--primary))"
                strokeWidth="2"
                className="md:hidden"
                style={{
                  animation: `lineAppear 0.8s ease-out both`,
                }}
              />

              {/* Точки на графике */}
              {selectedYearData.map((dataPoint, idx) => {
                const minUptime = 99.5;
                const maxUptime = 100.3;
                const normalizedHeight =
                  ((dataPoint.uptime - minUptime) / (maxUptime - minUptime)) *
                  100;
                const segmentWidth = 1000 / selectedYearData.length;
                const x = segmentWidth * idx + segmentWidth / 2;
                let y = 200 - (normalizedHeight / 100) * 200;

                if (dataPoint.uptime < 99.5) {
                  y = 200;
                }

                let fillColor = "rgb(0, 128, 0)";
                if (dataPoint.uptime < 99.5) {
                  fillColor = "rgb(239, 68, 68)";
                } else if (dataPoint.uptime < 99.95) {
                  fillColor = "rgb(251, 146, 60)";
                }

                return (
                  <g key={`point-${idx}`}>
                    <circle
                      cx={x}
                      cy={y}
                      r="6"
                      className="hidden md:block md:r-[6]"
                      fill={fillColor}
                      stroke="darkgrey"
                      strokeWidth="1.5"
                      style={{
                        animation: `pointAppear 0.4s ease-out ${idx * 0.05 + 0.3}s both`,
                      }}
                    />
                    <text
                      x={x}
                      y={y - 8}
                      textAnchor="middle"
                      fontSize="9"
                      className="hidden md:block md:text-[10px]"
                      fill="currentColor"
                      fontWeight="600"
                      style={{
                        animation: `pointAppear 0.4s ease-out ${idx * 0.05 + 0.3}s both`,
                      }}
                    >
                      {dataPoint.uptime}
                    </text>
                    <title>
                      {dataPoint.month} {selectedYear}: {dataPoint.uptime}%
                    </title>
                  </g>
                );
              })}
            </svg>
          </div>
        </div>

        {/* Ось X - месяцы */}
        <div className="absolute left-[44px] md:left-[68px] right-0 bottom-0 flex justify-around text-[9px] md:text-xs text-muted-foreground">
          {selectedYearData.map((dataPoint, idx) => (
            <div key={idx} className="flex flex-col items-center flex-1">
              <span className="font-semibold">
                {dataPoint.month.slice(0, 3)}
              </span>
              {dataPoint.downtime > 0 && (
                <span className="text-[8px] md:text-[10px] text-red-500 font-medium mt-0.5">
                  {dataPoint.downtime} м
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Легенда */}
      <div className="flex flex-wrap items-center gap-2 md:gap-4 text-[10px] md:text-xs mt-3 md:mt-4 pt-2 border-t border-border">
        <div className="flex items-center gap-1 md:gap-1.5">
          <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded bg-green-500"></div>
          <span className="text-muted-foreground">100%</span>
        </div>
        <div className="flex items-center gap-1 md:gap-1.5">
          <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded bg-orange-500"></div>
          <span className="text-muted-foreground">99.5-99.99%</span>
        </div>
        <div className="flex items-center gap-1 md:gap-1.5">
          <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded bg-red-500"></div>
          <span className="text-muted-foreground">&lt; 99.5%</span>
        </div>
      </div>

      {/* Выбор года для мобильных (дополнительно) */}
      {hasMultipleYears && (
        <div className="mt-3 md:hidden">
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm"
          >
            {availableYears.map((year) => (
              <option key={year} value={year}>
                {year} год
              </option>
            ))}
          </select>
        </div>
      )}

      <style>{`
        @keyframes lineGrow {
          from {
            y2: attr(y1);
            opacity: 0;
          }
          to {
            opacity: 0.2;
          }
        }

        @keyframes lineAppear {
          from {
            stroke-dasharray: 1000;
            stroke-dashoffset: 1000;
            opacity: 0;
          }
          to {
            stroke-dashoffset: 0;
            opacity: 1;
          }
        }

        @keyframes pointAppear {
          from {
            opacity: 0;
            transform: scale(0);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
};
