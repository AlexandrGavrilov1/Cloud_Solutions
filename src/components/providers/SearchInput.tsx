// src/components/providers/SearchInput.tsx
import Icon from "@/components/ui/icon";

interface SearchInputProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export const SearchInput = ({
  value = "",
  onChange,
  placeholder = "Поиск...",
  className = "",
}: SearchInputProps) => {
  return (
    <div
      className={`relative w-full max-w-[151px] sm:max-w-[173px] md:max-w-[194px] lg:max-w-[216px] ${className}`}
    >
      <Icon
        name="Search"
        size={14}
        className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground"
      />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
        className="
          w-full pl-9 pr-8 h-9
          bg-background border-2 border-border rounded-xl
          focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 
          transition-all text-xs text-foreground placeholder:text-muted-foreground 
          font-medium hover:border-primary/50 hover:shadow-md
        "
        aria-label={placeholder}
      />
      {value && (
        <button
          onClick={() => onChange?.("")}
          type="button"
          className="
            absolute right-2 top-1/2 -translate-y-1/2 p-1
            hover:bg-accent rounded-lg transition-colors
          "
          aria-label="Очистить поиск"
        >
          <Icon name="X" size={14} className="text-muted-foreground" />
        </button>
      )}
    </div>
  );
};
