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

// в”Ђв”Ђ Р¦РІРµС‚Р° в”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђ

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
  "РЇРЅРґРµРєСЃ В· СЂРµРєР»Р°РјР°": "#f59e0b",
  "РЇРЅРґРµРєСЃ В· РѕСЂРіР°РЅРёРєР°": "#10b981",
  "Р’РЅСѓС‚СЂРµРЅРЅРёР№": "#06b6d4",
  "РџСЂСЏРјРѕР№": "#8b8fa8",
};
function sourceColor(name: string, idx: number): string {
  return SOURCE_COLORS[name] ?? COLORS[idx % COLORS.length];
}

// в”Ђв”Ђ РҐРµР»РїРµСЂС‹ в”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђ

function dur(seconds: number | null | undefined): string {
  if (seconds == null) return "вЂ”";
  const s = Math.round(Number(seconds));
  if (s < 60) return `${s}СЃ`;
  return `${Math.floor(s / 60)}Рј ${s % 60}СЃ`;
}

function pct(n: number | null | undefined): string {
  if (n == null) return "вЂ”";
  return (Number(n) * 100).toFixed(1) + "%";
}

// в”Ђв”Ђ Loader в”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђ

function Loader() {
  return (
    <div className="flex justify-center py-12">
      <Icon name="Loader2" size={32} className="animate-spin text-primary" />
    </div>
  );
}

function Empty({
  text = "РќРµС‚ РґР°РЅРЅС‹С… Р·Р° РІС‹Р±СЂР°РЅРЅС‹Р№ РїРµСЂРёРѕРґ",
}: {
  text?: string;
}) {
  return <p className="text-center text-muted-foreground py-12">{text}</p>;
}

// в”Ђв”Ђ Р—Р°РіРѕР»РѕРІРѕРє РєР°СЂС‚РѕС‡РєРё СЃ РєРЅРѕРїРєР°РјРё в”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђ

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

// в”Ђв”Ђ РћСЃРЅРѕРІРЅРѕР№ РєРѕРјРїРѕРЅРµРЅС‚ в”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђ

