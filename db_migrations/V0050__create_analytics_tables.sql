CREATE TABLE IF NOT EXISTS t_p17567802_yura_website_replica.events (
    id            BIGSERIAL PRIMARY KEY,
    event_type    TEXT NOT NULL,
    target_id     TEXT,
    source        TEXT,
    page_path     TEXT,
    visitor_agent TEXT,
    referer       TEXT,
    session_id    TEXT,
    utm_source    TEXT,
    utm_medium    TEXT,
    utm_campaign  TEXT,
    utm_term      TEXT,
    utm_content   TEXT,
    visitor_uuid  TEXT,
    visitor_ip    TEXT,
    duration      INTEGER,
    created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_events_created_at  ON t_p17567802_yura_website_replica.events (created_at);
CREATE INDEX IF NOT EXISTS idx_events_event_type  ON t_p17567802_yura_website_replica.events (event_type);
CREATE INDEX IF NOT EXISTS idx_events_session_id  ON t_p17567802_yura_website_replica.events (session_id);
CREATE INDEX IF NOT EXISTS idx_events_visitor     ON t_p17567802_yura_website_replica.events (visitor_uuid);
CREATE INDEX IF NOT EXISTS idx_events_page_path   ON t_p17567802_yura_website_replica.events (page_path);

CREATE TABLE IF NOT EXISTS t_p17567802_yura_website_replica.vpn_posts (
    id            BIGSERIAL PRIMARY KEY,
    slug          TEXT UNIQUE NOT NULL,
    provider_name TEXT,
    views         INTEGER NOT NULL DEFAULT 0
);
