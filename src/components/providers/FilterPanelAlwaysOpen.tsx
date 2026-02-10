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
  const handleDatacentersChange = useCallback(
    (value: number) => {
      setDatacentersValue(value);
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

  // Компонент Checkbox из старого рабочего кода
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
    <div className="flex items-center space-x-1 p-1 rounded hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
      <div className="relative">
        <input
          type="checkbox"
          id={id}
          checked={checked}
          onChange={(e) => {
            console.log(`${id} clicked`, e.target.checked);
            onChange(e.target.checked);
          }}
          className="sr-only peer"
        />
        <div className="w-3.5 h-3.5 rounded-sm border-2 border-orange-500 peer-checked:bg-orange-500 peer-checked:border-orange-500 transition-colors flex items-center justify-center">
          {checked && (
            <Icon name="Check" size={6} className="text-white w-2 h-2" />
          )}
        </div>
      </div>
      <label
        htmlFor={id}
        className="text-xs text-gray-900 dark:text-white cursor-pointer"
      >
        {label}
      </label>
    </div>
  );

  // Верхняя секция чекбоксов - новый стиль, старый функционал
  const CheckboxSection = () => {
    return (
      <div className="space-y-1.5 pb-2 border-b border-gray-200 dark:border-gray-700">
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
              onClick={clearFilters}
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
            <FilterCheckbox
              id="filter-fz152"
              checked={filterFZ152}
              onChange={setFilterFZ152}
              label="152-ФЗ"
            />

            {/* 1С */}
            <FilterCheckbox
              id="filter-1c"
              checked={filter1C}
              onChange={setFilter1C}
              label="1С"
            />

            {/* Тестовый период */}
            <FilterCheckbox
              id="filter-trial"
              checked={filterTrialPeriod}
              onChange={setFilterTrialPeriod}
              label="Тестовый период"
            />

            {/* КИИ */}
            <FilterCheckbox
              id="filter-kii"
              checked={filterKII}
              onChange={setFilterKII}
              label="КИИ"
            />
          </div>

          {/* Колонка 2 */}
          <div className="space-y-1">
            {/* AI */}
            <FilterCheckbox
              id="filter-ai"
              checked={filterAI}
              onChange={setFilterAI}
              label="AI"
            />

            {/* Моб. приложение */}
            <FilterCheckbox
              id="filter-mobile-app"
              checked={filterMobileApp}
              onChange={setFilterMobileApp}
              label="Моб. приложение"
            />

            {/* Заказ до регистрации */}
            <FilterCheckbox
              id="filter-order-before-registration"
              checked={filterOrderBeforeRegistration}
              onChange={setFilterOrderBeforeRegistration}
              label="Заказ до регистрации"
            />
          </div>
        </div>
      </div>
    );
  };

  // Компонент аккордеона для секций - новый стиль
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

  // Компонент чекбокса внутри дропдауна из старого кода
  const DropdownCheckbox = ({
    checked,
    onChange,
    label,
  }: {
    checked: boolean;
    onChange: (checked: boolean) => void;
    label: string;
  }) => (
    <div
      className="flex items-center px-2 py-1.5 hover:bg-orange-50 dark:hover:bg-orange-500/10 cursor-pointer rounded"
      onClick={() => onChange(!checked)}
    >
      <div
        className={`w-3.5 h-3.5 rounded-sm border-2 mr-2 flex items-center justify-center ${
          checked
            ? "bg-orange-500 border-orange-500"
            : "border-gray-400 dark:border-gray-500"
        }`}
      >
        {checked && (
          <Icon name="Check" size={6} className="text-white w-2 h-2" />
        )}
      </div>
      <span className="text-xs text-gray-900 dark:text-white">{label}</span>
    </div>
  );

  // Компонент кнопки внутри дропдауна
  const DropdownButton = ({
    onClick,
    label,
    isActive,
  }: {
    onClick: () => void;
    label: string;
    isActive: boolean;
  }) => (
    <button
      type="button"
      onClick={onClick}
      className={`w-full text-left px-2 py-1.5 rounded text-xs ${
        isActive
          ? "bg-orange-100 dark:bg-orange-500/20 text-orange-600 dark:text-orange-500 font-medium"
          : "hover:bg-orange-50 dark:hover:bg-orange-500/10 text-gray-700 dark:text-gray-300"
      }`}
    >
      {label}
    </button>
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
          <DropdownButton
            onClick={() => setFilterFSTEK([])}
            label="Любой ФСТЭК"
            isActive={filterFSTEK.length === 0}
          />
          {fstekOptions.map((option) => (
            <DropdownCheckbox
              key={option}
              checked={filterFSTEK.includes(option)}
              onChange={() => handleFstekChange(option)}
              label={option}
            />
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
          <DropdownButton
            onClick={() => setFilterLocation([])}
            label="Любая локация"
            isActive={filterLocation.length === 0}
          />
          {allLocations.map((option) => (
            <DropdownCheckbox
              key={option}
              checked={filterLocation.includes(option)}
              onChange={() =>
                handleMultiSelectChange(
                  option,
                  filterLocation,
                  setFilterLocation,
                )
              }
              label={option}
            />
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

          {/* Ползунок из нового кода */}
          <div className="relative py-2">
            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gray-300 dark:bg-gray-600 -translate-y-1/2"></div>

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
                  setDatacentersValue(value);
                  setFilterMinDatacenters(value > 0 ? value : null);
                };

                const handleUp = () => {
                  document.removeEventListener("mousemove", handleMove);
                  document.removeEventListener("mouseup", handleUp);
                };

                document.addEventListener("mousemove", handleMove);
                document.addEventListener("mouseup", handleUp);

                // Инициализируем клик
                const x = e.clientX - rect.left;
                const percent = Math.max(0, Math.min(1, x / rect.width));
                const value = Math.round(percent * 15);
                setDatacentersValue(value);
                setFilterMinDatacenters(value > 0 ? value : null);
              }}
            >
              <div
                className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-orange-500 rounded-full cursor-pointer shadow"
                style={{ left: `${(datacentersValue / 15) * 100}%` }}
              />
            </div>
          </div>

          {/* Кнопки популярных значений из старого кода */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            {[0, 1, 3, 5, 10, 15].map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => {
                  setDatacentersValue(value);
                  setFilterMinDatacenters(value > 0 ? value : null);
                }}
                className={`text-xs h-6 px-2 min-w-[40px] rounded border transition-colors ${
                  datacentersValue === value
                    ? "bg-orange-500 text-white border-orange-500"
                    : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:border-orange-500"
                }`}
              >
                {value === 0 ? "Любое" : value}
              </button>
            ))}
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
          <DropdownCheckbox
            checked={filterHasGPU && filterGPU.length === 0}
            onChange={(checked) => {
              setFilterHasGPU(checked);
              if (checked) {
                setFilterGPU([]);
              }
            }}
            label="Любой GPU (есть GPU)"
          />

          <div className="border-t border-gray-200 dark:border-gray-700 my-1.5"></div>

          <DropdownButton
            onClick={() => {
              setFilterGPU([]);
              setFilterHasGPU(false);
            }}
            label="Все модели GPU"
            isActive={filterGPU.length === 0 && !filterHasGPU}
          />

          {allGPUs.map((option) => (
            <DropdownCheckbox
              key={option}
              checked={filterGPU.includes(option)}
              onChange={() => handleGpuChange(option)}
              label={option}
            />
          ))}
        </div>
      </AccordionSection>
    );
  };

  // Общий компонент для мультиселекта
  const MultiSelectAccordion = ({
    title,
    value,
    onChange,
    options,
    placeholder,
    dropdownKey,
  }: {
    title: string;
    value: string[];
    onChange: (option: string) => void;
    options: string[];
    placeholder: string;
    dropdownKey: string;
  }) => {
    const isOpen = dropdownsOpen[dropdownKey];
    const valueText =
      value.length === 0
        ? placeholder
        : value.length === 1
          ? value[0]
          : `${value.length} выбрано`;

    return (
      <AccordionSection
        title={title}
        isOpen={isOpen}
        onToggle={(e) => handleDropdownClick(dropdownKey, e)}
        valueText={valueText}
        dropdownKey={dropdownKey}
      >
        <div className="space-y-1">
          <DropdownButton
            onClick={() => onChange("all")}
            label={placeholder}
            isActive={value.length === 0}
          />
          {options.map((option) => (
            <DropdownCheckbox
              key={option}
              checked={value.includes(option)}
              onChange={() => onChange(option)}
              label={option}
            />
          ))}
        </div>
      </AccordionSection>
    );
  };

  return (
    <div className="w-[340px] flex-shrink-0 bg-white dark:bg-gray-900 p-3 h-full overflow-y-auto">
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

        <MultiSelectAccordion
          title="Виртуализация"
          value={filterVirtualization}
          onChange={(option) =>
            handleMultiSelectChange(
              option,
              filterVirtualization,
              setFilterVirtualization,
            )
          }
          options={allVirtualizations}
          placeholder="Любая"
          dropdownKey="virtualization"
        />

        <MultiSelectAccordion
          title="Тип дисков"
          value={filterDiskType}
          onChange={(option) =>
            handleMultiSelectChange(option, filterDiskType, setFilterDiskType)
          }
          options={allDiskTypes}
          placeholder="Любой"
          dropdownKey="diskType"
        />

        <MultiSelectAccordion
          title="Процессор"
          value={filterCPU}
          onChange={(option) =>
            handleMultiSelectChange(option, filterCPU, setFilterCPU)
          }
          options={allCPUs}
          placeholder="Любой"
          dropdownKey="cpu"
        />

        <MultiSelectAccordion
          title="Операционная система"
          value={filterOS}
          onChange={(option) =>
            handleMultiSelectChange(option, filterOS, setFilterOS)
          }
          options={allOS}
          placeholder="Любая"
          dropdownKey="os"
        />

        <MultiSelectAccordion
          title="Способы оплаты"
          value={filterPaymentMethod}
          onChange={(option) =>
            handleMultiSelectChange(
              option,
              filterPaymentMethod,
              setFilterPaymentMethod,
            )
          }
          options={allPaymentMethods}
          placeholder="Любой"
          dropdownKey="paymentMethod"
        />

        {/* Дополнительные услуги аккордеон */}
        {(() => {
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
                <DropdownButton
                  onClick={() => setFilterAdditionalServices([])}
                  label="Любые услуги"
                  isActive={filterAdditionalServices.length === 0}
                />
                {additionalServicesOptions.map((option) => (
                  <DropdownCheckbox
                    key={option}
                    checked={filterAdditionalServices.includes(option)}
                    onChange={() => handleAdditionalServicesChange(option)}
                    label={option}
                  />
                ))}
              </div>
            </AccordionSection>
          );
        })()}

        {/* Данные для регистрации аккордеон */}
        {(() => {
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
                <DropdownButton
                  onClick={() => setFilterRegistrationData([])}
                  label="Любые данные"
                  isActive={filterRegistrationData.length === 0}
                />
                {registrationDataOptions.map((option) => (
                  <DropdownCheckbox
                    key={option}
                    checked={filterRegistrationData.includes(option)}
                    onChange={() => handleRegistrationDataChange(option)}
                    label={option}
                  />
                ))}
              </div>
            </AccordionSection>
          );
        })()}

        {/* Тип клиента аккордеон */}
        {(() => {
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
                <DropdownButton
                  onClick={() => setFilterClientType([])}
                  label="Любой тип"
                  isActive={filterClientType.length === 0}
                />
                {clientTypeOptions.map((option) => (
                  <DropdownCheckbox
                    key={option}
                    checked={filterClientType.includes(option)}
                    onChange={() => handleClientTypeChange(option)}
                    label={option}
                  />
                ))}
              </div>
            </AccordionSection>
          );
        })()}
      </div>
    </div>
  );
};
