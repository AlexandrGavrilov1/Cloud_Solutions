-- Таблица для всех событий (просмотры страниц, клики по провайдерам и т.д.)
CREATE TABLE IF NOT EXISTS t_p4153566_vds_rating_portal.events (
    id SERIAL PRIMARY KEY,
    event_type VARCHAR(50) NOT NULL,
    target_id VARCHAR(255) NOT NULL,
    source VARCHAR(50),
    visitor_uuid VARCHAR(36),
    visitor_ip VARCHAR(45) NOT NULL,
    visitor_agent TEXT,
    page_path VARCHAR(255),
    referer VARCHAR(512),
    session_id VARCHAR(36),
    utm_source VARCHAR(255),
    utm_medium VARCHAR(255),
    utm_campaign VARCHAR(255),
    utm_term VARCHAR(255),
    utm_content VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_events_type_target ON t_p4153566_vds_rating_portal.events(event_type, target_id);
CREATE INDEX IF NOT EXISTS idx_events_visitor ON t_p4153566_vds_rating_portal.events(visitor_uuid) WHERE visitor_uuid IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_events_ip ON t_p4153566_vds_rating_portal.events(visitor_ip);
CREATE INDEX IF NOT EXISTS idx_events_session ON t_p4153566_vds_rating_portal.events(session_id);
CREATE INDEX IF NOT EXISTS idx_events_created ON t_p4153566_vds_rating_portal.events(created_at);