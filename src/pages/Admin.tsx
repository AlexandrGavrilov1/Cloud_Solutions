import { useState, useEffect, FormEvent } from "react";
import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";
import { AdminLogin } from "@/components/admin/AdminLogin";
import { ClickStatsSection } from "@/components/admin/ClickStatsSection";
import { ReviewModerationSection } from "@/components/admin/ReviewModerationSection";
import { ProviderStatsSection } from "@/components/admin/ProviderStatsSection";
import { generateSitemap, downloadSitemap } from "@/utils/sitemap-generator";
import { VpnPostEditor } from "@/components/admin/VpnPostEditor";
import { EventsStatsSection } from "@/components/admin/EventsStatsSection/EventsStatsSection";

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

  // OneDash API state
  const [onedashApiData, setOnedashApiData] = useState<any>(null);
  const [onedashLoading, setOnedashLoading] = useState(false);
  const [onedashError, setOnedashError] = useState("");
  const [onedashEndpoint, setOnedashEndpoint] = useState<
    "balance" | "all-orders" | "tariffs" | "systems-list" | "test-request"
  >("balance");

  // Прокси URL (заменит е н а ваш)
  const PROXY_URL =
    "https://functions.poehali.dev/5bdf179c-9b43-46eb-a042-c52b651f946c";

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

  // Функция запроса к прокси (без маппинга)
  const testOneDashAPI = async () => {
    setOnedashLoading(true);
    setOnedashError("");
    setOnedashApiData(null);

    try {
      const response = await fetch(`${PROXY_URL}?endpoint=${onedashEndpoint}`, {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status} ${response.statusText}`);
      }

      const json = await response.json();

      if (json.api_error) {
        setOnedashApiData({
          success: false,
          endpoint: json.endpoint,
          message: json.detail || "Ошибка при запросе к OneDash API",
          status: json.status,
        });
      } else {
        setOnedashApiData({
          success: true,
          endpoint: json.endpoint,
          data: json.data,
        });
      }
    } catch (error: any) {
      if (error.message.includes("Failed to fetch")) {
        setOnedashError(
          "Не удалось связаться с прокси-сервером. Проверьте URL прокси.",
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
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-1">
                  OneDash API
                </h2>
                <p className="text-sm text-muted-foreground">
                  Получение данных через прокси-сервер
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setOnedashEndpoint("balance")}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      onedashEndpoint === "balance"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground hover:bg-muted/80"
                    }`}
                  >
                    Баланс
                  </button>
                  <button
                    onClick={() => setOnedashEndpoint("all-orders")}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      onedashEndpoint === "all-orders"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground hover:bg-muted/80"
                    }`}
                  >
                    Все заказы
                  </button>
                  <button
                    onClick={() => setOnedashEndpoint("tariffs")}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      onedashEndpoint === "tariffs"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground hover:bg-muted/80"
                    }`}
                  >
                    Тарифы
                  </button>
                  <button
                    onClick={() => setOnedashEndpoint("systems-list")}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      onedashEndpoint === "systems-list"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground hover:bg-muted/80"
                    }`}
                  >
                    Список ОС
                  </button>
                  <button
                    onClick={() => setOnedashEndpoint("test-request")}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      onedashEndpoint === "test-request"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground hover:bg-muted/80"
                    }`}
                  >
                    Тест
                  </button>
                </div>
                <Button
                  onClick={testOneDashAPI}
                  disabled={onedashLoading}
                  className="flex items-center gap-2"
                >
                  {onedashLoading ? (
                    <>
                      <Icon name="Loader2" size={18} className="animate-spin" />
                      Загрузка...
                    </>
                  ) : (
                    <>
                      <Icon name="RefreshCw" size={18} />
                      Запросить
                    </>
                  )}
                </Button>
              </div>
            </div>

            <div className="bg-muted/30 rounded-lg p-4 mb-6 border border-border">
              <div className="flex items-start gap-3">
                <Icon
                  name="Info"
                  size={20}
                  className="text-primary mt-0.5 flex-shrink-0"
                />
                <div className="text-sm">
                  <p className="font-medium text-foreground mb-1">
                    Запрос к прокси:
                  </p>
                  <code className="text-xs bg-background px-2 py-1 rounded border border-border break-all">
                    {`${PROXY_URL}?endpoint=${onedashEndpoint}`}
                  </code>
                </div>
              </div>
            </div>

            {onedashError && (
              <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 mb-4">
                <p className="text-destructive font-medium">
                  Ошибка: {onedashError}
                </p>
              </div>
            )}

            {onedashApiData && (
              <div className="bg-muted/50 rounded-lg p-4 border border-border">
                <h3 className="font-semibold text-foreground mb-3">
                  Ответ API:
                </h3>
                <pre className="text-xs overflow-auto bg-background p-4 rounded border border-border">
                  {JSON.stringify(onedashApiData, null, 2)}
                </pre>
              </div>
            )}

            {!onedashApiData && !onedashLoading && !onedashError && (
              <div className="text-center py-12 text-muted-foreground">
                <Icon
                  name="Activity"
                  size={48}
                  className="mx-auto mb-4 opacity-50"
                />
                <p>Выберите эндпоинт и нажмите «Запросить»</p>
              </div>
            )}
          </div>
        )}

        {activeTab === "vpn-edit" && <VpnPostEditor />}
        {activeTab === "events" && <EventsStatsSection />}
      </div>
    </div>
  );
};

export default Admin;
