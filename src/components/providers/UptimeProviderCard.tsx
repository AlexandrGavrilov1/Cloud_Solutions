import { Provider } from "./types";
import Icon from "@/components/ui/icon";
import { MonthlyUptimeGraph } from "./MonthlyUptimeGraph";

interface UptimeProviderCardProps {
  provider: Provider;
  index: number;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onProviderClick: (provider: Provider) => void;
  getDowntimeMinutes: (uptime: number) => string;
}

export const getStaticMonthlyData = (providerId: number) => {
  if (providerId === 1) {
    return [
      { month: "Январь", uptime: 99.99, downtime: 3 },
      { month: "Февраль", uptime: 99.98, downtime: 9 },
      { month: "Март", uptime: 100, downtime: 0 },
      { month: "Апрель", uptime: 100, downtime: 0 },
      { month: "Май", uptime: 99.99, downtime: 3 },
      { month: "Июнь", uptime: 99.98, downtime: 9 },
      { month: "Июль", uptime: 100, downtime: 0 },
      { month: "Август", uptime: 99.99, downtime: 3 },
      { month: "Сентябрь", uptime: 99.99, downtime: 6 },
      { month: "Октябрь", uptime: 99.98, downtime: 6 },
    ];
  } else if (providerId === 2) {
    return [
      { month: "Январь", uptime: 99.99, downtime: 6 },
      { month: "Февраль", uptime: 100, downtime: 0 },
      { month: "Март", uptime: 100, downtime: 0 },
      { month: "Апрель", uptime: 100, downtime: 0 },
      { month: "Май", uptime: 100, downtime: 0 },
      { month: "Июнь", uptime: 100, downtime: 0 },
      { month: "Июль", uptime: 99.98, downtime: 9 },
      { month: "Август", uptime: 100, downtime: 0 },
      { month: "Сентябрь", uptime: 100, downtime: 0 },
      { month: "Октябрь", uptime: 99.99, downtime: 3 },
    ];
  } else if (providerId === 3) {
    return [
      { month: "Январь", uptime: 99.81, downtime: 84 },
      { month: "Февраль", uptime: 99.93, downtime: 30 },
      { month: "Март", uptime: 99.89, downtime: 48 },
      { month: "Апрель", uptime: 99.9, downtime: 45 },
      { month: "Май", uptime: 99.78, downtime: 93 },
      { month: "Июнь", uptime: 100, downtime: 0 },
      { month: "Июль", uptime: 100, downtime: 0 },
      { month: "Август", uptime: 100, downtime: 0 },
      { month: "Сентябрь", uptime: 99.99, downtime: 3 },
      { month: "Октябрь", uptime: 99.99, downtime: 3 },
    ];
  } else if (providerId === 5) {
    return [
      { month: "Январь", uptime: 99.7, downtime: 135 },
      { month: "Февраль", uptime: 99.51, downtime: 195 },
      { month: "Март", uptime: 99.84, downtime: 69 },
      { month: "Апрель", uptime: 99.9, downtime: 45 },
      { month: "Май", uptime: 99.8, downtime: 90 },
      { month: "Июнь", uptime: 99.84, downtime: 69 },
      { month: "Июль", uptime: 99.78, downtime: 96 },
      { month: "Август", uptime: 99.91, downtime: 39 },
      { month: "Сентябрь", uptime: 99.95, downtime: 21 },
      { month: "Октябрь", uptime: 99.81, downtime: 84 },
    ];
  } else if (providerId === 6) {
    return [
      { month: "Январь", uptime: 100, downtime: 0 },
      { month: "Февраль", uptime: 99.97, downtime: 12 },
      { month: "Март", uptime: 99.97, downtime: 12 },
      { month: "Апрель", uptime: 99.99, downtime: 3 },
      { month: "Май", uptime: 99.97, downtime: 15 },
      { month: "Июнь", uptime: 99.98, downtime: 9 },
      { month: "Июль", uptime: 99.99, downtime: 6 },
      { month: "Август", uptime: 99.97, downtime: 15 },
      { month: "Сентябрь", uptime: 99.97, downtime: 12 },
      { month: "Октябрь", uptime: 100, downtime: 0 },
    ];
  } else if (providerId === 7) {
    return [
      { month: "Январь", uptime: 99.99, downtime: 6 },
      { month: "Февраль", uptime: 99.98, downtime: 9 },
      { month: "Март", uptime: 99.97, downtime: 15 },
      { month: "Апрель", uptime: 99.86, downtime: 60 },
      { month: "Май", uptime: 97.9, downtime: 930 },
      { month: "Июнь", uptime: 99.9, downtime: 45 },
      { month: "Июль", uptime: 99.98, downtime: 9 },
      { month: "Август", uptime: 99.97, downtime: 12 },
      { month: "Сентябрь", uptime: 99.97, downtime: 12 },
      { month: "Октябрь", uptime: 99.96, downtime: 18 },
    ];
  } else if (providerId === 9) {
    return [
      { month: "Январь", uptime: 100, downtime: 0 },
      { month: "Февраль", uptime: 100, downtime: 0 },
      { month: "Март", uptime: 99.99, downtime: 3 },
      { month: "Апрель", uptime: 99.99, downtime: 3 },
      { month: "Май", uptime: 99.98, downtime: 9 },
      { month: "Июнь", uptime: 99.98, downtime: 9 },
      { month: "Июль", uptime: 99.9, downtime: 45 },
      { month: "Август", uptime: 99.99, downtime: 3 },
      { month: "Сентябрь", uptime: 99.99, downtime: 3 },
      { month: "Октябрь", uptime: 99.99, downtime: 6 },
    ];
  } else if (providerId === 10) {
    return [
      { month: "Январь", uptime: 99.98, downtime: 9 },
      { month: "Февраль", uptime: 99.99, downtime: 6 },
      { month: "Март", uptime: 99.97, downtime: 15 },
      { month: "Апрель", uptime: 100, downtime: 0 },
      { month: "Май", uptime: 100, downtime: 0 },
      { month: "Июнь", uptime: 99.99, downtime: 3 },
      { month: "Июль", uptime: 99.97, downtime: 12 },
      { month: "Август", uptime: 100, downtime: 0 },
      { month: "Сентябрь", uptime: 99.97, downtime: 12 },
      { month: "Октябрь", uptime: 99.97, downtime: 12 },
    ];
  } else if (providerId === 11) {
    return [
      { month: "Январь", uptime: 99.99, downtime: 3 },
      { month: "Февраль", uptime: 100, downtime: 0 },
      { month: "Март", uptime: 99.99, downtime: 3 },
      { month: "Апрель", uptime: 99.99, downtime: 3 },
      { month: "Май", uptime: 100, downtime: 0 },
      { month: "Июнь", uptime: 100, downtime: 0 },
      { month: "Июль", uptime: 99.99, downtime: 3 },
      { month: "Август", uptime: 100, downtime: 0 },
      { month: "Сентябрь", uptime: 99.98, downtime: 9 },
      { month: "Октябрь", uptime: 100, downtime: 0 },
    ];
  } else if (providerId === 12) {
    return [
      { month: "Январь", uptime: 99.97, downtime: 15 },
      { month: "Февраль", uptime: 99.98, downtime: 9 },
      { month: "Март", uptime: 99.98, downtime: 9 },
      { month: "Апрель", uptime: 99.98, downtime: 9 },
      { month: "Май", uptime: 99.97, downtime: 15 },
      { month: "Июнь", uptime: 99.96, downtime: 18 },
      { month: "Июль", uptime: 99.99, downtime: 3 },
      { month: "Август", uptime: 99.99, downtime: 3 },
      { month: "Сентябрь", uptime: 99.97, downtime: 15 },
      { month: "Октябрь", uptime: 99.97, downtime: 15 },
    ];
  } else if (providerId === 13) {
    return [
      { month: "Январь", uptime: 99.99, downtime: 6 },
      { month: "Февраль", uptime: 99.97, downtime: 12 },
      { month: "Март", uptime: 99.99, downtime: 3 },
      { month: "Апрель", uptime: 99.97, downtime: 15 },
      { month: "Май", uptime: 99.98, downtime: 9 },
      { month: "Июнь", uptime: 99.97, downtime: 15 },
      { month: "Июль", uptime: 100, downtime: 0 },
      { month: "Август", uptime: 100, downtime: 0 },
      { month: "Сентябрь", uptime: 99.99, downtime: 6 },
      { month: "Октябрь", uptime: 99.98, downtime: 9 },
    ];
  } else if (providerId === 14) {
    return [
      { month: "Январь", uptime: 99.97, downtime: 15 },
      { month: "Февраль", uptime: 99.93, downtime: 27 },
      { month: "Март", uptime: 99.94, downtime: 27 },
      { month: "Апрель", uptime: 99.96, downtime: 18 },
      { month: "Май", uptime: 99.93, downtime: 33 },
      { month: "Июнь", uptime: 99.43, downtime: 246 },
      { month: "Июль", uptime: 99.97, downtime: 12 },
      { month: "Август", uptime: 99.93, downtime: 30 },
      { month: "Сентябрь", uptime: 99.8, downtime: 87 },
      { month: "Октябрь", uptime: 99.93, downtime: 33 },
    ];
  } else if (providerId === 15) {
    return [
      { month: "Январь", uptime: 100, downtime: 0 },
      { month: "Февраль", uptime: 99.99, downtime: 6 },
      { month: "Март", uptime: 99.87, downtime: 57 },
      { month: "Апрель", uptime: 99.99, downtime: 3 },
      { month: "Май", uptime: 99.98, downtime: 9 },
      { month: "Июнь", uptime: 99.68, downtime: 136 },
      { month: "Июль", uptime: 99.97, downtime: 12 },
      { month: "Август", uptime: 97.96, downtime: 903 },
      { month: "Сентябрь", uptime: 99.97, downtime: 12 },
      { month: "Октябрь", uptime: 99.95, downtime: 21 },
    ];
  } else if (providerId === 18) {
    return [
      { month: "Январь", uptime: 100, downtime: 0 },
      { month: "Февраль", uptime: 100, downtime: 0 },
      { month: "Март", uptime: 99.98, downtime: 9 },
      { month: "Апрель", uptime: 99.98, downtime: 9 },
      { month: "Май", uptime: 99.99, downtime: 3 },
      { month: "Июнь", uptime: 99.99, downtime: 6 },
      { month: "Июль", uptime: 100, downtime: 0 },
      { month: "Август", uptime: 99.99, downtime: 6 },
      { month: "Сентябрь", uptime: 99.98, downtime: 9 },
      { month: "Октябрь", uptime: 99.97, downtime: 15 },
    ];
  } else if (providerId === 19) {
    return [
      { month: "Январь", uptime: 100, downtime: 0 },
      { month: "Февраль", uptime: 99.98, downtime: 9 },
      { month: "Март", uptime: 100, downtime: 0 },
      { month: "Апрель", uptime: 99.99, downtime: 3 },
      { month: "Май", uptime: 99.96, downtime: 18 },
      { month: "Июнь", uptime: 99.94, downtime: 27 },
      { month: "Июль", uptime: 99.95, downtime: 21 },
      { month: "Август", uptime: 100, downtime: 0 },
      { month: "Сентябрь", uptime: 99.99, downtime: 6 },
      { month: "Октябрь", uptime: 99.99, downtime: 6 },
    ];
  } else if (providerId === 20) {
    return [
      { month: "Январь", uptime: 100, downtime: 0 },
      { month: "Февраль", uptime: 100, downtime: 0 },
      { month: "Март", uptime: 99.98, downtime: 9 },
      { month: "Апрель", uptime: 99.98, downtime: 9 },
      { month: "Май", uptime: 99.99, downtime: 3 },
      { month: "Июнь", uptime: 99.78, downtime: 93 },
      { month: "Июль", uptime: 100, downtime: 0 },
      { month: "Август", uptime: 99.84, downtime: 72 },
      { month: "Сентябрь", uptime: 99.99, downtime: 6 },
      { month: "Октябрь", uptime: 99.99, downtime: 9 },
    ];
  } else if (providerId === 21) {
    return [
      { month: "Январь", uptime: 100, downtime: 0 },
      { month: "Февраль", uptime: 100, downtime: 0 },
      { month: "Март", uptime: 99.99, downtime: 3 },
      { month: "Апрель", uptime: 99.98, downtime: 9 },
      { month: "Май", uptime: 100, downtime: 0 },
      { month: "Июнь", uptime: 100, downtime: 0 },
      { month: "Июль", uptime: 100, downtime: 0 },
      { month: "Август", uptime: 100, downtime: 0 },
      { month: "Сентябрь", uptime: 100, downtime: 0 },
      { month: "Октябрь", uptime: 100, downtime: 0 },
    ];
  } else if (providerId === 22) {
    return [
      { month: "Январь", uptime: 100, downtime: 0 },
      { month: "Февраль", uptime: 100, downtime: 0 },
      { month: "Март", uptime: 99.99, downtime: 6 },
      { month: "Апрель", uptime: 100, downtime: 0 },
      { month: "Май", uptime: 99.99, downtime: 3 },
      { month: "Июнь", uptime: 99.94, downtime: 27 },
      { month: "Июль", uptime: 100, downtime: 0 },
      { month: "Август", uptime: 100, downtime: 0 },
      { month: "Сентябрь", uptime: 100, downtime: 0 },
      { month: "Октябрь", uptime: 99.89, downtime: 48 },
    ];
  } else if (providerId === 23) {
    return [
      { month: "Январь", uptime: 100, downtime: 0 },
      { month: "Февраль", uptime: 99.99, downtime: 3 },
      { month: "Март", uptime: 99.84, downtime: 72 },
      { month: "Апрель", uptime: 100, downtime: 0 },
      { month: "Май", uptime: 100, downtime: 0 },
      { month: "Июнь", uptime: 99.99, downtime: 3 },
      { month: "Июль", uptime: 100, downtime: 0 },
      { month: "Август", uptime: 99.99, downtime: 3 },
      { month: "Сентябрь", uptime: 100, downtime: 0 },
      { month: "Октябрь", uptime: 100, downtime: 0 },
    ];
  } else if (providerId === 32) {
    return [
      { month: "Январь", uptime: 99,99, downtime: 6 },
      { month: "Февраль", uptime: 100, downtime: 0 },
      { month: "Март", uptime: 100, downtime: 0 },
      { month: "Апрель", uptime: 100, downtime: 0 },
      { month: "Май", uptime: 99,98, downtime: 9 },
      { month: "Июнь", uptime: 99.99, downtime: 3 },
      { month: "Июль", uptime: 99,99, downtime: 3 },
      { month: "Август", uptime: 99.98, downtime: 9 },
      { month: "Сентябрь", uptime: 100, downtime: 0 },
      { month: "Октябрь", uptime: 100, downtime: 0 },
    ];
  }
  return [];
};

