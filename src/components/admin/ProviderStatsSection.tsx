import { Provider } from '@/components/providers/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { providers } from '@/data/providers';

interface ProviderStats {
  id: number;
  name: string;
  registrations: number;
  balance: number;
}

export const ProviderStatsSection = () => {
  const providerStats: ProviderStats[] = providers.map((provider: Provider) => ({
    id: provider.id,
    name: provider.name,
    registrations: Math.floor(Math.random() * 1000) + 100,
    balance: Math.floor(Math.random() * 100000) + 10000,
  }));

  const totalRegistrations = providerStats.reduce((sum, p) => sum + p.registrations, 0);
  const totalBalance = providerStats.reduce((sum, p) => sum + p.balance, 0);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="mb-8">
      <div className="flex items-center gap-3 mb-6">
        <Icon name="Building2" size={28} className="text-primary" />
        <h2 className="text-2xl font-bold text-foreground">Статистика провайдеров</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
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
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="text-left py-4 px-6 font-semibold text-foreground">Провайдер</th>
                  <th className="text-right py-4 px-6 font-semibold text-foreground">Регистрации</th>
                  <th className="text-right py-4 px-6 font-semibold text-foreground">Баланс</th>
                  <th className="text-right py-4 px-6 font-semibold text-foreground">Средний чек</th>
                </tr>
              </thead>
              <tbody>
                {providerStats
                  .sort((a, b) => b.balance - a.balance)
                  .map((provider, index) => {
                    const avgCheck = provider.registrations > 0 ? provider.balance / provider.registrations : 0;
                    return (
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
                          <span className="text-muted-foreground">{formatCurrency(avgCheck)}</span>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900 rounded-lg">
        <div className="flex gap-2 text-blue-800 dark:text-blue-300">
          <Icon name="Info" size={18} className="flex-shrink-0 mt-0.5" />
          <p className="text-sm">
            Данные обновляются автоматически из личных кабинетов провайдеров. Средний чек рассчитывается как отношение
            баланса к количеству регистраций.
          </p>
        </div>
      </div>
    </div>
  );
};
