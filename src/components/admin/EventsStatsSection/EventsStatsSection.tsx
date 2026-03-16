import { useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import Icon from "@/components/ui/icon";
import {
  useSummary,
  useTimeline,
  useTopPages,
  useTopArticles,
  useSessions,
  useSources,
  useLinkClicks,
} from "@/hooks/useEventsStats";
import { PeriodSelector } from "./components/PeriodSelector";
import { MetricCard } from "./components/MetricCard";
import { CSVExportButton } from "./components/CSVExportButton";
import { SessionTable } from "./components/SessionTable";
import { ChartFilters } from "./components/ChartFilters";
import { ArticleStat, LinkClickStat, SourceStat, PageStat } from "./types";
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
} from "recharts";

const COLORS = [
  "#3b82f6",
  "#10b981",
  "#f59e0b",
  "#8b5cf6",
  "#ec4899",
  "#14b8a6",
  "#f97316",
];

const SOURCE_COLORS: Record<string, string> = {
  "\u042f\u043d\u0434\u0435\u043a\u0441 \u00b7 \u0440\u0435\u043a\u043b\u0430\u043c\u0430":
    "#f59e0b",
  "\u042f\u043d\u0434\u0435\u043a\u0441 \u00b7 \u043e\u0440\u0433\u0430\u043d\u0438\u043a\u0430":
    "#10b981",
  "\u0412\u043d\u0443\u0442\u0440\u0435\u043d\u043d\u0438\u0439": "#06b6d4",
  "\u041f\u0440\u044f\u043c\u043e\u0439": "#8b8fa8",
};
function sourceColor(name: string, idx: number): string {
  return SOURCE_COLORS[name] ?? COLORS[idx % COLORS.length];
}

function dur(seconds: number | null | undefined): string {
  if (seconds == null) return "\u2014";
  const s = Math.round(Number(seconds));
  if (s < 60) return `${s}\u0441`;
  return `${Math.floor(s / 60)}\u043c ${s % 60}\u0441`;
}

function pct(n: number | null | undefined): string {
  if (n == null) return "\u2014";
  return (Number(n) * 100).toFixed(1) + "%";
}

function Loader() {
  return (
    <div className="flex justify-center py-12">
      <Icon name="Loader2" size={32} className="animate-spin text-primary" />
    </div>
  );
}

function Empty({ text }: { text?: string }) {
  return (
    <p className="text-center text-muted-foreground py-12">
      {text ?? "No data for the selected period"}
    </p>
  );
}

function TabCardHeader({
  title,
  onRefresh,
  isRefreshing,
  csvData,
  csvFilename,
  csvColumns,
}: {
  title: string;
  onRefresh: () => void;
  isRefreshing: boolean;
  csvData: any[];
  csvFilename: string;
  csvColumns: { key: string; label: string }[];
}) {
  return (
    <CardHeader className="flex flex-row items-center justify-between">
      <CardTitle>{title}</CardTitle>
      <div className="flex items-center gap-2">
        <Button
          size="sm"
          variant="ghost"
          onClick={onRefresh}
          disabled={isRefreshing}
        >
          <Icon
            name="RefreshCw"
            size={14}
            className={isRefreshing ? "animate-spin" : ""}
          />
        </Button>
        <CSVExportButton
          data={csvData}
          filename={csvFilename}
          columns={csvColumns as any}
        />
      </div>
    </CardHeader>
  );
}

