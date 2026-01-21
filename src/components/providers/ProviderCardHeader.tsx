import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";
import { Provider } from "./types";
import { useLanguage } from "@/contexts/LanguageContext";

interface ProviderCardHeaderProps {
  provider: Provider;
  index: number;
  calculatedPrice: number;
  onProviderClick: () => void;
  onCompareClick?: () => void;
  isComparing?: boolean;
}

export const ProviderCardHeader = ({
  provider,
  index,
  calculatedPrice,
  onProviderClick,
  onCompareClick,
  isComparing = false,
}: ProviderCardHeaderProps) => {
  const { t } = useLanguage();
  const avgRating =
    provider.reviews.reduce((sum, r) => sum + r.rating, 0) /
    provider.reviews.length;
  const [showAllLocations, setShowAllLocations] = useState(false);

  const getSupportSpeedColor = (responseTime: string) => {
    const time = responseTime.toLowerCase();
    if (
      time.includes("5 мин") ||
      time.includes("< 5") ||
      time.includes("мгновенно")
    ) {
      return {
        bg: "bg-green-500/10",
        border: "border-green-500/30",
        text: "text-green-700 dark:text-green-400",
        icon: "Zap",
      };
    }
    if (
      time.includes("15 мин") ||
      time.includes("< 15") ||
      time.includes("10 мин")
    ) {
      return {
        bg: "bg-yellow-500/10",
        border: "border-yellow-500/30",
        text: "text-yellow-700 dark:text-yellow-400",
        icon: "Clock",
      };
    }
    if (
      time.includes("30 мин") ||
      time.includes("1 час") ||
      time.includes("час")
    ) {
      return {
        bg: "bg-orange-500/10",
        border: "border-orange-500/30",
        text: "text-orange-700 dark:text-orange-400",
        icon: "Clock",
      };
    }
    return {
      bg: "bg-gray-500/10",
      border: "border-gray-500/30",
      text: "text-gray-700 dark:text-gray-400",
      icon: "MessageCircle",
    };
  };

  return (
    <div className="flex flex-col gap-3 flex-1">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 flex-1 min-w-0">
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

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1.5">
              <h3 className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-foreground truncate">
                {provider.name}
              </h3>

              {/* Иконки 152-ФЗ и ФСТЭК */}
              <div className="flex gap-1 flex-shrink-0">
                {provider.fz152Compliant && (
                  <div className="w-5 h-5 bg-primary/20 rounded-md flex items-center justify-center">
                    <Icon
                      name="ShieldCheck"
                      size={10}
                      className="text-primary"
                    />
                  </div>
                )}

                {provider.fstekCertifications &&
                  provider.fstekCertifications.length > 0 && (
                    <div className="w-5 h-5 bg-secondary/20 rounded-md flex items-center justify-center">
                      <Icon
                        name="ShieldAlert"
                        size={10}
                        className="text-secondary"
                      />
                    </div>
                  )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Icon
                    key={i}
                    name="Star"
                    size={16}
                    className={
                      i < Math.round(avgRating)
                        ? "fill-primary text-primary"
                        : "text-muted"
                    }
                  />
                ))}
              </div>
              <span className="text-base font-bold text-foreground">
                {avgRating.toFixed(1)}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-start gap-1.5 text-sm">
        <Icon
          name="MapPin"
          size={14}
          className="text-primary mt-0.5 flex-shrink-0"
        />
        <div className="flex items-center gap-1">
          <span className="text-foreground text-xs">
            {showAllLocations
              ? provider.locations.join(", ")
              : provider.locations.slice(0, 2).join(", ")}
            {provider.locations.length > 2 && !showAllLocations && (
              <button
                onClick={() => setShowAllLocations(true)}
                className="text-primary hover:underline ml-1"
              >
                +{provider.locations.length - 2}
              </button>
            )}
            {showAllLocations && provider.locations.length > 2 && (
              <button
                onClick={() => setShowAllLocations(false)}
                className="text-primary hover:underline ml-1"
              >
                скрыть
              </button>
            )}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-1.5 text-sm">
            <Icon
              name="HardDrive"
              size={14}
              className="text-primary flex-shrink-0"
            />
            <span className="text-foreground truncate">
              {provider.technicalSpecs.diskType}
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-sm">
            <Icon name="Box" size={14} className="text-primary flex-shrink-0" />
            <span className="text-foreground truncate">
              {provider.technicalSpecs.virtualization.slice(0, 2).join(", ")}
            </span>
          </div>
          {provider.technicalSpecs.kubernetes?.available && (
            <div className="flex items-center gap-1.5 text-sm">
              <Icon
                name="Network"
                size={14}
                className="text-primary flex-shrink-0"
              />
              <span className="text-foreground">Kubernetes</span>
              {provider.technicalSpecs.kubernetes.managed && (
                <Badge className="bg-primary/10 border-primary/30 text-primary border font-semibold text-[10px] px-1 py-0">
                  managed
                </Badge>
              )}
            </div>
          )}
        </div>

        <div className="flex flex-col items-end gap-2 pr-3">
          <div className="flex flex-col items-end">
            <div className="flex items-baseline whitespace-nowrap">
              <span className="text-2xl font-black text-primary mr-2">
                {t("common.from")}
              </span>
              <span className="text-2xl font-black text-primary">
                {calculatedPrice}
                {t("common.perMonth")}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-sm">
            <Icon
              name="Gift"
              size={14}
              className={
                provider.trialDays ? "text-primary" : "text-muted-foreground"
              }
            />
            <span className="text-foreground text-xs truncate">
              {provider.trialDays
                ? typeof provider.trialDays === "number" &&
                  provider.trialDays > 0
                  ? `${provider.trialDays} ${provider.trialDays === 1 ? t("common.day") : provider.trialDays < 5 ? t("common.daysGenitive") : t("common.days")} ${t("common.free")}`
                  : provider.trialDays
                : "Тест по запросу"}
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        {provider.serviceGuarantees.supportResponseTime &&
          (() => {
            const speedColor = getSupportSpeedColor(
              provider.serviceGuarantees.supportResponseTime,
            );
            return (
              <Badge
                className={`${speedColor.bg} ${speedColor.border} ${speedColor.text} border font-semibold text-xs px-2 py-1 transition-all duration-300 hover:scale-105 hover:shadow-md`}
              >
                <Icon
                  name={speedColor.icon as any}
                  size={12}
                  className="mr-1"
                />
                Поддержка: {provider.serviceGuarantees.supportResponseTime}
              </Badge>
            );
          })()}
        {provider.fz152Compliant && (
          <Badge className="bg-primary/10 border-primary/30 text-primary border font-semibold text-xs px-2 py-1">
            <Icon name="ShieldCheck" size={12} className="mr-1" />
            152-ФЗ
          </Badge>
        )}
        {provider.fstekCertifications &&
          provider.fstekCertifications.length > 0 && (
            <Badge className="bg-secondary/10 border-secondary/30 text-secondary border font-semibold text-xs px-2 py-1">
              <Icon name="ShieldAlert" size={12} className="mr-1" />
              ФСТЭК
              {provider.fstekCertifications.length > 0 && (
                <span className="ml-1 font-normal">
                  ({provider.fstekCertifications.length})
                </span>
              )}
            </Badge>
          )}
        {provider.uptime30days && (
          <Badge className="bg-secondary/10 border-secondary/30 text-secondary border font-semibold text-xs px-2 py-1">
            <Icon name="Activity" size={12} className="mr-1" />
            {t("common.uptime")}: {provider.uptime30days}%
          </Badge>
        )}
      </div>

      {/* Контейнер с кнопками */}
      <div className="flex flex-col sm:flex-row gap-2 mt-2">
        <Button
          onClick={onProviderClick}
          className="flex-1 bg-primary hover:bg-primary/90"
          size="lg"
        >
          {t("common.viewDetails") || "Подробнее"}
        </Button>

        <Button
          onClick={onCompareClick}
          variant="outline"
          className="flex-1"
          size="lg"
        >
          <Icon name="Compare" size={16} className="mr-2" />
          Сравнить
        </Button>
      </div>
    </div>
  );
};
