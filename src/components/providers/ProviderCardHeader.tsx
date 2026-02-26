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
    <div className="flex flex-col gap-2">
      {/* Заголовок с логотипом */}
      <div className="flex items-start gap-2">
        {/* Логотип */}
        <div className="flex-shrink-0">
          <div className="w-12 h-12 rounded-lg overflow-hidden bg-white border border-primary/10 shadow-sm flex items-center justify-center">
            <img
              src={provider.logo}
              alt={provider.name}
              className="w-10 h-10 object-contain"
            />
          </div>
        </div>

        {/* Информация оо провайдере */}
        <div className="flex-1 min-w-0 flex flex-col gap-0.5">
          <div className="flex items-start justify-between gap-1">
            <h3 className="tracking-wide text-lg font-medium text-[#1D1E20] dark:text-white leading-tight truncate">
              {provider.name}
            </h3>
            {onCompareClick && (
              <div className="relative flex-shrink-0">
                <button
                  className={`transition-colors ${
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
                  <Icon name="GitCompareArrows" size={16} />
                </button>
                {showCompareTooltip && (
                  <div className="absolute z-10 top-full right-0 mt-1 px-2 py-1 bg-[E3E3E3] text-[6B6A6A] text-xs  whitespace-nowrap shadow">
                    Сравнить
                    <div className="absolute -top-1 right-2 w-2 h-2 bg-[E3E3E3] transform rotate-45"></div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Рейтинг */}
          <div className="flex items-center gap-1">
            <Icon
              name="Star"
              size={14}
              className="fill-[FF931F] text-[FF931F]"
            />
            <span className="text-sm font-medium text-[272932] dark:text-white">
              {avgRating.toFixed(1)}
            </span>
          </div>
        </div>
      </div>

      {/* Детальная информация */}
      <div className="space-y-1.5">
        {/* Локации */}
        <div className="flex items-center gap-1.5">
          <Icon
            name="MapPin"
            size={14}
            className="text-[FF931F] flex-shrink-0"
          />
          <span className="text-xs text-[272932] dark:text-white truncate">
            {provider.locations.slice(0, 2).join(", ")}
            {provider.locations.length > 2 && (
              <>
                {showAllLocations ? (
                  <>
                    , {provider.locations.slice(2).join(", ")}
                    <button
                      className="ml-1 text-[FF931F] hover:underline text-xs"
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
                    className="ml-1 text-[FF931F] text-xs hover:underline"
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

        {/* Комплаенс */}
        {(provider.fz152Compliant ||
          provider.fstekCompliant ||
          provider.kiiPlacement) && (
          <div className="flex items-center gap-1.5">
            <div className="relative flex-shrink-0">
              <Icon name="Shield" size={14} className="text-[FF931F]" />
              <Icon
                name="Check"
                size={6}
                className="text-[FF931F] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
              />
            </div>
            <span className="text-xs text-[272932] dark:text-white truncate">
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

        {/* Технические характеристики */}
        {provider.technicalSpecs.diskType && (
          <div className="flex items-center gap-1.5">
            <Icon
              name="Settings"
              size={14}
              className="text-[FF931F] flex-shrink-0"
            />
            <span className="text-xs text-[272932] dark:text-white truncate">
              {provider.technicalSpecs.virtualization
                ? provider.technicalSpecs.virtualization.join(", ")
                : provider.technicalSpecs.diskType}
              {provider.technicalSpecs.kubernetes?.available && ", Kubernetes"}
            </span>
          </div>
        )}

        {/* Гарантии сервиса */}
        {provider.serviceGuarantees && (
          <div className="flex items-center gap-1.5">
            <Icon
              name="User"
              size={14}
              className="text-[FF931F] flex-shrink-0"
            />
            <span className="text-xs text-[272932] dark:text-white truncate">
              Uptime {provider.serviceGuarantees.uptimeSLA}, поддержка{" "}
              {provider.serviceGuarantees.supportResponseTime}
            </span>
          </div>
        )}

        {/* GPU */}
        {provider.technicalSpecs.gpuModels &&
          provider.technicalSpecs.gpuModels.length > 0 && (
            <div className="flex items-center gap-1.5">
              <Icon
                name="Cpu"
                size={14}
                className="text-[FF931F] flex-shrink-0"
              />
              <span className="text-xs text-[272932] dark:text-white truncate">
                GPU {provider.technicalSpecs.gpuModels.length}, Агенты
              </span>
            </div>
          )}
      </div>

      {/* Цена и кнопка */}
      <div className="flex items-center justify-between gap-3 mt-1">
        <div className="flex flex-col gap-1">
          <div className="text-2xl font-bold text-[272932] dark:text-white leading-none whitespace-nowrap">
            от {provider.basePrice === 0 ? "—" : `${provider.basePrice} ₽`}
            <span className="text-base font-bold text-[272932] dark:text-white ml-0.5">
              /мес
            </span>
          </div>

          {provider.trialDays > 0 && (
            <div className="flex items-center gap-1.5">
              <Icon
                name="Gift"
                size={14}
                className="text-[FF391F] flex-shrink-0"
              />
              <span className="text-xs text-[272932] dark:text-white">
                {provider.trialDays} {getDaysWord(provider.trialDays)} бесплатно
              </span>
            </div>
          )}
        </div>

        <Button
          size="sm"
          className=" font-extralight tracking-widest bg-[#FF931F] hover:bg-[#E6831A] text-white  px-3 py-1.5 rounded-full flex items-center justify-center gap-1 h-8 group"
          onClick={handleProviderClickWithTracking}
        >
          Попробовать
          <Icon
            name="ArrowRight"
            size={14}
            className="transform -rotate-45 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
          />
        </Button>
      </div>
    </div>
  );
};
