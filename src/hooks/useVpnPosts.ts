import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { VpnPost } from "@/data/vpn-posts";

const VPN_POSTS_API =
  "https://functions.poehali.dev/4fe9c586-cbff-4bb5-ac28-bcba699ab4f9";

// Преобразование snake_case в camelCase
const transformPost = (data: any): VpnPost => {
  return {
    ...data,
    providerUrl: data.provider_url,
    providerName: data.provider_name,
    readTime: data.read_time,
  };
};

// Получение списка всех статей
const fetchPosts = async (): Promise<VpnPost[]> => {
  const res = await fetch(VPN_POSTS_API);
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.error || "Ошибка загрузки списка статей");
  }
  const data = await res.json();
  return data.map(transformPost);
};

// Получение одной статьи по slug
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

// Создание новой статьи (POST)
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

// Обновление существующей статьи (PUT)
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
  return transformPost(result.post);
};

// Хук для получения списка статей
export const useVpnPosts = () => {
  return useQuery({
    queryKey: ["vpn-posts"],
    queryFn: fetchPosts,
    staleTime: 5 * 60 * 1000,
  });
};

// Хук для получения одной статьи
export const useVpnPost = (slug?: string) => {
  return useQuery({
    queryKey: ["vpn-post", slug],
    queryFn: () => fetchPostBySlug(slug!),
    enabled: !!slug,
    staleTime: 5 * 60 * 1000,
  });
};

// Хук для создания статьи
export const useCreateVpnPost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createPost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vpn-posts"] });
    },
  });
};

// Хук для обновления статьи
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
