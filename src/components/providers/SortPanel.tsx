import Icon from "@/components/ui/icon";

interface SortPanelProps {
  sortBy: "popular" | "rating" | "price";
  onSortPopular: () => void;
  onSortRating: () => void;
  onSortPrice: () => void; // переключает направление сортировки по цене
  priceSortOrder: "asc" | "desc";
  isMobile?: boolean; // опционально, можно определить внутри через useMediaQuery
}

export const SortPanel = ({
  sortBy,
  onSortPopular,
  onSortRating,
  onSortPrice,
  priceSortOrder,
  isMobile = false,
}: SortPanelProps) => {
  // Текст кнопки цены в зависимости от направления
  const priceButtonText =
    priceSortOrder === "asc" ? "Сначала дорогие" : "Сначала дешёвые";

  // ========== МОБИЛЬНАЯ ВЕРСИЯ (иконки + тумблер) ==========
  if (isMobile) {
    // Позиция тумблера для трёх кнопок
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
      <div className="inline-flex bg-[#2B3038] rounded-xl p-0.5 border border-[#2B3038] h-9 sm:h-10 relative">
        {/* Тумблер — белый с тенью */}
        <div
          className="absolute top-0.5 bottom-0.5 w-[33.33%] bg-white/90 shadow-sm rounded-lg transition-all duration-200 ease-in-out"
          style={{ left: getThumbLeft() }}
        />

        {/* Популярные */}
        <button
          onClick={onSortPopular}
          className={`relative z-10 w-[33.33%] rounded-lg transition-all flex items-center justify-center gap-1 px-1 sm:px-2 h-full ${
            sortBy === "popular"
              ? "text-[#FF931F]"
              : "text-white hover:text-[#FF931F]"
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
          onClick={onSortRating}
          className={`relative z-10 w-[33.33%] rounded-lg transition-all flex items-center justify-center gap-1 px-1 sm:px-2 h-full ${
            sortBy === "rating"
              ? "text-[#FF931F]"
              : "text-white hover:text-[#FF931F]"
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
          onClick={onSortPrice}
          className={`relative z-10 w-[33.33%] rounded-lg transition-all flex items-center justify-center gap-1 px-1 sm:px-2 h-full ${
            sortBy === "price"
              ? "text-[#FF931F]"
              : "text-white hover:text-[#FF931F]"
          }`}
          title={priceButtonText}
        >
          <span className="text-sm sm:text-base font-bold">₽</span>
          <span className="text-xs sm:text-sm font-medium hidden sm:inline">
            {priceButtonText}
          </span>
        </button>
      </div>
    );
  }

  // ========== ДЕСКТОПНАЯ ВЕРСИЯ (только текст, без тумблера) ==========
  return (
    <div className="flex items-center gap-6 bg-[#2B3038] px-5 py-2 rounded-xl h-10">
      {/* Популярные */}
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

      {/* Высокий рейтинг */}
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

      {/* Цена (с изменяемым текстом) */}
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
