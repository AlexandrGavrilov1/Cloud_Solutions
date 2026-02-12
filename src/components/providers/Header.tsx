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
    <nav className="sticky top-0 z-50 backdrop-blur-xl bg-[#2B3038] border-b border-[#2B3038]">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center h-16">
          <a
            href="/"
            className="flex items-center hover:opacity-90 transition-opacity"
          >
            <img
              src="https://cdn.poehali.dev/files/58a4ec73-d599-4708-9d67-43780b87fd56.png"
              alt="TopCloudHub Logo"
              className="h-[40px] w-auto transition-opacity duration-300"
            />
          </a>
          <div className="hidden md:flex items-center gap-8 ml-12">
            <a
              href="/"
              className="text-sm font-medium text-white hover:text-[#FF931F] transition-colors"
            >
              Как выбрать
            </a>
            <a
              href="/gaming"
              className="text-sm font-medium text-white hover:text-[#FF931F] transition-colors"
            >
              Игровые
            </a>
            <a
              href="/blog"
              className="text-sm font-medium text-white hover:text-[#FF931F] transition-colors"
            >
              Блог
            </a>
            <a
              href="/uptime"
              className="text-sm font-medium text-white hover:text-[#FF931F] transition-colors"
            >
              {t("header.uptime")}
            </a>
            <a
              href="/promo"
              className="text-sm font-medium text-white hover:text-[#FF931F] transition-colors"
            >
              Акции
            </a>
          </div>
          <div className="hidden md:flex items-center ml-auto">
            <button
              onClick={toggleTheme}
              className="flex items-center gap-2 p-2 rounded-lg hover:bg-white/10 transition-all"
              aria-label="Toggle theme"
            >
              <Icon
                name={theme === "light" ? "Moon" : "Sun"}
                size={18}
                className="text-white"
              />
            </button>
          </div>

          {/* === ИСПРАВЛЕНИЕ 1: кнопки прижаты к правому краю === */}
          <div className="md:hidden flex items-center gap-2 ml-auto">
            <button
              onClick={toggleTheme}
              className="p-2 hover:bg-accent rounded-lg transition-colors"
              aria-label="Toggle theme"
            >
              <Icon
                name={theme === "light" ? "Moon" : "Sun"}
                size={20}
                className={
                  theme === "dark" ? "text-white" : "text-foreground/70"
                }
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
                className={theme === "dark" ? "text-white" : "text-foreground"}
              />
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <div className="flex flex-col gap-4">
              <a
                href="/gaming"
                className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg transition-all ${
                  theme === "dark"
                    ? "text-white hover:text-[#FF931F] hover:bg-white/10"
                    : "text-foreground/80 hover:text-primary hover:bg-accent"
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <Icon
                  name="Gamepad2"
                  size={16}
                  className={theme === "dark" ? "text-white" : ""}
                />
                Игровые
              </a>
              <a
                href="/blog"
                className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg transition-all ${
                  theme === "dark"
                    ? "text-white hover:text-[#FF931F] hover:bg-white/10"
                    : "text-foreground/80 hover:text-primary hover:bg-accent"
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <Icon
                  name="BookOpen"
                  size={16}
                  className={theme === "dark" ? "text-white" : ""}
                />
                Блог
              </a>
              <a
                href="/uptime"
                className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg transition-all ${
                  theme === "dark"
                    ? "text-white hover:text-[#FF931F] hover:bg-white/10"
                    : "text-foreground/80 hover:text-primary hover:bg-accent"
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <Icon
                  name="Activity"
                  size={16}
                  className={theme === "dark" ? "text-white" : ""}
                />
                {t("header.uptime")}
              </a>
              <a
                href="/promo"
                className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg transition-all ${
                  theme === "dark"
                    ? "text-white hover:text-[#FF931F] hover:bg-white/10"
                    : "text-foreground/80 hover:text-primary hover:bg-accent"
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <Icon
                  name="Tag"
                  size={16}
                  className={theme === "dark" ? "text-white" : ""}
                />
                Акции
              </a>
              <button
                className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg transition-all text-left ${
                  theme === "dark"
                    ? "text-white hover:text-[#FF931F] hover:bg-white/10"
                    : "text-foreground/80 hover:text-primary hover:bg-accent"
                }`}
                onClick={toggleTheme}
              >
                <Icon
                  name={theme === "light" ? "Moon" : "Sun"}
                  size={16}
                  className={theme === "dark" ? "text-white" : ""}
                />
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
