import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { VpnPost } from '@/data/vpn-posts';

const VPN_POSTS_API = "https://functions.poehali.dev/4fe9c586-cbff-4bb5-ac28-bcba699ab4f9";

// Получение списка всех статей
const fetchPosts = async (): Promise<VpnPost[]> => {
  const res = await fetch(VPN_POSTS_API);
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.error || 'Ошибка загрузки списка статей');
  }
  return res.json();
};

// Получение одной статьи по slug
const fetchPostBySlug = async (slug: string): Promise<VpnPost> => {
  const res = await fetch(`${VPN_POSTS_API}?slug=${slug}`);
  if (!res.ok) {
    if (res.status === 404) {
      throw new Error('Статья не найдена');
    }
    const error = await res.json().catch(() => ({}));
    throw new Error(error.error || 'Ошибка загрузки статьи');
  }
  return res.json();
};

// Обновление статьи (PUT)
const updatePost = async (data: Partial<VpnPost> & { slug: string }) => {
  const token = localStorage.getItem('admin_token');
  if (!token) {
    throw new Error('Не найден токен авторизации');
  }
  const res = await fetch(VPN_POSTS_API, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'X-Auth-Token': token,
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Ошибка сохранения');
  }
  const result = await res.json();
  // Ожидаем, что бэкенд возвращает { success: true, post: {...} }
  return result.post as VpnPost;
};

// Хук для получения списка статей
export const useVpnPosts = () => {
  return useQuery({
    queryKey: ['vpn-posts'],
    queryFn: fetchPosts,
    staleTime: 5 * 60 * 1000, // 5 минут кеширования
  });
};

// Хук для получения одной статьи
export const useVpnPost = (slug?: string) => {
  return useQuery({
    queryKey: ['vpn-post', slug],
    queryFn: () => fetchPostBySlug(slug!),
    enabled: !!slug, // запрос выполняется только если slug передан
    staleTime: 5 * 60 * 1000,
  });
};

// Хук для мутации (обновления статьи)
export const useUpdateVpnPost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updatePost,
    onSuccess: (updatedPost) => {
      // Инвалидируем список статей
      queryClient.invalidateQueries({ queryKey: ['vpn-posts'] });
      // Инвалидируем конкретную статью
      queryClient.invalidateQueries({ queryKey: ['vpn-post', updatedPost.slug] });
    },
  });
};
