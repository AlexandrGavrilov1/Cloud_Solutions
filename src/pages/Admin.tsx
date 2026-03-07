import { useState, useEffect, FormEvent } from "react";
import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";
import { AdminLogin } from "@/components/admin/AdminLogin";
import { ClickStatsSection } from "@/components/admin/ClickStatsSection";
import { ReviewModerationSection } from "@/components/admin/ReviewModerationSection";
import { ProviderStatsSection } from "@/components/admin/ProviderStatsSection";
import { generateSitemap, downloadSitemap } from "@/utils/sitemap-generator";
import { VpnPostEditor } from "@/components/admin/VpnPostEditor";
// ===== НОВЫЙ ИМПОРТ =====
import { EventsStatsSection } from "@/components/admin/EventsStatsSection/EventsStatsSection";
// ========================

interface Review {
  id: number;
  provider_id: number;
  author: string;
  text: string;
  rating: number;
  date: string;
}

interface ClickStats {
  provider_id: number;
  clicks: number;
  first_click: string | null;
  last_click: string | null;
}

interface DailyStats {
  provider_id: number;
  date: string;
  clicks: number;
}

const Admin = () => {
  // ✅ Сброс прокрутки в начало при монтировании
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [pendingReviews, setPendingReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [processingId, setProcessingId] = useState<number | null>(null);
  const [clickStats, setClickStats] = useState<ClickStats[]>([]);
  const [isLoadingStats, setIsLoadingStats] = useState(true);
  const [dailyStats, setDailyStats] = useState<DailyStats[]>([]);
  const [isLoadingDaily, setIsLoadingDaily] = useState(true);
  const [period, setPeriod] = useState<"1" | "7" | "30">("30");
  const [activeTab, setActiveTab] = useState<
    "stats" | "providers" | "reviews" | "onedash" | "vpn-edit" | "events"
  >("stats");
  const [onedashApiData, setOnedashApiData] = useState<any>(null);
  const [onedashLoading, setOnedashLoading] = useState(false);
  const [onedashError, setOnedashError] = useState("");
  const [onedashEndpoint, setOnedashEndpoint] = useState<
    "balance" | "stats" | "registrations"
  >("stats");

  const fetchPendingReviews = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        "https://functions.poehali.dev/15bd2bf9-a831-4ef9-9ce3-fd6c7823ddc8?status=pending",
      );
      if (response.ok) {
        const data = await response.json();
        setPendingReviews(data.reviews || []);
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchClickStats = async () => {
    setIsLoadingStats(true);
    try {
      const response = await fetch(
        "https://functions.poehali.dev/d0b8e2ce-45c2-4ab9-8d08-baf03c0268f4",
      );
      if (response.ok) {
        const data = await response.json();
        setClickStats(data.stats || []);
      }
    } catch (error) {
      console.error("Error fetching click stats:", error);
    } finally {
      setIsLoadingStats(false);
    }
  };

  const fetchDailyStats = async (days: string = "30") => {
    setIsLoadingDaily(true);
    try {
      const response = await fetch(
        `https://functions.poehali.dev/d0b8e2ce-45c2-4ab9-8d08-baf03c0268f4?view=daily&period=${days}`,
      );
      if (response.ok) {
        const data = await response.json();
        setDailyStats(data.daily_stats || []);
      }
    } catch (error) {
      console.error("Error fetching daily stats:", error);
    } finally {
      setIsLoadingDaily(false);
    }
  };

  useEffect(() => {
    const savedToken = localStorage.getItem("admin_token");
    if (savedToken) {
      verifyToken(savedToken);
    } else {
      setIsLoading(false);
    }
  }, []);

  const verifyToken = async (token: string) => {
    try {
      const response = await fetch(
        "https://functions.poehali.dev/ccab6b74-68f9-4520-ad0e-701c27393f9d",
        {
          method: "GET",
          headers: {
            "X-Auth-Token": token,
          },
        },
      );

      if (response.ok) {
        setIsAuthenticated(true);
        fetchPendingReviews();
        fetchClickStats();
        fetchDailyStats(period);
      } else {
        localStorage.removeItem("admin_token");
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Error verifying token:", error);
      localStorage.removeItem("admin_token");
      setIsLoading(false);
    }
  };

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setIsAuthenticating(true);
    setAuthError("");

    try {
      const response = await fetch(
        "https://functions.poehali.dev/ccab6b74-68f9-4520-ad0e-701c27393f9d",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username,
            password,
          }),
        },
      );

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("admin_token", data.token);
        setIsAuthenticated(true);
        setPassword("");
        fetchPendingReviews();
        fetchClickStats();
        fetchDailyStats(period);
      } else {
        setAuthError(data.error || "Неверные учётные данные");
      }
    } catch (error) {
      console.error("Error logging in:", error);
      setAuthError("Ошибка подключения к серверу");
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("admin_token");
    setPassword("");
    setUsername("admin");
  };

  const handleReviewAction = async (
    reviewId: number,
    action: "approve" | "reject" | "delete",
  ) => {
    setProcessingId(reviewId);
    const token = localStorage.getItem("admin_token");

    try {
      const response = await fetch(
        "https://functions.poehali.dev/15bd2bf9-a831-4ef9-9ce3-fd6c7823ddc8",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "X-Auth-Token": token || "",
          },
          body: JSON.stringify({
            review_id: reviewId,
            action: action,
          }),
        },
      );

      if (response.ok) {
        setPendingReviews(pendingReviews.filter((r) => r.id !== reviewId));
      } else if (response.status === 401) {
        localStorage.removeItem("admin_token");
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error("Error processing review:", error);
    } finally {
      setProcessingId(null);
    }
  };

  const handlePeriodChange = (newPeriod: "1" | "7" | "30") => {
    setPeriod(newPeriod);
    fetchDailyStats(newPeriod);
  };

  const testOneDashAPI = async () => {
    setOnedashLoading(true);
    setOnedashError("");
    setOnedashApiData(null);

    try {
      const response = await fetch(
        `https://rdp-onedash.ru/web-api/${onedashEndpoint}`,
        {
          method: "POST",
          mode: "cors",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            key: "79b2457a7346187f969c053b571eb45e71df1b02",
          }),
        },
      );

      const contentType = response.headers.get("content-type");
      const text = await response.text();

      if (contentType?.includes("application/json")) {
        try {
          const data = JSON.parse(text);
          setOnedashApiData({
            success: true,
            endpoint: onedashEndpoint,
            data,
          });
        } catch {
          setOnedashApiData({
            success: false,
            endpoint: onedashEndpoint,
            message: "Невалидный JSON",
            raw: text.substring(0, 500),
          });
        }
      } else {
        setOnedashApiData({
          success: false,
          endpoint: onedashEndpoint,
          message:
            "API вернул HTML вместо JSON. Защита от прямых запросов активна.",
          hint: "Для получения данных используйте официальный веб-интерфейс OneDash или свяжитесь с поддержкой для получения документации API.",
          response_type: contentType || "text/html",
          raw_preview: text.substring(0, 300),
        });
      }
    } catch (error: any) {
      if (error.message.includes("Failed to fetch")) {
        setOnedashError(
          "CORS: API OneDash блокирует прямые запросы из браузера. Нужен серверный прокси или использование официального интерфейса.",
        );
      } else {
        setOnedashError(error.message || "Ошибка подключения");
      }
    } finally {
      setOnedashLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <AdminLogin
        username={username}
        password={password}
        authError={authError}
        isAuthenticating={isAuthenticating}
        onUsernameChange={setUsername}
        onPasswordChange={setPassword}
        onSubmit={handleLogin}
      />
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">
              Админ-панель
            </h1>
            <p className="text-muted-foreground">
              Управление отзывами и статистика
            </p>
          </div>
          <div className="flex gap-3">
            <Button
              variant="default"
              onClick={downloadSitemap}
              className="flex items-center gap-2"
            >
              <Icon name="Download" size={18} />
              Скачать Sitemap
            </Button>
            <Button
              variant="outline"
              onClick={handleLogout}
              className="flex items-center gap-2 border-destructive text-destructive hover:bg-destructive/10"
            >
              <Icon name="LogOut" size={18} />
              Выйти
            </Button>
            <Button
              variant="outline"
              onClick={() => (window.location.href = "/")}
              className="flex items-center gap-2"
            >
              <Icon name="Home" size={18} />
              На главную
            </Button>
          </div>
        </div>

        <div className="flex gap-3 mb-6 border-b border-border">
          <button
            onClick={() => setActiveTab("stats")}
            className={`pb-3 px-4 font-medium transition-colors border-b-2 -mb-px flex items-center gap-2 ${
              activeTab === "stats"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <Icon name="BarChart3" size={18} />
            Статистика кликов
          </button>
          <button
            onClick={() => setActiveTab("providers")}
            className={`pb-3 px-4 font-medium transition-colors border-b-2 -mb-px flex items-center gap-2 ${
              activeTab === "providers"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <Icon name="Building2" size={18} />
            Провайдеры
          </button>
          <button
            onClick={() => setActiveTab("reviews")}
            className={`pb-3 px-4 font-medium transition-colors border-b-2 -mb-px flex items-center gap-2 ${
              activeTab === "reviews"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <Icon name="MessageSquare" size={18} />
            Модерация отзывов
            {pendingReviews.length > 0 && (
              <span className="bg-destructive text-destructive-foreground text-xs px-2 py-0.5 rounded-full">
                {pendingReviews.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab("onedash")}
            className={`pb-3 px-4 font-medium transition-colors border-b-2 -mb-px flex items-center gap-2 ${
              activeTab === "onedash"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <Icon name="Activity" size={18} />
            OneDash API
          </button>
          <button
            onClick={() => setActiveTab("vpn-edit")}
            className={`pb-3 px-4 font-medium transition-colors border-b-2 -mb-px flex items-center gap-2 ${
              activeTab === "vpn-edit"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <Icon name="Edit" size={18} />
            Редактор VPN
          </button>
          {/* ===== НОВАЯ ВКЛАДКА ===== */}
          <button
            onClick={() => setActiveTab("events")}
            className={`pb-3 px-4 font-medium transition-colors border-b-2 -mb-px flex items-center gap-2 ${
              activeTab === "events"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <Icon name="BarChart3" size={18} />
            Полная аналитика
          </button>
          {/* ========================= */}
        </div>

        {activeTab === "stats" && (
          <ClickStatsSection
            clickStats={clickStats}
            isLoadingStats={isLoadingStats}
            dailyStats={dailyStats}
            isLoadingDaily={isLoadingDaily}
            period={period}
            onPeriodChange={handlePeriodChange}
          />
        )}

        {activeTab === "providers" && <ProviderStatsSection />}

        {activeTab === "reviews" && (
          <ReviewModerationSection
            pendingReviews={pendingReviews}
            isLoading={isLoading}
            processingId={processingId}
            onReviewAction={handleReviewAction}
          />
        )}

        {activeTab === "onedash" && (
          <div className="bg-card rounded-lg shadow-md p-6 border border-border">
            {/* содержимое OneDash */}
          </div>
        )}

        {activeTab === "vpn-edit" && <VpnPostEditor />}

        {/* ===== СОДЕРЖИМОЕ НОВОЙ ВКЛАДКИ ===== */}
        {activeTab === "events" && <EventsStatsSection />}
        {/* =================================== */}
      </div>
    </div>
  );
};

export default Admin;
