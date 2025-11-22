import Icon from "@/components/ui/icon";

interface UptimeChartHeaderProps {
  lastCheckTime?: string;
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

export const UptimeChartHeader = ({
  lastCheckTime,
  searchQuery,
  onSearchChange,
}: UptimeChartHeaderProps) => {
  return (
    <>
      <div className="text-center mb-16 space-y-4">
        <div className="inline-flex items-center gap-2 bg-accent border border-orange-500/30 rounded-full px-5 py-2.5">
          <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
          <span className="text-sm font-bold text-orange-600">
            Мониторинг доступности
          </span>
        </div>
        <h2 className="text-4xl md:text-5xl font-extrabold text-foreground">
          Uptime провайдеров за 2025 год
        </h2>
        <p className="text-xl text-muted-foreground">
          Реальная статистика доступности серверов
        </p>
      </div>

      <div className="bg-gradient-to-br from-card via-card to-accent/20 border-2 border-border rounded-3xl p-8 shadow-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="text-2xl font-bold text-foreground flex items-center gap-2">
              Топ провайдеров по Uptime
            </h3>
            {lastCheckTime && (
              <p className="text-sm text-muted-foreground mt-1">
                Данные обновлены: {lastCheckTime}
              </p>
            )}
          </div>

          <div className="relative w-full sm:w-80">
            <Icon
              name="Search"
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Найти провайдера..."
              className="w-full pl-12 pr-12 h-12 bg-background border-2 border-border rounded-xl focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm text-foreground placeholder:text-muted-foreground font-semibold hover:border-primary/50 hover:shadow-md"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 hover:bg-accent rounded-lg transition-colors"
              >
                <Icon name="X" size={18} className="text-muted-foreground" />
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
