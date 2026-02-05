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
    if (isMobile) return selectedYearData.slice(-6);
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

  const maxUptime = Math.max(...selectedYearData.map((d) => d.uptime));
  const minUptime = Math.min(...selectedYearData.map((d) => d.uptime));

  // Получаем цвет для бара
  const getBarColor = (uptime: number) => {
    if (uptime >= 99.95) return "bg-green-500";
    if (uptime >= 99.9) return "bg-green-400";
    if (uptime >= 99.5) return "bg-yellow-400";
    if (uptime >= 99) return "bg-orange-400";
    return "bg-red-500";
  };

  // Получаем цвет для текста
  const getTextColor = (uptime: number) => {
    if (uptime >= 99.95) return "text-green-600 dark:text-green-400";
    if (uptime >= 99.9) return "text-green-500 dark:text-green-300";
    if (uptime >= 99.5) return "text-yellow-600 dark:text-yellow-400";
    if (uptime >= 99) return "text-orange-600 dark:text-orange-400";
    return "text-red-600 dark:text-red-400";
  };

  // Рассчитываем высоту бара
  const calculateBarHeight = (uptime: number) => {
    const baseHeight = isCompact ? 20 : 100;
    const percentage =
      ((uptime - minUptime) / (maxUptime - minUptime)) * 70 + 30;
    return Math.max((percentage * baseHeight) / 100, 8);
  };

  // Получаем размеры
  const getDimensions = () => {
    if (isCompact) {
      return {
        barWidth: 20,
        barSpacing: 8,
        fontSize: "text-[9px]",
        labelFontSize: "text-[8px]",
        containerHeight: "h-32",
        showLabels: false,
        showGrid: false,
        showValues: false,
      };
    }

    if (isMobile) {
      return {
        barWidth: 24,
        barSpacing: 12,
        fontSize: "text-[10px]",
        labelFontSize: "text-[9px]",
        containerHeight: "h-40",
        showLabels: true,
        showGrid: false,
        showValues: true,
      };
    }

    if (isTablet) {
      return {
        barWidth: 28,
        barSpacing: 16,
        fontSize: "text-[11px]",
        labelFontSize: "text-[10px]",
        containerHeight: "h-48",
        showLabels: true,
        showGrid: true,
        showValues: true,
      };
    }

    return {
      barWidth: 32,
      barSpacing: 20,
      fontSize: "text-xs",
      labelFontSize: "text-[11px]",
      containerHeight: "h-56",
      showLabels: true,
      showGrid: true,
      showValues: true,
    };
  };

  const dimensions = getDimensions();

  return (
    <div className="w-full">
      {/* Заголовок с переключателем лет */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2 gap-2">
        <h4
          className={`font-bold text-foreground ${isMobile ? "text-sm" : "text-base"}`}
        >
          Статистика доступности за {selectedYear} год
        </h4>

        {availableYears.length > 1 && (
          <div className="flex items-center gap-2">
            <span
              className={`${isMobile ? "text-[10px]" : "text-xs"} text-muted-foreground`}
            >
              Год:
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

      {/* Сводка по годам */}
      {isDesktop && yearlyStats.length > 1 && (
        <div className="mb-4 grid grid-cols-3 gap-2 text-xs">
          {yearlyStats.map((stat) => (
            <div
              key={stat.year}
              className={`bg-background border rounded-lg p-2 cursor-pointer transition-colors ${
                selectedYear === stat.year
                  ? "border-primary"
                  : "border-border hover:border-primary/50"
              }`}
              onClick={() => setSelectedYear(stat.year)}
            >
              <div className="flex justify-between items-center">
                <span className="font-semibold">{stat.year}</span>
                <span className={getTextColor(stat.avgUptime)}>
                  {stat.avgUptime.toFixed(2)}%
                </span>
              </div>
              <div className="text-[10px] text-muted-foreground mt-1">
                Простой: {stat.totalDowntime} мин
              </div>
            </div>
          ))}
        </div>
      )}

      {/* График */}
      <div className={`relative ${dimensions.containerHeight} w-full`}>
        {/* Сетка */}
        {dimensions.showGrid && (
          <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
            {[100, 99.9, 99.8, 99.7, 99.6, 99.5].map((line, idx) => (
              <div
                key={idx}
                className="relative w-full border-t border-border/30"
              >
                <span className="absolute left-0 -top-2.5 text-[9px] text-muted-foreground">
                  {line}%
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Бары */}
        <div className="relative h-full flex items-end justify-between px-2">
          {visibleData.map((item, index) => {
            const barHeight = calculateBarHeight(item.uptime);
            const barColor = getBarColor(item.uptime);
            const isHovered = hoveredMonth === `${item.month}-${selectedYear}`;

            return (
              <div
                key={index}
                className="flex flex-col items-center"
                style={{
                  width: `${dimensions.barWidth}px`,
                  margin: `0 ${dimensions.barSpacing / 2}px`,
                }}
                onMouseEnter={() =>
                  setHoveredMonth(`${item.month}-${selectedYear}`)
                }
                onMouseLeave={() => setHoveredMonth(null)}
              >
                {/* Значение uptime */}
                {dimensions.showValues && (
                  <div
                    className={`mb-1 ${dimensions.fontSize} font-semibold ${getTextColor(item.uptime)}`}
                  >
                    {item.uptime.toFixed(2)}%
                  </div>
                )}

                {/* Бар */}
                <div className="relative w-full">
                  <div
                    className={`w-full ${barColor} rounded-t-md transition-all duration-200 ${
                      isHovered ? "opacity-90" : "opacity-100"
                    }`}
                    style={{
                      height: `${barHeight}px`,
                      minHeight: "8px",
                    }}
                  >
                    {/* Индикатор downtime */}
                    {item.downtime > 0 && (
                      <div className="absolute -top-1 left-1/2 transform -translate-x-1/2">
                        <div className="bg-red-500 text-white text-[8px] font-bold px-1 py-0.5 rounded-full whitespace-nowrap">
                          {item.downtime}м
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Месяц */}
                {dimensions.showLabels && (
                  <div
                    className={`mt-2 ${dimensions.labelFontSize} text-muted-foreground truncate w-full text-center`}
                  >
                    {isMobile ? item.month.substring(0, 3) : item.month}
                  </div>
                )}
              </div>
            );
          })}

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
                      .find(
                        (d) => `${d.month}-${selectedYear}` === hoveredMonth,
                      )
                      ?.uptime.toFixed(2)}
                    %
                  </span>
                </div>
                <div className="text-[10px] text-muted-foreground">
                  Downtime:{" "}
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
      </div>

      {/* Легенда */}
      {isDesktop && (
        <div className="mt-4 flex flex-wrap items-center justify-center gap-3 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span>≥ 99.95%</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-green-400"></div>
            <span>≥ 99.9%</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
            <span>≥ 99.5%</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-orange-400"></div>
            <span>≥ 99%</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <span>&lt; 99%</span>
          </div>
        </div>
      )}

      {/* Годовая статистика для мобильных */}
      {isMobile && yearlyStats.length > 1 && (
        <div className="mt-3">
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm"
          >
            {availableYears.map((year) => (
              <option key={year} value={year}>
                {year} год - Средний uptime:{" "}
                {yearlyStats.find((s) => s.year === year)?.avgUptime.toFixed(2)}
                %
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
};
