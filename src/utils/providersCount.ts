import { providers } from "@/data/providers";

/**
 * Реальное количество провайдеров в базе.
 */
export const PROVIDERS_TOTAL = providers.length;

/**
 * Округляет вниз до десятки и добавляет "+" — для SEO-текстов.
 * Гарантирует, что число никогда не будет завышено относительно реальной базы.
 * Минимум "10+", чтобы исключить кейс "0+ провайдеров".
 *
 * Примеры: 47 → "40+", 53 → "50+", 9 → "10+"
 */
export function providersLabel(total: number = PROVIDERS_TOTAL): string {
  const rounded = Math.max(10, Math.floor(total / 10) * 10);
  return `${rounded}+`;
}

export const PROVIDERS_LABEL = providersLabel();
