/**
 * Яндекс.Метрика для отслеживания кликов на провайдеров
 */

// ID вашего счетчика (из index.html)
const YANDEX_METRIKA_ID = 105466349;

// Объявляем функцию ym для TypeScript
declare global {
  interface Window {
    ym?: (
      counterId: number,
      action: string,
      target?: string,
      params?: any
    ) => void;
  }
}

/**
 * Отслеживает клик на кнопку перехода на сайт провайдера
 * @param position - позиция провайдера в списке (начиная с 1)
 * @param providerName - название провайдера
 */
export const trackProviderClick = (
  position: number, 
  providerName: string
): void => {
  // Проверяем, что код выполняется в браузере
  if (typeof window === 'undefined') {
    return;
  }
  
  // Проверяем, что Яндекс.Метрика доступна
  if (!window.ym) {
    if (import.meta.env.DEV) {
      console.warn('Яндекс.Метрика не загружена');
    }
    return;
  }
  
  // Проверяем параметры
  if (!position || position < 1 || !providerName) {
    console.warn('Некорректные параметры:', { position, providerName });
    return;
  }
  
  try {
    // Отправляем событие в Яндекс.Метрику
    window.ym(YANDEX_METRIKA_ID, 'reachGoal', 'provider_click', {
      position: position,
      provider_name: providerName,
      timestamp: new Date().toISOString(),
    });
    
    // Логируем в development режиме
    if (import.meta.env.DEV) {
      console.log('📊 Яндекс.Метрика:', {
        событие: 'provider_click',
        позиция: position,
        провайдер: providerName,
      });
    }
  } catch (error) {
    console.error('❌ Ошибка Яндекс.Метрики:', error);
  }
};

/**
 * Отслеживает клик на кнопку сравнения провайдера
 * @param position - позиция провайдера
 * @param providerName - название провайдера
 * @param isAdding - true = добавление в сравнение, false = удаление
 */
export const trackComparisonClick = (
  position: number,
  providerName: string,
  isAdding: boolean
): void => {
  if (typeof window === 'undefined' || !window.ym) return;
  
  try {
    const goalName = isAdding ? 'provider_compare_add' : 'provider_compare_remove';
    
    window.ym(YANDEX_METRIKA_ID, 'reachGoal', goalName, {
      position: position,
      provider_name: providerName,
      timestamp: new Date().toISOString(),
    });
    
    if (import.meta.env.DEV) {
      console.log(`📊 Яндекс.Метрика: ${goalName}`, {
        позиция: position,
        провайдер: providerName,
      });
    }
  } catch (error) {
    console.error('❌ Ошибка Яндекс.Метрики:', error);
  }
};

/**
 * React хук для удобного использования
 */
export const useYandexMetrika = () => {
  return {
    trackProviderClick,
    trackComparisonClick,
  };
};
