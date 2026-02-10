import { useState } from "react";
import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";
import { Provider } from "./types";
import { useLanguage } from "@/contexts/LanguageContext";

interface ProviderCardHeaderProps {
  provider: Provider;
  index: number;
  onProviderClick: () => void;
  onCompareClick?: () => void;
  isComparing?: boolean;
  showDetails?: boolean;
  priceText: string;
}

export const ProviderCardHeader = ({
  provider,
  index,
  onProviderClick,
  onCompareClick,
  isComparing = false,
  showDetails = false,
  priceText,
}: ProviderCardHeaderProps) => {
  const { t } = useLanguage();
  const avgRating =
    provider.reviews.reduce((sum, r) => sum + r.rating, 0) /
    provider.reviews.length;
  const [showAllLocations, setShowAllLocations] = useState(false);
  const [showCompareTooltip, setShowCompareTooltip] = useState(false);

  const handleProviderClickWithTracking = (e: React.MouseEvent) => {
    e.preventDefault();
    onProviderClick();
    if (provider.url) {
      window.open(provider.url, "_blank", "noopener,noreferrer");
    }
  };

  const getDaysWord = (days: number) => {
    const lastDigit = days % 10;
    const lastTwoDigits = days % 100;

    if (lastTwoDigits >= 11 && lastTwoDigits <= 14) {
      return "дней";
    }
    if (lastDigit === 1) {
      return "день";
    }
    if (lastDigit >= 2 && lastDigit <= 4) {
      return "дня";
    }
    return "дней";
  };

  return (
    <div className="flex flex-col gap-6 sm:gap-8">
      <div className="flex items-start gap-4 sm:gap-6">
        <div className="flex-shrink-0">
          <div className="w-[62px] h-[62px] sm:w-[73px] sm:h-[73px] rounded-xl overflow-hidden bg-white border border-primary/10 shadow-soft flex items-center justify-center">
            <img
              src={provider.logo}
              alt={provider.name}
              className="w-[52px] h-[52px] sm:w-[62px] sm:h-[62px] object-contain"
            />
          </div>
        </div>

        <div className="flex-1 min-w-0 flex flex-col gap-0">
          <div className="flex items-start justify-between gap-3">
            <h3 className="text-[24px] sm:text-[32px] font-bold text-gray-900 dark:text-white leading-tight">
              {provider.name}
            </h3>
            {onCompareClick && (
              <div className="relative">
                <button
                  className={`flex-shrink-0 transition-colors relative ${
                    isComparing
                      ? "text-orange-500 hover:text-orange-600"
                      : "text-gray-400 hover:text-gray-600"
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    onCompareClick();
                  }}
                  onMouseEnter={() => setShowCompareTooltip(true)}
                  onMouseLeave={() => setShowCompareTooltip(false)}
                  aria-label="Сравнить"
                >
                  <Icon name="GitCompareArrows" size={24} />
                  {isComparing && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Icon
                        name="Check"
                        size={14}
                        className="text-white bg-orange-500 rounded-full p-0.5"
                      />
                    </div>
                  )}
                </button>
                {showCompareTooltip && (
                  <div className="absolute top-full right-0 mt-1 px-2 py-1 bg-gray-900 text-white text-xs rounded whitespace-nowrap z-10">
                    Сравнить
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 mt-1">
            <Icon
              name="Star"
              size={20}
              sm:size={24}
              className="fill-orange-500 text-orange-500"
            />
            <span className="text-[20px] sm:text-[24px] font-medium text-gray-900 dark:text-white">
              {avgRating.toFixed(1)}
            </span>
          </div>
        </div>
      </div>

      <div className="space-y-3 sm:space-y-4">
        <div className="flex items-center gap-3">
          <Icon
            name="MapPin"
            size={20}
            sm:size={24}
            className="text-orange-500 flex-shrink-0"
          />
          <span className="text-[16px] sm:text-[18px] text-gray-900 dark:text-white">
            {provider.locations.slice(0, 2).join(", ")}
            {provider.locations.length > 2 && (
              <>
                {showAllLocations ? (
                  <>
                    , {provider.locations.slice(2).join(", ")}
                    <button
                      className="ml-1 text-orange-500 hover:underline font-medium"
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowAllLocations(false);
                      }}
                    >
                      скрыть
                    </button>
                  </>
                ) : (
                  <button
                    className="ml-1 text-orange-500 font-medium hover:underline"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowAllLocations(true);
                    }}
                  >
                    +{provider.locations.length - 2}
                  </button>
                )}
              </>
            )}
          </span>
        </div>

        {(provider.fz152Compliant ||
          provider.fstekCompliant ||
          provider.kiiPlacement) && (
          <div className="flex items-center gap-3">
            <div className="relative flex-shrink-0">
              <Icon
                name="Shield"
                size={20}
                sm:size={24}
                className="text-orange-500"
              />
              <Icon
                name="Check"
                size={10}
                sm:size={12}
                className="text-orange-500 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
              />
            </div>
            <span className="text-[16px] sm:text-[18px] text-gray-900 dark:text-white">
              {[
                provider.fz152Compliant && "152-ФЗ",
                provider.fstekCompliant && "ФСТЭК",
                provider.kiiPlacement && "КИИ",
              ]
                .filter(Boolean)
                .join(", ")}
            </span>
          </div>
        )}

        {provider.technicalSpecs.diskType && (
          <div className="flex items-center gap-3">
            <Icon
              name="Settings"
              size={20}
              sm:size={24}
              className="text-orange-500 flex-shrink-0"
            />
            <span className="text-[16px] sm:text-[18px] text-gray-900 dark:text-white">
              {provider.technicalSpecs.virtualization
                ? provider.technicalSpecs.virtualization.join(", ")
                : provider.technicalSpecs.diskType}
              {provider.technicalSpecs.kubernetes?.available && ", Kubernetes"}
            </span>
          </div>
        )}

        {provider.serviceGuarantees && (
          <div className="flex items-center gap-3">
            <Icon
              name="User"
              size={20}
              sm:size={24}
              className="text-orange-500 flex-shrink-0"
            />
            <span className="text-[16px] sm:text-[18px] text-gray-900 dark:text-white">
              Uptime {provider.serviceGuarantees.uptimeSLA}, поддержка{" "}
              {provider.serviceGuarantees.supportResponseTime}
            </span>
          </div>
        )}

        {provider.technicalSpecs.gpuModels &&
          provider.technicalSpecs.gpuModels.length > 0 && (
            <div className="flex items-center gap-3">
              <Icon
                name="Cpu"
                size={20}
                sm:size={24}
                className="text-orange-500 flex-shrink-0"
              />
              <span className="text-[16px] sm:text-[18px] text-gray-900 dark:text-white">
                GPU {provider.technicalSpecs.gpuModels.length}, Агенты
              </span>
            </div>
          )}
      </div>

      <div className="flex flex-col xs:flex-row xs:items-center justify-between gap-4">
        <div className="flex flex-col gap-2 min-w-0">
          <div className="text-[32px] sm:text-[40px] font-bold text-gray-900 dark:text-white leading-none whitespace-nowrap">
            от {provider.basePrice === 0 ? "—" : `${provider.basePrice} ₽`}
            <span className="text-[20px] sm:text-[24px] font-normal text-gray-900 dark:text-white">
              /мес
            </span>
          </div>

          {provider.trialDays > 0 && (
            <div className="flex items-center gap-2 sm:gap-3">
              <Icon
                name="Gift"
                size={20}
                sm:size={24}
                className="text-orange-500 flex-shrink-0"
              />
              <span className="text-[16px] sm:text-[18px] text-gray-900 dark:text-white whitespace-nowrap">
                {provider.trialDays} {getDaysWord(provider.trialDays)} бесплатно
              </span>
            </div>
          )}
        </div>

        <div className="xs:self-end w-full xs:w-auto">
          <Button
            size="lg"
            className="bg-orange-500 hover:bg-orange-600 text-white text-[14px] sm:text-[16px] font-medium px-4 sm:px-6 py-3 sm:py-4 rounded-full flex items-center justify-center gap-2 h-auto w-full xs:w-auto min-w-[140px] max-w-[300px] xs:max-w-none"
            onClick={handleProviderClickWithTracking}
          >
            Попробовать
            <Icon name="ArrowRight" size={16} sm:size={18} />
          </Button>
        </div>
      </div>
    </div>
  );
};
