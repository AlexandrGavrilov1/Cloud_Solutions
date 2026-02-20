import { useState, useEffect } from 'react';
import { Provider } from '@/components/providers/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { providers } from '@/data/providers';

interface ProviderStats {
  id: number;
  name: string;
  registrations: number;
  balance: number;
  registrationsToday: number;
  balanceToday: number;
}

interface OneDashData {
  balance: number | null;
  currency: string | null;
  ordersCount: number | null;
  activeVps: number | null;
  isLoading: boolean;
  error: string | null;
}

const ONEDASH_PROVIDER_ID = 53;
const ONEDASH_PROXY_URL = 'https://functions.poehali.dev/5bdf179c-9b43-46eb-a042-c52b651f946c';

export const ProviderStatsSection = () => {
  const [providerStats, setProviderStats] = useState<ProviderStats[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [oneDash, setOneDash] = useState<OneDashData>({ balance: null, currency: null, ordersCount: null, activeVps: null, isLoading: true, error: null });

  useEffect(() => {
    const fetchOneDash = async () => {
      setOneDash(prev => ({ ...prev, isLoading: true, error: null }));
      try {
        const [balanceRes, ordersRes] = await Promise.all([
          fetch(`${ONEDASH_PROXY_URL}?endpoint=balance`),
          fetch(`${ONEDASH_PROXY_URL}?endpoint=all-orders`),
        ]);

        let balance: number | null = null;
        let currency: string | null = null;
        let ordersCount: number | null = null;
        let activeVps: number | null = null;

        if (balanceRes.ok) {
          const bData = await balanceRes.json();
          if (bData.data?.type === true && bData.data?.data) {
            balance = bData.data.data.balance ?? 0;
            currency = bData.data.data.currency ?? 'RUB';
          }
        }

        if (ordersRes.ok) {
          const oData = await ordersRes.json();
          if (oData.data?.type === true && Array.isArray(oData.data?.data)) {
            const orders = oData.data.data;
            ordersCount = orders.length;
            activeVps = orders.reduce((sum: number, order: Record<string, unknown>) => {
              const vpsList = order.vps_list as Array<Record<string, unknown>> | undefined;
              return sum + (vpsList?.filter((v) => v.vps_status === 'runned').length || 0);
            }, 0);
          }
        }

        setOneDash({ balance, currency, ordersCount, activeVps, isLoading: false, error: null });
      } catch (error) {
        console.error('Error fetching OneDash data:', error);
        setOneDash({ balance: null, currency: null, ordersCount: null, activeVps: null, isLoading: false, error: 'Failed to fetch' });
      }
    };

    fetchOneDash();
  }, []);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('https://functions.poehali.dev/15bd2bf9-a831-4ef9-9ce3-fd6c7823ddc8?type=stats');
        if (response.ok) {
          const data = await response.json();
          const statsMap = new Map(data.stats?.map((s: Record<string, unknown>) => [s.provider_id, s]) || []);
          
          const stats = providers.map((provider: Provider) => {
            const apiStats = statsMap.get(provider.id) as Record<string, unknown> | undefined;
            return {
              id: provider.id,
              name: provider.name,
              registrations: (apiStats?.registrations as number) || 0,
              balance: (apiStats?.balance as number) || 0,
              registrationsToday: (apiStats?.registrations_today as number) || 0,
              balanceToday: (apiStats?.balance_today as number) || 0,
            };
          });
          
          setProviderStats(stats);
        } else {
          setProviderStats(providers.map((provider: Provider) => ({
            id: provider.id,
            name: provider.name,
            registrations: 0,
            balance: 0,
            registrationsToday: 0,
            balanceToday: 0,
          })));
        }
      } catch (error) {
        console.error('Error fetching provider stats:', error);
        setProviderStats(providers.map((provider: Provider) => ({
          id: provider.id,
          name: provider.name,
          registrations: 0,
          balance: 0,
          registrationsToday: 0,
          balanceToday: 0,
        })));
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  const totalRegistrations = providerStats.reduce((sum, p) => sum + p.registrations, 0);
  const totalBalance = providerStats.reduce((sum, p) => sum + p.balance, 0);
  const totalRegistrationsToday = providerStats.reduce((sum, p) => sum + p.registrationsToday, 0);
  const totalBalanceToday = providerStats.reduce((sum, p) => sum + p.balanceToday, 0);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="text-muted-foreground">Загрузка статистики...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-8">
      <div className="flex items-center gap-3 mb-6">
        <Icon name="Building2" size={28} className="text-primary" />
        <h2 className="text-2xl font-bold text-foreground">Статистика провайдеров</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-medium flex items-center gap-2">
              <Icon name="Users" size={20} className="text-primary" />
              Всего регистраций
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-foreground">{totalRegistrations.toLocaleString('ru-RU')}</p>
          </CardContent>
        </Card>

        <Card className="border-green-500/20 bg-gradient-to-br from-green-500/5 to-transparent">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-medium flex items-center gap-2">
              <Icon name="Wallet" size={20} className="text-green-600" />
              Общий баланс
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-foreground">{formatCurrency(totalBalance)}</p>
          </CardContent>
        </Card>

        <Card className="border-orange-500/20 bg-gradient-to-br from-orange-500/5 to-transparent">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-medium flex items-center gap-2">
              <Icon name="UserPlus" size={20} className="text-orange-500" />
              Регистрации сегодня
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-foreground">{totalRegistrationsToday.toLocaleString('ru-RU')}</p>
          </CardContent>
        </Card>

        <Card className="border-purple-500/20 bg-gradient-to-br from-purple-500/5 to-transparent">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-medium flex items-center gap-2">
              <Icon name="CreditCard" size={20} className="text-purple-500" />
              Оплаты сегодня
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-foreground">{formatCurrency(totalBalanceToday)}</p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-2 border-blue-500/20 bg-gradient-to-br from-blue-500/5 to-transparent mb-6">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-medium flex items-center gap-2">
            <Icon name="Zap" size={20} className="text-blue-500" />
            One Dash (API)
            {oneDash.isLoading && <Icon name="Loader2" size={16} className="animate-spin text-muted-foreground" />}
            {oneDash.error && <span className="text-xs text-destructive font-normal ml-2">Ошибка загрузки</span>}
            {!oneDash.isLoading && !oneDash.error && oneDash.balance !== null && (
              <span className="text-xs bg-green-500/10 text-green-600 px-1.5 py-0.5 rounded font-medium">Online</span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-6">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Баланс</p>
              <p className="text-2xl font-bold text-foreground">
                {oneDash.isLoading ? '...' : oneDash.balance !== null ? formatCurrency(oneDash.balance) : '—'}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Заказов</p>
              <p className="text-2xl font-bold text-foreground">
                {oneDash.isLoading ? '...' : oneDash.ordersCount !== null ? oneDash.ordersCount : '—'}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Активных VPS</p>
              <p className="text-2xl font-bold text-foreground">
                {oneDash.isLoading ? '...' : oneDash.activeVps !== null ? oneDash.activeVps : '—'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="text-left py-4 px-6 font-semibold text-foreground">Провайдер</th>
                  <th className="text-right py-4 px-6 font-semibold text-foreground">Регистрации</th>
                  <th className="text-right py-4 px-6 font-semibold text-foreground">Баланс</th>
                  <th className="text-right py-4 px-6 font-semibold text-foreground">Рег. сегодня</th>
                  <th className="text-right py-4 px-6 font-semibold text-foreground">Оплаты сегодня</th>
                </tr>
              </thead>
              <tbody>
                {providerStats
                  .sort((a, b) => b.balance - a.balance)
                  .map((provider, index) => (
                    <tr
                      key={provider.id}
                      className={`border-b border-border hover:bg-muted/30 transition-colors ${
                        index === 0 ? 'bg-primary/5' : ''
                      }`}
                    >
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          {index === 0 && <Icon name="Crown" size={16} className="text-yellow-500" />}
                          <span className="font-medium text-foreground">{provider.name}</span>
                          {provider.id === ONEDASH_PROVIDER_ID && !oneDash.isLoading && oneDash.balance !== null && (
                            <span className="text-xs bg-blue-500/10 text-blue-500 px-1.5 py-0.5 rounded font-medium" title={`Баланс: ${formatCurrency(oneDash.balance)}, Заказов: ${oneDash.ordersCount}, VPS: ${oneDash.activeVps}`}>API</span>
                          )}
                        </div>
                      </td>
                      <td className="text-right py-4 px-6">
                        <span className="inline-flex items-center gap-1 text-muted-foreground">
                          <Icon name="Users" size={14} />
                          {provider.registrations.toLocaleString('ru-RU')}
                        </span>
                      </td>
                      <td className="text-right py-4 px-6">
                        <span className="font-semibold text-foreground">{formatCurrency(provider.balance)}</span>
                      </td>
                      <td className="text-right py-4 px-6">
                        {provider.registrationsToday > 0 ? (
                          <span className="inline-flex items-center gap-1 text-orange-500 font-semibold">
                            <Icon name="UserPlus" size={14} />
                            {provider.registrationsToday.toLocaleString('ru-RU')}
                          </span>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </td>
                      <td className="text-right py-4 px-6">
                        {provider.balanceToday > 0 ? (
                          <span className="font-semibold text-purple-500">{formatCurrency(provider.balanceToday)}</span>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900 rounded-lg">
        <div className="flex gap-2 text-blue-800 dark:text-blue-300">
          <Icon name="Info" size={18} className="flex-shrink-0 mt-0.5" />
          <p className="text-sm">
            Данные обновляются автоматически из личных кабинетов провайдеров. Статистика за сегодня показывает регистрации и оплаты текущего дня.
          </p>
        </div>
      </div>
    </div>
  );
};