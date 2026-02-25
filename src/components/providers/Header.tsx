// src/components/providers/Header.tsx
import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";
import { useState, useEffect, useRef } from "react";

export const Header = () => {
  const { language, setLanguage, t } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false); // общее состояние скролла
  const [logoShifted, setLogoShifted] = useState(false); // состояние для логотипа
  const [paddingReduced, setPaddingReduced] = useState(false); // состояние для отступов
  const lastScrollY = useRef(0);
  const timeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const scrollThreshold = 10;
      const isCurrentlyScrolled = currentScrollY > scrollThreshold;

      // Определяем направление скролла
      const scrollingDown = currentScrollY > lastScrollY.current;

      // Очищаем предыдущий таймаут
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      if (isCurrentlyScrolled) {
        // Скроллим вниз или уже внизу
        if (scrollingDown) {
          // Сначала смещаем логотип, затем уменьшаем отступы
          setLogoShifted(true);
          timeoutRef.current = setTimeout(() => {
            setPaddingReduced(true);
          }, 100); // задержка 100 мс
        } else {
          // Если уже были внизу и продолжаем скроллить вниз – оставляем как есть
          setLogoShifted(true);
          setPaddingReduced(true);
        }
      } else {
        // Скроллим вверх к началу
        if (!scrollingDown) {
          // Сначала увеличиваем отступы, затем поднимаем логотип
          setPaddingReduced(false);
          timeoutRef.current = setTimeout(() => {
            setLogoShifted(false);
          }, 100);
        } else {
          // Если уже были наверху – сбрасываем всё
          setPaddingReduced(false);
          setLogoShifted(false);
        }
      }

      lastScrollY.current = currentScrollY;
      setIsScrolled(isCurrentlyScrolled);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // инициализация

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-xl bg-[#272932] border-b border-[#272932]">
      {/* Внутренний контейнер с динамическими отступами */}
      <div
        className={`
          w-full px-4 
          transition-all duration-300 
          ${paddingReduced ? "py-1" : "py-3"} 
          3xl:px-[185px]
        `}
      >
        {/* Контейнер с содержимым */}
        <div
          className={`
            flex items-center h-16
            transition-all duration-300
            ${logoShifted ? "items-end pb-1" : "items-center"}
          `}
        >
          {/* Логотип (условный отрицательный отступ при обычном состоянии) */}
          <a
            href="/"
            className="flex items-center hover:opacity-90 transition-opacity"
          >
            <img
              src="https://cdn.poehali.dev/projects/59a78fde-be4d-41d0-a25a-c34adf675973/bucket/57ba635f-beec-4b15-924b-80a821db5fed.png"
              alt="TopCloudHub Logo"
              className={`
                h-[60px] w-auto transition-opacity duration-300
                ${!logoShifted ? "-mt-5" : ""}
              `}
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

        {/* Мобильное выпадающее меню (без изменений) */}
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
