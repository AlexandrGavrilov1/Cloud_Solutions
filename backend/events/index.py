"""
Unified event tracking:
- Все события записываются в events.
- Для page_view проверяется уникальность (по visitor_uuid или visitor_ip) и при первом уникальном просмотре увеличивается счётчик в vpn_posts.
"""

import json
import os
import psycopg2
from psycopg2.extras import RealDictCursor

SCHEMA = 't_p4153566_vds_rating_portal'

def response(status_code, body):
    return {
        'statusCode': status_code,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, X-Visitor-ID',
        },
        'body': json.dumps(body, ensure_ascii=False, default=str),
        'isBase64Encoded': False
    }

def handler(event, context):
    method = event.get('httpMethod', 'GET')
    path = event.get('path', '').rstrip('/')

    # CORS preflight
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-Visitor-ID, Authorization, X-Authorization',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }

    dsn = os.environ.get('DATABASE_URL')
    if not dsn:
        return response(500, {'error': 'Database not configured'})

    conn = psycopg2.connect(dsn)

    # GET /count – получение уникальных просмотров (для аналитики)
    if method == 'GET' and (path == '/count' or path == ''):
        params = event.get('queryStringParameters', {}) or {}
        event_type = params.get('type')
        target_id = params.get('target')
        if not event_type or not target_id:
            conn.close()
            return response(400, {'error': 'type and target are required'})
        try:
            with conn.cursor() as cur:
                cur.execute("""
                    SELECT COUNT(*) FROM (
                        SELECT DISTINCT COALESCE(visitor_uuid, visitor_ip) as uniq
                        FROM {}.events
                        WHERE event_type = %s AND target_id = %s
                    ) t
                """.format(SCHEMA), (event_type, target_id))
                row = cur.fetchone()
                count = row[0] if row else 0
                return response(200, {'count': count})
        except Exception as e:
            return response(500, {'error': str(e)})
        finally:
            conn.close()

    # POST /event – запись события
    elif method == 'POST' and (path == '/event' or path == ''):
        try:
            body = json.loads(event.get('body', '{}'))
        except json.JSONDecodeError:
            conn.close()
            return response(400, {'error': 'Invalid JSON'})

        event_type = body.get('event_type')
        target_id = body.get('target_id')
        if not event_type or not target_id:
            conn.close()
            return response(400, {'error': 'event_type and target_id are required'})

        source = body.get('source')
        page_path = body.get('page_path')
        visitor_agent = body.get('visitor_agent')
        referer = body.get('referer')
        session_id = body.get('session_id')
        utm_source = body.get('utm_source')
        utm_medium = body.get('utm_medium')
        utm_campaign = body.get('utm_campaign')
        utm_term = body.get('utm_term')
        utm_content = body.get('utm_content')

        headers = event.get('headers', {})
        visitor_uuid = headers.get('X-Visitor-ID')

        visitor_ip = (
            headers.get('X-Forwarded-For', '').split(',')[0].strip() or
            headers.get('x-forwarded-for', '').split(',')[0].strip() or
            headers.get('X-Real-IP', '') or
            headers.get('x-real-ip', '') or
            event.get('requestContext', {}).get('identity', {}).get('sourceIp', 'unknown')
        )

        if not visitor_agent:
            visitor_agent = headers.get('User-Agent') or headers.get('user-agent')

        try:
            with conn.cursor() as cur:
                # Всегда вставляем запись в events (даже для повторных просмотров)
                if visitor_uuid:
                    cur.execute("""
                        INSERT INTO {}.events (
                            event_type, target_id, source, page_path, visitor_agent,
                            referer, session_id, utm_source, utm_medium, utm_campaign,
                            utm_term, utm_content, visitor_uuid, visitor_ip
                        ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                    """.format(SCHEMA), (
                        event_type, target_id, source, page_path, visitor_agent,
                        referer, session_id, utm_source, utm_medium, utm_campaign,
                        utm_term, utm_content, visitor_uuid, visitor_ip
                    ))
                else:
                    cur.execute("""
                        INSERT INTO {}.events (
                            event_type, target_id, source, page_path, visitor_agent,
                            referer, session_id, utm_source, utm_medium, utm_campaign,
                            utm_term, utm_content, visitor_ip
                        ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                    """.format(SCHEMA), (
                        event_type, target_id, source, page_path, visitor_agent,
                        referer, session_id, utm_source, utm_medium, utm_campaign,
                        utm_term, utm_content, visitor_ip
                    ))

                # Для просмотра статьи дополнительно проверяем уникальность
                if event_type == 'page_view':
                    # Проверяем, был ли уже уникальный просмотр от этого посетителя
                    if visitor_uuid:
                        cur.execute("""
                            SELECT id FROM {}.events
                            WHERE event_type = 'page_view' AND target_id = %s AND visitor_uuid = %s
                            LIMIT 1
                        """.format(SCHEMA), (target_id, visitor_uuid))
                    else:
                        cur.execute("""
                            SELECT id FROM {}.events
                            WHERE event_type = 'page_view' AND target_id = %s AND visitor_ip = %s AND visitor_uuid IS NULL
                            LIMIT 1
                        """.format(SCHEMA), (target_id, visitor_ip))

                    existing = cur.fetchone()

                    if not existing:
                        # Это первый уникальный просмотр – увеличиваем счётчик в vpn_posts
                        cur.execute("""
                            UPDATE {}.vpn_posts SET views = views + 1
                            WHERE slug = %s
                        """.format(SCHEMA), (target_id,))

                conn.commit()
                return response(200, {'success': True})
        except Exception as e:
            conn.rollback()
            return response(500, {'error': str(e)})
        finally:
            conn.close()

    else:
        return response(405, {'error': 'Method not allowed'})