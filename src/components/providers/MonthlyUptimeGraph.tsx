import { useState, useEffect } from "react";
import Icon from "@/components/ui/icon";

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
  isExpanded: boolean;
}

export const MonthlyUptimeGraph: React.FC<MonthlyUptimeGraphProps> = ({
  data,
  providerId,
  isExpanded,
}) => {
  const [hoveredMonth, setHoveredMonth] = useState<string | null>(null);
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1200,
  );
  const [selectedYear, setSelectedYear] = useState<number>(
    data[0]?.year || new Date().getFullYear(),
  );
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (!data || data.length === 0) return null;

  // Получаем данные для выбранного года
  const selectedYearData =
    data.find((y) => y.year === selectedYear)?.data || [];
  const availableYears = data.map((y) => y.year).sort((a, b) => b - a);

  // Определяем тип отображения
  const getDisplayType = () => {
    if (!isExpanded) return "compact";
    if (windowWidth < 640) return "mobile";
    if (windowWidth < 1024) return "tablet";
    return "desktop";
  };

  const displayType = getDisplayType();
  const isCompact = displayType === "compact";
  const isMobile = displayType === "mobile";
  const isTablet = displayType === "tablet";
  const isDesktop = displayType === "desktop";

  // Получаем видимые данные
  const getVisibleData = () => {
    if (!isExpanded) return selectedYearData.slice(-3);
    if (isMobile) return selectedYearData;
    return selectedYearData;
  };

  const visibleData = getVisibleData();

  // Рассчитываем статистику
  const yearlyStats = data.map((yearData) => {
    const avgUptime =
      yearData.data.reduce((sum, month) => sum + month.uptime, 0) /
      yearData.data.length;
    const totalDowntime = yearData.data.reduce(
      (sum, month) => sum + month.downtime,
      0,
    );
    return {
      year: yearData.year,
      avgUptime,
      totalDowntime,
    };
  });

  // Получаем цвет для линии
  const getLineColor = (uptime: number) => {
    if (uptime >= 99.95) return "stroke-primary"; // Основной цвет
    if (uptime >= 99.9) return "stroke-primary/80";
    if (uptime >= 99.5) return "stroke-primary/60";
    if (uptime >= 99) return "stroke-primary/40";
    return "stroke-destructive";
  };

  // Получаем цвет для точки
  const getPointColor = (uptime: number) => {
    if (uptime >= 99.95) return "fill-primary"; // Основной цвет
    if (uptime >= 99.9) return "fill-primary/80";
    if (uptime >= 99.5) return "fill-primary/60";
    if (uptime >= 99) return "fill-primary/40";
    return "fill-destructive";
  };

  // Рассчитываем позицию Y
  const calculateYPosition = (uptime: number, height: number) => {
    // Преобразуем uptime в позицию на графике (99.5% - 100%)
    const minUptime = 99.5;
    const maxUptime = 100;
    const normalizedUptime = Math.max(minUptime, Math.min(uptime, maxUptime));
    const percentage =
      ((normalizedUptime - minUptime) / (maxUptime - minUptime)) * 100;
    return height - (height * percentage) / 100;
  };

  // Получаем размеры
  const getDimensions = () => {
    if (isCompact) {
      return {
        height: 80,
        width: "w-full",
        fontSize: "text-[9px]",
        labelFontSize: "text-[8px]",
        showLabels: false,
        showGrid: false,
        showValues: false,
      };
    }

    if (isMobile) {
      return {
        height: 120,
        width: "w-full",
        fontSize: "text-[10px]",
        labelFontSize: "text-[9px]",
        showLabels: true,
        showGrid: false,
        showValues: true,
      };
    }

    if (isTablet) {
      return {
        height: 160,
        width: "w-full",
        fontSize: "text-[11px]",
        labelFontSize: "text-[10px]",
        showLabels: true,
        showGrid: true,
        showValues: true,
      };
    }

    return {
      height: 200,
      width: "w-full",
      fontSize: "text-xs",
      labelFontSize: "text-[11px]",
      showLabels: true,
      showGrid: true,
      showValues: true,
    };
  };

  const dimensions = getDimensions();
  const pointRadius = isCompact ? 2 : isMobile ? 3 : 4;
  const strokeWidth = isCompact ? 1.5 : isMobile ? 2 : isTablet ? 2.5 : 3;

  // Генерируем точки для линии
  const generatePathData = () => {
    const points = visibleData.map((item, index) => {
      const x = (index / (visibleData.length - 1)) * 100;
      const y = calculateYPosition(item.uptime, dimensions.height);
      return `${x},${y}`;
    });

    return `M ${points.join(" L ")}`;
  };

  return (
    <div className="w-full">
      {/* Заголовок с переключателем лет */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2 gap-2">
        <h4
          className={`font-bold text-foreground ${isMobile ? "text-sm" : "text-base"}`}
        >
          Статистика доступности
        </h4>

        {availableYears.length > 1 && (
          <div className="flex items-center gap-2">
            <span
              className={`${isMobile ? "text-[10px]" : "text-xs"} text-muted-foreground`}
            >
              Показать за:
            </span>
            <div className="flex bg-accent rounded-lg p-0.5">
              {availableYears.map((year) => (
                <button
                  key={year}
                  onClick={() => setSelectedYear(year)}
                  className={`px-2 py-1 rounded-md transition-colors ${
                    isMobile ? "text-[10px]" : "text-xs"
                  } ${
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

      {/* График */}
      <div
        className={`relative ${dimensions.width}`}
        style={{ height: `${dimensions.height}px` }}
      >
        {/* Сетка */}
        {dimensions.showGrid && (
          <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
            {[100, 99.9, 99.8, 99.7, 99.6, 99.5].map((line, idx) => (
              <div
                key={idx}
                className="relative w-full border-t border-border/20"
              >
                <span className="absolute left-0 -top-2.5 text-[9px] text-muted-foreground">
                  {line}%
                </span>
              </div>
            ))}
          </div>
        )}

        {/* SVG для графика */}
        <svg
          className="w-full h-full"
          viewBox={`0 0 100 ${dimensions.height}`}
          preserveAspectRatio="none"
        >
          {/* Линия графика */}
          <path
            d={generatePathData()}
            fill="none"
            className="stroke-primary"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Точки на графике */}
          {visibleData.map((item, index) => {
            const x = (index / (visibleData.length - 1)) * 100;
            const y = calculateYPosition(item.uptime, dimensions.height);
            const isHovered = hoveredMonth === `${item.month}-${selectedYear}`;
            const pointColor = getPointColor(item.uptime);

            return (
              <g key={index}>
                {/* Большая точка при наведении */}
                {isHovered && (
                  <circle
                    cx={x}
                    cy={y}
                    r={pointRadius * 2}
                    className="fill-primary/20"
                  />
                )}

                {/* Основная точка */}
                <circle
                  cx={x}
                  cy={y}
                  r={pointRadius}
                  className={pointColor}
                  onMouseEnter={() =>
                    setHoveredMonth(`${item.month}-${selectedYear}`)
                  }
                  onMouseLeave={() => setHoveredMonth(null)}
                  style={{ cursor: "pointer" }}
                />

                {/* Индикатор downtime */}
                {item.downtime > 0 && (
                  <circle
                    cx={x}
                    cy={y}
                    r={pointRadius * 0.7}
                    className="fill-destructive animate-pulse"
                  />
                )}
              </g>
            );
          })}
        </svg>

        {/* Подписи месяцев */}
        {dimensions.showLabels && !isCompact && (
          <div className="absolute bottom-0 left-0 right-0 flex justify-between">
            {visibleData.map((item, index) => (
              <div
                key={index}
                className={`${dimensions.labelFontSize} text-muted-foreground`}
                style={{
                  transform: "translateX(-50%)",
                  position: "absolute",
                  left: `${(index / (visibleData.length - 1)) * 100}%`,
                  bottom: "-20px",
                }}
                onMouseEnter={() =>
                  setHoveredMonth(`${item.month}-${selectedYear}`)
                }
                onMouseLeave={() => setHoveredMonth(null)}
              >
                {isMobile ? item.month.substring(0, 3) : item.month}
              </div>
            ))}
          </div>
        )}

        {/* Всплывающая подсказка */}
        {hoveredMonth && !isCompact && (
          <div
            className="fixed md:absolute bg-background border border-border shadow-lg rounded-lg p-3 z-50 pointer-events-none"
            style={{
              top: "10px",
              left: "50%",
              transform: "translateX(-50%)",
            }}
          >
            <div className="text-xs font-bold text-foreground">
              {selectedYear}, {hoveredMonth.split("-")[0]}
            </div>
            <div className="mt-1">
              <div className="text-[10px] text-muted-foreground">
                Uptime:{" "}
                <span className="font-bold text-foreground">
                  {selectedYearData
                    .find((d) => `${d.month}-${selectedYear}` === hoveredMonth)
                    ?.uptime.toFixed(2)}
                  %
                </span>
              </div>
              <div className="text-[10px] text-muted-foreground">
                Простой:{" "}
                <span className="font-bold text-foreground">
                  {
                    selectedYearData.find(
                      (d) => `${d.month}-${selectedYear}` === hoveredMonth,
                    )?.downtime
                  }{" "}
                  мин
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Годовая статистика для мобильных */}
      {isMobile && availableYears.length > 1 && (
        <div className="mt-3">
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

      {/* Легенда */}
      {isDesktop && (
        <div className="mt-4 flex flex-wrap items-center justify-center gap-3 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-primary"></div>
            <span>Отличный (≥ 99.95%)</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-destructive"></div>
            <span>Низкий (&lt; 99%)</span>
          </div>
        </div>
      )}
    </div>
  );
};
