import { useQuery } from "@tanstack/react-query";
import {
  SummaryData,
  TimelineItem,
  PageStat,
  ArticleStat,
  SessionInfo,
  SourceStat,
  LinkClickStat,
} from "@/components/admin/EventsStatsSection/types";

const API_BASE =
  "https://functions.poehali.dev/bcbb37e2-e9c5-4343-b080-b99acbe027db";

// ── Fetcher ──────────────────────────────────────────────────────────────────

async function fetcher<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) {
    const error = await res.text();
    throw new Error(`Ошибка ${res.status}: ${error}`);
  }
  return res.json();
}

function buildUrl(view: string, period: string, month?: string): string {
  if (month) return `${API_BASE}?view=${view}&month=${month}`;
  return `${API_BASE}?view=${view}&period=${period}`;
}

// ── Хуки ─────────────────────────────────────────────────────────────────────

export const useSummary = (period: string, month?: string) => {
  return useQuery<SummaryData>({
    queryKey: ["events-summary", period, month],
    queryFn: () => fetcher<SummaryData>(buildUrl("summary", period, month)),
    enabled: false,
  });
};

export const useTimeline = (period: string, month?: string) => {
  return useQuery<{ timeline: TimelineItem[] }>({
    queryKey: ["events-timeline", period, month],
    queryFn: () =>
      fetcher<{ timeline: TimelineItem[] }>(
        buildUrl("timeline", period, month),
      ),
    enabled: false,
  });
};

export const useTopPages = (period: string, month?: string) => {
  return useQuery<{ pages: PageStat[] }>({
    queryKey: ["events-pages", period, month],
    queryFn: () =>
      fetcher<{ pages: PageStat[] }>(buildUrl("pages", period, month)),
    enabled: false,
  });
};

export const useTopArticles = (period: string, month?: string) => {
  return useQuery<{ articles: ArticleStat[] }>({
    queryKey: ["events-articles", period, month],
    queryFn: () =>
      fetcher<{ articles: ArticleStat[] }>(buildUrl("articles", period, month)),
    enabled: false,
  });
};

export const useSessions = (period: string, month?: string) => {
  return useQuery<{ sessions: SessionInfo[] }>({
    queryKey: ["events-sessions", period, month],
    queryFn: () =>
      fetcher<{ sessions: SessionInfo[] }>(buildUrl("sessions", period, month)),
    enabled: false,
  });
};

export const useSources = (period: string, month?: string) => {
  return useQuery<{ sources: SourceStat[] }>({
    queryKey: ["events-sources", period, month],
    queryFn: () =>
      fetcher<{ sources: SourceStat[] }>(buildUrl("sources", period, month)),
    enabled: false,
  });
};

export const useLinkClicks = (period: string, month?: string) => {
  return useQuery<{ link_clicks: LinkClickStat[] }>({
    queryKey: ["events-link-clicks", period, month],
    queryFn: () =>
      fetcher<{ link_clicks: LinkClickStat[] }>(
        buildUrl("link_clicks", period, month),
      ),
    enabled: false,
  });
};