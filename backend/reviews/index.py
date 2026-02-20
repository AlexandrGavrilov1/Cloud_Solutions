import json
import os
from datetime import datetime
from typing import Dict, Any
import psycopg2
from psycopg2.extras import RealDictCursor

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Manage provider reviews (create, list, moderate)
    Args: event - dict with httpMethod, body, queryStringParameters
          context - object with attributes: request_id, function_name
    Returns: HTTP response dict
    '''
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-Auth-Token',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    database_url = os.environ.get('DATABASE_URL')
    if not database_url:
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Database not configured'}),
            'isBase64Encoded': False
        }
    
    conn = psycopg2.connect(database_url)
    
    if method == 'POST':
        body_data = json.loads(event.get('body', '{}'))
        provider_id = body_data.get('provider_id')
        author = body_data.get('author', '').strip()
        text = body_data.get('text', '').strip()
        rating = body_data.get('rating', 5)
        
        if not provider_id or not author or not text:
            conn.close()
            return {
                'statusCode': 400,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'error': 'Missing required fields'}),
                'isBase64Encoded': False
            }
        
        if not isinstance(rating, int) or rating < 1 or rating > 5:
            conn.close()
            return {
                'statusCode': 400,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'error': 'Rating must be between 1 and 5'}),
                'isBase64Encoded': False
            }
        
        author_escaped = author.replace("'", "''")
        text_escaped = text.replace("'", "''")
        
        cursor = conn.cursor()
        cursor.execute(
            f"INSERT INTO reviews (provider_id, author, text, rating, status) VALUES ({provider_id}, '{author_escaped}', '{text_escaped}', {rating}, 'pending') RETURNING id"
        )
        review_id = cursor.fetchone()[0]
        conn.commit()
        cursor.close()
        conn.close()
        
        return {
            'statusCode': 201,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({
                'success': True,
                'review_id': review_id,
                'message': 'Review submitted for moderation'
            }),
            'isBase64Encoded': False
        }
    
    if method == 'GET':
        params = event.get('queryStringParameters') or {}
        provider_id = params.get('provider_id')
        status = params.get('status', 'approved')
        
        status_escaped = status.replace("'", "''")
        
        cursor = conn.cursor(cursor_factory=RealDictCursor)
        
        if provider_id:
            cursor.execute(
                f"SELECT id, provider_id, author, text, rating, created_at FROM reviews WHERE provider_id = {provider_id} AND status = '{status_escaped}' ORDER BY created_at DESC"
            )
        else:
            cursor.execute(
                f"SELECT id, provider_id, author, text, rating, created_at FROM reviews WHERE status = '{status_escaped}' ORDER BY created_at DESC LIMIT 100"
            )
        
        reviews = cursor.fetchall()
        cursor.close()
        conn.close()
        
        reviews_list = []
        for review in reviews:
            reviews_list.append({
                'id': review['id'],
                'provider_id': review['provider_id'],
                'author': review['author'],
                'text': review['text'],
                'rating': review['rating'],
                'date': review['created_at'].strftime('%d %b %Y') if review['created_at'] else ''
            })
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'reviews': reviews_list}),
            'isBase64Encoded': False
        }
    
    if method == 'PUT':
        auth_token = event.get('headers', {}).get('X-Auth-Token') or event.get('headers', {}).get('x-auth-token')
        
        if not auth_token:
            conn.close()
            return {
                'statusCode': 401,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'error': 'Authentication required'}),
                'isBase64Encoded': False
            }
        
        token_escaped = auth_token.replace("'", "''")
        
        cursor = conn.cursor(cursor_factory=RealDictCursor)
        cursor.execute(
            f"SELECT u.id FROM admin_tokens t JOIN admin_users u ON t.user_id = u.id WHERE t.token = '{token_escaped}' AND t.created_at > NOW() - INTERVAL '7 days'"
        )
        admin_user = cursor.fetchone()
        cursor.close()
        
        if not admin_user:
            conn.close()
            return {
                'statusCode': 401,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'error': 'Invalid or expired token'}),
                'isBase64Encoded': False
            }
        
        body_data = json.loads(event.get('body', '{}'))
        review_id = body_data.get('review_id')
        action = body_data.get('action')
        
        if not review_id or action not in ['approve', 'reject', 'delete']:
            conn.close()
            return {
                'statusCode': 400,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'error': 'Invalid review_id or action'}),
                'isBase64Encoded': False
            }
        
        cursor = conn.cursor()
        
        if action == 'delete':
            cursor.execute(f"DELETE FROM reviews WHERE id = {review_id}")
        elif action == 'approve':
            cursor.execute(f"UPDATE reviews SET status = 'approved' WHERE id = {review_id}")
        elif action == 'reject':
            cursor.execute(f"UPDATE reviews SET status = 'rejected' WHERE id = {review_id}")
        
        conn.commit()
        cursor.close()
        conn.close()
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({
                'success': True,
                'message': f'Review {action}d successfully'
            }),
            'isBase64Encoded': False
        }
    
    conn.close()
    return {
        'statusCode': 405,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        'body': json.dumps({'error': 'Method not allowed'}),
        'isBase64Encoded': False
    }