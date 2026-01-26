import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Icon from '@/components/ui/icon';
import { saveAuthToken } from '@/lib/auth';

export const AuthCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const token = searchParams.get('token');
    const error = searchParams.get('error');

    if (error) {
      setStatus('error');
      setErrorMessage(error);
      setTimeout(() => navigate('/'), 3000);
      return;
    }

    if (token) {
      saveAuthToken(token);
      setStatus('success');
      setTimeout(() => navigate('/'), 1500);
      return;
    }

    setStatus('error');
    setErrorMessage('Неизвестная ошибка авторизации');
    setTimeout(() => navigate('/'), 3000);
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-6 p-8 max-w-md">
        {status === 'loading' && (
          <>
            <Icon name="Loader2" size={64} className="animate-spin text-primary mx-auto" />
            <h2 className="text-2xl font-bold text-foreground">Авторизация...</h2>
            <p className="text-muted-foreground">Пожалуйста, подождите</p>
          </>
        )}

        {status === 'success' && (
          <>
            <Icon name="CheckCircle" size={64} className="text-green-500 mx-auto" />
            <h2 className="text-2xl font-bold text-foreground">Успешно!</h2>
            <p className="text-muted-foreground">Вы вошли в систему</p>
          </>
        )}

        {status === 'error' && (
          <>
            <Icon name="XCircle" size={64} className="text-red-500 mx-auto" />
            <h2 className="text-2xl font-bold text-foreground">Ошибка</h2>
            <p className="text-muted-foreground">{errorMessage}</p>
            <p className="text-sm text-muted-foreground">Перенаправление на главную...</p>
          </>
        )}
      </div>
    </div>
  );
};

export default AuthCallback;
