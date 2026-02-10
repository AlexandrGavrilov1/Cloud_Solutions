import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import Icon from "@/components/ui/icon";
import { useLanguage } from "@/contexts/LanguageContext";
import { useState, useRef, useEffect } from "react";
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

  const clearFilters = () => {
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
  };

  const [datacentersValue, setDatacentersValue] = useState(
    filterMinDatacenters || 0,
  );

  const handleDatacentersChange = (value: number) => {
    setDatacentersValue(value);
    setFilterMinDatacenters(value > 0 ? value : null);
  };

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
  const CheckboxSection = () => (
    <div className="space-y-1.5 pb-2 border-b border-gray-200 dark:border-gray-700">
      {/* Заголовок */}
      <div className="flex items-center justify-between mb-1.5">
        <h3 className="text-sm font-bold text-gray-900 dark:text-white">
          Фильтры
        </h3>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 transition-colors"
          >
            Сбросить все
          </button>
        )}
      </div>

      {/* Двухколоночная сетка */}
      <div className="grid grid-cols-2 gap-1.5">
        {/* Колонка 1 */}
        <div className="space-y-1">
          {/* 152-ФЗ */}
          <div className="flex items-center">
            <label className="flex items-center gap-1.5 cursor-pointer w-full">
              <input
                type="checkbox"
                checked={filterFZ152}
                onChange={(e) => setFilterFZ152(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-3 h-3 rounded-full border border-gray-400 peer-checked:border-orange-500 peer-checked:bg-orange-500 flex items-center justify-center transition-all">
                {filterFZ152 && (
                  <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
                )}
              </div>
              <span className="text-xs text-gray-900 dark:text-white">
                152-ФЗ
              </span>
            </label>
          </div>

          {/* 1С */}
          <div className="flex items-center">
            <label className="flex items-center gap-1.5 cursor-pointer w-full">
              <input
                type="checkbox"
                checked={filter1C}
                onChange={(e) => setFilter1C(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-3 h-3 rounded-full border border-gray-400 peer-checked:border-orange-500 peer-checked:bg-orange-500 flex items-center justify-center transition-all">
                {filter1C && (
                  <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
                )}
              </div>
              <span className="text-xs text-gray-900 dark:text-white">1С</span>
            </label>
          </div>

          {/* Тестовый период */}
          <div className="flex items-center">
            <label className="flex items-center gap-1.5 cursor-pointer w-full">
              <input
                type="checkbox"
                checked={filterTrialPeriod}
                onChange={(e) => setFilterTrialPeriod(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-3 h-3 rounded-full border border-gray-400 peer-checked:border-orange-500 peer-checked:bg-orange-500 flex items-center justify-center transition-all">
                {filterTrialPeriod && (
                  <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
                )}
              </div>
              <span className="text-xs text-gray-900 dark:text-white">
                Тестовый период
              </span>
            </label>
          </div>
        </div>

        {/* Колонка 2 */}
        <div className="space-y-1">
          {/* КИИ */}
          <div className="flex items-center">
            <label className="flex items-center gap-1.5 cursor-pointer w-full">
              <input
                type="checkbox"
                checked={filterKII}
                onChange={(e) => setFilterKII(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-3 h-3 rounded-full border border-gray-400 peer-checked:border-orange-500 peer-checked:bg-orange-500 flex items-center justify-center transition-all">
                {filterKII && (
                  <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
                )}
              </div>
              <span className="text-xs text-gray-900 dark:text-white">КИИ</span>
            </label>
          </div>

          {/* AI */}
          <div className="flex items-center">
            <label className="flex items-center gap-1.5 cursor-pointer w-full">
              <input
                type="checkbox"
                checked={filterAI}
                onChange={(e) => setFilterAI(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-3 h-3 rounded-full border border-gray-400 peer-checked:border-orange-500 peer-checked:bg-orange-500 flex items-center justify-center transition-all">
                {filterAI && (
                  <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
                )}
              </div>
              <span className="text-xs text-gray-900 dark:text-white">AI</span>
            </label>
          </div>

          {/* Моб. приложение */}
          <div className="flex items-center">
            <label className="flex items-center gap-1.5 cursor-pointer w-full">
              <input
                type="checkbox"
                checked={filterMobileApp}
                onChange={(e) => setFilterMobileApp(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-3 h-3 rounded-full border border-gray-400 peer-checked:border-orange-500 peer-checked:bg-orange-500 flex items-center justify-center transition-all">
                {filterMobileApp && (
                  <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
                )}
              </div>
              <span className="text-xs text-gray-900 dark:text-white">
                Моб. приложение
              </span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );

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
        className="w-full flex items-center justify-between py-1 text-left"
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
        <div className="space-y-1">
          {fstekOptions.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => handleFstekChange(option)}
              className={`w-full text-left px-2 py-1 text-xs rounded-full border transition-colors ${
                filterFSTEK.includes(option)
                  ? "border-orange-500 text-orange-600 dark:text-orange-500 bg-orange-50 dark:bg-orange-500/10"
                  : "border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-orange-500/50"
              }`}
            >
              {option}
            </button>
          ))}
        </div>
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
        <div className="space-y-1">
          {allLocations.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() =>
                handleMultiSelectChange(
                  option,
                  filterLocation,
                  setFilterLocation,
                )
              }
              className={`w-full text-left px-2 py-1 text-xs rounded-full border transition-colors ${
                filterLocation.includes(option)
                  ? "border-orange-500 text-orange-600 dark:text-orange-500 bg-orange-50 dark:bg-orange-500/10"
                  : "border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-orange-500/50"
              }`}
            >
              {option}
            </button>
          ))}
        </div>
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
          <Slider
            value={[datacentersValue]}
            onValueChange={(value) => handleDatacentersChange(value[0])}
            min={0}
            max={15}
            step={1}
            className="cursor-pointer"
          />
        </div>
      </AccordionSection>
    );
  };

  // GPU аккордеон
  const GpuAccordion = () => {
    const isOpen = dropdownsOpen.gpu;
    const valueText = filterHasGPU
      ? "Любой GPU"
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
          {/* Опция "Любой GPU (есть GPU)" */}
          <button
            type="button"
            onClick={() => {
              setFilterHasGPU(!filterHasGPU);
              if (!filterHasGPU) {
                setFilterGPU([]);
              }
            }}
            className={`w-full text-left px-2 py-1 text-xs rounded-full border transition-colors ${
              filterHasGPU && filterGPU.length === 0
                ? "border-orange-500 text-orange-600 dark:text-orange-500 bg-orange-50 dark:bg-orange-500/10"
                : "border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-orange-500/50"
            }`}
          >
            Любой GPU (есть GPU)
          </button>

          {/* Разделитель */}
          <div className="border-t border-gray-200 dark:border-gray-700 my-1"></div>

          {/* Конкретные модели GPU */}
          {allGPUs.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => handleGpuChange(option)}
              className={`w-full text-left px-2 py-1 text-xs rounded-full border transition-colors ${
                filterGPU.includes(option)
                  ? "border-orange-500 text-orange-600 dark:text-orange-500 bg-orange-50 dark:bg-orange-500/10"
                  : "border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-orange-500/50"
              }`}
            >
              {option}
            </button>
          ))}
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
        <div className="space-y-1">
          {allVirtualizations.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() =>
                handleMultiSelectChange(
                  option,
                  filterVirtualization,
                  setFilterVirtualization,
                )
              }
              className={`w-full text-left px-2 py-1 text-xs rounded-full border transition-colors ${
                filterVirtualization.includes(option)
                  ? "border-orange-500 text-orange-600 dark:text-orange-500 bg-orange-50 dark:bg-orange-500/10"
                  : "border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-orange-500/50"
              }`}
            >
              {option}
            </button>
          ))}
        </div>
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
        <div className="space-y-1">
          {allDiskTypes.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() =>
                handleMultiSelectChange(
                  option,
                  filterDiskType,
                  setFilterDiskType,
                )
              }
              className={`w-full text-left px-2 py-1 text-xs rounded-full border transition-colors ${
                filterDiskType.includes(option)
                  ? "border-orange-500 text-orange-600 dark:text-orange-500 bg-orange-50 dark:bg-orange-500/10"
                  : "border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-orange-500/50"
              }`}
            >
              {option}
            </button>
          ))}
        </div>
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
        <div className="space-y-1">
          {allCPUs.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() =>
                handleMultiSelectChange(option, filterCPU, setFilterCPU)
              }
              className={`w-full text-left px-2 py-1 text-xs rounded-full border transition-colors ${
                filterCPU.includes(option)
                  ? "border-orange-500 text-orange-600 dark:text-orange-500 bg-orange-50 dark:bg-orange-500/10"
                  : "border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-orange-500/50"
              }`}
            >
              {option}
            </button>
          ))}
        </div>
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
        <div className="space-y-1">
          {allOS.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() =>
                handleMultiSelectChange(option, filterOS, setFilterOS)
              }
              className={`w-full text-left px-2 py-1 text-xs rounded-full border transition-colors ${
                filterOS.includes(option)
                  ? "border-orange-500 text-orange-600 dark:text-orange-500 bg-orange-50 dark:bg-orange-500/10"
                  : "border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-orange-500/50"
              }`}
            >
              {option}
            </button>
          ))}
        </div>
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
        <div className="space-y-1">
          {additionalServicesOptions.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => handleAdditionalServicesChange(option)}
              className={`w-full text-left px-2 py-1 text-xs rounded-full border transition-colors ${
                filterAdditionalServices.includes(option)
                  ? "border-orange-500 text-orange-600 dark:text-orange-500 bg-orange-50 dark:bg-orange-500/10"
                  : "border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-orange-500/50"
              }`}
            >
              {option}
            </button>
          ))}
        </div>
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
        <div className="space-y-1">
          {allPaymentMethods.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() =>
                handleMultiSelectChange(
                  option,
                  filterPaymentMethod,
                  setFilterPaymentMethod,
                )
              }
              className={`w-full text-left px-2 py-1 text-xs rounded-full border transition-colors ${
                filterPaymentMethod.includes(option)
                  ? "border-orange-500 text-orange-600 dark:text-orange-500 bg-orange-50 dark:bg-orange-500/10"
                  : "border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-orange-500/50"
              }`}
            >
              {option}
            </button>
          ))}
        </div>
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
        <div className="space-y-1">
          {registrationDataOptions.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => handleRegistrationDataChange(option)}
              className={`w-full text-left px-2 py-1 text-xs rounded-full border transition-colors ${
                filterRegistrationData.includes(option)
                  ? "border-orange-500 text-orange-600 dark:text-orange-500 bg-orange-50 dark:bg-orange-500/10"
                  : "border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-orange-500/50"
              }`}
            >
              {option}
            </button>
          ))}
        </div>
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
        <div className="space-y-1">
          {clientTypeOptions.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => handleClientTypeChange(option)}
              className={`w-full text-left px-2 py-1 text-xs rounded-full border transition-colors ${
                filterClientType.includes(option)
                  ? "border-orange-500 text-orange-600 dark:text-orange-500 bg-orange-50 dark:bg-orange-500/10"
                  : "border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-orange-500/50"
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </AccordionSection>
    );
  };

  return (
    <div className="w-[340px] flex-shrink-0 bg-white dark:bg-gray-900 p-3 h-full overflow-y-auto">
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
