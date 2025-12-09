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

// Константы для ограничений ресурсов
const RESOURCE_LIMITS = {
  cpu: { min: 1, max: 16, step: 1 },
  ram: { min: 1, max: 64, step: 1 },
  storage: { min: 10, max: 500, step: 10 },
} as const;

// Текстовые метки для ресурсов
const getResourceLabels = (t: (key: string) => string) => ({
  cpu: {
    title: "CPU",
    description: "Виртуальные процессоры",
    unit: "vCPU",
  },
  ram: {
    title: "RAM",
    description: "Оперативная память",
    unit: "GB",
  },
  storage: {
    title: t("resources.storage"),
    description: "Дисковое пространство",
    unit: "GB",
  },
});

// Маркеры для слайдеров
const SLIDER_MARKS = {
  cpu: [1, 4, 8, 12, 16],
  ram: [1, 16, 32, 48, 64],
  storage: [10, 100, 250, 375, 500],
} as const;

export const GlobalResourceConfig = ({
  onApplyConfig,
}: GlobalResourceConfigProps) => {
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [config, setConfig] = useState<ResourceConfig>({
    cpu: RESOURCE_LIMITS.cpu.min,
    ram: RESOURCE_LIMITS.ram.min,
    storage: RESOURCE_LIMITS.storage.min,
  });

  const panelRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const resourceLabels = getResourceLabels(t);
  const defaultConfig = {
    cpu: RESOURCE_LIMITS.cpu.min,
    ram: RESOURCE_LIMITS.ram.min,
    storage: RESOURCE_LIMITS.storage.min,
  };

  const handleApply = () => {
    onApplyConfig(config);
    setIsOpen(false);
  };

  const handleReset = () => {
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

  // Компонент секции ресурса
  const ResourceSection = ({
    type,
    iconName,
  }: {
    type: keyof ResourceConfig;
    iconName: string;
  }) => {
    const labels = resourceLabels[type];
    const limits = RESOURCE_LIMITS[type];
    const marks = SLIDER_MARKS[type];

    return (
      <div className="space-y-3 mb-4 p-3 bg-background/30 rounded-lg border border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center">
              <Icon name={iconName as any} size={16} className="text-primary" />
            </div>
            <div>
              <span className="text-sm font-bold text-foreground">
                {labels.title}
              </span>
              <p className="text-xs text-muted-foreground">
                {labels.description}
              </p>
            </div>
          </div>
          <span className="text-xl font-black text-primary">
            {config[type]} {labels.unit}
          </span>
        </div>
        <Slider
          value={[config[type]]}
          onValueChange={(value) =>
            setConfig((prev) => ({ ...prev, [type]: value[0] }))
          }
          min={limits.min}
          max={limits.max}
          step={limits.step}
          className="cursor-pointer"
        />
        <div className="flex justify-between text-xs text-muted-foreground px-0.5">
          {marks.map((mark) => (
            <span key={mark}>
              {mark} {type === "cpu" ? "vCPU" : "GB"}
            </span>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div
      className={`relative ${isOpen ? "w-full" : "inline-block"}`}
      ref={panelRef}
    >
      {/* Кнопка конфигуратора - занимает всю ширину только при раскрытии */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-label={t("resources.configurator")}
        aria-controls="resource-config-panel"
        className={`flex items-center justify-between hover:bg-primary/5 transition-colors rounded-2xl bg-card border border-primary/20 shadow-lg ${
          isOpen
            ? "w-full px-4 py-3"
            : "inline-flex items-center gap-3 px-4 py-3 whitespace-nowrap"
        }`}
      >
        <div className="flex items-center gap-3">
          {/* Иконка слева от названия на основной кнопке */}
          <div className="w-7 h-7 sm:w-8 sm:h-8 bg-primary/20 rounded-xl flex items-center justify-center shrink-0">
            <Icon
              name="Sliders"
              size={14}
              className="text-primary sm:w-4 sm:h-4"
            />
          </div>

          <div className="flex flex-col items-start">
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
          id="resource-config-panel"
          role="region"
          aria-label={t("resources.configurator")}
          className="absolute top-full left-0 right-0 mt-2 z-[9999] bg-card border border-primary/20 rounded-2xl shadow-2xl overflow-hidden"
          style={{
            maxHeight: "calc(100vh - 200px)",
            overflowY: "auto",
          }}
        >
          <div className="p-4 sm:p-5" ref={contentRef}>
            {/* Бейдж "Настройте под себя" и кнопка сброса в одной строке */}
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-border">
              {/* Бейдж слева */}
              <Badge className="bg-primary/20 text-primary border-0 text-xs px-3 py-1">
                <Icon name="Settings" size={12} className="mr-1" />
                {t("resources.customizeYourself")}
              </Badge>

              {/* Кнопка сброса справа */}
              <Button
                variant="ghost"
                size="sm"
                onClick={handleReset}
                className="text-xs text-muted-foreground hover:text-foreground hover:bg-background h-7 px-2"
              >
                <Icon name="RotateCcw" size={12} className="mr-1" />
                {t("resources.reset") || "Сбросить"}
              </Button>
            </div>

            {/* Настройка CPU */}
            <ResourceSection type="cpu" iconName="Cpu" />

            {/* Настройка RAM */}
            <ResourceSection type="ram" iconName="MemoryStick" />

            {/* Настройка хранилища */}
            <ResourceSection type="storage" iconName="HardDrive" />

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
                {t("resources.applyToAllProviders") ||
                  "Применить ко всем провайдерам"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
