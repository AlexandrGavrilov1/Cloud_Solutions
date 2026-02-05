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
      <div className="text-center mb-8 md:mb-16 space-y-3 md:space-y-4">
        <div className="inline-flex items-center gap-2 bg-accent border border-orange-500/30 rounded-full px-4 md:px-5 py-2 md:py-2.5">
          <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
          <span className="text-xs md:text-sm font-bold text-orange-600">
            Мониторинг доступности
          </span>
        </div>
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-foreground px-4">
          Uptime провайдеров
        </h2>
      </div>

      <div className="bg-gradient-to-br from-card via-card to-accent/20 border-2 border-border rounded-2xl md:rounded-3xl p-4 sm:p-6 md:p-8 shadow-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 md:gap-4 mb-4 md:mb-6">
          <div>
            <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-foreground flex items-center gap-2">
              Топ провайдеров по Uptime
            </h3>
            {lastCheckTime && (
              <p className="text-xs md:text-sm text-muted-foreground mt-1">
                Данные обновлены: {lastCheckTime}
              </p>
            )}
          </div>

          <div className="relative w-full sm:w-64 md:w-80">
            <Icon
              name="Search"
              size={16}
              className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Найти провайдера..."
              className="w-full pl-10 md:pl-12 pr-10 md:pr-12 h-10 md:h-12 bg-background border-2 border-border rounded-lg md:rounded-xl focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-xs md:text-sm text-foreground placeholder:text-muted-foreground font-semibold hover:border-primary/50 hover:shadow-md"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange("")}
                className="absolute right-2 md:right-3 top-1/2 -translate-y-1/2 p-1.5 hover:bg-accent rounded-lg transition-colors"
              >
                <Icon name="X" size={16} className="text-muted-foreground" />
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
