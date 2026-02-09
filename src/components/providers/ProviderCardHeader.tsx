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
  const [showLinkTooltip, setShowLinkTooltip] = useState(false);

  const handleProviderClickWithTracking = (e: React.MouseEvent) => {
    e.preventDefault();
    onProviderClick();
    if (provider.url) {
      window.open(provider.url, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-start gap-4">
        <div className="relative flex-shrink-0">
          <div className="w-20 h-20 rounded-2xl overflow-hidden bg-muted border border-border flex items-center justify-center">
            <img
              src={provider.logo}
              alt={provider.name}
              className="w-16 h-16 object-contain"
            />
          </div>
        </div>

        <div className="flex-1 min-w-0 pt-1">
          <div className="flex items-start justify-between gap-3 mb-2">
            <h3 className="text-2xl font-bold text-foreground">
              {provider.name}
            </h3>
            <div className="relative flex-shrink-0">
              <div
                className="cursor-pointer"
                onMouseEnter={() => setShowLinkTooltip(true)}
                onMouseLeave={() => setShowLinkTooltip(false)}
                onClick={(e) => {
                  e.stopPropagation();
                  onProviderClick();
                }}
              >
                <Icon name="ExternalLink" size={20} className="text-muted-foreground hover:text-primary transition-colors" />
              </div>
              {showLinkTooltip && (
                <div className="absolute z-50 top-full right-0 mt-2 px-3 py-2 bg-background border border-border rounded-lg shadow-lg whitespace-nowrap">
                  <p className="text-xs text-foreground">Перейти на сайт провайдера</p>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 mb-3">
            <Icon name="Star" size={20} className="fill-orange-500 text-orange-500" />
            <span className="text-xl font-medium text-foreground">{avgRating.toFixed(1)}</span>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-1.5 text-foreground">
              <Icon name="MapPin" size={16} className="text-orange-500" />
              <span className="text-sm">
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
                          {t("card.hide")}
                        </button>
                      </>
                    ) : (
                      <span className="text-orange-500 font-medium">
                        {" "}
                        +{provider.locations.length - 2}
                      </span>
                    )}
                  </>
                )}
              </span>
            </div>

            {(provider.fz152Compliant ||
              provider.fstekCompliant ||
              provider.kiiPlacement) && (
              <div className="flex items-center gap-1.5 text-foreground">
                <Icon name="Shield" size={16} className="text-orange-500" />
                <span className="text-sm">
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
              <div className="flex items-center gap-1.5 text-foreground">
                <Icon name="Settings" size={16} className="text-orange-500" />
                <span className="text-sm">
                  {provider.technicalSpecs.diskType}
                  {provider.technicalSpecs.virtualization &&
                    `, ${provider.technicalSpecs.virtualization.join(", ")}`}
                  {provider.technicalSpecs.kubernetes?.available && ", Kubernetes"}
                </span>
              </div>
            )}

            {provider.serviceGuarantees && (
              <div className="flex items-center gap-1.5 text-foreground">
                <Icon name="User" size={16} className="text-orange-500" />
                <span className="text-sm">
                  Uptime {provider.serviceGuarantees.uptimeSLA}, поддержка{" "}
                  {provider.serviceGuarantees.supportResponseTime}
                </span>
              </div>
            )}

            {provider.technicalSpecs.gpuModels &&
              provider.technicalSpecs.gpuModels.length > 0 && (
                <div className="flex items-center gap-1.5 text-foreground">
                  <Icon name="Cpu" size={16} className="text-orange-500" />
                  <span className="text-sm">
                    GPU {provider.technicalSpecs.gpuModels.length}, Агенты
                  </span>
                </div>
              )}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between gap-3 pt-4 border-t border-border">
        <div className="flex items-center gap-2">
          <span className="text-3xl font-bold text-foreground">от {provider.basePrice === 0 ? "—" : `${provider.basePrice} ₽`}</span>
          <span className="text-base text-muted-foreground">/мес</span>
        </div>

        {provider.trialDays > 0 && (
          <div className="flex items-center gap-2 text-orange-500">
            <Icon name="Gift" size={16} />
            <span className="text-sm font-medium">
              {provider.trialDays} дня бесплатно
            </span>
          </div>
        )}

        <Button
          variant="default"
          size="lg"
          className="bg-orange-500 hover:bg-orange-600 text-white font-medium px-6 rounded-full flex items-center gap-2"
          onClick={handleProviderClickWithTracking}
        >
          Попробовать
          <Icon name="ArrowRight" size={18} />
        </Button>
      </div>
    </div>
  );
};
