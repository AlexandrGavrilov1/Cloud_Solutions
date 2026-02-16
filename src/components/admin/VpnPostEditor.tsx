import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { VpnPost } from "@/data/vpn-posts";
import Icon from "@/components/ui/icon";
import { toast } from "sonner";
import MDEditor, { commands, ICommand } from "@uiw/react-md-editor";
import { useVpnPosts, useVpnPost, useUpdateVpnPost } from "@/hooks/useVpnPosts";

// ... кастомные команды (без изменений) ...

interface VpnPostEditorProps {
  onSave?: (updatedPost: VpnPost) => void;
}

export const VpnPostEditor: React.FC<VpnPostEditorProps> = ({ onSave }) => {
  const { data: posts, isLoading: isLoadingPosts } = useVpnPosts();
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);
  const { data: selectedPost, isLoading: isLoadingContent } = useVpnPost(
    selectedSlug || undefined,
  );
  const updateMutation = useUpdateVpnPost();

  const [content, setContent] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // Поля метаданных
  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [category, setCategory] = useState("");
  const [readTime, setReadTime] = useState("");
  const [author, setAuthor] = useState("");
  const [image, setImage] = useState("");
  const [providerUrl, setProviderUrl] = useState("");
  const [providerName, setProviderName] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");

  // Заполняем форму при загрузке полной статьи
  useEffect(() => {
    if (selectedPost) {
      setContent(selectedPost.content || "");
      setTitle(selectedPost.title || "");
      setExcerpt(selectedPost.excerpt || "");
      setCategory(selectedPost.category || "");
      setReadTime(selectedPost.readTime || selectedPost.read_time || "");
      setAuthor(selectedPost.author || "");
      setImage(selectedPost.image || "");
      setProviderUrl(
        selectedPost.providerUrl || selectedPost.provider_url || "",
      );
      setProviderName(
        selectedPost.providerName || selectedPost.provider_name || "",
      );
      setTags(selectedPost.tags || []);
    }
  }, [selectedPost]);

  const handleAddTag = () => {
    if (tagInput.trim()) {
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const handleSave = async () => {
    if (!selectedPost) return;
    setIsSaving(true);
    try {
      const updatedData = {
        slug: selectedPost.slug,
        content,
        title,
        excerpt,
        category,
        read_time: readTime,
        author,
        image,
        provider_url: providerUrl,
        provider_name: providerName,
        tags,
      };
      const updatedPost = await updateMutation.mutateAsync(updatedData);
      toast.success("Статья сохранена");
      // Обновляем локальное состояние (хотя React Query уже обновит кеш)
      // Можно дополнительно вызвать onSave
      onSave?.(updatedPost);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Ошибка при сохранении",
      );
    } finally {
      setIsSaving(false);
    }
  };

  const allCommands = [
    /* ... */
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Icon name="PenLine" size={20} className="text-primary" />
            Редактирование статьи VPN
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <label className="text-sm font-semibold text-foreground mb-2 block">
              Выберите статью
            </label>
            {isLoadingPosts ? (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Icon name="Loader2" size={16} className="animate-spin" />
                Загрузка списка статей...
              </div>
            ) : (
              <Select
                value={selectedSlug || ""}
                onValueChange={(slug) => setSelectedSlug(slug)}
              >
                <SelectTrigger className="w-full max-w-md">
                  <SelectValue placeholder="Выберите статью для редактирования" />
                </SelectTrigger>
                <SelectContent>
                  {posts?.map((post) => (
                    <SelectItem key={post.id} value={post.slug}>
                      {post.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          {isLoadingContent && (
            <div className="flex items-center justify-center py-12">
              <Icon
                name="Loader2"
                size={32}
                className="animate-spin text-primary"
              />
            </div>
          )}

          {selectedPost && !isLoadingContent && (
            <>
              {/* Форма метаданных (такая же, как раньше) */}
              <div className="mb-6 space-y-4 p-4 bg-muted/50 rounded-lg">
                {/* ... все поля ... */}
              </div>

              <div
                data-color-mode="light"
                className="border rounded-lg overflow-hidden"
              >
                <MDEditor
                  value={content}
                  onChange={(val) => setContent(val || "")}
                  preview="live"
                  height={500}
                  visibleDragbar={false}
                  commands={allCommands}
                />
              </div>

              <div className="mt-6 flex justify-end gap-4">
                <Button variant="outline" onClick={() => setSelectedSlug(null)}>
                  Отмена
                </Button>
                <Button
                  onClick={handleSave}
                  disabled={isSaving || updateMutation.isPending}
                  className="bg-primary text-background"
                >
                  {isSaving || updateMutation.isPending ? (
                    <>
                      <Icon
                        name="Loader2"
                        size={16}
                        className="mr-2 animate-spin"
                      />
                      Сохранение...
                    </>
                  ) : (
                    <>
                      <Icon name="Save" size={16} className="mr-2" />
                      Сохранить изменения
                    </>
                  )}
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
