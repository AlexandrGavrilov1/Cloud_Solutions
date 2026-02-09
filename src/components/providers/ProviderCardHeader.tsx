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

  const handleProviderClickWithTracking = (e: React.MouseEvent) => {
    e.preventDefault();
    onProviderClick();
    if (provider.url) {
      window.open(provider.url, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-start gap-6">
        <div className="relative flex-shrink-0">
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl overflow-hidden bg-white border border-primary/10 shadow-soft flex items-center justify-center">
            <img
              src={provider.logo}
              alt={provider.name}
              className="w-10 h-10 sm:w-12 sm:h-12 object-contain"
            />
          </div>
          <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-primary rounded-lg flex items-center justify-center shadow-lg text-background text-xs font-bold">
            {index + 1}
          </div>
        </div>

        <div className="flex-1 min-w-0 flex flex-col gap-4">
          <div className="flex items-start justify-between gap-3">
            <h3 className="text-[32px] font-bold text-gray-900 leading-tight">
              {provider.name}
            </h3>
            {onCompareClick && (
              <button
                className={`flex-shrink-0 transition-colors ${
                  isComparing
                    ? "text-orange-500 hover:text-orange-600"
                    : "text-gray-400 hover:text-gray-600"
                }`}
                onClick={(e) => {
                  e.stopPropagation();
                  onCompareClick();
                }}
              >
                <Icon name="GitCompareArrows" size={24} />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Icon name="Star" size={28} className="fill-orange-500 text-orange-500" />
            <span className="text-[28px] font-medium text-gray-900">{avgRating.toFixed(1)}</span>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <Icon name="MapPin" size={24} className="text-orange-500 flex-shrink-0" />
          <span className="text-[18px] text-gray-900">
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
            <Icon name="Shield" size={24} className="text-orange-500 flex-shrink-0" />
            <span className="text-[18px] text-gray-900">
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
            <Icon name="Settings" size={24} className="text-orange-500 flex-shrink-0" />
            <span className="text-[18px] text-gray-900">
              {provider.technicalSpecs.virtualization
                ? provider.technicalSpecs.virtualization.join(", ")
                : provider.technicalSpecs.diskType}
              {provider.technicalSpecs.kubernetes?.available && ", Kubernetes"}
            </span>
          </div>
        )}

        {provider.serviceGuarantees && (
          <div className="flex items-center gap-3">
            <Icon name="User" size={24} className="text-orange-500 flex-shrink-0" />
            <span className="text-[18px] text-gray-900">
              Uptime {provider.serviceGuarantees.uptimeSLA}, поддержка{" "}
              {provider.serviceGuarantees.supportResponseTime}
            </span>
          </div>
        )}

        {provider.technicalSpecs.gpuModels &&
          provider.technicalSpecs.gpuModels.length > 0 && (
            <div className="flex items-center gap-3">
              <Icon name="Cpu" size={24} className="text-orange-500 flex-shrink-0" />
              <span className="text-[18px] text-gray-900">
                GPU {provider.technicalSpecs.gpuModels.length}, Агенты
              </span>
            </div>
          )}
      </div>

      <div className="flex items-center justify-between gap-4">
        <div className="flex flex-col gap-2">
          <div className="text-[40px] font-bold text-gray-900 leading-none">
            от {provider.basePrice === 0 ? "—" : `${provider.basePrice} ₽`}
            <span className="text-[24px] font-normal text-gray-900">/мес</span>
          </div>
          
          {provider.trialDays > 0 && (
            <div className="flex items-center gap-2 text-orange-500">
              <Icon name="Gift" size={20} />
              <span className="text-[16px] font-medium">
                {provider.trialDays} дня бесплатно
              </span>
            </div>
          )}
        </div>

        <Button
          size="lg"
          className="bg-orange-500 hover:bg-orange-600 text-white text-[18px] font-medium px-8 py-6 rounded-full flex items-center gap-2 h-auto"
          onClick={handleProviderClickWithTracking}
        >
          Попробовать
          <Icon name="ArrowRight" size={20} />
        </Button>
      </div>
    </div>
  );
};