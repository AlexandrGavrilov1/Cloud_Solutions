// SortPanel.tsx
import Icon from "@/components/ui/icon";

interface SortPanelProps {
  sortBy: "rating" | "price";
  setSortBy: (sortBy: "rating" | "price") => void;
}

export const SortPanel = ({ sortBy, setSortBy }: SortPanelProps) => {
  return (
    <div className="space-y-3">
      {/* Заголовок с иконкой */}
      <div className="flex items-center gap-2">
        <Icon name="ArrowUpDown" size={16} className="text-primary" />
        <label className="text-sm font-medium text-foreground">
          Сортировка
        </label>
      </div>

      {/* Кнопки сортировки */}
      <div className="flex gap-2">
        <button
          onClick={() => setSortBy("rating")}
          className={`flex-1 py-2.5 rounded-md text-sm font-medium transition-all flex items-center justify-center gap-2 ${
            sortBy === "rating"
              ? "bg-primary text-background shadow-sm"
              : "bg-muted text-foreground hover:bg-muted/80"
          }`}
        >
          <Icon
            name="Star"
            size={16}
            className={sortBy === "rating" ? "text-background" : "text-primary"}
          />
          По рейтингу
        </button>
        <button
          onClick={() => setSortBy("price")}
          className={`flex-1 py-2.5 rounded-md text-sm font-medium transition-all flex items-center justify-center gap-2 ${
            sortBy === "price"
              ? "bg-primary text-background shadow-sm"
              : "bg-muted text-foreground hover:bg-muted/80"
          }`}
        >
          <span
            className={`text-lg font-bold ${sortBy === "price" ? "text-background" : "text-primary"}`}
          >
            ₽
          </span>
          По цене
        </button>
      </div>
    </div>
  );
};
