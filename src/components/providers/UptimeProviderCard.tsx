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

export const UptimeProviderCard = ({
  provider,
  index,
  isExpanded,
  onToggleExpand,
  onProviderClick,
  getDowntimeMinutes,
}: UptimeProviderCardProps) => {
  const uptime = provider.uptime30days || 0;
  const downtimeText = getDowntimeMinutes(uptime);

  const getStaticMonthlyData = (providerId: number) => {
    if (providerId === 1) {
      return [
        { month: "Январь", uptime: 99.99, downtime: 3 },
        { month: "Февраль", uptime: 99.98, downtime: 6 },
        { month: "Март", uptime: 100, downtime: 0 },
        { month: "Апрель", uptime: 100, downtime: 0 },
        { month: "Май", uptime: 99.99, downtime: 3 },
        { month: "Июнь", uptime: 99.98, downtime: 9 },
        { month: "Июль", uptime: 100, downtime: 0 },
        { month: "Август", uptime: 99.99, downtime: 3 },
        { month: "Сентябрь", uptime: 99.99, downtime: 6 },
        { month: "Октябрь", uptime: 99.99, downtime: 6 },
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
        { month: "Сентябрь", uptime: 99.03, downtime: 417 },
        { month: "Октябрь", uptime: 98.22, downtime: 789 },
      ];
    } else if (providerId === 18) {
      return [
        { month: "Январь", uptime: 99.97, downtime: 15 },
        { month: "Февраль", uptime: 100, downtime: 0 },
        { month: "Март", uptime: 99.95, downtime: 21 },
        { month: "Апрель", uptime: 100, downtime: 0 },
        { month: "Май", uptime: 99.99, downtime: 3 },
        { month: "Июнь", uptime: 99.92, downtime: 33 },
        { month: "Июль", uptime: 99.99, downtime: 3 },
        { month: "Август", uptime: 99.99, downtime: 6 },
        { month: "Сентябрь", uptime: 100, downtime: 0 },
        { month: "Октябрь", uptime: 100, downtime: 0 },
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
        { month: "Октябрь", uptime: 99.98, downtime: 9 },
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
    } else if (providerId === 23) {
      return [
        { month: "Январь", uptime: 100, downtime: 0 },
        { month: "Февраль", uptime: 99.99, downtime: 3 },
        { month: "Март", uptime: 99.84, downtime: 3 },
        { month: "Апрель", uptime: 100, downtime: 0 },
        { month: "Май", uptime: 100, downtime: 0 },
        { month: "Июнь", uptime: 99.99, downtime: 3 },
        { month: "Июль", uptime: 100, downtime: 0 },
        { month: "Август", uptime: 99.99, downtime: 3 },
        { month: "Сентябрь", uptime: 100, downtime: 0 },
        { month: "Октябрь", uptime: 100, downtime: 0 },
      ];
    }
  };

  const shouldShowGraph =
    provider.id === 1 ||
    provider.id === 5 ||
    provider.id === 6 ||
    provider.id === 7 ||
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
    provider.id === 23;

  return (
    <div
      key={provider.id}
      className={`group bg-background border border-border rounded-xl p-4 hover:border-primary/50 transition-all ${
        isExpanded ? "md:col-span-2" : ""
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 flex-1 min-w-0">
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
          {index < 3 && (
            <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
              <span className="text-xs font-bold text-primary">
                #{index + 1}
              </span>
            </div>
          )}
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
