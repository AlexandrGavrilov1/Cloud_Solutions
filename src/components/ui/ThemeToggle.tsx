import { useTheme, Theme } from "@/contexts/ThemeContext";
import Icon from "@/components/ui/icon";
import { useEffect, useRef, useState } from "react";

const OPTIONS: { value: Theme; icon: string; label: string; anim: string }[] = [
  { value: "light", icon: "Sun", label: "Светлая тема", anim: "anim-sun" },
  {
    value: "system",
    icon: "Monitor",
    label: "Системная тема",
    anim: "anim-monitor",
  },
  { value: "dark", icon: "Moon", label: "Тёмная тема", anim: "anim-moon" },
];

interface Props {
  size?: "sm" | "md";
  className?: string;
}

export default function ThemeToggle({ size = "md", className = "" }: Props) {
  const { theme, setTheme } = useTheme();
  const [animKey, setAnimKey] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const [pillStyle, setPillStyle] = useState<{
    left: number;
    width: number;
  } | null>(null);

  const btnSize = size === "sm" ? "w-7 h-7" : "w-8 h-8";
  const iconSize = size === "sm" ? 13 : 15;

  // Position the sliding pill behind the active button
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const activeIndex = OPTIONS.findIndex((o) => o.value === theme);
    const activeBtn = container.querySelectorAll("button")[
      activeIndex
    ] as HTMLElement | undefined;
    if (!activeBtn) return;
    const cRect = container.getBoundingClientRect();
    const bRect = activeBtn.getBoundingClientRect();
    setPillStyle({
      left: bRect.left - cRect.left,
      width: bRect.width,
    });
  }, [theme, size]);

  const handleClick = (next: Theme) => {
    if (next !== theme) setAnimKey((k) => k + 1);
    setTheme(next);
  };

  return (
    <div
      ref={containerRef}
      className={`relative inline-flex items-center gap-0.5 p-0.5 rounded-full border border-border bg-card ${className}`}
    >
      {/* Sliding pill */}
      {pillStyle && (
        <span
          aria-hidden
          className="absolute top-0.5 bottom-0.5 rounded-full bg-secondary shadow-soft transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)]"
          style={{ left: pillStyle.left, width: pillStyle.width }}
        />
      )}

      {OPTIONS.map((opt) => {
        const active = theme === opt.value;
        return (
          <button
            key={opt.value}
            onClick={() => handleClick(opt.value)}
            aria-label={opt.label}
            aria-pressed={active}
            title={opt.label}
            className={`${btnSize} relative z-10 flex items-center justify-center rounded-full transition-colors duration-200 ${
              active
                ? "text-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <span
              key={active ? animKey : `idle-${opt.value}`}
              className={`inline-flex ${active ? opt.anim : ""}`}
            >
              <Icon name={opt.icon} size={iconSize} />
            </span>
          </button>
        );
      })}
    </div>
  );
}
