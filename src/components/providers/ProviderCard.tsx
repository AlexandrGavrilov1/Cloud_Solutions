// ProviderCard.tsx
import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";
import { Provider } from "./types";
import {
  TechnicalSpecsSection,
  ServiceGuaranteesSection,
  AdditionalServicesSection,
  PaymentMethodsSection,
  CaseStudiesSection,
} from "./ProviderDetailsSections";
import { ProviderCardHeader } from "./ProviderCardHeader";
import { ProviderReviews } from "./ProviderReviews";
import { useLanguage } from "@/contexts/LanguageContext";

interface ProviderCardProps {
  provider: Provider;
  index: number;
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
  showDetails,
  onToggleDetails,
  reviewsToShow,
  onLoadMoreReviews,
  isSelected = false,
  onToggleCompare,
}: ProviderCardProps) => {
  const { t } = useLanguage();
  const avgRating =
    provider.reviews.reduce((sum, r) => sum + r.rating, 0) /
    provider.reviews.length;
  const [gpuTooltip, setGpuTooltip] = useState<{
    show: boolean;
    model: string;
    description: string;
  }>({
    show: false,
    model: "",
    description: "",
  });

  // Получаем текстовое представление цены
  const getPriceText = () => {
    if (provider.basePrice === 0) {
      return t("common.priceOnRequest") || "Цена по запросу";
    }
    return `${provider.basePrice}${t("common.perMonth")}`;
  };

  const handleProviderClick = async () => {
    if (typeof window !== "undefined" && (window as any).ym) {
      (window as any).ym(105466349, "reachGoal", "ClickOnProviderCard", {
        provider_id: provider.id,
        provider_name: provider.name,
      });
    }

    if (provider.url) {
      // Трекинг клика
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

      // Открываем в новом окне
      window.open(provider.url, "_blank", "noopener,noreferrer");
    }
  };

  // Функция для получения описания GPU
  const getGpuDescription = (model: string): string => {
    const descriptions: Record<string, string> = {
      "GTX 1080": "Игровая GPU NVIDIA, 8GB GDDR5X, 2560 ядер CUDA",
      "GTX 1080 Ti": "Игровая GPU NVIDIA, 11GB GDDR5X, 3584 ядер CUDA",
      "RTX 2080 Ti":
        "Игровая/рабочая GPU NVIDIA, 11GB GDDR6, 4352 ядра CUDA, поддержка RTX",
      "RTX 3080": "Игровая GPU NVIDIA, 10GB GDDR6X, 8704 ядра CUDA",
      "RTX 3090": "Игровая/рабочая GPU NVIDIA, 24GB GDDR6X, 10496 ядер CUDA",
      "RTX 4090": "Игровая GPU NVIDIA, 24GB GDDR6X, 16384 ядра CUDA",
      A2: "Серверная GPU NVIDIA, 16GB память, для инференса и AI",
      A30: "Серверная GPU NVIDIA, 24GB HBM2, для AI и HPC",
      A2000: "Рабочая GPU NVIDIA, 6GB GDDR6, для рабочих станций",
      A4000: "Рабочая GPU NVIDIA, 16GB GDDR6, для рабочих станций и рендеринга",
      A5000:
        "Рабочая GPU NVIDIA, 24GB GDDR6, для профессионального использования",
      A6000:
        "Рабочая GPU NVIDIA, 48GB GDDR6, для профессиональных рабочих станций",
      "Tesla T4": "Серверная GPU NVIDIA, 16GB GDDR6, для инференса в ЦОД",
      V100: "Серверная GPU NVIDIA, 16-32GB HBM2, для машинного обучения",
      A100: "Серверная GPU NVIDIA, 40-80GB HBM2, для AI и HPC",
      H100: "Серверная GPU NVIDIA, 80GB HBM3, для AI и высокопроизводительных вычислений",
    };

    return descriptions[model] || "Графический процессор для вычислений";
  };

  // Функция для показа тултипа GPU
  const showGpuTooltip = (model: string) => {
    setGpuTooltip({
      show: true,
      model,
      description: getGpuDescription(model),
    });
  };

  const hideGpuTooltip = () => {
    setGpuTooltip({ show: false, model: "", description: "" });
  };

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

  const renderRegistrationData = () => {
    if (!provider.registrationData || provider.registrationData.length === 0) {
      return null;
    }

    return (
      <div className="bg-card border border-border rounded-2xl p-4">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-9 h-9 bg-indigo-500/20 rounded-xl flex items-center justify-center">
            <Icon name="UserPlus" size={18} className="text-indigo-500" />
          </div>
          <h4 className="text-base font-bold text-foreground">
            Данные для регистрации
          </h4>
        </div>

        <div className="space-y-2">
          <div className="flex flex-wrap gap-2">
            {provider.registrationData.map((dataField, idx) => (
              <Badge
                key={idx}
                className="bg-indigo-500/20 text-indigo-500 border-indigo-500/30 text-sm"
              >
                {dataField}
              </Badge>
            ))}
          </div>

          <p className="text-sm text-muted-foreground mt-2">
            Для регистрации у этого провайдера требуется предоставить указанные
            данные.
          </p>
        </div>
      </div>
    );
  };

  const renderAdditionalServices = () => {
    if (
      !provider.additionalServicesList ||
      provider.additionalServicesList.length === 0
    ) {
      return null;
    }

    return (
      <div className="bg-card border border-border rounded-2xl p-4">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-9 h-9 bg-purple-500/20 rounded-xl flex items-center justify-center">
            <Icon name="Briefcase" size={18} className="text-purple-500" />
          </div>
          <h4 className="text-base font-bold text-foreground">
            Дополнительные услуги
          </h4>
        </div>
        <div className="space-y-2">
          <p className="text-sm text-foreground mb-2">
            Предоставляемые дополнительные услуги:
          </p>
          <div className="flex flex-wrap gap-2">
            {provider.additionalServicesList.map((service, idx) => (
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
    );
  };

  const renderClientTypes = () => {
    if (
      !provider.supportedClientTypes ||
      provider.supportedClientTypes.length === 0
    ) {
      return null;
    }

    return (
      <div className="bg-card border border-border rounded-2xl p-4">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-9 h-9 bg-teal-500/20 rounded-xl flex items-center justify-center">
            <Icon name="Users" size={18} className="text-teal-500" />
          </div>
          <h4 className="text-base font-bold text-foreground">
            Поддерживаемые типы клиентов
          </h4>
        </div>

        <div className="flex flex-wrap gap-2">
          {provider.supportedClientTypes.map((type, idx) => (
            <Badge
              key={idx}
              className={`text-sm ${
                type === "Физлицо"
                  ? "bg-blue-500/20 text-blue-500 border-blue-500/30"
                  : "bg-purple-500/20 text-purple-500 border-purple-500/30"
              }`}
            >
              {type}
            </Badge>
          ))}
        </div>

        <p className="text-sm text-muted-foreground mt-3">
          Провайдер работает{" "}
          {provider.supportedClientTypes.length === 2
            ? "как с физическими, так и с юридическими лицами"
            : provider.supportedClientTypes.includes("Физлицо")
              ? "только с физическими лицами"
              : "только с юридическими лицами"}
        </p>
      </div>
    );
  };

  // Рендерим раздел GPU
  const renderGpuSection = () => {
    if (
      !provider.technicalSpecs.gpuModels ||
      provider.technicalSpecs.gpuModels.length === 0
    ) {
      return null;
    }

    return (
      <div className="bg-card border border-border rounded-2xl p-4">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-9 h-9 bg-purple-500/20 rounded-xl flex items-center justify-center">
            <Icon name="Cpu" size={18} className="text-purple-500" />
          </div>
          <h4 className="text-base font-bold text-foreground">Поддержка GPU</h4>
        </div>

        <div className="space-y-3">
          <p className="text-sm text-foreground">
            Провайдер предоставляет серверы с графическими процессорами для:
          </p>
          <ul className="list-disc pl-5 text-sm text-foreground space-y-1">
            <li>Машинного обучения и искусственного интеллекта</li>
            <li>Визуализации и рендеринга</li>
            <li>Научных вычислений и моделирования</li>
            <li>Игровых серверов и стриминга</li>
          </ul>

          <div className="mt-4">
            <div className="text-sm font-medium text-foreground mb-2">
              Доступные модели GPU:
            </div>
            <div className="flex flex-wrap gap-2">
              {provider.technicalSpecs.gpuModels.map((gpuModel, idx) => (
                <div
                  key={idx}
                  className="relative"
                  onMouseEnter={() => showGpuTooltip(gpuModel)}
                  onMouseLeave={hideGpuTooltip}
                >
                  <Badge className="bg-purple-500/10 text-purple-500 border-purple-500/30 cursor-help">
                    {gpuModel}
                  </Badge>

                  {gpuTooltip.show && gpuTooltip.model === gpuModel && (
                    <div className="absolute z-50 bottom-full left-1/2 transform -translate-x-1/2 mb-2 p-2 bg-background border border-border rounded-lg shadow-lg w-64">
                      <div className="text-xs font-semibold text-foreground mb-1">
                        {gpuTooltip.model}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {gpuTooltip.description}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Рендерим раздел 1С
  const render1CSection = () => {
    if (!provider.technicalSpecs.supports1C) {
      return null;
    }

    return (
      <div className="bg-card border border-border rounded-2xl p-4">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-9 h-9 bg-purple-500/20 rounded-xl flex items-center justify-center">
            <Icon name="Database" size={18} className="text-purple-500" />
          </div>
          <h4 className="text-base font-bold text-foreground">Поддержка 1С</h4>
        </div>

        <div className="space-y-3">
          <p className="text-sm text-foreground">
            Провайдер специализируется на размещении решений 1С и предоставляет:
          </p>
          <ul className="list-disc pl-5 text-sm text-foreground space-y-1">
            <li>Оптимизированные серверы для 1С:Предприятие 8</li>
            <li>Выделенные серверы для баз данных 1С</li>
            <li>Автоматическое резервное копирование конфигураций</li>
            <li>Техническую поддержку по настройке 1С</li>
            <li>Быструю миграцию существующих баз 1С в облако</li>
          </ul>

          <div className="mt-4">
            <div className="text-sm font-medium text-foreground mb-2">
              Преимущества:
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge className="bg-green-500/10 text-green-500 border-green-500/30">
                Высокая доступность
              </Badge>
              <Badge className="bg-green-500/10 text-green-500 border-green-500/30">
                Масштабируемость
              </Badge>
              <Badge className="bg-green-500/10 text-green-500 border-green-500/30">
                Безопасность данных
              </Badge>
              <Badge className="bg-green-500/10 text-green-500 border-green-500/30">
                Резервное копирование
              </Badge>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div
      className={`relative flex flex-col group ${
        showDetails ? "col-span-full z-10" : ""
      }`}
    >
      <Card
        className={`glass-effect rounded-2xl overflow-visible relative flex flex-col hover-lift
          ${
            isSelected ? "border-primary/50 shadow-lg shadow-primary/30" : ""
          } transition-all`}
      >
        <CardHeader className="p-5">
          <ProviderCardHeader
            provider={provider}
            index={index}
            onProviderClick={handleProviderClick}
            onCompareClick={onToggleCompare}
            isComparing={isSelected}
            showDetails={showDetails}
            priceText={getPriceText()}
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
                <span>{showDetails ? "Скрыть детали" : "Показать детали"}</span>
              </div>
              <Icon
                name={showDetails ? "ChevronUp" : "ChevronDown"}
                size={18}
              />
            </Button>
          </div>

          <div
            className={`overflow-hidden transition-all duration-500 ease-in-out -mx-5 ${
              showDetails ? "max-h-[10000px] opacity-100" : "max-h-0 opacity-0"
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

                      {renderFstekCertifications()}
                    </div>
                  )}
              </div>

              {/* Добавляем разделы GPU и 1С */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {renderGpuSection()}
                {render1CSection()}
              </div>

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
                      инфраструктуры (КИИ) — это системы, сети и базы данных, от
                      функционирования которых зависит безопасность государства,
                      национальная экономика и благосостояние граждан. Защита
                      КИИ — ключевой элемент информационной безопасности страны,
                      поскольку любые нарушения в их работе могут привести к
                      серьёзным последствиям для всего общества.
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

                {renderAdditionalServices()}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {renderRegistrationData()}
                {renderClientTypes()}
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
  );
};
