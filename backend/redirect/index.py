'''
Business: Redirect from old domain to new domain with 301 status
Args: event - dict with httpMethod, headers, queryStringParameters
      context - object with attributes: request_id, function_name, function_version
Returns: HTTP 301 redirect response
'''

import json
from typing import Dict, Any
from urllib.parse import urlencode

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    headers = event.get('headers', {})
    query_params = event.get('queryStringParameters', {})
    
    query_string = ''
    if query_params:
        query_string = '?' + urlencode(query_params)
    
    path = '/'
    referer = headers.get('referer') or headers.get('Referer') or ''
    if referer:
        try:
            from urllib.parse import urlparse
            parsed = urlparse(referer)
            path = parsed.path or '/'
        except Exception:
            path = '/'
    
    new_url = f'https://top-vds.ru{path}{query_string}'
    
    return {
        'statusCode': 301,
        'headers': {
            'Location': new_url,
            'Access-Control-Allow-Origin': '*',
            'Cache-Control': 'public, max-age=31536000'
        },
        'body': '',
        'isBase64Encoded': False
    }