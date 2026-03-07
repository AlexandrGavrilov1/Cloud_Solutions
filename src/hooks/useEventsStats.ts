import { useQuery } from '@tanstack/react-query';
import { SummaryData, TimelineItem, PageStat, ArticleStat, SessionInfo } from '@/components/admin/EventsStatsSection/types';

const API_BASE = 'https://functions.poehali.dev/events-stats';

// Базовый fetcher
async function fetcher<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) {
    const error = await res.text();
    throw new Error(`Ошибка ${res.status}: ${error}`);
  }
  return res.json();
}

// Хуки
export const useSummary = (period: string, month?: string) => {
  const url = month
    ? `${API_BASE}?view=summary&month=${month}`
    : `${API_BASE}?view=summary&period=${period}`;
  return useQuery<SummaryData>({
    queryKey: ['events-summary', period, month],
    queryFn: () => fetcher<SummaryData>(url),
    enabled: false, // не загружаем автоматически
  });
};

export const useTimeline = (period: string, month?: string) => {
  const url = month
    ? `${API_BASE}?view=timeline&month=${month}`
    : `${API_BASE}?view=timeline&period=${period}`;
  return useQuery<{ timeline: TimelineItem[] }>({
    queryKey: ['events-timeline', period, month],
    queryFn: () => fetcher(url),
    enabled: false,
  });
};

export const useTopPages = (period: string, month?: string) => {
  const url = month
    ? `${API_BASE}?view=pages&month=${month}`
    : `${API_BASE}?view=pages&period=${period}`;
  return useQuery<{ pages: PageStat[] }>({
    queryKey: ['events-pages', period, month],
    queryFn: () => fetcher(url),
    enabled: false,
  });
};

export const useTopArticles = (period: string, month?: string) => {
  const url = month
    ? `${API_BASE}?view=articles&month=${month}`
    : `${API_BASE}?view=articles&period=${period}`;
  return useQuery<{ articles: ArticleStat[] }>({
    queryKey: ['events-articles', period, month],
    queryFn: () => fetcher(url),
    enabled: false,
  });
};

export const useSessions = (period: string, month?: string) => {
  const url = month
    ? `${API_BASE}?view=sessions&month=${month}`
    : `${API_BASE}?view=sessions&period=${period}`;
  return useQuery<{ sessions: SessionInfo[] }>({
    queryKey: ['events-sessions', period, month],
    queryFn: () => fetcher(url),
    enabled: false,
  });
};
