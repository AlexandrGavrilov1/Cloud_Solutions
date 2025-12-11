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
    <div className="relative">
      {/* Кнопка конфигуратора - всегда одного размера */}
      <div className="w-full max-w-[151px] sm:max-w-[173px] md:max-w-[194px] lg:max-w-[216px]">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full px-2.5 py-2 sm:px-3 sm:py-2.5 flex items-center justify-between hover:bg-primary/5 transition-colors rounded-xl bg-card border border-primary/20 shadow-md"
        >
          <div className="flex items-center gap-2 sm:gap-2.5">
            <div className="w-6 h-6 sm:w-7 sm:h-7 bg-primary/20 rounded-lg flex items-center justify-center">
              <Icon
                name="Sliders"
                size={12}
                className="text-primary w-3.5 h-3.5 sm:w-4 sm:h-4"
              />
            </div>
            <div className="text-left">
              <h3 className="text-sm sm:text-base font-bold text-foreground">
                Конфигуратор
              </h3>
              <p className="text-[8px] sm:text-[9px] text-muted-foreground mt-0.5 leading-tight">
                CPU: {config.cpu} • RAM: {config.ram}GB •{" "}
                {t("resources.storage")}: {config.storage}GB
              </p>
            </div>
          </div>
          <Icon
            name={isOpen ? "ChevronUp" : "ChevronDown"}
            size={14}
            className="text-muted-foreground transition-transform w-3.5 h-3.5 sm:w-4 sm:h-4"
          />
        </button>
      </div>

      {/* Выпадающая панель конфигуратора - адаптивная ширина */}
      {isOpen && (
        <div
          className="absolute top-full mt-2 
                        left-0 
                        w-[calc(100vw-2rem)] 
                        max-w-[320px] sm:max-w-[360px] md:max-w-[400px] 
                        bg-card border border-primary/20 rounded-xl shadow-md z-50"
        >
          <div className="px-3 pb-3.5 pt-3 space-y-4">
            <div className="flex items-center justify-between">
              <Badge className="bg-primary/20 text-primary border-0 text-xs px-2.5 py-1">
                {t("resources.customizeYourself")}
              </Badge>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleReset}
                className="text-xs text-muted-foreground hover:text-foreground h-6 px-2"
              >
                <Icon name="RotateCcw" size={9} className="mr-1 w-3 h-3" />
                Сбросить
              </Button>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-primary/20 rounded-md flex items-center justify-center">
                    <Icon
                      name="Cpu"
                      size={10}
                      className="text-primary w-3 h-3"
                    />
                  </div>
                  <span className="text-sm font-bold text-foreground">CPU</span>
                </div>
                <span className="text-sm font-black text-primary">
                  {config.cpu} vCPU
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="16"
                step="1"
                value={config.cpu}
                onChange={(e) =>
                  setConfig((prev) => ({
                    ...prev,
                    cpu: parseInt(e.target.value),
                  }))
                }
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer 
                           [&::-webkit-slider-thumb]:appearance-none 
                           [&::-webkit-slider-thumb]:h-4 
                           [&::-webkit-slider-thumb]:w-4 
                           [&::-webkit-slider-thumb]:rounded-full 
                           [&::-webkit-slider-thumb]:bg-primary 
                           [&::-webkit-slider-thumb]:border-2 
                           [&::-webkit-slider-thumb]:border-background"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1.5 px-0.5">
                <span>1 vCPU</span>
                <span>16 vCPU</span>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-primary/20 rounded-md flex items-center justify-center">
                    <Icon
                      name="MemoryStick"
                      size={10}
                      className="text-primary w-3 h-3"
                    />
                  </div>
                  <span className="text-sm font-bold text-foreground">RAM</span>
                </div>
                <span className="text-sm font-black text-primary">
                  {config.ram} GB
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="64"
                step="1"
                value={config.ram}
                onChange={(e) =>
                  setConfig((prev) => ({
                    ...prev,
                    ram: parseInt(e.target.value),
                  }))
                }
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer 
                           [&::-webkit-slider-thumb]:appearance-none 
                           [&::-webkit-slider-thumb]:h-4 
                           [&::-webkit-slider-thumb]:w-4 
                           [&::-webkit-slider-thumb]:rounded-full 
                           [&::-webkit-slider-thumb]:bg-primary 
                           [&::-webkit-slider-thumb]:border-2 
                           [&::-webkit-slider-thumb]:border-background"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1.5 px-0.5">
                <span>1 GB</span>
                <span>64 GB</span>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-primary/20 rounded-md flex items-center justify-center">
                    <Icon
                      name="HardDrive"
                      size={10}
                      className="text-primary w-3 h-3"
                    />
                  </div>
                  <span className="text-sm font-bold text-foreground">
                    {t("resources.storage")}
                  </span>
                </div>
                <span className="text-sm font-black text-primary">
                  {config.storage} GB
                </span>
              </div>
              <input
                type="range"
                min="10"
                max="500"
                step="10"
                value={config.storage}
                onChange={(e) =>
                  setConfig((prev) => ({
                    ...prev,
                    storage: parseInt(e.target.value),
                  }))
                }
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer 
                           [&::-webkit-slider-thumb]:appearance-none 
                           [&::-webkit-slider-thumb]:h-4 
                           [&::-webkit-slider-thumb]:w-4 
                           [&::-webkit-slider-thumb]:rounded-full 
                           [&::-webkit-slider-thumb]:bg-primary 
                           [&::-webkit-slider-thumb]:border-2 
                           [&::-webkit-slider-thumb]:border-background"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1.5 px-0.5">
                <span>10 GB</span>
                <span>500 GB</span>
              </div>
            </div>

            <div className="pt-3 border-t border-border">
              <div className="flex items-center justify-between mb-2.5">
                <span className="text-xs text-muted-foreground">
                  {t("resources.traffic")}
                </span>
                <div className="flex items-center gap-2">
                  <Icon
                    name="Wifi"
                    size={10}
                    className="text-secondary w-3 h-3"
                  />
                  <span className="text-sm font-bold text-foreground">
                    {t("resources.unlimited")}
                  </span>
                </div>
              </div>
              <Button
                onClick={handleApply}
                className="w-full bg-primary hover:bg-primary/90 text-background font-bold text-sm h-8"
              >
                <Icon name="Check" size={10} className="mr-1.5 w-3 h-3" />
                Применить ко всем
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}; /////////////////////////////////////////////////////////////
