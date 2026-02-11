import { useState, useRef } from "react";
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

  const [osTooltip, setOsTooltip] = useState<{
    show: boolean;
    os: string;
    description: string;
  }>({
    show: false,
    os: "",
    description: "",
  });

  const [aiTooltip, setAiTooltip] = useState<{
    show: boolean;
    features: string[];
  }>({
    show: false,
    features: [],
  });

  const gpuTooltipRef = useRef<HTMLDivElement>(null);
  const osTooltipRef = useRef<HTMLDivElement>(null);
  const aiTooltipRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  const adjustTooltipPosition = (
    tooltipRef: React.RefObject<HTMLDivElement>,
  ) => {
    if (!tooltipRef.current || !cardRef.current) return;

    const tooltip = tooltipRef.current;
    const card = cardRef.current;
    const cardRect = card.getBoundingClientRect();
    const tooltipRect = tooltip.getBoundingClientRect();

    if (tooltipRect.right > cardRect.right) {
      const overflow = tooltipRect.right - cardRect.right;
      tooltip.style.left = `calc(50% - ${overflow}px - 0.5rem)`;
    }

    if (tooltipRect.left < cardRect.left) {
      const overflow = cardRect.left - tooltipRect.left;
      tooltip.style.left = `calc(50% + ${overflow}px + 0.5rem)`;
    }
  };

  const getPriceText = () => {
    if (provider.basePrice === 0) {
      return t("common.priceOnRequest") || "Цена по запросу";
    }
    return `${provider.basePrice}${t("common.perMonth")}`;
  };

  const handleProviderClick = async () => {
    if (
      typeof window !== "undefined" &&
      (window as unknown as { ym?: (...args: unknown[]) => void }).ym
    ) {
      (window as unknown as { ym: (...args: unknown[]) => void }).ym(
        105466349,
        "reachGoal",
        "handleProviderClick",
        {
          provider_id: provider.id,
          provider_name: provider.name,
        },
      );
    }

    if (provider.url) {
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

      window.open(provider.url, "_blank", "noopener,noreferrer");
    }
  };

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

  const getOsDescription = (osName: string): string => {
    const descriptions: Record<string, string> = {
      "Alma Linux": "Свободная, стабильная ОС, форк RHEL, для серверов",
      "Alt Linux": "Российский дистрибутив Linux, сертифицированный ФСТЭК",
      "Arch Linux": "Простой, современный дистрибутив с rolling release",
      "Astra Linux":
        "Российская ОС, сертифицированная для обработки секретной информации",
      AstraLinux:
        "Российская ОС, сертифицированная для обработки секретной информации",
      Bitrix: "Готовый виртуальный сервер с предустановленной CMS Bitrix",
      CentOS: "Стабильный, бесплатный форк RHEL, популярный для серверов",
      CoreOS: "Контейнерно-ориентированная ОС, сейчас называется Flatcar",
      Debian: "Стабильная, универсальная ОС, одна из самых популярных",
      Fedora: "Инновационный дистрибутив с новейшими технологиями",
      FreeBSD: "Продвинутая Unix-подобная ОС, известная стабильностью",
      "Oracle Linux": "Совместимый с RHEL дистрибутив от Oracle",
      "Red Hat": "Корпоративный Linux с коммерческой поддержкой (RHEL)",
      "Rocky Linux": "Форк RHEL, созданный как замена CentOS",
      SUSE: "Корпоративный дистрибутив Linux, популярный в Европе",
      Ubuntu: "Популярный, удобный дистрибутив Linux, LTS-версии стабильны",
      "Windows Server": "Серверная ОС от Microsoft, для Active Directory, .NET",
      WordPress: "Готовый виртуальный сервер с предустановленным WordPress",
    };

    return descriptions[osName] || "Операционная система для серверов";
  };

  const showGpuTooltip = (model: string) => {
    setGpuTooltip({
      show: true,
      model,
      description: getGpuDescription(model),
    });

    setTimeout(() => adjustTooltipPosition(gpuTooltipRef), 10);
  };

  const hideGpuTooltip = () => {
    setGpuTooltip({ show: false, model: "", description: "" });
  };

  const showOsTooltip = (os: string) => {
    setOsTooltip({
      show: true,
      os,
      description: getOsDescription(os),
    });

    setTimeout(() => adjustTooltipPosition(osTooltipRef), 10);
  };

  const hideOsTooltip = () => {
    setOsTooltip({ show: false, os: "", description: "" });
  };

  const showAiTooltip = () => {
    if (provider.technicalSpecs.aiFeatures) {
      setAiTooltip({
        show: true,
        features: provider.technicalSpecs.aiFeatures,
      });

      setTimeout(() => adjustTooltipPosition(aiTooltipRef), 10);
    }
  };

  const hideAiTooltip = () => {
    setAiTooltip({ show: false, features: [] });
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
        <div className="text-sm font-medium text-gray-900 dark:text-white">
          Сертификации ФСТЭК:
        </div>
        <div className="space-y-2">
          {provider.fstekCertifications.map((cert, idx) => (
            <div key={idx} className="flex items-start gap-2">
              <div className="w-5 h-5 bg-blue-500/20 rounded-md flex items-center justify-center flex-shrink-0 mt-0.5">
                <Icon name="ShieldCheck" size={12} className="text-blue-500" />
              </div>
              <div>
                <Badge className="bg-blue-500/10 text-blue-500 border-blue-500/30 mb-1">
                  {cert}
                </Badge>
                <p className="text-xs text-gray-600 dark:text-gray-300">
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
          <h4 className="text-base font-bold text-gray-900 dark:text-white">
            Данные для регистрации
          </h4>
        </div>

        <div className="space-y-3">
          <p className="text-sm text-gray-900 dark:text-white leading-relaxed mb-2">
            Для регистрации требуется предоставить:
          </p>
          <div className="flex flex-wrap gap-2">
            {provider.registrationData.map((dataField, idx) => (
              <Badge
                key={idx}
                className="bg-amber-500/10 text-amber-600 border-amber-500/30 text-sm"
              >
                {dataField}
              </Badge>
            ))}
          </div>
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
          <h4 className="text-base font-bold text-gray-900 dark:text-white">
            Дополнительные услуги
          </h4>
        </div>
        <div className="space-y-2">
          <p className="text-sm text-gray-900 dark:text-white leading-relaxed mb-2">
            Предоставляемые дополнительные услуги:
          </p>
          <div className="flex flex-wrap gap-2">
            {provider.additionalServicesList.map((service, idx) => (
              <Badge
                key={idx}
                className="bg-emerald-500/10 text-emerald-600 border-emerald-500/30"
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
          <h4 className="text-base font-bold text-gray-900 dark:text-white">
            Поддерживаемые типы клиентов
          </h4>
        </div>

        <div className="space-y-3">
          <div className="flex flex-wrap gap-2">
            {provider.supportedClientTypes.map((type, idx) => (
              <Badge
                key={idx}
                className={`text-sm ${
                  type === "Физлицо"
                    ? "bg-blue-500/10 text-blue-600 border-blue-500/30"
                    : "bg-purple-500/10 text-purple-600 border-purple-500/30"
                }`}
              >
                {type}
              </Badge>
            ))}
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Провайдер работает{" "}
            {provider.supportedClientTypes.length === 2
              ? "как с физическими, так и с юридическими лицами"
              : provider.supportedClientTypes.includes("Физлицо")
                ? "только с физическими лицами"
                : "только с юридическими лицами"}
          </p>
        </div>
      </div>
    );
  };

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
          <h4 className="text-base font-bold text-gray-900 dark:text-white">
            Поддержка GPU
          </h4>
        </div>

        <div className="space-y-3">
          <p className="text-sm text-gray-900 dark:text-white leading-relaxed mb-2">
            Провайдер предоставляет серверы с графическими процессорами для:
          </p>
          <ul className="list-disc pl-5 text-sm text-gray-900 dark:text-white leading-relaxed space-y-1 mb-4">
            <li>Машинного обучения и искусственного интеллекта</li>
            <li>Визуализации и рендеринга</li>
            <li>Научных вычислений и моделирования</li>
            <li>Игровых серверов и стриминга</li>
          </ul>

          <div>
            <div className="text-sm font-medium text-gray-900 dark:text-white mb-2">
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
                  <Badge className="bg-indigo-500/10 text-indigo-600 border-indigo-500/30 cursor-help">
                    {gpuModel}
                  </Badge>

                  {gpuTooltip.show && gpuTooltip.model === gpuModel && (
                    <div
                      ref={gpuTooltipRef}
                      className="absolute z-50 bottom-full left-1/2 transform -translate-x-1/2 mb-2 p-2 bg-background border border-border rounded-lg shadow-lg w-64"
                      style={{ transformOrigin: "center bottom" }}
                    >
                      <div className="text-xs font-semibold text-indigo-600 mb-1">
                        {gpuTooltip.model}
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-300">
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

  const renderOsSection = () => {
    if (
      !provider.technicalSpecs.availableOS ||
      provider.technicalSpecs.availableOS.length === 0
    ) {
      return null;
    }

    return (
      <div className="bg-card border border-border rounded-2xl p-4">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-9 h-9 bg-cyan-500/20 rounded-xl flex items-center justify-center">
            <Icon name="Monitor" size={18} className="text-cyan-500" />
          </div>
          <h4 className="text-base font-bold text-gray-900 dark:text-white">
            Доступные ОС
          </h4>
        </div>

        <div className="space-y-3">
          <p className="text-sm text-gray-900 dark:text-white leading-relaxed mb-2">
            Провайдер поддерживает следующие операционные системы:
          </p>

          <div>
            <div className="text-sm font-medium text-gray-900 dark:text-white mb-2">
              Доступные операционные системы:
            </div>
            <div className="flex flex-wrap gap-2">
              {provider.technicalSpecs.availableOS.map((os, idx) => (
                <div
                  key={idx}
                  className="relative"
                  onMouseEnter={() => showOsTooltip(os)}
                  onMouseLeave={hideOsTooltip}
                >
                  <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/30 cursor-help">
                    {os}
                  </Badge>

                  {osTooltip.show && osTooltip.os === os && (
                    <div
                      ref={osTooltipRef}
                      className="absolute z-50 bottom-full left-1/2 transform -translate-x-1/2 mb-2 p-2 bg-background border border-border rounded-lg shadow-lg w-64"
                      style={{ transformOrigin: "center bottom" }}
                    >
                      <div className="text-xs font-semibold text-emerald-600 mb-1">
                        {osTooltip.os}
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-300">
                        {osTooltip.description}
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

  const render1CSection = () => {
    if (!provider.technicalSpecs.supports1C) {
      return null;
    }

    return (
      <div className="bg-card border border-border rounded-2xl p-4">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-9 h-9 bg-green-500/20 rounded-xl flex items-center justify-center">
            <Icon name="Database" size={18} className="text-green-500" />
          </div>
          <h4 className="text-base font-bold text-gray-900 dark:text-white">
            Поддержка 1С
          </h4>
        </div>

        <div className="space-y-3">
          <p className="text-sm text-gray-900 dark:text-white leading-relaxed mb-2">
            Провайдер специализируется на размещении решений 1С и предоставляет:
          </p>
          <ul className="list-disc pl-5 text-sm text-gray-900 dark:text-white leading-relaxed space-y-1">
            <li>Оптимизированные серверы для 1С:Предприятие 8</li>
            <li>Выделенные серверы для баз данных 1С</li>
            <li>Автоматическое резервное копирование конфигураций</li>
            <li>Техническую поддержку по настройке 1С</li>
            <li>Быструю миграцию существующих баз 1С в облако</li>
          </ul>
        </div>
      </div>
    );
  };

  const renderAISection = () => {
    if (!provider.technicalSpecs.supportsAI) {
      return null;
    }

    return (
      <div className="bg-card border border-border rounded-2xl p-4">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-9 h-9 bg-pink-500/20 rounded-xl flex items-center justify-center">
            <Icon name="Cpu" size={18} className="text-pink-500" />
          </div>
          <h4 className="text-base font-bold text-gray-900 dark:text-white">
            Поддержка AI/ML
          </h4>
        </div>

        <div className="space-y-3">
          <p className="text-sm text-gray-900 dark:text-white leading-relaxed mb-2">
            Провайдер предоставляет инфраструктуру для проектов искусственного
            интеллекта и машинного обучения:
          </p>
          <ul className="list-disc pl-5 text-sm text-gray-900 dark:text-white leading-relaxed space-y-1 mb-4">
            <li>Выделенные серверы с GPU для обучения моделей</li>
            <li>Поддержка популярных ML-фреймворков</li>
            <li>Готовые образы с предустановленным ПО</li>
            <li>Инструменты для мониторинга и управления ресурсами</li>
          </ul>

          {provider.technicalSpecs.aiFeatures &&
            provider.technicalSpecs.aiFeatures.length > 0 && (
              <div>
                <div className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                  AI/ML возможности:
                </div>
                <div className="relative">
                  <div
                    className="flex flex-wrap gap-2"
                    onMouseEnter={showAiTooltip}
                    onMouseLeave={hideAiTooltip}
                  >
                    {provider.technicalSpecs.aiFeatures
                      .slice(0, 3)
                      .map((feature, idx) => (
                        <Badge
                          key={idx}
                          className="bg-pink-500/10 text-pink-600 border-pink-500/30 cursor-help"
                        >
                          {feature}
                        </Badge>
                      ))}
                    {provider.technicalSpecs.aiFeatures.length > 3 && (
                      <Badge className="bg-pink-500/10 text-pink-600 border-pink-500/30 cursor-help">
                        +{provider.technicalSpecs.aiFeatures.length - 3}
                      </Badge>
                    )}
                  </div>

                  {aiTooltip.show && (
                    <div
                      ref={aiTooltipRef}
                      className="absolute z-50 bottom-full left-1/2 transform -translate-x-1/2 mb-2 p-2 bg-background border border-border rounded-lg shadow-lg w-64"
                      style={{ transformOrigin: "center bottom" }}
                    >
                      <div className="text-xs font-semibold text-pink-600 mb-1">
                        Все AI/ML возможности:
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-300">
                        <ul className="list-disc pl-3 space-y-1">
                          {aiTooltip.features.map((feature, idx) => (
                            <li key={idx}>{feature}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
        </div>
      </div>
    );
  };

  const renderMobileAppSection = () => {
    return (
      <div className="bg-card border border-border rounded-2xl p-4">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-9 h-9 bg-pink-500/20 rounded-xl flex items-center justify-center">
            <Icon
              name={provider.mobileApp ? "Smartphone" : "SmartphoneOff"}
              size={18}
              className={
                provider.mobileApp
                  ? "text-pink-500"
                  : "text-gray-600 dark:text-gray-300"
              }
            />
          </div>
          <h4 className="text-base font-bold text-gray-900 dark:text-white">
            Мобильное приложение
          </h4>
          <Badge
            className={
              provider.mobileApp
                ? "bg-green-500/10 text-green-600 border-green-500/30 ml-auto"
                : "bg-gray-500/10 text-gray-600 border-gray-500/30 ml-auto"
            }
          >
            {provider.mobileApp ? "Доступно" : "Отсутствует"}
          </Badge>
        </div>
        <p className="text-sm text-gray-900 dark:text-white leading-relaxed">
          {provider.mobileApp
            ? "Провайдер предоставляет мобильное приложение для управления серверами и мониторинга"
            : "Провайдер не предоставляет мобильное приложение"}
        </p>
      </div>
    );
  };

  const renderOrderServicesSection = () => {
    return (
      <div className="bg-card border border-border rounded-2xl p-4">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-9 h-9 bg-amber-500/20 rounded-xl flex items-center justify-center">
            <Icon name="ClipboardCheck" size={18} className="text-amber-500" />
          </div>
          <h4 className="text-base font-bold text-gray-900 dark:text-white">
            Заказ услуг
          </h4>
          <Badge
            className={
              provider.orderBeforeRegistration
                ? "bg-green-500/10 text-green-600 border-green-500/30 ml-auto"
                : "bg-blue-500/10 text-blue-600 border-blue-500/30 ml-auto"
            }
          >
            {provider.orderBeforeRegistration
              ? "До регистрации"
              : "После регистрации"}
          </Badge>
        </div>
        <p className="text-sm text-gray-900 dark:text-white leading-relaxed">
          {provider.orderBeforeRegistration
            ? "Возможность заказать услуги и настроить сервер до создания учетной записи"
            : "Требуется регистрация и создание учетной записи перед заказом услуг"}
        </p>
      </div>
    );
  };

  // Новая секция: О провайдере
  const renderAboutSection = () => {
    if (!provider.about) {
      return null;
    }

    return (
      <div className="bg-card border border-border rounded-2xl p-4 col-span-full">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-9 h-9 bg-primary/20 rounded-xl flex items-center justify-center">
            <Icon name="Info" size={18} className="text-primary" />
          </div>
          <h4 className="text-base font-bold text-gray-900 dark:text-white">
            О провайдере
          </h4>
        </div>
        <div className="space-y-3">
          <p className="text-sm text-gray-900 dark:text-white leading-relaxed whitespace-pre-line">
            {provider.about}
          </p>
        </div>
      </div>
    );
  };

  // Новая секция: Контакты
  const renderContactsSection = () => {
    if (!provider.contactInfo) {
      return null;
    }

    const contact = provider.contactInfo;

    return (
      <div className="bg-card border border-border rounded-2xl p-4">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-9 h-9 bg-blue-500/20 rounded-xl flex items-center justify-center">
            <Icon name="Phone" size={18} className="text-blue-500" />
          </div>
          <h4 className="text-base font-bold text-gray-900 dark:text-white">
            Контакты
          </h4>
        </div>
        <div className="space-y-3">
          {contact.website && (
            <div className="flex items-start gap-2">
              <Icon name="Globe" size={16} className="text-primary mt-0.5" />
              <div>
                <div className="text-sm font-medium text-gray-900 dark:text-white">
                  Сайт
                </div>
                <a
                  href={contact.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-primary hover:underline"
                >
                  {contact.website.replace(/^https?:\/\//, "")}
                </a>
              </div>
            </div>
          )}

          {contact.email && (
            <div className="flex items-start gap-2">
              <Icon name="Mail" size={16} className="text-primary mt-0.5" />
              <div>
                <div className="text-sm font-medium text-gray-900 dark:text-white">
                  Email
                </div>
                <a
                  href={`mailto:${contact.email}`}
                  className="text-sm text-primary hover:underline"
                >
                  {contact.email}
                </a>
              </div>
            </div>
          )}

          {contact.phone && (
            <div className="flex items-start gap-2">
              <Icon
                name="PhoneCall"
                size={16}
                className="text-primary mt-0.5"
              />
              <div>
                <div className="text-sm font-medium text-gray-900 dark:text-white">
                  Телефон
                </div>
                <a
                  href={`tel:${contact.phone}`}
                  className="text-sm text-primary hover:underline"
                >
                  {contact.phone}
                </a>
              </div>
            </div>
          )}

          {contact.supportEmail && (
            <div className="flex items-start gap-2">
              <Icon
                name="Headphones"
                size={16}
                className="text-primary mt-0.5"
              />
              <div>
                <div className="text-sm font-medium text-gray-900 dark:text-white">
                  Поддержка
                </div>
                <a
                  href={`mailto:${contact.supportEmail}`}
                  className="text-sm text-primary hover:underline"
                >
                  {contact.supportEmail}
                </a>
              </div>
            </div>
          )}

          {contact.workingHours && (
            <div className="flex items-start gap-2">
              <Icon name="Clock" size={16} className="text-primary mt-0.5" />
              <div>
                <div className="text-sm font-medium text-gray-900 dark:text-white">
                  Часы работы
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300">
                  {contact.workingHours}
                </div>
              </div>
            </div>
          )}

          {contact.socialMedia && (
            <div className="pt-2">
              <div className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                Социальные сети
              </div>
              <div className="flex gap-2">
                {contact.socialMedia.telegram && (
                  <a
                    href={contact.socialMedia.telegram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center hover:bg-blue-500/30 transition-colors"
                    title="Telegram"
                  >
                    <Icon name="Send" size={14} className="text-blue-500" />
                  </a>
                )}
                {contact.socialMedia.vkontakte && (
                  <a
                    href={contact.socialMedia.vkontakte}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center hover:bg-blue-500/30 transition-colors"
                    title="VKontakte"
                  >
                    <Icon
                      name="MessageSquare"
                      size={14}
                      className="text-blue-500"
                    />
                  </a>
                )}
                {contact.socialMedia.youtube && (
                  <a
                    href={contact.socialMedia.youtube}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 bg-red-500/20 rounded-lg flex items-center justify-center hover:bg-red-500/30 transition-colors"
                    title="YouTube"
                  >
                    <Icon name="Youtube" size={14} className="text-red-500" />
                  </a>
                )}
                {contact.socialMedia.habr && (
                  <a
                    href={contact.socialMedia.habr}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 bg-blue-700/20 rounded-lg flex items-center justify-center hover:bg-blue-700/30 transition-colors"
                    title="Habr"
                  >
                    <Icon name="BookOpen" size={14} className="text-blue-700" />
                  </a>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Новая секция: Реферальная программа
  const renderReferralProgramSection = () => {
    if (!provider.referralProgram || !provider.referralProgram.available) {
      return null;
    }

    const program = provider.referralProgram;

    return (
      <div className="bg-card border border-border rounded-2xl p-4">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-9 h-9 bg-green-500/20 rounded-xl flex items-center justify-center">
            <Icon name="Users" size={18} className="text-green-500" />
          </div>
          <h4 className="text-base font-bold text-gray-900 dark:text-white">
            Партнерская программа
          </h4>
        </div>
        <div className="space-y-3">
          <p className="text-sm text-gray-900 dark:text-white leading-relaxed mb-2">
            Партнерское вознаграждение за привлечение клиентов:
          </p>

          <div className="space-y-2">
            {program.commissionRules.map((rule, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-2 bg-background/50 rounded-lg border border-border"
              >
                <span className="text-sm text-gray-900 dark:text-white">
                  {rule.service}
                </span>
                <Badge className="bg-green-500/10 text-green-600 border-green-500/30">
                  {rule.commission}
                </Badge>
              </div>
            ))}
          </div>

          {program.minPayout && (
            <div className="text-sm text-gray-600 dark:text-gray-300">
              Минимальная выплата: {program.minPayout} ₽
            </div>
          )}

          {program.payoutMethods && program.payoutMethods.length > 0 && (
            <div className="text-sm text-gray-600 dark:text-gray-300">
              Способы выплат: {program.payoutMethods.join(", ")}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div
      ref={cardRef}
      className={`relative flex flex-col group ${
        showDetails ? "col-span-full z-10" : ""
      }`}
    >
      <Card
        className={`glass-effect rounded-2xl overflow-visible relative flex flex-col hover-lift h-full
    ${
      isSelected
        ? "border-[#FF931F]/50 shadow-lg shadow-[#FF931F]/30"
        : "border-[#FF931F]/20"
    }
    hover:bg-gradient-to-br hover:from-[#FFF5EB] hover:via-[#FFF9F2] hover:to-[#FFFDF9]
    dark:hover:from-[#332211] dark:hover:via-[#221A14] dark:hover:to-[#1A1512]
    transition-all duration-300 ease-in-out
  `}
      >
        {/* Половина оранжевого круга - градиент, плавно переходящий в карточку */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[160px] h-[90px] opacity-0 group-hover:opacity-90 transition-opacity duration-700 pointer-events-none overflow-hidden rounded-t-none rounded-b-full">
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 w-[160px] h-[160px] rounded-full blur-2xl"
            style={{
              background:
                "radial-gradient(circle at center 20%, #FF931F 0%, #FFB366 30%, #FFD9B3 60%, #FFF5EB 85%, transparent 98%)",
            }}
          ></div>
        </div>

        <CardHeader className="p-5 relative z-10">
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
              {/* Секция "О провайдере" (первая, на всю ширину) */}
              {renderAboutSection()}

              {/* Первый ряд: Соответствие 152-ФЗ и ФСТЭК */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {provider.fz152Compliant && (
                  <div className="bg-card border border-border rounded-2xl p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-9 h-9 bg-blue-500/20 rounded-xl flex items-center justify-center">
                        <Icon
                          name="ShieldCheck"
                          size={18}
                          className="text-blue-500"
                        />
                      </div>
                      <h4 className="text-base font-bold text-gray-900 dark:text-white">
                        {t("card.fz152")}
                      </h4>
                      {provider.fz152Level && (
                        <Badge className="bg-blue-500/20 text-blue-600 border-blue-500/30 ml-auto">
                          {provider.fz152Level}
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-900 dark:text-white leading-relaxed">
                      {t("card.fz152Description")}
                    </p>
                  </div>
                )}

                {provider.fstekCertifications &&
                  provider.fstekCertifications.length > 0 && (
                    <div className="bg-card border border-border rounded-2xl p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-9 h-9 bg-blue-500/20 rounded-xl flex items-center justify-center">
                          <Icon
                            name="ShieldAlert"
                            size={18}
                            className="text-blue-500"
                          />
                        </div>
                        <h4 className="text-base font-bold text-gray-900 dark:text-white">
                          ФСТЭК
                        </h4>
                        {provider.fstekLevel && (
                          <Badge className="bg-blue-500/20 text-blue-600 border-blue-500/30 ml-auto">
                            {provider.fstekLevel}
                          </Badge>
                        )}
                      </div>

                      {renderFstekCertifications()}
                    </div>
                  )}
              </div>

              {/* Второй ряд: Размещение КИИ и Дополнительные услуги */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {provider.kiiPlacement && (
                  <div className="bg-card border border-border rounded-2xl p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-9 h-9 bg-blue-500/20 rounded-xl flex items-center justify-center">
                        <Icon
                          name="Building2"
                          size={18}
                          className="text-blue-500"
                        />
                      </div>
                      <h4 className="text-base font-bold text-gray-900 dark:text-white">
                        Размещение КИИ
                      </h4>
                    </div>
                    <p className="text-sm text-gray-900 dark:text-white leading-relaxed">
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

                {renderAdditionalServices()}
              </div>

              {/* Третий ряд: Заказ услуг и Данные для регистрации */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {renderOrderServicesSection()}
                {renderRegistrationData()}
              </div>

              {/* Четвертый ряд: Поддерживаемые типы клиентов и Мобильное приложение */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {renderClientTypes()}
                {renderMobileAppSection()}
              </div>

              {/* Пятый ряд: Поддержка GPU и Доступные ОС */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {renderGpuSection()}
                {renderOsSection()}
              </div>

              {/* Шестой ряд: Технические характеристики и Поддержка 1С */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="bg-card border border-border rounded-2xl p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-9 h-9 bg-violet-500/20 rounded-xl flex items-center justify-center">
                      <Icon
                        name="Settings"
                        size={18}
                        className="text-violet-500"
                      />
                    </div>
                    <h4 className="text-base font-bold text-gray-900 dark:text-white">
                      Технические характеристики
                    </h4>
                  </div>
                  <TechnicalSpecsSection provider={provider} />
                </div>
                {render1CSection()}
              </div>

              {/* Седьмой ряд: Поддержка AI и Гарантии обслуживания */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {renderAISection()}

                <div className="bg-card border border-border rounded-2xl p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-9 h-9 bg-orange-500/20 rounded-xl flex items-center justify-center">
                      <Icon
                        name="Award"
                        size={18}
                        className="text-orange-500"
                      />
                    </div>
                    <h4 className="text-base font-bold text-gray-900 dark:text-white">
                      Гарантии обслуживания
                    </h4>
                  </div>
                  <ServiceGuaranteesSection provider={provider} />
                </div>
              </div>

              {/* Остальные секции */}
              <div className="bg-card border border-border rounded-2xl p-4">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-9 h-9 bg-emerald-500/20 rounded-xl flex items-center justify-center">
                    <Icon
                      name="Package"
                      size={18}
                      className="text-emerald-500"
                    />
                  </div>
                  <h4 className="text-base font-bold text-gray-900 dark:text-white">
                    Дополнительные услуги
                  </h4>
                </div>
                <AdditionalServicesSection provider={provider} />
              </div>

              <div className="bg-card border border-border rounded-2xl p-4">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-9 h-9 bg-rose-500/20 rounded-xl flex items-center justify-center">
                    <Icon
                      name="CreditCard"
                      size={18}
                      className="text-rose-500"
                    />
                  </div>
                  <h4 className="text-base font-bold text-gray-900 dark:text-white">
                    Способы оплаты
                  </h4>
                </div>
                <PaymentMethodsSection provider={provider} />
              </div>

              <div className="bg-card border border-border rounded-2xl p-4">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-9 h-9 bg-sky-500/20 rounded-xl flex items-center justify-center">
                    <Icon name="Briefcase" size={18} className="text-sky-500" />
                  </div>
                  <h4 className="text-base font-bold text-gray-900 dark:text-white">
                    Кейсы
                  </h4>
                </div>
                <CaseStudiesSection provider={provider} />
              </div>

              {/* Восьмой ряд: Контакты и Реферальная программа (рядом) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {renderContactsSection()}
                {renderReferralProgramSection()}
              </div>

              {/* Плюсы и минусы */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-2xl p-4">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-9 h-9 bg-emerald-500/20 rounded-xl flex items-center justify-center">
                      <Icon
                        name="Check"
                        size={18}
                        className="text-emerald-500"
                      />
                    </div>
                    <h4 className="text-base font-bold text-gray-900 dark:text-white">
                      {t("card.pros")}
                    </h4>
                  </div>
                  <ul className="space-y-2.5">
                    {provider.pros.map((pro, idx) => (
                      <li key={idx} className="flex items-start gap-2.5">
                        <div className="w-5 h-5 bg-emerald-500/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Icon
                            name="Plus"
                            size={12}
                            className="text-emerald-500"
                          />
                        </div>
                        <span className="text-sm text-gray-900 dark:text-white font-medium">
                          {pro}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-rose-500/5 border border-rose-500/20 rounded-2xl p-4">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-9 h-9 bg-rose-500/20 rounded-xl flex items-center justify-center">
                      <Icon
                        name="AlertCircle"
                        size={18}
                        className="text-rose-500"
                      />
                    </div>
                    <h4 className="text-base font-bold text-gray-900 dark:text-white">
                      {t("card.cons")}
                    </h4>
                  </div>
                  <ul className="space-y-2.5">
                    {provider.cons.map((con, idx) => (
                      <li key={idx} className="flex items-start gap-2.5">
                        <div className="w-5 h-5 bg-rose-500/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Icon
                            name="Minus"
                            size={12}
                            className="text-rose-500"
                          />
                        </div>
                        <span className="text-sm text-gray-900 dark:text-white font-medium">
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
