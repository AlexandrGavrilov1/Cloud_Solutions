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
          style={{
            clipPath: onToggleCompare
              ? 'path("M 0 24 Q 0 0 24 0 L calc(100% - 164px) 0 Q calc(100% - 152px) 0 calc(100% - 152px) 12 L calc(100% - 152px) 48 Q calc(100% - 152px) 60 calc(100% - 140px) 60 L calc(100% - 24px) 60 Q calc(100% - 0px) 60 calc(100% - 0px) 84 L calc(100% - 0px) calc(100% - 24px) Q calc(100% - 0px) 100% calc(100% - 24px) 100% L 24 100% Q 0 100% 0 calc(100% - 24px) Z")'
              : 'path("M 0 24 Q 0 0 24 0 L calc(100% - 92px) 0 Q calc(100% - 80px) 0 calc(100% - 80px) 12 L calc(100% - 80px) 48 Q calc(100% - 80px) 60 calc(100% - 68px) 60 L calc(100% - 24px) 60 Q calc(100% - 0px) 60 calc(100% - 0px) 84 L calc(100% - 0px) calc(100% - 24px) Q calc(100% - 0px) 100% calc(100% - 24px) 100% L 24 100% Q 0 100% 0 calc(100% - 24px) Z")',
          }}
        >
          <div
            className={`absolute right-5 top-5 md:right-6 md:top-6 z-40 flex gap-2 pointer-events-auto ${
              showDetails ? "lg:right-8 lg:top-8" : ""
            }`}
          >
            {onToggleCompare && (
              <button
                onClick={onToggleCompare}
                className={` w-10 h-10 md:w-14 md:h-14 lg:w-16 lg:h-16
    rounded-full flex items-center justify-center
    bg-card border-2 transition-all duration-200
    hover:border-primary/50 focus:outline-none
    focus:ring-2 focus:ring-primary/50 focus:ring-offset-2
    ${
      isSelected
        ? "border-primary/50 shadow-lg shadow-primary/30"
        : "border-border hover:border-primary/50"
    }`}
              >
                <Icon
                  name={isSelected ? "Check" : "GitCompare"}
                  size={17}
                  className="text-foreground"
                />
              </button>
            )}
            <button
              onClick={handleProviderClick}
              className=" min-w-[44px] min-h-[44px] w-11 h-11   xs:w-12 xs:h-12  sm:w-14 sm:h-14 md:w-16 md:h-16  rounded-full bg-card  flex tems-center justify-center   border-2 border-border   hover:border-primary/50   transition-all"
            >
              <Icon name="ArrowUpRight" size={17} className="text-primary" />
            </button>
          </div>

          <CardHeader className="p-5">
            <ProviderCardHeader
              provider={provider}
              index={index}
              calculatedPrice={calculatedPrice}
              onProviderClick={handleProviderClick}
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

                  {provider.fstekCompliant && (
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
                          ФСТЕК
                        </h4>
                        {provider.fstekLevel && (
                          <Badge className="bg-secondary/20 text-secondary border-0 ml-auto">
                            {provider.fstekLevel}
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-foreground leading-relaxed">
                        Сертификация ФСТЕК России для защиты критической
                        информационной инфраструктуры
                      </p>
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
