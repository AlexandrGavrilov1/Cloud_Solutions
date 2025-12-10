// SortPanel.tsx
import Icon from "@/components/ui/icon";

interface SortPanelProps {
  sortBy: "rating" | "price";
  setSortBy: (sortBy: "rating" | "price") => void;
}

export const SortPanel = ({ sortBy, setSortBy }: SortPanelProps) => {
  return (
    <div className="mb-2 sm:mb-3 w-full max-w-[140px] sm:max-w-[160px]">
      <div className="px-2 py-1 sm:px-2 sm:py-1.5">
        <div className="relative bg-muted/50 rounded-xl p-0.5 flex border border-border">
          {/* Тумблер - занимает 48% ширины с одинаковыми отступами */}
          <div
            className={`absolute top-0.5 bottom-0.5 w-[48%] bg-background shadow-sm rounded-lg transition-all duration-200 ease-in-out ${
              sortBy === "rating" ? "left-0.5" : "left-[52%]"
            }`}
          />

          <button
            onClick={() => setSortBy("rating")}
            className={`relative z-10 flex-1 py-1 sm:py-1.5 rounded-lg transition-all flex items-center justify-center group ${
              sortBy === "rating"
                ? "text-primary"
                : "text-foreground hover:bg-primary/10"
            }`}
            title="По рейтингу"
          >
            <Icon name="Star" className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
          </button>

          <button
            onClick={() => setSortBy("price")}
            className={`relative z-10 flex-1 py-1 sm:py-1.5 rounded-lg transition-all flex items-center justify-center group ${
              sortBy === "price"
                ? "text-primary"
                : "text-foreground hover:bg-primary/10"
            }`}
            title="По цене"
          >
            <span
              className={`text-xs sm:text-sm font-bold ${
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
