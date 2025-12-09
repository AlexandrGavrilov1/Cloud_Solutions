import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";
import { ResourceConfig } from "./types";
import { useLanguage } from "@/contexts/LanguageContext";

interface GlobalResourceConfigProps {
  onApplyConfig: (config: ResourceConfig) => void;
}

export const GlobalResourceConfig = ({
  onApplyConfig,
}: GlobalResourceConfigProps) => {
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [config, setConfig] = useState<ResourceConfig>({
    cpu: 1,
    ram: 1,
    storage: 10,
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
    <div className="bg-card border border-primary/20 rounded-xl shadow-md">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-3 py-2.5 flex items-center justify-between hover:bg-primary/5 transition-colors rounded-xl"
      >
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 sm:w-7 sm:h-7 bg-primary/20 rounded-lg flex items-center justify-center">
            <Icon
              name="Sliders"
              size={12}
              className="text-primary sm:w-4 sm:h-4"
            />
          </div>
          <div className="text-left">
            <h3 className="text-sm sm:text-base font-bold text-foreground">
              {t("resources.configurator")}
            </h3>
            <p className="text-[10px] text-muted-foreground mt-0.5">
              CPU: {config.cpu} • RAM: {config.ram}GB • {t("resources.storage")}
              : {config.storage}GB
            </p>
          </div>
        </div>
        <Icon
          name={isOpen ? "ChevronUp" : "ChevronDown"}
          size={16}
          className="text-muted-foreground transition-transform"
        />
      </button>

      {isOpen && (
        <div className="px-3 pb-3 pt-1.5 space-y-3 border-t border-primary/10">
          <div className="flex items-center justify-between">
            <Badge className="bg-primary/20 text-primary border-0 text-[10px] px-2 py-0.5">
              {t("resources.customizeYourself")}
            </Badge>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleReset}
              className="text-[10px] text-muted-foreground hover:text-foreground h-6 px-1.5"
            >
              <Icon name="RotateCcw" size={10} className="mr-1" />
              Сбросить
            </Button>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5">
                <div className="w-6 h-6 bg-primary/20 rounded-md flex items-center justify-center">
                  <Icon name="Cpu" size={12} className="text-primary" />
                </div>
                <span className="text-xs sm:text-sm font-bold text-foreground">
                  CPU
                </span>
              </div>
              <span className="text-sm font-black text-primary">
                {config.cpu} vCPU
              </span>
            </div>
            <Slider
              value={[config.cpu]}
              onValueChange={(value) =>
                setConfig((prev) => ({ ...prev, cpu: value[0] }))
              }
              min={1}
              max={16}
              step={1}
              className="cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-muted-foreground mt-1.5 px-0.5">
              <span>1 vCPU</span>
              <span>16 vCPU</span>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5">
                <div className="w-6 h-6 bg-primary/20 rounded-md flex items-center justify-center">
                  <Icon name="MemoryStick" size={12} className="text-primary" />
                </div>
                <span className="text-xs sm:text-sm font-bold text-foreground">
                  RAM
                </span>
              </div>
              <span className="text-sm font-black text-primary">
                {config.ram} GB
              </span>
            </div>
            <Slider
              value={[config.ram]}
              onValueChange={(value) =>
                setConfig((prev) => ({ ...prev, ram: value[0] }))
              }
              min={1}
              max={64}
              step={1}
              className="cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-muted-foreground mt-1.5 px-0.5">
              <span>1 GB</span>
              <span>64 GB</span>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5">
                <div className="w-6 h-6 bg-primary/20 rounded-md flex items-center justify-center">
                  <Icon name="HardDrive" size={12} className="text-primary" />
                </div>
                <span className="text-xs sm:text-sm font-bold text-foreground">
                  {t("resources.storage")}
                </span>
              </div>
              <span className="text-sm font-black text-primary">
                {config.storage} GB
              </span>
            </div>
            <Slider
              value={[config.storage]}
              onValueChange={(value) =>
                setConfig((prev) => ({ ...prev, storage: value[0] }))
              }
              min={10}
              max={500}
              step={10}
              className="cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-muted-foreground mt-1.5 px-0.5">
              <span>10 GB</span>
              <span>500 GB</span>
            </div>
          </div>

          <div className="pt-3 border-t border-border">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-muted-foreground">
                {t("resources.traffic")}
              </span>
              <div className="flex items-center gap-1.5">
                <Icon name="Wifi" size={12} className="text-secondary" />
                <span className="text-xs sm:text-sm font-bold text-foreground">
                  {t("resources.unlimited")}
                </span>
              </div>
            </div>
            <Button
              onClick={handleApply}
              className="w-full bg-primary hover:bg-primary/90 text-background font-bold text-sm h-8"
            >
              <Icon name="Check" size={12} className="mr-1.5" />
              Применить ко всем
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
