import json
import os
from typing import Dict, Any
import psycopg2
from psycopg2.extras import RealDictCursor

SCHEMA = 't_p4153566_vds_rating_portal'

CORS_HEADERS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, X-Auth-Token',
    'Access-Control-Max-Age': '86400'
}

def response(status_code, body):
    return {
        'statusCode': status_code,
        'headers': {**CORS_HEADERS, 'Content-Type': 'application/json'},
        'body': json.dumps(body, ensure_ascii=False, default=str),
        'isBase64Encoded': False
    }

def verify_admin(conn, token):
    if not token:
        return False
    with conn.cursor() as cur:
        cur.execute(
            "SELECT 1 FROM %s.admin_tokens WHERE token = '%s' AND expires_at > NOW()" % (SCHEMA, token.replace("'", "''"))
        )
        return cur.fetchone() is not None

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    """Управление статьями VPN: получение списка и обновление контента"""
    method = event.get('httpMethod', 'GET')

    if method == 'OPTIONS':
        return {'statusCode': 200, 'headers': CORS_HEADERS, 'body': '', 'isBase64Encoded': False}

    database_url = os.environ.get('DATABASE_URL')
    if not database_url:
        return response(500, {'error': 'Database not configured'})

    conn = psycopg2.connect(database_url)

    try:
        if method == 'GET':
            return handle_get(conn, event)
        elif method == 'PUT':
            return handle_put(conn, event)
        else:
            return response(405, {'error': 'Method not allowed'})
    finally:
        conn.close()

def handle_get(conn, event):
    params = event.get('queryStringParameters') or {}
    slug = params.get('slug')

    with conn.cursor(cursor_factory=RealDictCursor) as cur:
        if slug:
            cur.execute(
                "SELECT id, slug, title, excerpt, content, author, date, date_published, date_modified, "
                "read_time, category, tags, image, views, provider_url, provider_name "
                "FROM %s.vpn_posts WHERE slug = '%s'" % (SCHEMA, slug.replace("'", "''"))
            )
            row = cur.fetchone()
            if not row:
                return response(404, {'error': 'Post not found'})
            return response(200, dict(row))
        else:
            cur.execute(
                "SELECT id, slug, title, excerpt, author, date, date_published, date_modified, "
                "read_time, category, tags, image, views, provider_url, provider_name "
                "FROM %s.vpn_posts ORDER BY id" % SCHEMA
            )
            rows = cur.fetchall()
            return response(200, [dict(r) for r in rows])

def handle_put(conn, event):
    headers = event.get('headers', {})
    token = headers.get('X-Auth-Token') or headers.get('x-auth-token', '')

    if not verify_admin(conn, token):
        return response(401, {'error': 'Unauthorized'})

    body = json.loads(event.get('body', '{}'))
    slug = body.get('slug')
    if not slug:
        return response(400, {'error': 'slug is required'})

    fields = []
    values_map = {}

    updatable = {
        'title': 'title', 'excerpt': 'excerpt', 'content': 'content',
        'author': 'author', 'date': 'date', 'date_published': 'date_published',
        'date_modified': 'date_modified', 'read_time': 'read_time',
        'category': 'category', 'image': 'image',
        'provider_url': 'provider_url', 'provider_name': 'provider_name'
    }

    for json_key, db_col in updatable.items():
        if json_key in body:
            val = body[json_key]
            if val is None:
                fields.append("%s = NULL" % db_col)
            else:
                safe_val = str(val).replace("'", "''")
                fields.append("%s = '%s'" % (db_col, safe_val))

    if 'tags' in body:
        tags = body['tags']
        safe_tags = ','.join("'%s'" % t.replace("'", "''") for t in tags)
        fields.append("tags = ARRAY[%s]::text[]" % safe_tags)

    if not fields:
        return response(400, {'error': 'No fields to update'})

    fields.append("updated_at = NOW()")

    sql = "UPDATE %s.vpn_posts SET %s WHERE slug = '%s' RETURNING id, slug, title" % (
        SCHEMA, ', '.join(fields), slug.replace("'", "''")
    )

    with conn.cursor(cursor_factory=RealDictCursor) as cur:
        cur.execute(sql)
        row = cur.fetchone()
        conn.commit()

    if not row:
        return response(404, {'error': 'Post not found'})

    return response(200, {'success': True, 'post': dict(row)})
