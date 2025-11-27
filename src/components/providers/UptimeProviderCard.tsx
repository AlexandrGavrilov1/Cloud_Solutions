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
  }
  return [];
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

  return (
    <div
      className={`
        rounded-xl border transition-all duration-300 overflow-hidden
        ${
          provider.id === 1
            ? "border-amber-500/30 bg-gradient-to-br from-amber-500/5 via-transparent to-transparent"
            : provider.id === 2
              ? "border-gray-500/30 bg-gradient-to-br from-gray-400/5 via-transparent to-transparent"
              : provider.id === 3
                ? "border-orange-600/30 bg-gradient-to-br from-orange-600/5 via-transparent to-transparent"
                : "border-gray-700/50 bg-gray-800/30"
        }
        hover:border-gray-600/70
      `}
    >
      <div
        className={`
          p-6 cursor-pointer transition-all duration-200
          ${isExpanded ? "bg-gray-800/40" : "hover:bg-gray-800/20"}
        `}
        onClick={onToggleExpand}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <div
              className={`
                w-12 h-12 rounded-lg flex items-center justify-center text-2xl font-bold
                ${
                  provider.id === 1
                    ? "bg-gradient-to-br from-amber-500/20 to-amber-600/10 text-amber-400 ring-1 ring-amber-500/30"
                    : provider.id === 2
                      ? "bg-gradient-to-br from-gray-400/20 to-gray-500/10 text-gray-300 ring-1 ring-gray-500/30"
                      : provider.id === 3
                        ? "bg-gradient-to-br from-orange-600/20 to-orange-700/10 text-orange-500 ring-1 ring-orange-600/30"
                        : "bg-gray-700/50 text-gray-400 ring-1 ring-gray-600/30"
                }
              `}
            >
              {index + 1}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-semibold text-white">
                  {provider.name}
                </h3>
                {provider.id <= 3 && (
                  <span
                    className={`
                      px-2 py-0.5 rounded text-xs font-medium
                      ${
                        provider.id === 1
                          ? "bg-amber-500/20 text-amber-300 ring-1 ring-amber-500/30"
                          : provider.id === 2
                            ? "bg-gray-500/20 text-gray-300 ring-1 ring-gray-500/30"
                            : "bg-orange-600/20 text-orange-400 ring-1 ring-orange-600/30"
                      }
                    `}
                  >
                    TOP {provider.id}
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-400 mt-1">{provider.location}</p>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-right">
              <div
                className={`text-3xl font-bold ${getUptimeColorClass(provider.uptime)}`}
              >
                {provider.uptime.toFixed(2)}%
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {getDowntimeMinutes(provider.uptime)}
              </div>
            </div>
            <button
              className="p-2 hover:bg-gray-700/50 rounded-lg transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                onToggleExpand();
              }}
            >
              <Icon
                name={isExpanded ? "chevron-up" : "chevron-down"}
                className="w-5 h-5 text-gray-400"
              />
            </button>
          </div>
        </div>

        <div className="w-full bg-gray-700/30 rounded-full h-2 overflow-hidden">
          <div
            className={`h-full ${getUptimeBarColorClass(provider.uptime)} transition-all duration-500`}
            style={{ width: `${provider.uptime}%` }}
          />
        </div>
      </div>

      {isExpanded && (
        <div className="px-6 pb-6 pt-2 bg-gray-800/20">
          {monthlyData.length > 0 && (
            <MonthlyUptimeGraph
              monthlyData={monthlyData}
              providerId={provider.id}
            />
          )}
        </div>
      )}
    </div>
  );
};