export const EventsStatsSection = () => {
  const [period, setPeriod] = useState<"1" | "7" | "30">("30");
  const [selectedEventTypes, setSelectedEventTypes] = useState<string[]>([
    "page_views",
    "provider_clicks",
  ]);

  // в”Ђв”Ђ Р”Р°РЅРЅС‹Рµ в”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђ
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

  // в”Ђв”Ђ Р—Р°РіСЂСѓР·РёС‚СЊ РІСЃС‘ в”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђ
  const loadAll = useCallback(() => {
    summary.refetch();
    timeline.refetch();
    pages.refetch();
    articles.refetch();
    sessions.refetch();
    sources.refetch();
    linkClicks.refetch();
  }, [summary, timeline, pages, articles, sessions, sources, linkClicks]);

  // в”Ђв”Ђ Р”Р°РЅРЅС‹Рµ РґР»СЏ РёСЃС‚РѕС‡РЅРёРєРѕРІ С‚СЂР°С„РёРєР° (donut) в”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђ
  const sourcesData = (sources.data?.sources ?? []).map(
    (s: SourceStat, i: number) => ({
      name: s.source,
      value: s.visitors,
      color: sourceColor(s.source, i),
    }),
  );

  return (
    <div className="space-y-6">
      {/* в”Ђв”Ђ РЁР°РїРєР° в”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђ */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-border px-4 py-4 flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-2xl font-bold">
          РђРЅР°Р»РёС‚РёРєР° СЃРѕР±С‹С‚РёР№
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
            РћР±РЅРѕРІРёС‚СЊ РІСЃС‘
          </Button>
        </div>
      </div>

      {/* в”Ђв”Ђ РћС€РёР±РєРё в”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђ */}
      {summary.error && (
        <Alert variant="destructive">
          <AlertDescription>
            {(summary.error as Error).message}
          </AlertDescription>
        </Alert>
      )}

      {/* в”Ђв”Ђ РњРµС‚СЂРёРєРё в”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђ */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          label="РЈРЅРёРєР°Р»СЊРЅС‹С… РїРѕСЃРµС‚РёС‚РµР»РµР№"
          value={summary.data?.unique_visitors ?? "вЂ”"}
          icon={<Icon name="Users" size={20} />}
          loading={summary.isFetching}
        />
        <MetricCard
          label="РЎРµСЃСЃРёР№"
          value={summary.data?.sessions ?? "вЂ”"}
          icon={<Icon name="Layers" size={20} />}
          loading={summary.isFetching}
        />
        <MetricCard
          label="РџСЂРѕСЃРјРѕС‚СЂРѕРІ СЃС‚СЂР°РЅРёС†"
          value={summary.data?.page_views ?? "вЂ”"}
          icon={<Icon name="Eye" size={20} />}
          loading={summary.isFetching}
        />
        <MetricCard
          label="РљР»РёРєРѕРІ РїРѕ РїСЂРѕРІР°Р№РґРµСЂР°Рј"
          value={summary.data?.provider_clicks ?? "вЂ”"}
          icon={<Icon name="MousePointerClick" size={20} />}
          loading={summary.isFetching}
        />
        <MetricCard
          label="Р’РЅРµС€РЅРёС… РїРµСЂРµС…РѕРґРѕРІ"
          value={summary.data?.outbound_clicks ?? "вЂ”"}
          icon={<Icon name="ExternalLink" size={20} />}
          loading={summary.isFetching}
        />
        <MetricCard
          label="РЎСЂ. РІСЂРµРјСЏ РЅР° СЃС‚СЂР°РЅРёС†Рµ"
          value={dur(summary.data?.avg_duration)}
          icon={<Icon name="Clock" size={20} />}
          loading={summary.isFetching}
        />
        <MetricCard
          label="РџСЂРѕС†РµРЅС‚ РѕС‚РєР°Р·РѕРІ"
          value={pct(summary.data?.bounce_rate)}
          icon={<Icon name="TrendingDown" size={20} />}
          loading={summary.isFetching}
        />
      </div>

      {/* в”Ђв”Ђ Р’РєР»Р°РґРєРё в”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђ */}
      <Tabs defaultValue="timeline" className="space-y-4">
        <TabsList className="flex-wrap h-auto">
          <TabsTrigger value="timeline">Р”РёРЅР°РјРёРєР°</TabsTrigger>
          <TabsTrigger value="sources">РСЃС‚РѕС‡РЅРёРєРё</TabsTrigger>
          <TabsTrigger value="pages">РЎС‚СЂР°РЅРёС†С‹</TabsTrigger>
          <TabsTrigger value="articles">РЎС‚Р°С‚СЊРё</TabsTrigger>
          <TabsTrigger value="links">РџРµСЂРµС…РѕРґС‹</TabsTrigger>
          <TabsTrigger value="sessions">РЎРµСЃСЃРёРё</TabsTrigger>
        </TabsList>

        {/* в”Ђв”Ђ Timeline в”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђ */}
        <TabsContent value="timeline">
          <Card>
            <TabCardHeader
              title="Р”РёРЅР°РјРёРєР° СЃРѕР±С‹С‚РёР№ РїРѕ РґРЅСЏРј"
              onRefresh={() => timeline.refetch()}
              isRefreshing={timeline.isFetching}
              csvData={timeline.data?.timeline ?? []}
              csvFilename={`timeline_${period}`}
              csvColumns={[
                { key: "date", label: "Р”Р°С‚Р°" },
                { key: "page_views", label: "РџСЂРѕСЃРјРѕС‚СЂС‹" },
                {
                  key: "section_visits",
                  label: "Р’РёР·РёС‚С‹ СЂР°Р·РґРµР»РѕРІ",
                },
                {
                  key: "provider_clicks",
                  label: "РљР»РёРєРё РїСЂРѕРІР°Р№РґРµСЂРѕРІ",
                },
                {
                  key: "outbound_clicks",
                  label: "Р’РЅРµС€РЅРёРµ СЃСЃС‹Р»РєРё",
                },
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
                      label: "РџСЂРѕСЃРјРѕС‚СЂС‹",
                      color: "#3b82f6",
                    },
                    {
                      value: "section_visits",
                      label: "Р’РёР·РёС‚С‹ СЂР°Р·РґРµР»РѕРІ",
                      color: "#8b5cf6",
                    },
                    {
                      value: "provider_clicks",
                      label: "РљР»РёРєРё РїСЂРѕРІР°Р№РґРµСЂРѕРІ",
                      color: "#10b981",
                    },
                    {
                      value: "outbound_clicks",
                      label: "Р’РЅРµС€РЅРёРµ СЃСЃС‹Р»РєРё",
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
                        name="РџСЂРѕСЃРјРѕС‚СЂС‹"
                        dot={false}
                        strokeWidth={2}
                      />
                    )}
                    {selectedEventTypes.includes("section_visits") && (
                      <Line
                        type="monotone"
                        dataKey="section_visits"
                        stroke="#8b5cf6"
                        name="Р’РёР·РёС‚С‹ СЂР°Р·РґРµР»РѕРІ"
                        dot={false}
                        strokeWidth={2}
                      />
                    )}
                    {selectedEventTypes.includes("provider_clicks") && (
                      <Line
                        type="monotone"
                        dataKey="provider_clicks"
                        stroke="#10b981"
                        name="РљР»РёРєРё РїСЂРѕРІР°Р№РґРµСЂРѕРІ"
                        dot={false}
                        strokeWidth={2}
                      />
                    )}
                    {selectedEventTypes.includes("outbound_clicks") && (
                      <Line
                        type="monotone"
                        dataKey="outbound_clicks"
                        stroke="#f59e0b"
                        name="Р’РЅРµС€РЅРёРµ СЃСЃС‹Р»РєРё"
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

        {/* в”Ђв”Ђ Sources в”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђ */}
        <TabsContent value="sources">
          <div className="grid gap-4 lg:grid-cols-2">
            {/* Donut chart */}
            <Card>
              <TabCardHeader
                title="РСЃС‚РѕС‡РЅРёРєРё С‚СЂР°С„РёРєР°"
                onRefresh={() => sources.refetch()}
                isRefreshing={sources.isFetching}
                csvData={sources.data?.sources ?? []}
                csvFilename={`sources_${period}`}
                csvColumns={[
                  { key: "source", label: "РСЃС‚РѕС‡РЅРёРє" },
                  { key: "visitors", label: "РџРѕСЃРµС‚РёС‚РµР»Рё" },
                  { key: "sessions", label: "РЎРµСЃСЃРёРё" },
                  { key: "page_views", label: "РџСЂРѕСЃРјРѕС‚СЂС‹" },
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
                        <Tooltip
                          formatter={(v: any) => [
                            `${v} РїРѕСЃРµС‚РёС‚РµР»РµР№`,
                            "",
                          ]}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                    {/* Р›РµРіРµРЅРґР° */}
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
                                <span className="text-foreground">
                                  {s.source}
                                </span>
                              </div>
                              <div className="flex gap-4 text-muted-foreground">
                                <span>{share}%</span>
                                <span>{s.visitors} РїРѕСЃ.</span>
                                <span>{s.page_views} РїСЂ.</span>
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

            {/* Bar chart РїРѕ РёСЃС‚РѕС‡РЅРёРєР°Рј */}
            <Card>
              <CardHeader>
                <CardTitle>
                  РџРѕСЃРµС‚РёС‚РµР»Рё РїРѕ РёСЃС‚РѕС‡РЅРёРєСѓ
                </CardTitle>
              </CardHeader>
              <CardContent>
                {sources.data && sourcesData.length > 0 && (
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={sources.data.sources} layout="vertical">
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
                        name="РџРѕСЃРµС‚РёС‚РµР»Рё"
                        radius={[0, 4, 4, 0]}
                      >
                        {(sources.data.sources as SourceStat[]).map(
                          (_: SourceStat, i: number) => (
                            <Cell key={i} fill={sourceColor(_.source, i)} />
                          ),
                        )}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                )}
                {sources.isFetching && !sources.data && <Loader />}
                {sources.data && sourcesData.length === 0 && <Empty />}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* в”Ђв”Ђ Pages в”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђ */}
        <TabsContent value="pages">
          <div className="grid gap-4 lg:grid-cols-2">
            {/* Bar chart */}
            <Card>
              <TabCardHeader
                title="РўРѕРї СЃС‚СЂР°РЅРёС†"
                onRefresh={() => pages.refetch()}
                isRefreshing={pages.isFetching}
                csvData={pages.data?.pages ?? []}
                csvFilename={`pages_${period}`}
                csvColumns={[
                  { key: "provider_name", label: "РџСЂРѕРІР°Р№РґРµСЂ" },
                  { key: "page_path", label: "URL" },
                  { key: "views", label: "РџСЂРѕСЃРјРѕС‚СЂС‹" },
                  { key: "unique_visitors", label: "РЈРЅРёРєР°Р»СЊРЅС‹Рµ" },
                  { key: "avg_duration", label: "РЎСЂ. РІСЂРµРјСЏ (СЃРµРє)" },
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
                      <Tooltip
                        formatter={(v: any, name: string) => [
                          v,
                          name === "views"
                            ? "РџСЂРѕСЃРјРѕС‚СЂС‹"
                            : "РЈРЅРёРєР°Р»СЊРЅС‹Рµ",
                        ]}
                      />
                      <Legend />
                      <Bar
                        dataKey="views"
                        name="РџСЂРѕСЃРјРѕС‚СЂС‹"
                        fill="#3b82f6"
                        radius={[0, 4, 4, 0]}
                      />
                      <Bar
                        dataKey="unique_visitors"
                        name="РЈРЅРёРєР°Р»СЊРЅС‹Рµ"
                        fill="#10b981"
                        radius={[0, 4, 4, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>

            {/* РўР°Р±Р»РёС†Р° СЃ avg_duration */}
            <Card>
              <CardHeader>
                <CardTitle>Р”РµС‚Р°Р»Рё РїРѕ СЃС‚СЂР°РЅРёС†Р°Рј</CardTitle>
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
                            РЎС‚СЂР°РЅРёС†Р°
                          </th>
                          <th className="text-right py-2 font-medium">
                            РџСЂРѕСЃРј.
                          </th>
                          <th className="text-right py-2 font-medium">
                            РЈРЅРёРє.
                          </th>
                          <th className="text-right py-2 font-medium">
                            РЎСЂ. РІСЂРµРјСЏ
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

        {/* в”Ђв”Ђ Articles в”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђ */}
        <TabsContent value="articles">
          <div className="grid gap-4 lg:grid-cols-2">
            {/* РўР°Р±Р»РёС†Р° */}
            <Card>
              <TabCardHeader
                title="РЎС‚Р°С‚СЊРё В· РїСЂРѕСЃРјРѕС‚СЂС‹ Рё РєРѕРЅРІРµСЂСЃРёСЏ"
                onRefresh={() => articles.refetch()}
                isRefreshing={articles.isFetching}
                csvData={articles.data?.articles ?? []}
                csvFilename={`articles_${period}`}
                csvColumns={[
                  { key: "provider_name", label: "РџСЂРѕРІР°Р№РґРµСЂ" },
                  { key: "views", label: "РџСЂРѕСЃРјРѕС‚СЂС‹" },
                  { key: "unique_visitors", label: "РЈРЅРёРєР°Р»СЊРЅС‹Рµ" },
                  { key: "clicks", label: "РљР»РёРєРё" },
                  { key: "conversion_rate", label: "РљРѕРЅРІРµСЂСЃРёСЏ (%)" },
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
                            РЎС‚Р°С‚СЊСЏ
                          </th>
                          <th className="text-right py-2 font-medium">
                            Р’СЃРµРіРѕ
                          </th>
                          <th className="text-right py-2 font-medium">
                            РЈРЅРёРє.
                          </th>
                          <th className="text-right py-2 font-medium">
                            РљРѕРЅРІ.
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
                                  : "вЂ”"}
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Bar chart РїСЂРѕСЃРјРѕС‚СЂС‹ vs СѓРЅРёРєР°Р»СЊРЅС‹Рµ */}
            <Card>
              <CardHeader>
                <CardTitle>РџСЂРѕСЃРјРѕС‚СЂС‹ РїРѕ СЃС‚Р°С‚СЊСЏРј</CardTitle>
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
                            name="РџСЂРѕСЃРјРѕС‚СЂС‹"
                            fill="#3b82f6"
                            radius={[0, 4, 4, 0]}
                          />
                          <Bar
                            dataKey="unique_visitors"
                            name="РЈРЅРёРєР°Р»СЊРЅС‹Рµ"
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

        {/* в”Ђв”Ђ Link clicks в”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђ */}
        <TabsContent value="links">
          <div className="grid gap-4 lg:grid-cols-2">
            {/* РўР°Р±Р»РёС†Р° */}
            <Card>
              <TabCardHeader
                title="РџРµСЂРµС…РѕРґС‹ РїРѕ СЃСЃС‹Р»РєР°Рј РёР· СЃС‚Р°С‚РµР№"
                onRefresh={() => linkClicks.refetch()}
                isRefreshing={linkClicks.isFetching}
                csvData={linkClicks.data?.link_clicks ?? []}
                csvFilename={`link_clicks_${period}`}
                csvColumns={[
                  { key: "provider_name", label: "РџСЂРѕРІР°Р№РґРµСЂ" },
                  {
                    key: "button_clicks_total",
                    label: "РљРЅРѕРїРєР° РІСЃРµРіРѕ",
                  },
                  {
                    key: "button_clicks_unique",
                    label: "РљРЅРѕРїРєР° СѓРЅРёРє.",
                  },
                  { key: "text_clicks_total", label: "РўРµРєСЃС‚ РІСЃРµРіРѕ" },
                  { key: "text_clicks_unique", label: "РўРµРєСЃС‚ СѓРЅРёРє." },
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
                            РЎС‚Р°С‚СЊСЏ
                          </th>
                          <th
                            className="text-right py-2 font-medium"
                            style={{ color: "#3b82f6" }}
                          >
                            РљРЅРѕРїРєР°
                            <br />
                            РІСЃРµРіРѕ
                          </th>
                          <th className="text-right py-2 font-medium text-muted-foreground">
                            СѓРЅРёРє.
                          </th>
                          <th
                            className="text-right py-2 font-medium"
                            style={{ color: "#10b981" }}
                          >
                            РўРµРєСЃС‚
                            <br />
                            РІСЃРµРіРѕ
                          </th>
                          <th className="text-right py-2 font-medium text-muted-foreground">
                            СѓРЅРёРє.
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
                    {/* Р›РµРіРµРЅРґР° */}
                    <div className="flex gap-4 mt-3 pt-3 border-t">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <div className="w-3 h-3 rounded-sm bg-blue-500" />
                        РєРЅРѕРїРєР° РїСЂРѕРІР°Р№РґРµСЂР°
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <div className="w-3 h-3 rounded-sm bg-green-500" />
                        СЃСЃС‹Р»РєР° РёР· С‚РµРєСЃС‚Р°
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Grouped bar chart */}
            <Card>
              <CardHeader>
                <CardTitle>РљР»РёРєРё РїРѕ СЃС‚Р°С‚СЊСЏРј</CardTitle>
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
                            name="РљРЅРѕРїРєР°"
                            fill="#3b82f6"
                            radius={[0, 4, 4, 0]}
                          />
                          <Bar
                            dataKey="text_clicks_total"
                            name="РўРµРєСЃС‚"
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

        {/* в”Ђв”Ђ Sessions в”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђ */}
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
