import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";
import { useLanguage } from "@/contexts/LanguageContext";
import { useState, useRef, useEffect } from "react";

interface FilterPanelProps {
  filterFZ152: boolean;
  setFilterFZ152: (value: boolean) => void;
  filterFSTEK: boolean;
  setFilterFSTEK: (value: boolean) => void;
  filterTrialPeriod: boolean;
  setFilterTrialPeriod: (value: boolean) => void;
  filterLocation: string | null;
  setFilterLocation: (value: string | null) => void;
  filterVirtualization: string | null;
  setFilterVirtualization: (value: string | null) => void;
  filterMinDatacenters: number | null;
  setFilterMinDatacenters: (value: number | null) => void;
  filterDiskType: string | null;
  setFilterDiskType: (value: string | null) => void;
  filterPaymentMethod: string | null;
  setFilterPaymentMethod: (value: string | null) => void;
  filterOS: string | null;
  setFilterOS: (value: string | null) => void;
  filterCPU: string | null;
  setFilterCPU: (value: string | null) => void;
  allLocations: string[];
  allVirtualizations: string[];
  allDiskTypes: string[];
  allPaymentMethods: string[];
  allOS: string[];
  allCPUs: string[];
  filteredCount: number;
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
  allLocations,
  allVirtualizations,
  allDiskTypes,
  allPaymentMethods,
  allOS,
  allCPUs,
  filteredCount,
}: FilterPanelProps) => {
  const { t } = useLanguage();
  const [isExpanded, setIsExpanded] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const hasActiveFilters =
    filterFZ152 ||
    filterFSTEK ||
    filterTrialPeriod ||
    filterLocation ||
    filterVirtualization ||
    filterMinDatacenters !== null ||
    filterDiskType ||
    filterPaymentMethod ||
    filterOS ||
    filterCPU;

  const clearFilters = () => {
    setFilterFZ152(false);
    setFilterFSTEK(false);
    setFilterTrialPeriod(false);
    setFilterLocation(null);
    setFilterVirtualization(null);
    setFilterMinDatacenters(null);
    setFilterDiskType(null);
    setFilterPaymentMethod(null);
    setFilterOS(null);
    setFilterCPU(null);
  };

  const [datacentersValue, setDatacentersValue] = useState(
    filterMinDatacenters || 0,
  );

  const handleDatacentersChange = (value: number) => {
    setDatacentersValue(value);
    setFilterMinDatacenters(value > 0 ? value : null);
  };

  // Популярные значения для кнопок
  const popularValues = [0, 1, 3, 5, 10, 15];

  // Закрытие панели при клике вне её
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        panelRef.current &&
        !panelRef.current.contains(event.target as Node) &&
        isExpanded
      ) {
        setIsExpanded(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isExpanded]);

  return (
    <div
      className={`relative ${isExpanded ? "w-full" : "inline-block"}`}
      ref={panelRef}
    >
      {/* Кнопка фильтра - занимает всю ширину только при раскрытии */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={`flex items-center justify-between hover:bg-primary/5 transition-colors rounded-2xl bg-card border border-primary/20 shadow-lg ${
          isExpanded
            ? "w-full px-4 py-3"
            : "inline-flex items-center gap-3 px-4 py-3 whitespace-nowrap"
        }`}
      >
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 sm:w-8 sm:h-8 bg-primary/20 rounded-xl flex items-center justify-center shrink-0">
            <Icon
              name="Filter"
              size={14}
              className="text-primary sm:w-4 sm:h-4"
            />
          </div>
          <div
            className={`flex flex-col items-start ${!isExpanded && "hidden sm:flex"}`}
          >
            <h3 className="text-base sm:text-lg font-bold text-foreground leading-tight">
              Фильтры
            </h3>
            {hasActiveFilters && !isExpanded && (
              <span className="text-[10px] text-muted-foreground mt-0.5">
                Активные фильтры
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2 ml-2">
          {hasActiveFilters && !isExpanded && (
            <div className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse"></div>
          )}
          <Icon
            name={isExpanded ? "ChevronUp" : "ChevronDown"}
            size={20}
            className="text-muted-foreground transition-transform"
          />
        </div>
      </button>

      {/* Абсолютно позиционированная панель фильтров */}
      {isExpanded && (
        <div
          className="absolute top-full left-0 right-0 mt-2 z-50 bg-card border border-primary/20 rounded-2xl shadow-xl overflow-hidden"
          style={{
            maxHeight: "calc(100vh - 200px)",
            overflowY: "auto",
          }}
        >
          <div className="p-4 sm:p-5" ref={contentRef}>
            {/* Счётчик и кнопка сброса */}
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-border">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Icon name="Filter" size={16} className="text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-foreground">Фильтры</h3>
                  <p className="text-xs text-muted-foreground">
                    {filteredCount} результатов
                  </p>
                </div>
              </div>

              {hasActiveFilters && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearFilters}
                  className="text-[10px] font-bold hover:bg-destructive hover:text-destructive-foreground hover:border-destructive transition-all shadow hover:shadow-sm h-7 px-2"
                >
                  <Icon name="X" size={10} className="mr-1" />
                  {t("filters.resetAll")}
                </Button>
              )}
            </div>

            {/* Контент фильтров */}
            <div className="space-y-4">
              {/* Чекбоксы для булевых фильтров */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                <div className="flex items-center space-x-2 p-2 bg-background/50 rounded-lg border border-border hover:border-primary/30 transition-colors">
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
                          size={10}
                          className="text-background"
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
                      size={14}
                      className="text-primary"
                    />
                    <span className="text-sm font-medium text-foreground">
                      152-ФЗ
                    </span>
                  </label>
                </div>

                <div className="flex items-center space-x-2 p-2 bg-background/50 rounded-lg border border-border hover:border-primary/30 transition-colors">
                  <div className="relative">
                    <input
                      type="checkbox"
                      id="fstek"
                      checked={filterFSTEK}
                      onChange={(e) => setFilterFSTEK(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-4 h-4 rounded-sm border-2 border-primary peer-checked:bg-primary peer-checked:border-primary transition-colors flex items-center justify-center">
                      {filterFSTEK && (
                        <Icon
                          name="Check"
                          size={10}
                          className="text-background"
                        />
                      )}
                    </div>
                  </div>
                  <label
                    htmlFor="fstek"
                    className="flex items-center gap-1.5 cursor-pointer"
                  >
                    <Icon
                      name="ShieldAlert"
                      size={14}
                      className="text-primary"
                    />
                    <span className="text-sm font-medium text-foreground">
                      ФСТЕК
                    </span>
                  </label>
                </div>

                <div className="flex items-center space-x-2 p-2 bg-background/50 rounded-lg border border-border hover:border-primary/30 transition-colors">
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
                          size={10}
                          className="text-background"
                        />
                      )}
                    </div>
                  </div>
                  <label
                    htmlFor="trial"
                    className="flex items-center gap-1.5 cursor-pointer"
                  >
                    <Icon name="Gift" size={14} className="text-primary" />
                    <span className="text-sm font-medium text-foreground">
                      {t("filters.trialPeriod")}
                    </span>
                  </label>
                </div>
              </div>

              {/* Выпадающие списки */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {/* Локация */}
                <div className="group">
                  <label className="text-xs font-bold text-foreground mb-1.5 flex items-center gap-1.5">
                    <Icon name="MapPin" size={14} className="text-primary" />
                    {t("filters.datacenterLocation")}
                  </label>
                  <div className="relative">
                    <div className="absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none">
                      <Icon name="Globe" size={14} className="text-primary" />
                    </div>
                    <select
                      className="w-full h-9 rounded-lg border border-input bg-background text-foreground text-xs font-medium appearance-none cursor-pointer hover:border-primary/50 hover:shadow-sm focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all pl-9 pr-8"
                      value={filterLocation || ""}
                      onChange={(e) =>
                        setFilterLocation(e.target.value || null)
                      }
                    >
                      <option value="">{t("filters.anyLocation")}</option>
                      {allLocations.map((loc) => (
                        <option key={loc} value={loc}>
                          {loc}
                        </option>
                      ))}
                    </select>
                    <Icon
                      name="ChevronDown"
                      size={14}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground"
                    />
                  </div>
                </div>

                {/* Виртуализация */}
                <div className="group">
                  <label className="text-xs font-bold text-foreground mb-1.5 flex items-center gap-1.5">
                    <Icon name="Boxes" size={14} className="text-primary" />
                    {t("common.virtualization")}
                  </label>
                  <div className="relative">
                    <div className="absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none">
                      <Icon name="Box" size={14} className="text-primary" />
                    </div>
                    <select
                      className="w-full h-9 rounded-lg border border-input bg-background text-foreground text-xs font-medium appearance-none cursor-pointer hover:border-primary/50 hover:shadow-sm focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all pl-9 pr-8"
                      value={filterVirtualization || ""}
                      onChange={(e) =>
                        setFilterVirtualization(e.target.value || null)
                      }
                    >
                      <option value="">{t("filters.anyDisk")}</option>
                      {allVirtualizations.map((virt) => (
                        <option key={virt} value={virt}>
                          {virt}
                        </option>
                      ))}
                    </select>
                    <Icon
                      name="ChevronDown"
                      size={14}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground"
                    />
                  </div>
                </div>

                {/* Тип диска */}
                <div className="group">
                  <label className="text-xs font-bold text-foreground mb-1.5 flex items-center gap-1.5">
                    <Icon name="HardDrive" size={14} className="text-primary" />
                    {t("filters.diskType")}
                  </label>
                  <div className="relative">
                    <div className="absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none">
                      <Icon
                        name="Database"
                        size={14}
                        className="text-primary"
                      />
                    </div>
                    <select
                      className="w-full h-9 rounded-lg border border-input bg-background text-foreground text-xs font-medium appearance-none cursor-pointer hover:border-primary/50 hover:shadow-sm focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all pl-9 pr-8"
                      value={filterDiskType || ""}
                      onChange={(e) =>
                        setFilterDiskType(e.target.value || null)
                      }
                    >
                      <option value="">{t("filters.anyDisk")}</option>
                      {allDiskTypes.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                    <Icon
                      name="ChevronDown"
                      size={14}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground"
                    />
                  </div>
                </div>

                {/* Метод оплаты */}
                <div className="group">
                  <label className="text-xs font-bold text-foreground mb-1.5 flex items-center gap-1.5">
                    <Icon
                      name="CreditCard"
                      size={14}
                      className="text-primary"
                    />
                    {t("filters.paymentMethod")}
                  </label>
                  <div className="relative">
                    <div className="absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none">
                      <Icon name="Wallet" size={14} className="text-primary" />
                    </div>
                    <select
                      className="w-full h-9 rounded-lg border border-input bg-background text-foreground text-xs font-medium appearance-none cursor-pointer hover:border-primary/50 hover:shadow-sm focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all pl-9 pr-8"
                      value={filterPaymentMethod || ""}
                      onChange={(e) =>
                        setFilterPaymentMethod(e.target.value || null)
                      }
                    >
                      <option value="">{t("filters.anyMethod")}</option>
                      {allPaymentMethods.map((method) => (
                        <option key={method} value={method}>
                          {method}
                        </option>
                      ))}
                    </select>
                    <Icon
                      name="ChevronDown"
                      size={14}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground"
                    />
                  </div>
                </div>

                {/* Операционная система */}
                <div className="group">
                  <label className="text-xs font-bold text-foreground mb-1.5 flex items-center gap-1.5">
                    <Icon name="Monitor" size={14} className="text-primary" />
                    {t("filters.operatingSystem")}
                  </label>
                  <div className="relative">
                    <div className="absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none">
                      <Icon
                        name="Terminal"
                        size={14}
                        className="text-primary"
                      />
                    </div>
                    <select
                      className="w-full h-9 rounded-lg border border-input bg-background text-foreground text-xs font-medium appearance-none cursor-pointer hover:border-primary/50 hover:shadow-sm focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all pl-9 pr-8"
                      value={filterOS || ""}
                      onChange={(e) => setFilterOS(e.target.value || null)}
                    >
                      <option value="">{t("filters.anyOS")}</option>
                      {allOS.map((os) => (
                        <option key={os} value={os}>
                          {os}
                        </option>
                      ))}
                    </select>
                    <Icon
                      name="ChevronDown"
                      size={14}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground"
                    />
                  </div>
                </div>

                {/* Процессор */}
                <div className="group">
                  <label className="text-xs font-bold text-foreground mb-1.5 flex items-center gap-1.5">
                    <Icon name="Cpu" size={14} className="text-primary" />
                    Процессор
                  </label>
                  <div className="relative">
                    <div className="absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none">
                      <Icon name="Cpu" size={14} className="text-primary" />
                    </div>
                    <select
                      className="w-full h-9 rounded-lg border border-input bg-background text-foreground text-xs font-medium appearance-none cursor-pointer hover:border-primary/50 hover:shadow-sm focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all pl-9 pr-8"
                      value={filterCPU || ""}
                      onChange={(e) => setFilterCPU(e.target.value || null)}
                    >
                      <option value="">Любой процессор</option>
                      {allCPUs.map((cpu) => (
                        <option key={cpu} value={cpu}>
                          {cpu}
                        </option>
                      ))}
                    </select>
                    <Icon
                      name="ChevronDown"
                      size={14}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground"
                    />
                  </div>
                </div>
              </div>

              {/* Ползунок для минимального количества дата-центров */}
              <div className="space-y-3 p-3 bg-background/50 rounded-lg border border-border">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Icon name="Server" size={14} className="text-primary" />
                    <h4 className="text-sm font-bold text-foreground">
                      {t("filters.minDatacenters")}
                    </h4>
                  </div>
                  <span className="text-base font-bold text-primary">
                    {datacentersValue > 0
                      ? `${datacentersValue}`
                      : t("filters.anyAmount")}
                  </span>
                </div>

                {/* Кнопки с популярными значениями */}
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {popularValues.map((value) => (
                    <Button
                      key={value}
                      type="button"
                      variant={
                        datacentersValue === value ? "default" : "outline"
                      }
                      size="sm"
                      onClick={() => handleDatacentersChange(value)}
                      className="text-[10px] h-6 px-2 min-w-[45px] flex items-center justify-center"
                    >
                      {value === 0 ? t("filters.anyAmount") : value}
                    </Button>
                  ))}
                </div>

                <div className="space-y-1.5">
                  <input
                    type="range"
                    min="0"
                    max="15"
                    step="1"
                    value={datacentersValue}
                    onChange={(e) =>
                      handleDatacentersChange(parseInt(e.target.value))
                    }
                    className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-background [&::-webkit-slider-thumb]:shadow"
                  />

                  <div className="flex justify-between text-[10px] text-muted-foreground px-0.5">
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
        </div>
      )}
    </div>
  );
};
