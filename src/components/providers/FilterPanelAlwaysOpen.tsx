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

  const hasActiveFilters = () => { /* ... */ }; // для краткости не меняем, оставляем как было

  const activeFiltersCount = () => { /* ... */ };

  const clearFilters = useCallback(() => { /* ... */ }, []);

  const handleMultiSelectChange = () => { /* ... */ };
  const handleFstekChange = () => { /* ... */ };
  const handleAdditionalServicesChange = () => { /* ... */ };
  const handleRegistrationDataChange = () => { /* ... */ };
  const handleClientTypeChange = () => { /* ... */ };
  const handleGpuChange = () => { /* ... */ };

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

  // --- Блок типов услуг (без заголовка, в две колонки) ---
  const ServiceTypesBlock = () => (
    <div className="grid grid-cols-2 gap-1.5 mb-3 pb-2 border-b border-gray-200 dark:border-gray-700">
      <div className="space-y-1">
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
        <FilterCheckbox
          id="filter-vds"
          checked={filterVDS}
          onChange={setFilterVDS}
          label="VDS"
        />
      </div>
      <div className="space-y-1">
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

  // --- Остальные чекбоксы ---
  const CheckboxGrid = () => (
    <div className="grid grid-cols-2 gap-1.5 mb-3 pb-2 border-b border-gray-200 dark:border-gray-700">
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
      </div>
    </div>
  );

  // --- Аккордеон "Количество ЦОД" (исправлен: нет NaN, начальные 0 и 15) ---
  const DatacentersAccordion = () => {
    const isOpen = dropdownsOpen.datacenters;
    // Устанавливаем начальные значения: если null, то 0 и 15
    const [minValue, setMinValue] = useState(filterMinDatacenters ?? 0);
    const [maxValue, setMaxValue] = useState(filterMaxDatacenters ?? 15);
    const [isDragging, setIsDragging] = useState<"min" | "max" | null>(null);
    // Инпуты привязываем к этим значениям, они никогда не будут NaN
    const [minInput, setMinInput] = useState(minValue.toString());
    const [maxInput, setMaxInput] = useState(maxValue.toString());

    // Синхронизация с пропсами, если они изменились снаружи
    useEffect(() => {
      const newMin = filterMinDatacenters ?? 0;
      setMinValue(newMin);
      setMinInput(newMin.toString());
    }, [filterMinDatacenters]);

    useEffect(() => {
      const newMax = filterMaxDatacenters ?? 15;
      setMaxValue(newMax);
      setMaxInput(newMax.toString());
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
    }, [minValue, maxValue]);

    const handleMinInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      let value = e.target.value;
      if (value === "") {
        setMinInput("");
        return;
      }
      if (/^\d+$/.test(value)) {
        setMinInput(value);
      }
    };

    const handleMaxInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      let value = e.target.value;
      if (value === "") {
        setMaxInput("");
        return;
      }
      if (/^\d+$/.test(value)) {
        setMaxInput(value);
      }
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

    const hasMin = filterMinDatacenters !== null && filterMinDatacenters > 0;
    const hasMax = filterMaxDatacenters !== null && filterMaxDatacenters < 15;
    let valueText = "";
    if (hasMin || hasMax) {
      const minVal = filterMinDatacenters ?? 0;
      const maxVal = filterMaxDatacenters ?? 15;
      valueText = `${minVal} – ${maxVal}`;
    }

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

  // Остальные аккордеоны (FstekAccordion, LocationAccordion, GpuAccordion, и т.д.) остаются без изменений.
  // Они такие же, как в исходном коде, поэтому здесь не переписаны для краткости.
  // В вашем проекте они уже есть, просто вставьте их сюда.

  const AccordionSection = ({ title, isOpen, onToggle, children, valueText, dropdownKey }: any) => (
    // реализация как была
  );
  const OptionsGrid = ({ options, selectedValues, onChange }: any) => (
    // реализация
  );

  // Остальные аккордеоны (FstekAccordion, LocationAccordion и т.п.) - оставляем как в вашем исходном коде.

  return (
    <div ref={panelRef} className={`flex-shrink-0 bg-transparent p-3 ${className}`}>
      <style jsx global>{/* ... стили ... */}</style>

      {showHeader && (
        <div className="flex items-center justify-between mb-1.5 pb-2 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-1.5">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white">Фильтры</h3>
            {activeFiltersCount > 0 && (
              <div className="w-4 h-4 bg-orange-500 rounded-full flex items-center justify-center">
                <span className="text-xs text-white font-bold">{activeFiltersCount}</span>
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

      <ServiceTypesBlock />
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