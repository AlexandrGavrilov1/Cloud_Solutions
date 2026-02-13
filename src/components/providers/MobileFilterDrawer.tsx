// Добавляем новый проп в интерфейсc

interface FilterPanelAlwaysOpenProps {
  // ... все существующие пропсы
  showHeader?: boolean; // по умолчанию true
}

export const FilterPanelAlwaysOpen = ({
  // ... все пропсы
  showHeader = true,
  className = "",
}: FilterPanelAlwaysOpenProps) => {
  // ... все хуки и функции (dropdownsOpen, clearFilters, handleMultiSelectChange и т.д.)

  // --- Компонент сетки чекбоксов (без заголовка) ---
  const CheckboxGrid = () => (
    <div className="grid grid-cols-2 gap-1.5">
      <div className="space-y-1">
        <FilterCheckbox
          id="filter-fz152"
          checked={filterFZ152}
          onChange={setFilterFZ152}
          label="152-ФЗ"
        />
        <FilterCheckbox
          id="filter-1c"
          checked={filter1C}
          onChange={setFilter1C}
          label="1С"
        />
        <FilterCheckbox
          id="filter-trial"
          checked={filterTrialPeriod}
          onChange={setFilterTrialPeriod}
          label="Тестовый период"
        />
        <FilterCheckbox
          id="filter-order-before-registration"
          checked={filterOrderBeforeRegistration}
          onChange={setFilterOrderBeforeRegistration}
          label="Заказ до регистрации"
        />
      </div>
      <div className="space-y-1">
        <FilterCheckbox
          id="filter-kii"
          checked={filterKII}
          onChange={setFilterKII}
          label="КИИ"
        />
        <FilterCheckbox
          id="filter-ai"
          checked={filterAI}
          onChange={setFilterAI}
          label="AI"
        />
        <FilterCheckbox
          id="filter-mobile-app"
          checked={filterMobileApp}
          onChange={setFilterMobileApp}
          label="Моб. приложение"
        />
      </div>
    </div>
  );

  return (
    <div
      ref={panelRef}
      className={`flex-shrink-0 bg-transparent p-3 ${className}`}
    >
      <style jsx global>{` ... `}</style>

      {/* Заголовок и кнопка сброса — только если showHeader === true */}
      {showHeader && (
        <div className="flex items-center justify-between mb-1.5 pb-2 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-1.5">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white">
              Фильтры
            </h3>
            {activeFiltersCount > 0 && (
              <div className="w-4 h-4 bg-orange-500 rounded-full flex items-center justify-center">
                <span className="text-xs text-white font-bold">
                  {activeFiltersCount}
                </span>
              </div>
            )}
          </div>
          {hasActiveFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 transition-colors px-2 py-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              Сбросить
            </button>
          )}
        </div>
      )}

      {/* Сетка чекбоксов всегда видна */}
      <CheckboxGrid />

      {/* Далее все аккордеоны (без изменений) */}
      <div className="space-y-0">
        <FstekAccordion />
        {/* ... остальные аккордеоны */}
      </div>
    </div>
  );
};
