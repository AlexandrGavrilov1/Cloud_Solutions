import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useTheme } from "@/contexts/ThemeContext"; // импорт хука темы

export default function RedirectPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [countdown, setCountdown] = useState(2);
  const { theme } = useTheme(); // текущая тема: "light" или "dark"

  useEffect(() => {
    const targetUrl = searchParams.get("targetUrl");
    const utmContent = searchParams.get("utm_content");

    if (!targetUrl) {
      navigate("/");
      return;
    }

    if (typeof window !== "undefined" && (window as any).ym) {
      (window as any).ym(105466349, "reachGoal", "redirect_start", {
        provider_id: utmContent || "unknown",
        provider_url: targetUrl,
      });
    }

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

  // Выбираем гифку в зависимости от темы
  const loaderGif =
    theme === "dark"
      ? "/redirect_images/loader-dark.gif"
      : "/redirect_images/loader-light.gif";

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="text-center">
        <div className="mb-4">
          <img
            src={loaderGif}
            alt="Загрузка..."
            className="mx-auto object-contain"
            style={{ width: "150px", height: "150px" }}
          />
        </div>
        <p className="text-lg">
          Переводим вас на страницу провайдера, пожалуйста, подождите...
        </p>
        <p className="text-sm text-muted-foreground mt-2">
          Перенаправление через {countdown} сек.
        </p>
      </div>
    </div>
  );
}
