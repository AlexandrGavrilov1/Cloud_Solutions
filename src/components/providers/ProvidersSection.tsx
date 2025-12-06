import { useState, useEffect, useMemo } from "react";
import { Provider, ResourceConfig, Review } from "./types";
import { ComparisonTable } from "./ComparisonTable";
import { ComparisonControls } from "./ComparisonControls";
import { ProvidersList } from "./ProvidersList";
import { GlobalResourceConfig } from "./GlobalResourceConfig";
import { lastUpdateDate } from "@/data/providers";
import Icon from "@/components/ui/icon";
import { SearchInput } from "./SearchInput";

interface ProvidersSectionProps {
  providers: Provider[];
}

// 🔧 Создаем компактный FilterButton с аккордеоном
const FilterButton = ({
  isOpen,
  onClick,
  filteredCount,
}: {
  isOpen: boolean;
  onClick: () => void;
  filteredCount: number;
}) => {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center justify-between p-3 bg-card border border-border rounded-lg hover:bg-accent transition-colors"
    >
      <div className="flex items-center gap-2">
        <Icon name="Filter" size={18} className="text-muted-foreground" />
        <span className="font-medium">Фильтры</span>
        {filteredCount > 0 && (
          <span className="bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded-full">
            {filteredCount}
          </span>
        )}
      </div>
      <Icon
        name={isOpen ? "ChevronUp" : "ChevronDown"}
        size={18}
        className="text-muted-foreground transition-transform"
      />
    </button>
  );
};

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
  const [filtersOpen, setFiltersOpen] = useState(false);

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

  // Сохранение фильтров в localStorage
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
      {/* 🔧 Структура с двумя колонками на десктопе */}
      <div className="flex flex-col lg:flex-row gap-6 mb-6">
        {/* 🔧 На мобильных: поиск первый */}
        <div className="order-1 lg:hidden w-full">
          <SearchInput
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Поиск провайдера..."
            className="w-full"
          />
        </div>

        {/* 🔧 На десктопе: GlobalResourceConfig слева */}
        <div className="order-2 lg:order-1 lg:w-64 xl:w-72">
          <GlobalResourceConfig onApplyConfig={applyGlobalConfig} />
        </div>

        {/* 🔧 На десктопе: правая колонка с поиском и кнопкой фильтров */}
        <div className="order-3 lg:order-2 lg:w-64 xl:w-72">
          {/* Поиск на десктопе - компактный */}
          <div className="hidden lg:block mb-4">
            <SearchInput
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Поиск..."
              className="w-full"
            />
          </div>

          {/* 🔧 Кнопка фильтров с аккордеоном */}
          <div className="w-full relative">
            <FilterButton
              isOpen={filtersOpen}
              onClick={() => setFiltersOpen(!filtersOpen)}
              filteredCount={filteredProviders.length}
            />

            {/* 🔧 Контейнер с фильтрами - раскрывается вниз */}
            {filtersOpen && (
              <div className="absolute top-full left-0 right-0 mt-2 z-10 bg-card border border-border rounded-lg shadow-lg">
                <div className="p-4 space-y-4 max-h-[70vh] overflow-y-auto">
                  {/* Сортировка */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">
                      Сортировка:
                    </label>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setSortBy("rating")}
                        className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                          sortBy === "rating"
                            ? "bg-primary text-primary-foreground"
                            : "bg-accent text-accent-foreground hover:bg-accent/80"
                        }`}
                      >
                        По рейтингу
                      </button>
                      <button
                        onClick={() => setSortBy("price")}
                        className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
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
                        Соответствие ФЗ-152
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
                        Лицензия ФСТЭК
                      </label>
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="filterTrialPeriod"
                        checked={filterTrialPeriod}
                        onChange={(e) => setFilterTrialPeriod(e.target.checked)}
                        className="w-4 h-4 rounded border-border text-primary focus:ring-primary"
                      />
                      <label
                        htmlFor="filterTrialPeriod"
                        className="text-sm cursor-pointer"
                      >
                        Есть тестовый период
                      </label>
                    </div>
                  </div>

                  {/* Селекты */}
                  <div className="space-y-4">
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
                        <option value="">Все локации</option>
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
                        <option value="">Все типы</option>
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
                        <option value="">Все типы</option>
                        {allDiskTypes.map((type) => (
                          <option key={type} value={type}>
                            {type}
                          </option>
                        ))}
                      </select>
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
                      Сбросить все фильтры
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

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
    </section>
  );
};
