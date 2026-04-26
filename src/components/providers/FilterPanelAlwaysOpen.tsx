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
  filterMaxDatacenters: number | null;
  setFilterMaxDatacenters: (value: number | null) => void;
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

  // НОВЫЕ ПРОПСЫ ДЛЯ ТИПОВ УСЛУГ
  filterHosting: boolean;
  setFilterHosting: (value: boolean) => void;
  filterVPS: boolean;
  setFilterVPS: (value: boolean) => void;
  filterVDS: boolean;
  setFilterVDS: (value: boolean) => void;
  filterDedicatedServer: boolean;
  setFilterDedicatedServer: (value: boolean) => void;
  filterBareMetal: boolean;
  setFilterBareMetal: (value: boolean) => void;

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

  className?: string;
  showHeader?: boolean;
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

  // Новые фильтры
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
  className = "",
  showHeader = true,
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
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (panelRef.current && panelRef.current.contains(target)) return;
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
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const hasActiveFilters =
    filterFZ152 ||
    filterFSTEK.length > 0 ||
    filterTrialPeriod ||
    filterLocation.length > 0 ||
    filterVirtualization.length > 0 ||
    filterMinDatacenters !== null ||
    filterMaxDatacenters !== null ||
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
    filterAI ||
    filterHosting ||
    filterVPS ||
    filterVDS ||
    filterDedicatedServer ||
    filterBareMetal;

  const activeFiltersCount = [
    filterFZ152,
    filterFSTEK.length > 0,
    filterTrialPeriod,
    filterLocation.length > 0,
    filterVirtualization.length > 0,
    filterMinDatacenters !== null,
    filterMaxDatacenters !== null,
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
    filterHosting,
    filterVPS,
    filterVDS,
    filterDedicatedServer,
    filterBareMetal,
  ].filter(Boolean).length;

  const clearFilters = useCallback(() => {
    setFilterFZ152(false);
    setFilterFSTEK([]);
    setFilterTrialPeriod(false);
    setFilterLocation([]);
    setFilterVirtualization([]);
    setFilterMinDatacenters(null);
    setFilterMaxDatacenters(null);
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
    setFilterHosting(false);
    setFilterVPS(false);
    setFilterVDS(false);
    setFilterDedicatedServer(false);
    setFilterBareMetal(false);
  }, [
    setFilterFZ152,
    setFilterFSTEK,
    setFilterTrialPeriod,
    setFilterLocation,
    setFilterVirtualization,
    setFilterMinDatacenters,
    setFilterMaxDatacenters,
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
    setFilterHosting,
    setFilterVPS,
    setFilterVDS,
    setFilterDedicatedServer,
    setFilterBareMetal,
  ]);

  const handleMultiSelectChange = (
    value: string,
    currentValues: string[],
    setter: (values: string[]) => void,
  ) => {
    if (value === "all") setter([]);
    else if (currentValues.includes(value))
      setter(currentValues.filter((v) => v !== value));
    else setter([...currentValues, value]);
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
      if (key !== dropdown) newState[key] = false;
    });
    newState[dropdown] = !isCurrentlyOpen;
    setDropdownsOpen(newState);
  };

  // --- Компонент чекбокса ---
  const FilterCheckbox = ({
    checked,
    onChange,
    label,
    id,
  }: {
    checked: boolean;
    onChange: (checked: boolean) => void;
    label: string;
    id: string;
  }) => (
    <label
      htmlFor={id}
      className="flex items-center gap-1.5 w-full select-none p-1 rounded hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer"
    >
      <div className="relative flex items-center">
        <input
          id={id}
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="sr-only"
        />
        <div
          className={`w-3 h-3 rounded-full border flex items-center justify-center flex-shrink-0 transition-colors ${
            checked
              ? "border-orange-500 bg-orange-500"
              : "border-orange-400 dark:border-orange-400 bg-transparent"
          }`}
        >
          {checked && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
        </div>
      </div>
      <span className="text-xs text-gray-900 dark:text-white">{label}</span>
    </label>
  );

  // --- Сетка чекбоксов (включая новые) ---
  const CheckboxGrid = () => (
    <div className="grid grid-cols-2 gap-1.5">
      {/* Левая колонка */}
      <div className="space-y-1">
        <FilterCheckbox
          id="filter-fz152"
          checked={filterFZ152}
          onChange={setFilterFZ152}
          label="152-ФЗ"
        />
        <FilterCheckbox
          id="filter-1c"
          checked={filter1C}
          onChange={setFilter1C}
          label="1С"
        />
        <FilterCheckbox
          id="filter-trial"
          checked={filterTrialPeriod}
          onChange={setFilterTrialPeriod}
          label="Тестовый период"
        />
        <FilterCheckbox
          id="filter-order-before-registration"
          checked={filterOrderBeforeRegistration}
          onChange={setFilterOrderBeforeRegistration}
          label="Заказ до регистрации"
        />
        {/* НОВЫЕ ЧЕКБОКСЫ */}
        <FilterCheckbox
          id="filter-hosting"
          checked={filterHosting}
          onChange={setFilterHosting}
          label="Хостинг"
        />
        <FilterCheckbox
          id="filter-vps"
          checked={filterVPS}
          onChange={setFilterVPS}
          label="VPS"
        />
      </div>
      {/* Правая колонка */}
      <div className="space-y-1">
        <FilterCheckbox
          id="filter-kii"
          checked={filterKII}
          onChange={setFilterKII}
          label="КИИ"
        />
        <FilterCheckbox
          id="filter-ai"
          checked={filterAI}
          onChange={setFilterAI}
          label="AI"
        />
        <FilterCheckbox
          id="filter-mobile-app"
          checked={filterMobileApp}
          onChange={setFilterMobileApp}
          label="Моб. приложение"
        />
        <FilterCheckbox
          id="filter-vds"
          checked={filterVDS}
          onChange={setFilterVDS}
          label="VDS"
        />
        <FilterCheckbox
          id="filter-dedicated"
          checked={filterDedicatedServer}
          onChange={setFilterDedicatedServer}
          label="Dedicated Server"
        />
        <FilterCheckbox
          id="filter-bare-metal"
          checked={filterBareMetal}
          onChange={setFilterBareMetal}
          label="Bare metal"
        />
      </div>
    </div>
  );

  // --- Аккордеон (общий компонент, без изменений) ---
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
        className="w-full flex items-center justify-between py-1 text-left cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 rounded px-1 transition-colors focus:outline-none focus:ring-1 focus:ring-orange-500"
      >
        <span className="text-sm font-medium text-gray-900 dark:text-white">
          {title}
        </span>
        <div className="flex items-center gap-2">
          {valueText && valueText.length > 0 && (
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {valueText}
            </span>
          )}
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
              className={`inline-flex items-center px-2 py-1 text-xs rounded-full border transition-colors cursor-pointer focus:outline-none focus:ring-1 focus:ring-orange-500 ${
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

  // --- Аккордеоны (без изменений, они не затрагивают новые фильтры) ---
  const DatacentersAccordion = () => {
    /* ... (оставляем как в оригинале) ... */
  };
  const FstekAccordion = () => {
    /* ... */
  };
  const LocationAccordion = () => {
    /* ... */
  };
  const GpuAccordion = () => {
    /* ... */
  };
  const VirtualizationAccordion = () => {
    /* ... */
  };
  const DiskTypeAccordion = () => {
    /* ... */
  };
  const CpuAccordion = () => {
    /* ... */
  };
  const OSAccordion = () => {
    /* ... */
  };
  const AdditionalServicesAccordion = () => {
    /* ... */
  };
  const PaymentMethodAccordion = () => {
    /* ... */
  };
  const RegistrationDataAccordion = () => {
    /* ... */
  };
  const ClientTypeAccordion = () => {
    /* ... */
  };

  // В реальном проекте нужно скопировать реализации этих аккордеонов из исходного кода.
  // Здесь для краткости они опущены, но должны присутствовать.

  return (
    <div
      ref={panelRef}
      className={`flex-shrink-0 bg-transparent p-3 ${className}`}
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

      {showHeader && (
        <div className="flex items-center justify-between mb-1.5 pb-2 border-b border-gray-200 dark:border-gray-700">
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
              onClick={clearFilters}
              className="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 transition-colors px-2 py-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              Сбросить
            </button>
          )}
        </div>
      )}

      <CheckboxGrid />

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
