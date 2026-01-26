'''
OAuth авторизация через Яндекс и ВКонтакте
Поддерживает регистрацию и вход пользователей через соцсети
'''

import json
import os
import urllib.parse
import urllib.request
from typing import Dict, Any, Optional
import psycopg2
from psycopg2.extras import RealDictCursor
import jwt
from datetime import datetime, timedelta

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    method = event.get('httpMethod', 'GET')
    params = event.get('queryStringParameters', {}) or {}
    path_action = params.get('action', '')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-Authorization',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    # GET ?action=yandex - редирект на Яндекс OAuth
    if method == 'GET' and path_action == 'yandex':
        client_id = os.environ.get('YANDEX_CLIENT_ID')
        if not client_id:
            return {
                'statusCode': 500,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'YANDEX_CLIENT_ID not configured'}),
                'isBase64Encoded': False
            }
        
        redirect_uri = f"https://functions.poehali.dev/{context.function_name}?action=callback_yandex"
        
        auth_url = (
            f"https://oauth.yandex.ru/authorize?"
            f"response_type=code&"
            f"client_id={client_id}&"
            f"redirect_uri={urllib.parse.quote(redirect_uri)}"
        )
        
        return {
            'statusCode': 302,
            'headers': {
                'Location': auth_url,
                'Access-Control-Allow-Origin': '*'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    # GET ?action=vk - редирект на VK OAuth
    if method == 'GET' and path_action == 'vk':
        client_id = os.environ.get('VK_CLIENT_ID')
        redirect_uri = f"https://functions.poehali.dev/{context.function_name}?action=callback_vk"
        
        auth_url = (
            f"https://oauth.vk.com/authorize?"
            f"client_id={client_id}&"
            f"redirect_uri={urllib.parse.quote(redirect_uri)}&"
            f"display=page&"
            f"scope=email&"
            f"response_type=code&"
            f"v=5.131"
        )
        
        return {
            'statusCode': 302,
            'headers': {
                'Location': auth_url,
                'Access-Control-Allow-Origin': '*'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    # GET ?action=callback_yandex - обработка callback от Яндекса
    if method == 'GET' and path_action == 'callback_yandex':
        code = params.get('code')
        
        if not code:
            return redirect_with_error('Код авторизации не получен')
        
        try:
            user_data = exchange_yandex_code(code, context.function_name)
            token = create_user_and_token(user_data, 'yandex')
            return redirect_with_token(token)
        except Exception as e:
            return redirect_with_error(str(e))
    
    # GET ?action=callback_vk - обработка callback от VK
    if method == 'GET' and path_action == 'callback_vk':
        code = params.get('code')
        
        if not code:
            return redirect_with_error('Код авторизации не получен')
        
        try:
            user_data = exchange_vk_code(code, context.function_name)
            token = create_user_and_token(user_data, 'vk')
            return redirect_with_token(token)
        except Exception as e:
            return redirect_with_error(str(e))
    
    # POST ?action=verify - проверка JWT токена
    if method == 'POST' and path_action == 'verify':
        body_str = event.get('body', '{}')
        if not body_str or body_str.strip() == '':
            body_str = '{}'
        body = json.loads(body_str)
        token = body.get('token')
        
        if not token:
            return {
                'statusCode': 400,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Token required'}),
                'isBase64Encoded': False
            }
        
        try:
            jwt_secret = os.environ.get('JWT_SECRET')
            payload = jwt.decode(token, jwt_secret, algorithms=['HS256'])
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'valid': True, 'user': payload}),
                'isBase64Encoded': False
            }
        except jwt.ExpiredSignatureError:
            return {
                'statusCode': 401,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Token expired'}),
                'isBase64Encoded': False
            }
        except jwt.InvalidTokenError:
            return {
                'statusCode': 401,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Invalid token'}),
                'isBase64Encoded': False
            }
    
    return {
        'statusCode': 404,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'error': 'Not found'}),
        'isBase64Encoded': False
    }


def exchange_yandex_code(code: str, function_name: str) -> Dict[str, Any]:
    '''Обмен кода на токен и получение данных пользователя Яндекс'''
    client_id = os.environ.get('YANDEX_CLIENT_ID')
    client_secret = os.environ.get('YANDEX_CLIENT_SECRET')
    redirect_uri = f"https://functions.poehali.dev/{function_name}?action=callback_yandex"
    
    token_data = urllib.parse.urlencode({
        'grant_type': 'authorization_code',
        'code': code,
        'client_id': client_id,
        'client_secret': client_secret
    }).encode()
    
    token_req = urllib.request.Request(
        'https://oauth.yandex.ru/token',
        data=token_data,
        method='POST'
    )
    
    with urllib.request.urlopen(token_req) as response:
        token_result = json.loads(response.read().decode())
    
    access_token = token_result.get('access_token')
    
    user_req = urllib.request.Request(
        'https://login.yandex.ru/info',
        headers={'Authorization': f'OAuth {access_token}'}
    )
    
    with urllib.request.urlopen(user_req) as response:
        user_info = json.loads(response.read().decode())
    
    return {
        'oauth_id': user_info.get('id'),
        'email': user_info.get('default_email'),
        'name': user_info.get('display_name') or user_info.get('real_name'),
        'avatar_url': f"https://avatars.yandex.net/get-yapic/{user_info.get('default_avatar_id')}/islands-200" if user_info.get('default_avatar_id') else None
    }


