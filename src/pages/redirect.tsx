import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function RedirectPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [countdown, setCountdown] = useState(2);

  useEffect(() => {
    const targetUrl = searchParams.get("targetUrl");
    const utmContent = searchParams.get("utm_content");

    // 1. Защита: если нет targetUrl – на главную
    if (!targetUrl) {
      navigate("/");
      return;
    }

    // 2. Защита по рефереру (опционально)
    const referrer = document.referrer;
    const allowedDomains = ["topcloudhub.ru", "www.topcloudhub.ru"];
    const isFromYourSite = allowedDomains.some((domain) =>
      referrer.includes(domain),
    );
    if (!isFromYourSite && process.env.NODE_ENV === "production") {
      navigate("/");
      return;
    }

    // 3. Отправка события в Яндекс.Метрику
    if (typeof window !== "undefined" && (window as any).ym) {
      (window as any).ym(105466349, "reachGoal", "redirect_start", {
        provider_id: utmContent || "unknown",
        provider_url: targetUrl,
      });
    }

    // 4. Таймер редиректа
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
  }, [searchParams, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="mb-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
        </div>
        <p className="text-lg">
          Переводим вас на страницу хостинга, пожалуйста, подождите...
        </p>
        <p className="text-sm text-gray-500 mt-2">
          Перенаправление через {countdown} сек.
        </p>
      </div>
    </div>
  );
}
