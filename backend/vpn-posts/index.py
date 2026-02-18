import json
import os
import re
from typing import Dict, Any
from datetime import datetime
import psycopg2
from psycopg2.extras import RealDictCursor

SCHEMA = 't_p4153566_vds_rating_portal'

CORS_HEADERS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, X-Auth-Token',
    'Access-Control-Max-Age': '86400'
}

def response(status_code: int, body: Any) -> Dict[str, Any]:
    return {
        'statusCode': status_code,
        'headers': {**CORS_HEADERS, 'Content-Type': 'application/json'},
        'body': json.dumps(body, ensure_ascii=False, default=str),
        'isBase64Encoded': False
    }

def verify_admin(conn, token: str) -> bool:
    if not token:
        return False
    with conn.cursor() as cur:
        cur.execute(
            f"SELECT 1 FROM {SCHEMA}.admin_tokens WHERE token = %s",
            (token,)
        )
        return cur.fetchone() is not None

def generate_slug(title: str) -> str:
    """Генерирует slug из заголовка (транслитерация)."""
    translit_map = {
        'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ё': 'e',
        'ж': 'zh', 'з': 'z', 'и': 'i', 'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm',
        'н': 'n', 'о': 'o', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u',
        'ф': 'f', 'х': 'kh', 'ц': 'ts', 'ч': 'ch', 'ш': 'sh', 'щ': 'shch',
        'ы': 'y', 'э': 'e', 'ю': 'yu', 'я': 'ya',
    }
    title_lower = title.lower()
    slug = ''
    for ch in title_lower:
        if ch.isalnum():
            slug += ch
        elif ch in translit_map:
            slug += translit_map[ch]
        else:
            slug += '-'
    slug = re.sub(r'-+', '-', slug).strip('-')
    return slug or 'post'

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    """Управление статьями VPN: получение списка, обновление и создание."""
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
        elif method == 'POST':
            return handle_post(conn, event)
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
                f"""
                SELECT id, slug, title, excerpt, content, author, date,
                       date_published, date_modified, read_time, category,
                       tags, image, views, provider_url, provider_name
                FROM {SCHEMA}.vpn_posts
                WHERE slug = %s
                """,
                (slug,)
            )
            row = cur.fetchone()
            if not row:
                return response(404, {'error': 'Post not found'})
            return response(200, dict(row))
        else:
            cur.execute(
                f"""
                SELECT id, slug, title, excerpt, author, date,
                       date_published, date_modified, read_time, category,
                       tags, image, views, provider_url, provider_name
                FROM {SCHEMA}.vpn_posts
                ORDER BY id
                """
            )
            rows = cur.fetchall()
            return response(200, [dict(r) for r in rows])

def handle_put(conn, event):
    headers = event.get('headers', {})
    token = headers.get('X-Auth-Token') or headers.get('x-auth-token', '')

    if not verify_admin(conn, token):
        return response(401, {'error': 'Unauthorized'})

    try:
        body = json.loads(event.get('body', '{}'))
    except json.JSONDecodeError:
        return response(400, {'error': 'Invalid JSON'})

    slug = body.get('slug')
    if not slug:
        return response(400, {'error': 'slug is required'})

    # Белый список полей, которые можно обновлять
    updatable_fields = {
        'title': 'title',
        'excerpt': 'excerpt',
        'content': 'content',
        'author': 'author',
        'date': 'date',
        'date_published': 'date_published',
        'date_modified': 'date_modified',
        'read_time': 'read_time',
        'category': 'category',
        'image': 'image',
        'provider_url': 'provider_url',
        'provider_name': 'provider_name',
        'views': 'views',
    }

    set_clauses = []
    params = []

    for json_key, db_col in updatable_fields.items():
        if json_key in body:
            set_clauses.append(f"{db_col} = %s")
            params.append(body[json_key])

    if 'tags' in body:
        tags = body['tags']
        if not isinstance(tags, list):
            return response(400, {'error': 'tags must be an array'})
        set_clauses.append("tags = %s::text[]")
        params.append(tags)

    if not set_clauses:
        return response(400, {'error': 'No fields to update'})

    set_clauses.append("updated_at = NOW()")
    sql = f"""
        UPDATE {SCHEMA}.vpn_posts
        SET {', '.join(set_clauses)}
        WHERE slug = %s
        RETURNING *
    """
    params.append(slug)

    with conn.cursor(cursor_factory=RealDictCursor) as cur:
        cur.execute(sql, params)
        row = cur.fetchone()
        conn.commit()

    if not row:
        return response(404, {'error': 'Post not found'})

    return response(200, dict(row))

def handle_post(conn, event):
    headers = event.get('headers', {})
    token = headers.get('X-Auth-Token') or headers.get('x-auth-token', '')

    if not verify_admin(conn, token):
        return response(401, {'error': 'Unauthorized'})

    try:
        body = json.loads(event.get('body', '{}'))
    except json.JSONDecodeError:
        return response(400, {'error': 'Invalid JSON'})

    # Обязательные поля
    required = ['title', 'content']
    for field in required:
        if field not in body:
            return response(400, {'error': f'Missing required field: {field}'})

    # Генерация slug, если не передан
    slug = body.get('slug')
    if not slug:
        slug = generate_slug(body['title'])

    # Проверка уникальности slug
    with conn.cursor() as cur:
        cur.execute(
            f"SELECT id FROM {SCHEMA}.vpn_posts WHERE slug = %s",
            (slug,)
        )
        if cur.fetchone():
            return response(409, {'error': 'Slug already exists'})

    # Подготовка данных для вставки (все поля таблицы)
    insert_data = {
        'slug': slug,
        'title': body.get('title', ''),
        'excerpt': body.get('excerpt', ''),
        'content': body.get('content', ''),
        'author': body.get('author', 'Команда TopCloudHub'),
        'date': body.get('date', datetime.now().strftime('%d.%m.%Y')),
        'date_published': body.get('date_published', datetime.now().isoformat()),
        'date_modified': body.get('date_modified', datetime.now().isoformat()),
        'read_time': body.get('readTime', body.get('read_time', '5 мин')),
        'category': body.get('category', 'VPN'),
        'tags': body.get('tags', []),
        'image': body.get('image', ''),
        'views': 0,
        'provider_url': body.get('providerUrl', body.get('provider_url', '')),
        'provider_name': body.get('providerName', body.get('provider_name', '')),
    }

    columns = []
    values_placeholders = []
    params = []

    for col, val in insert_data.items():
        columns.append(col)
        if col == 'tags':
            values_placeholders.append('%s::text[]')
        else:
            values_placeholders.append('%s')
        params.append(val)

    sql = f"""
        INSERT INTO {SCHEMA}.vpn_posts ({', '.join(columns)})
        VALUES ({', '.join(values_placeholders)})
        RETURNING *
    """

    with conn.cursor(cursor_factory=RealDictCursor) as cur:
        cur.execute(sql, params)
        new_post = cur.fetchone()
        conn.commit()

    if not new_post:
        return response(500, {'error': 'Failed to create post'})

    return response(201, dict(new_post))