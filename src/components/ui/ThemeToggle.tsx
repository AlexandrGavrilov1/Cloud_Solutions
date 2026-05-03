import { useTheme, Theme } from "@/contexts/ThemeContext";
import Icon from "@/components/ui/icon";

const OPTIONS: { value: Theme; icon: string; label: string }[] = [
  { value: "light", icon: "Sun", label: "Светлая тема" },
  { value: "system", icon: "Monitor", label: "Системная тема" },
  { value: "dark", icon: "Moon", label: "Тёмная тема" },
];

interface Props {
  size?: "sm" | "md";
  className?: string;
}

export default function ThemeToggle({ size = "md", className = "" }: Props) {
  const { theme, setTheme } = useTheme();

  const btnSize = size === "sm" ? "w-6 h-6" : "w-7 h-7";
  const iconSize = size === "sm" ? 12 : 14;

  return (
    <div
      className={`inline-flex items-center gap-0.5 p-0.5 rounded-full border border-border bg-card ${className}`}
    >
      {OPTIONS.map((opt) => {
        const active = theme === opt.value;
        return (
          <button
            key={opt.value}
            onClick={() => setTheme(opt.value)}
            aria-label={opt.label}
            title={opt.label}
            className={`${btnSize} flex items-center justify-center rounded-full transition-all ${
              active
                ? "bg-secondary text-foreground shadow-soft"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Icon name={opt.icon} size={iconSize} />
          </button>
        );
      })}
    </div>
  );
}
