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

  const [filterFSTEK, setFilterFSTEK] = useState<string[]>(() => {
    const saved = localStorage.getItem("filterFSTEK");
    return saved ? JSON.parse(saved) : [];
  });

  const [filterTrialPeriod, setFilterTrialPeriod] = useState(() => {
    const saved = localStorage.getItem("filterTrialPeriod");
    return saved ? JSON.parse(saved) : false;
  });

  const [filterLocation, setFilterLocation] = useState<string[]>(() => {
    const saved = localStorage.getItem("filterLocation");
    return saved ? JSON.parse(saved) : [];
  });

  const [filterVirtualization, setFilterVirtualization] = useState<string[]>(
    () => {
      const saved = localStorage.getItem("filterVirtualization");
      return saved ? JSON.parse(saved) : [];
    },
  );

  const [filterMinDatacenters, setFilterMinDatacenters] = useState<
    number | null
  >(() => {
    const saved = localStorage.getItem("filterMinDatacenters");
    return saved ? parseInt(saved) : null;
  });

  const [filterDiskType, setFilterDiskType] = useState<string[]>(() => {
    const saved = localStorage.getItem("filterDiskType");
    return saved ? JSON.parse(saved) : [];
  });

  const [filterPaymentMethod, setFilterPaymentMethod] = useState<string[]>(
    () => {
      const saved = localStorage.getItem("filterPaymentMethod");
      return saved ? JSON.parse(saved) : [];
    },
  );

  const [filterOS, setFilterOS] = useState<string[]>(() => {
    const saved = localStorage.getItem("filterOS");
    return saved ? JSON.parse(saved) : [];
  });

  const [filterCPU, setFilterCPU] = useState<string[]>(() => {
    const saved = localStorage.getItem("filterCPU");
    return saved ? JSON.parse(saved) : [];
  });

  const [filterKII, setFilterKII] = useState<boolean>(() => {
    const saved = localStorage.getItem("filterKII");
    return saved ? JSON.parse(saved) : false;
  });

  const [filterMobileApp, setFilterMobileApp] = useState<boolean>(() => {
    const saved = localStorage.getItem("filterMobileApp");
    return saved ? JSON.parse(saved) : false;
  });

  const [filterOrderBeforeRegistration, setFilterOrderBeforeRegistration] =
    useState<boolean>(() => {
      const saved = localStorage.getItem("filterOrderBeforeRegistration");
      return saved ? JSON.parse(saved) : false;
    });

  // Переименовано с filterITConsulting
  const [filterAdditionalServices, setFilterAdditionalServices] = useState<
    string[]
  >(() => {
    const saved = localStorage.getItem("filterAdditionalServices");
    return saved ? JSON.parse(saved) : [];
  });

  // Новые фильтры
  const [filterRegistrationData, setFilterRegistrationData] = useState<
    string[]
  >(() => {
    const saved = localStorage.getItem("filterRegistrationData");
    return saved ? JSON.parse(saved) : [];
  });

  const [filterClientType, setFilterClientType] = useState<string[]>(() => {
    const saved = localStorage.getItem("filterClientType");
    return saved ? JSON.parse(saved) : [];
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

  const fstekOptions = useMemo(() => ["ФСТЭК-17", "ФСТЭК-21", "ФСТЭК-239"], []);

  // Переименовано и обновлены опции
  const additionalServicesOptions = useMemo(
    () => [
      "Аудит инфраструктуры",
      "Проектирование инфраструктуры",
      "Миграция в облако",
      "Импортозамещение",
      "Консультация по ИБ",
      "Аттестация по ФСТЭК",
      "Другие гос. лицензии",
    ],
    [],
  );

  const registrationDataOptions = useMemo(
    () => [
      "ФИО",
      "Email",
      "Телефон",
      "Страна",
      "По заявке через менеджера",
      "ИНН",
      "Корпоративный email",
      "Наименование организации",
      "Адрес организации",
      "Паспортные данные",
      "Реквизиты банка",
      "Регистрация в сторонних сервисах",
      "Скан удостоверения личности",
    ],
    [],
  );

  // Упрощенные опции для типа клиента
  const clientTypeOptions = useMemo(() => ["Физлицо", "Юрлицо"], []);

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
    if (filterFSTEK.length > 0) {
      localStorage.setItem("filterFSTEK", JSON.stringify(filterFSTEK));
    } else {
      localStorage.removeItem("filterFSTEK");
    }
  }, [filterFSTEK]);

  useEffect(() => {
    localStorage.setItem(
      "filterTrialPeriod",
      JSON.stringify(filterTrialPeriod),
    );
  }, [filterTrialPeriod]);

  useEffect(() => {
    if (filterLocation.length > 0) {
      localStorage.setItem("filterLocation", JSON.stringify(filterLocation));
    } else {
      localStorage.removeItem("filterLocation");
    }
  }, [filterLocation]);

  useEffect(() => {
    if (filterVirtualization.length > 0) {
      localStorage.setItem(
        "filterVirtualization",
        JSON.stringify(filterVirtualization),
      );
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
    if (filterDiskType.length > 0) {
      localStorage.setItem("filterDiskType", JSON.stringify(filterDiskType));
    } else {
      localStorage.removeItem("filterDiskType");
    }
  }, [filterDiskType]);

  useEffect(() => {
    if (filterPaymentMethod.length > 0) {
      localStorage.setItem(
        "filterPaymentMethod",
        JSON.stringify(filterPaymentMethod),
      );
    } else {
      localStorage.removeItem("filterPaymentMethod");
    }
  }, [filterPaymentMethod]);

  useEffect(() => {
    if (filterOS.length > 0) {
      localStorage.setItem("filterOS", JSON.stringify(filterOS));
    } else {
      localStorage.removeItem("filterOS");
    }
  }, [filterOS]);

  useEffect(() => {
    if (filterCPU.length > 0) {
      localStorage.setItem("filterCPU", JSON.stringify(filterCPU));
    } else {
      localStorage.removeItem("filterCPU");
    }
  }, [filterCPU]);

  useEffect(() => {
    localStorage.setItem("filterKII", JSON.stringify(filterKII));
  }, [filterKII]);

  useEffect(() => {
    localStorage.setItem("filterMobileApp", JSON.stringify(filterMobileApp));
  }, [filterMobileApp]);

  useEffect(() => {
    localStorage.setItem(
      "filterOrderBeforeRegistration",
      JSON.stringify(filterOrderBeforeRegistration),
    );
  }, [filterOrderBeforeRegistration]);

  // Переименовано и обновлено сохранение
  useEffect(() => {
    if (filterAdditionalServices.length > 0) {
      localStorage.setItem(
        "filterAdditionalServices",
        JSON.stringify(filterAdditionalServices),
      );
    } else {
      localStorage.removeItem("filterAdditionalServices");
    }
  }, [filterAdditionalServices]);

  // Сохранение новых фильтров
  useEffect(() => {
    if (filterRegistrationData.length > 0) {
      localStorage.setItem(
        "filterRegistrationData",
        JSON.stringify(filterRegistrationData),
      );
    } else {
      localStorage.removeItem("filterRegistrationData");
    }
  }, [filterRegistrationData]);

  useEffect(() => {
    if (filterClientType.length > 0) {
      localStorage.setItem(
        "filterClientType",
        JSON.stringify(filterClientType),
      );
    } else {
      localStorage.removeItem("filterClientType");
    }
  }, [filterClientType]);

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

  // Функция для отмены сравнения (очистки выбранных провайдеров)
  const cancelComparison = () => {
    console.log("Отмена сравнения, очистка выбранных провайдеров");
    setSelectedForComparison([]);
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

          if (filterFSTEK.length > 0) {
            const hasMatchingFSTEK = filterFSTEK.some(
              (cert) => p.fstekCertifications?.includes(cert) || false,
            );
            if (!hasMatchingFSTEK) return false;
          }

          if (filterTrialPeriod && p.trialDays === 0) return false;

          if (filterLocation.length > 0) {
            const hasMatchingLocation = filterLocation.some((location) =>
              p.locations.includes(location),
            );
            if (!hasMatchingLocation) return false;
          }

          if (filterVirtualization.length > 0) {
            const hasMatchingVirtualization = filterVirtualization.some(
              (virt) => p.technicalSpecs.virtualization.includes(virt as any),
            );
            if (!hasMatchingVirtualization) return false;
          }

          if (
            filterMinDatacenters !== null &&
            p.locations.length < filterMinDatacenters
          )
            return false;

          if (filterDiskType.length > 0) {
            if (!filterDiskType.includes(p.technicalSpecs.diskType))
              return false;
          }

          if (filterPaymentMethod.length > 0) {
            const hasMatchingPaymentMethod = filterPaymentMethod.some(
              (method) => p.pricingDetails.paymentMethods.includes(method),
            );
            if (!hasMatchingPaymentMethod) return false;
          }

          if (filterOS.length > 0) {
            const hasMatchingOS = filterOS.some((os) =>
              p.technicalSpecs.availableOS.includes(os),
            );
            if (!hasMatchingOS) return false;
          }

          if (filterCPU.length > 0) {
            const cpuModels = p.technicalSpecs.cpuModels || [];
            const hasMatchingCPU = filterCPU.some((cpu) =>
              cpuModels.includes(cpu),
            );
            if (!hasMatchingCPU) return false;
          }

          if (filterKII && !p.kiiPlacement) return false;

          if (filterMobileApp && !p.mobileApp) return false;

          if (filterOrderBeforeRegistration && !p.orderBeforeRegistration)
            return false;

          // Переименовано и обновлено
          if (filterAdditionalServices.length > 0) {
            const hasMatchingService = filterAdditionalServices.some(
              (service) => p.additionalServicesList?.includes(service) || false,
            );
            if (!hasMatchingService) return false;
          }

          // Новые фильтры
          if (filterRegistrationData.length > 0) {
            const hasMatchingRegistrationData = filterRegistrationData.some(
              (field) => p.registrationData?.includes(field) || false,
            );
            if (!hasMatchingRegistrationData) return false;
          }

          if (filterClientType.length > 0) {
            const hasMatchingClientType = filterClientType.some(
              (type) => p.supportedClientTypes?.includes(type) || false,
            );
            if (!hasMatchingClientType) return false;
          }

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
      filterKII,
      filterMobileApp,
      filterOrderBeforeRegistration,
      filterAdditionalServices,
      filterRegistrationData,
      filterClientType,
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
        onClose={() => {
          console.log("Закрытие таблицы сравнения");
          setShowComparison(false);
        }}
      />
    );
  }

  return (
    <section id="providers" className="container mx-auto px-4 py-8">
      <div className="mb-4">
        <div className="flex flex-col sm:hidden gap-2">
          <ProvidersCounter
            currentCount={Math.min(providersToShow, filteredProviders.length)}
            totalCount={filteredProviders.length}
            className="w-full"
          />

          <SearchInput
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Поиск..."
            className="w-full"
          />

          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-2">
              <div className="flex-shrink-0">
                <SortPanel sortBy={sortBy} setSortBy={setSortBy} />
              </div>

              <div className="flex-shrink-0">
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
                  filterKII={filterKII}
                  setFilterKII={setFilterKII}
                  filterMobileApp={filterMobileApp}
                  setFilterMobileApp={setFilterMobileApp}
                  filterOrderBeforeRegistration={filterOrderBeforeRegistration}
                  setFilterOrderBeforeRegistration={
                    setFilterOrderBeforeRegistration
                  }
                  // Переименовано
                  filterAdditionalServices={filterAdditionalServices}
                  setFilterAdditionalServices={setFilterAdditionalServices}
                  filterRegistrationData={filterRegistrationData}
                  setFilterRegistrationData={setFilterRegistrationData}
                  filterClientType={filterClientType}
                  setFilterClientType={setFilterClientType}
                  allLocations={allLocations}
                  allVirtualizations={allVirtualizations}
                  allDiskTypes={allDiskTypes}
                  allPaymentMethods={allPaymentMethods}
                  allOS={allOS}
                  allCPUs={allCPUs}
                  fstekOptions={fstekOptions}
                  // Переименовано
                  additionalServicesOptions={additionalServicesOptions}
                  registrationDataOptions={registrationDataOptions}
                  clientTypeOptions={clientTypeOptions}
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex-shrink-0 h-full flex items-start justify-end">
                <GlobalResourceConfig onApplyConfig={applyGlobalConfig} />
              </div>
              <div className="flex-shrink-0"></div>
            </div>
          </div>
        </div>

        <div className="hidden sm:grid sm:grid-cols-12">
          <div className="col-span-12 flex gap-4 mb-0.5">
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

            <div className="w-1/3 flex justify-end">
              <SearchInput
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="Поиск..."
                className="ml-auto"
              />
            </div>
          </div>

          <div className="col-span-12 flex items-center gap-2">
            <div className="w-2/3 flex items-center">
              <div className="flex-shrink-0">
                <SortPanel sortBy={sortBy} setSortBy={setSortBy} />
              </div>
              <div className="flex-grow ml-1">
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
                  filterKII={filterKII}
                  setFilterKII={setFilterKII}
                  filterMobileApp={filterMobileApp}
                  setFilterMobileApp={setFilterMobileApp}
                  filterOrderBeforeRegistration={filterOrderBeforeRegistration}
                  setFilterOrderBeforeRegistration={
                    setFilterOrderBeforeRegistration
                  }
                  // Переименовано
                  filterAdditionalServices={filterAdditionalServices}
                  setFilterAdditionalServices={setFilterAdditionalServices}
                  filterRegistrationData={filterRegistrationData}
                  setFilterRegistrationData={setFilterRegistrationData}
                  filterClientType={filterClientType}
                  setFilterClientType={setFilterClientType}
                  allLocations={allLocations}
                  allVirtualizations={allVirtualizations}
                  allDiskTypes={allDiskTypes}
                  allPaymentMethods={allPaymentMethods}
                  allOS={allOS}
                  allCPUs={allCPUs}
                  fstekOptions={fstekOptions}
                  // Переименовано
                  additionalServicesOptions={additionalServicesOptions}
                  registrationDataOptions={registrationDataOptions}
                  clientTypeOptions={clientTypeOptions}
                />
              </div>
            </div>
            <div className="w-1/3 flex justify-end">
              <GlobalResourceConfig onApplyConfig={applyGlobalConfig} />
            </div>
          </div>
        </div>
      </div>

      <div className="mb-4"></div>

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

          {(filteredProviders.length > providersToShow ||
            providersToShow > 9) && (
            <div className="flex flex-col sm:flex-row justify-center items-center gap-2 mt-8">
              {filteredProviders.length > providersToShow && (
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
              )}

              {filteredProviders.length > 0 && (
                <button
                  onClick={() => {
                    if (providersToShow === filteredProviders.length) {
                      const minToShow = Math.min(9, filteredProviders.length);
                      setProvidersToShow(minToShow);
                    } else {
                      setProvidersToShow(filteredProviders.length);
                    }
                  }}
                  className="group relative px-8 py-4 bg-gradient-to-r from-secondary to-secondary/80 text-background font-bold text-lg rounded-2xl shadow-xl shadow-secondary/30 hover:shadow-2xl hover:shadow-secondary/40 transition-all hover:scale-[1.02] active:scale-[0.98] w-full sm:w-auto"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-secondary/0 via-white/20 to-secondary/0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <span className="relative flex items-center justify-center gap-2">
                    {providersToShow === filteredProviders.length
                      ? "Скрыть"
                      : "Показать всех "}
                    <svg
                      className={`w-5 h-5 transition-transform ${providersToShow === filteredProviders.length ? "group-hover:-translate-y-1" : "group-hover:translate-y-1"}`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d={
                          providersToShow === filteredProviders.length
                            ? "M5 15l7-7 7 7"
                            : "M19 9l-7 7-7-7"
                        }
                      />
                    </svg>
                  </span>
                </button>
              )}
            </div>
          )}
        </>
      )}

      {/* Компонент управления сравнением с кнопкой отмены */}
      <ComparisonControls
        selectedForComparison={selectedForComparison}
        compareProviders={compareProviders}
        onCancelComparison={cancelComparison}
      />
    </section>
  );
};
