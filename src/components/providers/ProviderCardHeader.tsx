import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { Provider } from './types';
import { useLanguage } from '@/contexts/LanguageContext';

interface ProviderCardHeaderProps {
  provider: Provider;
  index: number;
  calculatedPrice: number;
  onProviderClick: () => void;
}

export const ProviderCardHeader = ({
  provider,
  index,
  calculatedPrice,
  onProviderClick
}: ProviderCardHeaderProps) => {
  const { t, language } = useLanguage();
  const avgRating = provider.reviews.reduce((sum, r) => sum + r.rating, 0) / provider.reviews.length;
  const [showAllLocations, setShowAllLocations] = useState(false);

  return (
    <div className="flex flex-col gap-3 flex-1">
        <div className="flex items-start gap-3">
          <div className="relative flex-shrink-0">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl overflow-hidden bg-white border border-primary/10 shadow-soft flex items-center justify-center">
              <img src={provider.logo} alt={provider.name} className="w-10 h-10 sm:w-12 sm:h-12 object-contain" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-primary rounded-lg flex items-center justify-center shadow-lg text-background text-xs font-bold">
              {index + 1}
            </div>
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="text-lg sm:text-xl font-bold text-foreground mb-1.5 truncate">{provider.name}</h3>
            <div className="flex items-center gap-2 mb-2">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Icon 
                    key={i}
                    name="Star" 
                    size={16} 
                    className={i < Math.round(avgRating) ? "fill-primary text-primary" : "text-muted"}
                  />
                ))}
              </div>
              <span className="text-base font-bold text-foreground">
                {avgRating.toFixed(1)}
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col gap-1">
            <div className="flex items-start gap-1.5 text-sm">
              <Icon name="MapPin" size={14} className="text-primary mt-0.5 flex-shrink-0" />
              <div className="flex items-center gap-1">
                <span className="text-foreground">
                  {showAllLocations 
                    ? provider.locations.join(', ')
                    : provider.locations.slice(0, 3).join(', ')}
                  {provider.locations.length > 3 && !showAllLocations && (
                    <button 
                      onClick={() => setShowAllLocations(true)}
                      className="text-primary hover:underline ml-1"
                    >
                      +{provider.locations.length - 3}
                    </button>
                  )}
                  {showAllLocations && provider.locations.length > 3 && (
                    <button 
                      onClick={() => setShowAllLocations(false)}
                      className="text-primary hover:underline ml-1"
                    >
                      скрыть
                    </button>
                  )}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-1.5 text-sm">
              <Icon name="Gift" size={14} className={provider.trialDays ? "text-primary" : "text-muted-foreground"} />
              <span className={provider.id === 16 ? "text-foreground truncate" : "font-semibold text-foreground truncate"}>
                {provider.trialDays ? `${provider.trialDays} ${provider.trialDays === 1 ? t('common.day') : provider.trialDays < 5 ? t('common.daysGenitive') : t('common.days')} ${t('common.free')}` : 'Тест по запросу'}
              </span>
            </div>
            {provider.fz152Compliant && (
              <div className="flex items-center gap-1.5 text-sm">
                <Icon name="ShieldCheck" size={14} className="text-primary flex-shrink-0" />
                <span className={provider.id === 16 ? "text-foreground truncate" : "font-semibold text-foreground truncate"}>152-ФЗ</span>
              </div>
            )}
            <div className="flex items-center gap-1.5 text-sm">
              <Icon name="HardDrive" size={14} className="text-primary flex-shrink-0" />
              <span className={provider.id === 16 ? "text-foreground truncate" : "font-semibold text-foreground truncate"}>{provider.technicalSpecs.diskType}</span>
            </div>
            <div className="flex items-center gap-1.5 text-sm">
              <Icon name="Box" size={14} className="text-primary flex-shrink-0" />
              <span className={provider.id === 16 ? "text-foreground truncate" : "font-semibold text-foreground truncate"}>
                {provider.technicalSpecs.virtualization.slice(0, 2).join(', ')}
              </span>
            </div>
            {provider.technicalSpecs.kubernetes?.available && (
              <div className="flex items-center gap-1.5 text-sm">
                <Icon name="Network" size={14} className="text-primary flex-shrink-0" />
                <span className={provider.id === 16 ? "text-foreground" : "font-semibold text-foreground"}>Kubernetes</span>
                {provider.technicalSpecs.kubernetes.managed && (
                  <Badge className="bg-primary/10 border-primary/30 text-primary border font-semibold text-[10px] px-1 py-0">
                    managed
                  </Badge>
                )}
              </div>
            )}

            <div className="flex items-center justify-end gap-2 text-sm mt-2">
              <span className={provider.id === 16 ? "text-[1.17rem] text-foreground" : "text-[1.17rem] font-semibold text-foreground"}>{t('common.from')} </span>
              <span className="text-[1.56rem] font-black text-primary">{calculatedPrice}</span>
              <span className={provider.id === 16 ? "text-[1.17rem] text-foreground" : "text-[0.936rem] text-muted-foreground"}>{t('common.perMonth')}</span>
            </div>
          {provider.uptime30days && (
            <div className="flex items-center gap-1.5 text-sm mt-1">
              <Icon name="Activity" size={14} className="text-secondary flex-shrink-0" />
              <span className={provider.id === 16 ? "text-foreground" : "font-semibold text-foreground"}>{t('common.uptime')}: {provider.uptime30days}%</span>
            </div>
          )}
        </div>
    </div>
  );
};