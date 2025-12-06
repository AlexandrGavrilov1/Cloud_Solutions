export const ProvidersSection = ({ providers }: ProvidersSectionProps) => {
  // ... существующий код до return ...

  return (
    <section id="providers" className="container mx-auto px-4 py-8">
      {/* 🔧 Структура с двумя колонками на десктопе */}
      <div className="flex flex-col lg:flex-row gap-6 mb-6">
        {/* 🔧 На десктопе: GlobalResourceConfig слева */}
        <div className="order-2 lg:order-1 lg:w-64 xl:w-72">
          <GlobalResourceConfig onApplyConfig={applyGlobalConfig} />
        </div>

        {/* 🔧 На мобильных: поиск первый */}
        <div className="order-1 lg:hidden w-full">
          <SearchInput
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Поиск провайдера..."
            className="w-full"
          />
        </div>

        {/* 🔧 На десктопе: правая колонка с компактным размещением */}
        <div className="order-3 lg:order-2 lg:flex-1 lg:flex lg:flex-col lg:items-end">
          <div className="lg:w-full lg:max-w-md xl:max-w-lg">
            {/* Поиск на десктопе - компактный, в одной строке с фильтрами */}
            <div className="hidden lg:flex lg:items-center lg:gap-3 mb-4">
              <div className="flex-1">
                <SearchInput
                  value={searchQuery}
                  onChange={setSearchQuery}
                  placeholder="Поиск провайдера..."
                  className="w-full"
                />
              </div>

              {/* 🔧 Кнопка фильтров - компактная версия для десктопа */}
              <div className="relative shrink-0">
                <button
                  onClick={() => setFiltersOpen(!filtersOpen)}
                  className="flex items-center gap-2 px-4 py-2.5 bg-card border border-border rounded-lg hover:bg-accent transition-colors whitespace-nowrap"
                >
                  <Icon
                    name="Filter"
                    size={18}
                    className="text-muted-foreground"
                  />
                  <span className="font-medium">Фильтры</span>
                  {(filteredProviders.length < providersWithReviews.length ||
                    filterFZ152 ||
                    filterFSTEK ||
                    filterTrialPeriod ||
                    filterLocation ||
                    filterVirtualization ||
                    filterMinDatacenters ||
                    filterDiskType ||
                    filterPaymentMethod ||
                    filterOS ||
                    filterCPU) && (
                    <span className="bg-primary text-primary-foreground text-xs px-1.5 py-0.5 rounded-full min-w-[20px] flex justify-center">
                      {
                        [
                          filterFZ152,
                          filterFSTEK,
                          filterTrialPeriod,
                          filterLocation,
                          filterVirtualization,
                          filterMinDatacenters,
                          filterDiskType,
                          filterPaymentMethod,
                          filterOS,
                          filterCPU,
                        ].filter(Boolean).length
                      }
                    </span>
                  )}
                  <Icon
                    name={filtersOpen ? "ChevronUp" : "ChevronDown"}
                    size={18}
                    className="text-muted-foreground transition-transform"
                  />
                </button>

                {/* 🔧 Выпадающее меню фильтров - выравниваем по правому краю */}
                {filtersOpen && (
                  <div className="absolute top-full right-0 mt-2 z-10 bg-card border border-border rounded-lg shadow-lg w-80">
                    <div className="p-4 space-y-4 max-h-[70vh] overflow-y-auto">
                      {/* Сортировка */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">
                          Сортировка:
                        </label>
                        <div className="flex gap-2">
                          <button
                            onClick={() => setSortBy("rating")}
                            className={`flex-1 px-3 py-1.5 text-sm rounded-lg transition-colors ${
                              sortBy === "rating"
                                ? "bg-primary text-primary-foreground"
                                : "bg-accent text-accent-foreground hover:bg-accent/80"
                            }`}
                          >
                            По рейтингу
                          </button>
                          <button
                            onClick={() => setSortBy("price")}
                            className={`flex-1 px-3 py-1.5 text-sm rounded-lg transition-colors ${
                              sortBy === "price"
                                ? "bg-primary text-primary-foreground"
                                : "bg-accent text-accent-foreground hover:bg-accent/80"
                            }`}
                          >
                            По цене
                          </button>
                        </div>
                      </div>

                      {/* Чекбоксы */}
                      <div className="space-y-3">
                        <label className="text-sm font-medium text-foreground">
                          Фильтры:
                        </label>

                        <div className="grid grid-cols-2 gap-2">
                          <div className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              id="filterFZ152"
                              checked={filterFZ152}
                              onChange={(e) => setFilterFZ152(e.target.checked)}
                              className="w-4 h-4 rounded border-border text-primary focus:ring-primary"
                            />
                            <label
                              htmlFor="filterFZ152"
                              className="text-sm cursor-pointer"
                            >
                              ФЗ-152
                            </label>
                          </div>

                          <div className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              id="filterFSTEK"
                              checked={filterFSTEK}
                              onChange={(e) => setFilterFSTEK(e.target.checked)}
                              className="w-4 h-4 rounded border-border text-primary focus:ring-primary"
                            />
                            <label
                              htmlFor="filterFSTEK"
                              className="text-sm cursor-pointer"
                            >
                              ФСТЭК
                            </label>
                          </div>

                          <div className="flex items-center gap-2 col-span-2">
                            <input
                              type="checkbox"
                              id="filterTrialPeriod"
                              checked={filterTrialPeriod}
                              onChange={(e) =>
                                setFilterTrialPeriod(e.target.checked)
                              }
                              className="w-4 h-4 rounded border-border text-primary focus:ring-primary"
                            />
                            <label
                              htmlFor="filterTrialPeriod"
                              className="text-sm cursor-pointer"
                            >
                              Тестовый период
                            </label>
                          </div>
                        </div>
                      </div>

                      {/* Селекты в две колонки для компактности */}
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-foreground">
                            Локация:
                          </label>
                          <select
                            value={filterLocation || ""}
                            onChange={(e) =>
                              setFilterLocation(e.target.value || null)
                            }
                            className="w-full p-2 text-sm bg-background border border-border rounded-lg focus:border-primary focus:outline-none"
                          >
                            <option value="">Все</option>
                            {allLocations.map((loc) => (
                              <option key={loc} value={loc}>
                                {loc}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-medium text-foreground">
                            Виртуализация:
                          </label>
                          <select
                            value={filterVirtualization || ""}
                            onChange={(e) =>
                              setFilterVirtualization(e.target.value || null)
                            }
                            className="w-full p-2 text-sm bg-background border border-border rounded-lg focus:border-primary focus:outline-none"
                          >
                            <option value="">Все</option>
                            {allVirtualizations.map((virt) => (
                              <option key={virt} value={virt}>
                                {virt}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-medium text-foreground">
                            Тип диска:
                          </label>
                          <select
                            value={filterDiskType || ""}
                            onChange={(e) =>
                              setFilterDiskType(e.target.value || null)
                            }
                            className="w-full p-2 text-sm bg-background border border-border rounded-lg focus:border-primary focus:outline-none"
                          >
                            <option value="">Все</option>
                            {allDiskTypes.map((type) => (
                              <option key={type} value={type}>
                                {type}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-medium text-foreground">
                            Оплата:
                          </label>
                          <select
                            value={filterPaymentMethod || ""}
                            onChange={(e) =>
                              setFilterPaymentMethod(e.target.value || null)
                            }
                            className="w-full p-2 text-sm bg-background border border-border rounded-lg focus:border-primary focus:outline-none"
                          >
                            <option value="">Все</option>
                            {allPaymentMethods.map((method) => (
                              <option key={method} value={method}>
                                {method}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      {/* Дополнительные фильтры */}
                      {allOS.length > 0 && (
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-foreground">
                            ОС:
                          </label>
                          <select
                            value={filterOS || ""}
                            onChange={(e) =>
                              setFilterOS(e.target.value || null)
                            }
                            className="w-full p-2 text-sm bg-background border border-border rounded-lg focus:border-primary focus:outline-none"
                          >
                            <option value="">Все ОС</option>
                            {allOS.map((os) => (
                              <option key={os} value={os}>
                                {os}
                              </option>
                            ))}
                          </select>
                        </div>
                      )}

                      {allCPUs.length > 0 && (
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-foreground">
                            Процессор:
                          </label>
                          <select
                            value={filterCPU || ""}
                            onChange={(e) =>
                              setFilterCPU(e.target.value || null)
                            }
                            className="w-full p-2 text-sm bg-background border border-border rounded-lg focus:border-primary focus:outline-none"
                          >
                            <option value="">Все CPU</option>
                            {allCPUs.map((cpu) => (
                              <option key={cpu} value={cpu}>
                                {cpu}
                              </option>
                            ))}
                          </select>
                        </div>
                      )}

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">
                          Мин. дата-центров:
                        </label>
                        <div className="flex items-center gap-2">
                          <input
                            type="range"
                            min="1"
                            max="10"
                            value={filterMinDatacenters || 1}
                            onChange={(e) =>
                              setFilterMinDatacenters(parseInt(e.target.value))
                            }
                            className="flex-1"
                          />
                          <span className="text-sm font-medium w-8 text-center">
                            {filterMinDatacenters || 1}
                          </span>
                        </div>
                      </div>

                      {/* Кнопка сброса */}
                      <div className="pt-2">
                        <button
                          onClick={() => {
                            setFilterFZ152(false);
                            setFilterFSTEK(false);
                            setFilterTrialPeriod(false);
                            setFilterLocation(null);
                            setFilterVirtualization(null);
                            setFilterMinDatacenters(null);
                            setFilterDiskType(null);
                            setFilterPaymentMethod(null);
                            setFilterOS(null);
                            setFilterCPU(null);
                            setSortBy("rating");
                          }}
                          className="w-full py-2 px-4 text-sm font-medium bg-destructive/10 text-destructive rounded-lg hover:bg-destructive/20 transition-colors"
                        >
                          Сбросить фильтры
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* 🔧 Мобильная версия кнопки фильтров */}
            <div className="lg:hidden">
              <FilterButton
                isOpen={filtersOpen}
                onClick={() => setFiltersOpen(!filtersOpen)}
                filteredCount={
                  [
                    filterFZ152,
                    filterFSTEK,
                    filterTrialPeriod,
                    filterLocation,
                    filterVirtualization,
                    filterMinDatacenters,
                    filterDiskType,
                    filterPaymentMethod,
                    filterOS,
                    filterCPU,
                  ].filter(Boolean).length
                }
              />

              {filtersOpen && (
                <div className="mt-2 bg-card border border-border rounded-lg shadow-lg">
                  <div className="p-4 space-y-4">
                    {/* ... тот же контент фильтров для мобильной версии ... */}
                    {/* (можно скопировать из выпадающего меню выше, убрав absolute positioning) */}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ... остальной код (ProvidersList, кнопка "Показать ещё", ComparisonControls) ... */}
    </section>
  );
};
