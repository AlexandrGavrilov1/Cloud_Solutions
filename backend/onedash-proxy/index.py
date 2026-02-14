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

    print(f'[onedash-proxy] key_len={len(api_key)} key_prefix={api_key[:8]}...')

    params = event.get('queryStringParameters') or {}
    endpoint = params.get('endpoint', 'stats')
    debug = params.get('debug', '0') == '1'

    if endpoint not in ('balance', 'stats', 'registrations'):
        return {
            'statusCode': 400,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Invalid endpoint. Use: balance, stats, registrations'}),
            'isBase64Encoded': False
        }

    base_url = f'https://rdp-onedash.ru/web-api/{endpoint}'

    def try_request(req):
        try:
            with urllib.request.urlopen(req, timeout=10) as resp:
                raw = resp.read().decode('utf-8')
                ct = resp.headers.get('Content-Type', '')
                status = resp.status
                if 'application/json' in ct:
                    return {'status': status, 'data': json.loads(raw), 'ok': True}
                else:
                    return {'status': status, 'raw': raw[:500], 'content_type': ct, 'ok': False}
        except urllib.error.HTTPError as e:
            detail = ''
            try:
                detail = e.read().decode('utf-8')[:300]
            except Exception:
                pass
            return {'status': e.code, 'detail': detail, 'ok': False}
        except Exception as e:
            return {'status': 0, 'detail': str(e), 'ok': False}

    attempts = []

    req1 = urllib.request.Request(
        base_url,
        data=urllib.parse.urlencode({'key': api_key}).encode('utf-8'),
        headers={
            'Content-Type': 'application/x-www-form-urlencoded',
            'User-Agent': 'Mozilla/5.0',
            'Accept': 'application/json',
        },
        method='POST'
    )
    r1 = try_request(req1)
    attempts.append({'method': 'POST form-urlencoded', 'result': r1})
    if r1.get('ok'):
        return ok_response(endpoint, r1['data'], attempts if debug else None)

    req2 = urllib.request.Request(
        base_url,
        data=json.dumps({'key': api_key}).encode('utf-8'),
        headers={
            'Content-Type': 'application/json',
            'User-Agent': 'Mozilla/5.0',
            'Accept': 'application/json',
        },
        method='POST'
    )
    r2 = try_request(req2)
    attempts.append({'method': 'POST json', 'result': r2})
    if r2.get('ok'):
        return ok_response(endpoint, r2['data'], attempts if debug else None)

    get_url = f'{base_url}?key={urllib.parse.quote(api_key)}'
    req3 = urllib.request.Request(
        get_url,
        headers={
            'User-Agent': 'Mozilla/5.0',
            'Accept': 'application/json',
        },
        method='GET'
    )
    r3 = try_request(req3)
    attempts.append({'method': 'GET', 'result': r3})
    if r3.get('ok'):
        return ok_response(endpoint, r3['data'], attempts if debug else None)

    return {
        'statusCode': 200,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({
            'endpoint': endpoint,
            'data': None,
            'api_error': True,
            'attempts': attempts
        }),
        'isBase64Encoded': False
    }


def ok_response(endpoint, data, attempts=None):
    body = {'endpoint': endpoint, 'data': data}
    if attempts:
        body['attempts'] = attempts
    return {
        'statusCode': 200,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'body': json.dumps(body),
        'isBase64Encoded': False
    }