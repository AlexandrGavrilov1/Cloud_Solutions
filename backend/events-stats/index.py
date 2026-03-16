import json
import os
from decimal import Decimal
import psycopg2
from psycopg2.extras import RealDictCursor

SCHEMA = 't_p4153566_vds_rating_portal'


def cors_response(status_code, body):
    return {
        'statusCode': status_code,
        'headers': {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, X-Auth-Token',
            'Content-Type': 'application/json'
        },
        'body': json.dumps(body, default=str),
        'isBase64Encoded': False
    }


def error_response(status_code, message):
    return cors_response(status_code, {'error': message})


def normalize_decimals(row):
    """Преобразует Decimal → float для JSON-сериализации."""
    result = {}
    for k, v in row.items():
        if isinstance(v, Decimal):
            result[k] = float(v)
        else:
            result[k] = v
    return result


def handler(event, context):
    method = event.get('httpMethod', 'GET')

    if method == 'OPTIONS':
        return cors_response(200, {})

    dsn = os.environ.get('DATABASE_URL')
    if not dsn:
        return error_response(500, 'Database connection not configured')

    conn = psycopg2.connect(dsn)

    if method == 'GET':
        params = event.get('queryStringParameters') or {}
        view   = params.get('view', 'summary')
        period = params.get('period', '30')   # число дней
        month  = params.get('month')           # YYYY-MM

        with conn.cursor(cursor_factory=RealDictCursor) as cur:

            # ── Фильтр по дате ──────────────────────────────────────────────
            if month:
                date_filter = "AND TO_CHAR(created_at, 'YYYY-MM') = %s"
                date_param  = month
            elif period and period.isdigit():
                date_filter = "AND created_at >= CURRENT_DATE - %s"
                date_param  = int(period)
            else:
                date_filter = "AND created_at >= CURRENT_DATE - 30"
                date_param  = None

            # ── summary ─────────────────────────────────────────────────────
            if view == 'summary':
                query = f"""
                    SELECT
                        COUNT(DISTINCT visitor_uuid) AS unique_visitors,
                        COUNT(DISTINCT session_id)   AS sessions,
                        COUNT(*) FILTER (WHERE event_type IN ('page_view', 'section_visit')) AS page_views,
                        COUNT(*) FILTER (WHERE event_type = 'provider_click')  AS provider_clicks,
                        COUNT(*) FILTER (WHERE event_type = 'outbound_link')   AS outbound_clicks,
                        AVG(duration) FILTER (
                            WHERE event_type = 'page_leave' AND duration IS NOT NULL
                        ) AS avg_duration,
                        (
                            SELECT COUNT(*)
                            FROM (
                                SELECT session_id
                                FROM {SCHEMA}.events
                                WHERE 1=1 {date_filter}
                                GROUP BY session_id
                                HAVING COUNT(*) = 1
                            ) AS bounces
                        ) * 1.0 / NULLIF(COUNT(DISTINCT session_id), 0) AS bounce_rate
                    FROM {SCHEMA}.events
                    WHERE 1=1 {date_filter}
                """
                params_list = [date_param, date_param] if date_param is not None else []
                cur.execute(query, params_list)
                row = cur.fetchone()
                return cors_response(200, normalize_decimals(row))

            # ── timeline ────────────────────────────────────────────────────
            elif view == 'timeline':
                query = f"""
                    SELECT
                        DATE(created_at) AS date,
                        COUNT(*) FILTER (WHERE event_type = 'page_view')       AS page_views,
                        COUNT(*) FILTER (WHERE event_type = 'section_visit')   AS section_visits,
                        COUNT(*) FILTER (WHERE event_type = 'provider_click')  AS provider_clicks,
                        COUNT(*) FILTER (WHERE event_type = 'outbound_link')   AS outbound_clicks
                    FROM {SCHEMA}.events
                    WHERE 1=1 {date_filter}
                    GROUP BY DATE(created_at)
                    ORDER BY date
                """
                params_list = [date_param] if date_param is not None else []
                cur.execute(query, params_list)
                rows = cur.fetchall()
                return cors_response(200, {'timeline': rows})

            # ── pages ───────────────────────────────────────────────────────
            elif view == 'pages':
                query = f"""
                    SELECT
                        e.page_path,
                        COALESCE(vp.provider_name, e.page_path) AS provider_name,
                        COUNT(*)                        AS views,
                        COUNT(DISTINCT e.visitor_uuid)  AS unique_visitors,
                        AVG(e.duration) FILTER (
                            WHERE e.event_type = 'page_leave' AND e.duration IS NOT NULL
                        ) AS avg_duration
                    FROM {SCHEMA}.events e
                    LEFT JOIN {SCHEMA}.vpn_posts vp
                        ON vp.slug = REGEXP_REPLACE(e.page_path, '^/vpn/', '')
                    WHERE e.event_type = 'page_view' {date_filter}
                    GROUP BY e.page_path, vp.provider_name
                    ORDER BY views DESC
                    LIMIT 50
                """
                params_list = [date_param] if date_param is not None else []
                cur.execute(query, params_list)
                rows = cur.fetchall()
                return cors_response(200, {'pages': [normalize_decimals(r) for r in rows]})

            # ── articles ────────────────────────────────────────────────────
            elif view == 'articles':
                query = f"""
                    WITH article_views AS (
                        SELECT
                            target_id,
                            COUNT(*)                       AS views,
                            COUNT(DISTINCT visitor_uuid)   AS unique_visitors
                        FROM {SCHEMA}.events
                        WHERE event_type = 'page_view'
                          AND target_id IS NOT NULL
                          {date_filter}
                        GROUP BY target_id
                    ),
                    article_clicks AS (
                        SELECT target_id, COUNT(*) AS clicks
                        FROM {SCHEMA}.events
                        WHERE event_type = 'provider_click'
                          AND page_path LIKE '/vpn/%%'
                          {date_filter}
                        GROUP BY target_id
                    )
                    SELECT
                        av.target_id,
                        COALESCE(vp.provider_name, av.target_id) AS provider_name,
                        av.views,
                        av.unique_visitors,
                        COALESCE(ac.clicks, 0) AS clicks,
                        ROUND(
                            COALESCE(ac.clicks, 0)::numeric / NULLIF(av.views, 0) * 100,
                            2
                        ) AS conversion_rate
                    FROM article_views av
                    LEFT JOIN article_clicks ac ON av.target_id = ac.target_id
                    LEFT JOIN {SCHEMA}.vpn_posts vp ON vp.slug = av.target_id
                    ORDER BY av.views DESC
                    LIMIT 50
                """
                params_list = [date_param, date_param] if date_param is not None else []
                cur.execute(query, params_list)
                rows = cur.fetchall()
                return cors_response(200, {'articles': [normalize_decimals(r) for r in rows]})

            # ── sessions ────────────────────────────────────────────────────
            elif view == 'sessions':
                query = f"""
                    WITH session_stats AS (
                        SELECT
                            session_id,
                            MIN(created_at)                                         AS started_at,
                            MAX(created_at)                                         AS last_event_at,
                            COUNT(*)                                                AS events_count,
                            COUNT(*) FILTER (WHERE event_type = 'page_view')       AS page_views,
                            COUNT(*) FILTER (WHERE event_type = 'provider_click')  AS provider_clicks,
                            ARRAY_AGG(DISTINCT page_path)                          AS page_paths,
                            MAX(visitor_uuid)                                       AS visitor_uuid
                        FROM {SCHEMA}.events
                        WHERE 1=1 {date_filter}
                        GROUP BY session_id
                    )
                    SELECT
                        session_id,
                        visitor_uuid,
                        started_at,
                        last_event_at,
                        events_count,
                        page_views,
                        provider_clicks,
                        page_paths
                    FROM session_stats
                    ORDER BY started_at DESC
                    LIMIT 100
                """
                params_list = [date_param] if date_param is not None else []
                cur.execute(query, params_list)
                rows = cur.fetchall()
                return cors_response(200, {'sessions': rows})

            # ── sources ─────────────────────────────────────────────────────
            elif view == 'sources':
                query = f"""
                    SELECT
                        CASE
                            WHEN utm_source = 'yandex' AND utm_medium = 'cpc'
                                THEN 'Яндекс · реклама'
                            WHEN (
                                    referer LIKE 'https://yandex.ru%%'
                                 OR referer LIKE 'https://www.yandex.ru%%'
                                )
                                AND utm_source IS NULL
                                THEN 'Яндекс · органика'
                            WHEN referer LIKE '%%topcloudhub.ru%%'
                                THEN 'Внутренний'
                            WHEN referer IS NULL AND utm_source IS NULL
                                THEN 'Прямой'
                            WHEN utm_source IS NOT NULL
                                THEN utm_source
                            ELSE
                                REGEXP_REPLACE(
                                    REGEXP_REPLACE(referer, '^https?://(www\.)?', ''),
                                    '/.*$', ''
                                )
                        END AS source,
                        COUNT(DISTINCT visitor_uuid) AS visitors,
                        COUNT(DISTINCT session_id)   AS sessions,
                        COUNT(*) FILTER (
                            WHERE event_type IN ('page_view', 'section_visit')
                        ) AS page_views
                    FROM {SCHEMA}.events
                    WHERE 1=1 {date_filter}
                    GROUP BY source
                    ORDER BY visitors DESC
                """
                params_list = [date_param] if date_param is not None else []
                cur.execute(query, params_list)
                rows = cur.fetchall()
                return cors_response(200, {'sources': rows})

            # ── link_clicks ─────────────────────────────────────────────────
            elif view == 'link_clicks':
                query = f"""
                    SELECT
                        e.page_path,
                        COALESCE(
                            vp.provider_name,
                            REGEXP_REPLACE(e.page_path, '^/vpn/', '')
                        ) AS provider_name,
                        COUNT(*) FILTER (
                            WHERE e.event_type = 'provider_click'
                              AND e.source = 'article_button'
                        ) AS button_clicks_total,
                        COUNT(DISTINCT e.visitor_uuid) FILTER (
                            WHERE e.event_type = 'provider_click'
                              AND e.source = 'article_button'
                        ) AS button_clicks_unique,
                        COUNT(*) FILTER (
                            WHERE e.event_type = 'outbound_link'
                              AND e.source = 'article_text'
                        ) AS text_clicks_total,
                        COUNT(DISTINCT e.visitor_uuid) FILTER (
                            WHERE e.event_type = 'outbound_link'
                              AND e.source = 'article_text'
                        ) AS text_clicks_unique
                    FROM {SCHEMA}.events e
                    LEFT JOIN {SCHEMA}.vpn_posts vp
                        ON vp.slug = REGEXP_REPLACE(e.page_path, '^/vpn/', '')
                    WHERE e.event_type IN ('provider_click', 'outbound_link')
                      AND e.page_path LIKE '/vpn/%%'
                      AND 1=1 {date_filter}
                    GROUP BY e.page_path, vp.provider_name
                    ORDER BY (
                        COUNT(*) FILTER (
                            WHERE e.event_type = 'provider_click' AND e.source = 'article_button'
                        ) +
                        COUNT(*) FILTER (
                            WHERE e.event_type = 'outbound_link' AND e.source = 'article_text'
                        )
                    ) DESC
                    LIMIT 50
                """
                params_list = [date_param] if date_param is not None else []
                cur.execute(query, params_list)
                rows = cur.fetchall()
                return cors_response(200, {'link_clicks': rows})

            else:
                return error_response(400, f"Unknown view: {view}")

    elif method == 'POST':
        return error_response(405, 'POST not implemented')

    return error_response(405, 'Method not allowed')