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
    <div className={`relative ${className}`}>
      <Icon
        name="Search"
        size={16}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
      />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
        className="
          w-full pl-10 pr-10 h-10 
          bg-background border-2 border-border rounded-lg
          focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 
          transition-all text-sm text-foreground placeholder:text-muted-foreground 
          font-medium hover:border-primary/50 hover:shadow-md
        "
        aria-label={placeholder}
      />
      {value && (
        <button
          onClick={() => onChange?.("")}
          type="button"
          className="
            absolute right-3 top-1/2 -translate-y-1/2 p-1.5 
            hover:bg-accent rounded-lg transition-colors
          "
          aria-label="Очистить поиск"
        >
          <Icon name="X" size={16} className="text-muted-foreground" />
        </button>
      )}
    </div>
  );
};
