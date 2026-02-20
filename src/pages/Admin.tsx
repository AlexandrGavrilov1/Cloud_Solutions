import { useState, useEffect, FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { AdminLogin } from '@/components/admin/AdminLogin';
import { ClickStatsSection } from '@/components/admin/ClickStatsSection';
import { ReviewModerationSection } from '@/components/admin/ReviewModerationSection';
import { generateSitemap, downloadSitemap } from '@/utils/sitemap-generator';

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
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [pendingReviews, setPendingReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [processingId, setProcessingId] = useState<number | null>(null);
  const [clickStats, setClickStats] = useState<ClickStats[]>([]);
  const [isLoadingStats, setIsLoadingStats] = useState(true);
  const [dailyStats, setDailyStats] = useState<DailyStats[]>([]);
  const [isLoadingDaily, setIsLoadingDaily] = useState(true);
  const [period, setPeriod] = useState<'1' | '7' | '30'>('30');

  const fetchPendingReviews = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('https://functions.poehali.dev/15bd2bf9-a831-4ef9-9ce3-fd6c7823ddc8?status=pending');
      if (response.ok) {
        const data = await response.json();
        setPendingReviews(data.reviews || []);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchClickStats = async () => {
    setIsLoadingStats(true);
    try {
      const response = await fetch('https://functions.poehali.dev/d0b8e2ce-45c2-4ab9-8d08-baf03c0268f4');
      if (response.ok) {
        const data = await response.json();
        setClickStats(data.stats || []);
      }
    } catch (error) {
      console.error('Error fetching click stats:', error);
    } finally {
      setIsLoadingStats(false);
    }
  };

  const fetchDailyStats = async (days: string = '30') => {
    setIsLoadingDaily(true);
    try {
      const response = await fetch(`https://functions.poehali.dev/d0b8e2ce-45c2-4ab9-8d08-baf03c0268f4?view=daily&period=${days}`);
      if (response.ok) {
        const data = await response.json();
        setDailyStats(data.daily_stats || []);
      }
    } catch (error) {
      console.error('Error fetching daily stats:', error);
    } finally {
      setIsLoadingDaily(false);
    }
  };


  useEffect(() => {
    const savedToken = localStorage.getItem('admin_token');
    if (savedToken) {
      verifyToken(savedToken);
    } else {
      setIsLoading(false);
    }
  }, []);

  const verifyToken = async (token: string) => {
    try {
      const response = await fetch('https://functions.poehali.dev/ccab6b74-68f9-4520-ad0e-701c27393f9d', {
        method: 'GET',
        headers: {
          'X-Auth-Token': token,
        },
      });

      if (response.ok) {
        setIsAuthenticated(true);
        fetchPendingReviews();
        fetchClickStats();
        fetchDailyStats(period);
      } else {
        localStorage.removeItem('admin_token');
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Error verifying token:', error);
      localStorage.removeItem('admin_token');
      setIsLoading(false);
    }
  };

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setIsAuthenticating(true);
    setAuthError('');

    try {
      const response = await fetch('https://functions.poehali.dev/ccab6b74-68f9-4520-ad0e-701c27393f9d', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('admin_token', data.token);
        setIsAuthenticated(true);
        setPassword('');
        fetchPendingReviews();
        fetchClickStats();
        fetchDailyStats(period);
      } else {
        setAuthError(data.error || 'Неверные учётные данные');
      }
    } catch (error) {
      console.error('Error logging in:', error);
      setAuthError('Ошибка подключения к серверу');
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('admin_token');
    setPassword('');
    setUsername('admin');
  };

  const handleReviewAction = async (reviewId: number, action: 'approve' | 'reject' | 'delete') => {
    setProcessingId(reviewId);
    const token = localStorage.getItem('admin_token');
    
    try {
      const response = await fetch('https://functions.poehali.dev/15bd2bf9-a831-4ef9-9ce3-fd6c7823ddc8', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-Auth-Token': token || '',
        },
        body: JSON.stringify({
          review_id: reviewId,
          action: action,
        }),
      });

      if (response.ok) {
        setPendingReviews(pendingReviews.filter(r => r.id !== reviewId));
      } else if (response.status === 401) {
        localStorage.removeItem('admin_token');
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('Error processing review:', error);
    } finally {
      setProcessingId(null);
    }
  };

  const handlePeriodChange = (newPeriod: '1' | '7' | '30') => {
    setPeriod(newPeriod);
    fetchDailyStats(newPeriod);
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
            <h1 className="text-4xl font-bold text-foreground mb-2">Админ-панель</h1>
            <p className="text-muted-foreground">Управление отзывами и статистика</p>
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
              onClick={() => window.location.href = '/'}
              className="flex items-center gap-2"
            >
              <Icon name="Home" size={18} />
              На главную
            </Button>
          </div>
        </div>

        <ClickStatsSection
          clickStats={clickStats}
          isLoadingStats={isLoadingStats}
          dailyStats={dailyStats}
          isLoadingDaily={isLoadingDaily}
          period={period}
          onPeriodChange={handlePeriodChange}
        />

        <ReviewModerationSection
          pendingReviews={pendingReviews}
          isLoading={isLoading}
          processingId={processingId}
          onReviewAction={handleReviewAction}
        />
      </div>
    </div>
  );
};

export default Admin;