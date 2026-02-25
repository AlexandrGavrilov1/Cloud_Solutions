// src/components/providers/Header.tsx
import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";
import { useState, useEffect } from "react";

export const Header = () => {
  const { language, setLanguage, t } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollThreshold = 10;
      setIsScrolled(window.scrollY > scrollThreshold);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Устанавливаем начальное состояние

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-xl bg-[#272932] border-b border-[#272932]">
      {/* Внутренний контейнер сс динамическими отступами */}
      <div
        className={`
          w-full px-4 
          transition-all duration-300 
          ${isScrolled ? "py-1" : "py-3"} 
          3xl:px-[185px]
        `}
      >
        <div className="flex items-center h-16">
          {/* Логотип */}
          <a
            href="/"
            className="flex items-center hover:opacity-90 transition-opacity"
          >
            <img
              src="https://cdn.poehali.dev/projects/59a78fde-be4d-41d0-a25a-c34adf675973/bucket/57ba635f-beec-4b15-924b-80a821db5fed.png"
              alt="TopCloudHub Logo"
              className="h-[60px] w-auto -mt-5 transition-opacity duration-300"
            />
          </a>

          {/* Десктопное меню */}
          <div className="hidden md:flex items-center gap-8 ml-12 tracking-widest">
            <a
              href="/blog"
              className="text-[15px] text-white hover:text-[#FF931F] transition-colors"
            >
              Блог
            </a>
            <a
              href="/uptime"
              className="text-[15px] text-white hover:text-[#FF931F] transition-colors"
            >
              {t("header.uptime")}
            </a>
            <a
              href="/promo"
              className="text-[15px] text-white hover:text-[#FF931F] transition-colors"
            >
              Акции
            </a>
          </div>

          {/* Переключатель темы на десктопе */}
          <div className="hidden md:flex items-center ml-auto">
            <button
              onClick={toggleTheme}
              className="flex items-center gap-2 p-2 rounded-lg hover:bg-white/10 transition-all"
              aria-label="Toggle theme"
            >
              <Icon
                name={theme === "light" ? "Moon" : "Sun"}
                size={20}
                className="text-white"
              />
            </button>
          </div>

          {/* Мобильные иконки */}
          <div className="md:hidden flex items-center gap-2 ml-auto">
            <button
              onClick={toggleTheme}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              aria-label="Toggle theme"
            >
              <Icon
                name={theme === "light" ? "Moon" : "Sun"}
                size={20}
                className="text-white"
              />
            </button>
            <button
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              <Icon
                name={mobileMenuOpen ? "X" : "Menu"}
                size={24}
                className="text-white"
              />
            </button>
          </div>
        </div>

        {/* Мобильное выпадающее меню */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-white/10">
            <div className="flex flex-col gap-4">
              <a
                href="/blog"
                className="flex items-center gap-2 px-4 py-2 text-sm font-normal text-white hover:text-[#FF931F] hover:bg-white/10 rounded-lg transition-all"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Icon name="BookOpen" size={16} />
                Блог
              </a>
              <a
                href="/uptime"
                className="flex items-center gap-2 px-4 py-2 text-sm font-normal text-white hover:text-[#FF931F] hover:bg-white/10 rounded-lg transition-all"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Icon name="Activity" size={16} />
                {t("header.uptime")}
              </a>
              <a
                href="/promo"
                className="flex items-center gap-2 px-4 py-2 text-sm font-normal text-white hover:text-[#FF931F] hover:bg-white/10 rounded-lg transition-all"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Icon name="Tag" size={16} />
                Акции
              </a>
              <button
                className="flex items-center gap-2 px-4 py-2 text-sm font-normal text-white hover:text-[#FF931F] hover:bg-white/10 rounded-lg transition-all text-left"
                onClick={toggleTheme}
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
