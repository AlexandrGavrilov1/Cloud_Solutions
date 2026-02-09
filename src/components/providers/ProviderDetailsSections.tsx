import { Badge } from "@/components/ui/badge";
import Icon from "@/components/ui/icon";
import { Provider } from "./types";
import { useLanguage } from "@/contexts/LanguageContext";

// TechnicalSpecsSection
interface TechnicalSpecsSectionProps {
  provider: Provider;
}

export const TechnicalSpecsSection = ({
  provider,
}: TechnicalSpecsSectionProps) => {
  const { technicalSpecs } = provider;
  const { t } = useLanguage();

  return (
    <div className="space-y-4">
      <div className="grid md:grid-cols-3 gap-4">
        {/* Тип дисков */}
        <div className="flex items-start gap-3">
          <Icon name="HardDrive" size={16} className="text-violet-500 mt-0.5" />
          <div>
            <div className="text-xs text-muted-foreground mb-0.5">
              {t("common.disks")}
            </div>
            <Badge className="bg-violet-500/10 border border-violet-500/30 text-violet-600 font-bold text-xs transition-all duration-300 hover:bg-violet-500/20 hover:scale-105 hover:shadow-md cursor-default">
              <Icon name="HardDrive" size={12} className="mr-1" />
              {technicalSpecs.diskType}
            </Badge>
          </div>
        </div>

        {/* Скорость сети */}
        <div className="flex items-start gap-3">
          <Icon name="Wifi" size={16} className="text-blue-500 mt-0.5" />
          <div>
            <div className="text-xs text-muted-foreground dark:text-gray-400 mb-0.5">
              {t("card.networkSpeed")}
            </div>
            <Badge className="bg-blue-500/10 border border-blue-500/30 text-blue-600 font-bold text-xs transition-all duration-300 hover:bg-blue-500/20 hover:scale-105 hover:shadow-md cursor-default">
              <Icon name="Zap" size={12} className="mr-1" />
              {technicalSpecs.networkSpeed}
            </Badge>
          </div>
        </div>

        {/* Виртуализация */}
        <div className="flex items-start gap-3">
          <Icon name="Box" size={16} className="text-cyan-500 mt-0.5" />
          <div>
            <div className="text-xs text-muted-foreground dark:text-gray-400 mb-0.5">
              {t("common.virtualization")}
            </div>
            <div className="flex flex-wrap gap-1.5">
              {technicalSpecs.virtualization.map((virt, idx) => (
                <Badge
                  key={idx}
                  className="bg-cyan-500/10 border border-cyan-500/30 text-cyan-600 font-bold text-xs transition-all duration-300 hover:bg-cyan-500/20 hover:scale-105 hover:shadow-md cursor-default"
                >
                  <Icon name="Box" size={12} className="mr-1" />
                  {virt}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        {/* DDoS защита */}
        <div className="flex items-start gap-3">
          <Icon name="Shield" size={16} className="text-amber-500 mt-0.5" />
          <div>
            <div className="text-xs text-muted-foreground dark:text-gray-400 mb-0.5">
              {t("card.ddosProtection")}
            </div>
            <Badge className="bg-amber-500/10 border border-amber-500/30 text-amber-600 font-bold text-xs transition-all duration-300 hover:bg-amber-500/20 hover:scale-105 hover:shadow-md cursor-default">
              <Icon name="ShieldCheck" size={12} className="mr-1" />
              {technicalSpecs.ddosProtection}
            </Badge>
          </div>
        </div>

        {/* Панель управления */}
        <div className="flex items-start gap-3">
          <Icon name="Layout" size={16} className="text-purple-500 mt-0.5" />
          <div>
            <div className="text-xs text-muted-foreground dark:text-gray-400 mb-0.5">
              {t("card.controlPanel")}
            </div>
            <Badge className="bg-purple-500/10 border border-purple-500/30 text-purple-600 font-bold text-xs transition-all duration-300 hover:bg-purple-500/20 hover:scale-105 hover:shadow-md cursor-default">
              <Icon name="Monitor" size={12} className="mr-1" />
              {technicalSpecs.controlPanel}
            </Badge>
          </div>
        </div>

        {/* IP */}
        <div className="flex items-start gap-3">
          <Icon name="Network" size={16} className="text-indigo-500 mt-0.5" />
          <div>
            <div className="text-xs text-muted-foreground dark:text-gray-400 mb-0.5">IP</div>
            <div className="flex gap-1.5">
              {technicalSpecs.ipv4 && (
                <Badge className="bg-indigo-500/10 border border-indigo-500/30 text-indigo-600 text-xs">
                  IPv4
                </Badge>
              )}
              {technicalSpecs.ipv6 && (
                <Badge className="bg-indigo-500/10 border border-indigo-500/30 text-indigo-600 text-xs">
                  IPv6
                </Badge>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Процессоры - только если есть */}
      {technicalSpecs.cpuModels && technicalSpecs.cpuModels.length > 0 && (
        <div className="pt-4 border-t border-border">
          <div className="flex items-center gap-2 mb-2">
            <Icon name="Cpu" size={16} className="text-emerald-500" />
            <div className="text-sm font-semibold text-emerald-600">
              Процессоры:
            </div>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {technicalSpecs.cpuModels.map((cpu, idx) => (
              <Badge
                key={idx}
                className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 text-xs"
              >
                {cpu}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Опции памяти - только если есть */}
      {technicalSpecs.memoryOptions &&
        technicalSpecs.memoryOptions.length > 0 && (
          <div className="pt-4 border-t border-border">
            <div className="flex items-center gap-2 mb-2">
              <Icon name="MemoryStick" size={16} className="text-rose-500" />
              <div className="text-sm font-semibold text-rose-600">
                Опции памяти:
              </div>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {technicalSpecs.memoryOptions.map((memory, idx) => (
                <Badge
                  key={idx}
                  className="bg-rose-500/10 border border-rose-500/30 text-rose-600 text-xs"
                >
                  {memory}
                </Badge>
              ))}
            </div>
          </div>
        )}

      {/* Дополнительные возможности */}
      {(technicalSpecs.guaranteedResources ||
        technicalSpecs.apiAccess ||
        technicalSpecs.customOS) && (
        <div className="pt-4 border-t border-border">
          <div className="flex items-center gap-2 mb-2">
            <Icon name="CheckCircle" size={16} className="text-teal-500" />
            <div className="text-sm font-semibold text-teal-600">
              Дополнительные возможности:
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            {technicalSpecs.guaranteedResources && (
              <div className="flex items-center gap-1.5 text-xs">
                <Icon name="Check" size={14} className="text-teal-500" />
                <span className="text-teal-600 font-medium">
                  {t("card.guaranteedResources")}
                </span>
              </div>
            )}
            {technicalSpecs.apiAccess && (
              <div className="flex items-center gap-1.5 text-xs">
                <Icon name="Code" size={14} className="text-teal-500" />
                <span className="text-teal-600 font-medium">
                  {t("card.apiAccess")}
                </span>
              </div>
            )}
            {technicalSpecs.customOS && (
              <div className="flex items-center gap-1.5 text-xs">
                <Icon name="Upload" size={14} className="text-teal-500" />
                <span className="text-teal-600 font-medium">
                  {t("card.customOS")}
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// ServiceGuaranteesSection
interface ServiceGuaranteesSectionProps {
  provider: Provider;
}

export const ServiceGuaranteesSection = ({
  provider,
}: ServiceGuaranteesSectionProps) => {
  const { serviceGuarantees } = provider;
  const { t } = useLanguage();

  const getSupportSpeedBadge = (responseTime: string) => {
    const time = responseTime.toLowerCase();
    if (
      time.includes("5 мин") ||
      time.includes("< 5") ||
      time.includes("мгновенно")
    ) {
      return {
        color: "text-emerald-600 dark:text-emerald-400",
        bg: "bg-emerald-500/10",
        label: "Отлично",
      };
    }
    if (
      time.includes("15 мин") ||
      time.includes("< 15") ||
      time.includes("10 мин")
    ) {
      return {
        color: "text-amber-600 dark:text-amber-400",
        bg: "bg-amber-500/10",
        label: "Хорошо",
      };
    }
    if (
      time.includes("30 мин") ||
      time.includes("1 час") ||
      time.includes("час")
    ) {
      return {
        color: "text-orange-600 dark:text-orange-400",
        bg: "bg-orange-500/10",
        label: "Средне",
      };
    }
    return {
      color: "text-gray-600 dark:text-gray-400",
      bg: "bg-gray-500/10",
      label: "Медленно",
    };
  };

  return (
    <div className="space-y-4">
      <div className="grid md:grid-cols-3 gap-4">
        <div className="bg-background rounded-xl p-4 border border-border">
          <div className="flex items-center gap-2 mb-2">
            <Icon name="Activity" size={16} className="text-orange-500" />
            <div className="text-xs font-bold text-muted-foreground uppercase">
              {t("card.uptimeSLA")}
            </div>
          </div>
          <div className="text-2xl font-black text-orange-600">
            {serviceGuarantees.uptimeSLA}
          </div>
        </div>
        {serviceGuarantees.supportResponseTime &&
          (() => {
            const badge = getSupportSpeedBadge(
              serviceGuarantees.supportResponseTime,
            );
            return (
              <div className="bg-background rounded-xl p-4 border border-border relative overflow-hidden">
                <div
                  className={`absolute top-2 right-2 px-2 py-0.5 rounded-full text-[10px] font-bold ${badge.bg} ${badge.color}`}
                >
                  {badge.label}
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <Icon
                    name="MessageCircle"
                    size={16}
                    className={badge.color}
                  />
                  <div className="text-xs font-bold text-muted-foreground uppercase">
                    {t("card.supportResponseTime")}
                  </div>
                </div>
                <div className={`text-2xl font-black ${badge.color}`}>
                  {serviceGuarantees.supportResponseTime}
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  Среднее время ответа
                </div>
              </div>
            );
          })()}
        <div className="bg-background rounded-xl p-4 border border-border">
          <div className="flex items-center gap-2 mb-2">
            <Icon name="DollarSign" size={16} className="text-emerald-500" />
            <div className="text-xs font-bold text-muted-foreground uppercase">
              {t("card.moneyBackGuarantee")}
            </div>
          </div>
          <div className="text-2xl font-black text-emerald-600">
            {serviceGuarantees.moneyBackGuarantee
              ? `${serviceGuarantees.moneyBackGuarantee} ${t("common.days")}`
              : t("common.absent")}
          </div>
        </div>
      </div>
    </div>
  );
};

// AdditionalServicesSection
interface AdditionalServicesSectionProps {
  provider: Provider;
}

export const AdditionalServicesSection = ({
  provider,
}: AdditionalServicesSectionProps) => {
  const { additionalServices } = provider;
  const { t } = useLanguage();

  return (
    <div className="space-y-4">
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-3">
        <div
          className={`flex items-center gap-2 p-3 rounded-xl ${additionalServices.autoBackups ? "bg-emerald-500/10 border border-emerald-500/30" : "bg-background border border-border"}`}
        >
          <Icon
            name={additionalServices.autoBackups ? "CheckCircle" : "XCircle"}
            size={16}
            className={
              additionalServices.autoBackups ? "text-emerald-500" : "text-muted"
            }
          />
          <div className="flex-1">
            <div className="text-sm font-semibold text-emerald-600">
              {t("card.autoBackups")}
            </div>
            {additionalServices.autoBackups &&
              additionalServices.backupPrice && (
                <div className="text-xs text-muted-foreground">
                  {additionalServices.backupPrice}₽/мес
                </div>
              )}
            {additionalServices.autoBackups &&
              !additionalServices.backupPrice && (
                <div className="text-xs text-emerald-600 font-medium">
                  {t("common.free")}
                </div>
              )}
          </div>
        </div>
        <div
          className={`flex items-center gap-2 p-3 rounded-xl ${additionalServices.monitoring ? "bg-blue-500/10 border border-blue-500/30" : "bg-background border border-border"}`}
        >
          <Icon
            name={additionalServices.monitoring ? "CheckCircle" : "XCircle"}
            size={16}
            className={
              additionalServices.monitoring ? "text-blue-500" : "text-muted"
            }
          />
          <div className="text-sm font-semibold text-blue-600">
            {t("card.monitoring")}
          </div>
        </div>
        <div
          className={`flex items-center gap-2 p-3 rounded-xl ${additionalServices.snapshots ? "bg-purple-500/10 border border-purple-500/30" : "bg-background border border-border"}`}
        >
          <Icon
            name={additionalServices.snapshots ? "CheckCircle" : "XCircle"}
            size={16}
            className={
              additionalServices.snapshots ? "text-purple-500" : "text-muted"
            }
          />
          <div className="text-sm font-semibold text-purple-600">
            {t("card.snapshots")}
          </div>
        </div>
        <div
          className={`flex items-center gap-2 p-3 rounded-xl ${additionalServices.customOS ? "bg-amber-500/10 border border-amber-500/30" : "bg-background border border-border"}`}
        >
          <Icon
            name={additionalServices.customOS ? "CheckCircle" : "XCircle"}
            size={16}
            className={
              additionalServices.customOS ? "text-amber-500" : "text-muted"
            }
          />
          <div className="text-sm font-semibold text-amber-600">
            {t("card.customOS")}
          </div>
        </div>
      </div>
    </div>
  );
};

// PaymentMethodsSection
interface PaymentMethodsSectionProps {
  provider: Provider;
}

export const PaymentMethodsSection = ({
  provider,
}: PaymentMethodsSectionProps) => {
  const { pricingDetails } = provider;
  const { t } = useLanguage();

  const getPaymentMethodColor = (method: string) => {
    if (method.includes("Банк") || method.includes("Перевод"))
      return "text-blue-600 bg-blue-500/10 border-blue-500/30";
    if (
      method.includes("Карт") ||
      method.includes("Visa") ||
      method.includes("MasterCard")
    )
      return "text-indigo-600 bg-indigo-500/10 border-indigo-500/30";
    if (
      method.includes("Крипт") ||
      method.includes("Bitcoin") ||
      method.includes("ETH")
    )
      return "text-amber-600 bg-amber-500/10 border-amber-500/30";
    if (
      method.includes("Электрон") ||
      method.includes("WebMoney") ||
      method.includes("QIWI")
    )
      return "text-purple-600 bg-purple-500/10 border-purple-500/30";
    return "text-rose-600 bg-rose-500/10 border-rose-500/30";
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {pricingDetails.paymentMethods.map((method, idx) => (
          <Badge key={idx} className={`${getPaymentMethodColor(method)}`}>
            {method}
          </Badge>
        ))}
      </div>
    </div>
  );
};

// CaseStudiesSection
interface CaseStudiesSectionProps {
  provider: Provider;
}

export const CaseStudiesSection = ({ provider }: CaseStudiesSectionProps) => {
  const { t } = useLanguage();

  if (!provider.caseStudies || provider.caseStudies.length === 0) return null;

  return (
    <div className="space-y-3">
      {provider.caseStudies.map((caseStudy, idx) => (
        <div key={idx} className="flex items-start gap-2">
          <Icon
            name="CheckCircle2"
            size={14}
            className="text-sky-500 flex-shrink-0 mt-0.5"
          />
          <span className="text-sm text-sky-600 leading-relaxed">
            {caseStudy}
          </span>
        </div>
      ))}
    </div>
  );
};