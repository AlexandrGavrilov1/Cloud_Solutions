import { useEffect, useRef } from "react";
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

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        drawerRef.current &&
        !drawerRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-50 transition-opacity" />
      <div
        ref={drawerRef}
        className="fixed top-0 left-0 h-full w-[85%] max-w-[340px] bg-white dark:bg-gray-900 shadow-xl z-50 transform transition-transform duration-300 ease-out"
        style={{ transform: isOpen ? "translateX(0)" : "translateX(-100%)" }}
      >
        {/* Шапка с кнопкой «Назад» — используем ChevronLeft */}
        <div className="sticky top-0 z-10 bg-inherit border-b border-gray-200 dark:border-gray-800 p-3 flex items-center">
          <button
            onClick={onClose}
            className="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="Назад"
          >
            <Icon name="ChevronLeft" size={20} />
          </button>
          <span className="ml-2 font-bold text-gray-900 dark:text-white">
            Фильтры
          </span>
        </div>

        <div className="overflow-y-auto h-[calc(100%-60px)]">
          <FilterPanelAlwaysOpen
            {...filterProps}
            className="w-full border-r-0 p-3"
          />
        </div>
      </div>
    </>
  );
};
