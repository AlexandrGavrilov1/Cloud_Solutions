import { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";
import { Provider, ResourceConfig } from "./types";
import {
  TechnicalSpecsSection,
  ServiceGuaranteesSection,
  AdditionalServicesSection,
  PaymentMethodsSection,
  CaseStudiesSection,
} from "./ProviderDetailsSections";
import { ProviderCardHeader } from "./ProviderCardHeader";
import { ResourceConfigurator } from "./ResourceConfigurator";
import { ProviderReviews } from "./ProviderReviews";
import { useLanguage } from "@/contexts/LanguageContext";

interface ProviderCardProps {
  provider: Provider;
  index: number;
  config: ResourceConfig;
  onUpdateConfig: (key: keyof ResourceConfig, value: number) => void;
  calculatedPrice: number;
  configOpen: boolean;
  onToggleConfig: () => void;
  showDetails: boolean;
  onToggleDetails: () => void;
  reviewsToShow: number;
  onLoadMoreReviews: () => void;
  isSelected?: boolean;
  onToggleCompare?: () => void;
}

export const ProviderCard = ({
  provider,
  index,
  config,
  onUpdateConfig,
  calculatedPrice,
  configOpen,
  onToggleConfig,
  showDetails,
  onToggleDetails,
  reviewsToShow,
  onLoadMoreReviews,
  isSelected = false,
  onToggleCompare,
}: ProviderCardProps) => {
  const { t } = useLanguage();
  const containerRef = useRef<HTMLDivElement>(null);
  const avgRating =
    provider.reviews.reduce((sum, r) => sum + r.rating, 0) /
    provider.reviews.length;

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: `${provider.name} VPS`,
    description: provider.pros.join(". ") + ". " + provider.features.join(", "),
    brand: {
      "@type": "Brand",
      name: provider.name,
    },
    image: provider.logo,
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: avgRating.toFixed(1),
      bestRating: "5",
      worstRating: "1",
      ratingCount: provider.reviews.length,
      reviewCount: provider.reviews.length,
    },
    offers: {
      "@type": "Offer",
      price: calculatedPrice,
      priceCurrency: "RUB",
      availability: "https://schema.org/InStock",
      url: provider.url,
      priceValidUntil: "2025-12-31",
      seller: {
        "@type": "Organization",
        name: provider.name,
      },
    },
    review: provider.reviews.slice(0, 5).map((review) => ({
      "@type": "Review",
      reviewRating: {
        "@type": "Rating",
        ratingValue: review.rating,
        bestRating: "5",
        worstRating: "1",
      },
      author: {
        "@type": "Person",
        name: review.author,
      },
      datePublished: review.date,
      reviewBody: review.text,
    })),
    additionalProperty: [
      {
        "@type": "PropertyValue",
        name: "Disk Type",
        value: provider.technicalSpecs.diskType,
      },
      {
        "@type": "PropertyValue",
        name: "Network Speed",
        value: provider.technicalSpecs.networkSpeed,
      },
      {
        "@type": "PropertyValue",
        name: "Virtualization",
        value: provider.technicalSpecs.virtualization.join(", "),
      },
      {
        "@type": "PropertyValue",
        name: "SLA Uptime",
        value: provider.serviceGuarantees.uptimeSLA,
      },
      {
        "@type": "PropertyValue",
        name: "152-ФЗ Compliant",
        value: provider.fz152Compliant ? "Yes" : "No",
      },
    ],
  };

  const trackClick = async () => {
    try {
      await fetch(
        "https://functions.poehali.dev/d0b8e2ce-45c2-4ab9-8d08-baf03c0268f4",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            provider_id: provider.id,
          }),
        },
      );
    } catch (error) {
      console.error("Error tracking click:", error);
    }
  };

  const handleProviderClick = async () => {
    if (provider.url) {
      trackClick();
      window.location.href = provider.url;
    }
  };

  // Функция для отображения сертификаций ФСТЭК
  const renderFstekCertifications = () => {
    if (
      !provider.fstekCertifications ||
      provider.fstekCertifications.length === 0
    ) {
      return null;
    }

    return (
      <div className="space-y-2">
        <div className="text-sm font-medium text-foreground">
          Сертификации ФСТЭК:
        </div>
        <div className="space-y-2">
          {provider.fstekCertifications.map((cert, idx) => (
            <div key={idx} className="flex items-start gap-2">
              <div className="w-5 h-5 bg-secondary/20 rounded-md flex items-center justify-center flex-shrink-0 mt-0.5">
                <Icon name="ShieldCheck" size={12} className="text-secondary" />
              </div>
              <div>
                <Badge className="bg-secondary/10 text-secondary border-secondary/30 mb-1">
                  {cert}
                </Badge>
                <p className="text-xs text-muted-foreground">
                  {cert === "ФСТЭК-17" &&
                    "Требования о защите информации, не составляющей государственную тайну, содержащейся в государственных информационных системах"}
                  {cert === "ФСТЭК-21" &&
                    "Состав и содержание организационных и технических мер по обеспечению безопасности персональных данных"}
                  {cert === "ФСТЭК-239" &&
                    "Требования по обеспечению безопасности значимых объектов критической информационной инфраструктуры"}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <>
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>
      <div
        ref={containerRef}
        className={`relative flex flex-col group ${showDetails ? "col-span-full z-10" : ""}`}
      >
        <Card
          className={`glass-effect rounded-2xl overflow-visible relative flex flex-col hover-lift
          ${isSelected ? "border-primary/50 shadow-lg shadow-primary/30" : ""} transition-all`}
        >
          <CardHeader className="p-5">
            <ProviderCardHeader
              provider={provider}
              index={index}
              calculatedPrice={calculatedPrice}
              onProviderClick={handleProviderClick}
              onCompareClick={onToggleCompare}
              isComparing={isSelected}
              showDetails={showDetails}
            />
          </CardHeader>

          <CardContent className="px-5 pb-5">
            <div className="space-y-3">
              <Button
                variant="ghost"
                className="w-full text-sm font-semibold hover:bg-accent/50 hover:text-primary justify-between"
                onClick={onToggleDetails}
              >
                <div className="flex items-center gap-2">
                  <Icon name={showDetails ? "EyeOff" : "Eye"} size={18} />
                  <span>
                    {showDetails ? "Скрыть детали" : "Показать детали"}
                  </span>
                </div>
                <Icon
                  name={showDetails ? "ChevronUp" : "ChevronDown"}
                  size={18}
                />
              </Button>
            </div>

            <div
              className={`overflow-hidden transition-all duration-500 ease-in-out -mx-5 ${
                showDetails
                  ? "max-h-[10000px] opacity-100"
                  : "max-h-0 opacity-0"
              }`}
            >
              <div className="pt-5 px-5 border-t border-border flex flex-col gap-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {provider.fz152Compliant && (
                    <div className="bg-primary/5 border border-primary/20 rounded-2xl p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-9 h-9 bg-primary/20 rounded-xl flex items-center justify-center">
                          <Icon
                            name="ShieldCheck"
                            size={18}
                            className="text-primary"
                          />
                        </div>
                        <h4 className="text-base font-bold text-foreground">
                          {t("card.fz152")}
                        </h4>
                        {provider.fz152Level && (
                          <Badge className="bg-primary/20 text-primary border-0 ml-auto">
                            {provider.fz152Level}
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-foreground leading-relaxed">
                        {t("card.fz152Description")}
                      </p>
                    </div>
                  )}

                  {provider.fstekCertifications &&
                    provider.fstekCertifications.length > 0 && (
                      <div className="bg-secondary/5 border border-secondary/20 rounded-2xl p-4">
                        <div className="flex items-center gap-2 mb-3">
                          <div className="w-9 h-9 bg-secondary/20 rounded-xl flex items-center justify-center">
                            <Icon
                              name="ShieldAlert"
                              size={18}
                              className="text-secondary"
                            />
                          </div>
                          <h4 className="text-base font-bold text-foreground">
                            ФСТЭК
                          </h4>
                          {provider.fstekLevel && (
                            <Badge className="bg-secondary/20 text-secondary border-0 ml-auto">
                              {provider.fstekLevel}
                            </Badge>
                          )}
                        </div>

                        {/* Отображение конкретных сертификаций */}
                        {renderFstekCertifications()}
                      </div>
                    )}
                </div>

                {/* Новые секции для дополнительных свойств */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {provider.kiiPlacement && (
                    <div className="bg-blue-500/5 border border-blue-500/20 rounded-2xl p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-9 h-9 bg-blue-500/20 rounded-xl flex items-center justify-center">
                          <Icon
                            name="Building2"
                            size={18}
                            className="text-blue-500"
                          />
                        </div>
                        <h4 className="text-base font-bold text-foreground">
                          Размещение КИИ
                        </h4>
                      </div>
                      <p className="text-sm text-foreground leading-relaxed">
                        Провайдер допускает размещение объектов КИИ на своей
                        инфраструктуре. Объекты критической информационной
                        инфраструктуры (КИИ) — это системы, сети и базы данных,
                        от функционирования которых зависит безопасность
                        государства, национальная экономика и благосостояние
                        граждан. Защита КИИ — ключевой элемент информационной
                        безопасности страны, поскольку любые нарушения в их
                        работе могут привести к серьёзным последствиям для всего
                        общества.
                      </p>
                    </div>
                  )}

                  <div className="bg-card border border-border rounded-2xl p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-9 h-9 bg-primary/20 rounded-xl flex items-center justify-center">
                        <Icon
                          name={
                            provider.mobileApp ? "Smartphone" : "SmartphoneOff"
                          }
                          size={18}
                          className={
                            provider.mobileApp
                              ? "text-primary"
                              : "text-muted-foreground"
                          }
                        />
                      </div>
                      <h4 className="text-base font-bold text-foreground">
                        Мобильное приложение
                      </h4>
                      <Badge
                        className={
                          provider.mobileApp
                            ? "bg-green-500/20 text-green-500 border-green-500/30 ml-auto"
                            : "bg-red-500/20 text-red-500 border-red-500/30 ml-auto"
                        }
                      >
                        {provider.mobileApp ? "Доступно" : "Отсутствует"}
                      </Badge>
                    </div>
                    <p className="text-sm text-foreground">
                      {provider.mobileApp
                        ? "Провайдер предоставляет мобильное приложение для управления серверами и мониторинга"
                        : "Провайдер не предоставляет мобильное приложение"}
                    </p>
                  </div>

                  <div className="bg-card border border-border rounded-2xl p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-9 h-9 bg-primary/20 rounded-xl flex items-center justify-center">
                        <Icon
                          name="ClipboardCheck"
                          size={18}
                          className="text-primary"
                        />
                      </div>
                      <h4 className="text-base font-bold text-foreground">
                        Заказ услуг
                      </h4>
                      <Badge
                        className={
                          provider.orderBeforeRegistration
                            ? "bg-green-500/20 text-green-500 border-green-500/30 ml-auto"
                            : "bg-orange-500/20 text-orange-500 border-orange-500/30 ml-auto"
                        }
                      >
                        {provider.orderBeforeRegistration
                          ? "До регистрации"
                          : "После регистрации"}
                      </Badge>
                    </div>
                    <p className="text-sm text-foreground">
                      {provider.orderBeforeRegistration
                        ? "Возможность заказать услуги и настроить сервер до создания учетной записи"
                        : "Требуется регистрация и создание учетной записи перед заказом услуг"}
                    </p>
                  </div>

                  {provider.itConsulting &&
                    provider.itConsulting.length > 0 && (
                      <div className="bg-card border border-border rounded-2xl p-4">
                        <div className="flex items-center gap-2 mb-3">
                          <div className="w-9 h-9 bg-purple-500/20 rounded-xl flex items-center justify-center">
                            <Icon
                              name="Briefcase"
                              size={18}
                              className="text-purple-500"
                            />
                          </div>
                          <h4 className="text-base font-bold text-foreground">
                            IT-консалтинг
                          </h4>
                        </div>
                        <div className="space-y-2">
                          <p className="text-sm text-foreground mb-2">
                            Предоставляемые услуги консалтинга:
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {provider.itConsulting.map((service, idx) => (
                              <Badge
                                key={idx}
                                variant="outline"
                                className="bg-purple-500/10 text-purple-500 border-purple-500/30"
                              >
                                {service}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                </div>

                <TechnicalSpecsSection provider={provider} />
                <ServiceGuaranteesSection provider={provider} />
                <AdditionalServicesSection provider={provider} />
                <PaymentMethodsSection provider={provider} />
                <CaseStudiesSection provider={provider} />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="bg-accent border border-secondary/30 rounded-2xl p-4">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-9 h-9 bg-secondary rounded-xl flex items-center justify-center shadow-lg">
                        <Icon
                          name="Check"
                          size={18}
                          className="text-background"
                        />
                      </div>
                      <h4 className="text-base font-bold text-foreground">
                        {t("card.pros")}
                      </h4>
                    </div>
                    <ul className="space-y-2.5">
                      {provider.pros.map((pro, idx) => (
                        <li key={idx} className="flex items-start gap-2.5">
                          <div className="w-5 h-5 bg-secondary rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                            <Icon
                              name="Plus"
                              size={12}
                              className="text-background"
                            />
                          </div>
                          <span className="text-sm text-foreground font-medium">
                            {pro}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-accent border border-destructive/30 rounded-2xl p-4">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-9 h-9 bg-destructive rounded-xl flex items-center justify-center shadow-lg">
                        <Icon
                          name="AlertCircle"
                          size={18}
                          className="text-destructive-foreground"
                        />
                      </div>
                      <h4 className="text-base font-bold text-foreground">
                        {t("card.cons")}
                      </h4>
                    </div>
                    <ul className="space-y-2.5">
                      {provider.cons.map((con, idx) => (
                        <li key={idx} className="flex items-start gap-2.5">
                          <div className="w-5 h-5 bg-destructive rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                            <Icon
                              name="Minus"
                              size={12}
                              className="text-destructive-foreground"
                            />
                          </div>
                          <span className="text-sm text-foreground font-medium">
                            {con}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <ProviderReviews
                  provider={provider}
                  reviewsToShow={reviewsToShow}
                  onLoadMoreReviews={onLoadMoreReviews}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};
