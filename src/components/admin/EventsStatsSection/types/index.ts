export type Period = "1" | "7" | "30";

export interface SummaryData {
  unique_visitors: number;
  sessions: number;
  page_views: number;
  provider_clicks: number;
  outbound_clicks: number;
  avg_duration: number | null;
  bounce_rate: number | null;
}

export interface TimelineItem {
  date: string;
  page_views: number;
  section_visits: number;
  provider_clicks: number;
  outbound_clicks: number;
}

export interface PageStat {
  page_path: string;
  provider_name: string | null;
  views: number;
  unique_visitors: number;
  avg_duration: number | null;
}

export interface ArticleStat {
  target_id: string;
  provider_name: string | null;
  views: number;
  unique_visitors: number;
  clicks: number;
  conversion_rate: number | null;
}

export interface SessionInfo {
  session_id: string;
  visitor_uuid: string;
  started_at: string;
  last_event_at: string;
  events_count: number;
  page_views: number;
  provider_clicks: number;
  page_paths: string[];
}

export interface SourceStat {
  source: string;
  visitors: number;
  sessions: number;
  page_views: number;
}

export interface LinkClickStat {
  page_path: string;
  provider_name: string | null;
  button_clicks_total: number;
  button_clicks_unique: number;
  text_clicks_total: number;
  text_clicks_unique: number;
}
