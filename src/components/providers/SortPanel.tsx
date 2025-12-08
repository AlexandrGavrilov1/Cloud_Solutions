// SortPanel.tsx
import Icon from "@/components/ui/icon";

interface SortPanelProps {
  sortBy: "rating" | "price";
  setSortBy: (sortBy: "rating" | "price") => void;
}

export const SortPanel = ({ sortBy, setSortBy }: SortPanelProps) => {
  return (
    <div className="flex flex-col gap-3">
      {/* Заголовок "Сортировка" по центру над кнопками */}
      <div className="flex items-center justify-center gap-2">
        <div className="w-7 h-7 flex items-center justify-center bg-[rgba(255,143,51,0.2)] rounded-lg">
          <Icon name="ArrowUpDown" className="w-4 h-4 text-[#FF8F33]" />
        </div>
        <span className="text-sm font-medium text-white whitespace-nowrap">
          Сортировка
        </span>
      </div>

      <div className="relative bg-muted rounded-lg p-0.5 flex">
        {/* Тумблер - занимает ровно половину ширины */}
        <div
          className={`absolute top-0.5 bottom-0.5 w-1/2 bg-background shadow-sm rounded-md transition-transform duration-200 ease-in-out ${
            sortBy === "rating" ? "left-0.5" : "left-[calc(50%+0.25rem)]"
          }`}
        />

        <button
          onClick={() => setSortBy("rating")}
          className={`relative z-10 flex-1 py-2 rounded-md transition-all flex items-center justify-center ${
            sortBy === "rating"
              ? "text-[#FF8F33]"
              : "text-white hover:text-gray-200"
          }`}
          title="По рейтингу"
        >
          <Icon name="Star" className="w-4 h-4" />
        </button>

        <button
          onClick={() => setSortBy("price")}
          className={`relative z-10 flex-1 py-2 rounded-md transition-all flex items-center justify-center ${
            sortBy === "price"
              ? "text-[#FF8F33]"
              : "text-white hover:text-gray-200"
          }`}
          title="По цене"
        >
          <span
            className={`text-base font-bold ${sortBy === "price" ? "text-[#FF8F33]" : "text-white"}`}
          >
            ₽
          </span>
        </button>
      </div>
    </div>
  );
};
