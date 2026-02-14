import json
import os
import urllib.request
import urllib.error
from typing import Dict, Any

CORS_HEADERS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
}

ALLOWED_ENDPOINTS = ('balance', 'all-orders', 'tariffs', 'systems-list', 'test-request')

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    """Прокси для OneDash API — получение баланса и заказов через заголовок Api-Key"""
    method = event.get('httpMethod', 'GET')

    if method == 'OPTIONS':
        return {'statusCode': 200, 'headers': CORS_HEADERS, 'body': '', 'isBase64Encoded': False}

    if method != 'GET':
        return {
            'statusCode': 405,
            'headers': {'Content-Type': 'application/json', **CORS_HEADERS},
            'body': json.dumps({'error': 'Method not allowed'}),
            'isBase64Encoded': False,
        }

    api_key = os.environ.get('ONEDASH_API_KEY')
    if not api_key:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', **CORS_HEADERS},
            'body': json.dumps({'error': 'ONEDASH_API_KEY not configured'}),
            'isBase64Encoded': False,
        }

    params = event.get('queryStringParameters') or {}
    endpoint = params.get('endpoint', 'balance')

    if endpoint not in ALLOWED_ENDPOINTS:
        return {
            'statusCode': 400,
            'headers': {'Content-Type': 'application/json', **CORS_HEADERS},
            'body': json.dumps({'error': f'Invalid endpoint. Use: {", ".join(ALLOWED_ENDPOINTS)}'}),
            'isBase64Encoded': False,
        }

    url = f'https://rdp-onedash.ru/web-api/{endpoint}'
    req = urllib.request.Request(
        url,
        headers={
            'Api-Key': api_key,
            'Accept': 'application/json',
            'User-Agent': 'Mozilla/5.0',
        },
        method='GET',
    )

    try:
        with urllib.request.urlopen(req, timeout=10) as resp:
            raw = resp.read().decode('utf-8')
            data = json.loads(raw)
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', **CORS_HEADERS},
                'body': json.dumps({'endpoint': endpoint, 'data': data}),
                'isBase64Encoded': False,
            }
    except urllib.error.HTTPError as e:
        detail = ''
        try:
            detail = e.read().decode('utf-8')[:500]
        except Exception:
            pass
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', **CORS_HEADERS},
            'body': json.dumps({'endpoint': endpoint, 'data': None, 'api_error': True, 'status': e.code, 'detail': detail}),
            'isBase64Encoded': False,
        }
    except Exception as e:
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', **CORS_HEADERS},
            'body': json.dumps({'endpoint': endpoint, 'data': None, 'api_error': True, 'detail': str(e)}),
            'isBase64Encoded': False,
        }
