// SortPanel.tsx
import Icon from "@/components/ui/icon";

interface SortPanelProps {
  sortBy: "rating" | "price";
  setSortBy: (sortBy: "rating" | "price") => void;
}

export const SortPanel = ({ sortBy, setSortBy }: SortPanelProps) => {
  return (
    <div className="bg-card border border-primary/20 rounded-xl shadow-md mb-2 sm:mb-3 max-w-[180px] sm:max-w-[200px]">
      <div className="px-3 py-2.5 flex items-center justify-center hover:bg-primary/5 transition-colors rounded-xl">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 sm:w-7 sm:h-7 bg-primary/20 rounded-lg flex items-center justify-center">
            <Icon
              name="ArrowUpDown"
              size={12}
              className="text-primary sm:w-4 sm:h-4"
            />
          </div>
          <h3 className="text-sm sm:text-base font-bold text-foreground">
            Сортировка
          </h3>
        </div>
      </div>

      <div className="px-3 pb-4">
        <div className="relative bg-muted/50 rounded-lg p-0.5 flex border border-border">
          {/* Тумблер - занимает 48% ширины с одинаковыми отступами */}
          <div
            className={`absolute top-0.5 bottom-0.5 w-[48%] bg-background shadow-sm rounded-md transition-all duration-200 ease-in-out ${
              sortBy === "rating" ? "left-0.5" : "left-[52%]"
            }`}
          />

          <button
            onClick={() => setSortBy("rating")}
            className={`relative z-10 flex-1 py-2 rounded-md transition-all flex items-center justify-center group ${
              sortBy === "rating"
                ? "text-primary"
                : "text-foreground hover:bg-primary/10"
            }`}
            title="По рейтингу"
          >
            <Icon name="Star" className="w-4 h-4" />
          </button>

          <button
            onClick={() => setSortBy("price")}
            className={`relative z-10 flex-1 py-2 rounded-md transition-all flex items-center justify-center group ${
              sortBy === "price"
                ? "text-primary"
                : "text-foreground hover:bg-primary/10"
            }`}
            title="По цене"
          >
            <span
              className={`text-base font-bold ${
                sortBy === "price" ? "text-primary" : "text-foreground"
              }`}
            >
              ₽
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
