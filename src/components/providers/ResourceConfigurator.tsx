import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import Icon from '@/components/ui/icon';
import { ResourceConfig } from './types';
import { useLanguage } from '@/contexts/LanguageContext';

interface ResourceConfiguratorProps {
  config: ResourceConfig;
  onUpdateConfig: (key: keyof ResourceConfig, value: number) => void;
}

export const ResourceConfigurator = ({
  config,
  onUpdateConfig
}: ResourceConfiguratorProps) => {
  const { t } = useLanguage();
  
  if (!config) {
    return null;
  }
  
  return (
    <div className="bg-accent/50 border border-primary/10 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Icon name="Sliders" size={20} className="text-primary" />
          <h4 className="text-lg font-bold text-foreground">{t('resources.configurator')}</h4>
        </div>
        <Badge className="bg-primary/20 text-primary border-0">{t('resources.customizeYourself')}</Badge>
      </div>
      
      <div className="space-y-6">
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center">
                <Icon name="Cpu" size={16} className="text-primary" />
              </div>
              <span className="text-sm font-bold text-foreground">CPU</span>
            </div>
            <span className="text-lg font-black text-primary">{config.cpu} vCPU</span>
          </div>
          <Slider
            value={[config.cpu]}
            onValueChange={(value) => onUpdateConfig('cpu', value[0])}
            min={1}
            max={16}
            step={1}
            className="cursor-pointer"
          />
          <div className="flex justify-between text-xs text-muted-foreground mt-2">
            <span>1 vCPU</span>
            <span>16 vCPU</span>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center">
                <Icon name="MemoryStick" size={16} className="text-primary" />
              </div>
              <span className="text-sm font-bold text-foreground">RAM</span>
            </div>
            <span className="text-lg font-black text-primary">{config.ram} GB</span>
          </div>
          <Slider
            value={[config.ram]}
            onValueChange={(value) => onUpdateConfig('ram', value[0])}
            min={1}
            max={64}
            step={1}
            className="cursor-pointer"
          />
          <div className="flex justify-between text-xs text-muted-foreground mt-2">
            <span>1 GB</span>
            <span>64 GB</span>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center">
                <Icon name="HardDrive" size={16} className="text-primary" />
              </div>
              <span className="text-sm font-bold text-foreground">{t('resources.storage')}</span>
            </div>
            <span className="text-lg font-black text-primary">{config.storage} GB</span>
          </div>
          <Slider
            value={[config.storage]}
            onValueChange={(value) => onUpdateConfig('storage', value[0])}
            min={10}
            max={500}
            step={10}
            className="cursor-pointer"
          />
          <div className="flex justify-between text-xs text-muted-foreground mt-2">
            <span>10 GB</span>
            <span>500 GB</span>
          </div>
        </div>
      </div>

      <div className="mt-6 pt-6 border-t border-border">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">{t('resources.traffic')}</span>
          <div className="flex items-center gap-2">
            <Icon name="Wifi" size={16} className="text-secondary" />
            <span className="text-sm font-bold text-foreground">{t('resources.unlimited')}</span>
          </div>
        </div>
      </div>
    </div>
  );
};