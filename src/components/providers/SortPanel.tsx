import Icon from "@/components/ui/icon";

interface SortPanelProps {
  sortBy: "popular" | "rating" | "price";
  setSortBy: (sortBy: "popular" | "rating" | "price") => void;
}

export const SortPanel = ({ sortBy, setSortBy }: SortPanelProps) => {
  const getThumbLeft = () => {
    switch (sortBy) {
      case "popular":
        return "0%";
      case "rating":
        return "33.33%";
      case "price":
        return "66.66%";
      default:
        return "0%";
    }
  };

  return (
    <div className="inline-flex bg-muted/50 rounded-xl p-0.5 border border-border h-9 sm:h-10 relative">
      {/* Тумблер — ширина 33.33%, плавное перемещение */}
      <div
        className="absolute top-0.5 bottom-0.5 w-[33.33%] bg-background shadow-sm rounded-lg transition-all duration-200 ease-in-out"
        style={{ left: getThumbLeft() }}
      />

      {/* Популярные */}
      <button
        onClick={() => setSortBy("popular")}
        className={`relative z-10 w-[33.33%] rounded-lg transition-all flex items-center justify-center gap-1 px-1 sm:px-2 h-full ${
          sortBy === "popular"
            ? "text-primary"
            : "text-foreground hover:bg-primary/10"
        }`}
        title="По популярности"
      >
        <Icon name="TrendingUp" className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        <span className="text-xs sm:text-sm font-medium hidden sm:inline">
          Популярные
        </span>
      </button>

      {/* Рейтинг */}
      <button
        onClick={() => setSortBy("rating")}
        className={`relative z-10 w-[33.33%] rounded-lg transition-all flex items-center justify-center gap-1 px-1 sm:px-2 h-full ${
          sortBy === "rating"
            ? "text-primary"
            : "text-foreground hover:bg-primary/10"
        }`}
        title="По рейтингу"
      >
        <Icon name="Star" className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        <span className="text-xs sm:text-sm font-medium hidden sm:inline">
          Рейтинг
        </span>
      </button>

      {/* Цена */}
      <button
        onClick={() => setSortBy("price")}
        className={`relative z-10 w-[33.33%] rounded-lg transition-all flex items-center justify-center gap-1 px-1 sm:px-2 h-full ${
          sortBy === "price"
            ? "text-primary"
            : "text-foreground hover:bg-primary/10"
        }`}
        title="По цене"
      >
        <span className="text-sm sm:text-base font-bold">₽</span>
        <span className="text-xs sm:text-sm font-medium hidden sm:inline">
          Цена
        </span>
      </button>
    </div>
  );
};
