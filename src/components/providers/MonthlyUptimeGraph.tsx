interface MonthlyData {
  month: string;
  uptime: number;
  downtime: number;
}

interface MonthlyUptimeGraphProps {
  data: MonthlyData[];
  providerId: number;
}

export const MonthlyUptimeGraph = ({
  data,
  providerId,
}: MonthlyUptimeGraphProps) => {
  return (
    <div className="border-t border-border pt-4">
      <h4 className="text-sm font-bold text-foreground mb-4">
        График Uptime по месяцам 2025
      </h4>

      <div className="relative h-64 mb-2">
        {/* Ось Y */}
        <div className="absolute left-0 top-0 bottom-8 w-16 flex flex-col justify-between text-[9px] text-muted-foreground">
          {Array.from({ length: 81 }, (_, i) => (100.3 - i * 0.01).toFixed(2))
            .filter((_, idx) => idx % 8 === 0)
            .map((value, idx) => (
              <span key={idx}>{value}%</span>
            ))}
        </div>

        {/* График */}
        <div className="absolute left-[68px] right-0 top-0 bottom-8 border-l-2 border-b-2 border-border">
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
              {/* Вертикальные линии от точек до оси X */}
              {data.map((dataPoint, idx) => {
                const minUptime = 99.5;
                const maxUptime = 100.3;
                const normalizedHeight =
                  ((dataPoint.uptime - minUptime) / (maxUptime - minUptime)) *
                  100;
                const segmentWidth = 1000 / data.length;
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
                    // opacity="0.5"
                    style={{
                      animation: `lineGrow 0.6s ease-out ${idx * 0.05}s both`,
                    }}
                  />
                );
              })}

              {/* Точки на графике */}
              {data.map((dataPoint, idx) => {
                const minUptime = 99.5;
                const maxUptime = 100.3;
                const normalizedHeight =
                  ((dataPoint.uptime - minUptime) / (maxUptime - minUptime)) *
                  100;
                const segmentWidth = 1000 / data.length;
                const x = segmentWidth * idx + segmentWidth / 2;
                let y = 200 - (normalizedHeight / 100) * 200;

                const isProvider14JuneOrSeptember =
                  providerId === 14 && (idx === 5 || idx === 8);
                const isProvider15 = providerId === 15 && idx >= 7;
                const isProvider7May = providerId === 7 && idx === 4;

                if (dataPoint.uptime < 99.5) {
                  y = 200;
                }
                // if (
                //   isProvider14JuneOrSeptember ||
                //   isProvider15 ||
                //   isProvider7May
                // ) {
                //   y = 200;
                // }

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
                      fill={fillColor}
                      stroke="darkgrey"
                      strokeWidth="2"
                      style={{
                        animation: `pointAppear 0.4s ease-out ${idx * 0.05 + 0.3}s both`,
                      }}
                    />
                    <text
                      x={x}
                      y={y - 12}
                      textAnchor="middle"
                      fontSize="10"
                      fill="currentColor"
                      fontWeight="600"
                      style={{
                        animation: `pointAppear 0.4s ease-out ${idx * 0.05 + 0.3}s both`,
                      }}
                    >
                      {dataPoint.uptime}
                    </text>
                    <title>
                      {dataPoint.month}: {dataPoint.uptime}%
                    </title>
                  </g>
                );
              })}
            </svg>
          </div>
        </div>

        {/* Ось X - месяцы */}
        <div className="absolute left-[68px] right-0 bottom-0 flex justify-around text-xs text-muted-foreground">
          {data.map((dataPoint, idx) => (
            <div key={idx} className="flex flex-col items-center flex-1">
              <span className="font-semibold">
                {dataPoint.month.slice(0, 3)}
              </span>
              {dataPoint.downtime > 0 && (
                <span className="text-[10px] text-red-500 font-medium mt-0.5">
                  {dataPoint.downtime} мин
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Легенда */}
      <div className="flex items-center gap-4 text-xs mt-4 pt-2 border-t border-border">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-green-500"></div>
          <span className="text-muted-foreground">100% uptime</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-orange-500"></div>
          <span className="text-muted-foreground">99.5-99.99%</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-red-500"></div>
          <span className="text-muted-foreground">&lt; 99.5%</span>
        </div>
      </div>

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
