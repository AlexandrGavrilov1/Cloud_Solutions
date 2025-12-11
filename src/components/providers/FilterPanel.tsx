import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";
import { useLanguage } from "@/contexts/LanguageContext";
import { useState } from "react";

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
}: FilterPanelProps) => {
  const { t } = useLanguage();
  const [isExpanded, setIsExpanded] = useState(false);

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

  // Подсчет количества активных фильтров
  const activeFiltersCount = [
    filterFZ152,
    filterFSTEK,
    filterTrialPeriod,
    filterLocation,
    filterVirtualization,
    filterMinDatacenters !== null,
    filterDiskType,
    filterPaymentMethod,
    filterOS,
    filterCPU,
  ].filter(Boolean).length;

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

  const popularValues = [0, 1, 3, 5, 10, 15];

  return (
    <div className="relative">
      {/* Кнопка фильтров - всегда одного размера */}
      <div className="w-full max-w-[100px] sm:max-w-[120px] md:max-w-[151px]">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full px-2 py-1.5 sm:px-2.5 sm:py-2 flex items-center justify-between hover:bg-primary/5 transition-colors rounded-xl bg-card border border-primary/20 shadow-md"
        >
          <div className="flex items-center gap-1.5 sm:gap-2">
            <div className="w-5 h-5 sm:w-6 sm:h-6 bg-primary/20 rounded-lg flex items-center justify-center relative">
              <Icon
                name="Filter"
                size={10}
                className="text-primary w-3 h-3 sm:w-3.5 sm:h-3.5"
              />

              {/* Бейдж с счетчиком активных фильтров */}
              {activeFiltersCount > 0 && (
                <div className="absolute -top-1 -right-1 bg-primary text-background text-[8px] sm:text-[9px] font-bold rounded-full w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center border-2 border-card">
                  {activeFiltersCount}
                </div>
              )}
            </div>
            <h3 className="text-xs sm:text-sm font-bold text-foreground">
              Фильтры
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

      {/* Выпадающая панель фильтров - адаптивная ширина */}
      {isExpanded && (
        <div className="absolute top-full left-0 mt-2 w-[calc(100vw-2rem)] max-w-[500px] sm:max-w-[450px] md:max-w-[1000px] bg-card border border-primary/20 rounded-xl shadow-md z-50">
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
            {/* Чекбоксы для булевых фильтров */}
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

              <div className="flex items-center space-x-1.5 p-2 bg-background/50 rounded-lg border border-border hover:border-primary/30 transition-colors">
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
                        size={8}
                        className="text-background w-2.5 h-2.5"
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
                    size={10}
                    className="text-primary w-3 h-3"
                  />
                  <span className="text-xs font-medium text-foreground">
                    ФСТЕК
                  </span>
                </label>
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
            </div>

            {/* Выпадающие списки */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Локация */}
              <div className="group">
                <label className="text-sm font-bold text-foreground mb-2 flex items-center gap-2">
                  <Icon
                    name="MapPin"
                    size={10}
                    className="text-primary w-3 h-3"
                  />
                  <span className="text-xs">
                    {t("filters.datacenterLocation")}
                  </span>
                </label>
                <div className="relative">
                  <div className="absolute left-2 top-1/2 -translate-y-1/2 pointer-events-none">
                    <Icon
                      name="Globe"
                      size={10}
                      className="text-primary w-3 h-3"
                    />
                  </div>
                  <select
                    className="w-full h-8 rounded-lg border border-input bg-background text-foreground text-sm font-medium appearance-none cursor-pointer hover:border-primary/50 hover:shadow-sm focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all pl-8 pr-7"
                    value={filterLocation || ""}
                    onChange={(e) => setFilterLocation(e.target.value || null)}
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
                    size={10}
                    className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground w-3 h-3"
                  />
                </div>
              </div>

              {/* Виртуализация */}
              <div className="group">
                <label className="text-sm font-bold text-foreground mb-2 flex items-center gap-2">
                  <Icon
                    name="Boxes"
                    size={10}
                    className="text-primary w-3 h-3"
                  />
                  <span className="text-xs">{t("common.virtualization")}</span>
                </label>
                <div className="relative">
                  <div className="absolute left-2 top-1/2 -translate-y-1/2 pointer-events-none">
                    <Icon
                      name="Box"
                      size={10}
                      className="text-primary w-3 h-3"
                    />
                  </div>
                  <select
                    className="w-full h-8 rounded-lg border border-input bg-background text-foreground text-sm font-medium appearance-none cursor-pointer hover:border-primary/50 hover:shadow-sm focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all pl-8 pr-7"
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
                    size={10}
                    className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground w-3 h-3"
                  />
                </div>
              </div>

              {/* Тип диска */}
              <div className="group">
                <label className="text-sm font-bold text-foreground mb-2 flex items-center gap-2">
                  <Icon
                    name="HardDrive"
                    size={10}
                    className="text-primary w-3 h-3"
                  />
                  <span className="text-xs">{t("filters.diskType")}</span>
                </label>
                <div className="relative">
                  <div className="absolute left-2 top-1/2 -translate-y-1/2 pointer-events-none">
                    <Icon
                      name="Database"
                      size={10}
                      className="text-primary w-3 h-3"
                    />
                  </div>
                  <select
                    className="w-full h-8 rounded-lg border border-input bg-background text-foreground text-sm font-medium appearance-none cursor-pointer hover:border-primary/50 hover:shadow-sm focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all pl-8 pr-7"
                    value={filterDiskType || ""}
                    onChange={(e) => setFilterDiskType(e.target.value || null)}
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
                    size={10}
                    className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground w-3 h-3"
                  />
                </div>
              </div>

              {/* Метод оплаты */}
              <div className="group">
                <label className="text-sm font-bold text-foreground mb-2 flex items-center gap-2">
                  <Icon
                    name="CreditCard"
                    size={10}
                    className="text-primary w-3 h-3"
                  />
                  <span className="text-xs">{t("filters.paymentMethod")}</span>
                </label>
                <div className="relative">
                  <div className="absolute left-2 top-1/2 -translate-y-1/2 pointer-events-none">
                    <Icon
                      name="Wallet"
                      size={10}
                      className="text-primary w-3 h-3"
                    />
                  </div>
                  <select
                    className="w-full h-8 rounded-lg border border-input bg-background text-foreground text-sm font-medium appearance-none cursor-pointer hover:border-primary/50 hover:shadow-sm focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all pl-8 pr-7"
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
                    size={10}
                    className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground w-3 h-3"
                  />
                </div>
              </div>

              {/* Операционная система */}
              <div className="group">
                <label className="text-sm font-bold text-foreground mb-2 flex items-center gap-2">
                  <Icon
                    name="Monitor"
                    size={10}
                    className="text-primary w-3 h-3"
                  />
                  <span className="text-xs">
                    {t("filters.operatingSystem")}
                  </span>
                </label>
                <div className="relative">
                  <div className="absolute left-2 top-1/2 -translate-y-1/2 pointer-events-none">
                    <Icon
                      name="Terminal"
                      size={10}
                      className="text-primary w-3 h-3"
                    />
                  </div>
                  <select
                    className="w-full h-8 rounded-lg border border-input bg-background text-foreground text-sm font-medium appearance-none cursor-pointer hover:border-primary/50 hover:shadow-sm focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all pl-8 pr-7"
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
                    size={10}
                    className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground w-3 h-3"
                  />
                </div>
              </div>

              {/* Процессор */}
              <div className="group">
                <label className="text-sm font-bold text-foreground mb-2 flex items-center gap-2">
                  <Icon name="Cpu" size={10} className="text-primary w-3 h-3" />
                  <span className="text-xs">Процессор</span>
                </label>
                <div className="relative">
                  <div className="absolute left-2 top-1/2 -translate-y-1/2 pointer-events-none">
                    <Icon
                      name="Cpu"
                      size={10}
                      className="text-primary w-3 h-3"
                    />
                  </div>
                  <select
                    className="w-full h-8 rounded-lg border border-input bg-background text-foreground text-sm font-medium appearance-none cursor-pointer hover:border-primary/50 hover:shadow-sm focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all pl-8 pr-7"
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
                    size={10}
                    className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground w-3 h-3"
                  />
                </div>
              </div>
            </div>

            {/* Ползунок для минимального количества дата-центров */}
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

              {/* Кнопки с популярными значениями */}
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
                <input
                  type="range"
                  min="0"
                  max="15"
                  step="1"
                  value={datacentersValue}
                  onChange={(e) =>
                    handleDatacentersChange(parseInt(e.target.value))
                  }
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-background"
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
