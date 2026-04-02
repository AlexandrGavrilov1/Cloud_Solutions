// pages/redirect.tsx (Next.js pages router)
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

export default function RedirectPage() {
  const router = useRouter();
  const [countdown, setCountdown] = useState(2);

  useEffect(() => {
    const { targetUrl, utm_source, utm_medium, utm_campaign, utm_content } = router.query;

    // Защита: если нет targetUrl
    if (!targetUrl || typeof targetUrl !== 'string') {
      router.replace('/');
      return;
    }

    // Защита по рефереру (опционально, но улучшает безопасность)
    const referrer = document.referrer;
    const allowedDomains = ['ваш-сайт.ru', 'www.ваш-сайт.ru']; // замените на свой домен
    const isFromYourSite = allowedDomains.some(domain => referrer.includes(domain));
    if (!isFromYourSite && process.env.NODE_ENV === 'production') {
      router.replace('/');
      return;
    }

    // Отправка события в Яндекс.Метрику
    if (typeof window !== 'undefined' && (window as any).ym) {
      (window as any).ym(105466349, 'reachGoal', 'redirect_start', {
        provider_id: utm_content || 'unknown',
        provider_url: targetUrl,
      });
    }

    // Таймер редиректа
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          window.location.href = decodeURIComponent(targetUrl);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [router.query, router]);

  return (
    <>
      <Head>
        <meta name="robots" content="noindex, nofollow" />
        <title>Перенаправление...</title>
      </Head>
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="mb-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
          </div>
          <p className="text-lg">Переводим вас на страницу хостинга, пожалуйста, подождите...</p>
          <p className="text-sm text-gray-500 mt-2">Перенаправление через {countdown} сек.</p>
        </div>
      </div>
    </>
  );
}
