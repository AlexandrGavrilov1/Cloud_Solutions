import Icon from '@/components/ui/icon';
import { useTheme } from '@/contexts/ThemeContext';
import { useState } from 'react';

export const Header = () => {
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  return (
    <nav className="sticky top-0 z-50 bg-[#2C3544] border-b border-gray-700">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <a href="/" className="flex items-center hover:opacity-90 transition-opacity">
            <div className="flex items-center gap-2">
              <div className="text-white text-xl font-bold">TopCloud</div>
              <div className="bg-orange-500 text-white text-xl font-bold px-2 py-0.5 rounded">hub</div>
            </div>
          </a>
          
          <div className="hidden md:flex items-center gap-8">
            <a href="/" className="text-sm font-medium text-orange-500 hover:text-orange-400 transition-colors">
              Как выбрать
            </a>
            <a href="/gaming" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">
              Игровые
            </a>
            <a href="/blog" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">
              Блог
            </a>
            <a href="/uptime" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">
              Аптайм
            </a>
            <a href="/promo" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">
              Акции
            </a>
            <button
              onClick={toggleTheme}
              className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors"
              aria-label="Toggle theme"
            >
              <Icon name={theme === 'light' ? 'Moon' : 'Sun'} size={18} />
            </button>
          </div>

          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
              aria-label="Toggle theme"
            >
              <Icon name={theme === 'light' ? 'Moon' : 'Sun'} size={20} className="text-gray-300" />
            </button>
            <button 
              className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              <Icon name={mobileMenuOpen ? "X" : "Menu"} size={24} className="text-white" />
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-700">
            <div className="flex flex-col gap-4">
              <a 
                href="/" 
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-orange-500 hover:bg-gray-700 rounded-lg transition-all"
                onClick={() => setMobileMenuOpen(false)}
              >
                Как выбрать
              </a>
              <a 
                href="/gaming" 
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg transition-all"
                onClick={() => setMobileMenuOpen(false)}
              >
                Игровые
              </a>
              <a 
                href="/blog" 
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg transition-all"
                onClick={() => setMobileMenuOpen(false)}
              >
                Блог
              </a>
              <a 
                href="/uptime" 
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg transition-all"
                onClick={() => setMobileMenuOpen(false)}
              >
                Аптайм
              </a>
              <a 
                href="/promo" 
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg transition-all"
                onClick={() => setMobileMenuOpen(false)}
              >
                Акции
              </a>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};