import { Provider } from "./types";
import Icon from "@/components/ui/icon";
import { MonthlyUptimeGraph } from "./MonthlyUptimeGraph";

interface UptimeProviderCardProps {
  provider: Provider;
  index: number;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onProviderClick: () => void;
  getDowntimeMinutes: (uptime: number) => string;
  windowWidth: number;
}

export const getStaticMonthlyData = (providerId: number) => {
  // Данные за 2025 год
  const data2025 = [];
  // Данные за 2026 год (пока только январь)
  const data2026 = [];

  if (providerId === 1) {
    data2025.push(
      { month: "Январь", uptime: 99.99, downtime: 3, year: 2025 },
      { month: "Февраль", uptime: 99.98, downtime: 9, year: 2025 },
      { month: "Март", uptime: 100, downtime: 0, year: 2025 },
      { month: "Апрель", uptime: 100, downtime: 0, year: 2025 },
      { month: "Май", uptime: 99.99, downtime: 3, year: 2025 },
      { month: "Июнь", uptime: 99.98, downtime: 9, year: 2025 },
      { month: "Июль", uptime: 100, downtime: 0, year: 2025 },
      { month: "Август", uptime: 99.99, downtime: 3, year: 2025 },
      { month: "Сентябрь", uptime: 99.99, downtime: 6, year: 2025 },
      { month: "Октябрь", uptime: 99.98, downtime: 6, year: 2025 },
      { month: "Ноябрь", uptime: 99.99, downtime: 6, year: 2025 },
      { month: "Декабрь", uptime: 99.99, downtime: 3, year: 2025 },
    );

    // Добавляем данные за январь 2026
    data2026.push({ month: "Январь", uptime: 99.99, downtime: 3, year: 2026 });
  } else if (providerId === 2) {
    data2025.push(
      { month: "Январь", uptime: 99.99, downtime: 6, year: 2025 },
      { month: "Февраль", uptime: 100, downtime: 0, year: 2025 },
      { month: "Март", uptime: 100, downtime: 0, year: 2025 },
      { month: "Апрель", uptime: 100, downtime: 0, year: 2025 },
      { month: "Май", uptime: 100, downtime: 0, year: 2025 },
      { month: "Июнь", uptime: 100, downtime: 0, year: 2025 },
      { month: "Июль", uptime: 99.98, downtime: 9, year: 2025 },
      { month: "Август", uptime: 100, downtime: 0, year: 2025 },
      { month: "Сентябрь", uptime: 100, downtime: 0, year: 2025 },
      { month: "Октябрь", uptime: 99.99, downtime: 3, year: 2025 },
      { month: "Ноябрь", uptime: 100, downtime: 0, year: 2025 },
      { month: "Декабрь", uptime: 99.99, downtime: 6, year: 2025 },
    );

    // Пример для провайдера 2 за 2026
    data2026.push({ month: "Январь", uptime: 99.98, downtime: 9, year: 2026 });
  } else if (providerId === 3) {
    data2025.push(
      { month: "Январь", uptime: 99.81, downtime: 84, year: 2025 },
      { month: "Февраль", uptime: 99.93, downtime: 30, year: 2025 },
      { month: "Март", uptime: 99.89, downtime: 48, year: 2025 },
      { month: "Апрель", uptime: 99.9, downtime: 45, year: 2025 },
      { month: "Май", uptime: 99.78, downtime: 93, year: 2025 },
      { month: "Июнь", uptime: 100, downtime: 0, year: 2025 },
      { month: "Июль", uptime: 100, downtime: 0, year: 2025 },
      { month: "Август", uptime: 100, downtime: 0, year: 2025 },
      { month: "Сентябрь", uptime: 99.99, downtime: 3, year: 2025 },
      { month: "Октябрь", uptime: 99.99, downtime: 3, year: 2025 },
      { month: "Ноябрь", uptime: 99.99, downtime: 6, year: 2025 },
      { month: "Декабрь", uptime: 99.99, downtime: 6, year: 2025 },
    );
  } else if (providerId === 5) {
    data2025.push(
      { month: "Январь", uptime: 99.7, downtime: 135, year: 2025 },
      { month: "Февраль", uptime: 99.51, downtime: 195, year: 2025 },
      { month: "Март", uptime: 99.84, downtime: 69, year: 2025 },
      { month: "Апрель", uptime: 99.9, downtime: 45, year: 2025 },
      { month: "Май", uptime: 99.8, downtime: 90, year: 2025 },
      { month: "Июнь", uptime: 99.84, downtime: 69, year: 2025 },
      { month: "Июль", uptime: 99.78, downtime: 96, year: 2025 },
      { month: "Август", uptime: 99.91, downtime: 39, year: 2025 },
      { month: "Сентябрь", uptime: 99.95, downtime: 21, year: 2025 },
      { month: "Октябрь", uptime: 99.81, downtime: 84, year: 2025 },
      { month: "Ноябрь", uptime: 99.92, downtime: 33, year: 2025 },
      { month: "Декабрь", uptime: 99.95, downtime: 21, year: 2025 },
    );
  } else if (providerId === 6) {
    data2025.push(
      { month: "Январь", uptime: 100, downtime: 0, year: 2025 },
      { month: "Февраль", uptime: 99.97, downtime: 12, year: 2025 },
      { month: "Март", uptime: 99.97, downtime: 12, year: 2025 },
      { month: "Апрель", uptime: 99.99, downtime: 3, year: 2025 },
      { month: "Май", uptime: 99.97, downtime: 15, year: 2025 },
      { month: "Июнь", uptime: 99.98, downtime: 9, year: 2025 },
      { month: "Июль", uptime: 99.99, downtime: 6, year: 2025 },
      { month: "Август", uptime: 99.97, downtime: 15, year: 2025 },
      { month: "Сентябрь", uptime: 99.97, downtime: 12, year: 2025 },
      { month: "Октябрь", uptime: 100, downtime: 0, year: 2025 },
      { month: "Ноябрь", uptime: 100, downtime: 0, year: 2025 },
      { month: "Декабрь", uptime: 99.97, downtime: 12, year: 2025 },
    );
  }
  // ... остальные провайдеры (можно добавить данные за 2026 по аналогии)

  // Собираем данные по годам
  const yearlyData = [];

  if (data2025.length > 0) {
    yearlyData.push({
      year: 2025,
      data: data2025,
    });
  }

  if (data2026.length > 0) {
    yearlyData.push({
      year: 2026,
      data: data2026,
    });
  }

  return yearlyData;
};

