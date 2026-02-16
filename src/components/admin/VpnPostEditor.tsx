import React, { useState, useEffect, lazy, Suspense } from "react";
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

const VPN_POSTS_API =
  "https://functions.poehali.dev/4fe9c586-cbff-4bb5-ac28-bcba699ab4f9";

// Кастомные команды (без изменений)
const alignLeftCommand: ICommand = {
  /* ... */
};
const alignCenterCommand: ICommand = {
  /* ... */
};
const alignRightCommand: ICommand = {
  /* ... */
};
const alignJustifyCommand: ICommand = {
  /* ... */
};
const fontSizeIncreaseCommand: ICommand = {
  /* ... */
};
const fontSizeDecreaseCommand: ICommand = {
  /* ... */
};

interface VpnPostEditorProps {
  onSave?: (updatedPost: VpnPost) => void;
}

export const VpnPostEditor: React.FC<VpnPostEditorProps> = ({ onSave }) => {
  const [posts, setPosts] = useState<VpnPost[]>([]);
  const [selectedPost, setSelectedPost] = useState<VpnPost | null>(null);
  const [content, setContent] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isLoadingPosts, setIsLoadingPosts] = useState(true);
  const [isLoadingContent, setIsLoadingContent] = useState(false);

  // Поля для редактирования метаданных
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

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    setIsLoadingPosts(true);
    try {
      const res = await fetch(VPN_POSTS_API);
      if (res.ok) {
        const data = await res.json();
        setPosts(data);
      }
    } catch (err) {
      toast.error("Не удалось загрузить список статей");
    } finally {
      setIsLoadingPosts(false);
    }
  };

  const fetchPostContent = async (slug: string) => {
    setIsLoadingContent(true);
    try {
      const res = await fetch(`${VPN_POSTS_API}?slug=${slug}`);
      if (res.ok) {
        const data = await res.json();
        setSelectedPost(data);
        setContent(data.content || "");
        // Заполняем метаданные
        setTitle(data.title || "");
        setExcerpt(data.excerpt || "");
        setCategory(data.category || "");
        setReadTime(data.readTime || data.read_time || "");
        setAuthor(data.author || "");
        setImage(data.image || "");
        setProviderUrl(data.providerUrl || data.provider_url || "");
        setProviderName(data.providerName || data.provider_name || "");
        setTags(data.tags || []);
      }
    } catch (err) {
      toast.error("Не удалось загрузить статью");
    } finally {
      setIsLoadingContent(false);
    }
  };

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
      const token = localStorage.getItem("admin_token");
      // Собираем обновлённые данные
      const updatedData: any = {
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
      // Убираем поля, которые не изменились, если нужно (но можно отправлять всё)
      // Для простоты отправляем всё, бэкенд обновит только переданные поля

      const res = await fetch(VPN_POSTS_API, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "X-Auth-Token": token || "",
        },
        body: JSON.stringify(updatedData),
      });
      if (res.ok) {
        const result = await res.json();
        toast.success("Статья сохранена");
        // Обновляем данные в списке
        const updatedPost = { ...selectedPost, ...updatedData };
        setPosts((prev) =>
          prev.map((p) => (p.id === updatedPost.id ? updatedPost : p)),
        );
        setSelectedPost(updatedPost);
        onSave?.(updatedPost);
      } else {
        const err = await res.json();
        toast.error(err.error || "Ошибка при сохранении");
      }
    } catch (error) {
      toast.error("Ошибка при сохранении");
    } finally {
      setIsSaving(false);
    }
  };

  const allCommands = [
    commands.bold,
    commands.italic,
    commands.strikethrough,
    commands.hr,
    commands.title1,
    commands.title2,
    commands.title3,
    commands.link,
    commands.quote,
    commands.code,
    commands.codeBlock,
    commands.image,
    commands.unorderedListCommand,
    commands.orderedListCommand,
    commands.checkedListCommand,
    commands.table,
    alignLeftCommand,
    alignCenterCommand,
    alignRightCommand,
    alignJustifyCommand,
    fontSizeIncreaseCommand,
    fontSizeDecreaseCommand,
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
                value={selectedPost?.slug || ""}
                onValueChange={(slug) => {
                  fetchPostContent(slug);
                }}
              >
                <SelectTrigger className="w-full max-w-md">
                  <SelectValue placeholder="Выберите статью для редактирования" />
                </SelectTrigger>
                <SelectContent>
                  {posts.map((post) => (
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
              {/* Форма редактирования метаданных */}
              <div className="mb-6 space-y-4 p-4 bg-muted/50 rounded-lg">
                <div>
                  <label className="text-sm font-semibold text-foreground mb-1 block">
                    Заголовок
                  </label>
                  <Input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Заголовок статьи"
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold text-foreground mb-1 block">
                    Краткое описание (excerpt)
                  </label>
                  <Textarea
                    value={excerpt}
                    onChange={(e) => setExcerpt(e.target.value)}
                    placeholder="Краткое описание статьи"
                    rows={2}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-semibold text-foreground mb-1 block">
                      Категория
                    </label>
                    <Input
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      placeholder="VPN"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-foreground mb-1 block">
                      Время чтения
                    </label>
                    <Input
                      value={readTime}
                      onChange={(e) => setReadTime(e.target.value)}
                      placeholder="5 мин"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-semibold text-foreground mb-1 block">
                    Автор
                  </label>
                  <Input
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    placeholder="Автор статьи"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-semibold text-foreground mb-1 block">
                      URL провайдера
                    </label>
                    <Input
                      value={providerUrl}
                      onChange={(e) => setProviderUrl(e.target.value)}
                      placeholder="https://example.com"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-foreground mb-1 block">
                      Название провайдера
                    </label>
                    <Input
                      value={providerName}
                      onChange={(e) => setProviderName(e.target.value)}
                      placeholder="Aeza.net"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-semibold text-foreground mb-1 block">
                    URL изображения (превью)
                  </label>
                  <Input
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    placeholder="/images/preview.jpg"
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold text-foreground mb-1 block">
                    Теги
                  </label>
                  <div className="flex gap-2 mb-2 flex-wrap">
                    {tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="gap-1">
                        {tag}
                        <button
                          onClick={() => handleRemoveTag(tag)}
                          className="ml-1 hover:text-destructive"
                        >
                          <Icon name="X" size={12} />
                        </button>
                      </Badge>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      placeholder="Новый тег"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleAddTag();
                        }
                      }}
                    />
                    <Button onClick={handleAddTag} variant="outline">
                      Добавить
                    </Button>
                  </div>
                </div>
              </div>

              <div
                data-color-mode="light"
                className="border rounded-lg overflow-hidden"
              >
                <Suspense
                  fallback={
                    <div
                      className="flex items-center justify-center"
                      style={{ height: 500 }}
                    >
                      <Icon
                        name="Loader2"
                        size={32}
                        className="animate-spin text-primary"
                      />
                    </div>
                  }
                >
                  <MDEditor
                    value={content}
                    onChange={(val) => setContent(val || "")}
                    preview="live"
                    height={500}
                    visibleDragbar={false}
                    commands={allCommands}
                  />
                </Suspense>
              </div>

              <div className="mt-6 flex justify-end gap-4">
                <Button variant="outline" onClick={() => setSelectedPost(null)}>
                  Отмена
                </Button>
                <Button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="bg-primary text-background"
                >
                  {isSaving ? (
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
