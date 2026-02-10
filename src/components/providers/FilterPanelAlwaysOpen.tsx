import { Slider } from "@/components/ui/slider";
import Icon from "@/components/ui/icon";
import { useLanguage } from "@/contexts/LanguageContext";
import { useState, useRef, useEffect, useCallback } from "react";
import {
  RegistrationDataField,
  ClientType,
  AdditionalServiceType,
} from "./types";

interface FilterPanelAlwaysOpenProps {
  filterFZ152: boolean;
  setFilterFZ152: (value: boolean) => void;
  filterFSTEK: string[];
  setFilterFSTEK: (value: string[]) => void;
  filterTrialPeriod: boolean;
  setFilterTrialPeriod: (value: boolean) => void;
  filterLocation: string[];
  setFilterLocation: (value: string[]) => void;
  filterVirtualization: string[];
  setFilterVirtualization: (value: string[]) => void;
  filterMinDatacenters: number | null;
  setFilterMinDatacenters: (value: number | null) => void;
  filterDiskType: string[];
  setFilterDiskType: (value: string[]) => void;
  filterPaymentMethod: string[];
  setFilterPaymentMethod: (value: string[]) => void;
  filterOS: string[];
  setFilterOS: (value: string[]) => void;
  filterCPU: string[];
  setFilterCPU: (value: string[]) => void;
  filterKII: boolean;
  setFilterKII: (value: boolean) => void;
  filterMobileApp: boolean;
  setFilterMobileApp: (value: boolean) => void;
  filterOrderBeforeRegistration: boolean;
  setFilterOrderBeforeRegistration: (value: boolean) => void;
  filterAdditionalServices: string[];
  setFilterAdditionalServices: (value: string[]) => void;
  filterRegistrationData: string[];
  setFilterRegistrationData: (value: string[]) => void;
  filterClientType: string[];
  setFilterClientType: (value: string[]) => void;
  filterGPU: string[];
  setFilterGPU: (value: string[]) => void;
  filterHasGPU: boolean;
  setFilterHasGPU: (value: boolean) => void;
  filter1C: boolean;
  setFilter1C: (value: boolean) => void;
  filterAI: boolean;
  setFilterAI: (value: boolean) => void;

  allLocations: string[];
  allVirtualizations: string[];
  allDiskTypes: string[];
  allPaymentMethods: string[];
  allOS: string[];
  allCPUs: string[];
  allGPUs: string[];
  fstekOptions: string[];

  additionalServicesOptions: AdditionalServiceType[];
  registrationDataOptions: RegistrationDataField[];
  clientTypeOptions: ClientType[];
}

