import json
import os
from typing import Dict, Any, List
import urllib.request
import urllib.error

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Automatically check all providers and trigger uptime monitoring
    Args: event with httpMethod (POST), body with providers list
    Returns: Results of all checks
    '''
    method: str = event.get('httpMethod', 'POST')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    if method != 'POST':
        return {
            'statusCode': 405,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Method not allowed'})
        }
    
    body_data = json.loads(event.get('body', '{}'))
    providers: List[Dict[str, Any]] = body_data.get('providers', [])
    
    if not providers:
        return {
            'statusCode': 400,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'providers array is required'})
        }
    
    monitor_url = 'https://functions.poehali.dev/da289550-8e78-4eca-93fe-815932441ab2'
    results = []
    
    for provider in providers:
        provider_id = provider.get('id')
        url = provider.get('url')
        
        if not provider_id or not url:
            results.append({
                'provider_id': provider_id,
                'success': False,
                'error': 'Missing id or url'
            })
            continue
        
        # Call uptime monitor function
        try:
            check_data = json.dumps({
                'provider_id': provider_id,
                'url': url
            }).encode('utf-8')
            
            req = urllib.request.Request(
                monitor_url,
                data=check_data,
                headers={'Content-Type': 'application/json'},
                method='POST'
            )
            
            with urllib.request.urlopen(req, timeout=15) as response:
                result = json.loads(response.read().decode('utf-8'))
                results.append({
                    'provider_id': provider_id,
                    'success': True,
                    'is_available': result.get('is_available'),
                    'response_time_ms': result.get('response_time_ms')
                })
        except Exception as e:
            results.append({
                'provider_id': provider_id,
                'success': False,
                'error': str(e)
            })
    
    successful = sum(1 for r in results if r['success'])
    
    return {
        'statusCode': 200,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({
            'total': len(results),
            'successful': successful,
            'failed': len(results) - successful,
            'results': results
        })
    }
