import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import Icon from "@/components/ui/icon";
import { useLanguage } from "@/contexts/LanguageContext";
import { useState } from "react";
import {
  RegistrationDataField,
  ClientType,
  AdditionalServiceType,
} from "./types";

interface FilterPanelProps {
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
  // Добавляем новые фильтрыs
  filterGPU: string[];
  setFilterGPU: (value: string[]) => void;
  filterHasGPU: boolean; // Новый фильтр: есть ли GPU вообще
  setFilterHasGPU: (value: boolean) => void;
  filter1C: boolean;
  setFilter1C: (value: boolean) => void;
  filterAI: boolean; // Новый фильтр: поддержка AI
  setFilterAI: (value: boolean) => void;

  allLocations: string[];
  allVirtualizations: string[];
  allDiskTypes: string[];
  allPaymentMethods: string[];
  allOS: string[];
  allCPUs: string[];
  allGPUs: string[]; // Добавляем список всех GPU
  fstekOptions: string[];

  additionalServicesOptions: AdditionalServiceType[];
  registrationDataOptions: RegistrationDataField[];

  clientTypeOptions: ClientType[];
}

export const FilterPanel = ({
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
  // Добавляем новые фильтры
  filterGPU,
  setFilterGPU,
  filterHasGPU, // Новый фильтр
  setFilterHasGPU, // Новый фильтр
  filter1C,
  setFilter1C,
  filterAI, // Новый фильтр
  setFilterAI, // Новый фильтр

  allLocations,
  allVirtualizations,
  allDiskTypes,
  allPaymentMethods,
  allOS,
  allCPUs,
  allGPUs = [], // По умолчанию пустой массив
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
}: FilterPanelProps) => {
  const { t } = useLanguage();
  const [isExpanded, setIsExpanded] = useState(false);
  const [dropdownsOpen, setDropdownsOpen] = useState<Record<string, boolean>>({
    fstek: false,
    location: false,
    virtualization: false,
    diskType: false,
    paymentMethod: false,
    os: false,
    cpu: false,
    gpu: false,
    additionalServices: false,
    registrationData: false,
    clientType: false,
  });

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
    filterHasGPU || // Добавляем новый фильтр
    filter1C ||
    filterAI; // Добавляем фильтр AI

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
    filterHasGPU, // Добавляем новый фильтр
    filter1C,
    filterAI, // Добавляем фильтр AI
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
    setFilterHasGPU(false); // Сбрасываем новый фильтр
    setFilter1C(false);
    setFilterAI(false); // Сбрасываем фильтр AI
  };

  const [datacentersValue, setDatacentersValue] = useState(
    filterMinDatacenters || 0,
  );

  const handleDatacentersChange = (value: number) => {
    setDatacentersValue(value);
    setFilterMinDatacenters(value > 0 ? value : null);
  };

  const popularValues = [0, 1, 3, 5, 10, 15];

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

  const toggleDropdown = (dropdown: string) => {
    setDropdownsOpen((prev) => ({
      ...prev,
      [dropdown]: !prev[dropdown],
    }));
  };

  // ... остальные функции остаются без изменений ...

  // Дропдаун для GPU
  const GpuDropdown = () => {
    const isOpen = dropdownsOpen.gpu;

    return (
      <div className="group">
        <label className="text-sm font-bold text-foreground mb-2 flex items-center gap-2">
          <Icon name="Cpu" size={10} className="text-primary w-3 h-3" />
          <span className="text-xs">GPU</span>
        </label>
        <div className="relative">
          <button
            type="button"
            onClick={() => toggleDropdown("gpu")}
            className="w-full h-8 rounded-lg border border-input bg-background text-foreground text-sm font-medium cursor-pointer hover:border-primary/50 hover:shadow-sm focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all pl-8 pr-7 flex items-center justify-between"
          >
            <div className="flex items-center gap-2 overflow-hidden">
              <div className="absolute left-2 top-1/2 -translate-y-1/2 pointer-events-none">
                <Icon name="Cpu" size={10} className="text-primary w-3 h-3" />
              </div>
              <span className="truncate">
                {filterGPU.length === 0
                  ? filterHasGPU
                    ? "Любой GPU"
                    : "Любой GPU"
                  : filterGPU.length === 1
                    ? filterGPU[0]
                    : `GPU (${filterGPU.length})`}
              </span>
            </div>
            <Icon
              name={isOpen ? "ChevronUp" : "ChevronDown"}
              size={10}
              className="text-muted-foreground w-3 h-3 flex-shrink-0"
            />
          </button>

          {isOpen && (
            <div className="absolute z-50 w-full mt-1 bg-card border border-primary/20 rounded-lg shadow-lg max-h-60 overflow-y-auto">
              <div className="p-2">
                {/* Добавляем опцию "Любой GPU" (булевый фильтр) */}
                <div
                  className="flex items-center px-3 py-2 hover:bg-primary/5 cursor-pointer rounded"
                  onClick={() => {
                    setFilterHasGPU(!filterHasGPU);
                    // Если включаем "Любой GPU", очищаем выбор конкретных моделей
                    if (!filterHasGPU) {
                      setFilterGPU([]);
                    }
                  }}
                >
                  <div
                    className={`w-4 h-4 rounded-sm border-2 mr-3 flex items-center justify-center ${
                      filterHasGPU && filterGPU.length === 0
                        ? "bg-primary border-primary"
                        : "border-primary/50"
                    }`}
                  >
                    {filterHasGPU && filterGPU.length === 0 && (
                      <Icon
                        name="Check"
                        size={8}
                        className="text-background w-2.5 h-2.5"
                      />
                    )}
                  </div>
                  <span className="text-sm">Любой GPU (есть GPU)</span>
                </div>

                <div className="border-t border-border my-2"></div>

                {/* Опция "Все модели" */}
                <button
                  type="button"
                  onClick={() => setFilterGPU([])}
                  className={`w-full text-left px-3 py-2 rounded text-sm mb-1 ${
                    filterGPU.length === 0 && !filterHasGPU
                      ? "bg-primary/10 text-primary font-medium"
                      : "hover:bg-primary/5"
                  }`}
                >
                  Все модели GPU
                </button>

                {/* Список конкретных GPU моделей */}
                {allGPUs.map((option) => (
                  <div
                    key={option}
                    className="flex items-center px-3 py-2 hover:bg-primary/5 cursor-pointer rounded"
                    onClick={() => handleGpuChange(option)}
                  >
                    <div
                      className={`w-4 h-4 rounded-sm border-2 mr-3 flex items-center justify-center ${
                        filterGPU.includes(option)
                          ? "bg-primary border-primary"
                          : "border-primary/50"
                      }`}
                    >
                      {filterGPU.includes(option) && (
                        <Icon
                          name="Check"
                          size={8}
                          className="text-background w-2.5 h-2.5"
                        />
                      )}
                    </div>
                    <span className="text-sm">{option}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  const MultiSelect = ({
    value,
    onChange,
    options,
    placeholder,
    iconName,
    dropdownKey,
    labelText,
  }: {
    value: string[];
    onChange: (val: string) => void;
    options: string[];
    placeholder: string;
    iconName: string;
    dropdownKey: string;
    labelText?: string;
  }) => {
    const isOpen = dropdownsOpen[dropdownKey];

    return (
      <div className="group">
        {labelText && (
          <label className="text-sm font-bold text-foreground mb-2 flex items-center gap-2">
            <Icon name={iconName} size={10} className="text-primary w-3 h-3" />
            <span className="text-xs">{labelText}</span>
          </label>
        )}
        <div className="relative">
          <button
            type="button"
            onClick={() => toggleDropdown(dropdownKey)}
            className="w-full h-8 rounded-lg border border-input bg-background text-foreground text-sm font-medium cursor-pointer hover:border-primary/50 hover:shadow-sm focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all pl-8 pr-7 flex items-center justify-between"
          >
            <div className="flex items-center gap-2 overflow-hidden">
              <div className="absolute left-2 top-1/2 -translate-y-1/2 pointer-events-none">
                <Icon
                  name={iconName}
                  size={10}
                  className="text-primary w-3 h-3"
                />
              </div>
              <span className="truncate">
                {value.length === 0
                  ? placeholder
                  : value.length === 1
                    ? value[0]
                    : `${t("filters.found")} ${value.length}`}
              </span>
            </div>
            <Icon
              name={isOpen ? "ChevronUp" : "ChevronDown"}
              size={10}
              className="text-muted-foreground w-3 h-3 flex-shrink-0"
            />
          </button>

          {isOpen && (
            <div className="absolute z-50 w-full mt-1 bg-card border border-primary/20 rounded-lg shadow-lg max-h-60 overflow-y-auto">
              <div className="p-2">
                <button
                  type="button"
                  onClick={() => onChange("all")}
                  className={`w-full text-left px-3 py-2 rounded text-sm ${
                    value.length === 0
                      ? "bg-primary/10 text-primary font-medium"
                      : "hover:bg-primary/5"
                  }`}
                >
                  {placeholder}
                </button>
                {options.map((option) => (
                  <div
                    key={option}
                    className="flex items-center px-3 py-2 hover:bg-primary/5 cursor-pointer rounded"
                    onClick={() => onChange(option)}
                  >
                    <div
                      className={`w-4 h-4 rounded-sm border-2 mr-3 flex items-center justify-center ${
                        value.includes(option)
                          ? "bg-primary border-primary"
                          : "border-primary/50"
                      }`}
                    >
                      {value.includes(option) && (
                        <Icon
                          name="Check"
                          size={8}
                          className="text-background w-2.5 h-2.5"
                        />
                      )}
                    </div>
                    <span className="text-sm">{option}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="relative">
      <div className="w-full max-w-[115px] sm:max-w-[120px] md:max-w-[151px]">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full px-3 py-1.5 sm:px-2.5 sm:py-2 flex items-center justify-between hover:bg-primary/5 transition-colors rounded-xl bg-card border border-primary/20 shadow-md"
        >
          <div className="flex items-center gap-1.5 sm:gap-2">
            <div className="w-5 h-5 sm:w-6 sm:h-6 bg-primary/20 rounded-lg flex items-center justify-center relative">
              <Icon
                name="Filter"
                size={10}
                className="text-primary w-3 h-3 sm:w-3.5 sm:h-3.5"
              />

              {activeFiltersCount > 0 && (
                <div className="absolute -top-1 -right-1 bg-primary text-background text-[8px] sm:text-[9px] font-bold rounded-full w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center border-2 border-card">
                  {activeFiltersCount}
                </div>
              )}
            </div>
            <h3 className="text-xs sm:text-sm font-bold text-foreground">
              {t("filters.title")}
            </h3>
          </div>
          <div className="flex items-center gap-1">
            <Icon
              name={isExpanded ? "ChevronUp" : "ChevronDown"}
              size={12}
              className="text-muted-foreground transition-transform w-3 h-3 sm:w-3.5 sm:h-3.5"
            />
          </div>
        </button>
      </div>

      {isExpanded && (
        <div className="absolute top-full left-0 mt-2 w-[calc(100vw-2rem)] max-w-[500px] sm:max-w-[450px] md:max-w-[510px] bg-card border border-primary/20 rounded-xl shadow-md z-50">
          {hasActiveFilters && (
            <div className="flex items-center justify-end px-3 pt-3 pb-2">
              <Button
                variant="outline"
                size="sm"
                onClick={clearFilters}
                className="text-[9px] sm:text-[10px] font-bold hover:bg-destructive hover:text-destructive-foreground hover:border-destructive transition-all shadow hover:shadow-sm h-6 px-2"
              >
                <Icon name="X" size={8} className="w-2.5 h-2.5" />
                <span className="ml-1">{t("filters.resetAll")}</span>
              </Button>
            </div>
          )}

          <div className="space-y-4 p-3 max-h-[70vh] overflow-y-auto">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              <div className="flex items-center space-x-1.5 p-2 bg-background/50 rounded-lg border border-border hover:border-primary/30 transition-colors">
                <div className="relative">
                  <input
                    type="checkbox"
                    id="fz152"
                    checked={filterFZ152}
                    onChange={(e) => setFilterFZ152(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-4 h-4 rounded-sm border-2 border-primary peer-checked:bg-primary peer-checked:border-primary transition-colors flex items-center justify-center">
                    {filterFZ152 && (
                      <Icon
                        name="Check"
                        size={8}
                        className="text-background w-2.5 h-2.5"
                      />
                    )}
                  </div>
                </div>
                <label
                  htmlFor="fz152"
                  className="flex items-center gap-1.5 cursor-pointer"
                >
                  <Icon
                    name="ShieldCheck"
                    size={10}
                    className="text-primary w-3 h-3"
                  />
                  <span className="text-xs font-medium text-foreground">
                    152-ФЗ
                  </span>
                </label>
              </div>

              <div className="col-span-1 sm:col-span-2">
                <FstekDropdown />
              </div>

              <div className="flex items-center space-x-1.5 p-2 bg-background/50 rounded-lg border border-border hover:border-primary/30 transition-colors">
                <div className="relative">
                  <input
                    type="checkbox"
                    id="trial"
                    checked={filterTrialPeriod}
                    onChange={(e) => setFilterTrialPeriod(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-4 h-4 rounded-sm border-2 border-primary peer-checked:bg-primary peer-checked:border-primary transition-colors flex items-center justify-center">
                    {filterTrialPeriod && (
                      <Icon
                        name="Check"
                        size={8}
                        className="text-background w-2.5 h-2.5"
                      />
                    )}
                  </div>
                </div>
                <label
                  htmlFor="trial"
                  className="flex items-center gap-1.5 cursor-pointer"
                >
                  <Icon
                    name="Gift"
                    size={10}
                    className="text-primary w-3 h-3"
                  />
                  <span className="text-xs font-medium text-foreground">
                    {t("filters.trialPeriod")}
                  </span>
                </label>
              </div>

              <div className="flex items-center space-x-1.5 p-2 bg-background/50 rounded-lg border border-border hover:border-primary/30 transition-colors">
                <div className="relative">
                  <input
                    type="checkbox"
                    id="kii"
                    checked={filterKII}
                    onChange={(e) => setFilterKII(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-4 h-4 rounded-sm border-2 border-primary peer-checked:bg-primary peer-checked:border-primary transition-colors flex items-center justify-center">
                    {filterKII && (
                      <Icon
                        name="Check"
                        size={8}
                        className="text-background w-2.5 h-2.5"
                      />
                    )}
                  </div>
                </div>
                <label
                  htmlFor="kii"
                  className="flex items-center gap-1.5 cursor-pointer"
                >
                  <Icon
                    name="Building2"
                    size={10}
                    className="text-primary w-3 h-3"
                  />
                  <span className="text-xs font-medium text-foreground">
                    КИИ
                  </span>
                </label>
              </div>

              <div className="flex items-center space-x-1.5 p-2 bg-background/50 rounded-lg border border-border hover:border-primary/30 transition-colors">
                <div className="relative">
                  <input
                    type="checkbox"
                    id="mobileApp"
                    checked={filterMobileApp}
                    onChange={(e) => setFilterMobileApp(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-4 h-4 rounded-sm border-2 border-primary peer-checked:bg-primary peer-checked:border-primary transition-colors flex items-center justify-center">
                    {filterMobileApp && (
                      <Icon
                        name="Check"
                        size={8}
                        className="text-background w-2.5 h-2.5"
                      />
                    )}
                  </div>
                </div>
                <label
                  htmlFor="mobileApp"
                  className="flex items-center gap-1.5 cursor-pointer"
                >
                  <Icon
                    name="Smartphone"
                    size={10}
                    className="text-primary w-3 h-3"
                  />
                  <span className="text-xs font-medium text-foreground">
                    Моб. приложение
                  </span>
                </label>
              </div>

              <div className="flex items-center space-x-1.5 p-2 bg-background/50 rounded-lg border border-border hover:border-primary/30 transition-colors">
                <div className="relative">
                  <input
                    type="checkbox"
                    id="orderBeforeReg"
                    checked={filterOrderBeforeRegistration}
                    onChange={(e) =>
                      setFilterOrderBeforeRegistration(e.target.checked)
                    }
                    className="sr-only peer"
                  />
                  <div className="w-4 h-4 rounded-sm border-2 border-primary peer-checked:bg-primary peer-checked:border-primary transition-colors flex items-center justify-center">
                    {filterOrderBeforeRegistration && (
                      <Icon
                        name="Check"
                        size={8}
                        className="text-background w-2.5 h-2.5"
                      />
                    )}
                  </div>
                </div>
                <label
                  htmlFor="orderBeforeReg"
                  className="flex items-center gap-1.5 cursor-pointer"
                >
                  <Icon
                    name="ClipboardCheck"
                    size={10}
                    className="text-primary w-3 h-3"
                  />
                  <span className="text-xs font-medium text-foreground">
                    Заказ до регистрации
                  </span>
                </label>
              </div>

              {/* Чекбокс для 1С с той же иконкой, что и в фильтрах */}
              <div className="flex items-center space-x-1.5 p-2 bg-background/50 rounded-lg border border-border hover:border-primary/30 transition-colors">
                <div className="relative">
                  <input
                    type="checkbox"
                    id="supports1C"
                    checked={filter1C}
                    onChange={(e) => setFilter1C(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-4 h-4 rounded-sm border-2 border-primary peer-checked:bg-primary peer-checked:border-primary transition-colors flex items-center justify-center">
                    {filter1C && (
                      <Icon
                        name="Check"
                        size={8}
                        className="text-background w-2.5 h-2.5"
                      />
                    )}
                  </div>
                </div>
                <label
                  htmlFor="supports1C"
                  className="flex items-center gap-1.5 cursor-pointer"
                >
                  <Icon
                    name="Database"
                    size={10}
                    className="text-primary w-3 h-3"
                  />
                  <span className="text-xs font-medium text-foreground">
                    1С
                  </span>
                </label>
              </div>

              {/* Чекбокс для AI с новой иконкой */}
              <div className="flex items-center space-x-1.5 p-2 bg-background/50 rounded-lg border border-border hover:border-primary/30 transition-colors">
                <div className="relative">
                  <input
                    type="checkbox"
                    id="supportsAI"
                    checked={filterAI}
                    onChange={(e) => setFilterAI(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-4 h-4 rounded-sm border-2 border-primary peer-checked:bg-primary peer-checked:border-primary transition-colors flex items-center justify-center">
                    {filterAI && (
                      <Icon
                        name="Check"
                        size={8}
                        className="text-background w-2.5 h-2.5"
                      />
                    )}
                  </div>
                </div>
                <label
                  htmlFor="supportsAI"
                  className="flex items-center gap-1.5 cursor-pointer"
                >
                  <Icon name="Cpu" size={10} className="text-primary w-3 h-3" />
                  <span className="text-xs font-medium text-foreground">
                    AI
                  </span>
                </label>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <MultiSelect
                value={filterLocation}
                onChange={(value) =>
                  handleMultiSelectChange(
                    value,
                    filterLocation,
                    setFilterLocation,
                  )
                }
                options={allLocations}
                placeholder={t("filters.anyLocation")}
                iconName="Globe"
                dropdownKey="location"
                labelText={t("filters.datacenterLocation")}
              />

              <MultiSelect
                value={filterVirtualization}
                onChange={(value) =>
                  handleMultiSelectChange(
                    value,
                    filterVirtualization,
                    setFilterVirtualization,
                  )
                }
                options={allVirtualizations}
                placeholder={t("filters.anyVirtualization")}
                iconName="Box"
                dropdownKey="virtualization"
                labelText={t("common.virtualization")}
              />

              <MultiSelect
                value={filterDiskType}
                onChange={(value) =>
                  handleMultiSelectChange(
                    value,
                    filterDiskType,
                    setFilterDiskType,
                  )
                }
                options={allDiskTypes}
                placeholder={t("filters.anyDisk")}
                iconName="Database"
                dropdownKey="diskType"
                labelText={t("filters.diskType")}
              />

              {/* GPU дропдаун с опцией "Любой GPU" и выбором конкретных моделей */}
              <GpuDropdown />

              <MultiSelect
                value={filterOS}
                onChange={(value) =>
                  handleMultiSelectChange(value, filterOS, setFilterOS)
                }
                options={allOS}
                placeholder={t("filters.anyOS")}
                iconName="Terminal"
                dropdownKey="os"
                labelText={t("filters.operatingSystem")}
              />

              <MultiSelect
                value={filterCPU}
                onChange={(value) =>
                  handleMultiSelectChange(value, filterCPU, setFilterCPU)
                }
                options={allCPUs}
                placeholder="Любой процессор"
                iconName="Cpu"
                dropdownKey="cpu"
                labelText="Процессор"
              />

              {/* PaymentMethod теперь идет после CPU */}
              <MultiSelect
                value={filterPaymentMethod}
                onChange={(value) =>
                  handleMultiSelectChange(
                    value,
                    filterPaymentMethod,
                    setFilterPaymentMethod,
                  )
                }
                options={allPaymentMethods}
                placeholder={t("filters.anyMethod")}
                iconName="Wallet"
                dropdownKey="paymentMethod"
                labelText={t("filters.paymentMethod")}
              />

              <div className="col-span-1 sm:col-span-2">
                <AdditionalServicesDropdown />
              </div>

              <div className="col-span-1 sm:col-span-2">
                <RegistrationDataDropdown />
              </div>

              <div className="col-span-1 sm:col-span-2">
                <ClientTypeDropdown />
              </div>
            </div>

            <div className="space-y-3 p-3 bg-background/50 rounded-lg border border-border">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Icon
                    name="Server"
                    size={10}
                    className="text-primary w-3 h-3"
                  />
                  <h4 className="text-sm font-bold text-foreground">
                    {t("filters.minDatacenters")}
                  </h4>
                </div>
                <span className="text-sm font-bold text-primary">
                  {datacentersValue > 0
                    ? `${datacentersValue}`
                    : t("filters.anyAmount")}
                </span>
              </div>

              <div className="flex flex-wrap gap-2">
                {popularValues.map((value) => (
                  <Button
                    key={value}
                    type="button"
                    variant={datacentersValue === value ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleDatacentersChange(value)}
                    className="text-xs h-7 px-3 min-w-[50px]"
                  >
                    {value === 0 ? t("filters.anyAmount") : value}
                  </Button>
                ))}
              </div>

              <div className="space-y-2">
                <Slider
                  value={[datacentersValue]}
                  onValueChange={(value) => handleDatacentersChange(value[0])}
                  min={0}
                  max={15}
                  step={1}
                  className="cursor-pointer"
                />

                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>0</span>
                  <span>3</span>
                  <span>6</span>
                  <span>9</span>
                  <span>12</span>
                  <span>15</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Остальные компоненты дропдаунов остаются без изменений
