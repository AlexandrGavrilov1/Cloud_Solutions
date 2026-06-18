ALTER TABLE t_p17567802_yura_website_replica.vpn_posts
    ADD COLUMN IF NOT EXISTS title          TEXT,
    ADD COLUMN IF NOT EXISTS excerpt        TEXT,
    ADD COLUMN IF NOT EXISTS content        TEXT,
    ADD COLUMN IF NOT EXISTS author         TEXT,
    ADD COLUMN IF NOT EXISTS date           TEXT,
    ADD COLUMN IF NOT EXISTS date_published TEXT,
    ADD COLUMN IF NOT EXISTS date_modified  TEXT,
    ADD COLUMN IF NOT EXISTS read_time      TEXT,
    ADD COLUMN IF NOT EXISTS category       TEXT,
    ADD COLUMN IF NOT EXISTS tags           TEXT,
    ADD COLUMN IF NOT EXISTS image          TEXT,
    ADD COLUMN IF NOT EXISTS provider_url   TEXT,
    ADD COLUMN IF NOT EXISTS updated_at     TIMESTAMPTZ DEFAULT NOW();
