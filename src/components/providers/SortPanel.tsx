// SortPanel.tsx
import Icon from "@/components/ui/icon";

interface SortPanelProps {
  sortBy: "rating" | "price";
  setSortBy: (sortBy: "rating" | "price") => void;
}

export const SortPanel = ({ sortBy, setSortBy }: SortPanelProps) => {
  return (
    <div className="inline-flex bg-muted/50 rounded-xl p-0.5 border border-border h-9 sm:h-10 relative w-fit flex-none -translate-y-0.5">
      {/* Тумблер - занимает 48% ширины с одинаковыми отступами */}
      <div
        className={`absolute top-0.5 bottom-0.5 w-[48%] bg-background shadow-sm rounded-lg transition-all duration-200 ease-in-out ${
          sortBy === "rating" ? "left-0.5" : "left-[52%]"
        }`}
      />

      <button
        onClick={() => setSortBy("rating")}
        className={`relative z-10 w-9 sm:w-10 py-1.5 sm:py-2 rounded-lg transition-all flex items-center justify-center group h-full ${
          sortBy === "rating"
            ? "text-primary"
            : "text-foreground hover:bg-primary/10"
        }`}
        title="По рейтингу"
      >
        <Icon name="Star" className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
      </button>

      <button
        onClick={() => setSortBy("price")}
        className={`relative z-10 w-9 sm:w-10 py-1.5 sm:py-2 rounded-lg transition-all flex items-center justify-center group h-full ${
          sortBy === "price"
            ? "text-primary"
            : "text-foreground hover:bg-primary/10"
        }`}
        title="По цене"
      >
        <span
          className={`text-sm sm:text-base font-bold ${
            sortBy === "price" ? "text-primary" : "text-foreground"
          }`}
        >
          ₽
        </span>
      </button>
    </div>
  );
};
