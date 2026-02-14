import json
import os
import urllib.request
import urllib.error
import urllib.parse
from typing import Dict, Any

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    """Прокси для OneDash API — получение баланса, статистики и регистраций партнёрской программы"""
    method = event.get('httpMethod', 'GET')

    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-Auth-Token',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }

    if method != 'GET':
        return {
            'statusCode': 405,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Method not allowed'}),
            'isBase64Encoded': False
        }

    api_key = os.environ.get('ONEDASH_API_KEY')
    if not api_key:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'ONEDASH_API_KEY not configured'}),
            'isBase64Encoded': False
        }

    params = event.get('queryStringParameters') or {}
    endpoint = params.get('endpoint', 'stats')

    if endpoint not in ('balance', 'stats', 'registrations'):
        return {
            'statusCode': 400,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Invalid endpoint. Use: balance, stats, registrations'}),
            'isBase64Encoded': False
        }

    url = f'https://rdp-onedash.ru/web-api/{endpoint}'
    payload = json.dumps({'key': api_key}).encode('utf-8')

    get_url = f'{url}?key={urllib.parse.quote(api_key)}'
    req = urllib.request.Request(get_url, method='GET')

    try:
        with urllib.request.urlopen(req, timeout=10) as resp:
            raw = resp.read().decode('utf-8')
            content_type = resp.headers.get('Content-Type', '')

            if 'application/json' in content_type:
                data = json.loads(raw)
            else:
                data = {'raw_response': raw[:1000], 'content_type': content_type}

        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'endpoint': endpoint, 'data': data}),
            'isBase64Encoded': False
        }
    except urllib.error.HTTPError as e:
        detail = ''
        try:
            detail = e.read().decode('utf-8')[:500]
        except Exception:
            pass
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'endpoint': endpoint, 'data': None, 'api_error': True, 'api_status': e.code, 'detail': detail}),
            'isBase64Encoded': False
        }
    except Exception as e:
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'endpoint': endpoint, 'data': None, 'api_error': True, 'detail': str(e)}),
            'isBase64Encoded': False
        }