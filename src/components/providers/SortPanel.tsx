// ========== МОБИЛЬНАЯ ВЕРСИЯ (иконки + тумблер) ==========
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
    <div
      className="inline-flex bg-[#2B3038] rounded-xl p-0.5 border border-[#2B3038] h-10 relative min-w-[112px]"
      style={{ width: "auto" }} // ширина по содержимому, но не меньше 112px
    >
      {/* Тумблер — белый с тенью */}
      <div
        className="absolute top-0.5 bottom-0.5 w-[33.33%] bg-white/90 shadow-sm rounded-lg transition-all duration-200 ease-in-out"
        style={{ left: getThumbLeft() }}
      />

      {/* Популярные */}
      <button
        onClick={onSortPopular}
        className={`relative z-10 w-[33.33%] rounded-lg transition-all flex items-center justify-center gap-1 px-1 h-full ${
          sortBy === "popular"
            ? "text-[#FF931F]"
            : "text-white hover:text-[#FF931F]"
        }`}
        title="По популярности"
      >
        <Icon name="TrendingUp" className="w-4 h-4" />
        {/* Текст скрыт на мобильных, только иконки */}
      </button>

      {/* Рейтинг */}
      <button
        onClick={onSortRating}
        className={`relative z-10 w-[33.33%] rounded-lg transition-all flex items-center justify-center gap-1 px-1 h-full ${
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
        className={`relative z-10 w-[33.33%] rounded-lg transition-all flex items-center justify-center gap-1 px-1 h-full ${
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
