import Icon from "@/components/ui/icon";

interface UptimeChartHeaderProps {
  lastCheckTime?: string;
  searchQuery: string;
  onSearchChange: (value: string) => void;
  selectedYear: string;
  onYearChange: (year: string) => void;
  availableYears: number[];
  windowWidth: number;
}

export const UptimeChartHeader = ({
  lastCheckTime,
  searchQuery,
  onSearchChange,
  selectedYear,
  onYearChange,
  availableYears,
  windowWidth,
}: UptimeChartHeaderProps) => {
  const isMobile = windowWidth < 640;
  const isTablet = windowWidth >= 640 && windowWidth < 1024;

  const getCurrentYearText = () => {
    const currentYear = new Date().getFullYear();
    const years = availableYears.map((y) => y.toString()).join(", ");
    return `Uptime провайдеров за ${availableYears.length > 1 ? `${years} годы` : `${availableYears[0]} год`}`;
  };

  return (
    <>
      <div className="text-center mb-6 md:mb-12 space-y-3 md:space-y-4">
        <div className="inline-flex items-center gap-2 bg-accent border border-orange-500/30 rounded-full px-4 md:px-5 py-2 md:py-2.5">
          <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
          <span className="text-xs md:text-sm font-bold text-orange-600">
            Мониторинг доступности
          </span>
        </div>
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-foreground px-4">
          {getCurrentYearText()}
        </h2>
        <p className="text-base md:text-xl text-muted-foreground px-4">
          Реальная статистика доступности серверов
        </p>
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

        {/* Фильтр по годам */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 md:gap-4 mb-4 md:mb-6">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <Icon
                name="Calendar"
                size={16}
                className="text-muted-foreground"
              />
              <span className="text-sm md:text-base font-medium text-foreground">
                Период:
              </span>
            </div>
            <p className="text-xs md:text-sm text-muted-foreground mt-1">
              Выберите год для сравнения данных
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => onYearChange("all")}
              className={`px-3 md:px-4 py-2 rounded-lg md:rounded-xl transition-colors text-sm md:text-base font-semibold ${
                selectedYear === "all"
                  ? "bg-primary text-primary-foreground"
                  : "bg-accent text-muted-foreground hover:text-foreground"
              }`}
            >
              Все года
            </button>

            {availableYears.map((year) => (
              <button
                key={year}
                onClick={() => onYearChange(year.toString())}
                className={`px-3 md:px-4 py-2 rounded-lg md:rounded-xl transition-colors text-sm md:text-base font-semibold ${
                  selectedYear === year.toString()
                    ? "bg-primary text-primary-foreground"
                    : "bg-accent text-muted-foreground hover:text-foreground"
                }`}
              >
                {year}
              </button>
            ))}
          </div>
        </div>

        {/* Индикатор выбранного фильтра */}
        {selectedYear !== "all" && (
          <div className="bg-primary/10 border border-primary/20 rounded-lg md:rounded-xl p-3 md:p-4 mb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                <span className="text-sm md:text-base font-semibold text-foreground">
                  Показаны данные за {selectedYear} год
                </span>
              </div>
              <button
                onClick={() => onYearChange("all")}
                className="text-xs md:text-sm text-primary hover:text-primary/80 font-medium"
              >
                Сбросить фильтр
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};
