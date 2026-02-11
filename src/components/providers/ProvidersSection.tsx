import { useState, useEffect, useMemo } from "react";
import { Provider } from "./types";
import { ComparisonTable } from "./ComparisonTable";
import { FilterPanelAlwaysOpen } from "./FilterPanelAlwaysOpen";
import { MobileFilterDrawer } from "./MobileFilterDrawer";
import { ComparisonControls } from "./ComparisonControls";
import { ProvidersList } from "./ProvidersList";
import { SearchInput } from "./SearchInput";
import { SortPanel } from "./SortPanel";
import { ProvidersCounter } from "./ProvidersCounter";
import Icon from "@/components/ui/icon";
import { POPULAR_IDS } from "@/constants/popularProviders";

interface ProvidersSectionProps {
  providers: Provider[];
}

export const ProvidersSection = ({ providers }: ProvidersSectionProps) => {
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(
    null,
  );
  const [searchQuery, setSearchQuery] = useState("");

  // --- Состояние сортировки и направления цены ---
  const [sortBy, setSortBy] = useState<"popular" | "rating" | "price">(() => {
    const saved = localStorage.getItem("sortBy");
    if (saved === "rating" || saved === "price" || saved === "popular")
      return saved;
    return "popular";
  });
  const [priceSortOrder, setPriceSortOrder] = useState<"asc" | "desc">(() => {
    const saved = localStorage.getItem("priceSortOrder");
    return saved === "desc" ? "desc" : "asc";
  });

  // Сохраняем сортировку и направление цены
  useEffect(() => {
    localStorage.setItem("sortBy", sortBy);
  }, [sortBy]);
  useEffect(() => {
    localStorage.setItem("priceSortOrder", priceSortOrder);
  }, [priceSortOrder]);

  // --- Состояние ширины экрана ---
  const [windowWidth, setWindowWidth] = useState<number>(() => {
    if (typeof window !== "undefined") return window.innerWidth;
    return 1024;
  });

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isMobile = windowWidth <= 850;
  const isTenCardsMode = !isMobile && windowWidth >= 950 && windowWidth < 1280;
  const incrementCount = isTenCardsMode ? 10 : 9;

  // --- Количество отображаемых карточек (пагинация) ---
  const [providersToShow, setProvidersToShow] = useState(() => {
    if (typeof window !== "undefined") {
      if (window.innerWidth <= 850) return 9;
      if (window.innerWidth >= 950 && window.innerWidth < 1280) return 10;
      return 9;
    }
    return 9;
  });

  // --- Состояние мобильного дровера ---
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // ========== ВСЕ ФИЛЬТРЫ (полностью как в исходном проекте) ==========
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
  const [filterMaxDatacenters, setFilterMaxDatacenters] = useState<
    number | null
  >(() => {
    const saved = localStorage.getItem("filterMaxDatacenters");
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

  // ========== СОХРАНЕНИЕ ФИЛЬТРОВ В LOCALSTORAGE ==========
  // (полный набор useEffect – скопировать из существующего проекта)
  useEffect(() => {
    localStorage.setItem("filterFZ152", JSON.stringify(filterFZ152));
  }, [filterFZ152]);
  useEffect(() => {
    if (filterFSTEK.length > 0)
      localStorage.setItem("filterFSTEK", JSON.stringify(filterFSTEK));
    else localStorage.removeItem("filterFSTEK");
  }, [filterFSTEK]);
  useEffect(() => {
    localStorage.setItem(
      "filterTrialPeriod",
      JSON.stringify(filterTrialPeriod),
    );
  }, [filterTrialPeriod]);
  useEffect(() => {
    if (filterLocation.length > 0)
      localStorage.setItem("filterLocation", JSON.stringify(filterLocation));
    else localStorage.removeItem("filterLocation");
  }, [filterLocation]);
  useEffect(() => {
    if (filterVirtualization.length > 0)
      localStorage.setItem(
        "filterVirtualization",
        JSON.stringify(filterVirtualization),
      );
    else localStorage.removeItem("filterVirtualization");
  }, [filterVirtualization]);
  useEffect(() => {
    if (filterMinDatacenters !== null)
      localStorage.setItem(
        "filterMinDatacenters",
        filterMinDatacenters.toString(),
      );
    else localStorage.removeItem("filterMinDatacenters");
  }, [filterMinDatacenters]);
  useEffect(() => {
    if (filterMaxDatacenters !== null)
      localStorage.setItem(
        "filterMaxDatacenters",
        filterMaxDatacenters.toString(),
      );
    else localStorage.removeItem("filterMaxDatacenters");
  }, [filterMaxDatacenters]);
  useEffect(() => {
    if (filterDiskType.length > 0)
      localStorage.setItem("filterDiskType", JSON.stringify(filterDiskType));
    else localStorage.removeItem("filterDiskType");
  }, [filterDiskType]);
  useEffect(() => {
    if (filterPaymentMethod.length > 0)
      localStorage.setItem(
        "filterPaymentMethod",
        JSON.stringify(filterPaymentMethod),
      );
    else localStorage.removeItem("filterPaymentMethod");
  }, [filterPaymentMethod]);
  useEffect(() => {
    if (filterOS.length > 0)
      localStorage.setItem("filterOS", JSON.stringify(filterOS));
    else localStorage.removeItem("filterOS");
  }, [filterOS]);
  useEffect(() => {
    if (filterCPU.length > 0)
      localStorage.setItem("filterCPU", JSON.stringify(filterCPU));
    else localStorage.removeItem("filterCPU");
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
    if (filterAdditionalServices.length > 0)
      localStorage.setItem(
        "filterAdditionalServices",
        JSON.stringify(filterAdditionalServices),
      );
    else localStorage.removeItem("filterAdditionalServices");
  }, [filterAdditionalServices]);
  useEffect(() => {
    if (filterRegistrationData.length > 0)
      localStorage.setItem(
        "filterRegistrationData",
        JSON.stringify(filterRegistrationData),
      );
    else localStorage.removeItem("filterRegistrationData");
  }, [filterRegistrationData]);
  useEffect(() => {
    if (filterClientType.length > 0)
      localStorage.setItem(
        "filterClientType",
        JSON.stringify(filterClientType),
      );
    else localStorage.removeItem("filterClientType");
  }, [filterClientType]);
  useEffect(() => {
    if (filterGPU.length > 0)
      localStorage.setItem("filterGPU", JSON.stringify(filterGPU));
    else localStorage.removeItem("filterGPU");
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

  // --- Опции для фильтров (мемоизация) ---
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

  // --- Уникальные значения для фильтров (мемоизация) ---
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

  // ========== ФИЛЬТРАЦИЯ (без сортировки) ==========
  const filteredProviders = useMemo(() => {
    let filtered = providers.filter((p) => {
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
        const hasMatchingVirtualization = filterVirtualization.some((virt) =>
          p.technicalSpecs.virtualization.includes(virt as any),
        );
        if (!hasMatchingVirtualization) return false;
      }
      if (
        filterMinDatacenters !== null &&
        p.locations.length < filterMinDatacenters
      )
        return false;
      if (
        filterMaxDatacenters !== null &&
        p.locations.length > filterMaxDatacenters
      )
        return false;
      if (filterDiskType.length > 0) {
        if (!filterDiskType.includes(p.technicalSpecs.diskType)) return false;
      }
      if (filterPaymentMethod.length > 0) {
        const hasMatchingPaymentMethod = filterPaymentMethod.some((method) =>
          p.pricingDetails.paymentMethods.includes(method),
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
        const hasMatchingCPU = filterCPU.some((cpu) => cpuModels.includes(cpu));
        if (!hasMatchingCPU) return false;
      }
      if (filterKII && !p.kiiPlacement) return false;
      if (filterMobileApp && !p.mobileApp) return false;
      if (filterOrderBeforeRegistration && !p.orderBeforeRegistration)
        return false;
      if (filterAdditionalServices.length > 0) {
        const hasMatchingService = filterAdditionalServices.some(
          (service) =>
            p.additionalServicesList?.includes(service as any) || false,
        );
        if (!hasMatchingService) return false;
      }
      if (filterRegistrationData.length > 0) {
        const hasMatchingRegistrationData = filterRegistrationData.some(
          (field) => p.registrationData?.includes(field as any) || false,
        );
        if (!hasMatchingRegistrationData) return false;
      }
      if (filterClientType.length > 0) {
        const hasMatchingClientType = filterClientType.some(
          (type) => p.supportedClientTypes?.includes(type as any) || false,
        );
        if (!hasMatchingClientType) return false;
      }
      if (filterHasGPU) {
        const hasAnyGPU = (p.technicalSpecs.gpuModels || []).length > 0;
        if (!hasAnyGPU) return false;
      }
      if (filterGPU.length > 0) {
        const gpuModels = p.technicalSpecs.gpuModels || [];
        const hasMatchingGPU = filterGPU.some((gpu) => gpuModels.includes(gpu));
        if (!hasMatchingGPU) return false;
      }
      if (filter1C && !p.technicalSpecs.supports1C) return false;
      if (filterAI && !p.technicalSpecs.supportsAI) return false;
      return true;
    });

    // Поиск по названию
    if (searchQuery) {
      filtered = filtered.filter((p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    return filtered;
  }, [
    providers,
    searchQuery,
    filterFZ152,
    filterFSTEK,
    filterTrialPeriod,
    filterLocation,
    filterVirtualization,
    filterMinDatacenters,
    filterMaxDatacenters,
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
  ]);

  // ========== СОРТИРОВКА ==========
  const sortedProviders = useMemo(() => {
    const filtered = filteredProviders;

    if (sortBy === "popular") {
      const popular: Provider[] = [];
      const others: Provider[] = [];

      filtered.forEach((provider) => {
        if (POPULAR_IDS.includes(provider.id)) {
          popular.push(provider);
        } else {
          others.push(provider);
        }
      });

      // Сортируем популярных строго по порядку POPULAR_IDS
      popular.sort((a, b) => {
        const indexA = POPULAR_IDS.indexOf(a.id);
        const indexB = POPULAR_IDS.indexOf(b.id);
        return indexA - indexB;
      });

      // Остальных — по возрастанию ID
      others.sort((a, b) => a.id - b.id);

      return [...popular, ...others];
    }

    if (sortBy === "rating") {
      return [...filtered].sort((a, b) => {
        const avgA =
          a.reviews.reduce((sum, r) => sum + r.rating, 0) / a.reviews.length;
        const avgB =
          b.reviews.reduce((sum, r) => sum + r.rating, 0) / b.reviews.length;
        return avgB - avgA;
      });
    }

    if (sortBy === "price") {
      return [...filtered].sort((a, b) => {
        if (a.basePrice === 0 && b.basePrice === 0) return 0;
        if (a.basePrice === 0) return 1;
        if (b.basePrice === 0) return -1;
        return priceSortOrder === "asc"
          ? a.basePrice - b.basePrice
          : b.basePrice - a.basePrice;
      });
    }

    return filtered;
  }, [filteredProviders, sortBy, priceSortOrder]);

  // ========== ПАГИНАЦИЯ ==========
  const displayedProviders = useMemo(() => {
    return sortedProviders.slice(0, providersToShow);
  }, [sortedProviders, providersToShow]);

  // ========== ОБРАБОТЧИКИ СОРТИРОВКИ ==========
  const handleSortPopular = () => {
    setSortBy("popular");
  };

  const handleSortRating = () => {
    setSortBy("rating");
  };

  const handleSortPrice = () => {
    if (sortBy !== "price") {
      setSortBy("price");
      setPriceSortOrder("asc");
    } else {
      setPriceSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    }
  };

  // ========== ЛОГИКА СРАВНЕНИЯ ==========
  const [selectedForComparison, setSelectedForComparison] = useState<number[]>(
    [],
  );
  const [showComparison, setShowComparison] = useState(false);

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

  // ========== ОТЗЫВЫ ==========
  const [reviewsToShow, setReviewsToShow] = useState<Record<number, number>>(
    () => {
      const initial: Record<number, number> = {};
      providers.forEach((provider) => {
        initial[provider.id] = 5;
      });
      return initial;
    },
  );

  // ========== ОБЪЕКТ ПРОПСОВ ДЛЯ ФИЛЬТРОВ ==========
  const filterProps = {
    filterFZ152,
    setFilterFZ152,
    filterFSTEK,
    setFilterFSTEK,
    filterTrialPeriod,
    setFilterTrialPeriod,
    filterLocation,
    setFilterLocation,
    filterVirtualization,
    setFilterVirtualization,
    filterMinDatacenters,
    setFilterMinDatacenters,
    filterMaxDatacenters,
    setFilterMaxDatacenters,
    filterDiskType,
    setFilterDiskType,
    filterPaymentMethod,
    setFilterPaymentMethod,
    filterOS,
    setFilterOS,
    filterCPU,
    setFilterCPU,
    filterKII,
    setFilterKII,
    filterMobileApp,
    setFilterMobileApp,
    filterOrderBeforeRegistration,
    setFilterOrderBeforeRegistration,
    filterAdditionalServices,
    setFilterAdditionalServices,
    filterRegistrationData,
    setFilterRegistrationData,
    filterClientType,
    setFilterClientType,
    filterGPU,
    setFilterGPU,
    filterHasGPU,
    setFilterHasGPU,
    filter1C,
    setFilter1C,
    filterAI,
    setFilterAI,
    allLocations,
    allVirtualizations,
    allDiskTypes,
    allPaymentMethods,
    allOS,
    allCPUs,
    allGPUs,
    fstekOptions,
    additionalServicesOptions,
    registrationDataOptions,
    clientTypeOptions,
  };

  // ========== РЕНДЕРИНГ ==========
  if (showComparison) {
    const selectedProviders = providers.filter((p) =>
      selectedForComparison.includes(p.id),
    );
    return (
      <ComparisonTable
        providers={selectedProviders}
        onClose={() => setShowComparison(false)}
      />
    );
  }

  return (
    <section id="providers" className="container mx-auto px-2 py-4">
      {isMobile ? (
        // ----------------------------------------------
        // МОБИЛЬНАЯ ВЕРСИЯ (≤850px)
        // ----------------------------------------------
        <div className="flex flex-col">
          {/* Верхняя панель: поиск + кнопка фильтров */}
          <div className="mb-4 flex items-center gap-2">
            <div className="flex-1">
              <SearchInput
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="Поиск..."
                className="w-full"
              />
            </div>
            <button
              onClick={() => setIsMobileFilterOpen(true)}
              className="px-4 py-2 bg-primary text-white font-medium rounded-lg shadow-md hover:bg-primary/90 transition-colors flex items-center gap-1.5"
            >
              <Icon name="Filter" size={18} />
              <span>Фильтры</span>
            </button>
          </div>

          {/* Строка: счётчик + сортировка (мобильный вид SortPanel сам определит) */}
          <div className="mb-4 flex items-center justify-between">
            <ProvidersCounter
              currentCount={Math.min(providersToShow, sortedProviders.length)}
              totalCount={sortedProviders.length}
            />
            <SortPanel
              sortBy={sortBy}
              onSortPopular={handleSortPopular}
              onSortRating={handleSortRating}
              onSortPrice={handleSortPrice}
              priceSortOrder={priceSortOrder}
              isMobile={true}
            />
          </div>

          {/* Список карточек */}
          {searchQuery && sortedProviders.length === 0 ? (
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
                filteredProviders={displayedProviders}
                reviewsToShow={reviewsToShow}
                setReviewsToShow={setReviewsToShow}
                selectedProvider={selectedProvider}
                setSelectedProvider={setSelectedProvider}
                selectedForComparison={selectedForComparison}
                toggleComparison={toggleComparison}
              />

              {/* Кнопки подгрузки (мобильные — шаг 9) */}
              {(sortedProviders.length > providersToShow ||
                providersToShow > 9) && (
                <div className="flex flex-col sm:flex-row justify-center items-center gap-1.5 mt-6">
                  {sortedProviders.length > providersToShow && (
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
                  {sortedProviders.length > 0 && (
                    <button
                      onClick={() => {
                        if (providersToShow === sortedProviders.length) {
                          setProvidersToShow(9);
                        } else {
                          setProvidersToShow(sortedProviders.length);
                        }
                      }}
                      className="group relative px-6 py-3 bg-gradient-to-r from-secondary to-secondary/80 text-background font-bold text-base rounded-xl shadow-lg shadow-secondary/30 hover:shadow-xl hover:shadow-secondary/40 transition-all hover:scale-[1.02] active:scale-[0.98] w-full sm:w-auto"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-secondary/0 via-white/20 to-secondary/0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      <span className="relative flex items-center justify-center gap-1.5">
                        {providersToShow === sortedProviders.length
                          ? "Скрыть"
                          : "Показать всех"}
                        <svg
                          className={`w-4 h-4 transition-transform ${
                            providersToShow === sortedProviders.length
                              ? "group-hover:-translate-y-0.5"
                              : "group-hover:translate-y-0.5"
                          }`}
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d={
                              providersToShow === sortedProviders.length
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

          {/* Мобильный дровер фильтров (справа) */}
          <MobileFilterDrawer
            isOpen={isMobileFilterOpen}
            onClose={() => setIsMobileFilterOpen(false)}
            {...filterProps}
          />
        </div>
      ) : (
        // ----------------------------------------------
        // ДЕСКТОП/ПЛАНШЕТ (>850px)
        // ----------------------------------------------
        <div className="flex flex-row flex-nowrap gap-4">
          {/* Панель фильтров (всегда открыта) */}
          <FilterPanelAlwaysOpen
            className="w-[30%] min-w-[208px] max-w-[280px] lg:w-[340px] lg:min-w-[340px] lg:max-w-[340px]"
            {...filterProps}
          />

          {/* Правая колонка: поиск, сортировка, карточки */}
          <div className="flex-1 min-w-0">
            <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
              <div className="space-y-2 w-full sm:w-auto">
                <SearchInput
                  value={searchQuery}
                  onChange={setSearchQuery}
                  placeholder="Поиск..."
                  className="w-full sm:w-[300px]"
                />
                <ProvidersCounter
                  currentCount={Math.min(
                    providersToShow,
                    sortedProviders.length,
                  )}
                  totalCount={sortedProviders.length}
                />
              </div>
              <SortPanel
                sortBy={sortBy}
                onSortPopular={handleSortPopular}
                onSortRating={handleSortRating}
                onSortPrice={handleSortPrice}
                priceSortOrder={priceSortOrder}
                isMobile={false}
              />
            </div>

            {searchQuery && sortedProviders.length === 0 ? (
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
                  filteredProviders={displayedProviders}
                  reviewsToShow={reviewsToShow}
                  setReviewsToShow={setReviewsToShow}
                  selectedProvider={selectedProvider}
                  setSelectedProvider={setSelectedProvider}
                  selectedForComparison={selectedForComparison}
                  toggleComparison={toggleComparison}
                />

                {(sortedProviders.length > providersToShow ||
                  providersToShow > incrementCount) && (
                  <div className="flex flex-col sm:flex-row justify-center items-center gap-1.5 mt-6">
                    {sortedProviders.length > providersToShow && (
                      <button
                        onClick={() =>
                          setProvidersToShow((prev) => prev + incrementCount)
                        }
                        className="group relative px-6 py-3 bg-gradient-to-r from-primary to-primary/80 text-background font-bold text-base rounded-xl shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 transition-all hover:scale-[1.02] active:scale-[0.98] w-full sm:w-auto"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-white/20 to-primary/0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <span className="relative flex items-center justify-center gap-1.5">
                          Показать ещё {incrementCount}
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
                    {sortedProviders.length > 0 && (
                      <button
                        onClick={() => {
                          if (providersToShow === sortedProviders.length) {
                            const minToShow = Math.min(
                              incrementCount,
                              sortedProviders.length,
                            );
                            setProvidersToShow(minToShow);
                          } else {
                            setProvidersToShow(sortedProviders.length);
                          }
                        }}
                        className="group relative px-6 py-3 bg-gradient-to-r from-secondary to-secondary/80 text-background font-bold text-base rounded-xl shadow-lg shadow-secondary/30 hover:shadow-xl hover:shadow-secondary/40 transition-all hover:scale-[1.02] active:scale-[0.98] w-full sm:w-auto"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-secondary/0 via-white/20 to-secondary/0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <span className="relative flex items-center justify-center gap-1.5">
                          {providersToShow === sortedProviders.length
                            ? "Скрыть"
                            : "Показать всех"}
                          <svg
                            className={`w-4 h-4 transition-transform ${
                              providersToShow === sortedProviders.length
                                ? "group-hover:-translate-y-0.5"
                                : "group-hover:translate-y-0.5"
                            }`}
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d={
                                providersToShow === sortedProviders.length
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
      )}
    </section>
  );
};
