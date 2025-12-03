import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";
import { useState } from "react";

export const Header = () => {
  const { language, setLanguage, t } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-xl bg-card/60 border-b border-border">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <a
            href="/"
            className="flex items-center hover:opacity-90 transition-opacity"
          >
            <img
              src={
                theme === "dark"
                  ? "TCH_logo/logo_v2.jpg"
                  : "https://cdn.poehali.dev/files/8f328ff2-4310-4457-a129-5e42f69ef566.png"
              }
              alt="TopCloudHub Logo"
              className="h-[56px] w-auto transition-opacity duration-300"
            />
          </a>
          <div className="hidden md:flex items-center gap-8">
            <a
              href="/gaming"
              className="text-sm font-semibold text-foreground/80 hover:text-primary transition-colors flex items-center gap-1"
            >
              <Icon name="Gamepad2" size={14} />
              Игровые
            </a>
            <a
              href="/blog"
              className="text-sm font-semibold text-foreground/80 hover:text-primary transition-colors flex items-center gap-1"
            >
              <Icon name="BookOpen" size={14} />
              Блог
            </a>
            <a
              href="/uptime"
              className="text-sm font-semibold text-foreground/80 hover:text-primary transition-colors flex items-center gap-1"
            >
              <Icon name="Activity" size={14} />
              {t("header.uptime")}
            </a>
            <a
              href="/promo"
              className="text-sm font-semibold text-foreground/80 hover:text-primary transition-colors flex items-center gap-1"
            >
              <Icon name="Tag" size={14} />
              Акции
            </a>
            <button
              onClick={toggleTheme}
              className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border hover:border-primary/50 hover:bg-accent transition-all"
              aria-label="Toggle theme"
            >
              <Icon
                name={theme === "light" ? "Moon" : "Sun"}
                size={18}
                className="text-foreground/70"
              />
            </button>
          </div>

          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-2 hover:bg-accent rounded-lg transition-colors"
              aria-label="Toggle theme"
            >
              <Icon
                name={theme === "light" ? "Moon" : "Sun"}
                size={20}
                className="text-foreground/70"
              />
            </button>
            <button
              className="p-2 hover:bg-accent rounded-lg transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              <Icon
                name={mobileMenuOpen ? "X" : "Menu"}
                size={24}
                className="text-foreground"
              />
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <div className="flex flex-col gap-4">
              <a
                href="/gaming"
                className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-foreground/80 hover:text-primary hover:bg-accent rounded-lg transition-all"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Icon name="Gamepad2" size={16} />
                Игровые
              </a>
              <a
                href="/blog"
                className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-foreground/80 hover:text-primary hover:bg-accent rounded-lg transition-all"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Icon name="BookOpen" size={16} />
                Блог
              </a>
              <a
                href="/uptime"
                className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-foreground/80 hover:text-primary hover:bg-accent rounded-lg transition-all"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Icon name="Activity" size={16} />
                {t("header.uptime")}
              </a>
              <a
                href="/promo"
                className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-foreground/80 hover:text-primary hover:bg-accent rounded-lg transition-all"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Icon name="Tag" size={16} />
                Акции
              </a>
              <button
                className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-foreground/80 hover:text-primary hover:bg-accent rounded-lg transition-all text-left"
                onClick={() => {
                  toggleTheme();
                }}
              >
                <Icon name={theme === "light" ? "Moon" : "Sun"} size={16} />
                {theme === "light" ? "Тёмная тема" : "Светлая тема"}
              </button>
              <Button
                onClick={() => {
                  setMobileMenuOpen(false);
                  window.location.href = "/";
                }}
                className="bg-primary text-background font-bold shadow-lg shadow-primary/30 w-full"
              >
                {t("header.start")}
                <Icon name="ArrowRight" size={16} className="ml-2" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};
