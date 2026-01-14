'''
Business: Track and retrieve click statistics for provider links
Args: event - dict with httpMethod, body, queryStringParameters
      context - object with attributes: request_id, function_name, function_version
Returns: HTTP response dict with click statistics
'''

import json
import os
from typing import Dict, Any
import psycopg2
from psycopg2.extras import RealDictCursor

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-Auth-Token',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    dsn = os.environ.get('DATABASE_URL')
    if not dsn:
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Database connection not configured'}),
            'isBase64Encoded': False
        }
    
    conn = psycopg2.connect(dsn)
    
    if method == 'POST':
        body_data = json.loads(event.get('body', '{}'))
        provider_id = body_data.get('provider_id')
        
        if not provider_id:
            conn.close()
            return {
                'statusCode': 400,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'error': 'provider_id is required'}),
                'isBase64Encoded': False
            }
        
        headers = event.get('headers', {})
        user_ip = (
            headers.get('X-Forwarded-For', '').split(',')[0].strip() or
            headers.get('x-forwarded-for', '').split(',')[0].strip() or
            headers.get('X-Real-IP', '') or
            headers.get('x-real-ip', '') or
            event.get('requestContext', {}).get('identity', {}).get('sourceIp', 'unknown')
        )
        
        with conn.cursor() as cur:
            cur.execute(
                "INSERT INTO provider_clicks (provider_id, user_ip) VALUES (%s, %s) ON CONFLICT (provider_id, user_ip) DO UPDATE SET clicked_at = CURRENT_TIMESTAMP",
                (provider_id, user_ip)
            )
            conn.commit()
        
        conn.close()
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'success': True}),
            'isBase64Encoded': False
        }
    
    if method == 'GET':
        params = event.get('queryStringParameters', {}) or {}
        view = params.get('view', 'summary')
        period = params.get('period', '30')
        month = params.get('month', None)
        
        with conn.cursor(cursor_factory=RealDictCursor) as cur:
            if view == 'daily':
                days = int(period) if period.isdigit() else 30
                cur.execute("""
                    SELECT 
                        provider_id,
                        DATE(clicked_at) as date,
                        COUNT(DISTINCT user_ip) as clicks
                    FROM provider_clicks
                    WHERE clicked_at >= CURRENT_DATE - %s AND user_ip IS NOT NULL
                    GROUP BY provider_id, DATE(clicked_at)
                    ORDER BY date DESC, provider_id
                """, (days,))
                
                daily_stats = cur.fetchall()
                
                result = []
                for row in daily_stats:
                    result.append({
                        'provider_id': row['provider_id'],
                        'date': row['date'].isoformat() if row['date'] else None,
                        'clicks': row['clicks']
                    })
                
                conn.close()
                
                return {
                    'statusCode': 200,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': json.dumps({'daily_stats': result}),
                    'isBase64Encoded': False
                }
            
            else:
                if month:
                    cur.execute("""
                        SELECT 
                            provider_id,
                            COUNT(DISTINCT user_ip) as clicks,
                            MIN(clicked_at) as first_click,
                            MAX(clicked_at) as last_click
                        FROM provider_clicks
                        WHERE user_ip IS NOT NULL 
                        AND TO_CHAR(clicked_at, 'YYYY-MM') = %s
                        GROUP BY provider_id
                        ORDER BY clicks DESC
                    """, (month,))
                else:
                    cur.execute("""
                        SELECT 
                            provider_id,
                            COUNT(DISTINCT user_ip) as clicks,
                            MIN(clicked_at) as first_click,
                            MAX(clicked_at) as last_click
                        FROM provider_clicks
                        WHERE user_ip IS NOT NULL
                        GROUP BY provider_id
                        ORDER BY clicks DESC
                    """)
                
                stats = cur.fetchall()
        
        conn.close()
        
        result = []
        for row in stats:
            result.append({
                'provider_id': row['provider_id'],
                'clicks': row['clicks'],
                'first_click': row['first_click'].isoformat() if row['first_click'] else None,
                'last_click': row['last_click'].isoformat() if row['last_click'] else None
            })
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'stats': result}),
            'isBase64Encoded': False
        }
    
    return {
        'statusCode': 405,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        'body': json.dumps({'error': 'Method not allowed'}),
        'isBase64Encoded': False
    }