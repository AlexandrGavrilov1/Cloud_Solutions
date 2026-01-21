import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Icon from "@/components/ui/icon";
import { Provider, ResourceConfig } from "./types";

interface ComparisonTableProps {
  providers: Provider[];
  configs: Record<number, ResourceConfig>;
  onClose: () => void;
  calculatePrice: (provider: Provider, config: ResourceConfig) => number;
}

export const ComparisonTable = ({
  providers,
  configs,
  onClose,
  calculatePrice,
}: ComparisonTableProps) => {
  if (providers.length === 0) return null;

  const trackClick = async (providerId: number) => {
    try {
      await fetch(
        "https://functions.poehali.dev/d0b8e2ce-45c2-4ab9-8d08-baf03c0268f4",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            provider_id: providerId,
          }),
        },
      );
    } catch (error) {
      console.error("Error tracking click:", error);
    }
  };

  const handleProviderClick = async (provider: Provider) => {
    if (provider.url) {
      trackClick(provider.id);
      window.location.href = provider.url;
    }
  };

  const rows = [
    { label: "Рейтинг", key: "rating", icon: "Star" },
    {
      label: "Цена (с текущей конфигурацией)",
      key: "price",
      icon: "DollarSign",
    },
    { label: "CPU цена за 1 vCPU", key: "cpuPrice", icon: "Cpu" },
    { label: "RAM цена за 1 GB", key: "ramPrice", icon: "MemoryStick" },
    { label: "Диск цена за 1 GB", key: "storagePrice", icon: "HardDrive" },
    { label: "Тестовый период", key: "trialDays", icon: "Gift" },
    { label: "Локации серверов", key: "locations", icon: "MapPin" },
    { label: "152-ФЗ", key: "fz152", icon: "ShieldCheck" },
    { label: "ФСТЕК", key: "fstek", icon: "ShieldAlert" },
    { label: "Тип клиента", key: "clientTypes", icon: "Users" }, // Новая строка
    { label: "Техподдержка", key: "support", icon: "Headphones" },
  ];

  return (
    <div className="fixed inset-0 bg-background/95 backdrop-blur-sm z-50 overflow-y-auto">
      <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8">
        <div className="max-w-7xl mx-auto">
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
                onClick={onClose}
                className="h-9 sm:h-12 px-3 sm:px-6 rounded-xl border-2 flex-shrink-0"
              >
                <Icon name="X" size={16} className="sm:mr-2" />
                <span className="hidden sm:inline">Закрыть</span>
              </Button>
            </div>

            <div className="flex flex-wrap gap-2 sm:gap-3">
              {providers.map((provider) => {
                const hasFZ152 = provider.fz152Compliant;
                const hasFSTEK = provider.fstekCompliant;

                if (!hasFZ152 && !hasFSTEK) return null;

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
                          {provider.fstekLevel || "ФСТЕК"}
                        </Badge>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-card border-2 border-border rounded-2xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-border bg-accent/50">
                    <th className="text-left p-3 sm:p-4 md:p-6 font-bold text-foreground sticky left-0 bg-accent/50 z-10 text-xs sm:text-sm md:text-base">
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
                            const config = configs[provider.id] || {
                              cpu: 1,
                              ram: 1,
                              storage: 10,
                            };
                            const price = calculatePrice(provider, config);
                            content = (
                              <div className="text-center">
                                <span className="text-2xl font-black text-primary">
                                  {price}₽
                                </span>
                                <span className="text-sm text-muted-foreground block">
                                  /месяц
                                </span>
                              </div>
                            );
                            break;
                          case "cpuPrice":
                            content = (
                              <span className="font-semibold text-foreground">
                                {provider.cpuPrice}₽
                              </span>
                            );
                            break;
                          case "ramPrice":
                            content = (
                              <span className="font-semibold text-foreground">
                                {provider.ramPrice}₽
                              </span>
                            );
                            break;
                          case "storagePrice":
                            content = (
                              <span className="font-semibold text-foreground">
                                {provider.storagePrice}₽
                              </span>
                            );
                            break;
                          case "trialDays":
                            content = provider.trialDays ? (
                              <Badge className="bg-secondary/20 text-secondary border border-secondary/30">
                                {provider.trialDays}{" "}
                                {provider.trialDays === 1
                                  ? "день"
                                  : provider.trialDays < 5
                                    ? "дня"
                                    : "дней"}
                              </Badge>
                            ) : (
                              <span className="text-muted-foreground">Нет</span>
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
                            content = provider.fstekCompliant ? (
                              <div className="flex flex-col items-center gap-1">
                                <Icon
                                  name="Check"
                                  size={20}
                                  className="text-secondary"
                                />
                                {provider.fstekLevel && (
                                  <Badge className="bg-secondary/20 text-secondary border-0 text-xs">
                                    {provider.fstekLevel}
                                  </Badge>
                                )}
                              </div>
                            ) : (
                              <Icon name="X" size={20} className="text-muted" />
                            );
                            break;
                          case "clientTypes":
                            content =
                              provider.clientTypes &&
                              provider.clientTypes.length > 0 ? (
                                <div className="flex flex-col items-center gap-2">
                                  <div className="flex flex-wrap gap-1 justify-center max-w-[200px]">
                                    {provider.clientTypes.map((type, idx) => (
                                      <Badge
                                        key={idx}
                                        className={
                                          type === "Физлицо"
                                            ? "bg-blue-500/20 text-blue-500 border-blue-500/30 text-[10px]"
                                            : type === "Самозанятый"
                                              ? "bg-green-500/20 text-green-500 border-green-500/30 text-[10px]"
                                              : type === "ИП"
                                                ? "bg-purple-500/20 text-purple-500 border-purple-500/30 text-[10px]"
                                                : "bg-orange-500/20 text-orange-500 border-orange-500/30 text-[10px]"
                                        }
                                      >
                                        {type}
                                      </Badge>
                                    ))}
                                  </div>
                                  <span className="text-xs text-muted-foreground">
                                    {provider.clientTypes.length}{" "}
                                    {provider.clientTypes.length === 1
                                      ? "тип"
                                      : provider.clientTypes.length < 5
                                        ? "типа"
                                        : "типов"}
                                  </span>
                                </div>
                              ) : (
                                <div className="text-center">
                                  <Icon
                                    name="X"
                                    size={20}
                                    className="text-muted mx-auto"
                                  />
                                  <span className="text-xs text-muted-foreground block mt-1">
                                    Не указано
                                  </span>
                                </div>
                              );
                            break;
                          case "support":
                            content = (
                              <Badge className="bg-accent border border-primary/20 text-foreground">
                                24/7
                              </Badge>
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
                        >
                          <span className="hidden sm:inline">Перейти</span>
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
