import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { providers } from '@/data/providers';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { useState } from 'react';

interface ClickStats {
  provider_id: number;
  clicks: number;
  first_click: string | null;
  last_click: string | null;
}

interface DailyStats {
  provider_id: number;
  date: string;
  clicks: number;
}

interface ClickStatsSectionProps {
  clickStats: ClickStats[];
  isLoadingStats: boolean;
  dailyStats: DailyStats[];
  isLoadingDaily: boolean;
  period: '1' | '7' | '30';
  onPeriodChange: (period: '1' | '7' | '30') => void;
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316', '#06b6d4'];

export const ClickStatsSection = ({
  clickStats,
  isLoadingStats,
  dailyStats,
  isLoadingDaily,
  period,
  onPeriodChange
}: ClickStatsSectionProps) => {
  const [chartView, setChartView] = useState<'bar' | 'pie' | 'line'>('bar');

  const getProviderName = (providerId: number) => {
    const nameMapping: { [key: number]: string } = {
      1029: 'HostKey',
      1030: 'Hetzner', 
      1031: 'Aeza',
      4: 'Timeweb Cloud',
      32: 'T1 Cloud',
      33: 'MWS',
      35: 'IT-GRAD',
      36: 'Ростелеком-ЦОД',
      39: 'Софтлайн',
      41: 'Cloud Beeline'
    };
    
    if (nameMapping[providerId]) {
      return nameMapping[providerId];
    }
    
    const provider = providers.find(p => p.id === providerId);
    return provider?.name || `Provider #${providerId}`;
  };

  const totalClicks = clickStats.reduce((sum, s) => sum + s.clicks, 0);
  const topProvider = clickStats.length > 0 ? clickStats.reduce((prev, current) => 
    (prev.clicks > current.clicks) ? prev : current
  ) : null;

  const avgClicksPerProvider = clickStats.length > 0 ? Math.round(totalClicks / clickStats.length) : 0;

  const getDailyGrowth = () => {
    if (dailyStats.length < 2) return 0;
    
    const sortedStats = [...dailyStats].sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    
    const lastDayClicks = sortedStats[sortedStats.length - 1]?.clicks || 0;
    const prevDayClicks = sortedStats[sortedStats.length - 2]?.clicks || 0;
    
    if (prevDayClicks === 0) return 0;
    return Math.round(((lastDayClicks - prevDayClicks) / prevDayClicks) * 100);
  };

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold text-foreground flex items-center gap-3">
          <div className="bg-primary/10 p-3 rounded-xl">
            <Icon name="BarChart3" size={28} className="text-primary" />
          </div>
          Аналитика переходов
        </h2>
      </div>

      {isLoadingStats ? (
        <div className="flex items-center justify-center py-16">
          <Icon name="Loader2" size={48} className="animate-spin text-primary" />
        </div>
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
            <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-3">
                  <div className="bg-primary/20 p-2 rounded-lg">
                    <Icon name="MousePointerClick" size={20} className="text-primary" />
                  </div>
                  <Icon name="TrendingUp" size={18} className="text-green-500" />
                </div>
                <div className="text-sm text-muted-foreground mb-1">Всего переходов</div>
                <div className="text-3xl font-black text-primary">{totalClicks}</div>
              </CardContent>
            </Card>

            <Card className="border-2 border-green-500/20 bg-gradient-to-br from-green-500/5 to-green-500/10">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-3">
                  <div className="bg-green-500/20 p-2 rounded-lg">
                    <Icon name="Trophy" size={20} className="text-green-500" />
                  </div>
                  <Badge className="bg-green-500/20 text-green-500 border-green-500/30">
                    Топ
                  </Badge>
                </div>
                <div className="text-sm text-muted-foreground mb-1">Лидер</div>
                <div className="text-xl font-bold text-foreground">
                  {topProvider ? getProviderName(topProvider.provider_id) : 'N/A'}
                </div>
                <div className="text-sm text-green-500 mt-1">
                  {topProvider ? `${topProvider.clicks} переходов` : ''}
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-orange-500/20 bg-gradient-to-br from-orange-500/5 to-orange-500/10">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-3">
                  <div className="bg-orange-500/20 p-2 rounded-lg">
                    <Icon name="Activity" size={20} className="text-orange-500" />
                  </div>
                </div>
                <div className="text-sm text-muted-foreground mb-1">Средний CTR</div>
                <div className="text-3xl font-black text-orange-500">{avgClicksPerProvider}</div>
                <div className="text-xs text-muted-foreground mt-1">на провайдера</div>
              </CardContent>
            </Card>

            <Card className="border-2 border-purple-500/20 bg-gradient-to-br from-purple-500/5 to-purple-500/10">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-3">
                  <div className="bg-purple-500/20 p-2 rounded-lg">
                    <Icon name="TrendingUp" size={20} className="text-purple-500" />
                  </div>
                  {getDailyGrowth() > 0 && (
                    <Icon name="ArrowUp" size={18} className="text-green-500" />
                  )}
                  {getDailyGrowth() < 0 && (
                    <Icon name="ArrowDown" size={18} className="text-red-500" />
                  )}
                </div>
                <div className="text-sm text-muted-foreground mb-1">Рост</div>
                <div className={`text-3xl font-black ${getDailyGrowth() >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {getDailyGrowth() > 0 ? '+' : ''}{getDailyGrowth()}%
                </div>
                <div className="text-xs text-muted-foreground mt-1">за последние сутки</div>
              </CardContent>
            </Card>
          </div>

          <Card className="border-2 border-primary/20 mb-6">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
                  <Icon name="BarChart3" size={20} className="text-primary" />
                  Распределение переходов
                </h3>
                <div className="flex gap-2">
                  <Button
                    variant={chartView === 'bar' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setChartView('bar')}
                  >
                    <Icon name="BarChart3" size={16} />
                  </Button>
                  <Button
                    variant={chartView === 'pie' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setChartView('pie')}
                  >
                    <Icon name="PieChart" size={16} />
                  </Button>
                </div>
              </div>

              {chartView === 'bar' && (
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart
                    data={clickStats.map(stat => ({
                      name: getProviderName(stat.provider_id),
                      clicks: stat.clicks,
                      percentage: totalClicks > 0 ? Math.round((stat.clicks / totalClicks) * 100) : 0
                    }))}
                    margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                    <XAxis 
                      dataKey="name" 
                      angle={-45}
                      textAnchor="end"
                      height={100}
                      style={{ fontSize: '12px' }}
                    />
                    <YAxis style={{ fontSize: '12px' }} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))',
                        border: '2px solid hsl(var(--primary))',
                        borderRadius: '12px',
                        padding: '12px'
                      }}
                      formatter={(value: number, name: string, props: any) => [
                        `${value} переходов (${props.payload.percentage}%)`,
                        'Клики'
                      ]}
                    />
                    <Bar 
                      dataKey="clicks" 
                      fill="hsl(var(--primary))"
                      radius={[8, 8, 0, 0]}
                      animationDuration={800}
                    />
                  </BarChart>
                </ResponsiveContainer>
              )}

              {chartView === 'pie' && (
                <ResponsiveContainer width="100%" height={350}>
                  <PieChart>
                    <Pie
                      data={clickStats.map(stat => ({
                        name: getProviderName(stat.provider_id),
                        value: stat.clicks
                      }))}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      label={({name, percent}) => `${name}: ${(percent * 100).toFixed(1)}%`}
                      outerRadius={120}
                      fill="#8884d8"
                      dataKey="value"
                      animationDuration={800}
                    >
                      {clickStats.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))',
                        border: '2px solid hsl(var(--primary))',
                        borderRadius: '12px'
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>

          <Card className="border-2 border-primary/20">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
                  <Icon name="LineChart" size={20} className="text-primary" />
                  Динамика по времени
                </h3>
                <div className="flex gap-2">
                  <Button
                    variant={period === '1' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => onPeriodChange('1')}
                  >
                    День
                  </Button>
                  <Button
                    variant={period === '7' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => onPeriodChange('7')}
                  >
                    Неделя
                  </Button>
                  <Button
                    variant={period === '30' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => onPeriodChange('30')}
                  >
                    Месяц
                  </Button>
                </div>
              </div>

              {isLoadingDaily ? (
                <div className="flex items-center justify-center py-12">
                  <Icon name="Loader2" size={32} className="animate-spin text-primary" />
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart
                    data={(() => {
                      const dateMap = new Map<string, any>();
                      
                      dailyStats.forEach(stat => {
                        if (!dateMap.has(stat.date)) {
                          dateMap.set(stat.date, { date: stat.date, total: 0 });
                        }
                        const providerName = getProviderName(stat.provider_id);
                        const entry = dateMap.get(stat.date)!;
                        entry[providerName] = stat.clicks;
                        entry.total += stat.clicks;
                      });
                      
                      return Array.from(dateMap.values()).sort((a, b) => 
                        new Date(a.date).getTime() - new Date(b.date).getTime()
                      ).map(item => ({
                        ...item,
                        date: new Date(item.date).toLocaleDateString('ru-RU', { 
                          day: '2-digit', 
                          month: '2-digit' 
                        })
                      }));
                    })()}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                    <XAxis 
                      dataKey="date" 
                      style={{ fontSize: '12px' }}
                    />
                    <YAxis style={{ fontSize: '12px' }} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))',
                        border: '2px solid hsl(var(--primary))',
                        borderRadius: '12px',
                        padding: '12px'
                      }}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="total"
                      stroke="hsl(var(--primary))"
                      strokeWidth={3}
                      dot={{ r: 5, fill: 'hsl(var(--primary))' }}
                      activeDot={{ r: 7 }}
                      name="Всего"
                    />
                    {providers.slice(0, 4).map((provider, idx) => (
                      <Line
                        key={provider.id}
                        type="monotone"
                        dataKey={provider.name}
                        stroke={COLORS[idx]}
                        strokeWidth={2}
                        dot={{ r: 4 }}
                        activeDot={{ r: 6 }}
                      />
                    ))}
                  </LineChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mt-6">
            {clickStats.map((stat, index) => {
              const percentage = totalClicks > 0 ? ((stat.clicks / totalClicks) * 100).toFixed(1) : '0';
              
              return (
                <Card key={stat.provider_id} className="border-2 border-primary/10 hover:border-primary/30 transition-all hover:shadow-lg">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-bold text-foreground text-lg">
                        {getProviderName(stat.provider_id)}
                      </h3>
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: COLORS[index % COLORS.length] }}
                      />
                    </div>
                    
                    <div className="flex items-baseline gap-2 mb-2">
                      <span className="text-4xl font-black text-primary">{stat.clicks}</span>
                      <span className="text-sm text-muted-foreground">
                        {stat.clicks === 1 ? 'переход' : stat.clicks < 5 ? 'перехода' : 'переходов'}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex-1 bg-secondary h-2 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-primary rounded-full transition-all duration-500"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <Badge className="bg-primary/10 text-primary border-primary/30 text-xs">
                        {percentage}%
                      </Badge>
                    </div>

                    {stat.last_click && (
                      <div className="flex items-center gap-2 text-xs text-muted-foreground pt-2 border-t border-border">
                        <Icon name="Clock" size={12} />
                        <span>
                          {new Date(stat.last_click).toLocaleString('ru-RU', {
                            day: '2-digit',
                            month: '2-digit',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};
