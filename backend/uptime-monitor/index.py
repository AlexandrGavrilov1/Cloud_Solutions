import json
import os
import time
from datetime import datetime, timedelta
from typing import Dict, Any, List, Optional
import psycopg2
from psycopg2.extras import RealDictCursor
import urllib.request
import urllib.error

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Monitor provider uptime and calculate statistics
    Args: event with httpMethod (GET/POST), queryStringParameters with provider_id, days
    Returns: Uptime statistics or check result
    '''
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    dsn = os.environ.get('DATABASE_URL')
    if not dsn:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Database connection not configured'})
        }
    
    conn = psycopg2.connect(dsn)
    
    try:
        if method == 'POST':
            return perform_uptime_check(event, conn)
        elif method == 'GET':
            return get_uptime_stats(event, conn)
        else:
            return {
                'statusCode': 405,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Method not allowed'})
            }
    finally:
        conn.close()


def perform_uptime_check(event: Dict[str, Any], conn) -> Dict[str, Any]:
    '''Check provider URL availability and save result'''
    body_data = json.loads(event.get('body', '{}'))
    provider_id: int = body_data.get('provider_id')
    url: str = body_data.get('url')
    
    if not provider_id or not url:
        return {
            'statusCode': 400,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'provider_id and url are required'})
        }
    
    # Perform HTTP check
    start_time = time.time()
    is_available = False
    status_code: Optional[int] = None
    error_message: Optional[str] = None
    
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'VDS-Rating-Monitor/1.0'})
        with urllib.request.urlopen(req, timeout=10) as response:
            status_code = response.getcode()
            is_available = 200 <= status_code < 400
    except urllib.error.HTTPError as e:
        status_code = e.code
        error_message = f'HTTP Error: {e.code}'
        is_available = False
    except urllib.error.URLError as e:
        error_message = f'URL Error: {str(e.reason)}'
        is_available = False
    except Exception as e:
        error_message = f'Error: {str(e)}'
        is_available = False
    
    response_time_ms = int((time.time() - start_time) * 1000)
    
    # Save to database
    cursor = conn.cursor()
    cursor.execute(
        "INSERT INTO provider_uptime (provider_id, is_available, response_time_ms, status_code, error_message) "
        "VALUES (%s, %s, %s, %s, %s)",
        (provider_id, is_available, response_time_ms, status_code, error_message)
    )
    conn.commit()
    cursor.close()
    
    return {
        'statusCode': 200,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({
            'provider_id': provider_id,
            'is_available': is_available,
            'response_time_ms': response_time_ms,
            'status_code': status_code,
            'error_message': error_message
        })
    }


def get_uptime_stats(event: Dict[str, Any], conn) -> Dict[str, Any]:
    '''Get uptime statistics for provider(s)'''
    params = event.get('queryStringParameters') or {}
    provider_id = params.get('provider_id')
    days = int(params.get('days', 30))
    view = params.get('view', 'default')
    
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    
    # Monthly view - downtime by month for 2025
    if view == 'monthly':
        cursor.execute(
            "SELECT provider_id, "
            "TO_CHAR(check_time, 'YYYY-MM') as month, "
            "COUNT(*) as total_checks, "
            "SUM(CASE WHEN NOT is_available THEN 1 ELSE 0 END) as failed_checks "
            "FROM provider_uptime "
            "WHERE check_time >= '2025-01-01' "
            "GROUP BY provider_id, TO_CHAR(check_time, 'YYYY-MM') "
            "ORDER BY provider_id, month"
        )
        rows = cursor.fetchall()
        
        monthly_data = []
        for row in rows:
            # Calculate downtime in minutes (assuming checks every 5 minutes)
            downtime_minutes = int(row['failed_checks']) * 5
            monthly_data.append({
                'provider_id': int(row['provider_id']),
                'month': row['month'],
                'downtime_minutes': downtime_minutes
            })
        
        cursor.close()
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({
                'monthly_downtime': monthly_data
            })
        }
    
    if provider_id:
        # Get stats for specific provider
        provider_id = int(provider_id)
        since_date = datetime.now() - timedelta(days=days)
        
        cursor.execute(
            "SELECT COUNT(*) as total_checks, "
            "SUM(CASE WHEN is_available THEN 1 ELSE 0 END) as successful_checks, "
            "AVG(response_time_ms) as avg_response_time "
            "FROM provider_uptime "
            "WHERE provider_id = %s AND check_time >= %s",
            (provider_id, since_date)
        )
        stats = cursor.fetchone()
        
        if stats and stats['total_checks'] > 0:
            uptime_percent = (int(stats['successful_checks']) / int(stats['total_checks'])) * 100
        else:
            uptime_percent = None
        
        result = {
            'provider_id': provider_id,
            'days': days,
            'uptime_percent': round(uptime_percent, 2) if uptime_percent is not None else None,
            'total_checks': int(stats['total_checks']) if stats else 0,
            'successful_checks': int(stats['successful_checks']) if stats else 0,
            'avg_response_time_ms': round(float(stats['avg_response_time']), 2) if stats and stats['avg_response_time'] else None
        }
    else:
        # Get stats for all providers
        since_date = datetime.now() - timedelta(days=days)
        
        cursor.execute(
            "SELECT provider_id, "
            "COUNT(*) as total_checks, "
            "SUM(CASE WHEN is_available THEN 1 ELSE 0 END) as successful_checks, "
            "AVG(response_time_ms) as avg_response_time "
            "FROM provider_uptime "
            "WHERE check_time >= %s "
            "GROUP BY provider_id",
            (since_date,)
        )
        rows = cursor.fetchall()
        
        providers = []
        for row in rows:
            uptime_percent = (int(row['successful_checks']) / int(row['total_checks'])) * 100 if row['total_checks'] > 0 else 0
            providers.append({
                'provider_id': int(row['provider_id']),
                'uptime_percent': round(uptime_percent, 2),
                'total_checks': int(row['total_checks']),
                'successful_checks': int(row['successful_checks']),
                'avg_response_time_ms': round(float(row['avg_response_time']), 2) if row['avg_response_time'] else None
            })
        
        result = {
            'days': days,
            'providers': providers
        }
    
    cursor.close()
    
    return {
        'statusCode': 200,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'body': json.dumps(result)
    }