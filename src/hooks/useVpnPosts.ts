import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { VpnPost } from "@/data/vpn-posts";

const VPN_POSTS_API =
  "https://functions.poehali.dev/4fe9c586-cbff-4bb5-ac28-bcba699ab4f9";

// ==================== Вспомогательные функции ====================

/**
 * Преобразует поля из snake_case (как в БД) в camelCase (как в интерфейсе)
 */
const transformPost = (data: any): VpnPost => {
  return {
    ...data,
    providerUrl: data.provider_url,
    providerName: data.provider_name,
    readTime: data.read_time,
  };
};

// ==================== GET-запросы ====================

/**
 * Получение списка всех статей (без контента)
 */
const fetchPosts = async (): Promise<VpnPost[]> => {
  const res = await fetch(VPN_POSTS_API);
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.error || "Ошибка загрузки списка статей");
  }
  const data = await res.json();
  return data.map(transformPost);
};

/**
 * Получение одной статьи по slug (с полным контентом)
 */
const fetchPostBySlug = async (slug: string): Promise<VpnPost> => {
  const res = await fetch(`${VPN_POSTS_API}?slug=${slug}`);
  if (!res.ok) {
    if (res.status === 404) {
      throw new Error("Статья не найдена");
    }
    const error = await res.json().catch(() => ({}));
    throw new Error(error.error || "Ошибка загрузки статьи");
  }
  const data = await res.json();
  return transformPost(data);
};

// ==================== POST-запрос (создание) ====================

/**
 * Создание новой статьи
 */
const createPost = async (data: Partial<VpnPost>): Promise<VpnPost> => {
  const token = localStorage.getItem("admin_token");
  if (!token) {
    throw new Error("Не найден токен авторизации");
  }
  const res = await fetch(VPN_POSTS_API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Auth-Token": token,
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || "Ошибка создания");
  }
  return transformPost(await res.json());
};

// ==================== PUT-запрос (обновление) ====================

/**
 * Обновление существующей статьи
 */
const updatePost = async (
  data: Partial<VpnPost> & { slug: string },
): Promise<VpnPost> => {
  const token = localStorage.getItem("admin_token");
  if (!token) {
    throw new Error("Не найден токен авторизации");
  }
  const res = await fetch(VPN_POSTS_API, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "X-Auth-Token": token,
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || "Ошибка сохранения");
  }
  const result = await res.json();
  // Предполагается, что PUT возвращает обновлённый объект статьи
  return transformPost(result);
};

// ==================== DELETE-запрос (удаление) ====================

/**
 * Удаление статьи по slug
 */
const deletePost = async (slug: string): Promise<void> => {
  const token = localStorage.getItem("admin_token");
  if (!token) {
    throw new Error("Не найден токен авторизации");
  }
  const res = await fetch(VPN_POSTS_API, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      "X-Auth-Token": token,
    },
    body: JSON.stringify({ slug }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || "Ошибка удаления");
  }
};

// ==================== Хуки ====================

/**
 * Хук для получения списка всех статей
 */
export const useVpnPosts = () => {
  return useQuery({
    queryKey: ["vpn-posts"],
    queryFn: fetchPosts,
    staleTime: 5 * 60 * 1000, // 5 минут
  });
};

/**
 * Хук для получения одной статьи по slug
 */
export const useVpnPost = (slug?: string) => {
  return useQuery({
    queryKey: ["vpn-post", slug],
    queryFn: () => fetchPostBySlug(slug!),
    enabled: !!slug,
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * Хук для создания новой статьи
 */
export const useCreateVpnPost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createPost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vpn-posts"] });
    },
  });
};

/**
 * Хук для обновления существующей статьи
 */
export const useUpdateVpnPost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updatePost,
    onSuccess: (updatedPost) => {
      queryClient.invalidateQueries({ queryKey: ["vpn-posts"] });
      queryClient.invalidateQueries({
        queryKey: ["vpn-post", updatedPost.slug],
      });
    },
  });
};

/**
 * Хук для удаления статьи
 */
export const useDeleteVpnPost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deletePost,
    onSuccess: (_, slug) => {
      queryClient.invalidateQueries({ queryKey: ["vpn-posts"] });
      queryClient.invalidateQueries({ queryKey: ["vpn-post", slug] });
    },
  });
};