export const calculateTotalDowntime = (providerId: number): number => {
  const monthlyData = getStaticMonthlyData(providerId);
  if (!monthlyData || !Array.isArray(monthlyData) || monthlyData.length === 0)
    return 0;
  return monthlyData.reduce((sum, month) => sum + month.downtime, 0);
};

export const UptimeProviderCard: React.FC<UptimeProviderCardProps> = ({
  provider,
  index,
  isExpanded,
  onToggleExpand,
  onProviderClick,
  getDowntimeMinutes,
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

  const monthlyData = getStaticMonthlyData(provider.id);
  const uptime = provider.uptime30days ?? 0;
  const totalDowntime =
    monthlyData && Array.isArray(monthlyData)
      ? monthlyData.reduce((sum, month) => sum + month.downtime, 0)
      : 0;

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
    provider.id === 32;

  return (
    <div
      key={provider.id}
      className={`group bg-background border border-border rounded-xl p-4 hover:border-primary/50 transition-all relative ${
        isExpanded ? "md:col-span-2" : ""
      }`}
    >
      {index < 3 && (
        <div className="absolute -top-3 -left-3 w-12 h-12 rounded-full flex items-center justify-center shadow-lg">
          <div className="relative flex items-center justify-center">
            <Icon
              name="Cloud"
              size={37}
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
                    ? "drop-shadow(0 0 10px rgba(234, 179, 8, 0.7))"
                    : index === 1
                      ? "drop-shadow(0 0 10px rgba(156, 163, 175, 0.7))"
                      : "drop-shadow(0 0 10px rgba(180, 83, 9, 0.7))",
              }}
            />
            <span
              className={`absolute text-xs font-bold ${
                index === 0
                  ? "text-yellow-600"
                  : index === 1
                    ? "text-gray-500"
                    : "text-amber-800"
              }`}
              style={{ marginTop: "2px", marginLeft: "-10%" }}
            >
              {index + 1}
            </span>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div
          className="flex items-center gap-3 flex-1 min-w-0"
          style={{ marginLeft: "36px" }}
        >
          <div className="flex-shrink-0 w-10 h-10 rounded-lg overflow-hidden bg-white border border-primary/10 flex items-center justify-center">
            <img
              src={provider.logo}
              alt={provider.name}
              className="w-8 h-8 object-contain"
            />
          </div>
          <div className="flex-1 min-w-0">
            <button
              onClick={() => onProviderClick(provider)}
              className="font-bold text-foreground truncate hover:text-primary transition-colors flex items-center gap-1 group/name"
            >
              {provider.name}
              <Icon
                name="ExternalLink"
                size={14}
                className="opacity-0 group-hover/name:opacity-100 transition-opacity"
              />
            </button>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>SLA: {provider.serviceGuarantees.uptimeSLA}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-xl font-black text-foreground">
            {uptime.toFixed(2)}%
          </div>
          <button
            onClick={onToggleExpand}
            className="p-1.5 hover:bg-accent rounded-lg transition-colors"
          >
            <Icon
              name={isExpanded ? "ChevronUp" : "ChevronDown"}
              size={18}
              className="text-muted-foreground"
            />
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="mt-4 pt-4 border-t border-border space-y-4">
          <div className="text-xs text-muted-foreground">
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
            {totalDowntime > 0 && (
              <div className="flex justify-between py-1">
                <span>Суммарное время простоя:</span>
                <span className="font-semibold text-foreground">
                  {totalDowntime} мин
                </span>
              </div>
            )}
          </div>

          {shouldShowGraph && isExpanded && (
            <MonthlyUptimeGraph
              data={getStaticMonthlyData(provider.id)}
              providerId={provider.id}
            />
          )}
        </div>
      )}
    </div>
  );
};