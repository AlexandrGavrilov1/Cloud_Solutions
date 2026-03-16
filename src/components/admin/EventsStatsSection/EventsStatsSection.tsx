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

// All Russian strings as fromCharCode to avoid encoding issues
const T = {
  ANALYTICS: String.fromCharCode(
    1040,
    1085,
    1072,
    1083,
    1080,
    1090,
    1080,
    1082,
    1072,
    32,
    1089,
    1086,
    1073,
    1099,
    1090,
    1080,
    1081,
  ),
  REFRESH_ALL: String.fromCharCode(
    1054,
    1073,
    1085,
    1086,
    1074,
    1080,
    1090,
    1100,
    32,
    1074,
    1089,
    1105,
  ),
  UNIQUE_VISITORS: String.fromCharCode(
    1059,
    1085,
    1080,
    1082,
    1072,
    1083,
    1100,
    1085,
    1099,
    1093,
    32,
    1087,
    1086,
    1089,
    1077,
    1090,
    1080,
    1090,
    1077,
    1083,
    1077,
    1081,
  ),
  SESSIONS: String.fromCharCode(1057, 1077, 1089, 1089, 1080, 1081),
  PAGE_VIEWS: String.fromCharCode(
    1055,
    1088,
    1086,
    1089,
    1084,
    1086,
    1090,
    1088,
    1086,
    1074,
    32,
    1089,
    1090,
    1088,
    1072,
    1085,
    1080,
    1094,
  ),
  PROVIDER_CLICKS: String.fromCharCode(
    1050,
    1083,
    1080,
    1082,
    1086,
    1074,
    32,
    1087,
    1086,
    32,
    1087,
    1088,
    1086,
    1074,
    1072,
    1081,
    1076,
    1077,
    1088,
    1072,
    1084,
  ),
  OUTBOUND_CLICKS: String.fromCharCode(
    1042,
    1085,
    1077,
    1096,
    1085,
    1080,
    1093,
    32,
    1087,
    1077,
    1088,
    1077,
    1093,
    1086,
    1076,
    1086,
    1074,
  ),
  AVG_TIME: String.fromCharCode(
    1057,
    1088,
    46,
    32,
    1074,
    1088,
    1077,
    1084,
    1103,
    32,
    1085,
    1072,
    32,
    1089,
    1090,
    1088,
    1072,
    1085,
    1080,
    1094,
    1077,
  ),
  BOUNCE_RATE: String.fromCharCode(
    1055,
    1088,
    1086,
    1094,
    1077,
    1085,
    1090,
    32,
    1086,
    1090,
    1082,
    1072,
    1079,
    1086,
    1074,
  ),
  DYNAMICS: String.fromCharCode(1044, 1080, 1085, 1072, 1084, 1080, 1082, 1072),
  SOURCES: String.fromCharCode(
    1048,
    1089,
    1090,
    1086,
    1095,
    1085,
    1080,
    1082,
    1080,
  ),
  PAGES: String.fromCharCode(1057, 1090, 1088, 1072, 1085, 1080, 1094, 1099),
  ARTICLES: String.fromCharCode(1057, 1090, 1072, 1090, 1100, 1080),
  LINKS: String.fromCharCode(1055, 1077, 1088, 1077, 1093, 1086, 1076, 1099),
  SESSIONS_TAB: String.fromCharCode(1057, 1077, 1089, 1089, 1080, 1080),
  TIMELINE_TITLE: String.fromCharCode(
    1044,
    1080,
    1085,
    1072,
    1084,
    1080,
    1082,
    1072,
    32,
    1089,
    1086,
    1073,
    1099,
    1090,
    1080,
    1081,
    32,
    1087,
    1086,
    32,
    1076,
    1085,
    1103,
    1084,
  ),
  VIEWS: String.fromCharCode(
    1055,
    1088,
    1086,
    1089,
    1084,
    1086,
    1090,
    1088,
    1099,
  ),
  SECTION_VISITS: String.fromCharCode(
    1042,
    1080,
    1079,
    1080,
    1090,
    1099,
    32,
    1088,
    1072,
    1079,
    1076,
    1077,
    1083,
    1086,
    1074,
  ),
  CLICKS_PROVIDERS: String.fromCharCode(
    1050,
    1083,
    1080,
    1082,
    1080,
    32,
    1087,
    1088,
    1086,
    1074,
    1072,
    1081,
    1076,
    1077,
    1088,
    1086,
    1074,
  ),
  OUTBOUND_LINKS: String.fromCharCode(
    1042,
    1085,
    1077,
    1096,
    1085,
    1080,
    1077,
    32,
    1089,
    1089,
    1099,
    1083,
    1082,
    1080,
  ),
  SOURCES_TITLE: String.fromCharCode(
    1048,
    1089,
    1090,
    1086,
    1095,
    1085,
    1080,
    1082,
    1080,
    32,
    1090,
    1088,
    1072,
    1092,
    1080,
    1082,
    1072,
  ),
  VISITORS_BY_SOURCE: String.fromCharCode(
    1055,
    1086,
    1089,
    1077,
    1090,
    1080,
    1090,
    1077,
    1083,
    1080,
    32,
    1087,
    1086,
    32,
    1080,
    1089,
    1090,
    1086,
    1095,
    1085,
    1080,
    1082,
    1091,
  ),
  VISITORS: String.fromCharCode(
    1055,
    1086,
    1089,
    1077,
    1090,
    1080,
    1090,
    1077,
    1083,
    1080,
  ),
  TOP_PAGES: String.fromCharCode(
    1058,
    1086,
    1087,
    32,
    1089,
    1090,
    1088,
    1072,
    1085,
    1080,
    1094,
  ),
  PAGE_DETAILS: String.fromCharCode(
    1044,
    1077,
    1090,
    1072,
    1083,
    1080,
    32,
    1087,
    1086,
    32,
    1089,
    1090,
    1088,
    1072,
    1085,
    1080,
    1094,
    1072,
    1084,
  ),
  PAGE_COL: String.fromCharCode(1057, 1090, 1088, 1072, 1085, 1080, 1094, 1072),
  VIEWS_SHORT: String.fromCharCode(1055, 1088, 1086, 1089, 1084, 46),
  UNIQUE_SHORT: String.fromCharCode(1059, 1085, 1080, 1082, 46),
  AVG_TIME_SHORT: String.fromCharCode(
    1057,
    1088,
    46,
    32,
    1074,
    1088,
    1077,
    1084,
    1103,
  ),
  ARTICLES_TITLE: String.fromCharCode(
    1057,
    1090,
    1072,
    1090,
    1100,
    1080,
    32,
    183,
    32,
    1087,
    1088,
    1086,
    1089,
    1084,
    1086,
    1090,
    1088,
    1099,
    32,
    1080,
    32,
    1082,
    1086,
    1085,
    1074,
    1077,
    1088,
    1089,
    1080,
    1103,
  ),
  ARTICLE_COL: String.fromCharCode(1057, 1090, 1072, 1090, 1100, 1103),
  TOTAL: String.fromCharCode(1042, 1089, 1077, 1075, 1086),
  CONV_SHORT: String.fromCharCode(1050, 1086, 1085, 1074, 46),
  VIEWS_BY_ARTICLES: String.fromCharCode(
    1055,
    1088,
    1086,
    1089,
    1084,
    1086,
    1090,
    1088,
    1099,
    32,
    1087,
    1086,
    32,
    1089,
    1090,
    1072,
    1090,
    1100,
    1103,
    1084,
  ),
  UNIQUE: String.fromCharCode(
    1059,
    1085,
    1080,
    1082,
    1072,
    1083,
    1100,
    1085,
    1099,
    1077,
  ),
  LINKS_TITLE: String.fromCharCode(
    1055,
    1077,
    1088,
    1077,
    1093,
    1086,
    1076,
    1099,
    32,
    1087,
    1086,
    32,
    1089,
    1089,
    1099,
    1083,
    1082,
    1072,
    1084,
    32,
    1080,
    1079,
    32,
    1089,
    1090,
    1072,
    1090,
    1077,
    1081,
  ),
  BUTTON: String.fromCharCode(1050, 1085, 1086, 1087, 1082, 1072),
  BUTTON_TOTAL: String.fromCharCode(1074, 1089, 1077, 1075, 1086),
  TEXT: String.fromCharCode(1058, 1077, 1082, 1089, 1090),
  UNIQ_SHORT: String.fromCharCode(1091, 1085, 1080, 1082, 46),
  BUTTON_PROVIDER: String.fromCharCode(
    1082,
    1085,
    1086,
    1087,
    1082,
    1072,
    32,
    1087,
    1088,
    1086,
    1074,
    1072,
    1081,
    1076,
    1077,
    1088,
    1072,
  ),
  LINK_FROM_TEXT: String.fromCharCode(
    1089,
    1089,
    1099,
    1083,
    1082,
    1072,
    32,
    1080,
    1079,
    32,
    1090,
    1077,
    1082,
    1089,
    1090,
    1072,
  ),
  CLICKS_BY_ARTICLES: String.fromCharCode(
    1050,
    1083,
    1080,
    1082,
    1080,
    32,
    1087,
    1086,
    32,
    1089,
    1090,
    1072,
    1090,
    1100,
    1103,
    1084,
  ),
  NO_DATA: String.fromCharCode(
    1053,
    1077,
    1090,
    32,
    1076,
    1072,
    1085,
    1085,
    1099,
    1093,
    32,
    1079,
    1072,
    32,
    1074,
    1099,
    1073,
    1088,
    1072,
    1085,
    1085,
    1099,
    1081,
    32,
    1087,
    1077,
    1088,
    1080,
    1086,
    1076,
  ),
  YANDEX_AD: String.fromCharCode(
    1071,
    1085,
    1076,
    1077,
    1082,
    1089,
    32,
    183,
    32,
    1088,
    1077,
    1082,
    1083,
    1072,
    1084,
    1072,
  ),
  YANDEX_ORG: String.fromCharCode(
    1071,
    1085,
    1076,
    1077,
    1082,
    1089,
    32,
    183,
    32,
    1086,
    1088,
    1075,
    1072,
    1085,
    1080,
    1082,
    1072,
  ),
  INTERNAL: String.fromCharCode(
    1042,
    1085,
    1091,
    1090,
    1088,
    1077,
    1085,
    1085,
    1080,
    1081,
  ),
  DIRECT: String.fromCharCode(1055, 1088, 1103, 1084, 1086, 1081),
};

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
  [T.YANDEX_AD]: "#f59e0b",
  [T.YANDEX_ORG]: "#10b981",
  [T.INTERNAL]: "#06b6d4",
  [T.DIRECT]: "#8b8fa8",
};
function sourceColor(name: string, idx: number): string {
  return SOURCE_COLORS[name] ?? COLORS[idx % COLORS.length];
}

