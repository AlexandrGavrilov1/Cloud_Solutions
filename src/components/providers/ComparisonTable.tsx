// ComparisonTable.tsx
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Icon from "@/components/ui/icon";
import { Provider } from "./types";
import { useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

interface ComparisonTableProps {
  providers: Provider[];
  onClose: () => void;
}

export const ComparisonTable = ({
  providers,
  onClose,
}: ComparisonTableProps) => {
  const { t } = useLanguage();

  useEffect(() => {
    console.log("ComparisonTable mounted with providers:", providers.length);
    console.log("Providers data:", providers);
  }, [providers]);

  if (providers.length === 0) {
    console.error("ComparisonTable: No providers provided!");
    return (
      <div className="fixed inset-0 bg-background/95 backdrop-blur-sm z-[9999] overflow-y-auto flex items-center justify-center">
        <div className="bg-card p-8 rounded-2xl shadow-xl max-w-md text-center">
          <Icon
            name="AlertCircle"
            size={48}
            className="text-destructive mx-auto mb-4"
          />
          <h2 className="text-2xl font-bold mb-2">Ошибка</h2>
          <p className="text-muted-foreground mb-4">
            Нет провайдеров для сравнения
          </p>
          <Button onClick={onClose} className="w-full">
            Закрыть
          </Button>
        </div>
      </div>
    );
  }

  const handleProviderClick = async (provider: Provider) => {
    // Простая проверка Яндекс.Метрики
    if (typeof window !== "undefined" && (window as any).ym) {
      (window as any).ym(105466349, "reachGoal", "ClickOnComparisonTable", {
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

      // ОТКРЫВАЕМ В НОВОМ ОКНЕ
      window.open(provider.url, "_blank", "noopener,noreferrer");
    }
  };

  const rows = [
    { label: t("common.rating"), key: "rating", icon: "Star" },
    { label: t("common.price"), key: "price", icon: "DollarSign" },
    { label: t("common.trialPeriod"), key: "trialDays", icon: "Gift" },
    { label: t("common.datacenters"), key: "locations", icon: "MapPin" },
    { label: t("common.disks"), key: "diskType", icon: "HardDrive" },
    { label: t("common.virtualization"), key: "virtualization", icon: "Box" },
    { label: "152-ФЗ", key: "fz152", icon: "ShieldCheck" },
    { label: "ФСТЭК", key: "fstek", icon: "ShieldAlert" },
    { label: "КИИ", key: "kii", icon: "Building2" },
    { label: "Мобильное приложение", key: "mobileApp", icon: "Smartphone" },
    {
      label: "Заказ до регистрации",
      key: "orderBeforeRegistration",
      icon: "ClipboardCheck",
    },
    {
      label: t("card.additionalServices"),
      key: "additionalServices",
      icon: "Briefcase",
    },
    {
      label: t("card.supportResponseTime"),
      key: "support",
      icon: "Headphones",
    },
    {
      label: t("card.registrationData"),
      key: "registrationData",
      icon: "UserPlus",
    },
    { label: t("card.clientType"), key: "clientType", icon: "Users" },
    // Добавляем новые строки
    { label: t("common.gpu"), key: "gpu", icon: "Cpu" },
    { label: t("common.supports1C"), key: "supports1C", icon: "Database" },
  ];

  // Функция для получения текста цены
  const getPriceText = (provider: Provider) => {
    if (provider.basePrice === 0) {
      return t("common.priceOnRequest") || "Цена по запросу";
    }
    return `${provider.basePrice} ₽/${t("common.month")}`;
  };

  // Функция для получения описания GPU
  const getGpuDescription = (model: string): string => {
    const descriptions: Record<string, string> = {
      "GTX 1080": "Игровая GPU, 8GB GDDR5X, 2560 ядер CUDA",
      "GTX 1080 Ti": "Игровая GPU, 11GB GDDR5X, 3584 ядер CUDA",
      "RTX 2080 Ti":
        "Игровая/рабочая GPU, 11GB GDDR6, 4352 ядра CUDA, поддержка RTX",
      "RTX 3080": "Игровая GPU, 10GB GDDR6X, 8704 ядра CUDA",
      "RTX 3090": "Игровая/рабочая GPU, 24GB GDDR6X, 10496 ядер CUDA",
      "RTX 4090": "Игровая GPU, 24GB GDDR6X, 16384 ядра CUDA",
      A2: "Серверная GPU NVIDIA, 16GB память, для инференса и AI",
      A30: "Серверная GPU NVIDIA, 24GB HBM2, для AI и HPC",
      A2000: "Рабочая GPU, 6GB GDDR6, для рабочих станций",
      A4000: "Рабочая GPU, 16GB GDDR6, для рабочих станций и рендеринга",
      A5000: "Рабочая GPU, 24GB GDDR6, для профессионального использования",
      A6000: "Рабочая GPU, 48GB GDDR6, для профессиональных рабочих станций",
      "Tesla T4": "Серверная GPU, 16GB GDDR6, для инференса в ЦОД",
      V100: "Серверная GPU NVIDIA, 16-32GB HBM2, для машинного обучения",
      A100: "Серверная GPU NVIDIA, 40-80GB HBM2, для AI и HPC",
      H100: "Серверная GPU NVIDIA, 80GB HBM3, для AI и высокопроизводительных вычислений",
    };

    return descriptions[model] || "Графический процессор для вычислений";
  };

  return (
    <div className="fixed inset-0 bg-background/95 backdrop-blur-sm z-[9999] overflow-y-auto">
      <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8">
        <div className="max-w-7xl mx-auto">
          {/* Заголовок и кнопка закрытия */}
          <div className="flex flex-col gap-4 mb-4 sm:mb-6">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/20 rounded-2xl flex items-center justify-center">
                  <Icon
                    name="GitCompare"
                    size={20}
                    className="text-primary sm:w-6 sm:h-6"
                  />
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground">
                    Сравнение провайдеров
                  </h2>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    Выбрано: {providers.length}
                  </p>
                </div>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  console.log("Close button clicked");
                  onClose();
                }}
                className="h-9 sm:h-12 px-3 sm:px-6 rounded-xl border-2 flex-shrink-0"
              >
                <Icon name="X" size={16} className="sm:mr-2" />
                <span className="hidden sm:inline">Закрыть</span>
              </Button>
            </div>

            {/* Бейджи выбранных провайдеров */}
            <div className="flex flex-wrap gap-2 sm:gap-3">
              {providers.map((provider) => {
                const hasFZ152 = provider.fz152Compliant;
                const hasFSTEK =
                  provider.fstekCertifications &&
                  provider.fstekCertifications.length > 0;

                return (
                  <div
                    key={provider.id}
                    className="flex items-center gap-2 bg-accent/50 border border-border rounded-xl px-3 py-2"
                  >
                    <div className="w-6 h-6 rounded-lg bg-card border border-primary/10 flex items-center justify-center">
                      <img
                        src={provider.logo}
                        alt={provider.name}
                        className="w-4 h-4 object-contain"
                        onError={(e) => {
                          console.error(
                            `Failed to load logo for ${provider.name}`,
                          );
                          e.currentTarget.src = "/placeholder-logo.png";
                        }}
                      />
                    </div>
                    <span className="text-xs font-semibold text-foreground">
                      {provider.name}
                    </span>
                    <div className="flex items-center gap-1 ml-1">
                      {hasFZ152 && (
                        <Badge className="bg-primary/20 text-primary border-0 text-[10px] px-1.5 py-0.5">
                          {provider.fz152Level || "152-ФЗ"}
                        </Badge>
                      )}
                      {hasFSTEK && (
                        <Badge className="bg-secondary/20 text-secondary border-0 text-[10px] px-1.5 py-0.5">
                          ФСТЭК
                        </Badge>
                      )}
                      {provider.kiiPlacement && (
                        <Badge className="bg-blue-500/20 text-blue-500 border-0 text-[10px] px-1.5 py-0.5">
                          КИИ
                        </Badge>
                      )}
                      {provider.technicalSpecs.supports1C && (
                        <Badge className="bg-primary/20 text-primary border-0 text-[10px] px-1.5 py-0.5">
                          1С
                        </Badge>
                      )}
                      {provider.technicalSpecs.gpuModels &&
                        provider.technicalSpecs.gpuModels.length > 0 && (
                          <Badge className="bg-primary/20 text-primary border-0 text-[10px] px-1.5 py-0.5">
                            GPU
                          </Badge>
                        )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Таблица сравнения */}
          <div className="bg-card border-2 border-border rounded-2xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[800px]">
                <thead>
                  <tr className="border-b-2 border-border bg-accent/50">
                    <th className="text-left p-3 sm:p-4 md:p-6 font-bold text-foreground sticky left-0 bg-accent/50 z-10 text-xs sm:text-sm md:text-base min-w-[200px]">
                      Характеристика
                    </th>
                    {providers.map((provider) => (
                      <th
                        key={provider.id}
                        className="p-3 sm:p-4 md:p-6 min-w-[180px] sm:min-w-[220px] md:min-w-[250px]"
                      >
                        <div className="flex flex-col items-center gap-2 sm:gap-3">
                          <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-xl bg-accent border border-primary/10 flex items-center justify-center">
                            <img
                              src={provider.logo}
                              alt={provider.name}
                              className="w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 object-contain"
                              onError={(e) => {
                                e.currentTarget.src = "/placeholder-logo.png";
                              }}
                            />
                          </div>
                          <div className="text-sm sm:text-base md:text-lg font-bold text-foreground text-center">
                            {provider.name}
                          </div>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row, idx) => (
                    <tr
                      key={row.key}
                      className={idx % 2 === 0 ? "bg-accent/20" : ""}
                    >
                      <td className="p-3 sm:p-4 md:p-6 font-semibold text-foreground border-r-2 border-border sticky left-0 bg-card z-10 text-xs sm:text-sm md:text-base">
                        <div className="flex items-center gap-1.5 sm:gap-2">
                          <Icon
                            name={row.icon as any}
                            size={14}
                            className="text-primary sm:w-[18px] sm:h-[18px] flex-shrink-0"
                          />
                          <span className="leading-tight">{row.label}</span>
                        </div>
                      </td>
                      {providers.map((provider) => {
                        const avgRating =
                          provider.reviews.reduce(
                            (sum, r) => sum + r.rating,
                            0,
                          ) / provider.reviews.length;

                        let content;
                        switch (row.key) {
                          case "rating":
                            content = (
                              <div className="flex items-center justify-center gap-2">
                                <div className="flex items-center gap-1">
                                  {[...Array(5)].map((_, i) => (
                                    <Icon
                                      key={i}
                                      name="Star"
                                      size={14}
                                      className={
                                        i < Math.round(avgRating)
                                          ? "fill-primary text-primary"
                                          : "text-muted"
                                      }
                                    />
                                  ))}
                                </div>
                                <span className="font-bold text-foreground">
                                  {avgRating.toFixed(1)}
                                </span>
                              </div>
                            );
                            break;
                          case "price":
                            const priceText = getPriceText(provider);
                            content = (
                              <div className="text-center">
                                <span className="text-2xl font-black text-primary">
                                  {priceText}
                                </span>
                              </div>
                            );
                            break;
                          case "trialDays":
                            content = provider.trialDays ? (
                              <Badge className="bg-secondary/20 text-secondary border border-secondary/30">
                                {provider.trialDays}{" "}
                                {provider.trialDays === 1
                                  ? t("common.day")
                                  : provider.trialDays < 5
                                    ? t("common.daysGenitive")
                                    : t("common.days")}{" "}
                                {t("common.free")}
                              </Badge>
                            ) : (
                              <span className="text-muted-foreground">
                                {t("common.absent")}
                              </span>
                            );
                            break;
                          case "locations":
                            content = (
                              <div className="flex flex-wrap gap-1.5 justify-center">
                                {provider.locations.map((loc, i) => (
                                  <Badge
                                    key={i}
                                    variant="outline"
                                    className="text-xs"
                                  >
                                    {loc}
                                  </Badge>
                                ))}
                              </div>
                            );
                            break;
                          case "diskType":
                            content = (
                              <Badge className="bg-primary/20 text-primary border-0">
                                {provider.technicalSpecs.diskType}
                              </Badge>
                            );
                            break;
                          case "virtualization":
                            content = (
                              <div className="flex flex-wrap gap-1 justify-center">
                                {provider.technicalSpecs.virtualization.map(
                                  (virt, i) => (
                                    <Badge
                                      key={i}
                                      variant="outline"
                                      className="text-xs"
                                    >
                                      {virt}
                                    </Badge>
                                  ),
                                )}
                              </div>
                            );
                            break;
                          case "fz152":
                            content = provider.fz152Compliant ? (
                              <div className="flex flex-col items-center gap-1">
                                <Icon
                                  name="Check"
                                  size={20}
                                  className="text-secondary"
                                />
                                {provider.fz152Level && (
                                  <Badge className="bg-primary/20 text-primary border-0 text-xs">
                                    {provider.fz152Level}
                                  </Badge>
                                )}
                              </div>
                            ) : (
                              <Icon name="X" size={20} className="text-muted" />
                            );
                            break;
                          case "fstek":
                            content =
                              provider.fstekCertifications &&
                              provider.fstekCertifications.length > 0 ? (
                                <div className="flex flex-col items-center gap-1">
                                  <Icon
                                    name="Check"
                                    size={20}
                                    className="text-secondary"
                                  />
                                  <div className="flex flex-wrap gap-1">
                                    {provider.fstekCertifications.map(
                                      (cert, idx) => (
                                        <Badge
                                          key={idx}
                                          className="bg-secondary/20 text-secondary border-0 text-xs"
                                        >
                                          {cert}
                                        </Badge>
                                      ),
                                    )}
                                  </div>
                                </div>
                              ) : (
                                <Icon
                                  name="X"
                                  size={20}
                                  className="text-muted"
                                />
                              );
                            break;
                          case "kii":
                            content = provider.kiiPlacement ? (
                              <div className="flex flex-col items-center gap-1">
                                <Icon
                                  name="Check"
                                  size={20}
                                  className="text-blue-500"
                                />
                                <Badge className="bg-blue-500/20 text-blue-500 border-0 text-xs">
                                  Размещение КИИ
                                </Badge>
                              </div>
                            ) : (
                              <Icon name="X" size={20} className="text-muted" />
                            );
                            break;
                          case "mobileApp":
                            content = provider.mobileApp ? (
                              <div className="flex flex-col items-center gap-1">
                                <Icon
                                  name="Check"
                                  size={20}
                                  className="text-green-500"
                                />
                                <Badge className="bg-green-500/20 text-green-500 border-0 text-xs">
                                  Есть
                                </Badge>
                              </div>
                            ) : (
                              <div className="flex flex-col items-center gap-1">
                                <Icon
                                  name="X"
                                  size={20}
                                  className="text-red-500"
                                />
                                <Badge className="bg-red-500/20 text-red-500 border-0 text-xs">
                                  Нет
                                </Badge>
                              </div>
                            );
                            break;
                          case "orderBeforeRegistration":
                            content = provider.orderBeforeRegistration ? (
                              <div className="flex flex-col items-center gap-1">
                                <Icon
                                  name="Check"
                                  size={20}
                                  className="text-green-500"
                                />
                                <Badge className="bg-green-500/20 text-green-500 border-0 text-xs">
                                  До регистрации
                                </Badge>
                              </div>
                            ) : (
                              <div className="flex flex-col items-center gap-1">
                                <Icon
                                  name="X"
                                  size={20}
                                  className="text-orange-500"
                                />
                                <Badge className="bg-orange-500/20 text-orange-500 border-0 text-xs">
                                  После регистрации
                                </Badge>
                              </div>
                            );
                            break;
                          case "additionalServices":
                            content =
                              provider.additionalServicesList &&
                              provider.additionalServicesList.length > 0 ? (
                                <div className="flex flex-col items-center gap-1">
                                  <Icon
                                    name="Check"
                                    size={20}
                                    className="text-purple-500"
                                  />
                                  <div className="flex flex-wrap gap-1 justify-center max-w-[200px]">
                                    {provider.additionalServicesList
                                      .slice(0, 3)
                                      .map((service, idx) => (
                                        <Badge
                                          key={idx}
                                          className="bg-purple-500/20 text-purple-500 border-0 text-[10px]"
                                        >
                                          {service}
                                        </Badge>
                                      ))}
                                    {provider.additionalServicesList.length >
                                      3 && (
                                      <Badge className="bg-purple-500/20 text-purple-500 border-0 text-[10px]">
                                        +
                                        {provider.additionalServicesList
                                          .length - 3}
                                      </Badge>
                                    )}
                                  </div>
                                </div>
                              ) : (
                                <Icon
                                  name="X"
                                  size={20}
                                  className="text-muted"
                                />
                              );
                            break;
                          case "support":
                            const supportTime =
                              provider.serviceGuarantees?.supportResponseTime ||
                              "24/7";
                            content = (
                              <Badge className="bg-accent border border-primary/20 text-foreground">
                                {supportTime}
                              </Badge>
                            );
                            break;
                          case "registrationData":
                            content =
                              provider.registrationData &&
                              provider.registrationData.length > 0 ? (
                                <div className="space-y-1">
                                  <div className="text-xs font-semibold text-foreground">
                                    {t("card.requiredData")}:
                                  </div>
                                  <div className="flex flex-wrap gap-1 mt-1 justify-center">
                                    {provider.registrationData
                                      .slice(0, 2)
                                      .map((field, idx) => (
                                        <Badge
                                          key={idx}
                                          className="bg-indigo-500/20 text-indigo-500 border-0 text-[10px]"
                                        >
                                          {field}
                                        </Badge>
                                      ))}
                                    {provider.registrationData.length > 2 && (
                                      <Badge className="bg-indigo-500/20 text-indigo-500 border-0 text-[10px]">
                                        +{provider.registrationData.length - 2}
                                      </Badge>
                                    )}
                                  </div>
                                </div>
                              ) : (
                                <span className="text-muted-foreground">
                                  {t("card.optionalData")}
                                </span>
                              );
                            break;
                          case "clientType":
                            content =
                              provider.supportedClientTypes &&
                              provider.supportedClientTypes.length > 0 ? (
                                <div className="flex flex-wrap gap-1 justify-center">
                                  {provider.supportedClientTypes
                                    .slice(0, 3)
                                    .map((type, idx) => (
                                      <Badge
                                        key={idx}
                                        className={`text-[10px] ${
                                          type === "Физлицо"
                                            ? "bg-blue-500/20 text-blue-500 border-0"
                                            : "bg-purple-500/20 text-purple-500 border-0"
                                        }`}
                                      >
                                        {type}
                                      </Badge>
                                    ))}
                                  {provider.supportedClientTypes.length > 3 && (
                                    <Badge className="bg-blue-500/20 text-blue-500 border-0 text-[10px]">
                                      +
                                      {provider.supportedClientTypes.length - 3}
                                    </Badge>
                                  )}
                                </div>
                              ) : (
                                <span className="text-muted-foreground">
                                  {t("card.supportedClients")}
                                </span>
                              );
                            break;
                          case "gpu":
                            content =
                              provider.technicalSpecs.gpuModels &&
                              provider.technicalSpecs.gpuModels.length > 0 ? (
                                <div className="flex flex-col items-center gap-1">
                                  <Icon
                                    name="Check"
                                    size={20}
                                    className="text-purple-500"
                                  />
                                  <div className="flex flex-wrap gap-1 justify-center max-w-[200px]">
                                    {provider.technicalSpecs.gpuModels
                                      .slice(0, 3)
                                      .map((gpu, idx) => (
                                        <div
                                          key={idx}
                                          className="relative group"
                                        >
                                          <Badge className="bg-purple-500/20 text-purple-500 border-0 text-[10px] cursor-help">
                                            {gpu}
                                          </Badge>
                                          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block z-50">
                                            <div className="bg-background border border-border rounded-lg shadow-lg p-2 w-64">
                                              <div className="text-xs font-semibold text-foreground">
                                                {gpu}
                                              </div>
                                              <div className="text-xs text-muted-foreground">
                                                {getGpuDescription(gpu)}
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      ))}
                                    {provider.technicalSpecs.gpuModels.length >
                                      3 && (
                                      <Badge className="bg-purple-500/20 text-purple-500 border-0 text-[10px]">
                                        +
                                        {provider.technicalSpecs.gpuModels
                                          .length - 3}
                                      </Badge>
                                    )}
                                  </div>
                                </div>
                              ) : (
                                <div className="flex flex-col items-center gap-1">
                                  <Icon
                                    name="X"
                                    size={20}
                                    className="text-red-500"
                                  />
                                  <Badge className="bg-red-500/20 text-red-500 border-0 text-xs">
                                    {t("card.no")}
                                  </Badge>
                                </div>
                              );
                            break;
                          case "supports1C":
                            content = provider.technicalSpecs.supports1C ? (
                              <div className="flex flex-col items-center gap-1">
                                <Icon
                                  name="Check"
                                  size={20}
                                  className="text-green-500"
                                />
                                <Badge className="bg-green-500/20 text-green-500 border-0 text-xs">
                                  1С
                                </Badge>
                              </div>
                            ) : (
                              <div className="flex flex-col items-center gap-1">
                                <Icon
                                  name="X"
                                  size={20}
                                  className="text-red-500"
                                />
                                <Badge className="bg-red-500/20 text-red-500 border-0 text-xs">
                                  {t("card.no")}
                                </Badge>
                              </div>
                            );
                            break;
                          default:
                            content = null;
                        }

                        return (
                          <td
                            key={provider.id}
                            className="p-3 sm:p-4 md:p-6 text-center"
                          >
                            {content}
                          </td>
                        );
                      })}
                    </tr>
                  ))}

                  {/* Кнопка перехода */}
                  <tr className="bg-accent/30 border-t-2 border-border">
                    <td className="p-3 sm:p-4 md:p-6 font-bold text-foreground sticky left-0 bg-accent/30 z-10 text-xs sm:text-sm md:text-base">
                      Действия
                    </td>
                    {providers.map((provider) => (
                      <td
                        key={provider.id}
                        className="p-3 sm:p-4 md:p-6 text-center"
                      >
                        <Button
                          className="w-full h-9 sm:h-10 md:h-11 font-bold bg-primary text-background text-xs sm:text-sm"
                          onClick={() => handleProviderClick(provider)}
                          disabled={!provider.url}
                          aria-label={`Перейти на сайт ${provider.name}`}
                        >
                          <span className="hidden sm:inline">
                            {t("common.goTo")}
                          </span>
                          <Icon
                            name="ExternalLink"
                            size={16}
                            className="sm:ml-2"
                          />
                        </Button>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
