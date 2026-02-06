import { useState } from "react";
import { Provider } from "./types";
import { UptimeChartHeader } from "./UptimeChartHeader";
import {
  UptimeProviderCard,
  calculateTotalDowntime,
} from "./UptimeProviderCard";

interface MonthlyDowntime {
  provider_id: number;
  month: string;
  downtime_minutes: number;
}

interface UptimeChartProps {
  providers: Provider[];
  lastCheckTime?: string;
  isChecking?: boolean;
  monthlyDowntime?: MonthlyDowntime[];
}

export const UptimeChart = ({
  providers,
  lastCheckTime,
  isChecking,
  monthlyDowntime = [],
}: UptimeChartProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedProviders, setExpandedProviders] = useState<Set<number>>(
    new Set(),
  );

  const providersWithUptime = providers
    .filter((p) => p.uptime30days !== undefined)
    .filter((p) => p.name.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => {
      const uptimeDiff = (b.uptime30days || 0) - (a.uptime30days || 0);
      if (uptimeDiff !== 0) return uptimeDiff;
      return calculateTotalDowntime(a.id) - calculateTotalDowntime(b.id);
    });

  // Определяем топ-3 провайдеров по uptime из отфильтрованного списка
  const topThreeProviders = providersWithUptime.slice(0, 3);

  const getUptimeColor = (uptime: number) => {
    if (uptime >= 99.95) return "rgb(0, 128, 0)";
    if (uptime >= 99.9) return "rgb(251, 146, 60)";
    if (uptime >= 99.5) return "rgb(253, 186, 116)";
    return "rgb(239, 68, 68)";
  };

  const getDowntimeMinutes = (uptime: number) => {
    const totalMinutes = 30 * 24 * 60;
    const uptimeMinutes = (totalMinutes * uptime) / 100;
    const downtimeMinutes = totalMinutes - uptimeMinutes;

    if (downtimeMinutes < 1) return "< 1 мин";
    if (downtimeMinutes < 60) return `${Math.round(downtimeMinutes)} мин`;
    return `${Math.round(downtimeMinutes / 60)} ч`;
  };

  const trackClick = async (providerId: number) => {
    try {
      await fetch(
        "https://functions.poehali.dev/d0b8e2ce-45c2-4ab9-8d08-baf03c0268f4",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            provider_id: providerId,
          }),
        },
      );
    } catch (error) {
      console.error("Error tracking click:", error);
    }
  };

  const handleProviderClick = async (provider: Provider) => {
    // Трекинг клика
    await trackClick(provider.id);

    // Яндекс.Метрика
    if (typeof window !== "undefined" && (window as any).ym) {
      (window as any).ym(105466349, "reachGoal", "handleProviderClick", {
        provider_id: provider.id,
        provider_name: provider.name,
      });
    }

    // Открытие сайта провайдера
    if (provider.url) {
      window.open(provider.url, "_blank", "noopener,noreferrer");
    }
  };

  const handleToggleExpand = (providerId: number) => {
    const newExpanded = new Set(expandedProviders);
    if (newExpanded.has(providerId)) {
      newExpanded.delete(providerId);
    } else {
      newExpanded.add(providerId);
    }
    setExpandedProviders(newExpanded);
  };

  return (
    <section className="py-8 md:py-24 relative overflow-hidden">
      <div className="absolute top-20 right-10 w-[400px] h-[400px] bg-orange-500/10 rounded-full blur-[100px]"></div>
      <div className="absolute bottom-20 left-10 w-[400px] h-[400px] bg-primary/10 rounded-full blur-[100px]"></div>

      <div className="container mx-auto px-3 sm:px-4 lg:px-8 relative z-10">
        <div className="max-w-6xl mx-auto">
          <UptimeChartHeader
            lastCheckTime={lastCheckTime}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />

          <div className="bg-gradient-to-br from-card via-card to-accent/20 border-2 border-border rounded-2xl md:rounded-3xl p-4 sm:p-6 md:p-8 shadow-xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
              {providersWithUptime.map((provider, index) => {
                const isTopThree = topThreeProviders.includes(provider);
                const place = isTopThree
                  ? topThreeProviders.indexOf(provider) + 1
                  : undefined;

                return (
                  <UptimeProviderCard
                    key={provider.id}
                    provider={provider}
                    index={index}
                    isExpanded={expandedProviders.has(provider.id)}
                    onToggleExpand={() => handleToggleExpand(provider.id)}
                    onProviderClick={() => handleProviderClick(provider)}
                    getDowntimeMinutes={getDowntimeMinutes}
                    isTopThree={isTopThree}
                    place={place}
                  />
                );
              })}
            </div>

            <div className="mt-4 md:mt-6 grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4">
              <div className="bg-background border border-border rounded-lg md:rounded-xl p-3 md:p-4">
                <div className="flex items-center gap-1.5 md:gap-2 mb-1 md:mb-2">
                  <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-green-600"></div>
                  <span className="text-[10px] md:text-xs font-bold text-muted-foreground">
                    ≥ 99.95%
                  </span>
                </div>
                <div className="text-xs md:text-sm text-foreground">
                  Отличный
                </div>
              </div>
              <div className="bg-background border border-border rounded-lg md:rounded-xl p-3 md:p-4">
                <div className="flex items-center gap-1.5 md:gap-2 mb-1 md:mb-2">
                  <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-yellow-400"></div>
                  <span className="text-[10px] md:text-xs font-bold text-muted-foreground">
                    ≥ 99.9%
                  </span>
                </div>
                <div className="text-xs md:text-sm text-foreground">
                  Хороший
                </div>
              </div>
              <div className="bg-background border border-border rounded-lg md:rounded-xl p-3 md:p-4">
                <div className="flex items-center gap-1.5 md:gap-2 mb-1 md:mb-2">
                  <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-orange-500"></div>
                  <span className="text-[10px] md:text-xs font-bold text-muted-foreground">
                    ≥ 99.5%
                  </span>
                </div>
                <div className="text-xs md:text-sm text-foreground">
                  Средний
                </div>
              </div>
              <div className="bg-background border border-border rounded-lg md:rounded-xl p-3 md:p-4">
                <div className="flex items-center gap-1.5 md:gap-2 mb-1 md:mb-2">
                  <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-red-500"></div>
                  <span className="text-[10px] md:text-xs font-bold text-muted-foreground">
                    &lt; 99.5%
                  </span>
                </div>
                <div className="text-xs md:text-sm text-foreground">Низкий</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
