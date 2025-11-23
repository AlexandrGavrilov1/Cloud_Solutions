import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { Provider } from './types';
import { useLanguage } from '@/contexts/LanguageContext';

interface TechnicalSpecsSectionProps {
  provider: Provider;
}

export const TechnicalSpecsSection = ({ provider }: TechnicalSpecsSectionProps) => {
  const { technicalSpecs } = provider;
  const { t } = useLanguage();
  
  return (
    <div className="md:col-span-2 bg-accent/50 border border-border rounded-2xl p-5">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-9 h-9 bg-primary/20 rounded-xl flex items-center justify-center">
          <Icon name="Settings" size={18} className="text-primary" />
        </div>
        <h4 className="text-base font-bold text-foreground">{t('card.technicalSpecs')}</h4>
      </div>
      <div className="grid md:grid-cols-3 gap-4">
        <div className="flex items-start gap-3">
          <Icon name="HardDrive" size={16} className="text-primary mt-0.5" />
          <div>
            <div className="text-xs text-muted-foreground mb-0.5">{t('common.disks')}</div>
            <Badge className="bg-primary/10 border border-primary/30 text-primary font-bold text-xs transition-all duration-300 hover:bg-primary/20 hover:scale-105 hover:shadow-md cursor-default">
              <Icon name="HardDrive" size={12} className="mr-1" />
              {technicalSpecs.diskType}
            </Badge>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <Icon name="Wifi" size={16} className="text-primary mt-0.5" />
          <div>
            <div className="text-xs text-muted-foreground mb-0.5">{t('card.networkSpeed')}</div>
            <Badge className="bg-secondary/10 border border-secondary/30 text-secondary font-bold text-xs transition-all duration-300 hover:bg-secondary/20 hover:scale-105 hover:shadow-md cursor-default">
              <Icon name="Zap" size={12} className="mr-1" />
              {technicalSpecs.networkSpeed}
            </Badge>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <Icon name="Box" size={16} className="text-primary mt-0.5" />
          <div>
            <div className="text-xs text-muted-foreground mb-0.5">{t('common.virtualization')}</div>
            <div className="flex flex-wrap gap-1.5">
              {technicalSpecs.virtualization.map((virt, idx) => {
                const getVirtColor = (type: string) => {
                  switch(type) {
                    case 'KVM': return 'bg-blue-500/10 border-blue-500/30 text-blue-600 hover:bg-blue-500/20';
                    case 'VMware': return 'bg-purple-500/10 border-purple-500/30 text-purple-600 hover:bg-purple-500/20';
                    case 'OpenVZ': return 'bg-orange-500/10 border-orange-500/30 text-orange-600 hover:bg-orange-500/20';
                    case 'Hyper-V': return 'bg-cyan-500/10 border-cyan-500/30 text-cyan-600 hover:bg-cyan-500/20';
                    case 'LXC': return 'bg-green-500/10 border-green-500/30 text-green-600 hover:bg-green-500/20';
                    case 'Xen': return 'bg-pink-500/10 border-pink-500/30 text-pink-600 hover:bg-pink-500/20';
                    default: return 'bg-primary/10 border-primary/30 text-primary hover:bg-primary/20';
                  }
                };
                return (
                  <Badge key={idx} className={`${getVirtColor(virt)} border font-bold text-xs transition-all duration-300 hover:scale-105 hover:shadow-md cursor-default`}>
                    <Icon name="Box" size={12} className="mr-1" />
                    {virt}
                  </Badge>
                );
              })}
            </div>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <Icon name="Shield" size={16} className="text-primary mt-0.5" />
          <div>
            <div className="text-xs text-muted-foreground mb-0.5">{t('card.ddosProtection')}</div>
            <Badge className="bg-primary/10 border border-primary/30 text-primary font-bold text-xs transition-all duration-300 hover:bg-primary/20 hover:scale-105 hover:shadow-md cursor-default">
              <Icon name="ShieldCheck" size={12} className="mr-1" />
              {technicalSpecs.ddosProtection}
            </Badge>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <Icon name="Layout" size={16} className="text-primary mt-0.5" />
          <div>
            <div className="text-xs text-muted-foreground mb-0.5">{t('card.controlPanel')}</div>
            <Badge className="bg-accent border border-border text-foreground font-bold text-xs transition-all duration-300 hover:bg-accent/80 hover:scale-105 hover:shadow-md cursor-default">
              <Icon name="Monitor" size={12} className="mr-1" />
              {technicalSpecs.controlPanel}
            </Badge>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <Icon name="Network" size={16} className="text-primary mt-0.5" />
          <div>
            <div className="text-xs text-muted-foreground mb-0.5">IP</div>
            <div className="flex gap-1.5">
              {technicalSpecs.ipv4 && <Badge variant="outline" className="text-xs">IPv4</Badge>}
              {technicalSpecs.ipv6 && <Badge variant="outline" className="text-xs">IPv6</Badge>}
            </div>
          </div>
        </div>
      </div>
      <div className="mt-4 pt-4 border-t border-border">
        {technicalSpecs.cpuModels && technicalSpecs.cpuModels.length > 0 && (
          <div className="mb-4">
            <div className="text-xs text-muted-foreground mb-2">Процессоры:</div>
            <div className="flex flex-wrap gap-1.5">
              {technicalSpecs.cpuModels.map((cpu, idx) => (
                <Badge key={idx} variant="outline" className="text-xs bg-background">
                  {cpu}
                </Badge>
              ))}
            </div>
          </div>
        )}
        <div className="text-xs text-muted-foreground mb-2">{t('card.availableOS')}:</div>
        <div className="flex flex-wrap gap-1.5">
          {technicalSpecs.availableOS.map((os, idx) => (
            <Badge key={idx} variant="outline" className="text-xs bg-background">
              {os}
            </Badge>
          ))}
        </div>
        <div className="flex flex-wrap gap-3 mt-3">
          {technicalSpecs.guaranteedResources && (
            <div className="flex items-center gap-1.5 text-xs">
              <Icon name="CheckCircle" size={14} className="text-secondary" />
              <span className="text-foreground font-medium">{t('card.guaranteedResources')}</span>
            </div>
          )}
          {technicalSpecs.apiAccess && (
            <div className="flex items-center gap-1.5 text-xs">
              <Icon name="Code" size={14} className="text-secondary" />
              <span className="text-foreground font-medium">{t('card.apiAccess')}</span>
            </div>
          )}
          {technicalSpecs.customOS && (
            <div className="flex items-center gap-1.5 text-xs">
              <Icon name="Upload" size={14} className="text-secondary" />
              <span className="text-foreground font-medium">{t('card.customOS')}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

interface ServiceGuaranteesSectionProps {
  provider: Provider;
}

export const ServiceGuaranteesSection = ({ provider }: ServiceGuaranteesSectionProps) => {
  const { serviceGuarantees } = provider;
  const { t } = useLanguage();
  
  const getSupportSpeedBadge = (responseTime: string) => {
    const time = responseTime.toLowerCase();
    if (time.includes('5 мин') || time.includes('< 5') || time.includes('мгновенно')) {
      return { color: 'text-green-600 dark:text-green-400', bg: 'bg-green-500/10', label: 'Отлично' };
    }
    if (time.includes('15 мин') || time.includes('< 15') || time.includes('10 мин')) {
      return { color: 'text-yellow-600 dark:text-yellow-400', bg: 'bg-yellow-500/10', label: 'Хорошо' };
    }
    if (time.includes('30 мин') || time.includes('1 час') || time.includes('час')) {
      return { color: 'text-orange-600 dark:text-orange-400', bg: 'bg-orange-500/10', label: 'Средне' };
    }
    return { color: 'text-gray-600 dark:text-gray-400', bg: 'bg-gray-500/10', label: 'Медленно' };
  };
  
  return (
    <div className="md:col-span-2 bg-secondary/5 border border-secondary/20 rounded-2xl p-5">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-9 h-9 bg-secondary/20 rounded-xl flex items-center justify-center">
          <Icon name="Award" size={18} className="text-secondary" />
        </div>
        <h4 className="text-base font-bold text-foreground">{t('card.serviceGuarantees')}</h4>
      </div>
      <div className="grid md:grid-cols-3 gap-4">
        <div className="bg-background rounded-xl p-4 border border-border">
          <div className="flex items-center gap-2 mb-2">
            <Icon name="Activity" size={16} className="text-secondary" />
            <div className="text-xs font-bold text-muted-foreground uppercase">{t('card.uptimeSLA')}</div>
          </div>
          <div className="text-2xl font-black text-secondary">{serviceGuarantees.uptimeSLA}</div>
        </div>
        {serviceGuarantees.supportResponseTime && (() => {
          const badge = getSupportSpeedBadge(serviceGuarantees.supportResponseTime);
          return (
            <div className="bg-background rounded-xl p-4 border border-border relative overflow-hidden">
              <div className={`absolute top-2 right-2 px-2 py-0.5 rounded-full text-[10px] font-bold ${badge.bg} ${badge.color}`}>
                {badge.label}
              </div>
              <div className="flex items-center gap-2 mb-2">
                <Icon name="MessageCircle" size={16} className={badge.color} />
                <div className="text-xs font-bold text-muted-foreground uppercase">{t('card.supportResponseTime')}</div>
              </div>
              <div className={`text-2xl font-black ${badge.color}`}>{serviceGuarantees.supportResponseTime}</div>
              <div className="text-xs text-muted-foreground mt-1">Среднее время ответа</div>
            </div>
          );
        })()}
        <div className="bg-background rounded-xl p-4 border border-border">
          <div className="flex items-center gap-2 mb-2">
            <Icon name="DollarSign" size={16} className="text-secondary" />
            <div className="text-xs font-bold text-muted-foreground uppercase">{t('card.moneyBackGuarantee')}</div>
          </div>
          <div className="text-2xl font-black text-secondary">
            {serviceGuarantees.moneyBackGuarantee ? `${serviceGuarantees.moneyBackGuarantee} ${t('common.days')}` : t('common.absent')}
          </div>
        </div>
      </div>
    </div>
  );
};

interface AdditionalServicesSectionProps {
  provider: Provider;
}

export const AdditionalServicesSection = ({ provider }: AdditionalServicesSectionProps) => {
  const { additionalServices } = provider;
  const { t } = useLanguage();
  
  return (
    <div className="md:col-span-2 bg-accent/30 border border-border rounded-2xl p-5">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-9 h-9 bg-primary/20 rounded-xl flex items-center justify-center">
          <Icon name="Package" size={18} className="text-primary" />
        </div>
        <h4 className="text-base font-bold text-foreground">{t('card.additionalServices')}</h4>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className={`flex items-center gap-2 p-3 rounded-xl ${additionalServices.autoBackups ? 'bg-secondary/10 border border-secondary/30' : 'bg-background border border-border'}`}>
          <Icon name={additionalServices.autoBackups ? "CheckCircle" : "XCircle"} size={16} className={additionalServices.autoBackups ? "text-secondary" : "text-muted"} />
          <div className="flex-1">
            <div className="text-sm font-semibold text-foreground">{t('card.autoBackups')}</div>
            {additionalServices.autoBackups && additionalServices.backupPrice && (
              <div className="text-xs text-muted-foreground">{additionalServices.backupPrice}₽/мес</div>
            )}
            {additionalServices.autoBackups && !additionalServices.backupPrice && (
              <div className="text-xs text-secondary font-medium">{t('common.free')}</div>
            )}
          </div>
        </div>
        <div className={`flex items-center gap-2 p-3 rounded-xl ${additionalServices.monitoring ? 'bg-secondary/10 border border-secondary/30' : 'bg-background border border-border'}`}>
          <Icon name={additionalServices.monitoring ? "CheckCircle" : "XCircle"} size={16} className={additionalServices.monitoring ? "text-secondary" : "text-muted"} />
          <div className="text-sm font-semibold text-foreground">{t('card.monitoring')}</div>
        </div>
        <div className={`flex items-center gap-2 p-3 rounded-xl ${additionalServices.snapshots ? 'bg-secondary/10 border border-secondary/30' : 'bg-background border border-border'}`}>
          <Icon name={additionalServices.snapshots ? "CheckCircle" : "XCircle"} size={16} className={additionalServices.snapshots ? "text-secondary" : "text-muted"} />
          <div className="text-sm font-semibold text-foreground">{t('card.snapshots')}</div>
        </div>
        <div className={`flex items-center gap-2 p-3 rounded-xl ${additionalServices.customOS ? 'bg-secondary/10 border border-secondary/30' : 'bg-background border border-border'}`}>
          <Icon name={additionalServices.customOS ? "CheckCircle" : "XCircle"} size={16} className={additionalServices.customOS ? "text-secondary" : "text-muted"} />
          <div className="text-sm font-semibold text-foreground">{t('card.customOS')}</div>
        </div>
      </div>
    </div>
  );
};

interface PaymentMethodsSectionProps {
  provider: Provider;
}

export const PaymentMethodsSection = ({ provider }: PaymentMethodsSectionProps) => {
  const { pricingDetails } = provider;
  const { t } = useLanguage();
  
  return (
    <div className="bg-accent/50 border border-border rounded-2xl p-5">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-9 h-9 bg-primary/20 rounded-xl flex items-center justify-center">
          <Icon name="CreditCard" size={18} className="text-primary" />
        </div>
        <h4 className="text-base font-bold text-foreground">{t('card.paymentMethods')}</h4>
      </div>
      <div className="flex flex-wrap gap-2">
        {pricingDetails.paymentMethods.map((method, idx) => (
          <Badge key={idx} className="bg-background border border-primary/20 text-foreground">
            {method}
          </Badge>
        ))}
      </div>
    </div>
  );
};

interface CaseStudiesSectionProps {
  provider: Provider;
}

export const CaseStudiesSection = ({ provider }: CaseStudiesSectionProps) => {
  const { t } = useLanguage();
  
  if (!provider.caseStudies || provider.caseStudies.length === 0) return null;
  
  return (
    <div className="bg-accent/50 border border-border rounded-2xl p-5">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-9 h-9 bg-primary/20 rounded-xl flex items-center justify-center">
          <Icon name="Briefcase" size={18} className="text-primary" />
        </div>
        <h4 className="text-base font-bold text-foreground">{t('card.caseStudies')}</h4>
      </div>
      <div className="space-y-2">
        {provider.caseStudies.map((caseStudy, idx) => (
          <div key={idx} className="flex items-center gap-2">
            <Icon name="CheckCircle2" size={14} className="text-secondary flex-shrink-0" />
            <span className="text-sm text-foreground">{caseStudy}</span>
          </div>
        ))}
      </div>
    </div>
  );
};