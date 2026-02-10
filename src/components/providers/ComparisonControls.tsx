import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";
import { useLanguage } from "@/contexts/LanguageContext";
import { useState } from "react";

interface ComparisonControlsProps {
  selectedForComparison: number[];
  compareProviders: () => void;
  onCancelComparison?: () => void; // Новый пропс для отмены сравненияв
}

export const ComparisonControls = ({
  selectedForComparison,
  compareProviders,
  onCancelComparison,
}: ComparisonControlsProps) => {
  const { t } = useLanguage();

  if (selectedForComparison.length === 0) {
    return null;
  }

  const canCompare = selectedForComparison.length >= 2;

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div className="bg-card/95 backdrop-blur-md border-2 border-primary/30 rounded-2xl shadow-2xl shadow-primary/20 p-3 flex items-center gap-3 animate-in slide-in-from-bottom-5 duration-300">
        {/* Блок со счетчиком */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center">
            <Icon name="GitCompare" size={16} className="text-primary" />
          </div>
          <span className="text-sm font-bold text-foreground">
            {selectedForComparison.length}
          </span>
        </div>

        {/* Разделитель */}
        <div className="h-6 w-px bg-border"></div>

        {/* Кнопки действий */}
        <div className="flex items-center gap-2">
          {/* Кнопка отмены сравнения */}
          {onCancelComparison && (
            <Button
              variant="outline"
              size="sm"
              onClick={onCancelComparison}
              className="h-8 px-3 rounded-lg border-2 border-destructive/30 hover:bg-destructive/10 hover:border-destructive/50 hover:text-destructive transition-all group"
              title="Отменить сравнение"
            >
              <Icon name="X" size={12} className="text-destructive" />
              <span className="sr-only">Отменить</span>
            </Button>
          )}

          {/* Кнопка сравнения */}
          <Button
            disabled={!canCompare}
            onClick={compareProviders}
            className={`
              h-8 px-4 rounded-lg font-bold transition-all
              ${
                canCompare
                  ? "bg-primary text-background hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/30"
                  : "bg-muted text-muted-foreground cursor-not-allowed"
              }
            `}
          >
            <span className="flex items-center gap-2">
              <span>{t("comparison.compare")}</span>
              <Icon
                name="ArrowRight"
                size={14}
                className={`
                  transition-transform
                  ${canCompare ? "group-hover:translate-x-1" : ""}
                `}
              />
            </span>
          </Button>
        </div>
      </div>
    </div>
  );
};
