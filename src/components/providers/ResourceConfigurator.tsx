import { useState, useRef, useEffect } from "react";
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

  const panelRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const handleApply = () => {
    onApplyConfig(config);
    setIsOpen(false);
  };

  const handleReset = () => {
    const defaultConfig = { cpu: 1, ram: 1, storage: 10 };
    setConfig(defaultConfig);
    onApplyConfig(defaultConfig);
  };

  // Закрытие панели при клике вне её
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        panelRef.current &&
        !panelRef.current.contains(event.target as Node) &&
        isOpen
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div
      className={`relative ${isOpen ? "w-full" : "inline-block"}`}
      ref={panelRef}
    >
      {/* Кнопка конфигуратора - занимает всю ширину только при раскрытии */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center justify-between hover:bg-primary/5 transition-colors rounded-2xl bg-card border border-primary/20 shadow-lg ${
          isOpen
            ? "w-full px-4 py-3"
            : "inline-flex items-center gap-3 px-4 py-3 whitespace-nowrap"
        }`}
      >
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 sm:w-8 sm:h-8 bg-primary/20 rounded-xl flex items-center justify-center shrink-0">
            <Icon
              name="Sliders"
              size={14}
              className="text-primary sm:w-4 sm:h-4"
            />
          </div>
          <div
            className={`flex flex-col items-start ${!isOpen && "hidden sm:flex"}`}
          >
            <h3 className="text-base sm:text-lg font-bold text-foreground leading-tight">
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
          size={20}
          className="text-muted-foreground transition-transform"
        />
      </button>

      {/* Абсолютно позиционированная панель конфигуратора */}
      {isOpen && (
        <div
          className="absolute top-full left-0 right-0 mt-2 z-50 bg-card border border-primary/20 rounded-2xl shadow-xl overflow-hidden"
          style={{
            maxHeight: "calc(100vh - 200px)",
            overflowY: "auto",
          }}
        >
          <div className="p-4 sm:p-5" ref={contentRef}>
            {/* Заголовок и кнопка сброса */}
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-border">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Icon name="Sliders" size={16} className="text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-foreground">
                    {t("resources.configurator")}
                  </h3>
                </div>
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={handleReset}
                className="text-xs text-muted-foreground hover:text-foreground hover:bg-background h-7 px-2"
              >
                <Icon name="RotateCcw" size={12} className="mr-1" />
                Сбросить
              </Button>
            </div>

            {/* Бейдж настройки */}
            <div className="mb-4">
              <Badge className="bg-primary/20 text-primary border-0 text-xs px-3 py-1">
                <Icon name="Settings" size={12} className="mr-1" />
                {t("resources.customizeYourself")}
              </Badge>
            </div>

            {/* Настройка CPU */}
            <div className="space-y-3 mb-4 p-3 bg-background/30 rounded-lg border border-border">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center">
                    <Icon name="Cpu" size={16} className="text-primary" />
                  </div>
                  <div>
                    <span className="text-sm font-bold text-foreground">
                      CPU
                    </span>
                    <p className="text-xs text-muted-foreground">
                      Виртуальные процессоры
                    </p>
                  </div>
                </div>
                <span className="text-xl font-black text-primary">
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
              <div className="flex justify-between text-xs text-muted-foreground px-0.5">
                <span>1 vCPU</span>
                <span>4 vCPU</span>
                <span>8 vCPU</span>
                <span>12 vCPU</span>
                <span>16 vCPU</span>
              </div>
            </div>

            {/* Настройка RAM */}
            <div className="space-y-3 mb-4 p-3 bg-background/30 rounded-lg border border-border">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center">
                    <Icon
                      name="MemoryStick"
                      size={16}
                      className="text-primary"
                    />
                  </div>
                  <div>
                    <span className="text-sm font-bold text-foreground">
                      RAM
                    </span>
                    <p className="text-xs text-muted-foreground">
                      Оперативная память
                    </p>
                  </div>
                </div>
                <span className="text-xl font-black text-primary">
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
              <div className="flex justify-between text-xs text-muted-foreground px-0.5">
                <span>1 GB</span>
                <span>16 GB</span>
                <span>32 GB</span>
                <span>48 GB</span>
                <span>64 GB</span>
              </div>
            </div>

            {/* Настройка хранилища */}
            <div className="space-y-3 mb-4 p-3 bg-background/30 rounded-lg border border-border">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center">
                    <Icon name="HardDrive" size={16} className="text-primary" />
                  </div>
                  <div>
                    <span className="text-sm font-bold text-foreground">
                      {t("resources.storage")}
                    </span>
                    <p className="text-xs text-muted-foreground">
                      Дисковое пространство
                    </p>
                  </div>
                </div>
                <span className="text-xl font-black text-primary">
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
              <div className="flex justify-between text-xs text-muted-foreground px-0.5">
                <span>10 GB</span>
                <span>100 GB</span>
                <span>250 GB</span>
                <span>375 GB</span>
                <span>500 GB</span>
              </div>
            </div>

            {/* Трафик и кнопка применения */}
            <div className="pt-4 border-t border-border">
              <div className="flex items-center justify-between mb-4 p-3 bg-background/30 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-secondary/20 rounded-lg flex items-center justify-center">
                    <Icon name="Wifi" size={16} className="text-secondary" />
                  </div>
                  <div>
                    <span className="text-sm font-bold text-foreground">
                      {t("resources.traffic")}
                    </span>
                    <p className="text-xs text-muted-foreground">
                      Скорость и объём
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-base font-black text-secondary">
                    {t("resources.unlimited")}
                  </span>
                  <p className="text-xs text-muted-foreground">
                    без ограничений
                  </p>
                </div>
              </div>

              <Button
                onClick={handleApply}
                className="w-full bg-primary hover:bg-primary/90 text-background font-bold py-4 text-base rounded-lg"
                size="lg"
              >
                <Icon name="Check" size={16} className="mr-2" />
                Применить ко всем провайдерам
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
