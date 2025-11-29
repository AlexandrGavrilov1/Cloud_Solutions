import Icon from '@/components/ui/icon';

export const GamingFeaturesSection = () => {
  const features = [
    {
      icon: 'Shield',
      title: 'DDoS защита',
      description: 'Защита от DDoS атак до 600 Гбит/с. Ваш сервер всегда онлайн.'
    },
    {
      icon: 'Zap',
      title: 'NVMe диски',
      description: 'Быстрая загрузка карт и мгновенный отклик благодаря NVMe накопителям.'
    },
    {
      icon: 'Users',
      title: 'До 500 игроков',
      description: 'Мощные серверы поддерживают до 500 одновременных игроков.'
    },
    {
      icon: 'Settings',
      title: 'Моды и плагины',
      description: 'Установка модов и плагинов в один клик через панель управления.'
    },
    {
      icon: 'Clock',
      title: 'Быстрый запуск',
      description: 'Автоматическая установка сервера за 5 минут после оплаты.'
    },
    {
      icon: 'Headphones',
      title: 'Поддержка 24/7',
      description: 'Круглосуточная техподдержка решит любую проблему за 10-15 минут.'
    }
  ];

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Почему выбирают игровой хостинг
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Все что нужно для стабильной работы вашего игрового сервера
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, idx) => (
            <div
              key={idx}
              className="glass-effect rounded-2xl p-6 hover-lift group"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:shadow-glow transition-all">
                <Icon name={feature.icon as any} className="text-primary" size={24} />
              </div>
              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};