import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

interface FilterOption {
  value: string;
  label: string;
  color?: string;
}

interface ChartFiltersProps {
  selected: string[];
  onChange: (selected: string[]) => void;
  options: FilterOption[];
}

export const ChartFilters = ({ selected, onChange, options }: ChartFiltersProps) => {
  const toggle = (value: string) => {
    if (selected.includes(value)) {
      onChange(selected.filter(v => v !== value));
    } else {
      onChange([...selected, value]);
    }
  };

  return (
    <div className="flex items-center gap-4">
      {options.map(opt => (
        <div key={opt.value} className="flex items-center space-x-2">
          <Checkbox
            id={`filter-${opt.value}`}
            checked={selected.includes(opt.value)}
            onCheckedChange={() => toggle(opt.value)}
          />
          <Label htmlFor={`filter-${opt.value}`} className="text-sm flex items-center gap-1">
            {opt.color && <span className="w-3 h-3 rounded-full" style={{ backgroundColor: opt.color }} />}
            {opt.label}
          </Label>
        </div>
      ))}
    </div>
  );
};
