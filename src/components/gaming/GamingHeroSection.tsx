import { useLanguage } from '@/contexts/LanguageContext';
import Icon from '@/components/ui/icon';

export const GamingHeroSection = () => {
  const { t } = useLanguage();

  return (
    <section className="relative py-20 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full glass-effect mb-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Icon name="Gamepad2" className="text-primary" size={24} />
            <span className="font-semibold text-muted-foreground">
              Игровые серверы
            </span>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100">
            Игровой хостинг для{' '}
            <span className="gradient-text">вашего сервера</span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200">
            Мощные серверы с DDoS защитой для Minecraft, CS:GO, Rust и других популярных игр. 
            Быстрый запуск за 5 минут.
          </p>

          <div className="flex flex-wrap justify-center gap-6 text-sm animate-in fade-in slide-in-from-bottom-4 duration-500 delay-300">
            <div className="flex items-center gap-2">
              <Icon name="Shield" className="text-primary" size={20} />
              <span>DDoS защита</span>
            </div>
            <div className="flex items-center gap-2">
              <Icon name="Zap" className="text-primary" size={20} />
              <span>NVMe диски</span>
            </div>
            <div className="flex items-center gap-2">
              <Icon name="Clock" className="text-primary" size={20} />
              <span>Uptime 99.9%</span>
            </div>
            <div className="flex items-center gap-2">
              <Icon name="Users" className="text-primary" size={20} />
              <span>До 500 игроков</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
