<div
  className={`absolute right-5 top-5 md:right-6 md:top-6 z-40 flex gap-2 pointer-events-auto ${showDetails ? "lg:right-8 lg:top-8" : ""} xl:flex-col xl:gap-3`}
>
  {onToggleCompare && (
    <button
      onClick={onToggleCompare}
      className={`w-10 h-10 md:w-14 md:h-14 lg:w-16 lg:h-16 rounded-full flex items-center justify-center bg-card border-2 transition-all duration-200 hover:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 ${
        isSelected
          ? "border-primary/50 shadow-lg shadow-primary/30"
          : "border-border hover:border-primary/50"
      } xl:order-2`} // На больших экранах будет второй (нижней)
    >
      <Icon
        name={isSelected ? "Check" : "GitCompare"}
        size={17}
        className="text-foreground"
      />
    </button>
  )}
  <button
    onClick={handleProviderClick}
    className="w-10 h-10 md:w-14 md:h-14 lg:w-16 lg:h-16 rounded-full flex items-center justify-center bg-card border-2 transition-all duration-200 hover:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 xl:order-1" // На больших экранах будет первой (верхней)
  >
    <Icon name="ArrowUpRight" size={17} className="text-primary" />
  </button>
</div>;
