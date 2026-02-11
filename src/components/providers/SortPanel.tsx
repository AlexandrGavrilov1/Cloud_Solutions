import Icon from "@/components/ui/icon";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface SortPanelProps {
  sortBy: "popular" | "rating" | "price";
  onSortPopular: () => void;
  onSortRating: () => void;
  onSortPrice: (order: "asc" | "desc") => void;
  priceSortOrder: "asc" | "desc";
  isMobile?: boolean;
}

export const SortPanel = ({
  sortBy,
  onSortPopular,
  onSortRating,
  onSortPrice,
  priceSortOrder,
  isMobile = false,
}: SortPanelProps) => {
  const priceButtonText =
    priceSortOrder === "desc" ? "Сначала дорогие" : "Сначала дешёвые";

  // --- МОБИЛЬНАЯ ВЕРСИЯ (иконки + тумблер) ---
  if (isMobile) {
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
      <div className="inline-flex bg-[#2B3038] rounded-xl p-0.5 border border-[#2B3038] h-10 relative min-w-[112px]">
        <div
          className="absolute top-0.5 bottom-0.5 w-[33.33%] bg-white/90 shadow-sm rounded-lg transition-all duration-200 ease-in-out"
          style={{ left: getThumbLeft() }}
        />

        <button
          onClick={onSortPopular}
          className={`relative z-10 w-[33.33%] rounded-lg transition-all flex items-center justify-center h-full ${
            sortBy === "popular"
              ? "text-[#FF931F]"
              : "text-white hover:text-[#FF931F]"
          }`}
          title="Популярные"
        >
          <Icon name="Crown" className="w-4 h-4" />
        </button>

        <button
          onClick={onSortRating}
          className={`relative z-10 w-[33.33%] rounded-lg transition-all flex items-center justify-center h-full ${
            sortBy === "rating"
              ? "text-[#FF931F]"
              : "text-white hover:text-[#FF931F]"
          }`}
          title="Высокий рейтинг"
        >
          <Icon name="Star" className="w-4 h-4" />
        </button>

        <button
          onClick={() => onSortPrice("desc")}
          className={`relative z-10 w-[33.33%] rounded-lg transition-all flex items-center justify-center h-full ${
            sortBy === "price"
              ? "text-[#FF931F]"
              : "text-white hover:text-[#FF931F]"
          }`}
          title={priceButtonText}
        >
          <span className="text-base font-bold">₽</span>
        </button>
      </div>
    );
  }

  // --- ДЕСКТОПНАЯ ВЕРСИЯ (текст, шрифт как в надписях чекбоксов: 12px, обычный вес) ---
  return (
    <div className="flex items-center gap-6 bg-[#2B3038] px-5 py-2 rounded-xl h-10">
      <button
        onClick={onSortPopular}
        className={`text-xs transition-colors ${
          sortBy === "popular"
            ? "text-[#FF931F]"
            : "text-white hover:text-[#FF931F]"
        }`}
      >
        Популярные
      </button>

      <button
        onClick={onSortRating}
        className={`text-xs transition-colors ${
          sortBy === "rating"
            ? "text-[#FF931F]"
            : "text-white hover:text-[#FF931F]"
        }`}
      >
        Высокий рейтинг
      </button>

      <div className="flex items-center">
        <button
          onClick={() => onSortPrice("desc")}
          className={`text-xs transition-colors ${
            sortBy === "price"
              ? "text-[#FF931F]"
              : "text-white hover:text-[#FF931F]"
          }`}
        >
          {priceButtonText}
        </button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className={`ml-1 p-0.5 rounded-sm transition-colors ${
                sortBy === "price"
                  ? "text-[#FF931F]"
                  : "text-white/70 hover:text-[#FF931F]"
              }`}
              aria-label="Выбрать направление сортировки по цене"
            >
              <Icon name="ChevronDown" size={12} />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-48 bg-[#2B3038] border-gray-700"
          >
            <DropdownMenuItem
              onClick={() => onSortPrice("desc")}
              className={`cursor-pointer text-xs ${
                sortBy === "price" && priceSortOrder === "desc"
                  ? "text-[#FF931F] bg-white/10"
                  : "text-white hover:text-[#FF931F] hover:bg-white/10"
              }`}
            >
              Сначала дорогие
              {sortBy === "price" && priceSortOrder === "desc" && (
                <Icon
                  name="Check"
                  size={14}
                  className="ml-auto text-[#FF931F]"
                />
              )}
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onSortPrice("asc")}
              className={`cursor-pointer text-xs ${
                sortBy === "price" && priceSortOrder === "asc"
                  ? "text-[#FF931F] bg-white/10"
                  : "text-white hover:text-[#FF931F] hover:bg-white/10"
              }`}
            >
              Сначала дешёвые
              {sortBy === "price" && priceSortOrder === "asc" && (
                <Icon
                  name="Check"
                  size={14}
                  className="ml-auto text-[#FF931F]"
                />
              )}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};
