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

  const popularValues = [0, 1, 3, 5, 10, 15];

  return (
    <div
      className={`bg-card border border-primary/20 rounded-xl shadow-md mb-2 sm:mb-3 relative overflow-hidden transition-all duration-700 ease-in-out ${isExpanded ? "max-w-full" : "max-w-[180px] sm:max-w-[200px]"}`}
    >
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-3 py-2.5 flex items-center justify-between hover:bg-primary/5 transition-colors rounded-xl"
      >
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 sm:w-7 sm:h-7 bg-primary/20 rounded-lg flex items-center justify-center">
            <Icon
              name="Filter"
              size={12}
              className="text-primary sm:w-4 sm:h-4"
            />
          </div>
          <h3 className="text-sm sm:text-base font-bold text-foreground">
            Фильтры
          </h3>
        </div>
        <div className="flex items-center gap-1">
          <Icon
            name={isExpanded ? "ChevronUp" : "ChevronDown"}
            size={16}
            className="text-muted-foreground transition-transform"
          />
        </div>
      </button>

      {hasActiveFilters && (
        <div className="flex items-center justify-end px-3 pb-1">
          <Button
            variant="outline"
            size="sm"
            onClick={clearFilters}
            className="text-[9px] sm:text-[10px] font-bold hover:bg-destructive hover:text-destructive-foreground hover:border-destructive transition-all shadow hover:shadow-sm h-6 sm:h-7 px-1.5 sm:px-2"
          >
            <Icon name="X" size={10} className="sm:mr-1" />
            <span className="hidden sm:inline">{t("filters.resetAll")}</span>
          </Button>
        </div>
      )}

      {isExpanded && (
        <div className="space-y-4 sm:space-y-5 px-3 pb-4">
          {/* Чекбоксы для булевых фильтров */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
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
                    <Icon name="Check" size={10} className="text-background" />
                  )}
                </div>
              </div>
              <label
                htmlFor="fz152"
                className="flex items-center gap-1.5 cursor-pointer"
              >
                <Icon name="ShieldCheck" size={12} className="text-primary" />
                <span className="text-xs sm:text-sm font-medium text-foreground">
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
                    <Icon name="Check" size={10} className="text-background" />
                  )}
                </div>
              </div>
              <label
                htmlFor="fstek"
                className="flex items-center gap-1.5 cursor-pointer"
              >
                <Icon name="ShieldAlert" size={12} className="text-primary" />
                <span className="text-xs sm:text-sm font-medium text-foreground">
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
                    <Icon name="Check" size={10} className="text-background" />
                  )}
                </div>
              </div>
              <label
                htmlFor="trial"
                className="flex items-center gap-1.5 cursor-pointer"
              >
                <Icon name="Gift" size={12} className="text-primary" />
                <span className="text-xs sm:text-sm font-medium text-foreground">
                  {t("filters.trialPeriod")}
                </span>
              </label>
            </div>
          </div>

          {/* Выпадающие списки */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {/* Локация */}
            <div className="group">
              <label className="text-xs sm:text-sm font-bold text-foreground mb-1.5 flex items-center gap-1.5">
                <Icon name="MapPin" size={12} className="text-primary" />
                {t("filters.datacenterLocation")}
              </label>
              <div className="relative">
                <div className="absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none">
                  <Icon name="Globe" size={12} className="text-primary" />
                </div>
                <select
                  className="w-full h-8 rounded-lg border border-input bg-background text-foreground text-xs font-medium appearance-none cursor-pointer hover:border-primary/50 hover:shadow-sm focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all pl-8 pr-7"
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
                  size={12}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground"
                />
              </div>
            </div>

            {/* Виртуализация */}
            <div className="group">
              <label className="text-xs sm:text-sm font-bold text-foreground mb-1.5 flex items-center gap-1.5">
                <Icon name="Boxes" size={12} className="text-primary" />
                {t("common.virtualization")}
              </label>
              <div className="relative">
                <div className="absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none">
                  <Icon name="Box" size={12} className="text-primary" />
                </div>
                <select
                  className="w-full h-8 rounded-lg border border-input bg-background text-foreground text-xs font-medium appearance-none cursor-pointer hover:border-primary/50 hover:shadow-sm focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all pl-8 pr-7"
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
                  size={12}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground"
                />
              </div>
            </div>

            {/* Тип диска */}
            <div className="group">
              <label className="text-xs sm:text-sm font-bold text-foreground mb-1.5 flex items-center gap-1.5">
                <Icon name="HardDrive" size={12} className="text-primary" />
                {t("filters.diskType")}
              </label>
              <div className="relative">
                <div className="absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none">
                  <Icon name="Database" size={12} className="text-primary" />
                </div>
                <select
                  className="w-full h-8 rounded-lg border border-input bg-background text-foreground text-xs font-medium appearance-none cursor-pointer hover:border-primary/50 hover:shadow-sm focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all pl-8 pr-7"
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
                  size={12}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground"
                />
              </div>
            </div>

            {/* Метод оплаты */}
            <div className="group">
              <label className="text-xs sm:text-sm font-bold text-foreground mb-1.5 flex items-center gap-1.5">
                <Icon name="CreditCard" size={12} className="text-primary" />
                {t("filters.paymentMethod")}
              </label>
              <div className="relative">
                <div className="absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none">
                  <Icon name="Wallet" size={12} className="text-primary" />
                </div>
                <select
                  className="w-full h-8 rounded-lg border border-input bg-background text-foreground text-xs font-medium appearance-none cursor-pointer hover:border-primary/50 hover:shadow-sm focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all pl-8 pr-7"
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
                  size={12}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground"
                />
              </div>
            </div>

            {/* Операционная система */}
            <div className="group">
              <label className="text-xs sm:text-sm font-bold text-foreground mb-1.5 flex items-center gap-1.5">
                <Icon name="Monitor" size={12} className="text-primary" />
                {t("filters.operatingSystem")}
              </label>
              <div className="relative">
                <div className="absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none">
                  <Icon name="Terminal" size={12} className="text-primary" />
                </div>
                <select
                  className="w-full h-8 rounded-lg border border-input bg-background text-foreground text-xs font-medium appearance-none cursor-pointer hover:border-primary/50 hover:shadow-sm focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all pl-8 pr-7"
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
                  size={12}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground"
                />
              </div>
            </div>

            {/* Процессор */}
            <div className="group">
              <label className="text-xs sm:text-sm font-bold text-foreground mb-1.5 flex items-center gap-1.5">
                <Icon name="Cpu" size={12} className="text-primary" />
                Процессор
              </label>
              <div className="relative">
                <div className="absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none">
                  <Icon name="Cpu" size={12} className="text-primary" />
                </div>
                <select
                  className="w-full h-8 rounded-lg border border-input bg-background text-foreground text-xs font-medium appearance-none cursor-pointer hover:border-primary/50 hover:shadow-sm focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all pl-8 pr-7"
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
                  size={12}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground"
                />
              </div>
            </div>
          </div>

          {/* Ползунок для минимального количества дата-центров */}
          <div className="space-y-2 p-2.5 bg-background/50 rounded-lg border border-border">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5">
                <Icon name="Server" size={12} className="text-primary" />
                <h4 className="text-xs sm:text-sm font-bold text-foreground">
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
            <div className="flex flex-wrap gap-1 mb-2">
              {popularValues.map((value) => (
                <Button
                  key={value}
                  type="button"
                  variant={datacentersValue === value ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleDatacentersChange(value)}
                  className="text-[9px] h-6 px-2 min-w-[40px] flex items-center justify-center"
                >
                  {value === 0 ? t("filters.anyAmount") : value}
                </Button>
              ))}
            </div>

            <div className="space-y-1">
              <input
                type="range"
                min="0"
                max="15"
                step="1"
                value={datacentersValue}
                onChange={(e) =>
                  handleDatacentersChange(parseInt(e.target.value))
                }
                className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-background [&::-webkit-slider-thumb]:shadow-sm"
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
      )}
    </div>
  );
};