export const calculateTotalDowntime = (
  providerId: number,
  year?: number,
): number => {
  const yearlyData = getStaticMonthlyData(providerId);

  if (year) {
    const yearData = yearlyData.find((y) => y.year === year);
    if (
      !yearData ||
      !Array.isArray(yearData.data) ||
      yearData.data.length === 0
    )
      return 0;
    return yearData.data.reduce((sum, month) => sum + month.downtime, 0);
  }

  // Если год не указан, считаем за все годы
  return yearlyData.reduce((total, yearData) => {
    return (
      total + yearData.data.reduce((sum, month) => sum + month.downtime, 0)
    );
  }, 0);
};

export const calculateAverageUptime = (
  providerId: number,
  year?: number,
): number => {
  const yearlyData = getStaticMonthlyData(providerId);

  if (year) {
    const yearData = yearlyData.find((y) => y.year === year);
    if (
      !yearData ||
      !Array.isArray(yearData.data) ||
      yearData.data.length === 0
    )
      return 0;
    return (
      yearData.data.reduce((sum, month) => sum + month.uptime, 0) /
      yearData.data.length
    );
  }

  // Если год не указан, считаем среднее за все годы
  const allData = yearlyData.flatMap((y) => y.data);
  if (allData.length === 0) return 0;
  return allData.reduce((sum, month) => sum + month.uptime, 0) / allData.length;
};