export const FilterPanelAlwaysOpen = ({
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
  allGPUs = [],
  fstekOptions = ["ФСТЭК-17", "ФСТЭК-21", "ФСТЭК-239"],

  additionalServicesOptions = [
    "Аудит инфраструктуры",
    "Проектирование инфраструктуры",
    "Миграция в облако",
    "Импортозамещение",
    "Консультация по ИБ",
    "Аттестация по ФСТЭК",
    "Другие гос. лицензии",
  ],

  registrationDataOptions = [
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

  clientTypeOptions = ["Физлицо", "Юрлицо"],
}: FilterPanelAlwaysOpenProps) => {
  const { t } = useLanguage();
  const [dropdownsOpen, setDropdownsOpen] = useState<Record<string, boolean>>({
    fstek: false,
    location: false,
    datacenters: false,
    gpu: false,
    virtualization: false,
    diskType: false,
    cpu: false,
    os: false,
    additionalServices: false,
    paymentMethod: false,
    registrationData: false,
    clientType: false,
  });

  const dropdownRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // Оптимизация: мемоизация значений для линейки
  const [datacentersValue, setDatacentersValue] = useState(
    filterMinDatacenters || 0,
  );

  // Синхронизация с внешним состоянием
  useEffect(() => {
    setDatacentersValue(filterMinDatacenters || 0);
  }, [filterMinDatacenters]);

  // Оптимизированный обработчик изменения количества ЦОД
  const handleDatacentersChange = useCallback((value: number) => {
    setDatacentersValue(value);
  }, []);

  // Применение значения после изменения
  const applyDatacentersValue = useCallback(
    (value: number) => {
      setFilterMinDatacenters(value > 0 ? value : null);
    },
    [setFilterMinDatacenters],
  );

  // Закрытие дропдаунов при клике вне компонента
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;

      let clickedInsideDropdown = false;
      Object.values(dropdownRefs.current).forEach((ref) => {
        if (ref && ref.contains(target)) {
          clickedInsideDropdown = true;
        }
      });

      if (!clickedInsideDropdown) {
        setDropdownsOpen({
          fstek: false,
          location: false,
          datacenters: false,
          gpu: false,
          virtualization: false,
          diskType: false,
          cpu: false,
          os: false,
          additionalServices: false,
          paymentMethod: false,
          registrationData: false,
          clientType: false,
        });
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const hasActiveFilters =
    filterFZ152 ||
    filterFSTEK.length > 0 ||
    filterTrialPeriod ||
    filterLocation.length > 0 ||
    filterVirtualization.length > 0 ||
    filterMinDatacenters !== null ||
    filterDiskType.length > 0 ||
    filterPaymentMethod.length > 0 ||
    filterOS.length > 0 ||
    filterCPU.length > 0 ||
    filterKII ||
    filterMobileApp ||
    filterOrderBeforeRegistration ||
    filterAdditionalServices.length > 0 ||
    filterRegistrationData.length > 0 ||
    filterClientType.length > 0 ||
    filterGPU.length > 0 ||
    filterHasGPU ||
    filter1C ||
    filterAI;

  const activeFiltersCount = [
    filterFZ152,
    filterFSTEK.length > 0,
    filterTrialPeriod,
    filterLocation.length > 0,
    filterVirtualization.length > 0,
    filterMinDatacenters !== null,
    filterDiskType.length > 0,
    filterPaymentMethod.length > 0,
    filterOS.length > 0,
    filterCPU.length > 0,
    filterKII,
    filterMobileApp,
    filterOrderBeforeRegistration,
    filterAdditionalServices.length > 0,
    filterRegistrationData.length > 0,
    filterClientType.length > 0,
    filterGPU.length > 0,
    filterHasGPU,
    filter1C,
    filterAI,
  ].filter(Boolean).length;

  const clearFilters = useCallback(() => {
    console.log("clearFilters called");
    setFilterFZ152(false);
    setFilterFSTEK([]);
    setFilterTrialPeriod(false);
    setFilterLocation([]);
    setFilterVirtualization([]);
    setFilterMinDatacenters(null);
    setFilterDiskType([]);
    setFilterPaymentMethod([]);
    setFilterOS([]);
    setFilterCPU([]);
    setFilterKII(false);
    setFilterMobileApp(false);
    setFilterOrderBeforeRegistration(false);
    setFilterAdditionalServices([]);
    setFilterRegistrationData([]);
    setFilterClientType([]);
    setFilterGPU([]);
    setFilterHasGPU(false);
    setFilter1C(false);
    setFilterAI(false);
  }, [
    setFilterFZ152,
    setFilterFSTEK,
    setFilterTrialPeriod,
    setFilterLocation,
    setFilterVirtualization,
    setFilterMinDatacenters,
    setFilterDiskType,
    setFilterPaymentMethod,
    setFilterOS,
    setFilterCPU,
    setFilterKII,
    setFilterMobileApp,
    setFilterOrderBeforeRegistration,
    setFilterAdditionalServices,
    setFilterRegistrationData,
    setFilterClientType,
    setFilterGPU,
    setFilterHasGPU,
    setFilter1C,
    setFilterAI,
  ]);

  const handleMultiSelectChange = (
    value: string,
    currentValues: string[],
    setter: (values: string[]) => void,
  ) => {
    if (value === "all") {
      setter([]);
    } else if (currentValues.includes(value)) {
      setter(currentValues.filter((v) => v !== value));
    } else {
      setter([...currentValues, value]);
    }
  };

  const handleFstekChange = (option: string) => {
    const newValue = filterFSTEK.includes(option)
      ? filterFSTEK.filter((v) => v !== option)
      : [...filterFSTEK, option];
    setFilterFSTEK(newValue);
  };

  const handleAdditionalServicesChange = (option: string) => {
    const newValue = filterAdditionalServices.includes(option)
      ? filterAdditionalServices.filter((v) => v !== option)
      : [...filterAdditionalServices, option];
    setFilterAdditionalServices(newValue);
  };

  const handleRegistrationDataChange = (option: string) => {
    const newValue = filterRegistrationData.includes(option)
      ? filterRegistrationData.filter((v) => v !== option)
      : [...filterRegistrationData, option];
    setFilterRegistrationData(newValue);
  };

  const handleClientTypeChange = (option: string) => {
    const newValue = filterClientType.includes(option)
      ? filterClientType.filter((v) => v !== option)
      : [...filterClientType, option];
    setFilterClientType(newValue);
  };

  const handleGpuChange = (option: string) => {
    const newValue = filterGPU.includes(option)
      ? filterGPU.filter((v) => v !== option)
      : [...filterGPU, option];
    setFilterGPU(newValue);
  };

  const handleDropdownClick = (dropdown: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const isCurrentlyOpen = dropdownsOpen[dropdown];

    const newState = { ...dropdownsOpen };
    Object.keys(newState).forEach((key) => {
      newState[key] = false;
    });

    if (!isCurrentlyOpen) {
      newState[dropdown] = true;
    }

    setDropdownsOpen(newState);
  };

  // Верхняя секция чекбоксов с круглыми радиокнопками
  const CheckboxSection = () => {
    console.log("CheckboxSection rendering", {
      filterFZ152,
      filter1C,
      activeFiltersCount,
    });

    // Обработчики с использованием useCallback
    const handleFZ152Click = useCallback(
      (e: React.MouseEvent) => {
        console.log("FZ152 clicked", e);
        e.preventDefault();
        e.stopPropagation();
        setFilterFZ152(!filterFZ152);
      },
      [filterFZ152, setFilterFZ152],
    );

    const handle1CClick = useCallback(
      (e: React.MouseEvent) => {
        console.log("1C clicked", e);
        e.preventDefault();
        e.stopPropagation();
        setFilter1C(!filter1C);
      },
      [filter1C, setFilter1C],
    );

    const handleTrialPeriodClick = useCallback(
      (e: React.MouseEvent) => {
        console.log("Trial period clicked", e);
        e.preventDefault();
        e.stopPropagation();
        setFilterTrialPeriod(!filterTrialPeriod);
      },
      [filterTrialPeriod, setFilterTrialPeriod],
    );

    const handleKIIClick = useCallback(
      (e: React.MouseEvent) => {
        console.log("KII clicked", e);
        e.preventDefault();
        e.stopPropagation();
        setFilterKII(!filterKII);
      },
      [filterKII, setFilterKII],
    );

    const handleAIClick = useCallback(
      (e: React.MouseEvent) => {
        console.log("AI clicked", e);
        e.preventDefault();
        e.stopPropagation();
        setFilterAI(!filterAI);
      },
      [filterAI, setFilterAI],
    );

    const handleMobileAppClick = useCallback(
      (e: React.MouseEvent) => {
        console.log("Mobile app clicked", e);
        e.preventDefault();
        e.stopPropagation();
        setFilterMobileApp(!filterMobileApp);
      },
      [filterMobileApp, setFilterMobileApp],
    );

    const handleClearFiltersClick = useCallback(
      (e: React.MouseEvent) => {
        console.log("Clear filters clicked", e);
        e.preventDefault();
        e.stopPropagation();
        clearFilters();
      },
      [clearFilters],
    );

    return (
      <div
        className="space-y-1.5 pb-2 border-b border-gray-200 dark:border-gray-700"
        onClick={(e) => {
          console.log("CheckboxSection container clicked");
          e.stopPropagation();
        }}
      >
        {/* Заголовок */}
        <div className="flex items-center justify-between mb-1.5">
          <div className="flex items-center gap-1.5">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white">
              Фильтры
            </h3>
            {activeFiltersCount > 0 && (
              <div className="w-4 h-4 bg-orange-500 rounded-full flex items-center justify-center">
                <span className="text-xs text-white font-bold">
                  {activeFiltersCount}
                </span>
              </div>
            )}
          </div>
          {hasActiveFilters && (
            <button
              type="button"
              onClick={handleClearFiltersClick}
              className="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 transition-colors cursor-pointer select-none px-2 py-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              Сбросить
            </button>
          )}
        </div>

        {/* Двухколоночная сетка */}
        <div className="grid grid-cols-2 gap-1.5">
          {/* Колонка 1 */}
          <div className="space-y-1">
            {/* 152-ФЗ */}
            <div
              className="flex items-center gap-1.5 w-full select-none p-1 rounded hover:bg-gray-50 dark:hover:bg-gray-800"
              style={{ cursor: "pointer" }}
              onClick={handleFZ152Click}
            >
              <div
                className={`w-3 h-3 rounded-full border flex items-center justify-center transition-all ${
                  filterFZ152
                    ? "border-orange-500 bg-orange-500"
                    : "border-gray-400 bg-transparent"
                }`}
              >
                {filterFZ152 && (
                  <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
                )}
              </div>
              <span className="text-xs text-gray-900 dark:text-white">
                152-ФЗ
              </span>
            </div>

            {/* 1С */}
            <div
              className="flex items-center gap-1.5 w-full select-none p-1 rounded hover:bg-gray-50 dark:hover:bg-gray-800"
              style={{ cursor: "pointer" }}
              onClick={handle1CClick}
            >
              <div
                className={`w-3 h-3 rounded-full border flex items-center justify-center transition-all ${
                  filter1C
                    ? "border-orange-500 bg-orange-500"
                    : "border-gray-400 bg-transparent"
                }`}
              >
                {filter1C && (
                  <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
                )}
              </div>
              <span className="text-xs text-gray-900 dark:text-white">1С</span>
            </div>

            {/* Тестовый период */}
            <div
              className="flex items-center gap-1.5 w-full select-none p-1 rounded hover:bg-gray-50 dark:hover:bg-gray-800"
              style={{ cursor: "pointer" }}
              onClick={handleTrialPeriodClick}
            >
              <div
                className={`w-3 h-3 rounded-full border flex items-center justify-center transition-all ${
                  filterTrialPeriod
                    ? "border-orange-500 bg-orange-500"
                    : "border-gray-400 bg-transparent"
                }`}
              >
                {filterTrialPeriod && (
                  <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
                )}
              </div>
              <span className="text-xs text-gray-900 dark:text-white">
                Тестовый период
              </span>
            </div>
          </div>

          {/* Колонка 2 */}
          <div className="space-y-1">
            {/* КИИ */}
            <div
              className="flex items-center gap-1.5 w-full select-none p-1 rounded hover:bg-gray-50 dark:hover:bg-gray-800"
              style={{ cursor: "pointer" }}
              onClick={handleKIIClick}
            >
              <div
                className={`w-3 h-3 rounded-full border flex items-center justify-center transition-all ${
                  filterKII
                    ? "border-orange-500 bg-orange-500"
                    : "border-gray-400 bg-transparent"
                }`}
              >
                {filterKII && (
                  <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
                )}
              </div>
              <span className="text-xs text-gray-900 dark:text-white">КИИ</span>
            </div>

            {/* AI */}
            <div
              className="flex items-center gap-1.5 w-full select-none p-1 rounded hover:bg-gray-50 dark:hover:bg-gray-800"
              style={{ cursor: "pointer" }}
              onClick={handleAIClick}
            >
              <div
                className={`w-3 h-3 rounded-full border flex items-center justify-center transition-all ${
                  filterAI
                    ? "border-orange-500 bg-orange-500"
                    : "border-gray-400 bg-transparent"
                }`}
              >
                {filterAI && (
                  <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
                )}
              </div>
              <span className="text-xs text-gray-900 dark:text-white">AI</span>
            </div>

            {/* Моб. приложение */}
            <div
              className="flex items-center gap-1.5 w-full select-none p-1 rounded hover:bg-gray-50 dark:hover:bg-gray-800"
              style={{ cursor: "pointer" }}
              onClick={handleMobileAppClick}
            >
              <div
                className={`w-3 h-3 rounded-full border flex items-center justify-center transition-all ${
                  filterMobileApp
                    ? "border-orange-500 bg-orange-500"
                    : "border-gray-400 bg-transparent"
                }`}
              >
                {filterMobileApp && (
                  <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
                )}
              </div>
              <span className="text-xs text-gray-900 dark:text-white">
                Моб. приложение
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Компонент аккордеона для секций
  const AccordionSection = ({
    title,
    isOpen,
    onToggle,
    children,
    valueText,
    dropdownKey,
  }: {
    title: string;
    isOpen: boolean;
    onToggle: (e: React.MouseEvent) => void;
    children: React.ReactNode;
    valueText: string;
    dropdownKey: string;
  }) => (
    <div
      className="border-b border-gray-200 dark:border-gray-700 py-1.5"
      ref={(el) => (dropdownRefs.current[dropdownKey] = el)}
    >
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center justify-between py-1 text-left cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 rounded px-1 transition-colors"
      >
        <span className="text-sm font-medium text-gray-900 dark:text-white">
          {title}
        </span>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {valueText}
          </span>
          <Icon
            name={isOpen ? "ChevronUp" : "ChevronDown"}
            size={12}
            className="text-gray-400"
          />
        </div>
      </button>
      {isOpen && <div className="pt-1.5">{children}</div>}
    </div>
  );

  // Общий компонент для отображения элементов построчно с прокруткой
  const OptionsGrid = ({
    options,
    selectedValues,
    onChange,
  }: {
    options: string[];
    selectedValues: string[];
    onChange: (option: string) => void;
  }) => {
    const hasManyOptions = options.length > 4;

    return (
      <div
        className={`space-y-1 ${hasManyOptions ? "max-h-32 overflow-y-auto pr-1 scrollbar-thin" : ""}`}
      >
        <div className="flex flex-wrap gap-1">
          {options.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => onChange(option)}
              className={`inline-flex items-center px-2 py-1 text-xs rounded-full border transition-colors cursor-pointer ${
                selectedValues.includes(option)
                  ? "border-orange-500 text-orange-600 dark:text-orange-500 bg-orange-50 dark:bg-orange-500/10"
                  : "border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-orange-500/50"
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>
    );
  };

  // ФСТЭК аккордеон
  const FstekAccordion = () => {
    const isOpen = dropdownsOpen.fstek;
    const valueText =
      filterFSTEK.length === 0
        ? "Любой"
        : filterFSTEK.length === 1
          ? filterFSTEK[0]
          : `${filterFSTEK.length} выбрано`;

    return (
      <AccordionSection
        title="ФСТЭК"
        isOpen={isOpen}
        onToggle={(e) => handleDropdownClick("fstek", e)}
        valueText={valueText}
        dropdownKey="fstek"
      >
        <OptionsGrid
          options={fstekOptions}
          selectedValues={filterFSTEK}
          onChange={handleFstekChange}
        />
      </AccordionSection>
    );
  };

  // Локация ЦОД аккордеон
  const LocationAccordion = () => {
    const isOpen = dropdownsOpen.location;
    const valueText =
      filterLocation.length === 0
        ? "Любая"
        : filterLocation.length === 1
          ? filterLocation[0]
          : `${filterLocation.length} выбрано`;

    return (
      <AccordionSection
        title="Локация ЦОД"
        isOpen={isOpen}
        onToggle={(e) => handleDropdownClick("location", e)}
        valueText={valueText}
        dropdownKey="location"
      >
        <OptionsGrid
          options={allLocations}
          selectedValues={filterLocation}
          onChange={(option) =>
            handleMultiSelectChange(option, filterLocation, setFilterLocation)
          }
        />
      </AccordionSection>
    );
  };

  // Количество ЦОД аккордеон с ползунком
  const DatacentersAccordion = () => {
    const isOpen = dropdownsOpen.datacenters;
    const valueText =
      filterMinDatacenters === null || filterMinDatacenters === 0
        ? "Любое"
        : `${filterMinDatacenters}`;

    return (
      <AccordionSection
        title="Количество ЦОД"
        isOpen={isOpen}
        onToggle={(e) => handleDropdownClick("datacenters", e)}
        valueText={valueText}
        dropdownKey="datacenters"
      >
        <div className="space-y-2 px-1">
          <div className="flex justify-between text-xs">
            <span className="text-gray-600 dark:text-gray-400">0</span>
            <span className="text-gray-900 dark:text-white font-medium">
              {datacentersValue} ЦОД
            </span>
            <span className="text-gray-600 dark:text-gray-400">15</span>
          </div>
          <div className="relative py-2">
            {/* Тонкая линия ползунка */}
            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gray-300 dark:bg-gray-600 -translate-y-1/2"></div>

            {/* Ползунок */}
            <div
              className="relative h-4 cursor-pointer"
              onMouseDown={(e) => {
                e.preventDefault();
                const slider = e.currentTarget;
                const rect = slider.getBoundingClientRect();

                const handleMove = (moveEvent: MouseEvent) => {
                  const x = moveEvent.clientX - rect.left;
                  const percent = Math.max(0, Math.min(1, x / rect.width));
                  const value = Math.round(percent * 15);
                  handleDatacentersChange(value);
                };

                const handleUp = () => {
                  document.removeEventListener("mousemove", handleMove);
                  document.removeEventListener("mouseup", handleUp);
                  applyDatacentersValue(datacentersValue);
                };

                document.addEventListener("mousemove", handleMove);
                document.addEventListener("mouseup", handleUp);

                // Инициализируем клик
                const x = e.clientX - rect.left;
                const percent = Math.max(0, Math.min(1, x / rect.width));
                const value = Math.round(percent * 15);
                handleDatacentersChange(value);
              }}
            >
              {/* Маркер ползунка */}
              <div
                className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-orange-500 rounded-full cursor-pointer shadow"
                style={{ left: `${(datacentersValue / 15) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </AccordionSection>
    );
  };

  // GPU аккордеон
  const GpuAccordion = () => {
    const isOpen = dropdownsOpen.gpu;
    const valueText = filterHasGPU
      ? "Есть GPU"
      : filterGPU.length === 0
        ? "Любой"
        : filterGPU.length === 1
          ? filterGPU[0]
          : `${filterGPU.length} выбрано`;

    return (
      <AccordionSection
        title="GPU"
        isOpen={isOpen}
        onToggle={(e) => handleDropdownClick("gpu", e)}
        valueText={valueText}
        dropdownKey="gpu"
      >
        <div className="space-y-1">
          {/* Опция "Есть GPU" */}
          <div
            className="flex items-center gap-1.5 cursor-pointer w-full select-none hover:bg-gray-50 dark:hover:bg-gray-800 rounded px-1 py-0.5 transition-colors"
            onClick={() => setFilterHasGPU(!filterHasGPU)}
          >
            <div
              className={`w-3 h-3 rounded-full border flex items-center justify-center transition-all ${
                filterHasGPU
                  ? "border-orange-500 bg-orange-500"
                  : "border-gray-400 bg-transparent"
              }`}
            >
              {filterHasGPU && (
                <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
              )}
            </div>
            <span className="text-xs text-gray-900 dark:text-white">
              Есть GPU
            </span>
          </div>

          {/* Конкретные модели GPU */}
          <div className="mt-1">
            <OptionsGrid
              options={allGPUs}
              selectedValues={filterGPU}
              onChange={handleGpuChange}
            />
          </div>
        </div>
      </AccordionSection>
    );
  };

  // Виртуализация аккордеон
  const VirtualizationAccordion = () => {
    const isOpen = dropdownsOpen.virtualization;
    const valueText =
      filterVirtualization.length === 0
        ? "Любая"
        : filterVirtualization.length === 1
          ? filterVirtualization[0]
          : `${filterVirtualization.length} выбрано`;

    return (
      <AccordionSection
        title="Виртуализация"
        isOpen={isOpen}
        onToggle={(e) => handleDropdownClick("virtualization", e)}
        valueText={valueText}
        dropdownKey="virtualization"
      >
        <OptionsGrid
          options={allVirtualizations}
          selectedValues={filterVirtualization}
          onChange={(option) =>
            handleMultiSelectChange(
              option,
              filterVirtualization,
              setFilterVirtualization,
            )
          }
        />
      </AccordionSection>
    );
  };

  // Тип дисков аккордеон
  const DiskTypeAccordion = () => {
    const isOpen = dropdownsOpen.diskType;
    const valueText =
      filterDiskType.length === 0
        ? "Любой"
        : filterDiskType.length === 1
          ? filterDiskType[0]
          : `${filterDiskType.length} выбрано`;

    return (
      <AccordionSection
        title="Тип дисков"
        isOpen={isOpen}
        onToggle={(e) => handleDropdownClick("diskType", e)}
        valueText={valueText}
        dropdownKey="diskType"
      >
        <OptionsGrid
          options={allDiskTypes}
          selectedValues={filterDiskType}
          onChange={(option) =>
            handleMultiSelectChange(option, filterDiskType, setFilterDiskType)
          }
        />
      </AccordionSection>
    );
  };

  // Процессор аккордеон
  const CpuAccordion = () => {
    const isOpen = dropdownsOpen.cpu;
    const valueText =
      filterCPU.length === 0
        ? "Любой"
        : filterCPU.length === 1
          ? filterCPU[0]
          : `${filterCPU.length} выбрано`;

    return (
      <AccordionSection
        title="Процессор"
        isOpen={isOpen}
        onToggle={(e) => handleDropdownClick("cpu", e)}
        valueText={valueText}
        dropdownKey="cpu"
      >
        <OptionsGrid
          options={allCPUs}
          selectedValues={filterCPU}
          onChange={(option) =>
            handleMultiSelectChange(option, filterCPU, setFilterCPU)
          }
        />
      </AccordionSection>
    );
  };

  // Операционная система аккордеон
  const OSAccordion = () => {
    const isOpen = dropdownsOpen.os;
    const valueText =
      filterOS.length === 0
        ? "Любая"
        : filterOS.length === 1
          ? filterOS[0]
          : `${filterOS.length} выбрано`;

    return (
      <AccordionSection
        title="Операционная система"
        isOpen={isOpen}
        onToggle={(e) => handleDropdownClick("os", e)}
        valueText={valueText}
        dropdownKey="os"
      >
        <OptionsGrid
          options={allOS}
          selectedValues={filterOS}
          onChange={(option) =>
            handleMultiSelectChange(option, filterOS, setFilterOS)
          }
        />
      </AccordionSection>
    );
  };

  // Дополнительные услуги аккордеон
  const AdditionalServicesAccordion = () => {
    const isOpen = dropdownsOpen.additionalServices;
    const valueText =
      filterAdditionalServices.length === 0
        ? "Любые"
        : filterAdditionalServices.length === 1
          ? filterAdditionalServices[0]
          : `${filterAdditionalServices.length} выбрано`;

    return (
      <AccordionSection
        title="Дополнительные услуги"
        isOpen={isOpen}
        onToggle={(e) => handleDropdownClick("additionalServices", e)}
        valueText={valueText}
        dropdownKey="additionalServices"
      >
        <OptionsGrid
          options={additionalServicesOptions}
          selectedValues={filterAdditionalServices}
          onChange={handleAdditionalServicesChange}
        />
      </AccordionSection>
    );
  };

  // Способы оплаты аккордеон
  const PaymentMethodAccordion = () => {
    const isOpen = dropdownsOpen.paymentMethod;
    const valueText =
      filterPaymentMethod.length === 0
        ? "Любой"
        : filterPaymentMethod.length === 1
          ? filterPaymentMethod[0]
          : `${filterPaymentMethod.length} выбрано`;

    return (
      <AccordionSection
        title="Способы оплаты"
        isOpen={isOpen}
        onToggle={(e) => handleDropdownClick("paymentMethod", e)}
        valueText={valueText}
        dropdownKey="paymentMethod"
      >
        <OptionsGrid
          options={allPaymentMethods}
          selectedValues={filterPaymentMethod}
          onChange={(option) =>
            handleMultiSelectChange(
              option,
              filterPaymentMethod,
              setFilterPaymentMethod,
            )
          }
        />
      </AccordionSection>
    );
  };

  // Данные для регистрации аккордеон
  const RegistrationDataAccordion = () => {
    const isOpen = dropdownsOpen.registrationData;
    const valueText =
      filterRegistrationData.length === 0
        ? "Любые"
        : filterRegistrationData.length === 1
          ? filterRegistrationData[0]
          : `${filterRegistrationData.length} выбрано`;

    return (
      <AccordionSection
        title="Данные для регистрации"
        isOpen={isOpen}
        onToggle={(e) => handleDropdownClick("registrationData", e)}
        valueText={valueText}
        dropdownKey="registrationData"
      >
        <OptionsGrid
          options={registrationDataOptions}
          selectedValues={filterRegistrationData}
          onChange={handleRegistrationDataChange}
        />
      </AccordionSection>
    );
  };

  // Тип клиента аккордеон
  const ClientTypeAccordion = () => {
    const isOpen = dropdownsOpen.clientType;
    const valueText =
      filterClientType.length === 0
        ? "Любой"
        : filterClientType.length === 1
          ? filterClientType[0]
          : `${filterClientType.length} выбрано`;

    return (
      <AccordionSection
        title="Тип клиента"
        isOpen={isOpen}
        onToggle={(e) => handleDropdownClick("clientType", e)}
        valueText={valueText}
        dropdownKey="clientType"
      >
        <OptionsGrid
          options={clientTypeOptions}
          selectedValues={filterClientType}
          onChange={handleClientTypeChange}
        />
      </AccordionSection>
    );
  };

  return (
    <div
      className="w-[340px] flex-shrink-0 bg-white dark:bg-gray-900 p-3 h-full overflow-y-auto relative z-50"
      onClick={(e) => {
        console.log("FilterPanel container clicked");
        e.stopPropagation();
      }}
    >
      <style jsx global>{`
        .scrollbar-thin::-webkit-scrollbar {
          width: 4px;
          height: 4px;
        }

        .scrollbar-thin::-webkit-scrollbar-track {
          background: transparent;
        }

        .scrollbar-thin::-webkit-scrollbar-thumb {
          background-color: #d1d5db;
          border-radius: 2px;
        }

        .scrollbar-thin::-webkit-scrollbar-thumb:hover {
          background-color: #9ca3af;
        }

        .dark .scrollbar-thin::-webkit-scrollbar-thumb {
          background-color: #4b5563;
        }

        .dark .scrollbar-thin::-webkit-scrollbar-thumb:hover {
          background-color: #6b7280;
        }
      `}</style>

      <CheckboxSection />

      <div className="space-y-0">
        <FstekAccordion />
        <LocationAccordion />
        <DatacentersAccordion />
        <GpuAccordion />
        <VirtualizationAccordion />
        <DiskTypeAccordion />
        <CpuAccordion />
        <OSAccordion />
        <AdditionalServicesAccordion />
        <PaymentMethodAccordion />
        <RegistrationDataAccordion />
        <ClientTypeAccordion />
      </div>
    </div>
  );
};
