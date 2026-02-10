import { useState, useRef, useEffect } from "react";
import { Slider } from "@/components/ui/slider";
import Icon from "@/components/ui/icon";
import { useLanguage } from "@/contexts/LanguageContext";
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
    virtualization: false,
    diskType: false,
    paymentMethod: false,
    os: false,
    cpu: false,
    gpu: false,
    additionalServices: false,
    registrationData: false,
    clientType: false,
    datacenters: false,
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
          virtualization: false,
          diskType: false,
          paymentMethod: false,
          os: false,
          cpu: false,
          gpu: false,
          additionalServices: false,
          registrationData: false,
          clientType: false,
          datacenters: false,
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

  const popularValues = [0, 1, 3, 5, 10, 15];

  const handleMultiSelectChange = (
    value: string,
    currentValues: string[],
    setter: (values: string[]) => void,
  ) => {
    if (currentValues.includes(value)) {
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
    setDropdownsOpen((prev) => {
      const newState = { ...prev };
      Object.keys(newState).forEach((key) => {
        if (key !== dropdown) {
          newState[key] = false;
        }
      });
      newState[dropdown] = !prev[dropdown];
      return newState;
    });
  };

  // Компонент для круглых чекбоксов
  const RoundCheckbox = ({
    id,
    checked,
    onChange,
    label,
  }: {
    id: string;
    checked: boolean;
    onChange: (checked: boolean) => void;
    label: string;
  }) => (
    <div className="flex items-center">
      <label htmlFor={id} className="flex items-center cursor-pointer">
        <div className="relative">
          <input
            type="checkbox"
            id={id}
            checked={checked}
            onChange={(e) => onChange(e.target.checked)}
            className="sr-only"
          />
          <div className="w-4 h-4 rounded-full border-2 border-primary flex items-center justify-center transition-colors">
            {checked && <div className="w-2 h-2 rounded-full bg-primary"></div>}
          </div>
        </div>
        <span className="ml-2 text-sm font-medium text-foreground">
          {label}
        </span>
      </label>
    </div>
  );

  // Компонент для секций с выпадающими списками
  const FilterSection = ({
    title,
    selectedValues,
    isOpen,
    dropdownKey,
    children,
    onClear,
  }: {
    title: string;
    selectedValues: string[];
    isOpen: boolean;
    dropdownKey: string;
    children: React.ReactNode;
    onClear?: () => void;
  }) => {
    const displayText =
      selectedValues.length === 0
        ? "Любой"
        : selectedValues.length === 1
          ? selectedValues[0]
          : `${selectedValues.length} выбрано`;

    return (
      <div className="py-3 border-b border-border last:border-b-0">
        <div
          className="flex items-center justify-between cursor-pointer"
          onClick={() => toggleDropdown(dropdownKey)}
        >
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-foreground">{title}</h3>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">{displayText}</span>
            <Icon
              name={isOpen ? "ChevronUp" : "ChevronDown"}
              size={12}
              className="text-muted-foreground w-3 h-3"
            />
          </div>
        </div>

        {isOpen && (
          <div
            className="mt-3 space-y-2"
            ref={(el) => (dropdownRefs.current[dropdownKey] = el)}
          >
            {onClear && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onClear();
                }}
                className="text-xs text-primary hover:text-primary/80 mb-2 block"
              >
                Очистить все
              </button>
            )}
            {children}
          </div>
        )}
      </div>
    );
  };

  // Компонент для выбора опций в выпадающих списках
  const OptionItem = ({
    label,
    selected,
    onChange,
  }: {
    label: string;
    selected: boolean;
    onChange: () => void;
  }) => (
    <button
      type="button"
      className={`inline-flex items-center px-3 py-1.5 rounded-full border transition-all ${
        selected
          ? "border-primary bg-primary/10 text-primary"
          : "border-border text-foreground hover:border-primary"
      }`}
      onClick={(e) => {
        e.stopPropagation();
        onChange();
      }}
    >
      <span className="text-sm">{label}</span>
    </button>
  );

  // Компонент для GPU
  const GpuOptions = () => (
    <div className="space-y-2">
      <button
        type="button"
        className={`inline-flex items-center px-3 py-1.5 rounded-full border transition-all w-full text-left ${
          filterHasGPU
            ? "border-primary bg-primary/10 text-primary"
            : "border-border text-foreground hover:border-primary"
        }`}
        onClick={(e) => {
          e.stopPropagation();
          setFilterHasGPU(!filterHasGPU);
          if (!filterHasGPU) {
            setFilterGPU([]);
          }
        }}
      >
        <div className="w-4 h-4 rounded-full border-2 border-primary mr-2 flex items-center justify-center flex-shrink-0">
          {filterHasGPU && (
            <div className="w-2 h-2 rounded-full bg-primary"></div>
          )}
        </div>
        <span className="text-sm">Любой GPU (есть GPU)</span>
      </button>

      <div className="flex flex-wrap gap-2">
        {allGPUs.map((option) => (
          <OptionItem
            key={option}
            label={option}
            selected={filterGPU.includes(option)}
            onChange={() => handleGpuChange(option)}
          />
        ))}
      </div>
    </div>
  );

  // Компонент для количества ЦОД
  const DatacentersSection = () => {
    const isOpen = dropdownsOpen.datacenters;
    const displayText =
      datacentersValue > 0 ? `${datacentersValue}+` : "Любое количество";

    return (
      <div className="py-3 border-b border-border">
        <div
          className="flex items-center justify-between cursor-pointer"
          onClick={() => toggleDropdown("datacenters")}
        >
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-foreground">
              Количество ЦОД
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">{displayText}</span>
            <Icon
              name={isOpen ? "ChevronUp" : "ChevronDown"}
              size={12}
              className="text-muted-foreground w-3 h-3"
            />
          </div>
        </div>

        {isOpen && (
          <div
            className="mt-3 space-y-3"
            ref={(el) => (dropdownRefs.current.datacenters = el)}
          >
            <div className="flex flex-wrap gap-2">
              {popularValues.map((value) => (
                <button
                  key={value}
                  type="button"
                  className={`px-3 py-1.5 rounded-full border text-sm transition-all ${
                    datacentersValue === value
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border text-foreground hover:border-primary"
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDatacentersChange(value);
                  }}
                >
                  {value === 0 ? "Любое" : `${value}+`}
                </button>
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
        )}
      </div>
    );
  };

  return (
    <div className="w-[340px] flex-shrink-0 bg-card border border-primary/20 rounded-md shadow-sm p-5 h-full overflow-y-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-bold text-foreground">Фильтры</h2>
          {activeFiltersCount > 0 && (
            <div className="bg-primary text-background text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
              {activeFiltersCount}
            </div>
          )}
        </div>

        {hasActiveFilters && (
          <button
            type="button"
            onClick={clearFilters}
            className="text-sm text-primary hover:text-primary/80 transition-colors"
          >
            Сбросить все
          </button>
        )}
      </div>

      <div className="space-y-6">
        {/* Верхняя секция с круглыми чекбоксами */}
        <div className="grid grid-cols-2 gap-x-6 gap-y-3">
          <RoundCheckbox
            id="fz152"
            checked={filterFZ152}
            onChange={setFilterFZ152}
            label="152-ФЗ"
          />
          <RoundCheckbox
            id="1c"
            checked={filter1C}
            onChange={setFilter1C}
            label="1С"
          />
          <RoundCheckbox
            id="trial"
            checked={filterTrialPeriod}
            onChange={setFilterTrialPeriod}
            label="Тестовый период"
          />
          <RoundCheckbox
            id="kii"
            checked={filterKII}
            onChange={setFilterKII}
            label="КИИ"
          />
          <RoundCheckbox
            id="ai"
            checked={filterAI}
            onChange={setFilterAI}
            label="AI"
          />
          <RoundCheckbox
            id="mobileApp"
            checked={filterMobileApp}
            onChange={setFilterMobileApp}
            label="Моб. приложение"
          />
          <RoundCheckbox
            id="orderBeforeReg"
            checked={filterOrderBeforeRegistration}
            onChange={setFilterOrderBeforeRegistration}
            label="Заказ до регистрации"
          />
        </div>

        {/* Секция ФСТЭК */}
        <FilterSection
          title="ФСТЭК"
          selectedValues={filterFSTEK}
          isOpen={dropdownsOpen.fstek}
          dropdownKey="fstek"
          onClear={() => setFilterFSTEK([])}
        >
          <div className="flex flex-wrap gap-2">
            {fstekOptions.map((option) => (
              <OptionItem
                key={option}
                label={option}
                selected={filterFSTEK.includes(option)}
                onChange={() => handleFstekChange(option)}
              />
            ))}
          </div>
        </FilterSection>

        {/* Секция Локация ЦОД */}
        <FilterSection
          title="Локация ЦОД"
          selectedValues={filterLocation}
          isOpen={dropdownsOpen.location}
          dropdownKey="location"
          onClear={() => setFilterLocation([])}
        >
          <div className="flex flex-wrap gap-2">
            {allLocations.map((option) => (
              <OptionItem
                key={option}
                label={option}
                selected={filterLocation.includes(option)}
                onChange={() =>
                  handleMultiSelectChange(
                    option,
                    filterLocation,
                    setFilterLocation,
                  )
                }
              />
            ))}
          </div>
        </FilterSection>

        {/* Секция Количество ЦОД */}
        <DatacentersSection />

        {/* Секция GPU */}
        <FilterSection
          title="GPU"
          selectedValues={filterGPU}
          isOpen={dropdownsOpen.gpu}
          dropdownKey="gpu"
          onClear={() => {
            setFilterGPU([]);
            setFilterHasGPU(false);
          }}
        >
          <GpuOptions />
        </FilterSection>

        {/* Секция Виртуализация */}
        <FilterSection
          title="Виртуализация"
          selectedValues={filterVirtualization}
          isOpen={dropdownsOpen.virtualization}
          dropdownKey="virtualization"
          onClear={() => setFilterVirtualization([])}
        >
          <div className="flex flex-wrap gap-2">
            {allVirtualizations.map((option) => (
              <OptionItem
                key={option}
                label={option}
                selected={filterVirtualization.includes(option)}
                onChange={() =>
                  handleMultiSelectChange(
                    option,
                    filterVirtualization,
                    setFilterVirtualization,
                  )
                }
              />
            ))}
          </div>
        </FilterSection>

        {/* Секция Тип дисков */}
        <FilterSection
          title="Тип дисков"
          selectedValues={filterDiskType}
          isOpen={dropdownsOpen.diskType}
          dropdownKey="diskType"
          onClear={() => setFilterDiskType([])}
        >
          <div className="flex flex-wrap gap-2">
            {allDiskTypes.map((option) => (
              <OptionItem
                key={option}
                label={option}
                selected={filterDiskType.includes(option)}
                onChange={() =>
                  handleMultiSelectChange(
                    option,
                    filterDiskType,
                    setFilterDiskType,
                  )
                }
              />
            ))}
          </div>
        </FilterSection>

        {/* Секция Процессор */}
        <FilterSection
          title="Процессор"
          selectedValues={filterCPU}
          isOpen={dropdownsOpen.cpu}
          dropdownKey="cpu"
          onClear={() => setFilterCPU([])}
        >
          <div className="flex flex-wrap gap-2">
            {allCPUs.map((option) => (
              <OptionItem
                key={option}
                label={option}
                selected={filterCPU.includes(option)}
                onChange={() =>
                  handleMultiSelectChange(option, filterCPU, setFilterCPU)
                }
              />
            ))}
          </div>
        </FilterSection>

        {/* Секция Операционная система */}
        <FilterSection
          title="Операционная система"
          selectedValues={filterOS}
          isOpen={dropdownsOpen.os}
          dropdownKey="os"
          onClear={() => setFilterOS([])}
        >
          <div className="flex flex-wrap gap-2">
            {allOS.map((option) => (
              <OptionItem
                key={option}
                label={option}
                selected={filterOS.includes(option)}
                onChange={() =>
                  handleMultiSelectChange(option, filterOS, setFilterOS)
                }
              />
            ))}
          </div>
        </FilterSection>

        {/* Секция Дополнительные услуги */}
        <FilterSection
          title="Дополнительные услуги"
          selectedValues={filterAdditionalServices}
          isOpen={dropdownsOpen.additionalServices}
          dropdownKey="additionalServices"
          onClear={() => setFilterAdditionalServices([])}
        >
          <div className="flex flex-wrap gap-2">
            {additionalServicesOptions.map((option) => (
              <OptionItem
                key={option}
                label={option}
                selected={filterAdditionalServices.includes(option)}
                onChange={() => handleAdditionalServicesChange(option)}
              />
            ))}
          </div>
        </FilterSection>

        {/* Секция Способы оплаты */}
        <FilterSection
          title="Способы оплаты"
          selectedValues={filterPaymentMethod}
          isOpen={dropdownsOpen.paymentMethod}
          dropdownKey="paymentMethod"
          onClear={() => setFilterPaymentMethod([])}
        >
          <div className="flex flex-wrap gap-2">
            {allPaymentMethods.map((option) => (
              <OptionItem
                key={option}
                label={option}
                selected={filterPaymentMethod.includes(option)}
                onChange={() =>
                  handleMultiSelectChange(
                    option,
                    filterPaymentMethod,
                    setFilterPaymentMethod,
                  )
                }
              />
            ))}
          </div>
        </FilterSection>

        {/* Секция Данные для регистрации */}
        <FilterSection
          title="Данные для регистрации"
          selectedValues={filterRegistrationData}
          isOpen={dropdownsOpen.registrationData}
          dropdownKey="registrationData"
          onClear={() => setFilterRegistrationData([])}
        >
          <div className="flex flex-wrap gap-2">
            {registrationDataOptions.map((option) => (
              <OptionItem
                key={option}
                label={option}
                selected={filterRegistrationData.includes(option)}
                onChange={() => handleRegistrationDataChange(option)}
              />
            ))}
          </div>
        </FilterSection>

        {/* Секция Тип клиента */}
        <FilterSection
          title="Тип клиента"
          selectedValues={filterClientType}
          isOpen={dropdownsOpen.clientType}
          dropdownKey="clientType"
          onClear={() => setFilterClientType([])}
        >
          <div className="flex flex-wrap gap-2">
            {clientTypeOptions.map((option) => (
              <OptionItem
                key={option}
                label={option}
                selected={filterClientType.includes(option)}
                onChange={() => handleClientTypeChange(option)}
              />
            ))}
          </div>
        </FilterSection>
      </div>
    </div>
  );
};
