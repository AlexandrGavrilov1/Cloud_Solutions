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
          <Icon name="HardDrive" size={16} className="text-primary mt-0.5" />
          <div>
            <div className="text-xs text-muted-foreground mb-0.5">
              {t("common.disks")}
            </div>
            <Badge className="bg-primary/10 border border-primary/30 text-primary font-bold text-xs transition-all duration-300 hover:bg-primary/20 hover:scale-105 hover:shadow-md cursor-default">
              <Icon name="HardDrive" size={12} className="mr-1" />
              {technicalSpecs.diskType}
            </Badge>
          </div>
        </div>

        {/* Скорость сети */}
        <div className="flex items-start gap-3">
          <Icon name="Wifi" size={16} className="text-primary mt-0.5" />
          <div>
            <div className="text-xs text-muted-foreground mb-0.5">
              {t("card.networkSpeed")}
            </div>
            <Badge className="bg-primary/10 border border-primary/30 text-primary font-bold text-xs transition-all duration-300 hover:bg-primary/20 hover:scale-105 hover:shadow-md cursor-default">
              <Icon name="Zap" size={12} className="mr-1" />
              {technicalSpecs.networkSpeed}
            </Badge>
          </div>
        </div>

        {/* Виртуализация */}
        <div className="flex items-start gap-3">
          <Icon name="Box" size={16} className="text-primary mt-0.5" />
          <div>
            <div className="text-xs text-muted-foreground mb-0.5">
              {t("common.virtualization")}
            </div>
            <div className="flex flex-wrap gap-1.5">
              {technicalSpecs.virtualization.map((virt, idx) => (
                <Badge
                  key={idx}
                  className="bg-primary/10 border border-primary/30 text-primary font-bold text-xs transition-all duration-300 hover:bg-primary/20 hover:scale-105 hover:shadow-md cursor-default"
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
          <Icon name="Shield" size={16} className="text-primary mt-0.5" />
          <div>
            <div className="text-xs text-muted-foreground mb-0.5">
              {t("card.ddosProtection")}
            </div>
            <Badge className="bg-primary/10 border border-primary/30 text-primary font-bold text-xs transition-all duration-300 hover:bg-primary/20 hover:scale-105 hover:shadow-md cursor-default">
              <Icon name="ShieldCheck" size={12} className="mr-1" />
              {technicalSpecs.ddosProtection}
            </Badge>
          </div>
        </div>

        {/* Панель управления */}
        <div className="flex items-start gap-3">
          <Icon name="Layout" size={16} className="text-primary mt-0.5" />
          <div>
            <div className="text-xs text-muted-foreground mb-0.5">
              {t("card.controlPanel")}
            </div>
            <Badge className="bg-primary/10 border border-primary/30 text-primary font-bold text-xs transition-all duration-300 hover:bg-primary/20 hover:scale-105 hover:shadow-md cursor-default">
              <Icon name="Monitor" size={12} className="mr-1" />
              {technicalSpecs.controlPanel}
            </Badge>
          </div>
        </div>

        {/* IP */}
        <div className="flex items-start gap-3">
          <Icon name="Network" size={16} className="text-primary mt-0.5" />
          <div>
            <div className="text-xs text-muted-foreground mb-0.5">IP</div>
            <div className="flex gap-1.5">
              {technicalSpecs.ipv4 && (
                <Badge className="bg-primary/10 border border-primary/30 text-primary text-xs">
                  IPv4
                </Badge>
              )}
              {technicalSpecs.ipv6 && (
                <Badge className="bg-primary/10 border border-primary/30 text-primary text-xs">
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
            <Icon name="Cpu" size={16} className="text-primary" />
            <div className="text-sm font-semibold text-foreground">
              Процессоры:
            </div>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {technicalSpecs.cpuModels.map((cpu, idx) => (
              <Badge
                key={idx}
                className="bg-primary/10 border border-primary/30 text-primary text-xs"
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
              <Icon name="MemoryStick" size={16} className="text-primary" />
              <div className="text-sm font-semibold text-foreground">
                Опции памяти:
              </div>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {technicalSpecs.memoryOptions.map((memory, idx) => (
                <Badge
                  key={idx}
                  className="bg-primary/10 border border-primary/30 text-primary text-xs"
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
            <Icon name="CheckCircle" size={16} className="text-primary" />
            <div className="text-sm font-semibold text-foreground">
              Дополнительные возможности:
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            {technicalSpecs.guaranteedResources && (
              <div className="flex items-center gap-1.5 text-xs">
                <Icon name="Check" size={14} className="text-primary" />
                <span className="text-foreground font-medium">
                  {t("card.guaranteedResources")}
                </span>
              </div>
            )}
            {technicalSpecs.apiAccess && (
              <div className="flex items-center gap-1.5 text-xs">
                <Icon name="Code" size={14} className="text-primary" />
                <span className="text-foreground font-medium">
                  {t("card.apiAccess")}
                </span>
              </div>
            )}
            {technicalSpecs.customOS && (
              <div className="flex items-center gap-1.5 text-xs">
                <Icon name="Upload" size={14} className="text-primary" />
                <span className="text-foreground font-medium">
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
        color: "text-green-600 dark:text-green-400",
        bg: "bg-green-500/10",
        label: "Отлично",
      };
    }
    if (
      time.includes("15 мин") ||
      time.includes("< 15") ||
      time.includes("10 мин")
    ) {
      return {
        color: "text-yellow-600 dark:text-yellow-400",
        bg: "bg-yellow-500/10",
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
            <Icon name="Activity" size={16} className="text-primary" />
            <div className="text-xs font-bold text-muted-foreground uppercase">
              {t("card.uptimeSLA")}
            </div>
          </div>
          <div className="text-2xl font-black text-primary">
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
            <Icon name="DollarSign" size={16} className="text-primary" />
            <div className="text-xs font-bold text-muted-foreground uppercase">
              {t("card.moneyBackGuarantee")}
            </div>
          </div>
          <div className="text-2xl font-black text-primary">
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
          className={`flex items-center gap-2 p-3 rounded-xl ${additionalServices.autoBackups ? "bg-primary/10 border border-primary/30" : "bg-background border border-border"}`}
        >
          <Icon
            name={additionalServices.autoBackups ? "CheckCircle" : "XCircle"}
            size={16}
            className={
              additionalServices.autoBackups ? "text-primary" : "text-muted"
            }
          />
          <div className="flex-1">
            <div className="text-sm font-semibold text-foreground">
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
                <div className="text-xs text-primary font-medium">
                  {t("common.free")}
                </div>
              )}
          </div>
        </div>
        <div
          className={`flex items-center gap-2 p-3 rounded-xl ${additionalServices.monitoring ? "bg-primary/10 border border-primary/30" : "bg-background border border-border"}`}
        >
          <Icon
            name={additionalServices.monitoring ? "CheckCircle" : "XCircle"}
            size={16}
            className={
              additionalServices.monitoring ? "text-primary" : "text-muted"
            }
          />
          <div className="text-sm font-semibold text-foreground">
            {t("card.monitoring")}
          </div>
        </div>
        <div
          className={`flex items-center gap-2 p-3 rounded-xl ${additionalServices.snapshots ? "bg-primary/10 border border-primary/30" : "bg-background border border-border"}`}
        >
          <Icon
            name={additionalServices.snapshots ? "CheckCircle" : "XCircle"}
            size={16}
            className={
              additionalServices.snapshots ? "text-primary" : "text-muted"
            }
          />
          <div className="text-sm font-semibold text-foreground">
            {t("card.snapshots")}
          </div>
        </div>
        <div
          className={`flex items-center gap-2 p-3 rounded-xl ${additionalServices.customOS ? "bg-primary/10 border border-primary/30" : "bg-background border border-border"}`}
        >
          <Icon
            name={additionalServices.customOS ? "CheckCircle" : "XCircle"}
            size={16}
            className={
              additionalServices.customOS ? "text-primary" : "text-muted"
            }
          />
          <div className="text-sm font-semibold text-foreground">
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

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {pricingDetails.paymentMethods.map((method, idx) => (
          <Badge
            key={idx}
            className="bg-primary/10 border border-primary/30 text-primary"
          >
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
            className="text-primary flex-shrink-0 mt-0.5"
          />
          <span className="text-sm text-foreground leading-relaxed">
            {caseStudy}
          </span>
        </div>
      ))}
    </div>
  );
};
