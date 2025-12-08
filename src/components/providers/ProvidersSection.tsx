import { useState, useEffect, useMemo } from "react";
import { Provider, ResourceConfig, Review } from "./types";
import { ComparisonTable } from "./ComparisonTable";
import { FilterPanel } from "./FilterPanel";
import { ComparisonControls } from "./ComparisonControls";
import { ProvidersList } from "./ProvidersList";
import { GlobalResourceConfig } from "./GlobalResourceConfig";
import { SortPanel } from "./SortPanel";
import { SearchInput } from "./SearchInput";
import { lastUpdateDate } from "@/data/providers";
import Icon from "@/components/ui/icon";

interface ProvidersSectionProps {
  providers: Provider[];
}

export const ProvidersSection = ({ providers }: ProvidersSectionProps) => {
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(
    null,
  );
  const [configOpen, setConfigOpen] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterFZ152, setFilterFZ152] = useState(() => {
    const saved = localStorage.getItem("filterFZ152");
    return saved ? JSON.parse(saved) : false;
  });
  const [filterFSTEK, setFilterFSTEK] = useState(() => {
    const saved = localStorage.getItem("filterFSTEK");
    return saved ? JSON.parse(saved) : false;
  });
  const [filterTrialPeriod, setFilterTrialPeriod] = useState(() => {
    const saved = localStorage.getItem("filterTrialPeriod");
    return saved ? JSON.parse(saved) : false;
  });
  const [filterLocation, setFilterLocation] = useState<string | null>(() => {
    return localStorage.getItem("filterLocation") || null;
  });
  const [filterVirtualization, setFilterVirtualization] = useState<
    string | null
  >(() => {
    return localStorage.getItem("filterVirtualization") || null;
  });
  const [filterMinDatacenters, setFilterMinDatacenters] = useState<
    number | null
  >(() => {
    const saved = localStorage.getItem("filterMinDatacenters");
    return saved ? parseInt(saved) : null;
  });
  const [filterDiskType, setFilterDiskType] = useState<string | null>(() => {
    return localStorage.getItem("filterDiskType") || null;
  });
  const [filterPaymentMethod, setFilterPaymentMethod] = useState<string | null>(
    () => {
      return localStorage.getItem("filterPaymentMethod") || null;
    },
  );
  const [filterOS, setFilterOS] = useState<string | null>(() => {
    return localStorage.getItem("filterOS") || null;
  });
  const [filterCPU, setFilterCPU] = useState<string | null>(() => {
    return localStorage.getItem("filterCPU") || null;
  });
  const [sortBy, setSortBy] = useState<"rating" | "price">(() => {
    const saved = localStorage.getItem("sortBy");
    return (saved as "rating" | "price") || "rating";
  });
  const [selectedForComparison, setSelectedForComparison] = useState<number[]>(
    [],
  );
  const [showComparison, setShowComparison] = useState(false);
  const [providersToShow, setProvidersToShow] = useState(9);
  const [reviewsToShow, setReviewsToShow] = useState<Record<number, number>>(
    () => {
      const initialReviews: Record<number, number> = {};
      providers.forEach((provider) => {
        initialReviews[provider.id] = 5;
      });
      return initialReviews;
    },
  );
  const [configs, setConfigs] = useState<Record<number, ResourceConfig>>(() => {
    const initialConfigs: Record<number, ResourceConfig> = {};
    providers.forEach((provider) => {
      initialConfigs[provider.id] = { cpu: 1, ram: 1, storage: 10 };
    });
    return initialConfigs;
  });
  const [loadedReviews, setLoadedReviews] = useState<Record<number, Review[]>>(
    {},
  );
  const [providersWithReviews, setProvidersWithReviews] =
    useState<Provider[]>(providers);
  const [isFiltersExpanded, setIsFiltersExpanded] = useState(false);

  useEffect(() => {
    const fetchApprovedReviews = async () => {
      try {
        const response = await fetch(
          "https://functions.poehali.dev/15bd2bf9-a831-4ef9-9ce3-fd6c7823ddc8?status=approved",
        );
        if (response.ok) {
          const data = await response.json();
          const reviewsByProvider: Record<number, Review[]> = {};

          data.reviews.forEach((review: Review) => {
            if (!reviewsByProvider[review.provider_id]) {
              reviewsByProvider[review.provider_id] = [];
            }
            reviewsByProvider[review.provider_id].push(review);
          });

          setLoadedReviews(reviewsByProvider);

          const updatedProviders = providers.map((provider) => ({
            ...provider,
            reviews: reviewsByProvider[provider.id] || provider.reviews,
          }));
          setProvidersWithReviews(updatedProviders);
        }
      } catch (error) {
        console.error("Error fetching approved reviews:", error);
      }
    };

    fetchApprovedReviews();
  }, [providers]);

  useEffect(() => {
    localStorage.setItem("filterFZ152", JSON.stringify(filterFZ152));
  }, [filterFZ152]);

  useEffect(() => {
    localStorage.setItem("filterFSTEK", JSON.stringify(filterFSTEK));
  }, [filterFSTEK]);

  useEffect(() => {
    localStorage.setItem(
      "filterTrialPeriod",
      JSON.stringify(filterTrialPeriod),
    );
  }, [filterTrialPeriod]);

  useEffect(() => {
    if (filterLocation) {
      localStorage.setItem("filterLocation", filterLocation);
    } else {
      localStorage.removeItem("filterLocation");
    }
  }, [filterLocation]);

  useEffect(() => {
    if (filterVirtualization) {
      localStorage.setItem("filterVirtualization", filterVirtualization);
    } else {
      localStorage.removeItem("filterVirtualization");
    }
  }, [filterVirtualization]);

  useEffect(() => {
    if (filterMinDatacenters !== null) {
      localStorage.setItem(
        "filterMinDatacenters",
        filterMinDatacenters.toString(),
      );
    } else {
      localStorage.removeItem("filterMinDatacenters");
    }
  }, [filterMinDatacenters]);

  useEffect(() => {
    if (filterDiskType) {
      localStorage.setItem("filterDiskType", filterDiskType);
    } else {
      localStorage.removeItem("filterDiskType");
    }
  }, [filterDiskType]);

  useEffect(() => {
    if (filterPaymentMethod) {
      localStorage.setItem("filterPaymentMethod", filterPaymentMethod);
    } else {
      localStorage.removeItem("filterPaymentMethod");
    }
  }, [filterPaymentMethod]);

  useEffect(() => {
    if (filterOS) {
      localStorage.setItem("filterOS", filterOS);
    } else {
      localStorage.removeItem("filterOS");
    }
  }, [filterOS]);

  useEffect(() => {
    if (filterCPU) {
      localStorage.setItem("filterCPU", filterCPU);
    } else {
      localStorage.removeItem("filterCPU");
    }
  }, [filterCPU]);

  useEffect(() => {
    localStorage.setItem("sortBy", sortBy);
  }, [sortBy]);

  const calculatePrice = (provider: Provider, config?: ResourceConfig) => {
    if (!config) {
      config = { cpu: 1, ram: 1, storage: 10 };
    }

    const calculatedPrice = Math.round(
      provider.basePrice +
        config.cpu * provider.cpuPrice +
        config.ram * provider.ramPrice +
        config.storage * provider.storagePrice,
    );

    // Если конфигурация минимальная и есть minPrice, используем его
    if (
      config.cpu === 1 &&
      config.ram === 1 &&
      config.storage === 10 &&
      provider.pricingDetails.minPrice
    ) {
      return Math.min(calculatedPrice, provider.pricingDetails.minPrice);
    }

    return calculatedPrice;
  };

  const toggleComparison = (providerId: number) => {
    setSelectedForComparison((prev) =>
      prev.includes(providerId)
        ? prev.filter((id) => id !== providerId)
        : [...prev, providerId],
    );
  };

  const compareProviders = () => {
    if (selectedForComparison.length >= 2) {
      setShowComparison(true);
    }
  };

  const updateConfig = (
    providerId: number,
    key: keyof ResourceConfig,
    value: number,
  ) => {
    setConfigs((prev) => ({
      ...prev,
      [providerId]: { ...prev[providerId], [key]: value },
    }));
  };

  const applyGlobalConfig = (config: ResourceConfig) => {
    const updatedConfigs: Record<number, ResourceConfig> = {};
    providersWithReviews.forEach((provider) => {
      updatedConfigs[provider.id] = { ...config };
    });
    setConfigs(updatedConfigs);
  };

  const allLocations = useMemo(
    () =>
      Array.from(
        new Set(providersWithReviews.flatMap((p) => p.locations)),
      ).sort(),
    [providersWithReviews],
  );

  const allVirtualizations = useMemo(
    () =>
      Array.from(
        new Set(
          providersWithReviews.flatMap((p) => p.technicalSpecs.virtualization),
        ),
      ).sort(),
    [providersWithReviews],
  );

  const allDiskTypes = useMemo(
    () =>
      Array.from(
        new Set(providersWithReviews.map((p) => p.technicalSpecs.diskType)),
      ).sort(),
    [providersWithReviews],
  );

  const allPaymentMethods = useMemo(
    () =>
      Array.from(
        new Set(
          providersWithReviews.flatMap((p) => p.pricingDetails.paymentMethods),
        ),
      ).sort(),
    [providersWithReviews],
  );

  const allOS = useMemo(
    () =>
      Array.from(
        new Set(
          providersWithReviews.flatMap((p) => p.technicalSpecs.availableOS),
        ),
      ).sort(),
    [providersWithReviews],
  );

  const allCPUs = useMemo(
    () =>
      Array.from(
        new Set(
          providersWithReviews.flatMap((p) => p.technicalSpecs.cpuModels || []),
        ),
      ).sort(),
    [providersWithReviews],
  );

  const filteredProviders = useMemo(
    () =>
      providersWithReviews
        .filter((p) => {
          if (
            searchQuery &&
            !p.name.toLowerCase().includes(searchQuery.toLowerCase())
          )
            return false;
          if (filterFZ152 && !p.fz152Compliant) return false;
          if (filterFSTEK && !p.fstekCompliant) return false;
          if (filterTrialPeriod && p.trialDays === 0) return false;
          if (filterLocation && !p.locations.includes(filterLocation))
            return false;
          if (
            filterVirtualization &&
            !p.technicalSpecs.virtualization.includes(filterVirtualization)
          )
            return false;
          if (
            filterMinDatacenters !== null &&
            p.locations.length < filterMinDatacenters
          )
            return false;
          if (filterDiskType && p.technicalSpecs.diskType !== filterDiskType)
            return false;
          if (
            filterPaymentMethod &&
            !p.pricingDetails.paymentMethods.includes(filterPaymentMethod)
          )
            return false;
          if (filterOS && !p.technicalSpecs.availableOS.includes(filterOS))
            return false;
          if (
            filterCPU &&
            (!p.technicalSpecs.cpuModels ||
              !p.technicalSpecs.cpuModels.includes(filterCPU))
          )
            return false;
          return true;
        })
        .sort((a, b) => {
          if (sortBy === "rating") {
            const avgRatingA =
              a.reviews.reduce((sum, r) => sum + r.rating, 0) /
              a.reviews.length;
            const avgRatingB =
              b.reviews.reduce((sum, r) => sum + r.rating, 0) /
              b.reviews.length;
            return avgRatingB - avgRatingA;
          } else {
            const priceA = calculatePrice(a, configs[a.id]);
            const priceB = calculatePrice(b, configs[b.id]);
            return priceA - priceB;
          }
        }),
    [
      providersWithReviews,
      searchQuery,
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
      sortBy,
      configs,
    ],
  );

  if (showComparison) {
    const selectedProviders = providersWithReviews.filter((p) =>
      selectedForComparison.includes(p.id),
    );
    return (
      <ComparisonTable
        providers={selectedProviders}
        configs={configs}
        calculatePrice={calculatePrice}
        onClose={() => setShowComparison(false)}
      />
    );
  }

  return (
    <section id="providers" className="container mx-auto px-4 py-8">
      {/* Верхняя строка с конфигуратором и элементами управления */}
      <div className="grid grid-cols-1 lg:grid-cols-6 gap-4 mb-6">
        {/* Конфигуратор ресурсов - занимает колонки 1 и 2 */}
        <div className="lg:col-span-2">
          <GlobalResourceConfig onApplyConfig={applyGlobalConfig} />
        </div>

        {/* Фильтры - занимают колонки 3-5 при раскрытии, только колонку 3 при свернутом состоянии */}
        {isFiltersExpanded ? (
          // Развернутые фильтры занимают колонки 3-5
          <div className="lg:col-span-3">
            <div className="bg-card border border-border rounded-md p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center">
                    <Icon name="Filter" size={16} className="text-primary" />
                  </div>
                  <span className="font-bold text-lg text-foreground">
                    Фильтры
                  </span>
                </div>
                <button
                  onClick={() => setIsFiltersExpanded(false)}
                  className="p-1 hover:bg-accent rounded-md transition-colors"
                >
                  <Icon name="X" size={20} className="text-muted-foreground" />
                </button>
              </div>

              {/* Упрощенная версия фильтров для десктопа */}
              <div className="space-y-4">
                {/* Чекбоксы */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="flex items-center space-x-3 p-3 bg-background/50 rounded-lg border border-border">
                    <input
                      type="checkbox"
                      id="fz152-desktop"
                      checked={filterFZ152}
                      onChange={(e) => setFilterFZ152(e.target.checked)}
                      className="w-4 h-4 rounded border-2 border-primary text-primary focus:ring-primary/20"
                    />
                    <label
                      htmlFor="fz152-desktop"
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <Icon
                        name="ShieldCheck"
                        size={16}
                        className="text-primary"
                      />
                      <span className="text-sm">ФЗ-152</span>
                    </label>
                  </div>

                  <div className="flex items-center space-x-3 p-3 bg-background/50 rounded-lg border border-border">
                    <input
                      type="checkbox"
                      id="fstek-desktop"
                      checked={filterFSTEK}
                      onChange={(e) => setFilterFSTEK(e.target.checked)}
                      className="w-4 h-4 rounded border-2 border-primary text-primary focus:ring-primary/20"
                    />
                    <label
                      htmlFor="fstek-desktop"
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <Icon
                        name="ShieldAlert"
                        size={16}
                        className="text-primary"
                      />
                      <span className="text-sm">ФСТЕК</span>
                    </label>
                  </div>

                  <div className="flex items-center space-x-3 p-3 bg-background/50 rounded-lg border border-border">
                    <input
                      type="checkbox"
                      id="trial-desktop"
                      checked={filterTrialPeriod}
                      onChange={(e) => setFilterTrialPeriod(e.target.checked)}
                      className="w-4 h-4 rounded border-2 border-primary text-primary focus:ring-primary/20"
                    />
                    <label
                      htmlFor="trial-desktop"
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <Icon name="Gift" size={16} className="text-primary" />
                      <span className="text-sm">Триал</span>
                    </label>
                  </div>
                </div>

                {/* Выпадающие списки */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  <div className="relative">
                    <select
                      className="w-full h-10 rounded-lg border-2 border-input bg-background text-foreground text-sm font-medium appearance-none cursor-pointer hover:border-primary/50 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all px-3"
                      value={filterLocation || ""}
                      onChange={(e) =>
                        setFilterLocation(e.target.value || null)
                      }
                    >
                      <option value="">Локация</option>
                      {allLocations.map((loc) => (
                        <option key={loc} value={loc}>
                          {loc}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="relative">
                    <select
                      className="w-full h-10 rounded-lg border-2 border-input bg-background text-foreground text-sm font-medium appearance-none cursor-pointer hover:border-primary/50 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all px-3"
                      value={filterVirtualization || ""}
                      onChange={(e) =>
                        setFilterVirtualization(e.target.value || null)
                      }
                    >
                      <option value="">Виртуализация</option>
                      {allVirtualizations.map((virt) => (
                        <option key={virt} value={virt}>
                          {virt}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="relative">
                    <select
                      className="w-full h-10 rounded-lg border-2 border-input bg-background text-foreground text-sm font-medium appearance-none cursor-pointer hover:border-primary/50 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all px-3"
                      value={filterDiskType || ""}
                      onChange={(e) =>
                        setFilterDiskType(e.target.value || null)
                      }
                    >
                      <option value="">Тип диска</option>
                      {allDiskTypes.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="relative">
                    <select
                      className="w-full h-10 rounded-lg border-2 border-input bg-background text-foreground text-sm font-medium appearance-none cursor-pointer hover:border-primary/50 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all px-3"
                      value={filterPaymentMethod || ""}
                      onChange={(e) =>
                        setFilterPaymentMethod(e.target.value || null)
                      }
                    >
                      <option value="">Оплата</option>
                      {allPaymentMethods.map((method) => (
                        <option key={method} value={method}>
                          {method}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="relative">
                    <select
                      className="w-full h-10 rounded-lg border-2 border-input bg-background text-foreground text-sm font-medium appearance-none cursor-pointer hover:border-primary/50 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all px-3"
                      value={filterOS || ""}
                      onChange={(e) => setFilterOS(e.target.value || null)}
                    >
                      <option value="">ОС</option>
                      {allOS.map((os) => (
                        <option key={os} value={os}>
                          {os}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="relative">
                    <select
                      className="w-full h-10 rounded-lg border-2 border-input bg-background text-foreground text-sm font-medium appearance-none cursor-pointer hover:border-primary/50 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all px-3"
                      value={filterCPU || ""}
                      onChange={(e) => setFilterCPU(e.target.value || null)}
                    >
                      <option value="">Процессор</option>
                      {allCPUs.map((cpu) => (
                        <option key={cpu} value={cpu}>
                          {cpu}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Кнопка сброса */}
                <div className="flex justify-end">
                  <button
                    onClick={() => {
                      setFilterFZ152(false);
                      setFilterFSTEK(false);
                      setFilterTrialPeriod(false);
                      setFilterLocation(null);
                      setFilterVirtualization(null);
                      setFilterDiskType(null);
                      setFilterPaymentMethod(null);
                      setFilterOS(null);
                      setFilterCPU(null);
                      setFilterMinDatacenters(null);
                    }}
                    className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Сбросить все фильтры
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          // Свернутое состояние - только кнопка в колонке 3
          <>
            <div className="lg:col-span-1">
              <button
                onClick={() => setIsFiltersExpanded(true)}
                className="w-full bg-card border border-border rounded-md p-4 flex items-center justify-between hover:bg-accent transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center">
                    <Icon name="Filter" size={16} className="text-primary" />
                  </div>
                  <span className="font-medium text-foreground">Фильтры</span>
                </div>
                <Icon
                  name="ChevronDown"
                  size={20}
                  className="text-muted-foreground"
                />
              </button>
            </div>

            {/* Пустые колонки 4 и 5 в свернутом состоянии */}
            <div className="lg:col-span-2 hidden lg:block"></div>
          </>
        )}

        {/* Поиск и сортировка - колонка 6 */}
        <div className="lg:col-span-1 space-y-4">
          {/* Поиск - импортируется из SearchInput */}
          <SearchInput
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />

          {/* Сортировка - импортируется из SortPanel */}
          <div className="bg-card border border-border rounded-md p-4">
            <SortPanel sortBy={sortBy} setSortBy={setSortBy} />
          </div>
        </div>
      </div>

      {/* Фильтры для мобильных - вне сетки */}
      <div className="lg:hidden mb-6">
        <FilterPanel
          filterFZ152={filterFZ152}
          setFilterFZ152={setFilterFZ152}
          filterFSTEK={filterFSTEK}
          setFilterFSTEK={setFilterFSTEK}
          filterTrialPeriod={filterTrialPeriod}
          setFilterTrialPeriod={setFilterTrialPeriod}
          filterLocation={filterLocation}
          setFilterLocation={setFilterLocation}
          filterVirtualization={filterVirtualization}
          setFilterVirtualization={setFilterVirtualization}
          filterMinDatacenters={filterMinDatacenters}
          setFilterMinDatacenters={setFilterMinDatacenters}
          filterDiskType={filterDiskType}
          setFilterDiskType={setFilterDiskType}
          filterPaymentMethod={filterPaymentMethod}
          setFilterPaymentMethod={setFilterPaymentMethod}
          filterOS={filterOS}
          setFilterOS={setFilterOS}
          filterCPU={filterCPU}
          setFilterCPU={setFilterCPU}
          allLocations={allLocations}
          allVirtualizations={allVirtualizations}
          allDiskTypes={allDiskTypes}
          allPaymentMethods={allPaymentMethods}
          allOS={allOS}
          allCPUs={allCPUs}
          filteredCount={filteredProviders.length}
        />
      </div>

      {/* Список провайдеров */}
      <div>
        <ProvidersList
          filteredProviders={filteredProviders.slice(0, providersToShow)}
          configs={configs}
          calculatePrice={calculatePrice}
          configOpen={configOpen}
          setConfigOpen={setConfigOpen}
          updateConfig={updateConfig}
          selectedProvider={selectedProvider}
          setSelectedProvider={setSelectedProvider}
          reviewsToShow={reviewsToShow}
          setReviewsToShow={setReviewsToShow}
          selectedForComparison={selectedForComparison}
          toggleComparison={toggleComparison}
        />

        {filteredProviders.length > providersToShow && (
          <div className="flex justify-center mt-8">
            <button
              onClick={() => setProvidersToShow((prev) => prev + 9)}
              className="group relative px-8 py-4 bg-gradient-to-r from-primary to-primary/80 text-background font-bold text-lg rounded-2xl shadow-xl shadow-primary/30 hover:shadow-2xl hover:shadow-primary/40 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-white/20 to-primary/0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <span className="relative flex items-center gap-2">
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
          </div>
        )}

        <ComparisonControls
          selectedForComparison={selectedForComparison}
          compareProviders={compareProviders}
        />
      </div>
    </section>
  );
};