export const UptimeProviderCard: React.FC<UptimeProviderCardProps> = ({
  provider,
  index,
  isExpanded,
  onToggleExpand,
  onProviderClick,
  getDowntimeMinutes,
  windowWidth,
}) => {
  const getUptimeColorClass = (uptime: number) => {
    if (uptime >= 99.99) return "text-green-400";
    if (uptime >= 99.9) return "text-green-300";
    if (uptime >= 99.5) return "text-yellow-400";
    if (uptime >= 99) return "text-orange-400";
    return "text-red-400";
  };

  const getUptimeBarColorClass = (uptime: number) => {
    if (uptime >= 99.99) return "bg-green-500";
    if (uptime >= 99.9) return "bg-green-400";
    if (uptime >= 99.5) return "bg-yellow-400";
    if (uptime >= 99) return "bg-orange-400";
    return "bg-red-500";
  };

  const yearlyData = getStaticMonthlyData(provider.id);
  const uptime = provider.uptime30days ?? 0;
  const totalDowntime = calculateTotalDowntime(provider.id);
  const averageUptime = calculateAverageUptime(provider.id);

  const shouldShowGraph =
    provider.id === 1 ||
    provider.id === 2 ||
    provider.id === 3 ||
    provider.id === 5 ||
    provider.id === 6 ||
    provider.id === 7 ||
    provider.id === 9 ||
    provider.id === 10 ||
    provider.id === 11 ||
    provider.id === 12 ||
    provider.id === 13 ||
    provider.id === 14 ||
    provider.id === 15 ||
    provider.id === 18 ||
    provider.id === 19 ||
    provider.id === 20 ||
    provider.id === 21 ||
    provider.id === 22 ||
    provider.id === 23 ||
    provider.id === 32 ||
    provider.id === 49;

  // Определяем размер экрана
  const getCardLayout = () => {
    if (windowWidth < 640) return "mobile";
    if (windowWidth < 1024) return "tablet";
    return "desktop";
  };

  const layout = getCardLayout();
  const isMobile = layout === "mobile";

  // Получаем список доступных лет
  const availableYears = yearlyData.map((y) => y.year);
  const hasMultipleYears = availableYears.length > 1;

  return (
    <div
      key={provider.id}
      className={`group bg-background border border-border rounded-lg md:rounded-xl p-3 md:p-4 hover:border-primary/50 transition-all relative ${
        isExpanded && layout !== "mobile" ? "md:col-span-2" : ""
      } ${isExpanded ? "shadow-lg" : ""}`}
    >
      {index < 3 && (
        <div
          className={`absolute ${
            isMobile
              ? "-top-1 -left-1 w-6 h-6"
              : layout === "tablet"
                ? "-top-2 -left-2 w-8 h-8"
                : "-top-3 -left-3 w-12 h-12"
          } rounded-full flex items-center justify-center shadow-lg`}
        >
          <div className="relative flex items-center justify-center">
            <Icon
              name="Cloud"
              size={isMobile ? 24 : layout === "tablet" ? 28 : 32}
              className={
                index === 0
                  ? "text-yellow-500"
                  : index === 1
                    ? "text-gray-400"
                    : "text-amber-700"
              }
              style={{
                filter:
                  index === 0
                    ? "drop-shadow(0 0 8px rgba(234, 179, 8, 0.7))"
                    : index === 1
                      ? "drop-shadow(0 0 8px rgba(156, 163, 175, 0.7))"
                      : "drop-shadow(0 0 8px rgba(180, 83, 9, 0.7))",
              }}
            />
            <span
              className={`absolute ${
                isMobile
                  ? "text-[8px]"
                  : layout === "tablet"
                    ? "text-[10px]"
                    : "text-xs"
              } font-bold ${
                index === 0
                  ? "text-yellow-600"
                  : index === 1
                    ? "text-gray-500"
                    : "text-amber-800"
              }`}
              style={{
                marginTop: isMobile ? "1px" : "2px",
                marginLeft: isMobile ? "-5%" : "-10%",
              }}
            >
              {index + 1}
            </span>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div
          className="flex items-center gap-2 md:gap-3 flex-1 min-w-0"
          style={{ marginLeft: index < 3 ? (isMobile ? "24px" : "32px") : "0" }}
        >
          <div
            className={`flex-shrink-0 ${
              isMobile
                ? "w-6 h-6"
                : layout === "tablet"
                  ? "w-8 h-8"
                  : "w-10 h-10"
            } rounded-lg overflow-hidden bg-white border border-primary/10 flex items-center justify-center`}
          >
            <img
              src={provider.logo}
              alt={provider.name}
              className={`${
                isMobile
                  ? "w-4 h-4"
                  : layout === "tablet"
                    ? "w-6 h-6"
                    : "w-8 h-8"
              } object-contain`}
            />
          </div>
          <div className="flex-1 min-w-0">
            <button
              onClick={onProviderClick}
              className={`${
                isMobile ? "text-xs" : "text-sm md:text-base"
              } font-bold text-foreground truncate hover:text-primary transition-colors flex items-center gap-1 group/name`}
            >
              {provider.name}
              <Icon
                name="ExternalLink"
                size={isMobile ? 10 : 12}
                className="opacity-0 group-hover/name:opacity-100 transition-opacity"
              />
            </button>
            <div
              className={`flex flex-wrap items-center gap-1 ${
                isMobile ? "text-[9px]" : "text-[10px] md:text-xs"
              } text-muted-foreground`}
            >
              <span>SLA: {provider.serviceGuarantees.uptimeSLA}</span>
              {hasMultipleYears && (
                <span className="inline-flex items-center gap-1">
                  <span className="hidden sm:inline">•</span>
                  <span className="px-1.5 py-0.5 bg-primary/10 text-primary rounded text-[9px] font-semibold">
                    {availableYears.length} год
                    {availableYears.length > 1 ? "а" : ""}
                  </span>
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 md:gap-3">
          <div className="flex flex-col items-end">
            <div
              className={`${
                isMobile ? "text-sm" : "text-base md:text-xl"
              } font-black ${getUptimeColorClass(uptime)}`}
            >
              {uptime.toFixed(2)}%
            </div>
            {hasMultipleYears && !isMobile && (
              <div className="text-[9px] text-muted-foreground">
                Среднее: {averageUptime.toFixed(2)}%
              </div>
            )}
          </div>
          <button
            onClick={onToggleExpand}
            className="p-1 md:p-1.5 hover:bg-accent rounded-lg transition-colors"
            aria-label={isExpanded ? "Свернуть детали" : "Развернуть детали"}
          >
            <Icon
              name={isExpanded ? "ChevronUp" : "ChevronDown"}
              size={isMobile ? 14 : 16}
              className="text-muted-foreground"
            />
          </button>
        </div>
      </div>

      {/* Прогресс бар */}
      <div
        className={`mt-2 ${isMobile ? "h-1.5" : "h-2"} w-full bg-accent rounded-full overflow-hidden`}
      >
        <div
          className={`h-full ${getUptimeBarColorClass(uptime)} rounded-full transition-all duration-500`}
          style={{ width: `${Math.min(uptime * 0.95, 100)}%` }}
        />
      </div>

      {isExpanded && (
        <div
          className={`mt-3 md:mt-4 pt-3 md:pt-4 border-t border-border space-y-3 md:space-y-4`}
        >
          <div
            className={`${
              isMobile ? "text-[10px]" : "text-[11px] md:text-xs"
            } text-muted-foreground`}
          >
            <div className="flex justify-between py-1">
              <span>SLA гарантия:</span>
              <span className="font-semibold text-foreground">
                {provider.serviceGuarantees.uptimeSLA}
              </span>
            </div>
            <div className="flex justify-between py-1">
              <span>Время ответа поддержки:</span>
              <span className="font-semibold text-foreground">
                {provider.serviceGuarantees.supportResponseTime}
              </span>
            </div>
            <div className="flex justify-between py-1">
              <span>Простой за 30 дней:</span>
              <span className="font-semibold text-foreground">
                {getDowntimeMinutes(uptime)}
              </span>
            </div>
            {totalDowntime > 0 && (
              <div className="flex justify-between py-1">
                <span>
                  Суммарный простой за{" "}
                  {hasMultipleYears ? "все года" : "2025 год"}:
                </span>
                <span className="font-semibold text-foreground">
                  {totalDowntime} мин
                </span>
              </div>
            )}
          </div>

          {shouldShowGraph && (
            <div
              className={`${
                isMobile ? "pt-2" : "pt-4"
              } border-t border-border/50`}
            >
              <MonthlyUptimeGraph
                data={yearlyData}
                providerId={provider.id}
                isExpanded={isExpanded}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};
