{
  filteredProviders.length > providersToShow && (
    <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-8">
      {/* Кнопка "Показать ещё 9 провайдеров" */}
      <button
        onClick={() => setProvidersToShow((prev) => prev + 9)}
        className="group relative px-8 py-4 bg-gradient-to-r from-primary to-primary/80 text-background font-bold text-lg rounded-2xl shadow-xl shadow-primary/30 hover:shadow-2xl hover:shadow-primary/40 transition-all hover:scale-[1.02] active:scale-[0.98] w-full sm:w-auto"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-white/20 to-primary/0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
        <span className="relative flex items-center justify-center gap-2">
          Показать ещё 9 провайдеров
          <svg
            className="w-5 h-5 group-hover:translate-y-1 transition-transform"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </span>
      </button>

      {/* Новая кнопка "Показать всех провайдеров" */}
      <button
        onClick={() => setProvidersToShow(filteredProviders.length)}
        className="group relative px-8 py-4 bg-gradient-to-r from-secondary to-secondary/80 text-background font-bold text-lg rounded-2xl shadow-xl shadow-secondary/30 hover:shadow-2xl hover:shadow-secondary/40 transition-all hover:scale-[1.02] active:scale-[0.98] w-full sm:w-auto"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-secondary/0 via-white/20 to-secondary/0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
        <span className="relative flex items-center justify-center gap-2">
          Показать всех провайдеров
          <svg
            className="w-5 h-5 group-hover:rotate-180 transition-transform"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 15l7-7 7 7"
            />
          </svg>
        </span>
      </button>
    </div>
  );
}
