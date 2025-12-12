import { useState, useEffect, useMemo } from "react";
import { Provider, ResourceConfig, Review } from "./types";
import { ComparisonTable } from "./ComparisonTable";
import { FilterPanel } from "./FilterPanel";
import { ComparisonControls } from "./ComparisonControls";
import { ProvidersList } from "./ProvidersList";
import { GlobalResourceConfig } from "./GlobalResourceConfig";
import { SearchInput } from "./SearchInput";
import { SortPanel } from "./SortPanel";
import { ProvidersCounter } from "./ProvidersCounter";

interface ProvidersSectionProps {
  providers: Provider[];
}

export const ProvidersSection = ({ providers }: ProvidersSectionProps) => {
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(
    null,
  );
  const [configOpen, setConfigOpen] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"rating" | "price">("rating");
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
      {/* Верхняя строка - адаптивная */}
      <div className="mb-4">
        {/* Для мобильных: вертикальное расположение */}
        <div className="flex flex-col sm:hidden gap-2">
          {/* Поиск */}
          <SearchInput
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Поиск..."
            className="w-full"
          />

          {/* Сортировка */}
          <SortPanel sortBy={sortBy} setSortBy={setSortBy} />

          {/* Счетчик провайдеров */}
          <ProvidersCounter
            currentCount={Math.min(providersToShow, filteredProviders.length)}
            totalCount={filteredProviders.length}
            className="w-full"
          />

          {/* Фильтр */}
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
          />

          {/* Конфигуратор */}
          <GlobalResourceConfig onApplyConfig={applyGlobalConfig} />
        </div>

        {/* Для планшетов и десктопов: горизонтальное расположение */}
        <div className="hidden sm:grid sm:grid-cols-12">
          {/* Первая строка: Счетчик провайдеров и Поиск в одной строке */}
          <div className="col-span-12 flex gap-4 mb-0.5">
            {/* Счетчик провайдеров */}
            <div className="w-2/3">
              <ProvidersCounter
                currentCount={Math.min(
                  providersToShow,
                  filteredProviders.length,
                )}
                totalCount={filteredProviders.length}
                className="w-full"
              />
            </div>

            {/* Поиск - выровнен по правому краю */}
            <div className="w-1/3 flex justify-end">
              <SearchInput
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="Поиск..."
                className="ml-auto"
              />
            </div>
          </div>
          {/* Вторая строка: Сортировка, Фильтры и Конфигуратор в одной строке */}
          <div className="col-span-12 flex items-center gap-2">
            {" "}
            {/* items-center вместо gap-0 */}
            {/* Сортировка и Фильтры */}
            <div className="w-2/3 flex items-center gap-2">
              {" "}
              {/* items-center вместо items-start */}
              {/* Сортировка */}
              <div className="flex-shrink-0">
                <SortPanel sortBy={sortBy} setSortBy={setSortBy} />
              </div>
              {/* Фильтры */}
              <div className="flex-grow">
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
                />
              </div>
            </div>
            {/* Конфигуратор */}
            <div className="w-1/3 flex justify-end">
              <GlobalResourceConfig onApplyConfig={applyGlobalConfig} />
            </div>
          </div>
        </div>
      </div>

      {/* Отступ между сортировкой и карточками */}
      <div className="mb-4"></div>

      {/* Блок с результатами поиска */}
      {searchQuery && (
        <div className="mb-4 px-2">
          <div className="text-sm text-muted-foreground">
            Поиск:{" "}
            <span className="font-semibold text-foreground">
              "{searchQuery}"
            </span>
            {filteredProviders.length > 0 && (
              <span className="ml-2">
                ({filteredProviders.length} провайдер
                {filteredProviders.length === 1 ? "" : "ов"})
              </span>
            )}
          </div>
        </div>
      )}

      {searchQuery && filteredProviders.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-muted-foreground text-lg mb-2">
            По запросу "{searchQuery}" ничего не найдено
          </div>
          <div className="text-sm text-muted-foreground">
            Попробуйте изменить поисковый запрос или сбросить фильтры
          </div>
        </div>
      ) : (
        <>
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
            <div className="flex flex-col sm:flex-row justify-center items-center gap-2 mt-8">
              {/* Кнопка "Показать ещё 9 провайдеров" */}
              <button
                onClick={() => setProvidersToShow((prev) => prev + 9)}
                className="group relative px-8 py-4 bg-gradient-to-r from-primary to-primary/80 text-background font-bold text-lg rounded-2xl shadow-xl shadow-primary/30 hover:shadow-2xl hover:shadow-primary/40 transition-all hover:scale-[1.02] active:scale-[0.98] w-full sm:w-auto"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-white/20 to-primary/0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <span className="relative flex items-center justify-center gap-2">
                  Показать ещё 9
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

              {/* Кнопка "Показать всех провайдеров" */}
              <button
                onClick={() => setProvidersToShow(filteredProviders.length)}
                className="group relative px-8 py-4 bg-gradient-to-r from-secondary to-secondary/80 text-background font-bold text-lg rounded-2xl shadow-xl shadow-secondary/30 hover:shadow-2xl hover:shadow-secondary/40 transition-all hover:scale-[1.02] active:scale-[0.98] w-full sm:w-auto"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-secondary/0 via-white/20 to-secondary/0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <span className="relative flex items-center justify-center gap-2">
                  Показать всех
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
          )}
        </>
      )}

      <ComparisonControls
        selectedForComparison={selectedForComparison}
        compareProviders={compareProviders}
      />
    </section>
  );
};