function dur(seconds: number | null | undefined): string {
  if (seconds == null) return "\u2014";
  const s = Math.round(Number(seconds));
  if (s < 60) return `${s}${String.fromCharCode(1089)}`;
  return `${Math.floor(s / 60)}${String.fromCharCode(1084)} ${s % 60}${String.fromCharCode(1089)}`;
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

function Empty() {
  return <p className="text-center text-muted-foreground py-12">{T.NO_DATA}</p>;
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
        <h2 className="text-2xl font-bold">{T.ANALYTICS}</h2>
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
            {T.REFRESH_ALL}
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
          label={T.UNIQUE_VISITORS}
          value={summary.data?.unique_visitors ?? "\u2014"}
          icon={<Icon name="Users" size={20} />}
          loading={summary.isFetching}
        />
        <MetricCard
          label={T.SESSIONS}
          value={summary.data?.sessions ?? "\u2014"}
          icon={<Icon name="Layers" size={20} />}
          loading={summary.isFetching}
        />
        <MetricCard
          label={T.PAGE_VIEWS}
          value={summary.data?.page_views ?? "\u2014"}
          icon={<Icon name="Eye" size={20} />}
          loading={summary.isFetching}
        />
        <MetricCard
          label={T.PROVIDER_CLICKS}
          value={summary.data?.provider_clicks ?? "\u2014"}
          icon={<Icon name="MousePointerClick" size={20} />}
          loading={summary.isFetching}
        />
        <MetricCard
          label={T.OUTBOUND_CLICKS}
          value={summary.data?.outbound_clicks ?? "\u2014"}
          icon={<Icon name="ExternalLink" size={20} />}
          loading={summary.isFetching}
        />
        <MetricCard
          label={T.AVG_TIME}
          value={dur(summary.data?.avg_duration)}
          icon={<Icon name="Clock" size={20} />}
          loading={summary.isFetching}
        />
        <MetricCard
          label={T.BOUNCE_RATE}
          value={pct(summary.data?.bounce_rate)}
          icon={<Icon name="TrendingDown" size={20} />}
          loading={summary.isFetching}
        />
      </div>

      {/* Tabs */}
      <Tabs defaultValue="timeline" className="space-y-4">
        <TabsList className="flex-wrap h-auto">
          <TabsTrigger value="timeline">{T.DYNAMICS}</TabsTrigger>
          <TabsTrigger value="sources">{T.SOURCES}</TabsTrigger>
          <TabsTrigger value="pages">{T.PAGES}</TabsTrigger>
          <TabsTrigger value="articles">{T.ARTICLES}</TabsTrigger>
          <TabsTrigger value="links">{T.LINKS}</TabsTrigger>
          <TabsTrigger value="sessions">{T.SESSIONS_TAB}</TabsTrigger>
        </TabsList>

        {/* Timeline */}
        <TabsContent value="timeline">
          <Card>
            <TabCardHeader
              title={T.TIMELINE_TITLE}
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
                    { value: "page_views", label: T.VIEWS, color: "#3b82f6" },
                    {
                      value: "section_visits",
                      label: T.SECTION_VISITS,
                      color: "#8b5cf6",
                    },
                    {
                      value: "provider_clicks",
                      label: T.CLICKS_PROVIDERS,
                      color: "#10b981",
                    },
                    {
                      value: "outbound_clicks",
                      label: T.OUTBOUND_LINKS,
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
                        name={T.VIEWS}
                        dot={false}
                        strokeWidth={2}
                      />
                    )}
                    {selectedEventTypes.includes("section_visits") && (
                      <Line
                        type="monotone"
                        dataKey="section_visits"
                        stroke="#8b5cf6"
                        name={T.SECTION_VISITS}
                        dot={false}
                        strokeWidth={2}
                      />
                    )}
                    {selectedEventTypes.includes("provider_clicks") && (
                      <Line
                        type="monotone"
                        dataKey="provider_clicks"
                        stroke="#10b981"
                        name={T.CLICKS_PROVIDERS}
                        dot={false}
                        strokeWidth={2}
                      />
                    )}
                    {selectedEventTypes.includes("outbound_clicks") && (
                      <Line
                        type="monotone"
                        dataKey="outbound_clicks"
                        stroke="#f59e0b"
                        name={T.OUTBOUND_LINKS}
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
                title={T.SOURCES_TITLE}
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
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="mt-2 space-y-1">
                      {(sources.data?.sources ?? []).map(
                        (s: SourceStat, i: number) => {
                          const total =
                            sourcesData.reduce((sum, d) => sum + d.value, 0) ||
                            1;
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
                                <span>
                                  {((s.visitors / total) * 100).toFixed(1)}%
                                </span>
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
                <CardTitle>{T.VISITORS_BY_SOURCE}</CardTitle>
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
                        name={T.VISITORS}
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
                title={T.TOP_PAGES}
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
                        name={T.VIEWS}
                        fill="#3b82f6"
                        radius={[0, 4, 4, 0]}
                      />
                      <Bar
                        dataKey="unique_visitors"
                        name={T.UNIQUE}
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
                <CardTitle>{T.PAGE_DETAILS}</CardTitle>
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
                            {T.PAGE_COL}
                          </th>
                          <th className="text-right py-2 font-medium">
                            {T.VIEWS_SHORT}
                          </th>
                          <th className="text-right py-2 font-medium">
                            {T.UNIQUE_SHORT}
                          </th>
                          <th className="text-right py-2 font-medium">
                            {T.AVG_TIME_SHORT}
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
                title={T.ARTICLES_TITLE}
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
                            {T.ARTICLE_COL}
                          </th>
                          <th className="text-right py-2 font-medium">
                            {T.TOTAL}
                          </th>
                          <th className="text-right py-2 font-medium">
                            {T.UNIQUE_SHORT}
                          </th>
                          <th className="text-right py-2 font-medium">
                            {T.CONV_SHORT}
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
                <CardTitle>{T.VIEWS_BY_ARTICLES}</CardTitle>
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
                            name={T.VIEWS}
                            fill="#3b82f6"
                            radius={[0, 4, 4, 0]}
                          />
                          <Bar
                            dataKey="unique_visitors"
                            name={T.UNIQUE}
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
                title={T.LINKS_TITLE}
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
                            {T.ARTICLE_COL}
                          </th>
                          <th className="text-right py-2 font-medium text-blue-500">
                            {T.BUTTON}
                            <br />
                            {T.BUTTON_TOTAL}
                          </th>
                          <th className="text-right py-2 font-medium text-muted-foreground">
                            {T.UNIQ_SHORT}
                          </th>
                          <th className="text-right py-2 font-medium text-green-500">
                            {T.TEXT}
                            <br />
                            {T.BUTTON_TOTAL}
                          </th>
                          <th className="text-right py-2 font-medium text-muted-foreground">
                            {T.UNIQ_SHORT}
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
                        {T.BUTTON_PROVIDER}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <div className="w-3 h-3 rounded-sm bg-green-500" />
                        {T.LINK_FROM_TEXT}
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>{T.CLICKS_BY_ARTICLES}</CardTitle>
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
                            name={T.BUTTON}
                            fill="#3b82f6"
                            radius={[0, 4, 4, 0]}
                          />
                          <Bar
                            dataKey="text_clicks_total"
                            name={T.TEXT}
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
