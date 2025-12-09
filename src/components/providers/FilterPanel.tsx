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
      {/* КНОПКА С УВЕЛИЧЕННОЙ ВЫСОТОЙ */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-3 py-3 flex items-center justify-between hover:bg-primary/5 transition-colors rounded-xl min-h-[48px]"
      >
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-primary/20 rounded-lg flex items-center justify-center shrink-0">
            <Icon name="Filter" size={14} className="text-primary" />
          </div>
          <h3 className="text-sm font-bold text-foreground">Фильтры</h3>
        </div>
        <div className="flex items-center gap-1">
          <Icon
            name={isExpanded ? "ChevronUp" : "ChevronDown"}
            size={18}
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
          {/* Остальной код остается без изменений */}
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

            {/* ... остальные чекбоксы ... */}
          </div>

          {/* ... остальные выпадающие списки и ползунок ... */}
        </div>
      )}
    </div>
  );
};
