import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { PeriodSelector } from './PeriodSelector';
import Icon from '@/components/ui/icon';

interface ComparisonPanelProps {
  onCompare: (period1: string, period2: string) => void;
  disabled?: boolean;
}

export const ComparisonPanel = ({ onCompare, disabled }: ComparisonPanelProps) => {
  const [open, setOpen] = useState(false);
  const [period1, setPeriod1] = useState<'1' | '7' | '30'>('30');
  const [period2, setPeriod2] = useState<'1' | '7' | '30'>('30');

  const handleApply = () => {
    onCompare(period1, period2);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" disabled={disabled} className="gap-2">
          <Icon name="GitCompare" size={16} />
          Сравнить периоды
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-4">
        <div className="space-y-4">
          <h4 className="font-medium">Выберите периоды для сравнения</h4>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-muted-foreground">Период 1</label>
              <PeriodSelector value={period1} onChange={setPeriod1} />
            </div>
            <div>
              <label className="text-sm text-muted-foreground">Период 2</label>
              <PeriodSelector value={period2} onChange={setPeriod2} />
            </div>
          </div>
          <Button onClick={handleApply} className="w-full">Применить</Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};
