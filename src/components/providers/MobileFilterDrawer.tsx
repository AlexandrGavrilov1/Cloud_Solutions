import { useEffect, useRef, useMemo } from "react";
import { FilterPanelAlwaysOpen } from "./FilterPanelAlwaysOpen";
import Icon from "@/components/ui/icon";

type MobileFilterDrawerProps = Omit<
  React.ComponentProps<typeof FilterPanelAlwaysOpen>,
  "className"
> & {
  isOpen: boolean;
  onClose: () => void;
};

export const MobileFilterDrawer = ({
  isOpen,
  onClose,
  ...filterProps
}: MobileFilterDrawerProps) => {
  const drawerRef = useRef<HTMLDivElement>(null);

  // Блокировка скролла body при открытии
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Вычисляем, есть ли активные фильтры
  const hasActiveFilters = useMemo(() => {
    return (
      filterProps.filterFZ152 ||
      filterProps.filterFSTEK.length > 0 ||
      filterProps.filterTrialPeriod ||
      filterProps.filterLocation.length > 0 ||
      filterProps.filterVirtualization.length > 0 ||
      filterProps.filterMinDatacenters !== null ||
      filterProps.filterMaxDatacenters !== null ||
      filterProps.filterDiskType.length > 0 ||
      filterProps.filterPaymentMethod.length > 0 ||
      filterProps.filterOS.length > 0 ||
      filterProps.filterCPU.length > 0 ||
      filterProps.filterKII ||
      filterProps.filterMobileApp ||
      filterProps.filterOrderBeforeRegistration ||
      filterProps.filterAdditionalServices.length > 0 ||
      filterProps.filterRegistrationData.length > 0 ||
      filterProps.filterClientType.length > 0 ||
      filterProps.filterGPU.length > 0 ||
      filterProps.filterHasGPU ||
      filterProps.filter1C ||
      filterProps.filterAI
    );
  }, [filterProps]);

  if (!isOpen) return null;

  return (
    <div
      ref={drawerRef}
      className="fixed inset-0 w-full h-full bg-white dark:bg-gray-900 z-50 flex flex-col shadow-xl transform transition-transform duration-300 ease-out"
      style={{ transform: isOpen ? "translateX(0)" : "translateX(100%)" }}
    >
      {/* Шапка: заголовок и кнопка закрытия */}
      <div className="sticky top-0 z-10 bg-inherit border-b border-gray-200 dark:border-gray-800 p-3 flex items-center justify-between">
        <span className="font-bold text-gray-900 dark:text-white">Фильтры</span>
        <button
          onClick={onClose}
          className="p-2 -mr-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          aria-label="Закрыть"
        >
          <Icon name="ChevronRight" size={20} />
        </button>
      </div>

      {/* Контент фильтров — прокручивается */}
      <div className="flex-1 overflow-y-auto">
        <FilterPanelAlwaysOpen
          {...filterProps}
          className="w-full border-r-0 p-3"
        />
      </div>

      {/* Кнопка «Применить» — появляется только при активных фильтрах */}
      {hasActiveFilters && (
        <div className="p-4 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
          <button
            onClick={onClose}
            className="w-full bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
          >
            Применить
          </button>
        </div>
      )}
    </div>
  );
};
