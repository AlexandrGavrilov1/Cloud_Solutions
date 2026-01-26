const AUTH_TOKEN_KEY = 'auth_token';

export interface User {
  user_id: number;
  provider: string;
  email: string;
  name: string;
  avatar_url: string;
}

export const saveAuthToken = (token: string): void => {
  localStorage.setItem(AUTH_TOKEN_KEY, token);
};

export const getAuthToken = (): string | null => {
  return localStorage.getItem(AUTH_TOKEN_KEY);
};

export const removeAuthToken = (): void => {
  localStorage.removeItem(AUTH_TOKEN_KEY);
};

export const verifyToken = async (token: string): Promise<User | null> => {
  try {
    const response = await fetch(
      'https://functions.poehali.dev/b41c80f0-ea03-4690-aeed-e4161955b6f9?action=verify',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      }
    );

    if (response.ok) {
      const data = await response.json();
      return data.user;
    }

    return null;
  } catch (error) {
    console.error('Token verification error:', error);
    return null;
  }
};

export const getCurrentUser = async (): Promise<User | null> => {
  const token = getAuthToken();
  
  if (!token) {
    return null;
  }

  return verifyToken(token);
};

export const logout = (): void => {
  removeAuthToken();
  window.location.href = '/';
};
