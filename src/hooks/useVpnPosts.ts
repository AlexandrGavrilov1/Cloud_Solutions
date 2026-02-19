import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { VpnPost } from '@/data/vpn-posts';

const VPN_POSTS_API = "https://functions.poehali.dev/4fe9c586-cbff-4bb5-ac28-bcba699ab4f9";

// ==================== Существующие функции (без изменений) ====================
const fetchPosts = async (): Promise<VpnPost[]> => { ... };
const fetchPostBySlug = async (slug: string): Promise<VpnPost> => { ... };
const createPost = async (data: Partial<VpnPost>): Promise<VpnPost> => { ... };
const updatePost = async (data: Partial<VpnPost> & { slug: string }): Promise<VpnPost> => { ... };

// ==================== НОВАЯ ФУНКЦИЯ ДЛЯ УДАЛЕНИЯ ====================
const deletePost = async (slug: string): Promise<void> => {
  const token = localStorage.getItem('admin_token');
  if (!token) {
    throw new Error('Не найден токен авторизации');
  }
  const res = await fetch(VPN_POSTS_API, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'X-Auth-Token': token,
    },
    body: JSON.stringify({ slug }), // бэкенд ожидает slug в теле
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Ошибка удаления');
  }
};

// ==================== Хуки ====================
export const useVpnPosts = () => { ... };
export const useVpnPost = (slug?: string) => { ... };
export const useCreateVpnPost = () => { ... };
export const useUpdateVpnPost = () => { ... };

// ==================== НОВЫЙ ХУК ДЛЯ УДАЛЕНИЯ ====================
export const useDeleteVpnPost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deletePost,
    onSuccess: (_, slug) => {
      // Инвалидируем список статей
      queryClient.invalidateQueries({ queryKey: ['vpn-posts'] });
      // Инвалидируем конкретную статью (она больше не существует, но на всякий случай)
      queryClient.invalidateQueries({ queryKey: ['vpn-post', slug] });
    },
  });
};