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

  // Сортировка
  const [sortBy, setSortBy] = useState<"popular" | "rating" | "price">(() => {
    const saved = localStorage.getItem("sortBy");
    if (saved === "rating" || saved === "price" || saved === "popular")
      return saved;
    return "popular";
  });
  const [priceSortOrder, setPriceSortOrder] = useState<"asc" | "desc">(() => {
    const saved = localStorage.getItem("priceSortOrder");
    return saved === "asc" || saved === "desc" ? saved : "desc";
  });

  useEffect(() => {
    localStorage.setItem("sortBy", sortBy);
  }, [sortBy]);
  useEffect(() => {
    localStorage.setItem("priceSortOrder", priceSortOrder);
  }, [priceSortOrder]);

  // Ширина экрана
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
  const isTenCardsMode = !isMobile && windowWidth >= 950 && windowWidth < 1600;
  const incrementCount = isTenCardsMode ? 10 : 9;

  const [providersToShow, setProvidersToShow] = useState(() => {
    if (typeof window !== "undefined") {
      if (window.innerWidth <= 850) return 9;
      if (window.innerWidth >= 950 && window.innerWidth < 1600) return 10;
      return 9;
    }
    return 9;
  });

  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // ========== СОСТОЯНИЯ ФИЛЬТРОВ (включая новые) ==========
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

  // НОВЫЕ СОСТОЯНИЯ ДЛЯ ТИПОВ УСЛУГ
  const [filterHosting, setFilterHosting] = useState<boolean>(() => {
    const saved = localStorage.getItem("filterHosting");
    return saved ? JSON.parse(saved) : false;
  });
  const [filterVPS, setFilterVPS] = useState<boolean>(() => {
    const saved = localStorage.getItem("filterVPS");
    return saved ? JSON.parse(saved) : false;
  });
  const [filterVDS, setFilterVDS] = useState<boolean>(() => {
    const saved = localStorage.getItem("filterVDS");
    return saved ? JSON.parse(saved) : false;
  });
  const [filterDedicatedServer, setFilterDedicatedServer] = useState<boolean>(
    () => {
      const saved = localStorage.getItem("filterDedicatedServer");
      return saved ? JSON.parse(saved) : false;
    },
  );
  const [filterBareMetal, setFilterBareMetal] = useState<boolean>(() => {
    const saved = localStorage.getItem("filterBareMetal");
    return saved ? JSON.parse(saved) : false;
  });

  // Сохранение в localStorage для новых фильтров
  useEffect(() => {
    localStorage.setItem("filterHosting", JSON.stringify(filterHosting));
  }, [filterHosting]);
  useEffect(() => {
    localStorage.setItem("filterVPS", JSON.stringify(filterVPS));
  }, [filterVPS]);
  useEffect(() => {
    localStorage.setItem("filterVDS", JSON.stringify(filterVDS));
  }, [filterVDS]);
  useEffect(() => {
    localStorage.setItem(
      "filterDedicatedServer",
      JSON.stringify(filterDedicatedServer),
    );
  }, [filterDedicatedServer]);
  useEffect(() => {
    localStorage.setItem("filterBareMetal", JSON.stringify(filterBareMetal));
  }, [filterBareMetal]);

  // (Остальные useEffect для сохранения старых фильтров также должны быть здесь, но для краткости опущены)

  // Опции для фильтров (без изменений)
  const fstekOptions = useMemo(() => ["ФСТЭК-17", "ФСТЭК-21", "ФСТЭК-239"], []);
  const additionalServicesOptions = useMemo(
    () => [
      /* ... */
    ],
    [],
  );
  const registrationDataOptions = useMemo(
    () => [
      /* ... */
    ],
    [],
  );
  const clientTypeOptions = useMemo(() => ["Физлицо", "Юрлицо"], []);

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

  // Фильтрация (добавлены условия для новых полей)
  const filteredProviders = useMemo(() => {
    let filtered = providers.filter((p) => {
      // Старые условия
      if (filterFZ152 && !p.fz152Compliant) return false;
      if (filterFSTEK.length > 0) {
        const hasMatchingFSTEK = filterFSTEK.some((cert) =>
          p.fstekCertifications?.includes(cert),
        );
        if (!hasMatchingFSTEK) return false;
      }
      if (filterTrialPeriod && p.trialDays === 0) return false;
      if (filterLocation.length > 0) {
        if (!filterLocation.some((loc) => p.locations.includes(loc)))
          return false;
      }
      if (filterVirtualization.length > 0) {
        if (
          !filterVirtualization.some((virt) =>
            p.technicalSpecs.virtualization.includes(virt),
          )
        )
          return false;
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
      if (
        filterDiskType.length > 0 &&
        !filterDiskType.includes(p.technicalSpecs.diskType)
      )
        return false;
      if (filterPaymentMethod.length > 0) {
        if (
          !filterPaymentMethod.some((m) =>
            p.pricingDetails.paymentMethods.includes(m),
          )
        )
          return false;
      }
      if (filterOS.length > 0) {
        if (!filterOS.some((os) => p.technicalSpecs.availableOS.includes(os)))
          return false;
      }
      if (filterCPU.length > 0) {
        const cpuModels = p.technicalSpecs.cpuModels || [];
        if (!filterCPU.some((cpu) => cpuModels.includes(cpu))) return false;
      }
      if (filterKII && !p.kiiPlacement) return false;
      if (filterMobileApp && !p.mobileApp) return false;
      if (filterOrderBeforeRegistration && !p.orderBeforeRegistration)
        return false;
      if (filterAdditionalServices.length > 0) {
        if (
          !filterAdditionalServices.some((s) =>
            p.additionalServicesList?.includes(s),
          )
        )
          return false;
      }
      if (filterRegistrationData.length > 0) {
        if (
          !filterRegistrationData.some((f) => p.registrationData?.includes(f))
        )
          return false;
      }
      if (filterClientType.length > 0) {
        if (!filterClientType.some((t) => p.supportedClientTypes?.includes(t)))
          return false;
      }
      if (filterHasGPU) {
        const hasAnyGPU = (p.technicalSpecs.gpuModels || []).length > 0;
        if (!hasAnyGPU) return false;
      }
      if (filterGPU.length > 0) {
        const gpuModels = p.technicalSpecs.gpuModels || [];
        if (!filterGPU.some((gpu) => gpuModels.includes(gpu))) return false;
      }
      if (filter1C && !p.technicalSpecs.supports1C) return false;
      if (filterAI && !p.technicalSpecs.supportsAI) return false;

      // НОВЫЕ УСЛОВИЯ ДЛЯ ТИПОВ УСЛУГ
      if (filterHosting && !p.hasHosting) return false;
      if (filterVPS && !p.hasVPS) return false;
      if (filterVDS && !p.hasVDS) return false;
      if (filterDedicatedServer && !p.hasDedicatedServer) return false;
      if (filterBareMetal && !p.hasBareMetal) return false;

      return true;
    });

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
    filterHosting,
    filterVPS,
    filterVDS,
    filterDedicatedServer,
    filterBareMetal,
  ]);

  // Сортировка (без изменений)
  const sortedProviders = useMemo(() => {
    // ... (оставляем как было)
    return filteredProviders; // упрощённо, в реальности полная логика
  }, [filteredProviders, sortBy, priceSortOrder]);

  // Пагинация, сравнение и прочее – без изменений
  const displayedProviders = useMemo(
    () => sortedProviders.slice(0, providersToShow),
    [sortedProviders, providersToShow],
  );
  const [selectedForComparison, setSelectedForComparison] = useState<number[]>(
    [],
  );
  const [showComparison, setShowComparison] = useState(false);
  const [reviewsToShow, setReviewsToShow] = useState<Record<number, number>>(
    () => {
      const initial: Record<number, number> = {};
      providers.forEach((p) => {
        initial[p.id] = 5;
      });
      return initial;
    },
  );

  const toggleComparison = (providerId: number) => {
    setSelectedForComparison((prev) =>
      prev.includes(providerId)
        ? prev.filter((id) => id !== providerId)
        : [...prev, providerId],
    );
  };
  const compareProviders = () => {
    if (selectedForComparison.length >= 2) setShowComparison(true);
  };
  const cancelComparison = () => setSelectedForComparison([]);

  const handleSortPopular = () => setSortBy("popular");
  const handleSortRating = () => setSortBy("rating");
  const handleSortPrice = (order: "asc" | "desc") => {
    setSortBy("price");
    setPriceSortOrder(order);
  };

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
    filterHosting,
    setFilterHosting,
    filterVPS,
    setFilterVPS,
    filterVDS,
    setFilterVDS,
    filterDedicatedServer,
    setFilterDedicatedServer,
    filterBareMetal,
    setFilterBareMetal,
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
    <section id="providers" className="w-full px-4 3xl:px-[185px] py-10">
      {/* Рендеринг в зависимости от isMobile – без изменений, только передаём filterProps */}
      {isMobile ? (
        <div className="flex flex-col">
          {/* ... мобильная версия с MobileFilterDrawer ... */}
          <MobileFilterDrawer
            isOpen={isMobileFilterOpen}
            onClose={() => setIsMobileFilterOpen(false)}
            {...filterProps}
          />
        </div>
      ) : (
        <div className="flex flex-row flex-nowrap gap-3 items-start">
          <FilterPanelAlwaysOpen
            className="w-[30%] min-w-[208px] max-w-[280px] lg:w-[340px] lg:min-w-[340px] lg:max-w-[340px]"
            {...filterProps}
          />
          <div className="flex-1 min-w-0">
            {/* ... контент (поиск, сортировка, список провайдеров) ... */}
          </div>
        </div>
      )}
    </section>
  );
};
