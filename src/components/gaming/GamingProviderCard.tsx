import { GamingProvider } from './types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { trackProviderClick } from '@/utils/metrika';

interface GamingProviderCardProps {
  provider: GamingProvider;
}

export const GamingProviderCard = ({ provider }: GamingProviderCardProps) => {
  return (
    <div className="glass-effect rounded-2xl p-6 hover-lift group h-full flex flex-col">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-4">
          <img
            src={provider.logo}
            alt={provider.name}
            className="w-16 h-16 rounded-xl object-cover"
          />
          <div>
            <h3 className="font-bold text-lg mb-1">{provider.name}</h3>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <Icon name="Star" className="text-primary fill-primary" size={16} />
                <span className="font-semibold text-foreground">{provider.rating}</span>
              </div>
              <span className="text-sm text-muted-foreground">•</span>
              <span className="text-sm text-muted-foreground">
                Uptime {provider.uptime}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {provider.promoText && (
        <div className="bg-primary/10 border border-primary/20 rounded-lg px-3 py-2 mb-4">
          <p className="text-sm font-medium text-primary flex items-center gap-2">
            <Icon name="Gift" size={16} />
            {provider.promoText}
          </p>
        </div>
      )}

      <div className="mb-4">
        <div className="flex items-baseline gap-2 mb-1">
          <span className="text-3xl font-bold gradient-text">
            {provider.basePrice}₽
          </span>
          <span className="text-muted-foreground">/месяц</span>
        </div>
        <p className="text-sm text-muted-foreground">
          + {provider.pricePerSlot}₽ за слот
        </p>
      </div>

      <div className="mb-4">
        <p className="text-sm font-semibold mb-2 flex items-center gap-2">
          <Icon name="Gamepad2" size={16} className="text-primary" />
          Поддерживаемые игры:
        </p>
        <div className="flex flex-wrap gap-2">
          {provider.supportedGames.slice(0, 4).map((game) => (
            <Badge
              key={game.game}
              variant="secondary"
              className="text-xs"
            >
              {game.icon} {game.game}
            </Badge>
          ))}
          {provider.supportedGames.length > 4 && (
            <Badge variant="outline" className="text-xs">
              +{provider.supportedGames.length - 4}
            </Badge>
          )}
        </div>
      </div>

      <div className="space-y-2 mb-4 flex-grow">
        {provider.features.map((feature, idx) => (
          <div key={idx} className="flex items-start gap-2 text-sm">
            <Icon name="Check" className="text-primary mt-0.5 shrink-0" size={16} />
            <span className="text-muted-foreground">{feature}</span>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-2 mb-4 text-sm">
        <Icon name="MapPin" className="text-primary" size={16} />
        <span className="text-muted-foreground">
          {provider.locations.join(', ')}
        </span>
      </div>

      {provider.trialDays && (
        <div className="bg-accent rounded-lg px-3 py-2 mb-4 flex items-center gap-2">
          <Icon name="Clock" className="text-primary" size={16} />
          <span className="text-sm font-medium">
            Тестовый период {provider.trialDays} {provider.trialDays === 1 ? 'день' : 'дня'}
          </span>
        </div>
      )}

      <Button
        className="w-full shadow-glow"
        onClick={() => {
          trackProviderClick();
          window.open(provider.url, '_blank');
        }}
      >
        Перейти на сайт
        <Icon name="ArrowRight" size={16} className="ml-2" />
      </Button>
    </div>
  );
};