export const EventsStatsSection = () => {
  const [period, setPeriod] = useState<"1" | "7" | "30">("30");
  const [selectedEventTypes, setSelectedEventTypes] = useState<string[]>([
    "page_views",
    "provider_clicks",
  ]);

  const summary = useSummary(period);
  const timeline = useTimeline(period);
  const pages = useTopPages(period);
  const articles = useTopArticles(period);
  const sessions = useSessions(period);
  const sources = useSources(period);
  const linkClicks = useLinkClicks(period);

  const isAnyLoading =
    summary.isFetching ||
    timeline.isFetching ||
    pages.isFetching ||
    articles.isFetching ||
    sessions.isFetching ||
    sources.isFetching ||
    linkClicks.isFetching;

  const loadAll = useCallback(() => {
    summary.refetch();
    timeline.refetch();
    pages.refetch();
    articles.refetch();
    sessions.refetch();
    sources.refetch();
    linkClicks.refetch();
  }, [summary, timeline, pages, articles, sessions, sources, linkClicks]);

  const sourcesData = (sources.data?.sources ?? []).map(
    (s: SourceStat, i: number) => ({
      name: s.source,
      value: s.visitors,
      color: sourceColor(s.source, i),
    }),
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-border px-4 py-4 flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-2xl font-bold">
          {
            "\u0410\u043d\u0430\u043b\u0438\u0442\u0438\u043a\u0430 \u0441\u043e\u0431\u044b\u0442\u0438\u0439"
          }
        </h2>
        <div className="flex items-center gap-3">
          <PeriodSelector value={period} onChange={setPeriod} />
          <Button
            onClick={loadAll}
            variant="outline"
            className="gap-2"
            disabled={isAnyLoading}
          >
            <Icon
              name="RefreshCw"
              size={16}
              className={isAnyLoading ? "animate-spin" : ""}
            />
            {
              "\u041e\u0431\u043d\u043e\u0432\u0438\u0442\u044c \u0432\u0441\u0451"
            }
          </Button>
        </div>
      </div>

      {summary.error && (
        <Alert variant="destructive">
          <AlertDescription>
            {(summary.error as Error).message}
          </AlertDescription>
        </Alert>
      )}

      {/* Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          label={
            "\u0423\u043d\u0438\u043a\u0430\u043b\u044c\u043d\u044b\u0445 \u043f\u043e\u0441\u0435\u0442\u0438\u0442\u0435\u043b\u0435\u0439"
          }
          value={summary.data?.unique_visitors ?? "\u2014"}
          icon={<Icon name="Users" size={20} />}
          loading={summary.isFetching}
        />
        <MetricCard
          label={"\u0421\u0435\u0441\u0441\u0438\u0439"}
          value={summary.data?.sessions ?? "\u2014"}
          icon={<Icon name="Layers" size={20} />}
          loading={summary.isFetching}
        />
        <MetricCard
          label={
            "\u041f\u0440\u043e\u0441\u043c\u043e\u0442\u0440\u043e\u0432 \u0441\u0442\u0440\u0430\u043d\u0438\u0446"
          }
          value={summary.data?.page_views ?? "\u2014"}
          icon={<Icon name="Eye" size={20} />}
          loading={summary.isFetching}
        />
        <MetricCard
          label={
            "\u041a\u043b\u0438\u043a\u043e\u0432 \u043f\u043e \u043f\u0440\u043e\u0432\u0430\u0439\u0434\u0435\u0440\u0430\u043c"
          }
          value={summary.data?.provider_clicks ?? "\u2014"}
          icon={<Icon name="MousePointerClick" size={20} />}
          loading={summary.isFetching}
        />
        <MetricCard
          label={
            "\u0412\u043d\u0435\u0448\u043d\u0438\u0445 \u043f\u0435\u0440\u0435\u0445\u043e\u0434\u043e\u0432"
          }
          value={summary.data?.outbound_clicks ?? "\u2014"}
          icon={<Icon name="ExternalLink" size={20} />}
          loading={summary.isFetching}
        />
        <MetricCard
          label={
            "\u0421\u0440. \u0432\u0440\u0435\u043c\u044f \u043d\u0430 \u0441\u0442\u0440\u0430\u043d\u0438\u0446\u0435"
          }
          value={dur(summary.data?.avg_duration)}
          icon={<Icon name="Clock" size={20} />}
          loading={summary.isFetching}
        />
        <MetricCard
          label={
            "\u041f\u0440\u043e\u0446\u0435\u043d\u0442 \u043e\u0442\u043a\u0430\u0437\u043e\u0432"
          }
          value={pct(summary.data?.bounce_rate)}
          icon={<Icon name="TrendingDown" size={20} />}
          loading={summary.isFetching}
        />
      </div>

      {/* Tabs */}
      <Tabs defaultValue="timeline" className="space-y-4">
        <TabsList className="flex-wrap h-auto">
          <TabsTrigger value="timeline">
            {"\u0414\u0438\u043d\u0430\u043c\u0438\u043a\u0430"}
          </TabsTrigger>
          <TabsTrigger value="sources">
            {"\u0418\u0441\u0442\u043e\u0447\u043d\u0438\u043a\u0438"}
          </TabsTrigger>
          <TabsTrigger value="pages">
            {"\u0421\u0442\u0440\u0430\u043d\u0438\u0446\u044b"}
          </TabsTrigger>
          <TabsTrigger value="articles">
            {"\u0421\u0442\u0430\u0442\u044c\u0438"}
          </TabsTrigger>
          <TabsTrigger value="links">
            {"\u041f\u0435\u0440\u0435\u0445\u043e\u0434\u044b"}
          </TabsTrigger>
          <TabsTrigger value="sessions">
            {"\u0421\u0435\u0441\u0441\u0438\u0438"}
          </TabsTrigger>
        </TabsList>

        {/* Timeline */}
        <TabsContent value="timeline">
          <Card>
            <TabCardHeader
              title={
                "\u0414\u0438\u043d\u0430\u043c\u0438\u043a\u0430 \u0441\u043e\u0431\u044b\u0442\u0438\u0439 \u043f\u043e \u0434\u043d\u044f\u043c"
              }
              onRefresh={() => timeline.refetch()}
              isRefreshing={timeline.isFetching}
              csvData={timeline.data?.timeline ?? []}
              csvFilename={`timeline_${period}`}
              csvColumns={[
                { key: "date", label: "Date" },
                { key: "page_views", label: "Page views" },
                { key: "section_visits", label: "Section visits" },
                { key: "provider_clicks", label: "Provider clicks" },
                { key: "outbound_clicks", label: "Outbound clicks" },
              ]}
            />
            <CardContent>
              <div className="mb-4">
                <ChartFilters
                  selected={selectedEventTypes}
                  onChange={setSelectedEventTypes}
                  options={[
                    {
                      value: "page_views",
                      label:
                        "\u041f\u0440\u043e\u0441\u043c\u043e\u0442\u0440\u044b",
                      color: "#3b82f6",
                    },
                    {
                      value: "section_visits",
                      label:
                        "\u0412\u0438\u0437\u0438\u0442\u044b \u0440\u0430\u0437\u0434\u0435\u043b\u043e\u0432",
                      color: "#8b5cf6",
                    },
                    {
                      value: "provider_clicks",
                      label:
                        "\u041a\u043b\u0438\u043a\u0438 \u043f\u0440\u043e\u0432\u0430\u0439\u0434\u0435\u0440\u043e\u0432",
                      color: "#10b981",
                    },
                    {
                      value: "outbound_clicks",
                      label:
                        "\u0412\u043d\u0435\u0448\u043d\u0438\u0435 \u0441\u0441\u044b\u043b\u043a\u0438",
                      color: "#f59e0b",
                    },
                  ]}
                />
              </div>
              {timeline.isFetching && !timeline.data && <Loader />}
              {timeline.data && timeline.data.timeline.length === 0 && (
                <Empty />
              )}
              {timeline.data && timeline.data.timeline.length > 0 && (
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={timeline.data.timeline}>
                    <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip />
                    <Legend />
                    {selectedEventTypes.includes("page_views") && (
                      <Line
                        type="monotone"
                        dataKey="page_views"
                        stroke="#3b82f6"
                        name="\u041f\u0440\u043e\u0441\u043c\u043e\u0442\u0440\u044b"
                        dot={false}
                        strokeWidth={2}
                      />
                    )}
                    {selectedEventTypes.includes("section_visits") && (
                      <Line
                        type="monotone"
                        dataKey="section_visits"
                        stroke="#8b5cf6"
                        name="\u0412\u0438\u0437\u0438\u0442\u044b \u0440\u0430\u0437\u0434\u0435\u043b\u043e\u0432"
                        dot={false}
                        strokeWidth={2}
                      />
                    )}
                    {selectedEventTypes.includes("provider_clicks") && (
                      <Line
                        type="monotone"
                        dataKey="provider_clicks"
                        stroke="#10b981"
                        name="\u041a\u043b\u0438\u043a\u0438 \u043f\u0440\u043e\u0432\u0430\u0439\u0434\u0435\u0440\u043e\u0432"
                        dot={false}
                        strokeWidth={2}
                      />
                    )}
                    {selectedEventTypes.includes("outbound_clicks") && (
                      <Line
                        type="monotone"
                        dataKey="outbound_clicks"
                        stroke="#f59e0b"
                        name="\u0412\u043d\u0435\u0448\u043d\u0438\u0435 \u0441\u0441\u044b\u043b\u043a\u0438"
                        dot={false}
                        strokeWidth={2}
                      />
                    )}
                  </LineChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Sources */}
        <TabsContent value="sources">
          <div className="grid gap-4 lg:grid-cols-2">
            <Card>
              <TabCardHeader
                title={
                  "\u0418\u0441\u0442\u043e\u0447\u043d\u0438\u043a\u0438 \u0442\u0440\u0430\u0444\u0438\u043a\u0430"
                }
                onRefresh={() => sources.refetch()}
                isRefreshing={sources.isFetching}
                csvData={sources.data?.sources ?? []}
                csvFilename={`sources_${period}`}
                csvColumns={[
                  { key: "source", label: "Source" },
                  { key: "visitors", label: "Visitors" },
                  { key: "sessions", label: "Sessions" },
                  { key: "page_views", label: "Page views" },
                ]}
              />
              <CardContent>
                {sources.isFetching && !sources.data && <Loader />}
                {sources.data && sourcesData.length === 0 && <Empty />}
                {sourcesData.length > 0 && (
                  <>
                    <ResponsiveContainer width="100%" height={260}>
                      <PieChart>
                        <Pie
                          data={sourcesData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={100}
                          paddingAngle={2}
                          dataKey="value"
                        >
                          {sourcesData.map((entry, i) => (
                            <Cell key={i} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(v: any) => [`${v}`, ""]} />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="mt-2 space-y-1">
                      {(sources.data?.sources ?? []).map(
                        (s: SourceStat, i: number) => {
                          const total =
                            sourcesData.reduce((sum, d) => sum + d.value, 0) ||
                            1;
                          const share = ((s.visitors / total) * 100).toFixed(1);
                          return (
                            <div
                              key={i}
                              className="flex items-center justify-between text-sm"
                            >
                              <div className="flex items-center gap-2">
                                <div
                                  className="w-3 h-3 rounded-sm flex-shrink-0"
                                  style={{
                                    background: sourceColor(s.source, i),
                                  }}
                                />
                                <span>{s.source}</span>
                              </div>
                              <div className="flex gap-4 text-muted-foreground">
                                <span>{share}%</span>
                                <span>{s.visitors}</span>
                                <span>{s.page_views}</span>
                              </div>
                            </div>
                          );
                        },
                      )}
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>
                  {
                    "\u041f\u043e\u0441\u0435\u0442\u0438\u0442\u0435\u043b\u0438 \u043f\u043e \u0438\u0441\u0442\u043e\u0447\u043d\u0438\u043a\u0443"
                  }
                </CardTitle>
              </CardHeader>
              <CardContent>
                {sources.isFetching && !sources.data && <Loader />}
                {sources.data && sourcesData.length === 0 && <Empty />}
                {sourcesData.length > 0 && (
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={sources.data?.sources} layout="vertical">
                      <XAxis type="number" tick={{ fontSize: 11 }} />
                      <YAxis
                        type="category"
                        dataKey="source"
                        width={140}
                        tick={{ fontSize: 11 }}
                      />
                      <Tooltip />
                      <Bar
                        dataKey="visitors"
                        name="\u041f\u043e\u0441\u0435\u0442\u0438\u0442\u0435\u043b\u0438"
                        radius={[0, 4, 4, 0]}
                      >
                        {((sources.data?.sources as SourceStat[]) ?? []).map(
                          (_: SourceStat, i: number) => (
                            <Cell key={i} fill={sourceColor(_.source, i)} />
                          ),
                        )}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Pages */}
        <TabsContent value="pages">
          <div className="grid gap-4 lg:grid-cols-2">
            <Card>
              <TabCardHeader
                title={
                  "\u0422\u043e\u043f \u0441\u0442\u0440\u0430\u043d\u0438\u0446"
                }
                onRefresh={() => pages.refetch()}
                isRefreshing={pages.isFetching}
                csvData={pages.data?.pages ?? []}
                csvFilename={`pages_${period}`}
                csvColumns={[
                  { key: "provider_name", label: "Provider" },
                  { key: "page_path", label: "URL" },
                  { key: "views", label: "Views" },
                  { key: "unique_visitors", label: "Unique" },
                  { key: "avg_duration", label: "Avg time (s)" },
                ]}
              />
              <CardContent>
                {pages.isFetching && !pages.data && <Loader />}
                {pages.data && pages.data.pages.length === 0 && <Empty />}
                {pages.data && pages.data.pages.length > 0 && (
                  <ResponsiveContainer
                    width="100%"
                    height={Math.max(
                      300,
                      pages.data.pages.slice(0, 10).length * 40 + 40,
                    )}
                  >
                    <BarChart
                      data={pages.data.pages.slice(0, 10)}
                      layout="vertical"
                    >
                      <XAxis type="number" tick={{ fontSize: 11 }} />
                      <YAxis
                        type="category"
                        dataKey="provider_name"
                        width={100}
                        tick={{ fontSize: 11 }}
                      />
                      <Tooltip />
                      <Legend />
                      <Bar
                        dataKey="views"
                        name="\u041f\u0440\u043e\u0441\u043c\u043e\u0442\u0440\u044b"
                        fill="#3b82f6"
                        radius={[0, 4, 4, 0]}
                      />
                      <Bar
                        dataKey="unique_visitors"
                        name="\u0423\u043d\u0438\u043a\u0430\u043b\u044c\u043d\u044b\u0435"
                        fill="#10b981"
                        radius={[0, 4, 4, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>
                  {
                    "\u0414\u0435\u0442\u0430\u043b\u0438 \u043f\u043e \u0441\u0442\u0440\u0430\u043d\u0438\u0446\u0430\u043c"
                  }
                </CardTitle>
              </CardHeader>
              <CardContent>
                {pages.isFetching && !pages.data && <Loader />}
                {pages.data && pages.data.pages.length === 0 && <Empty />}
                {pages.data && pages.data.pages.length > 0 && (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b text-muted-foreground">
                          <th className="text-left py-2 font-medium">
                            {"\u0421\u0442\u0440\u0430\u043d\u0438\u0446\u0430"}
                          </th>
                          <th className="text-right py-2 font-medium">
                            {"\u041f\u0440\u043e\u0441\u043c."}
                          </th>
                          <th className="text-right py-2 font-medium">
                            {"\u0423\u043d\u0438\u043a."}
                          </th>
                          <th className="text-right py-2 font-medium">
                            {"\u0421\u0440. \u0432\u0440\u0435\u043c\u044f"}
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {(pages.data.pages as PageStat[]).map(
                          (p: PageStat, i: number) => (
                            <tr key={i} className="border-b hover:bg-muted/50">
                              <td
                                className="py-2 max-w-[160px] truncate"
                                title={p.page_path}
                              >
                                {p.provider_name || p.page_path}
                              </td>
                              <td className="text-right py-2">{p.views}</td>
                              <td className="text-right py-2 text-primary">
                                {p.unique_visitors}
                              </td>
                              <td className="text-right py-2 text-muted-foreground">
                                {dur(p.avg_duration)}
                              </td>
                            </tr>
                          ),
                        )}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Articles */}
        <TabsContent value="articles">
          <div className="grid gap-4 lg:grid-cols-2">
            <Card>
              <TabCardHeader
                title={
                  "\u0421\u0442\u0430\u0442\u044c\u0438 \u00b7 \u043f\u0440\u043e\u0441\u043c\u043e\u0442\u0440\u044b \u0438 \u043a\u043e\u043d\u0432\u0435\u0440\u0441\u0438\u044f"
                }
                onRefresh={() => articles.refetch()}
                isRefreshing={articles.isFetching}
                csvData={articles.data?.articles ?? []}
                csvFilename={`articles_${period}`}
                csvColumns={[
                  { key: "provider_name", label: "Provider" },
                  { key: "views", label: "Views" },
                  { key: "unique_visitors", label: "Unique" },
                  { key: "clicks", label: "Clicks" },
                  { key: "conversion_rate", label: "Conversion (%)" },
                ]}
              />
              <CardContent>
                {articles.isFetching && !articles.data && <Loader />}
                {articles.data && articles.data.articles.length === 0 && (
                  <Empty />
                )}
                {articles.data && articles.data.articles.length > 0 && (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b text-muted-foreground">
                          <th className="text-left py-2 font-medium">
                            {"\u0421\u0442\u0430\u0442\u044c\u044f"}
                          </th>
                          <th className="text-right py-2 font-medium">
                            {"\u0412\u0441\u0435\u0433\u043e"}
                          </th>
                          <th className="text-right py-2 font-medium">
                            {"\u0423\u043d\u0438\u043a."}
                          </th>
                          <th className="text-right py-2 font-medium">
                            {"\u041a\u043e\u043d\u0432."}
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {(articles.data.articles as ArticleStat[])
                          .filter(
                            (a: ArticleStat) =>
                              !a.target_id.includes("vpn-list"),
                          )
                          .map((art: ArticleStat, i: number) => (
                            <tr key={i} className="border-b hover:bg-muted/50">
                              <td
                                className="py-2 max-w-[160px] truncate"
                                title={art.target_id}
                              >
                                {art.provider_name || art.target_id}
                              </td>
                              <td className="text-right py-2">{art.views}</td>
                              <td className="text-right py-2 text-primary">
                                {art.unique_visitors}
                              </td>
                              <td
                                className={`text-right py-2 font-medium ${Number(art.conversion_rate) > 5 ? "text-green-500" : "text-muted-foreground"}`}
                              >
                                {art.conversion_rate != null
                                  ? `${art.conversion_rate}%`
                                  : "\u2014"}
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>
                  {
                    "\u041f\u0440\u043e\u0441\u043c\u043e\u0442\u0440\u044b \u043f\u043e \u0441\u0442\u0430\u0442\u044c\u044f\u043c"
                  }
                </CardTitle>
              </CardHeader>
              <CardContent>
                {articles.isFetching && !articles.data && <Loader />}
                {articles.data && articles.data.articles.length === 0 && (
                  <Empty />
                )}
                {articles.data &&
                  articles.data.articles.length > 0 &&
                  (() => {
                    const filtered = (articles.data.articles as ArticleStat[])
                      .filter(
                        (a: ArticleStat) => !a.target_id.includes("vpn-list"),
                      )
                      .slice(0, 8);
                    return (
                      <ResponsiveContainer
                        width="100%"
                        height={Math.max(280, filtered.length * 44 + 40)}
                      >
                        <BarChart data={filtered} layout="vertical">
                          <XAxis type="number" tick={{ fontSize: 11 }} />
                          <YAxis
                            type="category"
                            dataKey="provider_name"
                            width={90}
                            tick={{ fontSize: 11 }}
                          />
                          <Tooltip />
                          <Legend />
                          <Bar
                            dataKey="views"
                            name="\u041f\u0440\u043e\u0441\u043c\u043e\u0442\u0440\u044b"
                            fill="#3b82f6"
                            radius={[0, 4, 4, 0]}
                          />
                          <Bar
                            dataKey="unique_visitors"
                            name="\u0423\u043d\u0438\u043a\u0430\u043b\u044c\u043d\u044b\u0435"
                            fill="#10b981"
                            radius={[0, 4, 4, 0]}
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    );
                  })()}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Link clicks */}
        <TabsContent value="links">
          <div className="grid gap-4 lg:grid-cols-2">
            <Card>
              <TabCardHeader
                title={
                  "\u041f\u0435\u0440\u0435\u0445\u043e\u0434\u044b \u043f\u043e \u0441\u0441\u044b\u043b\u043a\u0430\u043c \u0438\u0437 \u0441\u0442\u0430\u0442\u0435\u0439"
                }
                onRefresh={() => linkClicks.refetch()}
                isRefreshing={linkClicks.isFetching}
                csvData={linkClicks.data?.link_clicks ?? []}
                csvFilename={`link_clicks_${period}`}
                csvColumns={[
                  { key: "provider_name", label: "Provider" },
                  { key: "button_clicks_total", label: "Button total" },
                  { key: "button_clicks_unique", label: "Button unique" },
                  { key: "text_clicks_total", label: "Text total" },
                  { key: "text_clicks_unique", label: "Text unique" },
                ]}
              />
              <CardContent>
                {linkClicks.isFetching && !linkClicks.data && <Loader />}
                {linkClicks.data &&
                  linkClicks.data.link_clicks.length === 0 && <Empty />}
                {linkClicks.data && linkClicks.data.link_clicks.length > 0 && (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b text-muted-foreground">
                          <th className="text-left py-2 font-medium">
                            {"\u0421\u0442\u0430\u0442\u044c\u044f"}
                          </th>
                          <th className="text-right py-2 font-medium text-blue-500">
                            {"\u041a\u043d\u043e\u043f\u043a\u0430"}
                            <br />
                            {"\u0432\u0441\u0435\u0433\u043e"}
                          </th>
                          <th className="text-right py-2 font-medium text-muted-foreground">
                            {"\u0443\u043d\u0438\u043a."}
                          </th>
                          <th className="text-right py-2 font-medium text-green-500">
                            {"\u0422\u0435\u043a\u0441\u0442"}
                            <br />
                            {"\u0432\u0441\u0435\u0433\u043e"}
                          </th>
                          <th className="text-right py-2 font-medium text-muted-foreground">
                            {"\u0443\u043d\u0438\u043a."}
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {(linkClicks.data.link_clicks as LinkClickStat[]).map(
                          (lc: LinkClickStat, i: number) => (
                            <tr key={i} className="border-b hover:bg-muted/50">
                              <td
                                className="py-2 max-w-[140px] truncate"
                                title={lc.page_path}
                              >
                                {lc.provider_name || lc.page_path}
                              </td>
                              <td className="text-right py-2 font-medium text-blue-500">
                                {lc.button_clicks_total}
                              </td>
                              <td className="text-right py-2 text-muted-foreground">
                                {lc.button_clicks_unique}
                              </td>
                              <td className="text-right py-2 font-medium text-green-500">
                                {lc.text_clicks_total}
                              </td>
                              <td className="text-right py-2 text-muted-foreground">
                                {lc.text_clicks_unique}
                              </td>
                            </tr>
                          ),
                        )}
                      </tbody>
                    </table>
                    <div className="flex gap-4 mt-3 pt-3 border-t">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <div className="w-3 h-3 rounded-sm bg-blue-500" />
                        {
                          "\u043a\u043d\u043e\u043f\u043a\u0430 \u043f\u0440\u043e\u0432\u0430\u0439\u0434\u0435\u0440\u0430"
                        }
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <div className="w-3 h-3 rounded-sm bg-green-500" />
                        {
                          "\u0441\u0441\u044b\u043b\u043a\u0430 \u0438\u0437 \u0442\u0435\u043a\u0441\u0442\u0430"
                        }
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>
                  {
                    "\u041a\u043b\u0438\u043a\u0438 \u043f\u043e \u0441\u0442\u0430\u0442\u044c\u044f\u043c"
                  }
                </CardTitle>
              </CardHeader>
              <CardContent>
                {linkClicks.isFetching && !linkClicks.data && <Loader />}
                {linkClicks.data &&
                  linkClicks.data.link_clicks.length === 0 && <Empty />}
                {linkClicks.data &&
                  linkClicks.data.link_clicks.length > 0 &&
                  (() => {
                    const data = (
                      linkClicks.data.link_clicks as LinkClickStat[]
                    ).slice(0, 8);
                    return (
                      <ResponsiveContainer
                        width="100%"
                        height={Math.max(280, data.length * 50 + 40)}
                      >
                        <BarChart data={data} layout="vertical">
                          <XAxis type="number" tick={{ fontSize: 11 }} />
                          <YAxis
                            type="category"
                            dataKey="provider_name"
                            width={90}
                            tick={{ fontSize: 11 }}
                          />
                          <Tooltip />
                          <Legend />
                          <Bar
                            dataKey="button_clicks_total"
                            name="\u041a\u043d\u043e\u043f\u043a\u0430"
                            fill="#3b82f6"
                            radius={[0, 4, 4, 0]}
                          />
                          <Bar
                            dataKey="text_clicks_total"
                            name="\u0422\u0435\u043a\u0441\u0442"
                            fill="#10b981"
                            radius={[0, 4, 4, 0]}
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    );
                  })()}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Sessions */}
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
