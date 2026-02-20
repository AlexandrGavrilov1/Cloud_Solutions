import json
import hashlib
import secrets
import os
from typing import Dict, Any
import psycopg2
from psycopg2.extras import RealDictCursor

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Admin authentication with token generation
    Args: event - dict with httpMethod, body
          context - object with attributes: request_id, function_name
    Returns: HTTP response dict with auth token
    '''
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
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
        username = body_data.get('username', '').strip()
        password = body_data.get('password', '').strip()
        
        if not username or not password:
            conn.close()
            return {
                'statusCode': 400,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'error': 'Missing username or password'}),
                'isBase64Encoded': False
            }
        
        password_hash = hashlib.sha256(password.encode()).hexdigest()
        
        print(f"DEBUG: Login attempt - username='{username}', password_length={len(password)}, hash={password_hash}")
        
        username_escaped = username.replace("'", "''")
        
        cursor = conn.cursor(cursor_factory=RealDictCursor)
        
        query = f"SELECT id, username, password_hash FROM admin_users WHERE username = '{username_escaped}'"
        cursor.execute(query)
        
        db_user = cursor.fetchone()
        
        print(f"DEBUG: DB query result - found={db_user is not None}")
        if db_user:
            print(f"DEBUG: DB hash={db_user['password_hash']}, match={db_user['password_hash'] == password_hash}")
        
        if not db_user or db_user['password_hash'] != password_hash:
            cursor.close()
            conn.close()
            return {
                'statusCode': 401,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'error': 'Invalid credentials'}),
                'isBase64Encoded': False
            }
        
        user = {'id': db_user['id'], 'username': db_user['username']}
        
        token = secrets.token_urlsafe(32)
        
        cursor.execute(
            f"INSERT INTO admin_tokens (user_id, token) VALUES ({user['id']}, '{token}') ON CONFLICT (user_id) DO UPDATE SET token = EXCLUDED.token, created_at = CURRENT_TIMESTAMP"
        )
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
                'token': token,
                'username': user['username']
            }),
            'isBase64Encoded': False
        }
    
    if method == 'GET':
        auth_token = event.get('headers', {}).get('X-Auth-Token') or event.get('headers', {}).get('x-auth-token')
        
        if not auth_token:
            conn.close()
            return {
                'statusCode': 401,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'error': 'No token provided'}),
                'isBase64Encoded': False
            }
        
        token_escaped = auth_token.replace("'", "''")
        
        cursor = conn.cursor(cursor_factory=RealDictCursor)
        cursor.execute(
            f"SELECT u.id, u.username FROM admin_tokens t JOIN admin_users u ON t.user_id = u.id WHERE t.token = '{token_escaped}' AND t.created_at > NOW() - INTERVAL '7 days'"
        )
        
        user = cursor.fetchone()
        cursor.close()
        conn.close()
        
        if not user:
            return {
                'statusCode': 401,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'error': 'Invalid or expired token'}),
                'isBase64Encoded': False
            }
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({
                'valid': True,
                'username': user['username']
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