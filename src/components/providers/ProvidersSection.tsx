import { useState, useEffect, useMemo } from "react";
import { Provider, ResourceConfig, Review } from "./types";
import { ComparisonTable } from "./ComparisonTable";
import { FilterPanel } from "./FilterPanel";
import { ComparisonControls } from "./ComparisonControls";
import { ProvidersList } from "./ProvidersList";
import { GlobalResourceConfig } from "./GlobalResourceConfig";
import { SortPanel } from "./SortPanel";
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
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Левый блок: Конфигуратор и Фильтры */}
        <div className="lg:w-1/4 flex flex-col gap-6">
          {/* Конфигуратор */}
          <div className="bg-white rounded-xl shadow-md p-5 border border-gray-100">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Конфигуратор ресурсов
            </h2>
            <div className="bg-blue-50 border-l-4 border-blue-500 p-3 rounded-r">
              <p className="text-gray-700 font-medium">
                CPU 1 + RAM 1GB + Storage 10GB
              </p>
            </div>
          </div>

          {/* Фильтры */}
          <div className="bg-white rounded-xl shadow-md p-5 border border-gray-100">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Фильтры</h2>
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
              compact={true}
            />
          </div>
        </div>

        {/* Правый блок: Поиск провайдеров и сортировка + Список провайдеров */}
        <div className="lg:w-3/4">
          {/* Верхняя панель с поиском и сортировкой */}
          <div className="bg-white rounded-xl shadow-md p-5 border border-gray-100 mb-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Поиск провайдеров
            </h2>

            <div className="flex flex-col md:flex-row gap-4 justify-between">
              {/* Поиск */}
              <div className="flex-1">
                <div className="relative">
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </div>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Поиск провайдеров"
                    className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  />
                </div>
              </div>

              {/* Сортировка */}
              <div className="md:w-auto">
                <SortPanel sortBy={sortBy} setSortBy={setSortBy} />
              </div>
            </div>

            {/* Дополнительные фильтры (сертификат, дата) как на изображении */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-medium text-gray-700 mb-2">Сертификат</h3>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="certificate"
                    className="w-4 h-4 text-blue-600 rounded"
                  />
                  <label htmlFor="certificate" className="text-gray-600">
                    P
                  </label>
                </div>
              </div>
              <div>
                <h3 className="font-medium text-gray-700 mb-2">Дата</h3>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="price"
                      className="w-4 h-4 text-blue-600 rounded"
                    />
                    <label htmlFor="price" className="text-gray-600">
                      180 рублей
                    </label>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="custom-text"
                      className="w-4 h-4 text-blue-600 rounded"
                    />
                    <label htmlFor="custom-text" className="text-gray-600">
                      Текст по запросу
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Список провайдеров */}
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

          {/* Кнопка "Показать еще" */}
          {filteredProviders.length > providersToShow && (
            <div className="flex justify-center mt-8">
              <button
                onClick={() => setProvidersToShow((prev) => prev + 9)}
                className="px-8 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                Показать ещё 9 провайдеров
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Управление сравнением */}
      <ComparisonControls
        selectedForComparison={selectedForComparison}
        compareProviders={compareProviders}
      />
    </section>
  );
};
