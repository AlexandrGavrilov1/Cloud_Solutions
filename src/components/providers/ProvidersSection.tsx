import { useState, useEffect, useMemo } from "react";
import { Provider, ResourceConfig, Review } from "./types";
import { ComparisonTable } from "./ComparisonTable";
import { FilterPanel } from "./FilterPanel";
import { ComparisonControls } from "./ComparisonControls";
import { ProvidersList } from "./ProvidersList";
import { GlobalResourceConfig } from "./GlobalResourceConfig";
import { lastUpdateDate } from "@/data/providers";
import Icon from "@/components/ui/icon";
import { SearchInput } from "./SearchInput"; // ← Добавляем импорт

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

  // Сохранение фильтров в localStorage (остается без изменений)
  // ... все useEffect для сохранения в localStorage остаются как есть

  const calculatePrice = (provider: Provider, config?: ResourceConfig) => {
    // ... функция calculatePrice остается без изменений
  };

  const toggleComparison = (providerId: number) => {
    // ... функция toggleComparison остается без изменений
  };

  const compareProviders = () => {
    // ... функция compareProviders остается без изменений
  };

  const updateConfig = (
    providerId: number,
    key: keyof ResourceConfig,
    value: number,
  ) => {
    // ... функция updateConfig остается без изменений
  };

  const applyGlobalConfig = (config: ResourceConfig) => {
    // ... функция applyGlobalConfig остается без изменений
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
      <div className="flex flex-col lg:flex-row gap-4 mb-6 items-start">
        <GlobalResourceConfig onApplyConfig={applyGlobalConfig} />

        <div className="flex-1">
          {/* Заменяем старое поле поиска на SearchInput */}
          <div className="mb-4">
            <SearchInput
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Найти провайдера по названию..."
              debounceDelay={300}
              size="md"
              className="w-full"
              autoFocus={false}
            />
          </div>

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
            sortBy={sortBy}
            setSortBy={setSortBy}
            allLocations={allLocations}
            allVirtualizations={allVirtualizations}
            allDiskTypes={allDiskTypes}
            allPaymentMethods={allPaymentMethods}
            allOS={allOS}
            allCPUs={allCPUs}
            filteredCount={filteredProviders.length}
            // Убираем старые пропсы для поиска
          />
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
