import { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import {
  useSummary,
  useTimeline,
  useTopPages,
  useTopArticles,
  useSessions,
} from '@/hooks/useEventsStats';
import { PeriodSelector } from './components/PeriodSelector';
import { ComparePeriodSelector } from './components/ComparePeriodSelector';
import { MetricCard } from './components/MetricCard';
import { ExportButton } from './components/ExportButton';
import { SessionTable } from './components/SessionTable';
import { ChartFilters } from './components/ChartFilters';
import { ConfirmDialog } from './components/ConfirmDialog'; // для будущих удалений
import { SummaryData, TimelineItem, PageStat, ArticleStat, SessionInfo } from './types';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'];

export const EventsStatsSection = () => {
  const [period, setPeriod] = useState<'1' | '7' | '30'>('30');
  const [selectedEventTypes, setSelectedEventTypes] = useState<string[]>(['page_views', 'provider_clicks']);
  const [compareMode, setCompareMode] = useState<boolean>(false);
  const [comparePeriod, setComparePeriod] = useState<'1' | '7' | '30'>('30');

  // Хуки (автозагрузка отключена, грузим по кнопкам)
  const summary = useSummary(period);
  const timeline = useTimeline(period);
  const pages = useTopPages(period);
  const articles = useTopArticles(period);
  const sessions = useSessions(period);

  // Функции принудительной загрузки
  const loadAll = useCallback(() => {
    summary.refetch();
    timeline.refetch();
    pages.refetch();
    articles.refetch();
    sessions.refetch();
  }, [summary, timeline, pages, articles, sessions]);

  const handleCompare = (p1: string, p2: string) => {
    // Здесь можно реализовать сравнение, но пока просто выведем в консоль
    console.log('Compare', p1, p2);
    // В реальности запросим данные за оба периода и отобразим на одном графике
  };

  return (
    <div className="space-y-6">
      {/* Шапка */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b-2 border-primary/20 px-4 py-4 flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-3xl font-bold">Полная аналитика</h2>
        <div className="flex items-center gap-3">
          <PeriodSelector value={period} onChange={setPeriod} />
          <ComparePeriodSelector onCompare={handleCompare} />
          <Button onClick={loadAll} variant="outline" className="gap-2">
            <Icon name="RefreshCw" size={16} className={summary.isFetching ? 'animate-spin' : ''} />
            Обновить всё
          </Button>
        </div>
      </div>

      {/* Карточки метрик */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          label="Уникальные посетители"
          value={summary.data?.unique_visitors ?? '—'}
          icon={<Icon name="Users" size={20} />}
          loading={summary.isFetching}
        />
        <MetricCard
          label="Сессии"
          value={summary.data?.sessions ?? '—'}
          icon={<Icon name="Layers" size={20} />}
          loading={summary.isFetching}
        />
        <MetricCard
          label="Просмотры страниц"
          value={summary.data?.page_views ?? '—'}
          icon={<Icon name="Eye" size={20} />}
          loading={summary.isFetching}
        />
        <MetricCard
          label="Клики провайдеров"
          value={summary.data?.provider_clicks ?? '—'}
          icon={<Icon name="MousePointerClick" size={20} />}
          loading={summary.isFetching}
        />
      </div>

      {summary.error && (
        <Alert variant="destructive">
          <AlertDescription>{summary.error.message}</AlertDescription>
        </Alert>
      )}

      {/* Вкладки с графиками и таблицами */}
      <Tabs defaultValue="timeline" className="space-y-4">
        <TabsList>
          <TabsTrigger value="timeline">Динамика</TabsTrigger>
          <TabsTrigger value="pages">Страницы</TabsTrigger>
          <TabsTrigger value="articles">Статьи</TabsTrigger>
          <TabsTrigger value="sessions">Сессии</TabsTrigger>
        </TabsList>

        {/* Timeline */}
        <TabsContent value="timeline">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Динамика событий по дням</CardTitle>
              <div className="flex items-center gap-2">
                <ChartFilters
                  selected={selectedEventTypes}
                  onChange={setSelectedEventTypes}
                  options={[
                    { value: 'page_views', label: 'Просмотры', color: '#3b82f6' },
                    { value: 'provider_clicks', label: 'Клики провайдеров', color: '#10b981' },
                    { value: 'outbound_clicks', label: 'Внешние ссылки', color: '#f59e0b' },
                  ]}
                />
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => timeline.refetch()}
                  disabled={timeline.isFetching}
                >
                  <Icon name="RefreshCw" size={14} className={timeline.isFetching ? 'animate-spin' : ''} />
                </Button>
                <ExportButton
                  data={timeline.data?.timeline ?? []}
                  filename={`timeline_${period}`}
                  columns={[
                    { key: 'date', label: 'Дата' },
                    { key: 'page_views', label: 'Просмотры' },
                    { key: 'provider_clicks', label: 'Клики' },
                    { key: 'outbound_clicks', label: 'Внешние' },
                  ]}
                />
              </div>
            </CardHeader>
            <CardContent>
              {timeline.isFetching && !timeline.data && (
                <div className="flex justify-center py-12">
                  <Icon name="Loader2" size={32} className="animate-spin text-primary" />
                </div>
              )}
              {timeline.data && timeline.data.timeline.length > 0 && (
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={timeline.data.timeline}>
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    {selectedEventTypes.includes('page_views') && (
                      <Line type="monotone" dataKey="page_views" stroke="#3b82f6" name="Просмотры" />
                    )}
                    {selectedEventTypes.includes('provider_clicks') && (
                      <Line type="monotone" dataKey="provider_clicks" stroke="#10b981" name="Клики провайдеров" />
                    )}
                    {selectedEventTypes.includes('outbound_clicks') && (
                      <Line type="monotone" dataKey="outbound_clicks" stroke="#f59e0b" name="Внешние ссылки" />
                    )}
                  </LineChart>
                </ResponsiveContainer>
              )}
              {timeline.data && timeline.data.timeline.length === 0 && (
                <p className="text-center text-muted-foreground py-12">Нет данных за выбранный период</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Страницы */}
        <TabsContent value="pages">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Топ страниц</CardTitle>
              <div className="flex gap-2">
                <Button size="sm" variant="ghost" onClick={() => pages.refetch()} disabled={pages.isFetching}>
                  <Icon name="RefreshCw" size={14} className={pages.isFetching ? 'animate-spin' : ''} />
                </Button>
                <ExportButton
                  data={pages.data?.pages ?? []}
                  filename={`pages_${period}`}
                  columns={[
                    { key: 'page_path', label: 'Страница' },
                    { key: 'views', label: 'Просмотры' },
                    { key: 'unique_visitors', label: 'Уникальные' },
                    { key: 'avg_duration', label: 'Ср. время (сек)' },
                  ]}
                />
              </div>
            </CardHeader>
            <CardContent>
              {pages.isFetching && !pages.data && (
                <div className="flex justify-center py-12">
                  <Icon name="Loader2" size={32} className="animate-spin text-primary" />
                </div>
              )}
              {pages.data && pages.data.pages.length > 0 && (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2">Страница</th>
                        <th className="text-right py-2">Просмотры</th>
                        <th className="text-right py-2">Уникальные</th>
                        <th className="text-right py-2">Ср. время (сек)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pages.data.pages.map((page: PageStat) => (
                        <tr key={page.page_path} className="border-b hover:bg-muted/50">
                          <td className="py-2 font-mono text-sm">{page.page_path}</td>
                          <td className="text-right">{page.views}</td>
                          <td className="text-right">{page.unique_visitors}</td>
                          <td className="text-right">{page.avg_duration ? Math.round(page.avg_duration) : '—'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              {pages.data && pages.data.pages.length === 0 && (
                <p className="text-center text-muted-foreground py-12">Нет данных</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Статьи */}
        <TabsContent value="articles">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Статьи и конверсия в клик</CardTitle>
              <div className="flex gap-2">
                <Button size="sm" variant="ghost" onClick={() => articles.refetch()} disabled={articles.isFetching}>
                  <Icon name="RefreshCw" size={14} className={articles.isFetching ? 'animate-spin' : ''} />
                </Button>
                <ExportButton
                  data={articles.data?.articles ?? []}
                  filename={`articles_${period}`}
                  columns={[
                    { key: 'target_id', label: 'Slug статьи' },
                    { key: 'views', label: 'Просмотры' },
                    { key: 'unique_visitors', label: 'Уникальные' },
                    { key: 'clicks', label: 'Клики' },
                    { key: 'conversion_rate', label: 'Конверсия (%)' },
                  ]}
                />
              </div>
            </CardHeader>
            <CardContent>
              {articles.isFetching && !articles.data && (
                <div className="flex justify-center py-12">
                  <Icon name="Loader2" size={32} className="animate-spin text-primary" />
                </div>
              )}
              {articles.data && articles.data.articles.length > 0 && (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2">Статья (slug)</th>
                        <th className="text-right py-2">Просмотры</th>
                        <th className="text-right py-2">Уникальные</th>
                        <th className="text-right py-2">Клики</th>
                        <th className="text-right py-2">Конверсия</th>
                      </tr>
                    </thead>
                    <tbody>
                      {articles.data.articles.map((art: ArticleStat) => (
                        <tr key={art.target_id} className="border-b hover:bg-muted/50">
                          <td className="py-2 font-mono text-sm">{art.target_id}</td>
                          <td className="text-right">{art.views}</td>
                          <td className="text-right">{art.unique_visitors}</td>
                          <td className="text-right">{art.clicks}</td>
                          <td className="text-right">{art.conversion_rate}%</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              {articles.data && articles.data.articles.length === 0 && (
                <p className="text-center text-muted-foreground py-12">Нет данных</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Сессии */}
        <TabsContent value="sessions">
          <SessionTable
            data={sessions.data?.sessions ?? []}
            isLoading={sessions.isFetching}
            onRefresh={() => sessions.refetch()}
            period={period}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};
