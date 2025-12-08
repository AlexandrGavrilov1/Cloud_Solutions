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
  sortBy: "rating" | "price";
  setSortBy: (value: "rating" | "price") => void;
  allLocations: string[];
  allVirtualizations: string[];
  allDiskTypes: string[];
  allPaymentMethods: string[];
  allOS: string[];
  allCPUs: string[];
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  filteredCount: number;
  compact?: boolean;
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
  sortBy,
  setSortBy,
  allLocations,
  allVirtualizations,
  allDiskTypes,
  allPaymentMethods,
  allOS,
  allCPUs,
  searchQuery,
  setSearchQuery,
  filteredCount,
  compact = false,
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
    filterCPU ||
    searchQuery;

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
    setSortBy("rating");
    setSearchQuery("");
  };

  return (
    <div
      className={`bg-card border border-primary/20 rounded-2xl shadow-lg mb-3 sm:mb-4 relative overflow-hidden transition-all duration-700 ease-in-out ${isExpanded ? "max-w-full" : "max-w-[190px] sm:max-w-[230px]"}`}
    >
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-6 py-4 flex items-center justify-between hover:bg-primary/5 transition-colors rounded-2xl"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-primary/20 rounded-xl flex items-center justify-center">
            <Icon
              name="Filter"
              size={16}
              className="text-primary sm:w-5 sm:h-5"
            />
          </div>
          <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-foreground">
            Фильтры
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <Icon
            name={isExpanded ? "ChevronUp" : "ChevronDown"}
            size={24}
            className="text-muted-foreground transition-transform"
          />
        </div>
      </button>

      {hasActiveFilters && (
        <div className="flex items-center justify-end px-6 pb-2">
          <Button
            variant="outline"
            size="sm"
            onClick={clearFilters}
            className="text-[10px] sm:text-xs font-bold hover:bg-destructive hover:text-destructive-foreground hover:border-destructive transition-all shadow-lg hover:shadow-xl h-8 sm:h-9 px-2 sm:px-3"
          >
            <Icon name="X" size={12} className="sm:mr-1" />
            <span className="hidden sm:inline">{t("filters.resetAll")}</span>
          </Button>
        </div>
      )}

      {isExpanded && (
        <div className="space-y-5 sm:space-y-6 px-6 pb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5">
            <div className="group">
              <label className="text-xs sm:text-sm font-bold text-foreground mb-2 sm:mb-3 flex items-center gap-1.5 sm:gap-2">
                <Icon
                  name="ShieldCheck"
                  size={14}
                  className="text-primary sm:w-4 sm:h-4"
                />
                {t("filters.fz152Compliance")}
              </label>
              <Button
                variant={filterFZ152 ? "default" : "outline"}
                className={`w-full justify-start h-10 sm:h-11 md:h-12 rounded-xl font-semibold transition-all text-xs sm:text-sm ${
                  filterFZ152
                    ? "shadow-lg shadow-primary/30 scale-[1.02]"
                    : "hover:scale-[1.02] hover:shadow-md hover:border-primary/50"
                }`}
                onClick={() => setFilterFZ152(!filterFZ152)}
              >
                <div
                  className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center mr-1.5 sm:mr-2 flex-shrink-0 ${
                    filterFZ152 ? "bg-background/20" : "bg-primary/10"
                  }`}
                >
                  <Icon
                    name="ShieldCheck"
                    size={16}
                    className={filterFZ152 ? "text-background" : "text-primary"}
                  />
                </div>
                <span className="truncate">
                  {filterFZ152
                    ? t("filters.onlyWithFz152")
                    : t("filters.allProviders")}
                </span>
              </Button>
            </div>

            <div className="group">
              <label className="text-xs sm:text-sm font-bold text-foreground mb-2 sm:mb-3 flex items-center gap-1.5 sm:gap-2">
                <Icon
                  name="ShieldAlert"
                  size={14}
                  className="text-primary sm:w-4 sm:h-4"
                />
                ФСТЕК
              </label>
              <Button
                variant={filterFSTEK ? "default" : "outline"}
                className={`w-full justify-start h-10 sm:h-11 md:h-12 rounded-xl font-semibold transition-all text-xs sm:text-sm ${
                  filterFSTEK
                    ? "shadow-lg shadow-primary/30 scale-[1.02]"
                    : "hover:scale-[1.02] hover:shadow-md hover:border-primary/50"
                }`}
                onClick={() => setFilterFSTEK(!filterFSTEK)}
              >
                <div
                  className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center mr-1.5 sm:mr-2 flex-shrink-0 ${
                    filterFSTEK ? "bg-background/20" : "bg-primary/10"
                  }`}
                >
                  <Icon
                    name="ShieldAlert"
                    size={16}
                    className={filterFSTEK ? "text-background" : "text-primary"}
                  />
                </div>
                <span className="truncate">
                  {filterFSTEK ? "С ФСТЕК" : "Все провайдеры"}
                </span>
              </Button>
            </div>

            <div className="group">
              <label className="text-xs sm:text-sm font-bold text-foreground mb-2 sm:mb-3 flex items-center gap-1.5 sm:gap-2">
                <Icon
                  name="Gift"
                  size={14}
                  className="text-primary sm:w-4 sm:h-4"
                />
                {t("filters.trialPeriod")}
              </label>
              <Button
                variant={filterTrialPeriod ? "default" : "outline"}
                className={`w-full justify-start h-10 sm:h-11 md:h-12 rounded-xl font-semibold transition-all text-xs sm:text-sm ${
                  filterTrialPeriod
                    ? "shadow-lg shadow-primary/30 scale-[1.02]"
                    : "hover:scale-[1.02] hover:shadow-md hover:border-primary/50"
                }`}
                onClick={() => setFilterTrialPeriod(!filterTrialPeriod)}
              >
                <div
                  className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center mr-1.5 sm:mr-2 flex-shrink-0 ${
                    filterTrialPeriod ? "bg-background/20" : "bg-primary/10"
                  }`}
                >
                  <Icon
                    name="Gift"
                    size={16}
                    className={
                      filterTrialPeriod ? "text-background" : "text-primary"
                    }
                  />
                </div>
                <span className="truncate">
                  {filterTrialPeriod
                    ? t("filters.withTrialPeriod")
                    : t("filters.allProviders")}
                </span>
              </Button>
            </div>

            <div className="group">
              <label className="text-xs sm:text-sm font-bold text-foreground mb-2 sm:mb-3 flex items-center gap-1.5 sm:gap-2">
                <Icon
                  name="MapPin"
                  size={14}
                  className="text-primary sm:w-4 sm:h-4"
                />
                {t("filters.datacenterLocation")}
              </label>
              <div className="relative">
                <div className="absolute left-2.5 sm:left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                  <Icon
                    name="Globe"
                    size={16}
                    className="text-primary sm:w-[18px] sm:h-[18px]"
                  />
                </div>
                <select
                  className="w-full h-10 sm:h-11 md:h-12 pl-9 sm:pl-11 pr-3 sm:pr-4 rounded-xl border-2 border-input bg-background text-foreground text-xs sm:text-sm font-semibold appearance-none cursor-pointer hover:border-primary/50 hover:shadow-md focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
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
                  size={16}
                  className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground"
                />
              </div>
            </div>

            <div className="group">
              <label className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
                <Icon name="Boxes" size={16} className="text-primary" />
                {t("common.virtualization")}
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                  <Icon name="Box" size={18} className="text-primary" />
                </div>
                <select
                  className="w-full h-12 pl-11 pr-4 rounded-xl border-2 border-input bg-background text-foreground text-sm font-semibold appearance-none cursor-pointer hover:border-primary/50 hover:shadow-md focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
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
                  size={16}
                  className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground"
                />
              </div>
            </div>

            <div className="group">
              <label className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
                <Icon name="HardDrive" size={16} className="text-primary" />
                {t("filters.diskType")}
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                  <Icon name="Database" size={18} className="text-primary" />
                </div>
                <select
                  className="w-full h-12 pl-11 pr-4 rounded-xl border-2 border-input bg-background text-foreground text-sm font-semibold appearance-none cursor-pointer hover:border-primary/50 hover:shadow-md focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
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
                  size={16}
                  className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground"
                />
              </div>
            </div>

            <div className="group">
              <label className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
                <Icon name="CreditCard" size={16} className="text-primary" />
                {t("filters.paymentMethod")}
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                  <Icon name="Wallet" size={18} className="text-primary" />
                </div>
                <select
                  className="w-full h-12 pl-11 pr-4 rounded-xl border-2 border-input bg-background text-foreground text-sm font-semibold appearance-none cursor-pointer hover:border-primary/50 hover:shadow-md focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
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
                  size={16}
                  className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground"
                />
              </div>
            </div>

            <div className="group">
              <label className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
                <Icon name="Monitor" size={16} className="text-primary" />
                {t("filters.operatingSystem")}
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                  <Icon name="Terminal" size={18} className="text-primary" />
                </div>
                <select
                  className="w-full h-12 pl-11 pr-4 rounded-xl border-2 border-input bg-background text-foreground text-sm font-semibold appearance-none cursor-pointer hover:border-primary/50 hover:shadow-md focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
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
                  size={16}
                  className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground"
                />
              </div>
            </div>

            <div className="group">
              <label className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
                <Icon name="Cpu" size={16} className="text-primary" />
                Процессор
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                  <Icon name="Cpu" size={18} className="text-primary" />
                </div>
                <select
                  className="w-full h-12 pl-11 pr-4 rounded-xl border-2 border-input bg-background text-foreground text-sm font-semibold appearance-none cursor-pointer hover:border-primary/50 hover:shadow-md focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
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
                  size={16}
                  className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground"
                />
              </div>
            </div>

            <div className="group">
              <label className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
                <Icon name="Server" size={16} className="text-primary" />
                {t("filters.minDatacenters")}
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                  <Icon name="Building2" size={18} className="text-primary" />
                </div>
                <select
                  className="w-full h-12 pl-11 pr-4 rounded-xl border-2 border-input bg-background text-foreground text-sm font-semibold appearance-none cursor-pointer hover:border-primary/50 hover:shadow-md focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                  value={filterMinDatacenters || ""}
                  onChange={(e) =>
                    setFilterMinDatacenters(
                      e.target.value ? parseInt(e.target.value) : null,
                    )
                  }
                >
                  <option value="">{t("filters.anyAmount")}</option>
                  <option value="3">3+ ЦОДа</option>
                  <option value="5">5+ ЦОДов</option>
                  <option value="10">10+ ЦОДов</option>
                </select>
                <Icon
                  name="ChevronDown"
                  size={16}
                  className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 md:gap-5">
            <div className="group">
              <label className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
                <Icon name="ArrowUpDown" size={16} className="text-primary" />
                {t("filters.sortBy")}
              </label>
              <div className="flex gap-3">
                <Button
                  variant={sortBy === "rating" ? "default" : "outline"}
                  className={`flex-1 justify-center h-12 rounded-xl font-bold transition-all ${
                    sortBy === "rating"
                      ? "shadow-lg shadow-primary/30 scale-[1.02]"
                      : "hover:scale-[1.02] hover:shadow-md hover:border-primary/50"
                  }`}
                  onClick={() => setSortBy("rating")}
                >
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center mr-2 ${
                      sortBy === "rating" ? "bg-background/20" : "bg-primary/10"
                    }`}
                  >
                    <Icon
                      name="Star"
                      size={18}
                      className={
                        sortBy === "rating" ? "text-background" : "text-primary"
                      }
                    />
                  </div>
                  {t("filters.byRating")}
                </Button>
                <Button
                  variant={sortBy === "price" ? "default" : "outline"}
                  className={`flex-1 justify-center h-12 rounded-xl font-bold transition-all ${
                    sortBy === "price"
                      ? "shadow-lg shadow-primary/30 scale-[1.02]"
                      : "hover:scale-[1.02] hover:shadow-md hover:border-primary/50"
                  }`}
                  onClick={() => setSortBy("price")}
                >
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center mr-2 ${
                      sortBy === "price" ? "bg-background/20" : "bg-primary/10"
                    }`}
                  >
                    ₽
                  </div>
                  {t("filters.byPrice")}
                </Button>
              </div>
            </div>

            <div className="group">
              <label className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
                <Icon name="Search" size={16} className="text-primary" />
                {t("filters.searchByName")}
              </label>
              <div className="relative">
                <Icon
                  name="Search"
                  size={18}
                  className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
                />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t("filters.findProvider")}
                  className="w-full pl-10 sm:pl-12 pr-10 sm:pr-12 h-12 bg-background border-2 border-border rounded-xl focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm sm:text-base text-foreground placeholder:text-muted-foreground font-semibold hover:border-primary/50 hover:shadow-md"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 hover:bg-accent rounded-lg transition-colors"
                  >
                    <Icon
                      name="X"
                      size={18}
                      className="text-muted-foreground"
                    />
                  </button>
                )}
              </div>
            </div>
          </div>

          {searchQuery && (
            <div className="text-sm text-muted-foreground relative z-10">
              {t("filters.found")}:{" "}
              <span className="font-bold text-foreground">{filteredCount}</span>{" "}
              {t("filters.providers")}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
