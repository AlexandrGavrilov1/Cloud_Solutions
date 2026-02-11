import Icon from "@/components/ui/icon";

interface SortPanelProps {
  sortBy: "popular" | "rating" | "price";
  onSortPopular: () => void;
  onSortRating: () => void;
  onSortPrice: () => void;
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

  // --- МОБИЛЬНАЯ ВЕРСИЯ (только иконки, ширина как у кнопки "Фильтры") ---
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
        {/* Тумблер */}
        <div
          className="absolute top-0.5 bottom-0.5 w-[33.33%] bg-white/90 shadow-sm rounded-lg transition-all duration-200 ease-in-out"
          style={{ left: getThumbLeft() }}
        />

        {/* Популярные — ЗАМЕНЕНО НА Crown (точно есть в Lucide) */}
        <button
          onClick={onSortPopular}
          className={`relative z-10 w-[33.33%] rounded-lg transition-all flex items-center justify-center h-full ${
            sortBy === "popular"
              ? "text-[#FF931F]"
              : "text-white hover:text-[#FF931F]"
          }`}
          title="По популярности"
        >
          <Icon name="Crown" className="w-4 h-4" />
        </button>

        {/* Рейтинг — Star */}
        <button
          onClick={onSortRating}
          className={`relative z-10 w-[33.33%] rounded-lg transition-all flex items-center justify-center h-full ${
            sortBy === "rating"
              ? "text-[#FF931F]"
              : "text-white hover:text-[#FF931F]"
          }`}
          title="По рейтингу"
        >
          <Icon name="Star" className="w-4 h-4" />
        </button>

        {/* Цена */}
        <button
          onClick={onSortPrice}
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

  // --- ДЕСКТОПНАЯ ВЕРСИЯ (только текст) ---
  return (
    <div className="flex items-center gap-6 bg-[#2B3038] px-5 py-2 rounded-xl h-10">
      <button
        onClick={onSortPopular}
        className={`text-sm font-medium transition-colors ${
          sortBy === "popular"
            ? "text-[#FF931F]"
            : "text-white hover:text-[#FF931F]"
        }`}
      >
        Популярные
      </button>
      <button
        onClick={onSortRating}
        className={`text-sm font-medium transition-colors ${
          sortBy === "rating"
            ? "text-[#FF931F]"
            : "text-white hover:text-[#FF931F]"
        }`}
      >
        Высокий рейтинг
      </button>
      <button
        onClick={onSortPrice}
        className={`text-sm font-medium transition-colors ${
          sortBy === "price"
            ? "text-[#FF931F]"
            : "text-white hover:text-[#FF931F]"
        }`}
      >
        {priceButtonText}
      </button>
    </div>
  );
};
