import json
import os
import urllib.request
import urllib.error


SYSTEM_PROMPT = """Ты — облачный архитектор. Анализируешь запрос пользователя и возвращаешь СТРОГО JSON без markdown.

Поля:
- type: "saas" | "ai" | "bot" | "ecommerce" | "gaming" | "highload" | "static" | "default"
- users: число (оценка кол-ва пользователей)
- workload: "low" | "medium" | "high"
- realtime: bool (нужен ли realtime/websocket)
- needsGpu: bool
- needsDb: bool
- region: "RU" | "EU" | "US" | "ALL"
- summary: string (1-2 предложения, что понял из запроса, на русском)

Только JSON, без обёрток ```json."""


def call_openai(api_key: str, user_input: str) -> dict:
    url = "https://api.openai.com/v1/chat/completions"
    payload = {
        "model": "gpt-4o-mini",
        "messages": [
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": user_input},
        ],
        "temperature": 0.2,
        "response_format": {"type": "json_object"},
    }
    req = urllib.request.Request(
        url,
        data=json.dumps(payload).encode("utf-8"),
        headers={
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json",
        },
        method="POST",
    )
    with urllib.request.urlopen(req, timeout=20) as resp:
        data = json.loads(resp.read().decode("utf-8"))
    content = data["choices"][0]["message"]["content"]
    return json.loads(content)


def normalize(parsed: dict, raw: str) -> dict:
    valid_types = {"saas", "ai", "bot", "ecommerce", "gaming", "highload", "static", "default"}
    valid_workload = {"low", "medium", "high"}
    valid_region = {"RU", "EU", "US", "ALL"}

    t = parsed.get("type", "default")
    if t not in valid_types:
        t = "default"

    w = parsed.get("workload", "medium")
    if w not in valid_workload:
        w = "medium"

    r = parsed.get("region", "ALL")
    if r not in valid_region:
        r = "ALL"

    try:
        users = int(parsed.get("users", 1000))
    except (TypeError, ValueError):
        users = 1000
    users = max(1, min(users, 10_000_000))

    return {
        "type": t,
        "users": users,
        "workload": w,
        "realtime": bool(parsed.get("realtime", False)),
        "needsGpu": bool(parsed.get("needsGpu", False)),
        "needsDb": bool(parsed.get("needsDb", True)),
        "region": r,
        "summary": str(parsed.get("summary", ""))[:300],
        "raw": raw,
    }


def handler(event: dict, context) -> dict:
    """AI-парсер запросов: текст пользователя -> структурированный intent через LLM."""
    method = event.get("httpMethod", "GET")

    cors = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
    }

    if method == "OPTIONS":
        return {"statusCode": 200, "headers": cors, "body": ""}

    if method != "POST":
        return {
            "statusCode": 405,
            "headers": cors,
            "body": json.dumps({"error": "Method not allowed"}),
        }

    try:
        body = json.loads(event.get("body") or "{}")
    except json.JSONDecodeError:
        return {
            "statusCode": 400,
            "headers": cors,
            "body": json.dumps({"error": "Invalid JSON"}),
        }

    user_input = (body.get("input") or "").strip()
    if not user_input:
        return {
            "statusCode": 400,
            "headers": cors,
            "body": json.dumps({"error": "input required"}),
        }
    if len(user_input) > 1000:
        user_input = user_input[:1000]

    api_key = os.environ.get("OPENAI_API_KEY")
    if not api_key:
        return {
            "statusCode": 503,
            "headers": cors,
            "body": json.dumps({"error": "OPENAI_API_KEY not configured"}),
        }

    try:
        parsed = call_openai(api_key, user_input)
    except urllib.error.HTTPError as e:
        return {
            "statusCode": 502,
            "headers": cors,
            "body": json.dumps({"error": f"LLM error: {e.code}"}),
        }
    except Exception as e:
        return {
            "statusCode": 500,
            "headers": cors,
            "body": json.dumps({"error": str(e)[:200]}),
        }

    result = normalize(parsed, user_input)

    return {
        "statusCode": 200,
        "headers": {**cors, "Content-Type": "application/json"},
        "body": json.dumps(result, ensure_ascii=False),
    }
