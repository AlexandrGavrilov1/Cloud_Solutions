import { useEffect, useState } from 'react';
import { Header } from '@/components/providers/Header';
import { UptimeChart } from '@/components/providers/UptimeChart';
import { MethodologySection } from '@/components/providers/MethodologySection';
import { Footer } from '@/components/providers/Footer';
import { providers as providersData } from '@/data/providers';

interface UptimeStats {
  provider_id: number;
  uptime_percent: number;
  total_checks: number;
  successful_checks: number;
  avg_response_time_ms: number | null;
}

interface MonthlyDowntime {
  provider_id: number;
  month: string;
  downtime_minutes: number;
}

const Uptime = () => {
  const [uptimeStats, setUptimeStats] = useState<UptimeStats[]>([]);
  const [monthlyDowntime, setMonthlyDowntime] = useState<MonthlyDowntime[]>([]);
  const [lastCheckTime, setLastCheckTime] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchUptimeStats = async () => {
      try {
        const response = await fetch('https://functions.poehali.dev/da289550-8e78-4eca-93fe-815932441ab2?days=30');
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.providers && data.providers.length > 0) {
          setUptimeStats(data.providers);
          setLastCheckTime(new Date().toLocaleTimeString('ru-RU', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          }));
        }
      } catch (error) {
        console.error('Ошибка загрузки статистики аптайма:', error);
        // Если ошибка - используем базовые значения из providers.ts
      } finally {
        setIsLoading(false);
      }
    };

    const fetchMonthlyDowntime = async () => {
      try {
        const response = await fetch('https://functions.poehali.dev/da289550-8e78-4eca-93fe-815932441ab2?view=monthly');
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.monthly_downtime && data.monthly_downtime.length > 0) {
          setMonthlyDowntime(data.monthly_downtime);
        }
      } catch (error) {
        console.error('Ошибка загрузки месячной статистики:', error);
      }
    };

    fetchUptimeStats();
    fetchMonthlyDowntime();
    
    // Обновляем данные каждые 30 секунд
    const interval = setInterval(fetchUptimeStats, 30000);

    return () => clearInterval(interval);
  }, []);

  // Объединяем данные провайдеров с актуальной статистикой
  // Используем базовые значения если мониторинг только начался (< 4896 проверок)
  const providers = providersData.map(provider => {
    const stats = uptimeStats.find(s => s.provider_id === provider.id);
    // Если мало данных (< 4896 проверок) - используем базовые значения
    const useBaselineValue = !stats || stats.total_checks < 4896;
    return {
      ...provider,
      uptime30days: useBaselineValue ? provider.uptime30days : stats.uptime_percent
    };
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <UptimeChart providers={providers} lastCheckTime={lastCheckTime} isChecking={isLoading} monthlyDowntime={monthlyDowntime} />
      <MethodologySection />
      <Footer />
    </div>
  );
};

export default Uptime;