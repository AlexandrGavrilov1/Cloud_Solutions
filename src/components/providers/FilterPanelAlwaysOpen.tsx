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

  const dropdownRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // Закрытие дропдаунов при клике вне компонента
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;

      // Проверяем, был ли клик внутри любого дропдауна
      let clickedInsideDropdown = false;
      Object.values(dropdownRefs.current).forEach((ref) => {
        if (ref && ref.contains(target)) {
          clickedInsideDropdown = true;
        }
      });

      // Если клик был вне дропдауна, закрываем все
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

    // Сначала закрываем все дропдауны
    const newState = { ...dropdownsOpen };
    Object.keys(newState).forEach((key) => {
      newState[key] = false;
    });

    // Если текущий дропдаун был закрыт, открываем его
    if (!isCurrentlyOpen) {
      newState[dropdown] = true;
    }

    setDropdownsOpen(newState);
  };

  const FstekDropdown = () => {
    const isOpen = dropdownsOpen.fstek;

    return (
      <div className="group" ref={(el) => (dropdownRefs.current.fstek = el)}>
        <div className="relative">
          <button
            type="button"
            onClick={(e) => handleDropdownClick("fstek", e)}
            className="w-full h-7 rounded-md border border-input bg-background text-foreground text-xs font-medium cursor-pointer hover:border-primary/50 hover:shadow-sm focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all pl-7 pr-6 flex items-center justify-between"
          >
            <div className="flex items-center gap-1.5 overflow-hidden">
              <div className="absolute left-2 top-1/2 -translate-y-1/2 pointer-events-none">
                <Icon
                  name="ShieldAlert"
                  size={8}
                  className="text-primary w-2.5 h-2.5"
                />
              </div>
              <span className="truncate text-xs">
                {filterFSTEK.length === 0
                  ? "ФСТЭК"
                  : filterFSTEK.length === 1
                    ? filterFSTEK[0]
                    : `ФСТЭК (${filterFSTEK.length})`}
              </span>
            </div>
            <Icon
              name={isOpen ? "ChevronUp" : "ChevronDown"}
              size={8}
              className="text-muted-foreground w-2.5 h-2.5 flex-shrink-0"
            />
          </button>

          {isOpen && (
            <div className="absolute z-50 w-full mt-1 bg-card border border-primary/20 rounded-md shadow-lg max-h-48 overflow-y-auto">
              <div className="p-1.5">
                <button
                  type="button"
                  onClick={() => setFilterFSTEK([])}
                  className={`w-full text-left px-2 py-1.5 rounded text-xs ${
                    filterFSTEK.length === 0
                      ? "bg-primary/10 text-primary font-medium"
                      : "hover:bg-primary/5"
                  }`}
                >
                  Любой ФСТЭК
                </button>
                {fstekOptions.map((option) => (
                  <div
                    key={option}
                    className="flex items-center px-2 py-1.5 hover:bg-primary/5 cursor-pointer rounded"
                    onClick={() => handleFstekChange(option)}
                  >
                    <div
                      className={`w-3.5 h-3.5 rounded-sm border-2 mr-2 flex items-center justify-center ${
                        filterFSTEK.includes(option)
                          ? "bg-primary border-primary"
                          : "border-primary/50"
                      }`}
                    >
                      {filterFSTEK.includes(option) && (
                        <Icon
                          name="Check"
                          size={6}
                          className="text-background w-2 h-2"
                        />
                      )}
                    </div>
                    <span className="text-xs">{option}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  const AdditionalServicesDropdown = () => {
    const isOpen = dropdownsOpen.additionalServices;

    return (
      <div
        className="group"
        ref={(el) => (dropdownRefs.current.additionalServices = el)}
      >
        <label className="text-xs font-bold text-foreground mb-1.5 flex items-center gap-1.5">
          <Icon
            name="Briefcase"
            size={8}
            className="text-primary w-2.5 h-2.5"
          />
          <span className="text-xs">Доп. услуги</span>
        </label>
        <div className="relative">
          <button
            type="button"
            onClick={(e) => handleDropdownClick("additionalServices", e)}
            className="w-full h-7 rounded-md border border-input bg-background text-foreground text-xs font-medium cursor-pointer hover:border-primary/50 hover:shadow-sm focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all pl-7 pr-6 flex items-center justify-between"
          >
            <div className="flex items-center gap-1.5 overflow-hidden">
              <div className="absolute left-2 top-1/2 -translate-y-1/2 pointer-events-none">
                <Icon
                  name="Briefcase"
                  size={8}
                  className="text-primary w-2.5 h-2.5"
                />
              </div>
              <span className="truncate text-xs">
                {filterAdditionalServices.length === 0
                  ? "Любые услуги"
                  : filterAdditionalServices.length === 1
                    ? filterAdditionalServices[0]
                    : `Услуги (${filterAdditionalServices.length})`}
              </span>
            </div>
            <Icon
              name={isOpen ? "ChevronUp" : "ChevronDown"}
              size={8}
              className="text-muted-foreground w-2.5 h-2.5 flex-shrink-0"
            />
          </button>

          {isOpen && (
            <div className="absolute z-50 w-full mt-1 bg-card border border-primary/20 rounded-md shadow-lg max-h-48 overflow-y-auto">
              <div className="p-1.5">
                <button
                  type="button"
                  onClick={() => setFilterAdditionalServices([])}
                  className={`w-full text-left px-2 py-1.5 rounded text-xs ${
                    filterAdditionalServices.length === 0
                      ? "bg-primary/10 text-primary font-medium"
                      : "hover:bg-primary/5"
                  }`}
                >
                  Любые услуги
                </button>
                {additionalServicesOptions.map((option) => (
                  <div
                    key={option}
                    className="flex items-center px-2 py-1.5 hover:bg-primary/5 cursor-pointer rounded"
                    onClick={() => handleAdditionalServicesChange(option)}
                  >
                    <div
                      className={`w-3.5 h-3.5 rounded-sm border-2 mr-2 flex items-center justify-center ${
                        filterAdditionalServices.includes(option)
                          ? "bg-primary border-primary"
                          : "border-primary/50"
                      }`}
                    >
                      {filterAdditionalServices.includes(option) && (
                        <Icon
                          name="Check"
                          size={6}
                          className="text-background w-2 h-2"
                        />
                      )}
                    </div>
                    <span className="text-xs">{option}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  const RegistrationDataDropdown = () => {
    const isOpen = dropdownsOpen.registrationData;

    return (
      <div
        className="group"
        ref={(el) => (dropdownRefs.current.registrationData = el)}
      >
        <label className="text-xs font-bold text-foreground mb-1.5 flex items-center gap-1.5">
          <Icon name="UserPlus" size={8} className="text-primary w-2.5 h-2.5" />
          <span className="text-xs">Данные регистрации</span>
        </label>
        <div className="relative">
          <button
            type="button"
            onClick={(e) => handleDropdownClick("registrationData", e)}
            className="w-full h-7 rounded-md border border-input bg-background text-foreground text-xs font-medium cursor-pointer hover:border-primary/50 hover:shadow-sm focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all pl-7 pr-6 flex items-center justify-between"
          >
            <div className="flex items-center gap-1.5 overflow-hidden">
              <div className="absolute left-2 top-1/2 -translate-y-1/2 pointer-events-none">
                <Icon
                  name="UserPlus"
                  size={8}
                  className="text-primary w-2.5 h-2.5"
                />
              </div>
              <span className="truncate text-xs">
                {filterRegistrationData.length === 0
                  ? "Любые данные"
                  : filterRegistrationData.length === 1
                    ? filterRegistrationData[0]
                    : `Данные (${filterRegistrationData.length})`}
              </span>
            </div>
            <Icon
              name={isOpen ? "ChevronUp" : "ChevronDown"}
              size={8}
              className="text-muted-foreground w-2.5 h-2.5 flex-shrink-0"
            />
          </button>

          {isOpen && (
            <div className="absolute z-50 w-full mt-1 bg-card border border-primary/20 rounded-md shadow-lg max-h-48 overflow-y-auto">
              <div className="p-1.5">
                <button
                  type="button"
                  onClick={() => setFilterRegistrationData([])}
                  className={`w-full text-left px-2 py-1.5 rounded text-xs ${
                    filterRegistrationData.length === 0
                      ? "bg-primary/10 text-primary font-medium"
                      : "hover:bg-primary/5"
                  }`}
                >
                  Любые данные
                </button>
                {registrationDataOptions.map((option) => (
                  <div
                    key={option}
                    className="flex items-center px-2 py-1.5 hover:bg-primary/5 cursor-pointer rounded"
                    onClick={() => handleRegistrationDataChange(option)}
                  >
                    <div
                      className={`w-3.5 h-3.5 rounded-sm border-2 mr-2 flex items-center justify-center ${
                        filterRegistrationData.includes(option)
                          ? "bg-primary border-primary"
                          : "border-primary/50"
                      }`}
                    >
                      {filterRegistrationData.includes(option) && (
                        <Icon
                          name="Check"
                          size={6}
                          className="text-background w-2 h-2"
                        />
                      )}
                    </div>
                    <span className="text-xs">{option}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  const ClientTypeDropdown = () => {
    const isOpen = dropdownsOpen.clientType;

    return (
      <div
        className="group"
        ref={(el) => (dropdownRefs.current.clientType = el)}
      >
        <label className="text-xs font-bold text-foreground mb-1.5 flex items-center gap-1.5">
          <Icon name="Users" size={8} className="text-primary w-2.5 h-2.5" />
          <span className="text-xs">Тип клиента</span>
        </label>
        <div className="relative">
          <button
            type="button"
            onClick={(e) => handleDropdownClick("clientType", e)}
            className="w-full h-7 rounded-md border border-input bg-background text-foreground text-xs font-medium cursor-pointer hover:border-primary/50 hover:shadow-sm focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all pl-7 pr-6 flex items-center justify-between"
          >
            <div className="flex items-center gap-1.5 overflow-hidden">
              <div className="absolute left-2 top-1/2 -translate-y-1/2 pointer-events-none">
                <Icon
                  name="Users"
                  size={8}
                  className="text-primary w-2.5 h-2.5"
                />
              </div>
              <span className="truncate text-xs">
                {filterClientType.length === 0
                  ? "Любой тип"
                  : filterClientType.length === 1
                    ? filterClientType[0]
                    : `Тип (${filterClientType.length})`}
              </span>
            </div>
            <Icon
              name={isOpen ? "ChevronUp" : "ChevronDown"}
              size={8}
              className="text-muted-foreground w-2.5 h-2.5 flex-shrink-0"
            />
          </button>

          {isOpen && (
            <div className="absolute z-50 w-full mt-1 bg-card border border-primary/20 rounded-md shadow-lg max-h-48 overflow-y-auto">
              <div className="p-1.5">
                <button
                  type="button"
                  onClick={() => setFilterClientType([])}
                  className={`w-full text-left px-2 py-1.5 rounded text-xs ${
                    filterClientType.length === 0
                      ? "bg-primary/10 text-primary font-medium"
                      : "hover:bg-primary/5"
                  }`}
                >
                  Любой тип
                </button>
                {clientTypeOptions.map((option) => (
                  <div
                    key={option}
                    className="flex items-center px-2 py-1.5 hover:bg-primary/5 cursor-pointer rounded"
                    onClick={() => handleClientTypeChange(option)}
                  >
                    <div
                      className={`w-3.5 h-3.5 rounded-sm border-2 mr-2 flex items-center justify-center ${
                        filterClientType.includes(option)
                          ? "bg-primary border-primary"
                          : "border-primary/50"
                      }`}
                    >
                      {filterClientType.includes(option) && (
                        <Icon
                          name="Check"
                          size={6}
                          className="text-background w-2 h-2"
                        />
                      )}
                    </div>
                    <span className="text-xs">{option}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  const GpuDropdown = () => {
    const isOpen = dropdownsOpen.gpu;

    return (
      <div className="group" ref={(el) => (dropdownRefs.current.gpu = el)}>
        <label className="text-xs font-bold text-foreground mb-1.5 flex items-center gap-1.5">
          <Icon name="Cpu" size={8} className="text-primary w-2.5 h-2.5" />
          <span className="text-xs">GPU</span>
        </label>
        <div className="relative">
          <button
            type="button"
            onClick={(e) => handleDropdownClick("gpu", e)}
            className="w-full h-7 rounded-md border border-input bg-background text-foreground text-xs font-medium cursor-pointer hover:border-primary/50 hover:shadow-sm focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all pl-7 pr-6 flex items-center justify-between"
          >
            <div className="flex items-center gap-1.5 overflow-hidden">
              <div className="absolute left-2 top-1/2 -translate-y-1/2 pointer-events-none">
                <Icon
                  name="Cpu"
                  size={8}
                  className="text-primary w-2.5 h-2.5"
                />
              </div>
              <span className="truncate text-xs">
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
              size={8}
              className="text-muted-foreground w-2.5 h-2.5 flex-shrink-0"
            />
          </button>

          {isOpen && (
            <div className="absolute z-50 w-full mt-1 bg-card border border-primary/20 rounded-md shadow-lg max-h-48 overflow-y-auto">
              <div className="p-1.5">
                <div
                  className="flex items-center px-2 py-1.5 hover:bg-primary/5 cursor-pointer rounded"
                  onClick={() => {
                    setFilterHasGPU(!filterHasGPU);
                    if (!filterHasGPU) {
                      setFilterGPU([]);
                    }
                  }}
                >
                  <div
                    className={`w-3.5 h-3.5 rounded-sm border-2 mr-2 flex items-center justify-center ${
                      filterHasGPU && filterGPU.length === 0
                        ? "bg-primary border-primary"
                        : "border-primary/50"
                    }`}
                  >
                    {filterHasGPU && filterGPU.length === 0 && (
                      <Icon
                        name="Check"
                        size={6}
                        className="text-background w-2 h-2"
                      />
                    )}
                  </div>
                  <span className="text-xs">Любой GPU (есть GPU)</span>
                </div>

                <div className="border-t border-border my-1.5"></div>

                <button
                  type="button"
                  onClick={() => setFilterGPU([])}
                  className={`w-full text-left px-2 py-1.5 rounded text-xs mb-1 ${
                    filterGPU.length === 0 && !filterHasGPU
                      ? "bg-primary/10 text-primary font-medium"
                      : "hover:bg-primary/5"
                  }`}
                >
                  Все модели GPU
                </button>

                {allGPUs.map((option) => (
                  <div
                    key={option}
                    className="flex items-center px-2 py-1.5 hover:bg-primary/5 cursor-pointer rounded"
                    onClick={() => handleGpuChange(option)}
                  >
                    <div
                      className={`w-3.5 h-3.5 rounded-sm border-2 mr-2 flex items-center justify-center ${
                        filterGPU.includes(option)
                          ? "bg-primary border-primary"
                          : "border-primary/50"
                      }`}
                    >
                      {filterGPU.includes(option) && (
                        <Icon
                          name="Check"
                          size={6}
                          className="text-background w-2 h-2"
                        />
                      )}
                    </div>
                    <span className="text-xs">{option}</span>
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
      <div
        className="group"
        ref={(el) => (dropdownRefs.current[dropdownKey] = el)}
      >
        {labelText && (
          <label className="text-xs font-bold text-foreground mb-1.5 flex items-center gap-1.5">
            <Icon
              name={iconName}
              size={8}
              className="text-primary w-2.5 h-2.5"
            />
            <span className="text-xs">{labelText}</span>
          </label>
        )}
        <div className="relative">
          <button
            type="button"
            onClick={(e) => handleDropdownClick(dropdownKey, e)}
            className="w-full h-7 rounded-md border border-input bg-background text-foreground text-xs font-medium cursor-pointer hover:border-primary/50 hover:shadow-sm focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all pl-7 pr-6 flex items-center justify-between"
          >
            <div className="flex items-center gap-1.5 overflow-hidden">
              <div className="absolute left-2 top-1/2 -translate-y-1/2 pointer-events-none">
                <Icon
                  name={iconName}
                  size={8}
                  className="text-primary w-2.5 h-2.5"
                />
              </div>
              <span className="truncate text-xs">
                {value.length === 0
                  ? placeholder
                  : value.length === 1
                    ? value[0]
                    : `${t("filters.found")} ${value.length}`}
              </span>
            </div>
            <Icon
              name={isOpen ? "ChevronUp" : "ChevronDown"}
              size={8}
              className="text-muted-foreground w-2.5 h-2.5 flex-shrink-0"
            />
          </button>

          {isOpen && (
            <div className="absolute z-50 w-full mt-1 bg-card border border-primary/20 rounded-md shadow-lg max-h-48 overflow-y-auto">
              <div className="p-1.5">
                <button
                  type="button"
                  onClick={() => onChange("all")}
                  className={`w-full text-left px-2 py-1.5 rounded text-xs ${
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
                    className="flex items-center px-2 py-1.5 hover:bg-primary/5 cursor-pointer rounded"
                    onClick={() => onChange(option)}
                  >
                    <div
                      className={`w-3.5 h-3.5 rounded-sm border-2 mr-2 flex items-center justify-center ${
                        value.includes(option)
                          ? "bg-primary border-primary"
                          : "border-primary/50"
                      }`}
                    >
                      {value.includes(option) && (
                        <Icon
                          name="Check"
                          size={6}
                          className="text-background w-2 h-2"
                        />
                      )}
                    </div>
                    <span className="text-xs">{option}</span>
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
    <div className="w-[340px] flex-shrink-0 bg-card border border-primary/20 rounded-md shadow-sm p-3 h-full overflow-y-auto">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-1.5">
          <div className="w-5 h-5 bg-primary/20 rounded-md flex items-center justify-center relative">
            <Icon name="Filter" size={8} className="text-primary w-2.5 h-2.5" />
            {activeFiltersCount > 0 && (
              <div className="absolute -top-1 -right-1 bg-primary text-background text-[7px] font-bold rounded-full w-3.5 h-3.5 flex items-center justify-center border border-card">
                {activeFiltersCount}
              </div>
            )}
          </div>
          <h3 className="text-xs font-bold text-foreground">
            {t("filters.title")}
          </h3>
        </div>

        {hasActiveFilters && (
          <Button
            variant="outline"
            size="sm"
            onClick={clearFilters}
            className="text-[8px] font-bold hover:bg-destructive hover:text-destructive-foreground hover:border-destructive transition-all shadow hover:shadow-sm h-5 px-1.5"
          >
            <Icon name="X" size={6} className="w-2 h-2" />
            <span className="ml-0.5">{t("filters.resetAll")}</span>
          </Button>
        )}
      </div>

      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-1.5">
          <div className="flex items-center space-x-1 p-1.5 bg-background/50 rounded-md border border-border hover:border-primary/30 transition-colors">
            <div className="relative">
              <input
                type="checkbox"
                id="fz152"
                checked={filterFZ152}
                onChange={(e) => setFilterFZ152(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-3.5 h-3.5 rounded-sm border-2 border-primary peer-checked:bg-primary peer-checked:border-primary transition-colors flex items-center justify-center">
                {filterFZ152 && (
                  <Icon
                    name="Check"
                    size={6}
                    className="text-background w-2 h-2"
                  />
                )}
              </div>
            </div>
            <label
              htmlFor="fz152"
              className="flex items-center gap-1 cursor-pointer"
            >
              <Icon
                name="ShieldCheck"
                size={8}
                className="text-primary w-2.5 h-2.5"
              />
              <span className="text-xs font-medium text-foreground">
                152-ФЗ
              </span>
            </label>
          </div>

          <div className="col-span-1">
            <FstekDropdown />
          </div>

          <div className="flex items-center space-x-1 p-1.5 bg-background/50 rounded-md border border-border hover:border-primary/30 transition-colors">
            <div className="relative">
              <input
                type="checkbox"
                id="trial"
                checked={filterTrialPeriod}
                onChange={(e) => setFilterTrialPeriod(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-3.5 h-3.5 rounded-sm border-2 border-primary peer-checked:bg-primary peer-checked:border-primary transition-colors flex items-center justify-center">
                {filterTrialPeriod && (
                  <Icon
                    name="Check"
                    size={6}
                    className="text-background w-2 h-2"
                  />
                )}
              </div>
            </div>
            <label
              htmlFor="trial"
              className="flex items-center gap-1 cursor-pointer"
            >
              <Icon name="Gift" size={8} className="text-primary w-2.5 h-2.5" />
              <span className="text-xs font-medium text-foreground">
                {t("filters.trialPeriod")}
              </span>
            </label>
          </div>

          <div className="flex items-center space-x-1 p-1.5 bg-background/50 rounded-md border border-border hover:border-primary/30 transition-colors">
            <div className="relative">
              <input
                type="checkbox"
                id="kii"
                checked={filterKII}
                onChange={(e) => setFilterKII(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-3.5 h-3.5 rounded-sm border-2 border-primary peer-checked:bg-primary peer-checked:border-primary transition-colors flex items-center justify-center">
                {filterKII && (
                  <Icon
                    name="Check"
                    size={6}
                    className="text-background w-2 h-2"
                  />
                )}
              </div>
            </div>
            <label
              htmlFor="kii"
              className="flex items-center gap-1 cursor-pointer"
            >
              <Icon
                name="Building2"
                size={8}
                className="text-primary w-2.5 h-2.5"
              />
              <span className="text-xs font-medium text-foreground">КИИ</span>
            </label>
          </div>

          <div className="flex items-center space-x-1 p-1.5 bg-background/50 rounded-md border border-border hover:border-primary/30 transition-colors">
            <div className="relative">
              <input
                type="checkbox"
                id="mobileApp"
                checked={filterMobileApp}
                onChange={(e) => setFilterMobileApp(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-3.5 h-3.5 rounded-sm border-2 border-primary peer-checked:bg-primary peer-checked:border-primary transition-colors flex items-center justify-center">
                {filterMobileApp && (
                  <Icon
                    name="Check"
                    size={6}
                    className="text-background w-2 h-2"
                  />
                )}
              </div>
            </div>
            <label
              htmlFor="mobileApp"
              className="flex items-center gap-1 cursor-pointer"
            >
              <Icon
                name="Smartphone"
                size={8}
                className="text-primary w-2.5 h-2.5"
              />
              <span className="text-xs font-medium text-foreground">
                Моб. приложение
              </span>
            </label>
          </div>

          <div className="flex items-center space-x-1 p-1.5 bg-background/50 rounded-md border border-border hover:border-primary/30 transition-colors">
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
              <div className="w-3.5 h-3.5 rounded-sm border-2 border-primary peer-checked:bg-primary peer-checked:border-primary transition-colors flex items-center justify-center">
                {filterOrderBeforeRegistration && (
                  <Icon
                    name="Check"
                    size={6}
                    className="text-background w-2 h-2"
                  />
                )}
              </div>
            </div>
            <label
              htmlFor="orderBeforeReg"
              className="flex items-center gap-1 cursor-pointer"
            >
              <Icon
                name="ClipboardCheck"
                size={8}
                className="text-primary w-2.5 h-2.5"
              />
              <span className="text-xs font-medium text-foreground">
                Заказ до регистрации
              </span>
            </label>
          </div>

          <div className="flex items-center space-x-1 p-1.5 bg-background/50 rounded-md border border-border hover:border-primary/30 transition-colors">
            <div className="relative">
              <input
                type="checkbox"
                id="supports1C"
                checked={filter1C}
                onChange={(e) => setFilter1C(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-3.5 h-3.5 rounded-sm border-2 border-primary peer-checked:bg-primary peer-checked:border-primary transition-colors flex items-center justify-center">
                {filter1C && (
                  <Icon
                    name="Check"
                    size={6}
                    className="text-background w-2 h-2"
                  />
                )}
              </div>
            </div>
            <label
              htmlFor="supports1C"
              className="flex items-center gap-1 cursor-pointer"
            >
              <Icon
                name="Database"
                size={8}
                className="text-primary w-2.5 h-2.5"
              />
              <span className="text-xs font-medium text-foreground">1С</span>
            </label>
          </div>

          <div className="flex items-center space-x-1 p-1.5 bg-background/50 rounded-md border border-border hover:border-primary/30 transition-colors">
            <div className="relative">
              <input
                type="checkbox"
                id="supportsAI"
                checked={filterAI}
                onChange={(e) => setFilterAI(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-3.5 h-3.5 rounded-sm border-2 border-primary peer-checked:bg-primary peer-checked:border-primary transition-colors flex items-center justify-center">
                {filterAI && (
                  <Icon
                    name="Check"
                    size={6}
                    className="text-background w-2 h-2"
                  />
                )}
              </div>
            </div>
            <label
              htmlFor="supportsAI"
              className="flex items-center gap-1 cursor-pointer"
            >
              <Icon name="Cpu" size={8} className="text-primary w-2.5 h-2.5" />
              <span className="text-xs font-medium text-foreground">AI</span>
            </label>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-2">
          <MultiSelect
            value={filterLocation}
            onChange={(value) =>
              handleMultiSelectChange(value, filterLocation, setFilterLocation)
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
              handleMultiSelectChange(value, filterDiskType, setFilterDiskType)
            }
            options={allDiskTypes}
            placeholder={t("filters.anyDisk")}
            iconName="Database"
            dropdownKey="diskType"
            labelText={t("filters.diskType")}
          />

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

          <AdditionalServicesDropdown />
          <RegistrationDataDropdown />
          <ClientTypeDropdown />
        </div>

        <div className="space-y-2 p-2 bg-background/50 rounded-md border border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Icon
                name="Server"
                size={8}
                className="text-primary w-2.5 h-2.5"
              />
              <h4 className="text-xs font-bold text-foreground">
                {t("filters.minDatacenters")}
              </h4>
            </div>
            <span className="text-xs font-bold text-primary">
              {datacentersValue > 0
                ? `${datacentersValue}`
                : t("filters.anyAmount")}
            </span>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {popularValues.map((value) => (
              <Button
                key={value}
                type="button"
                variant={datacentersValue === value ? "default" : "outline"}
                size="sm"
                onClick={() => handleDatacentersChange(value)}
                className="text-xs h-6 px-2 min-w-[40px]"
              >
                {value === 0 ? t("filters.anyAmount") : value}
              </Button>
            ))}
          </div>

          <div className="space-y-1.5">
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
  );
};
