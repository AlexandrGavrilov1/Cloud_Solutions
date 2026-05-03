// src/components/providers/Header.tsx
import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom"; // ✅ импортируем Link и useNavigate

export const Header = () => {
  const { language, setLanguage, t } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate(); // для программной навигации

  useEffect(() => {
    const handleScroll = () => {
      const scrollThreshold = 10;
      setIsScrolled(window.scrollY > scrollThreshold);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-xl bg-background/70 border-b border-border">
      <div
        className={`
          w-full px-4 
          transition-all duration-300 
          ${isScrolled ? "py-px" : "py-2"} 
          3xl:px-[185px]
        `}
      >
        <div
          className={`
            flex items-center h-16
            transition-all duration-300
            ${isScrolled ? "items-end pb-1" : "items-center"}
          `}
        >
          {/* Логотип – теперь Link без перезагрузки */}
          <Link
            to="/"
            className="flex items-center hover:opacity-80 transition-opacity gap-2"
          >
            <div className="w-7 h-7 rounded-md bg-foreground flex items-center justify-center">
              <Icon name="Triangle" size={14} className="text-background fill-background" />
            </div>
            <span className="text-[15px] text-foreground font-semibold tracking-tight">
              topvds
            </span>
          </Link>

          {/* Десктопное меню – заменяем a на Link */}
          <div className="hidden md:flex items-center gap-7 ml-10">
            <Link
              to="/vpn"
              className="text-[14px] text-muted-foreground hover:text-foreground transition-colors"
            >
              VPN
            </Link>
            {/* <Link
              to="/blog"
              className="text-[15px] text-white hover:text-[#FF931F] transition-colors"
            >
              Блог
            </Link> */}
            <Link
              to="/uptime"
              className="text-[14px] text-muted-foreground hover:text-foreground transition-colors"
            >
              Uptime
            </Link>
            <Link
              to="/promo"
              className="text-[14px] text-muted-foreground hover:text-foreground transition-colors"
            >
              Promo
            </Link>
          </div>

          {/* Переключатель темы на десктопе */}
          <div className="hidden md:flex items-center ml-auto">
            <button
              onClick={toggleTheme}
              className="flex items-center gap-2 p-2 rounded-md hover:bg-secondary transition-all"
              aria-label="Toggle theme"
            >
              <Icon
                name={theme === "light" ? "Moon" : "Sun"}
                size={16}
                className="text-muted-foreground"
              />
            </button>
          </div>

          {/* Мобильные иконки */}
          <div className="md:hidden flex items-center gap-1 ml-auto">
            <button
              onClick={toggleTheme}
              className="p-2 hover:bg-secondary rounded-md transition-colors"
              aria-label="Toggle theme"
            >
              <Icon
                name={theme === "light" ? "Moon" : "Sun"}
                size={16}
                className="text-muted-foreground"
              />
            </button>
            <button
              className="p-2 hover:bg-secondary rounded-md transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              <Icon
                name={mobileMenuOpen ? "X" : "Menu"}
                size={18}
                className="text-muted-foreground"
              />
            </button>
          </div>
        </div>

        {/* Мобильное выпадающее меню */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <div className="flex flex-col gap-4">
              <Link
                to="/vpn"
                className="flex items-center gap-2 px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-secondary rounded-md transition-all"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Icon name="Shield" size={16} />
                VPN
              </Link>
              {/* <Link
                to="/blog"
                className="flex items-center gap-2 px-4 py-2 text-sm font-normal text-white hover:text-[#FF931F] hover:bg-white/10 rounded-lg transition-all"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Icon name="BookOpen" size={16} />
                Блог
              </Link> */}
              <Link
                to="/uptime"
                className="flex items-center gap-2 px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-secondary rounded-md transition-all"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Icon name="Activity" size={16} />
                Uptime
              </Link>
              <Link
                to="/promo"
                className="flex items-center gap-2 px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-secondary rounded-md transition-all"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Icon name="Tag" size={16} />
                Promo
              </Link>
              <button
                className="flex items-center gap-2 px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-secondary rounded-md transition-all text-left"
                onClick={toggleTheme}
              >
                <Icon name={theme === "light" ? "Moon" : "Sun"} size={16} />
                {theme === "light" ? "Тёмная тема" : "Светлая тема"}
              </button>
              <Button
                onClick={() => {
                  setMobileMenuOpen(false);
                  navigate("/"); // ✅ используем navigate вместо window.location.href
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