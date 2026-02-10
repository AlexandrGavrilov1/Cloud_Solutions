import { useState, useEffect, useMemo } from "react";
import { Provider } from "./types";
import { ComparisonTable } from "./ComparisonTable";
import { FilterPanel } from "./FilterPanel";
import { FilterPanelAlwaysOpen } from "./FilterPanelAlwaysOpen";
import { ComparisonControls } from "./ComparisonControls";
import { ProvidersList } from "./ProvidersList";
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
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"rating" | "price">("rating");

  // Фильтры
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

  const [filterAdditionalServices, setFilterAdditionalServices] = useState<
    string[]
  >(() => {
    const saved = localStorage.getItem("filterAdditionalServices");
    return saved ? JSON.parse(saved) : [];
  });

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

  const [filterGPU, setFilterGPU] = useState<string[]>(() => {
    const saved = localStorage.getItem("filterGPU");
    return saved ? JSON.parse(saved) : [];
  });

  const [filterHasGPU, setFilterHasGPU] = useState<boolean>(() => {
    const saved = localStorage.getItem("filterHasGPU");
    return saved ? JSON.parse(saved) : false;
  });

  const [filter1C, setFilter1C] = useState<boolean>(() => {
    const saved = localStorage.getItem("filter1C");
    return saved ? JSON.parse(saved) : false;
  });

  const [filterAI, setFilterAI] = useState<boolean>(() => {
    const saved = localStorage.getItem("filterAI");
    return saved ? JSON.parse(saved) : false;
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

  // Состояние для отслеживания ширины экрана
  const [windowWidth, setWindowWidth] = useState<number>(
    typeof window !== "undefined" ? window.innerWidth : 0,
  );

  // Эффект для отслеживания изменения размера окна
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    if (typeof window !== "undefined") {
      setWindowWidth(window.innerWidth);
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
  }, []);

  // Опции для фильтров
  const fstekOptions = useMemo(() => ["ФСТЭК-17", "ФСТЭК-21", "ФСТЭК-239"], []);

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

  const clientTypeOptions = useMemo(() => ["Физлицо", "Юрлицо"], []);

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
    if (filterGPU.length > 0) {
      localStorage.setItem("filterGPU", JSON.stringify(filterGPU));
    } else {
      localStorage.removeItem("filterGPU");
    }
  }, [filterGPU]);

  useEffect(() => {
    localStorage.setItem("filterHasGPU", JSON.stringify(filterHasGPU));
  }, [filterHasGPU]);

  useEffect(() => {
    localStorage.setItem("filter1C", JSON.stringify(filter1C));
  }, [filter1C]);

  useEffect(() => {
    localStorage.setItem("filterAI", JSON.stringify(filterAI));
  }, [filterAI]);

  useEffect(() => {
    localStorage.setItem("sortBy", sortBy);
  }, [sortBy]);

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

  const cancelComparison = () => {
    setSelectedForComparison([]);
  };

  const allLocations = useMemo(
    () => Array.from(new Set(providers.flatMap((p) => p.locations))).sort(),
    [providers],
  );

  const allVirtualizations = useMemo(
    () =>
      Array.from(
        new Set(providers.flatMap((p) => p.technicalSpecs.virtualization)),
      ).sort(),
    [providers],
  );

  const allDiskTypes = useMemo(
    () =>
      Array.from(
        new Set(providers.map((p) => p.technicalSpecs.diskType)),
      ).sort(),
    [providers],
  );

  const allPaymentMethods = useMemo(
    () =>
      Array.from(
        new Set(providers.flatMap((p) => p.pricingDetails.paymentMethods)),
      ).sort(),
    [providers],
  );

  const allOS = useMemo(
    () =>
      Array.from(
        new Set(providers.flatMap((p) => p.technicalSpecs.availableOS)),
      ).sort(),
    [providers],
  );

  const allCPUs = useMemo(
    () =>
      Array.from(
        new Set(providers.flatMap((p) => p.technicalSpecs.cpuModels || [])),
      ).sort(),
    [providers],
  );

  const allGPUs = useMemo(
    () =>
      Array.from(
        new Set(providers.flatMap((p) => p.technicalSpecs.gpuModels || [])),
      ).sort(),
    [providers],
  );

  const filteredProviders = useMemo(() => {
    const filtered = providers.filter((p) => {
      // Поиск по названию
      if (
        searchQuery &&
        !p.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
        return false;

      // Фильтр 152-ФЗ
      if (filterFZ152 && !p.fz152Compliant) return false;

      // Фильтр ФСТЭК
      if (filterFSTEK.length > 0) {
        const hasMatchingFSTEK = filterFSTEK.some((cert) =>
          p.fstekCertifications?.includes(cert),
        );
        if (!hasMatchingFSTEK) return false;
      }

      // Тестовый период
      if (filterTrialPeriod && p.trialDays === 0) return false;

      // Локация
      if (filterLocation.length > 0) {
        const hasMatchingLocation = filterLocation.some((location) =>
          p.locations.includes(location),
        );
        if (!hasMatchingLocation) return false;
      }

      // Виртуализация
      if (filterVirtualization.length > 0) {
        const hasMatchingVirtualization = filterVirtualization.some((virt) =>
          p.technicalSpecs.virtualization.includes(virt),
        );
        if (!hasMatchingVirtualization) return false;
      }

      // Количество ЦОД
      if (
        filterMinDatacenters !== null &&
        p.locations.length < filterMinDatacenters
      )
        return false;

      // Тип диска
      if (filterDiskType.length > 0) {
        if (!filterDiskType.includes(p.technicalSpecs.diskType)) return false;
      }

      // Способы оплаты
      if (filterPaymentMethod.length > 0) {
        const hasMatchingPaymentMethod = filterPaymentMethod.some((method) =>
          p.pricingDetails.paymentMethods.includes(method),
        );
        if (!hasMatchingPaymentMethod) return false;
      }

      // Операционные системы
      if (filterOS.length > 0) {
        const hasMatchingOS = filterOS.some((os) =>
          p.technicalSpecs.availableOS.includes(os),
        );
        if (!hasMatchingOS) return false;
      }

      // Процессоры
      if (filterCPU.length > 0) {
        const cpuModels = p.technicalSpecs.cpuModels || [];
        const hasMatchingCPU = filterCPU.some((cpu) => cpuModels.includes(cpu));
        if (!hasMatchingCPU) return false;
      }

      // КИИ
      if (filterKII && !p.kiiPlacement) return false;

      // Мобильное приложение
      if (filterMobileApp && !p.mobileApp) return false;

      // Заказ до регистрации
      if (filterOrderBeforeRegistration && !p.orderBeforeRegistration)
        return false;

      // Дополнительные услуги
      if (filterAdditionalServices.length > 0) {
        const hasMatchingService = filterAdditionalServices.some((service) =>
          p.additionalServicesList?.includes(service),
        );
        if (!hasMatchingService) return false;
      }

      // Данные для регистрации
      if (filterRegistrationData.length > 0) {
        const hasMatchingRegistrationData = filterRegistrationData.some(
          (field) => p.registrationData?.includes(field),
        );
        if (!hasMatchingRegistrationData) return false;
      }

      // Тип клиента
      if (filterClientType.length > 0) {
        const hasMatchingClientType = filterClientType.some((type) =>
          p.supportedClientTypes?.includes(type),
        );
        if (!hasMatchingClientType) return false;
      }

      // GPU
      if (filterHasGPU) {
        const hasAnyGPU = (p.technicalSpecs.gpuModels || []).length > 0;
        if (!hasAnyGPU) return false;
      }

      // Конкретные модели GPU
      if (filterGPU.length > 0) {
        const gpuModels = p.technicalSpecs.gpuModels || [];
        const hasMatchingGPU = filterGPU.some((gpu) => gpuModels.includes(gpu));
        if (!hasMatchingGPU) return false;
      }

      // 1С
      if (filter1C && !p.technicalSpecs.supports1C) return false;

      // AI
      if (filterAI && !p.technicalSpecs.supportsAI) return false;

      return true;
    });

    return filtered.sort((a, b) => {
      if (sortBy === "rating") {
        const avgRatingA =
          a.reviews.reduce((sum, r) => sum + r.rating, 0) / a.reviews.length;
        const avgRatingB =
          b.reviews.reduce((sum, r) => sum + r.rating, 0) / b.reviews.length;
        return avgRatingB - avgRatingA;
      } else {
        const priceA = a.basePrice;
        const priceB = b.basePrice;

        if (priceA === 0 && priceB === 0) return 0;
        if (priceA === 0 && priceB > 0) return 1;
        if (priceA > 0 && priceB === 0) return -1;
        return priceA - priceB;
      }
    });
  }, [
    providers,
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
    filterGPU,
    filterHasGPU,
    filter1C,
    filterAI,
    sortBy,
  ]);

  // Функция для определения количества карточек для загрузки
  const getLoadMoreCount = () => {
    if (windowWidth >= 1024 && windowWidth < 1280) {
      return 10; // 2 карточки в строке
    } else {
      return 9; // 3 или 1 карточка в строке
    }
  };

  // Текст для кнопки
  const getLoadMoreText = () => {
    if (windowWidth >= 1024 && windowWidth < 1280) {
      return "Показать ещё 10";
    } else {
      return "Показать ещё 9";
    }
  };

  if (showComparison) {
    const selectedProviders = providers.filter((p) =>
      selectedForComparison.includes(p.id),
    );
    return (
      <ComparisonTable
        providers={selectedProviders}
        onClose={() => {
          setShowComparison(false);
        }}
      />
    );
  }

  return (
    <section id="providers" className="container mx-auto px-2 py-4">
      {/* Планшетный и десктопный вид (от 640px) - открытая панель фильтров */}
      <div className="hidden sm:flex gap-4">
        {/* Левая часть: фильтры (всегда открытые) - ширина 8.5 см */}
        <div className="w-[340px] flex-shrink-0">
          <FilterPanelAlwaysOpen
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
            setFilterOrderBeforeRegistration={setFilterOrderBeforeRegistration}
            filterAdditionalServices={filterAdditionalServices}
            setFilterAdditionalServices={setFilterAdditionalServices}
            filterRegistrationData={filterRegistrationData}
            setFilterRegistrationData={setFilterRegistrationData}
            filterClientType={filterClientType}
            setFilterClientType={setFilterClientType}
            filterGPU={filterGPU}
            setFilterGPU={setFilterGPU}
            filterHasGPU={filterHasGPU}
            setFilterHasGPU={setFilterHasGPU}
            filter1C={filter1C}
            setFilter1C={setFilter1C}
            filterAI={filterAI}
            setFilterAI={setFilterAI}
            allLocations={allLocations}
            allVirtualizations={allVirtualizations}
            allDiskTypes={allDiskTypes}
            allPaymentMethods={allPaymentMethods}
            allOS={allOS}
            allCPUs={allCPUs}
            allGPUs={allGPUs}
            fstekOptions={fstekOptions}
            additionalServicesOptions={additionalServicesOptions}
            registrationDataOptions={registrationDataOptions}
            clientTypeOptions={clientTypeOptions}
          />
        </div>

        {/* Правая часть: контент */}
        <div className="flex-1">
          {/* Верхняя панель управления */}
          <div className="mb-4">
            <div className="flex justify-between items-start gap-3">
              {/* Левая колонка: поиск и счетчик */}
              <div className="space-y-2 flex-1 max-w-[500px]">
                <SearchInput
                  value={searchQuery}
                  onChange={setSearchQuery}
                  placeholder="Поиск..."
                  className="w-full max-w-[300px]"
                />
                <ProvidersCounter
                  currentCount={Math.min(
                    providersToShow,
                    filteredProviders.length,
                  )}
                  totalCount={filteredProviders.length}
                  className=""
                />
              </div>

              {/* Правая колонка: сортировка */}
              <div className="mt-0">
                <SortPanel sortBy={sortBy} setSortBy={setSortBy} />
              </div>
            </div>
          </div>

          {/* Карточки провайдеров */}
          {searchQuery && filteredProviders.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-muted-foreground text-base mb-1.5">
                По запросу "{searchQuery}" ничего не найдено
              </div>
              <div className="text-xs text-muted-foreground">
                Попробуйте изменить поисковый запрос или сбросить фильтры
              </div>
            </div>
          ) : (
            <>
              <ProvidersList
                filteredProviders={filteredProviders.slice(0, providersToShow)}
                reviewsToShow={reviewsToShow}
                setReviewsToShow={setReviewsToShow}
                selectedProvider={selectedProvider}
                setSelectedProvider={setSelectedProvider}
                selectedForComparison={selectedForComparison}
                toggleComparison={toggleComparison}
              />

              {(filteredProviders.length > providersToShow ||
                providersToShow > 9) && (
                <div className="flex flex-col sm:flex-row justify-center items-center gap-1.5 mt-6">
                  {filteredProviders.length > providersToShow && (
                    <button
                      onClick={() => {
                        const additionalCount = getLoadMoreCount();
                        setProvidersToShow((prev) => prev + additionalCount);
                      }}
                      className="group relative px-6 py-3 bg-gradient-to-r from-primary to-primary/80 text-background font-bold text-base rounded-xl shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 transition-all hover:scale-[1.02] active:scale-[0.98] w-full sm:w-auto"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-white/20 to-primary/0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      <span className="relative flex items-center justify-center gap-1.5">
                        {getLoadMoreText()}
                        <svg
                          className="w-4 h-4 group-hover:translate-y-0.5 transition-transform"
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
                          const minToShow = Math.min(
                            9,
                            filteredProviders.length,
                          );
                          setProvidersToShow(minToShow);
                        } else {
                          setProvidersToShow(filteredProviders.length);
                        }
                      }}
                      className="group relative px-6 py-3 bg-gradient-to-r from-secondary to-secondary/80 text-background font-bold text-base rounded-xl shadow-lg shadow-secondary/30 hover:shadow-xl hover:shadow-secondary/40 transition-all hover:scale-[1.02] active:scale-[0.98] w-full sm:w-auto"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-secondary/0 via-white/20 to-secondary/0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      <span className="relative flex items-center justify-center gap-1.5">
                        {providersToShow === filteredProviders.length
                          ? "Скрыть"
                          : "Показать всех "}
                        <svg
                          className={`w-4 h-4 transition-transform ${providersToShow === filteredProviders.length ? "group-hover:-translate-y-0.5" : "group-hover:translate-y-0.5"}`}
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

          <ComparisonControls
            selectedForComparison={selectedForComparison}
            compareProviders={compareProviders}
            onCancelComparison={cancelComparison}
          />
        </div>
      </div>

      {/* Мобильный вид (до 640px) - раскрывающаяся панель фильтров */}
      <div className="sm:hidden">
        <div className="mb-3">
          <div className="flex flex-col sm:flex-row gap-1.5">
            <SearchInput
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Поиск..."
              className="w-full sm:w-auto"
            />

            <div className="flex items-center gap-1.5">
              <ProvidersCounter
                currentCount={Math.min(
                  providersToShow,
                  filteredProviders.length,
                )}
                totalCount={filteredProviders.length}
                className="flex-1"
              />

              <SortPanel sortBy={sortBy} setSortBy={setSortBy} />
            </div>
          </div>

          {/* Для мобильной версии используем старую панель фильтров */}
          <div className="mt-1.5">
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
              filterAdditionalServices={filterAdditionalServices}
              setFilterAdditionalServices={setFilterAdditionalServices}
              filterRegistrationData={filterRegistrationData}
              setFilterRegistrationData={setFilterRegistrationData}
              filterClientType={filterClientType}
              setFilterClientType={setFilterClientType}
              filterGPU={filterGPU}
              setFilterGPU={setFilterGPU}
              filterHasGPU={filterHasGPU}
              setFilterHasGPU={setFilterHasGPU}
              filter1C={filter1C}
              setFilter1C={setFilter1C}
              filterAI={filterAI}
              setFilterAI={setFilterAI}
              allLocations={allLocations}
              allVirtualizations={allVirtualizations}
              allDiskTypes={allDiskTypes}
              allPaymentMethods={allPaymentMethods}
              allOS={allOS}
              allCPUs={allCPUs}
              allGPUs={allGPUs}
              fstekOptions={fstekOptions}
              additionalServicesOptions={additionalServicesOptions}
              registrationDataOptions={registrationDataOptions}
              clientTypeOptions={clientTypeOptions}
            />
          </div>
        </div>

        {/* Мобильная версия карточек */}
        {searchQuery && filteredProviders.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-muted-foreground text-base mb-1.5">
              По запросу "{searchQuery}" ничего не найдено
            </div>
            <div className="text-xs text-muted-foreground">
              Попробуйте изменить поисковый запрос или сбросить фильтры
            </div>
          </div>
        ) : (
          <>
            <ProvidersList
              filteredProviders={filteredProviders.slice(0, providersToShow)}
              reviewsToShow={reviewsToShow}
              setReviewsToShow={setReviewsToShow}
              selectedProvider={selectedProvider}
              setSelectedProvider={setSelectedProvider}
              selectedForComparison={selectedForComparison}
              toggleComparison={toggleComparison}
            />

            {(filteredProviders.length > providersToShow ||
              providersToShow > 9) && (
              <div className="flex flex-col sm:flex-row justify-center items-center gap-1.5 mt-6">
                {filteredProviders.length > providersToShow && (
                  <button
                    onClick={() => setProvidersToShow((prev) => prev + 9)}
                    className="group relative px-6 py-3 bg-gradient-to-r from-primary to-primary/80 text-background font-bold text-base rounded-xl shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 transition-all hover:scale-[1.02] active:scale-[0.98] w-full sm:w-auto"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-white/20 to-primary/0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <span className="relative flex items-center justify-center gap-1.5">
                      Показать ещё 9
                      <svg
                        className="w-4 h-4 group-hover:translate-y-0.5 transition-transform"
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
                    className="group relative px-6 py-3 bg-gradient-to-r from-secondary to-secondary/80 text-background font-bold text-base rounded-xl shadow-lg shadow-secondary/30 hover:shadow-xl hover:shadow-secondary/40 transition-all hover:scale-[1.02] active:scale-[0.98] w-full sm:w-auto"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-secondary/0 via-white/20 to-secondary/0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <span className="relative flex items-center justify-center gap-1.5">
                      {providersToShow === filteredProviders.length
                        ? "Скрыть"
                        : "Показать всех "}
                      <svg
                        className={`w-4 h-4 transition-transform ${providersToShow === filteredProviders.length ? "group-hover:-translate-y-0.5" : "group-hover:translate-y-0.5"}`}
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

        <ComparisonControls
          selectedForComparison={selectedForComparison}
          compareProviders={compareProviders}
          onCancelComparison={cancelComparison}
        />
      </div>
    </section>
  );
};
