import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { providers } from '@/data/providers';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { useState, useEffect } from 'react';

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
  const [selectedMonth, setSelectedMonth] = useState<string>('all');
  const [selectedPeriod, setSelectedPeriod] = useState<'1' | '7' | '30' | 'custom'>('custom');
  const [filteredStats, setFilteredStats] = useState<ClickStats[]>(clickStats);
  const [isLoadingMonth, setIsLoadingMonth] = useState(false);
  const [yesterdayStats, setYesterdayStats] = useState<ClickStats[]>([]);
  const [dayBeforeStats, setDayBeforeStats] = useState<ClickStats[]>([]);
  const [isLoadingYesterday, setIsLoadingYesterday] = useState(true);

  const getAvailableMonths = () => {
    const months = [];
    const now = new Date();
    for (let i = 0; i < 12; i++) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      months.push({
        value: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`,
        label: date.toLocaleDateString('ru-RU', { month: 'long', year: 'numeric' })
      });
    }
    return months;
  };

  useEffect(() => {
    const fetchYesterdayStats = async () => {
      setIsLoadingYesterday(true);
      try {
        const now = new Date();
        const yesterday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split('T')[0];
        const dayBefore = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 2);
        const dayBeforeStr = dayBefore.toISOString().split('T')[0];

        const res = await fetch(
          `https://functions.poehali.dev/d0b8e2ce-45c2-4ab9-8d08-baf03c0268f4?view=daily&period=3`
        );
        if (res.ok) {
          const data = await res.json();
          const allDaily: DailyStats[] = data.daily_stats || [];
          const yMap = new Map<number, number>();
          const dbMap = new Map<number, number>();
          allDaily.forEach(s => {
            if (s.date === yesterdayStr) yMap.set(s.provider_id, (yMap.get(s.provider_id) || 0) + s.clicks);
            if (s.date === dayBeforeStr) dbMap.set(s.provider_id, (dbMap.get(s.provider_id) || 0) + s.clicks);
          });
          setYesterdayStats(Array.from(yMap.entries()).map(([provider_id, clicks]) => ({
            provider_id, clicks, first_click: null, last_click: null
          })));
          setDayBeforeStats(Array.from(dbMap.entries()).map(([provider_id, clicks]) => ({
            provider_id, clicks, first_click: null, last_click: null
          })));
        }
      } catch (error) {
        console.error('Error fetching yesterday stats:', error);
      } finally {
        setIsLoadingYesterday(false);
      }
    };
    fetchYesterdayStats();
  }, []);

  useEffect(() => {
    if (selectedMonth === 'all' && selectedPeriod === 'custom') {
      setFilteredStats(clickStats);
    }
  }, [clickStats, selectedMonth, selectedPeriod]);

  const handlePeriodChange = async (period: '1' | '7' | '30' | 'custom') => {
    setSelectedPeriod(period);
    
    if (period === 'custom') {
      return;
    }

    setSelectedMonth('all');
    setIsLoadingMonth(true);
    
    try {
      const response = await fetch(
        `https://functions.poehali.dev/d0b8e2ce-45c2-4ab9-8d08-baf03c0268f4?period=${period}`
      );
      
      if (response.ok) {
        const data = await response.json();
        setFilteredStats(data.stats || []);
      }
      
      onPeriodChange(period);
    } catch (error) {
      console.error('Error fetching period stats:', error);
    } finally {
      setIsLoadingMonth(false);
    }
  };

  const handleMonthChange = async (month: string) => {
    setSelectedMonth(month);
    setSelectedPeriod('custom');
    
    if (month === 'all') {
      setFilteredStats(clickStats);
      onPeriodChange('30');
      return;
    }

    setIsLoadingMonth(true);
    try {
      const response = await fetch(
        `https://functions.poehali.dev/d0b8e2ce-45c2-4ab9-8d08-baf03c0268f4?month=${month}`
      );
      if (response.ok) {
        const data = await response.json();
        setFilteredStats(data.stats || []);
      }
      
      const monthDate = new Date(month + '-01');
      const daysInMonth = new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0).getDate();
      onPeriodChange(String(daysInMonth) as '1' | '7' | '30');
    } catch (error) {
      console.error('Error fetching month stats:', error);
    } finally {
      setIsLoadingMonth(false);
    }
  };

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

  const displayStats = isLoadingMonth ? filteredStats : (selectedMonth === 'all' && selectedPeriod === 'custom' ? clickStats : filteredStats);
  const totalClicks = displayStats.reduce((sum, s) => sum + s.clicks, 0);
  const topProvider = displayStats.length > 0 ? displayStats.reduce((prev, current) => 
    (prev.clicks > current.clicks) ? prev : current
  ) : null;

  const avgClicksPerProvider = displayStats.length > 0 ? Math.round(totalClicks / displayStats.length) : 0;

  const getDailyGrowth = () => {
    if (dailyStats.length < 2) return 0;
    
    const dateMap = new Map<string, number>();
    dailyStats.forEach(stat => {
      const currentClicks = dateMap.get(stat.date) || 0;
      dateMap.set(stat.date, currentClicks + stat.clicks);
    });
    
    const sortedDates = Array.from(dateMap.entries()).sort((a, b) => 
      new Date(a[0]).getTime() - new Date(b[0]).getTime()
    );
    
    if (sortedDates.length < 2) return 0;
    
    const lastDayClicks = sortedDates[sortedDates.length - 1][1];
    const prevDayClicks = sortedDates[sortedDates.length - 2][1];
    
    if (prevDayClicks === 0) return 0;
    return Math.round(((lastDayClicks - prevDayClicks) / prevDayClicks) * 100);
  };

  return (
    <div className="mb-8">
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b-2 border-primary/20 -mx-4 px-4 py-4 mb-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <div className="bg-primary/10 p-3 rounded-xl">
              <Icon name="BarChart3" size={28} className="text-primary" />
            </div>
            Аналитика переходов
          </h2>
          <div className="flex gap-3 items-center">
            <div className="flex gap-2">
              <Button
                variant={selectedPeriod === '1' ? 'default' : 'outline'}
                size="sm"
                onClick={() => handlePeriodChange('1')}
                disabled={isLoadingMonth}
                className="font-semibold"
              >
                День
              </Button>
              <Button
                variant={selectedPeriod === '7' ? 'default' : 'outline'}
                size="sm"
                onClick={() => handlePeriodChange('7')}
                disabled={isLoadingMonth}
                className="font-semibold"
              >
                Неделя
              </Button>
              <Button
                variant={selectedPeriod === '30' ? 'default' : 'outline'}
                size="sm"
                onClick={() => handlePeriodChange('30')}
                disabled={isLoadingMonth}
                className="font-semibold"
              >
                Месяц
              </Button>
            </div>
            <div className="w-px h-8 bg-border" />
            <div className="flex items-center gap-2 px-4 py-2 bg-card border-2 border-primary/20 rounded-lg">
              <Icon name="Calendar" size={18} className="text-primary" />
              <select
                value={selectedMonth}
                onChange={(e) => handleMonthChange(e.target.value)}
                className="px-2 py-1 text-sm bg-transparent text-foreground focus:outline-none font-medium cursor-pointer"
                disabled={isLoadingMonth}
              >
                <option value="all">Все время</option>
                {getAvailableMonths().map((month) => (
                  <option key={month.value} value={month.value}>
                    {month.label}
                  </option>
                ))}
              </select>
            </div>
            {isLoadingMonth && (
              <Icon name="Loader2" size={20} className="animate-spin text-primary" />
            )}
          </div>
        </div>
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

          <Card className="border-2 border-yellow-500/20 bg-gradient-to-br from-yellow-500/5 to-transparent mb-6">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-yellow-500/20 p-2 rounded-lg">
                  <Icon name="CalendarMinus" size={22} className="text-yellow-500" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-foreground">Вчерашний день</h3>
                  <p className="text-xs text-muted-foreground">
                    {new Date(Date.now() - 86400000).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </p>
                </div>
                {(() => {
                  const yesterdayTotal = yesterdayStats.reduce((sum, s) => sum + s.clicks, 0);
                  const dayBeforeTotal = dayBeforeStats.reduce((sum, s) => sum + s.clicks, 0);
                  const diff = dayBeforeTotal > 0 ? Math.round(((yesterdayTotal - dayBeforeTotal) / dayBeforeTotal) * 100) : 0;
                  return diff !== 0 ? (
                    <Badge className={`ml-auto ${diff > 0 ? 'bg-green-500/20 text-green-500 border-green-500/30' : 'bg-red-500/20 text-red-500 border-red-500/30'}`}>
                      <Icon name={diff > 0 ? 'ArrowUp' : 'ArrowDown'} size={14} className="mr-1" />
                      {diff > 0 ? '+' : ''}{diff}% к позавчера
                    </Badge>
                  ) : null;
                })()}
              </div>

              {isLoadingYesterday ? (
                <div className="flex items-center justify-center py-8">
                  <Icon name="Loader2" size={24} className="animate-spin text-yellow-500" />
                </div>
              ) : yesterdayStats.length === 0 ? (
                <div className="text-center py-6 text-muted-foreground">
                  <Icon name="CalendarX" size={32} className="mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Нет данных за вчера</p>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                    <div className="bg-card/50 border border-yellow-500/10 rounded-lg p-3 text-center">
                      <div className="text-2xl font-black text-yellow-500">
                        {yesterdayStats.reduce((sum, s) => sum + s.clicks, 0)}
                      </div>
                      <div className="text-xs text-muted-foreground">Всего переходов</div>
                    </div>
                    <div className="bg-card/50 border border-yellow-500/10 rounded-lg p-3 text-center">
                      <div className="text-2xl font-black text-foreground">
                        {yesterdayStats.length}
                      </div>
                      <div className="text-xs text-muted-foreground">Провайдеров</div>
                    </div>
                    <div className="bg-card/50 border border-yellow-500/10 rounded-lg p-3 text-center">
                      <div className="text-lg font-bold text-foreground truncate">
                        {yesterdayStats.length > 0 ? getProviderName(
                          yesterdayStats.reduce((prev, cur) => cur.clicks > prev.clicks ? cur : prev).provider_id
                        ) : '—'}
                      </div>
                      <div className="text-xs text-muted-foreground">Лидер дня</div>
                    </div>
                    <div className="bg-card/50 border border-yellow-500/10 rounded-lg p-3 text-center">
                      <div className="text-2xl font-black text-foreground">
                        {yesterdayStats.length > 0 ? Math.round(yesterdayStats.reduce((sum, s) => sum + s.clicks, 0) / yesterdayStats.length) : 0}
                      </div>
                      <div className="text-xs text-muted-foreground">Среднее на провайдера</div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {yesterdayStats
                      .sort((a, b) => b.clicks - a.clicks)
                      .map((stat, idx) => {
                        const maxClicks = Math.max(...yesterdayStats.map(s => s.clicks));
                        const percentage = maxClicks > 0 ? (stat.clicks / maxClicks) * 100 : 0;
                        const dayBeforeStat = dayBeforeStats.find(s => s.provider_id === stat.provider_id);
                        const diff = dayBeforeStat ? stat.clicks - dayBeforeStat.clicks : 0;
                        return (
                          <div key={stat.provider_id} className="flex items-center gap-3">
                            <span className="text-xs text-muted-foreground w-5 text-right">{idx + 1}</span>
                            <span className="text-sm font-medium w-36 truncate">{getProviderName(stat.provider_id)}</span>
                            <div className="flex-1 h-6 bg-muted/30 rounded-full overflow-hidden relative">
                              <div
                                className="h-full bg-gradient-to-r from-yellow-500 to-yellow-400 rounded-full transition-all duration-500"
                                style={{ width: `${percentage}%` }}
                              />
                              <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-foreground">
                                {stat.clicks}
                              </span>
                            </div>
                            {diff !== 0 && (
                              <span className={`text-xs font-medium w-14 text-right ${diff > 0 ? 'text-green-500' : 'text-red-500'}`}>
                                {diff > 0 ? '+' : ''}{diff}
                              </span>
                            )}
                          </div>
                        );
                      })}
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          <Card className="border-2 border-primary/20 mb-6 bg-gradient-to-br from-primary/5 via-background to-background">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-foreground flex items-center gap-3 mb-2">
                    <div className="bg-gradient-to-br from-primary to-primary/60 p-2 rounded-lg">
                      <Icon name="BarChart3" size={22} className="text-primary-foreground" />
                    </div>
                    Распределение переходов
                  </h3>
                  <p className="text-sm text-muted-foreground ml-11">
                    Статистика по {displayStats.length} провайдер{displayStats.length === 1 ? 'у' : displayStats.length < 5 ? 'ам' : 'ам'}
                  </p>
                </div>
                <div className="flex gap-2 bg-card/50 p-1 rounded-lg border-2 border-primary/20">
                  <Button
                    variant={chartView === 'bar' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setChartView('bar')}
                    className="gap-2"
                  >
                    <Icon name="BarChart3" size={16} />
                    <span className="hidden sm:inline">График</span>
                  </Button>
                  <Button
                    variant={chartView === 'pie' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setChartView('pie')}
                    className="gap-2"
                  >
                    <Icon name="PieChart" size={16} />
                    <span className="hidden sm:inline">Круговая</span>
                  </Button>
                </div>
              </div>

              {(isLoadingMonth || isLoadingStats) ? (
                <div className="flex items-center justify-center py-16">
                  <Icon name="Loader2" size={32} className="animate-spin text-primary" />
                </div>
              ) : (
                <>
                  {chartView === 'bar' && (
                    <div className="bg-card/30 rounded-xl p-6 border border-primary/10">
                      <ResponsiveContainer width="100%" height={450}>
                        <BarChart
                          data={displayStats.map((stat, idx) => ({
                            name: getProviderName(stat.provider_id),
                            clicks: stat.clicks,
                            percentage: totalClicks > 0 ? Math.round((stat.clicks / totalClicks) * 100) : 0,
                            fill: COLORS[idx % COLORS.length]
                          }))}
                          margin={{ top: 20, right: 30, left: 20, bottom: 80 }}
                        >
                      <defs>
                        {COLORS.map((color, idx) => (
                          <linearGradient key={idx} id={`barGradient${idx}`} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor={color} stopOpacity={0.9} />
                            <stop offset="100%" stopColor={color} stopOpacity={0.6} />
                          </linearGradient>
                        ))}
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.2} stroke="hsl(var(--border))" />
                      <XAxis 
                        dataKey="name" 
                        angle={-45}
                        textAnchor="end"
                        height={120}
                        style={{ fontSize: '14px', fontWeight: '600', fill: 'hsl(var(--foreground))' }}
                        interval={0}
                        tick={{ fill: 'hsl(var(--foreground))' }}
                      />
                      <YAxis 
                        style={{ fontSize: '13px', fontWeight: '500', fill: 'hsl(var(--foreground))' }} 
                        allowDecimals={false}
                        tick={{ fill: 'hsl(var(--foreground))' }}
                      />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--card))',
                          border: '2px solid hsl(var(--primary))',
                          borderRadius: '12px',
                          padding: '12px',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                        }}
                        cursor={{ fill: 'hsl(var(--primary) / 0.1)' }}
                        formatter={(value: number, name: string, props: any) => [
                          `${value} переходов (${props.payload.percentage}%)`,
                          'Клики'
                        ]}
                      />
                      <Bar 
                        dataKey="clicks" 
                        radius={[8, 8, 0, 0]}
                        animationDuration={800}
                        maxBarSize={60}
                      >
                        {displayStats.map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={`url(#barGradient${index % COLORS.length})`}
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}

                  {chartView === 'pie' && (
                    <div className="flex items-center justify-center gap-8">
                      <ResponsiveContainer width="50%" height={400}>
                        <PieChart>
                          <Pie
                            data={displayStats.map(stat => ({
                              name: getProviderName(stat.provider_id),
                              value: stat.clicks
                            }))}
                            cx="50%"
                            cy="50%"
                            labelLine={true}
                            label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                            outerRadius={140}
                            innerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                            animationDuration={800}
                            paddingAngle={2}
                          >
                            {displayStats.map((entry, index) => (
                              <Cell 
                                key={`cell-${index}`} 
                                fill={COLORS[index % COLORS.length]}
                                strokeWidth={2}
                                stroke="hsl(var(--background))"
                              />
                            ))}
                          </Pie>
                          <Tooltip 
                            contentStyle={{ 
                              backgroundColor: 'hsl(var(--card))',
                              border: '2px solid hsl(var(--primary))',
                              borderRadius: '12px',
                              padding: '12px'
                            }}
                            formatter={(value: number) => [`${value} переходов`, 'Клики']}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                      
                      <div className="flex-1 max-h-[400px] overflow-y-auto pr-4">
                        <div className="space-y-3">
                          {displayStats.map((stat, index) => {
                            const percentage = totalClicks > 0 ? ((stat.clicks / totalClicks) * 100).toFixed(1) : '0';
                            return (
                              <div 
                                key={stat.provider_id}
                                className="flex items-center gap-3 p-3 rounded-lg bg-card/50 hover:bg-card transition-colors border border-border/50"
                              >
                                <div 
                                  className="w-4 h-4 rounded-full flex-shrink-0" 
                                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                                />
                                <div className="flex-1 min-w-0">
                                  <div className="font-semibold text-foreground truncate">
                                    {getProviderName(stat.provider_id)}
                                  </div>
                                  <div className="flex items-center gap-2 mt-1">
                                    <div className="flex-1 bg-secondary h-2 rounded-full overflow-hidden">
                                      <div 
                                        className="h-full rounded-full transition-all duration-500"
                                        style={{ 
                                          width: `${percentage}%`,
                                          backgroundColor: COLORS[index % COLORS.length]
                                        }}
                                      />
                                    </div>
                                  </div>
                                </div>
                                <div className="text-right flex-shrink-0">
                                  <div className="font-bold text-lg text-foreground">{stat.clicks}</div>
                                  <div className="text-xs text-muted-foreground">{percentage}%</div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>

          <Card className="border-2 border-primary/20 bg-gradient-to-br from-purple-500/5 via-background to-background">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-foreground flex items-center gap-3 mb-2">
                    <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-2 rounded-lg">
                      <Icon name="TrendingUp" size={22} className="text-white" />
                    </div>
                    Динамика по времени
                  </h3>
                  <p className="text-sm text-muted-foreground ml-11">
                    Топ-5 провайдеров по активности
                  </p>
                </div>
                <div className="flex gap-2 bg-card/50 p-1 rounded-lg border-2 border-purple-500/20">
                  <Button
                    variant={period === '1' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => onPeriodChange('1')}
                  >
                    День
                  </Button>
                  <Button
                    variant={period === '7' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => onPeriodChange('7')}
                  >
                    Неделя
                  </Button>
                  <Button
                    variant={period === '30' ? 'default' : 'ghost'}
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
                <div className="bg-card/30 rounded-xl p-6 border border-purple-500/10">
                  <ResponsiveContainer width="100%" height={450}>
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
                      <defs>
                        <linearGradient id="totalGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.2} stroke="hsl(var(--border))" />
                      <XAxis 
                        dataKey="date" 
                        style={{ fontSize: '13px', fontWeight: '500', fill: 'hsl(var(--foreground))' }}
                        tick={{ fill: 'hsl(var(--foreground))' }}
                      />
                      <YAxis 
                        style={{ fontSize: '13px', fontWeight: '500', fill: 'hsl(var(--foreground))' }} 
                        allowDecimals={false}
                        tick={{ fill: 'hsl(var(--foreground))' }}
                      />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--card))',
                          border: '2px solid hsl(var(--primary))',
                          borderRadius: '12px',
                          padding: '12px',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                        }}
                      />
                      <Legend 
                        wrapperStyle={{ 
                          paddingTop: '20px',
                          fontSize: '14px',
                          fontWeight: '600'
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="total"
                        stroke="hsl(var(--primary))"
                        strokeWidth={4}
                        dot={{ r: 6, fill: 'hsl(var(--primary))', strokeWidth: 2, stroke: '#fff' }}
                        activeDot={{ r: 8, strokeWidth: 2 }}
                        name="Всего"
                        fill="url(#totalGradient)"
                    />
                    {(() => {
                      const top5Providers = [...displayStats]
                        .sort((a, b) => b.clicks - a.clicks)
                        .slice(0, 5)
                        .map(stat => getProviderName(stat.provider_id));
                      
                      return top5Providers.map((providerName, idx) => (
                        <Line
                          key={providerName}
                          type="monotone"
                          dataKey={providerName}
                          stroke={COLORS[idx]}
                          strokeWidth={3}
                          dot={{ r: 5, fill: COLORS[idx], strokeWidth: 2, stroke: '#fff' }}
                          activeDot={{ r: 7, strokeWidth: 2 }}
                          name={providerName}
                        />
                      ));
                    })()}
                  </LineChart>
                </ResponsiveContainer>
              </div>
              )}
            </CardContent>
          </Card>

          <Card className="border-2 border-primary/20 mt-6">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
                  <Icon name="Table" size={20} className="text-primary" />
                  Детальная статистика
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-border">
                      <th className="text-left py-3 px-4 font-bold text-foreground">#</th>
                      <th className="text-left py-3 px-4 font-bold text-foreground">Провайдер</th>
                      <th className="text-center py-3 px-4 font-bold text-foreground">Переходы</th>
                      <th className="text-center py-3 px-4 font-bold text-foreground">Доля</th>
                      <th className="text-left py-3 px-4 font-bold text-foreground">Последний переход</th>
                    </tr>
                  </thead>
                  <tbody>
                    {displayStats.map((stat, index) => {
                      const percentage = totalClicks > 0 ? ((stat.clicks / totalClicks) * 100).toFixed(1) : '0';
                      
                      return (
                        <tr 
                          key={stat.provider_id} 
                          className="border-b border-border hover:bg-primary/5 transition-colors"
                        >
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-2">
                              <span className="text-muted-foreground font-semibold">{index + 1}</span>
                              <div 
                                className="w-3 h-3 rounded-full" 
                                style={{ backgroundColor: COLORS[index % COLORS.length] }}
                              />
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <span className="font-bold text-foreground text-base">
                              {getProviderName(stat.provider_id)}
                            </span>
                          </td>
                          <td className="py-4 px-4 text-center">
                            <div className="flex flex-col items-center gap-1">
                              <span className="text-2xl font-black text-primary">{stat.clicks}</span>
                              <span className="text-xs text-muted-foreground">
                                {stat.clicks === 1 ? 'переход' : stat.clicks < 5 ? 'перехода' : 'переходов'}
                              </span>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex flex-col items-center gap-2">
                              <Badge className="bg-primary/10 text-primary border-primary/30">
                                {percentage}%
                              </Badge>
                              <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
                                <div 
                                  className="h-full bg-primary rounded-full transition-all duration-500"
                                  style={{ width: `${percentage}%` }}
                                />
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            {stat.last_click ? (
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Icon name="Clock" size={14} />
                                <span>
                                  {new Date(stat.last_click).toLocaleString('ru-RU', {
                                    day: '2-digit',
                                    month: '2-digit',
                                    year: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  })}
                                </span>
                              </div>
                            ) : (
                              <span className="text-muted-foreground text-sm">—</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};