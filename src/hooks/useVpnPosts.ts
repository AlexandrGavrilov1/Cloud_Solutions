import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { VpnPost } from "@/data/vpn-posts";

const VPN_POSTS_API =
  "https://functions.poehali.dev/4fe9c586-cbff-4bb5-ac28-bcba699ab4f9";

// Функция для преобразования полей из snake_case в camelCase
const transformPost = (data: any): VpnPost => {
  return {
    ...data,
    providerUrl: data.provider_url,
    providerName: data.provider_name,
    readTime: data.read_time,
    // При необходимости можно добавить другие поля
  };
};

const fetchPosts = async (): Promise<VpnPost[]> => {
  const res = await fetch(VPN_POSTS_API);
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.error || "Ошибка загрузки списка статей");
  }
  const data = await res.json();
  return data.map(transformPost);
};

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

const updatePost = async (data: Partial<VpnPost> & { slug: string }) => {
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
  return transformPost(result.post); // предполагаем, что бэкенд возвращает { success: true, post: ... }
};

export const useVpnPosts = () => {
  return useQuery({
    queryKey: ["vpn-posts"],
    queryFn: fetchPosts,
    staleTime: 5 * 60 * 1000,
  });
};

export const useVpnPost = (slug?: string) => {
  return useQuery({
    queryKey: ["vpn-post", slug],
    queryFn: () => fetchPostBySlug(slug!),
    enabled: !!slug,
    staleTime: 5 * 60 * 1000,
  });
};

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
