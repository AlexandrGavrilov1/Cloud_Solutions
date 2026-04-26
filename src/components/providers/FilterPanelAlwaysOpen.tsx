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

  // --- Компоненты ---
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

  // Сетка чекбоксов (включая новые)
  const CheckboxGrid = () => (
    <div className="grid grid-cols-2 gap-1.5">
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

  // Аккордеон
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

  // --- Аккордеоны (полные реализации) ---
  const DatacentersAccordion = () => {
    const isOpen = dropdownsOpen.datacenters;
    const [minValue, setMinValue] = useState(filterMinDatacenters ?? 0);
    const [maxValue, setMaxValue] = useState(filterMaxDatacenters ?? 15);
    const [isDragging, setIsDragging] = useState<"min" | "max" | null>(null);
    const [minInput, setMinInput] = useState(minValue.toString());
    const [maxInput, setMaxInput] = useState(maxValue.toString());

    useEffect(() => {
      setMinValue(filterMinDatacenters ?? 0);
      setMinInput((filterMinDatacenters ?? 0).toString());
    }, [filterMinDatacenters]);

    useEffect(() => {
      setMaxValue(filterMaxDatacenters ?? 15);
      setMaxInput((filterMaxDatacenters ?? 15).toString());
    }, [filterMaxDatacenters]);

    const handleMinChange = useCallback(
      (value: number) => {
        const newValue = Math.max(0, Math.min(value, maxValue - 1, 15));
        setMinValue(newValue);
        setMinInput(newValue.toString());
      },
      [maxValue],
    );

    const handleMaxChange = useCallback(
      (value: number) => {
        const newValue = Math.min(15, Math.max(value, minValue + 1, 0));
        setMaxValue(newValue);
        setMaxInput(newValue.toString());
      },
      [minValue],
    );

    const applyValues = useCallback(() => {
      setFilterMinDatacenters(minValue > 0 ? minValue : null);
      setFilterMaxDatacenters(maxValue < 15 ? maxValue : null);
    }, [minValue, maxValue, setFilterMinDatacenters, setFilterMaxDatacenters]);

    const handleMinInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      if (value === "" || /^\d+$/.test(value)) setMinInput(value);
    };

    const handleMaxInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      if (value === "" || /^\d+$/.test(value)) setMaxInput(value);
    };

    const handleMinInputBlur = () => {
      let value = parseInt(minInput);
      if (isNaN(value)) value = 0;
      value = Math.max(0, Math.min(value, maxValue - 1, 15));
      setMinValue(value);
      setMinInput(value.toString());
      setFilterMinDatacenters(value > 0 ? value : null);
    };

    const handleMaxInputBlur = () => {
      let value = parseInt(maxInput);
      if (isNaN(value)) value = 15;
      value = Math.min(15, Math.max(value, minValue + 1, 0));
      setMaxValue(value);
      setMaxInput(value.toString());
      setFilterMaxDatacenters(value < 15 ? value : null);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") e.currentTarget.blur();
    };

    const handleMinMouseDown = (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging("min");
    };

    const handleMaxMouseDown = (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging("max");
    };

    useEffect(() => {
      if (!isDragging) return;
      const handleMouseMove = (moveEvent: MouseEvent) => {
        moveEvent.preventDefault();
        const slider = document.querySelector(".datacenters-slider");
        if (!slider) return;
        const rect = slider.getBoundingClientRect();
        const x = moveEvent.clientX - rect.left;
        const percent = Math.max(0, Math.min(1, x / rect.width));
        const value = Math.round(percent * 15);
        if (isDragging === "min") handleMinChange(value);
        else if (isDragging === "max") handleMaxChange(value);
      };
      const handleMouseUp = () => {
        setIsDragging(null);
        applyValues();
      };
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };
    }, [isDragging, handleMinChange, handleMaxChange, applyValues]);

    const isDefault =
      (filterMinDatacenters === null || filterMinDatacenters === 0) &&
      (filterMaxDatacenters === null || filterMaxDatacenters === 15);
    const valueText = isDefault
      ? ""
      : `${filterMinDatacenters ?? 0} – ${filterMaxDatacenters ?? 15}`;

    return (
      <AccordionSection
        title="Количество ЦОД"
        isOpen={isOpen}
        onToggle={(e) => handleDropdownClick("datacenters", e)}
        valueText={valueText}
        dropdownKey="datacenters"
      >
        <div className="space-y-3 px-1 pb-2">
          <div className="flex items-center justify-center gap-1">
            <div className="flex-1">
              <div className="flex items-center h-8 px-3 rounded-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus-within:border-orange-500 focus-within:ring-1 focus-within:ring-orange-500 transition-colors">
                <input
                  type="text"
                  value={minInput}
                  onChange={handleMinInputChange}
                  onBlur={handleMinInputBlur}
                  onKeyDown={handleKeyDown}
                  className="w-full text-xs text-center text-gray-900 dark:text-white bg-transparent border-0 focus:outline-none focus:ring-0 p-0"
                  placeholder="0"
                />
              </div>
            </div>
            <div className="flex items-center justify-center w-4">
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                —
              </span>
            </div>
            <div className="flex-1">
              <div className="flex items-center h-8 px-3 rounded-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus-within:border-orange-500 focus-within:ring-1 focus-within:ring-orange-500 transition-colors">
                <input
                  type="text"
                  value={maxInput}
                  onChange={handleMaxInputChange}
                  onBlur={handleMaxInputBlur}
                  onKeyDown={handleKeyDown}
                  className="w-full text-xs text-center text-gray-900 dark:text-white bg-transparent border-0 focus:outline-none focus:ring-0 p-0"
                  placeholder="15"
                />
              </div>
            </div>
          </div>
          <div className="relative py-2">
            <div className="datacenters-slider relative h-0.5 w-full bg-gray-300 dark:bg-gray-600 rounded-full">
              <div
                className={`absolute h-0.5 rounded-full transition-colors ${
                  isDragging ? "bg-gray-300 dark:bg-gray-600" : "bg-orange-500"
                }`}
                style={{
                  left: `${(minValue / 15) * 100}%`,
                  width: `${((maxValue - minValue) / 15) * 100}%`,
                }}
              />
            </div>
            <div
              className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-2 h-2 bg-orange-500 rounded-full cursor-pointer shadow-sm hover:scale-110 transition-transform"
              style={{ left: `${(minValue / 15) * 100}%` }}
              onMouseDown={handleMinMouseDown}
            />
            <div
              className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-2 h-2 bg-orange-500 rounded-full cursor-pointer shadow-sm hover:scale-110 transition-transform"
              style={{ left: `${(maxValue / 15) * 100}%` }}
              onMouseDown={handleMaxMouseDown}
            />
          </div>
        </div>
      </AccordionSection>
    );
  };

  const FstekAccordion = () => {
    const isOpen = dropdownsOpen.fstek;
    const valueText =
      filterFSTEK.length === 0
        ? ""
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

  const LocationAccordion = () => {
    const isOpen = dropdownsOpen.location;
    const valueText =
      filterLocation.length === 0
        ? ""
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

  const GpuAccordion = () => {
    const isOpen = dropdownsOpen.gpu;
    let valueText = "";
    if (filterHasGPU) {
      valueText = "Есть GPU";
    } else if (filterGPU.length > 0) {
      valueText =
        filterGPU.length === 1 ? filterGPU[0] : `${filterGPU.length} выбрано`;
    }
    return (
      <AccordionSection
        title="GPU"
        isOpen={isOpen}
        onToggle={(e) => handleDropdownClick("gpu", e)}
        valueText={valueText}
        dropdownKey="gpu"
      >
        <div className="space-y-1">
          <FilterCheckbox
            id="filter-has-gpu"
            checked={filterHasGPU}
            onChange={(checked) => {
              setFilterHasGPU(checked);
              if (checked) setFilterGPU([]);
            }}
            label="Есть GPU"
          />
          {allGPUs.length > 0 && (
            <div className="mt-1">
              <OptionsGrid
                options={allGPUs}
                selectedValues={filterGPU}
                onChange={handleGpuChange}
              />
            </div>
          )}
        </div>
      </AccordionSection>
    );
  };

  const VirtualizationAccordion = () => {
    const isOpen = dropdownsOpen.virtualization;
    const valueText =
      filterVirtualization.length === 0
        ? ""
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

  const DiskTypeAccordion = () => {
    const isOpen = dropdownsOpen.diskType;
    const valueText =
      filterDiskType.length === 0
        ? ""
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

  const CpuAccordion = () => {
    const isOpen = dropdownsOpen.cpu;
    const valueText =
      filterCPU.length === 0
        ? ""
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

  const OSAccordion = () => {
    const isOpen = dropdownsOpen.os;
    const valueText =
      filterOS.length === 0
        ? ""
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

  const AdditionalServicesAccordion = () => {
    const isOpen = dropdownsOpen.additionalServices;
    const valueText =
      filterAdditionalServices.length === 0
        ? ""
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

  const PaymentMethodAccordion = () => {
    const isOpen = dropdownsOpen.paymentMethod;
    const valueText =
      filterPaymentMethod.length === 0
        ? ""
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

  const RegistrationDataAccordion = () => {
    const isOpen = dropdownsOpen.registrationData;
    const valueText =
      filterRegistrationData.length === 0
        ? ""
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

  const ClientTypeAccordion = () => {
    const isOpen = dropdownsOpen.clientType;
    const valueText =
      filterClientType.length === 0
        ? ""
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
