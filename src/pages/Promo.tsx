import { Header } from '@/components/providers/Header';
import { Footer } from '@/components/providers/Footer';
import { providers } from '@/data/providers';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

const Promo = () => {
  const allowedProviders = ['Timeweb Cloud', 'Serverspace', 'SprintHost'];
  const providersWithPromo = providers
    .filter(p => allowedProviders.includes(p.name))
    .sort((a, b) => {
      if (a.name === 'Timeweb Cloud') return -1;
      if (b.name === 'Timeweb Cloud') return 1;
      return 0;
    });

  const trackClick = async (providerId: number) => {
    try {
      await fetch('https://functions.poehali.dev/d0b8e2ce-45c2-4ab9-8d08-baf03c0268f4', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          provider_id: providerId,
        }),
      });
    } catch (error) {
      console.error('Error tracking click:', error);
    }
  };

  const handleProviderClick = async (provider: typeof providers[0]) => {
    if (provider.url) {
      await trackClick(provider.id);
      window.open(provider.url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <section className="py-24 relative overflow-hidden">
        <div className="absolute top-20 left-10 w-[400px] h-[400px] bg-secondary/20 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-20 right-10 w-[400px] h-[400px] bg-primary/10 rounded-full blur-[100px]"></div>
        
        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16 space-y-4">
              <div className="inline-flex items-center gap-2 bg-accent border border-secondary/30 rounded-full px-5 py-2.5">
                <Icon name="Tag" size={16} className="text-secondary" />
                <span className="text-sm font-bold text-secondary">Актуальные предложения</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-extrabold text-foreground">
                Промокоды и акции от провайдеров
              </h1>
              <p className="text-xl text-muted-foreground">
                Экономьте на хостинге с нашими эксклюзивными предложениями
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {providersWithPromo.map((provider) => (
                <Card key={provider.id} className="border-2 border-border hover:border-primary/50 transition-all group hover:shadow-xl bg-gradient-to-br from-card to-card/50 overflow-hidden relative">
                  {provider.name === 'Timeweb Cloud' && (
                    <>
                      <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-orange-500 to-red-500 py-1.5 px-4 z-10">
                        <div className="flex items-center justify-center gap-2">
                          <Icon name="Zap" size={14} className="text-white" />
                          <span className="text-xs font-bold text-white uppercase tracking-wide">Выгодное предложение</span>
                          <Icon name="Zap" size={14} className="text-white" />
                        </div>
                      </div>
                      <div className="absolute top-4 right-4 z-10">
                        <div className="bg-gradient-to-br from-orange-500 to-red-500 rounded-full p-2 shadow-lg animate-pulse">
                          <Icon name="Flame" size={20} className="text-white" />
                        </div>
                      </div>
                    </>
                  )}
                  <div className={`p-6 md:p-8 ${provider.name === 'Timeweb Cloud' ? 'pt-12' : ''}`}>
                    <div className="flex items-start gap-4 mb-6">
                      <div className="flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden bg-white border border-primary/10 flex items-center justify-center">
                        <img 
                          src={provider.logo} 
                          alt={provider.name} 
                          className="w-14 h-14 object-contain"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-2xl font-bold text-foreground mb-2">{provider.name}</h3>
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => {
                              const avgRating = provider.reviews.reduce((sum, r) => sum + r.rating, 0) / provider.reviews.length;
                              return (
                                <Icon 
                                  key={i}
                                  name="Star" 
                                  size={14} 
                                  className={i < Math.round(avgRating) ? "fill-primary text-primary" : "text-muted"}
                                />
                              );
                            })}
                          </div>
                          <span className="text-sm font-bold text-foreground">
                            {(provider.reviews.reduce((sum, r) => sum + r.rating, 0) / provider.reviews.length).toFixed(1)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {provider.promoText && (
                        <div className="bg-secondary/10 border-2 border-secondary/30 rounded-xl p-4">
                          <div className="flex items-start gap-3">
                            <div className="flex-shrink-0 w-10 h-10 bg-secondary rounded-lg flex items-center justify-center">
                              <Icon name="Gift" size={20} className="text-background" />
                            </div>
                            <div className="flex-1">
                              <div className="text-xs font-bold text-secondary uppercase mb-1">
                                Спецпредложение
                              </div>
                              <div className="text-sm font-semibold text-foreground">{provider.promoText}</div>
                            </div>
                          </div>
                        </div>
                      )}

                      {provider.pricingDetails.discounts && provider.pricingDetails.discounts.length > 0 && (
                        <div className="bg-accent border-2 border-border rounded-xl p-4">
                          <div className="flex items-start gap-3">
                            <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                              <Icon name="Percent" size={20} className="text-background" />
                            </div>
                            <div className="flex-1">
                              <div className="text-xs font-bold text-foreground uppercase mb-2">Скидки</div>
                              <div className="flex flex-wrap gap-2">
                                {provider.pricingDetails.discounts.map((discount, idx) => (
                                  <Badge 
                                    key={idx} 
                                    className="bg-secondary/20 text-secondary border-secondary/30 font-bold"
                                  >
                                    -{discount.percent}% на {discount.months} мес
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    <Button 
                      className="w-full mt-6 h-12 text-base font-bold bg-primary text-background shadow-lg shadow-primary/30 hover:shadow-neon transition-all group"
                      onClick={() => handleProviderClick(provider)}
                      disabled={!provider.url}
                    >
                      Получить предложение
                      <Icon name="ExternalLink" size={18} className="ml-2" />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>

            {providersWithPromo.length === 0 && (
              <div className="text-center py-16">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-accent border border-border rounded-full mb-4">
                  <Icon name="Tag" size={32} className="text-muted-foreground" />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-2">Акции скоро появятся</h3>
                <p className="text-muted-foreground">Следите за обновлениями!</p>
              </div>
            )}
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Promo;