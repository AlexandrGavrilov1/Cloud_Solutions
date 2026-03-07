import { Button } from '@/components/ui/button';

type Period = '1' | '7' | '30';

interface PeriodSelectorProps {
  value: Period;
  onChange: (period: Period) => void;
  disabled?: boolean;
}

export const PeriodSelector = ({ value, onChange, disabled }: PeriodSelectorProps) => {
  const periods: { value: Period; label: string }[] = [
    { value: '1', label: 'День' },
    { value: '7', label: 'Неделя' },
    { value: '30', label: 'Месяц' },
  ];

  return (
    <div className="flex gap-2 bg-card p-1 rounded-lg border">
      {periods.map((p) => (
        <Button
          key={p.value}
          size="sm"
          variant={value === p.value ? 'default' : 'ghost'}
          onClick={() => onChange(p.value)}
          disabled={disabled}
        >
          {p.label}
        </Button>
      ))}
    </div>
  );
};
