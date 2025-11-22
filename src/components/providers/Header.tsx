import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useState } from 'react';

export const Header = () => {
  const { language, setLanguage, t } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  return (
    <nav className="sticky top-0 z-50 backdrop-blur-xl bg-card/60 border-b border-border">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <a href="/" className="flex items-center gap-3 hover:opacity-90 transition-opacity">
            <div className="relative">
              <div className="absolute inset-0 bg-primary rounded-2xl blur-xl opacity-50 shadow-neon"></div>
              <div className="relative w-12 h-12 bg-primary rounded-2xl flex items-center justify-center">
                <Icon name="Zap" className="text-background" size={22} />
              </div>
            </div>
            <div>
              <h1 className="text-xl font-bold text-primary">{t('header.title')}</h1>
              <p className="text-xs text-muted-foreground font-medium">{t('header.subtitle')}</p>
            </div>
          </a>
          <div className="hidden md:flex items-center gap-8">
            <a href="/blog" className="text-sm font-semibold text-foreground/80 hover:text-primary transition-colors flex items-center gap-1">
              <Icon name="BookOpen" size={14} />
              Блог
            </a>
            <a href="/uptime" className="text-sm font-semibold text-foreground/80 hover:text-primary transition-colors flex items-center gap-1">
              <Icon name="Activity" size={14} />
              {t('header.uptime')}
            </a>
            <a 
              href="#compare" 
              className="text-sm font-semibold text-foreground/80 hover:text-primary transition-colors"
              onClick={(e) => {
                e.preventDefault();
                const providersSection = document.querySelector('[id="providers"]');
                if (providersSection) {
                  providersSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  setTimeout(() => {
                    const compareButton = document.querySelector('[class*="Сравнить"]') as HTMLElement;
                    if (compareButton) {
                      compareButton.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }
                  }, 500);
                }
              }}
            >
              {t('header.compare')}
            </a>
            <button
              onClick={toggleTheme}
              className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border hover:border-primary/50 hover:bg-accent transition-all"
              aria-label="Toggle theme"
            >
              <Icon name={theme === 'light' ? 'Moon' : 'Sun'} size={18} className="text-foreground/70" />
            </button>
          </div>

          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-2 hover:bg-accent rounded-lg transition-colors"
              aria-label="Toggle theme"
            >
              <Icon name={theme === 'light' ? 'Moon' : 'Sun'} size={20} className="text-foreground/70" />
            </button>
            <button 
              className="p-2 hover:bg-accent rounded-lg transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              <Icon name={mobileMenuOpen ? "X" : "Menu"} size={24} className="text-foreground" />
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <div className="flex flex-col gap-4">
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
                {t('header.uptime')}
              </a>
              <a 
                href="#compare" 
                className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-foreground/80 hover:text-primary hover:bg-accent rounded-lg transition-all"
                onClick={(e) => {
                  e.preventDefault();
                  setMobileMenuOpen(false);
                  const providersSection = document.querySelector('[id="providers"]');
                  if (providersSection) {
                    providersSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }
                }}
              >
                <Icon name="GitCompare" size={16} />
                {t('header.compare')}
              </a>
              <button 
                className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-foreground/80 hover:text-primary hover:bg-accent rounded-lg transition-all text-left"
                onClick={() => {
                  toggleTheme();
                }}
              >
                <Icon name={theme === 'light' ? 'Moon' : 'Sun'} size={16} />
                {theme === 'light' ? 'Тёмная тема' : 'Светлая тема'}
              </button>
              <Button 
                onClick={() => {
                  setMobileMenuOpen(false);
                  window.location.href = '/';
                }}
                className="bg-primary text-background font-bold shadow-lg shadow-primary/30 w-full"
              >
                {t('header.start')}
                <Icon name="ArrowRight" size={16} className="ml-2" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};