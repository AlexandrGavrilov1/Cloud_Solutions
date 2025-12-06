// components/ui/SearchInput.tsx
import { Search } from 'lucide-react';
import React, { useState, useEffect, useRef } from 'react';

interface SearchInputProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  debounceDelay?: number;
  className?: string;
  autoFocus?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const SearchInput: React.FC<SearchInputProps> = ({
  value = '',
  onChange,
  placeholder = 'Поиск...',
  debounceDelay = 300,
  className = '',
  autoFocus = false,
  size = 'md',
}) => {
  const [inputValue, setInputValue] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  const handleChange = (newValue: string) => {
    setInputValue(newValue);

    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    timerRef.current = setTimeout(() => {
      onChange?.(newValue);
    }, debounceDelay);
  };

  const handleClear = () => {
    setInputValue('');
    onChange?.('');
    inputRef.current?.focus();
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  const sizeClasses = {
    sm: { input: 'h-9 text-xs pl-9 pr-9', icon: 'left-2.5 w-3.5 h-3.5', button: 'right-2 p-1' },
    md: { input: 'h-10 text-sm pl-10 pr-10', icon: 'left-3 w-4 h-4', button: 'right-2 p-1.5' },
    lg: { input: 'h-12 text-base pl-12 pr-12', icon: 'left-4 w-5 h-5', button: 'right-3 p-2' },
  }[size];

  return (
    <div className={`relative w-full ${className}`}>
      <Search className={`absolute ${sizeClasses.icon} top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none`} />
      
      <input
        ref={inputRef}
        type="text"
        value={inputValue}
        onChange={(e) => handleChange(e.target.value)}
        placeholder={placeholder}
        className={`
          w-full ${sizeClasses.input} bg-background border-2 border-border rounded-lg
          focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 
          transition-all text-foreground placeholder:text-muted-foreground font-medium
          hover:border-primary/50 hover:shadow-md
        `}
        aria-label={placeholder}
      />

      {inputValue && (
        <button
          onClick={handleClear}
          type="button"
          className={`absolute ${sizeClasses.button} top-1/2 -translate-y-1/2 hover:bg-accent rounded transition-colors`}
          aria-label="Очистить поиск"
        >
          ?
        </button>
      )}
    </div>
  );
};