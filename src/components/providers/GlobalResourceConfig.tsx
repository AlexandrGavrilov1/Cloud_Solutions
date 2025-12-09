import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { ResourceConfig } from './types';
import { useLanguage } from '@/contexts/LanguageContext';

interface GlobalResourceConfigProps {
  onApplyConfig: (config: ResourceConfig) => void;
}

export const GlobalResourceConfig = ({ onApplyConfig }: GlobalResourceConfigProps) => {
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [config, setConfig] = useState<ResourceConfig>({
    cpu: 1,
    ram: 1,
    storage: 10
  });

  const handleApply = () => {
    onApplyConfig(config);
    setIsOpen(false);
  };

  const handleReset = () => {
    const defaultConfig = { cpu: 1, ram: 1, storage: 10 };
    setConfig(defaultConfig);
    onApplyConfig(defaultConfig);
  };

  return (
    <div className="bg-card border border-primary/20 rounded-2xl shadow-lg">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-4 flex items-center justify-between hover:bg-primary/5 transition-colors rounded-2xl"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-primary/20 rounded-xl flex items-center justify-center">
            <Icon name="Sliders" size={16} className="text-primary sm:w-5 sm:h-5" />
          </div>
          <div className="text-left">
            <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-foreground">{t('resources.configurator')}</h3>
            <p className="text-xs text-muted-foreground">
              CPU: {config.cpu} • RAM: {config.ram}GB • {t('resources.storage')}: {config.storage}GB
            </p>
          </div>
        </div>
        <Icon 
          name={isOpen ? "ChevronUp" : "ChevronDown"} 
          size={24} 
          className="text-muted-foreground transition-transform"
        />
      </button>

      {isOpen && (
        <div className="px-6 pb-4 pt-2 space-y-4 border-t border-primary/10">
          <div className="flex items-center justify-between">
            <Badge className="bg-primary/20 text-primary border-0 text-xs">
              {t('resources.customizeYourself')}
            </Badge>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleReset}
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              <Icon name="RotateCcw" size={14} className="mr-1" />
              Сбросить
            </Button>
          </div>

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
              onValueChange={(value) => setConfig(prev => ({ ...prev, cpu: value[0] }))}
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
              onValueChange={(value) => setConfig(prev => ({ ...prev, ram: value[0] }))}
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
              onValueChange={(value) => setConfig(prev => ({ ...prev, storage: value[0] }))}
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

          <div className="pt-4 border-t border-border">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-muted-foreground">{t('resources.traffic')}</span>
              <div className="flex items-center gap-2">
                <Icon name="Wifi" size={16} className="text-secondary" />
                <span className="text-sm font-bold text-foreground">{t('resources.unlimited')}</span>
              </div>
            </div>
            <Button 
              onClick={handleApply}
              className="w-full bg-primary hover:bg-primary/90 text-background font-bold"
            >
              <Icon name="Check" size={16} className="mr-2" />
              Применить ко всем
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};