def exchange_vk_code(code: str, function_name: str) -> Dict[str, Any]:
    '''Обмен кода на токен и получение данных пользователя ВК'''
    client_id = os.environ.get('VK_CLIENT_ID')
    client_secret = os.environ.get('VK_CLIENT_SECRET')
    redirect_uri = f"https://functions.poehali.dev/{function_name}?action=callback_vk"
    
    token_url = (
        f"https://oauth.vk.com/access_token?"
        f"client_id={client_id}&"
        f"client_secret={client_secret}&"
        f"redirect_uri={urllib.parse.quote(redirect_uri)}&"
        f"code={code}"
    )
    
    with urllib.request.urlopen(token_url) as response:
        token_result = json.loads(response.read().decode())
    
    access_token = token_result.get('access_token')
    user_id = token_result.get('user_id')
    email = token_result.get('email')
    
    user_url = (
        f"https://api.vk.com/method/users.get?"
        f"user_ids={user_id}&"
        f"fields=photo_200&"
        f"access_token={access_token}&"
        f"v=5.131"
    )
    
    with urllib.request.urlopen(user_url) as response:
        user_result = json.loads(response.read().decode())
    
    user_info = user_result.get('response', [{}])[0]
    
    return {
        'oauth_id': str(user_id),
        'email': email,
        'name': f"{user_info.get('first_name', '')} {user_info.get('last_name', '')}".strip(),
        'avatar_url': user_info.get('photo_200')
    }


def create_user_and_token(user_data: Dict[str, Any], provider: str) -> str:
    '''Создание/обновление пользователя в БД и генерация JWT токена'''
    dsn = os.environ.get('DATABASE_URL')
    conn = psycopg2.connect(dsn)
    
    try:
        with conn.cursor(cursor_factory=RealDictCursor) as cur:
            cur.execute(
                "SELECT * FROM users WHERE oauth_provider = %s AND oauth_id = %s",
                (provider, user_data['oauth_id'])
            )
            user = cur.fetchone()
            
            if user:
                cur.execute(
                    "UPDATE users SET last_login = CURRENT_TIMESTAMP, email = %s, name = %s, avatar_url = %s WHERE id = %s",
                    (user_data.get('email'), user_data.get('name'), user_data.get('avatar_url'), user['id'])
                )
                conn.commit()
                user_id = user['id']
            else:
                cur.execute(
                    "INSERT INTO users (oauth_provider, oauth_id, email, name, avatar_url) VALUES (%s, %s, %s, %s, %s) RETURNING id",
                    (provider, user_data['oauth_id'], user_data.get('email'), user_data.get('name'), user_data.get('avatar_url'))
                )
                conn.commit()
                user_id = cur.fetchone()['id']
        
        jwt_secret = os.environ.get('JWT_SECRET')
        payload = {
            'user_id': user_id,
            'provider': provider,
            'email': user_data.get('email'),
            'name': user_data.get('name'),
            'avatar_url': user_data.get('avatar_url'),
            'exp': datetime.utcnow() + timedelta(days=30)
        }
        
        token = jwt.encode(payload, jwt_secret, algorithm='HS256')
        return token
    finally:
        conn.close()


def redirect_with_token(token: str) -> Dict[str, Any]:
    '''Редирект на фронтенд с JWT токеном'''
    frontend_url = os.environ.get('FRONTEND_URL', 'http://localhost:5173')
    return {
        'statusCode': 302,
        'headers': {
            'Location': f"{frontend_url}/auth/callback?token={token}",
            'Access-Control-Allow-Origin': '*'
        },
        'body': '',
        'isBase64Encoded': False
    }


def redirect_with_error(error: str) -> Dict[str, Any]:
    '''Редирект на фронтенд с ошибкой'''
    frontend_url = os.environ.get('FRONTEND_URL', 'http://localhost:5173')
    return {
        'statusCode': 302,
        'headers': {
            'Location': f"{frontend_url}/auth/callback?error={urllib.parse.quote(error)}",
            'Access-Control-Allow-Origin': '*'
        },
        'body': '',
        'isBase64Encoded': False
    }