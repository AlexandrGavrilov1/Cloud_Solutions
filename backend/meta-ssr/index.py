import json
import re
from datetime import datetime

MONTHS_RU = [
    "январь", "февраль", "март", "апрель", "май", "июнь",
    "июль", "август", "сентябрь", "октябрь", "ноябрь", "декабрь",
]

MONTH_REGEX = re.compile(
    r"(" + "|".join(MONTHS_RU) + r")\s+\d{4}", re.IGNORECASE
)
YEAR_REGEX = re.compile(r"\b20\d{2}\b")


def get_current_date_phrase():
    now = datetime.now()
    return f"{MONTHS_RU[now.month - 1]} {now.year}", now.year


def providers_label(total: int) -> str:
    """Округляет вниз до десятки, минимум 10+."""
    if total < 10:
        return "10+"
    return f"{(total // 10) * 10}+"


def build_meta_html(date_phrase: str, year: int, plabel: str) -> dict:
    title = (
        f"Рейтинг хостингов {year} — Сравнение {plabel} провайдеров | "
        "Реальные отзывы и цены"
    )
    description = (
        f"Независимый рейтинг VPS хостинга с актуальными ценами на "
        f"{date_phrase}. Сравните {plabel} провайдеров: Hetzner, Timeweb, "
        "REG.RU, DigitalOcean. Калькулятор стоимости, отзывы клиентов, "
        "152-ФЗ, uptime статистика."
    )
    og_image_alt = f"Рейтинг VPS хостинга {year} — Сравнение провайдеров"
    twitter_title = (
        f"Рейтинг VPS хостинга {year} — Сравнение {plabel} провайдеров"
    )
    schema_desc = (
        f"Независимый рейтинг VPS хостинга с актуальными ценами на "
        f"{date_phrase}. Сравните {plabel} провайдеров"
    )

    return {
        "title": title,
        "description": description,
        "og_image_alt": og_image_alt,
        "twitter_title": twitter_title,
        "schema_description": schema_desc,
        "date_phrase": date_phrase,
        "year": year,
        "providers_label": plabel,
    }


def handler(event: dict, context) -> dict:
    """SSR мета-тегов: возвращает актуальные title/description/og с текущей датой
    для поисковых ботов и соц-сетей до выполнения JS."""

    if event.get("httpMethod") == "OPTIONS":
        return {
            "statusCode": 200,
            "headers": {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET, OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type",
                "Access-Control-Max-Age": "86400",
            },
            "body": "",
        }

    date_phrase, year = get_current_date_phrase()

    # Счётчик провайдеров приходит из фронта (single source of truth).
    # Без параметра — безопасный дефолт 50+.
    qs = event.get("queryStringParameters") or {}
    try:
        total = int(qs.get("providers", "50"))
    except (TypeError, ValueError):
        total = 50
    plabel = providers_label(total)

    meta = build_meta_html(date_phrase, year, plabel)

    return {
        "statusCode": 200,
        "headers": {
            "Access-Control-Allow-Origin": "*",
            "Content-Type": "application/json",
            "Cache-Control": "public, max-age=3600",
        },
        "body": json.dumps(meta, ensure_ascii=False),
        "isBase64Encoded": False,
    }