import { Badge } from "@/components/ui/badge";
import Icon from "@/components/ui/icon";
import { Provider } from "./types";
import { useLanguage } from "@/contexts/LanguageContext";

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

        {/* Скорость сетии */}
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
