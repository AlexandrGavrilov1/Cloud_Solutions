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

// Кастомные команды (оставляем как есть)
const alignLeftCommand: ICommand = {
  name: "alignLeft",
  keyCommand: "alignLeft",
  buttonProps: { "aria-label": "Выровнять по левому краю" },
  icon: (
    <svg width="14" height="14" viewBox="0 0 20 20">
      <path
        d="M17 5H3V3h14v2zm0 4H3v2h14V9zM3 15h10v-2H3v2z"
        fill="currentColor"
      />
    </svg>
  ),
  execute: (state, api) => {
    const text = `<p align="left">${state.selectedText || "текст"}</p>`;
    api.replaceSelection(text);
  },
};

const alignCenterCommand: ICommand = {
  name: "alignCenter",
  keyCommand: "alignCenter",
  buttonProps: { "aria-label": "Выровнять по центру" },
  icon: (
    <svg width="14" height="14" viewBox="0 0 20 20">
      <path
        d="M17 5H3V3h14v2zm-2 4H5v2h10V9zM3 15h14v-2H3v2z"
        fill="currentColor"
      />
    </svg>
  ),
  execute: (state, api) => {
    const text = `<p align="center">${state.selectedText || "текст"}</p>`;
    api.replaceSelection(text);
  },
};

const alignRightCommand: ICommand = {
  name: "alignRight",
  keyCommand: "alignRight",
  buttonProps: { "aria-label": "Выровнять по правому краю" },
  icon: (
    <svg width="14" height="14" viewBox="0 0 20 20">
      <path
        d="M17 5H3V3h14v2zm0 4H7v2h10V9zM3 15h14v-2H3v2z"
        fill="currentColor"
      />
    </svg>
  ),
  execute: (state, api) => {
    const text = `<p align="right">${state.selectedText || "текст"}</p>`;
    api.replaceSelection(text);
  },
};

const alignJustifyCommand: ICommand = {
  name: "alignJustify",
  keyCommand: "alignJustify",
  buttonProps: { "aria-label": "Выровнять по ширине" },
  icon: (
    <svg width="14" height="14" viewBox="0 0 20 20">
      <path
        d="M17 5H3V3h14v2zm0 4H3v2h14V9zM3 15h14v-2H3v2z"
        fill="currentColor"
      />
    </svg>
  ),
  execute: (state, api) => {
    const text = `<p style="text-align: justify;">${state.selectedText || "текст"}</p>`;
    api.replaceSelection(text);
  },
};

const fontSizeIncreaseCommand: ICommand = {
  name: "fontSizeIncrease",
  keyCommand: "fontSizeIncrease",
  buttonProps: { "aria-label": "Увеличить шрифт" },
  icon: (
    <svg width="14" height="14" viewBox="0 0 20 20">
      <text x="5" y="15" fontSize="14" fill="currentColor">
        A+
      </text>
    </svg>
  ),
  execute: (state, api) => {
    const text = `<font size="5">${state.selectedText || "текст"}</font>`;
    api.replaceSelection(text);
  },
};

const fontSizeDecreaseCommand: ICommand = {
  name: "fontSizeDecrease",
  keyCommand: "fontSizeDecrease",
  buttonProps: { "aria-label": "Уменьшить шрифт" },
  icon: (
    <svg width="14" height="14" viewBox="0 0 20 20">
      <text x="5" y="15" fontSize="14" fill="currentColor">
        A-
      </text>
    </svg>
  ),
  execute: (state, api) => {
    const text = `<font size="2">${state.selectedText || "текст"}</font>`;
    api.replaceSelection(text);
  },
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
  const [isCreating, setIsCreating] = useState(false);

  // Поля для новой статьи
  const [newPost, setNewPost] = useState<Partial<VpnPost>>({
    title: "",
    excerpt: "",
    slug: "",
    category: "VPN",
    tags: [],
    author: "Команда TopCloudHub",
    date: new Date().toLocaleDateString("ru-RU"),
    readTime: "5 мин",
    image: "",
    providerUrl: "",
    providerName: "",
  });
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
      }
    } catch (err) {
      toast.error("Не удалось загрузить статью");
    } finally {
      setIsLoadingContent(false);
    }
  };

  const handleAddTag = () => {
    if (tagInput.trim()) {
      setNewPost({
        ...newPost,
        tags: [...(newPost.tags || []), tagInput.trim()],
      });
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setNewPost({
      ...newPost,
      tags: (newPost.tags || []).filter((t) => t !== tagToRemove),
    });
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-zа-яё0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    setNewPost({
      ...newPost,
      title,
      slug: generateSlug(title),
    });
  };

  const handleCreateNew = () => {
    setIsCreating(true);
    setSelectedPost(null);
    setContent("");
    setNewPost({
      title: "",
      excerpt: "",
      slug: "",
      category: "VPN",
      tags: [],
      author: "Команда TopCloudHub",
      date: new Date().toLocaleDateString("ru-RU"),
      readTime: "5 мин",
      image: "",
      providerUrl: "",
      providerName: "",
    });
  };

  const handleCancelCreate = () => {
    setIsCreating(false);
    setSelectedPost(null);
  };

  const handleSaveNewPost = async () => {
    if (!newPost.title || !newPost.content) {
      toast.error("Заголовок и содержимое обязательны");
      return;
    }

    const token = localStorage.getItem("admin_token");
    if (!token) {
      toast.error("Не найден токен авторизации. Войдите заново.");
      return;
    }

    setIsSaving(true);
    try {
      // Подготовка данных для отправки
      const postData = {
        ...newPost,
        content,
        datePublished: new Date().toISOString(),
        dateModified: new Date().toISOString(),
        tags: newPost.tags || [],
      };

      const res = await fetch(VPN_POSTS_API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Auth-Token": token,
        },
        body: JSON.stringify(postData),
      });

      if (res.ok) {
        const createdPost = await res.json();
        toast.success("Статья создана");
        setPosts((prev) => [...prev, createdPost]);
        setSelectedPost(createdPost);
        setContent(createdPost.content || "");
        setIsCreating(false);
        onSave?.(createdPost);
      } else {
        const err = await res.json();
        toast.error(err.error || "Ошибка при создании");
      }
    } catch (error) {
      toast.error("Ошибка при создании статьи");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveExisting = async () => {
    if (!selectedPost) return;
    setIsSaving(true);
    try {
      const token = localStorage.getItem("admin_token");
      const res = await fetch(VPN_POSTS_API, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "X-Auth-Token": token || "",
        },
        body: JSON.stringify({
          slug: selectedPost.slug,
          content,
        }),
      });
      if (res.ok) {
        toast.success("Статья сохранена");
        const updatedPost = { ...selectedPost, content };
        setSelectedPost(updatedPost);
        // Обновляем в списке
        setPosts((prev) =>
          prev.map((p) => (p.id === updatedPost.id ? updatedPost : p)),
        );
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

  // Все команды для панели инструментов
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
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Icon name="PenLine" size={20} className="text-primary" />
              {isCreating
                ? "Создание новой статьи"
                : "Редактирование статьи VPN"}
            </CardTitle>
            <Button
              variant="outline"
              onClick={handleCreateNew}
              disabled={isCreating}
              className="gap-2"
            >
              <Icon name="Plus" size={16} />
              Новая статья
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Выбор статьи (только не в режиме создания) */}
          {!isCreating && (
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
          )}

          {/* Форма создания новой статьи */}
          {isCreating && (
            <div className="mb-6 space-y-4 p-4 bg-muted/50 rounded-lg">
              <div>
                <label className="text-sm font-semibold text-foreground mb-1 block">
                  Заголовок *
                </label>
                <Input
                  value={newPost.title}
                  onChange={handleTitleChange}
                  placeholder="Введите заголовок статьи"
                  className="w-full"
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-foreground mb-1 block">
                  Краткое описание (excerpt)
                </label>
                <Textarea
                  value={newPost.excerpt}
                  onChange={(e) =>
                    setNewPost({ ...newPost, excerpt: e.target.value })
                  }
                  placeholder="Краткое описание статьи"
                  rows={2}
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-foreground mb-1 block">
                  Slug (URL) *
                </label>
                <Input
                  value={newPost.slug}
                  onChange={(e) =>
                    setNewPost({ ...newPost, slug: e.target.value })
                  }
                  placeholder="url-адрес-статьи"
                  className="w-full"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Генерируется автоматически из заголовка, можно изменить
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold text-foreground mb-1 block">
                    Категория
                  </label>
                  <Input
                    value={newPost.category}
                    onChange={(e) =>
                      setNewPost({ ...newPost, category: e.target.value })
                    }
                    placeholder="VPN"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-foreground mb-1 block">
                    Время чтения
                  </label>
                  <Input
                    value={newPost.readTime}
                    onChange={(e) =>
                      setNewPost({ ...newPost, readTime: e.target.value })
                    }
                    placeholder="5 мин"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-semibold text-foreground mb-1 block">
                  Автор
                </label>
                <Input
                  value={newPost.author}
                  onChange={(e) =>
                    setNewPost({ ...newPost, author: e.target.value })
                  }
                  placeholder="Автор статьи"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold text-foreground mb-1 block">
                    URL провайдера
                  </label>
                  <Input
                    value={newPost.providerUrl}
                    onChange={(e) =>
                      setNewPost({ ...newPost, providerUrl: e.target.value })
                    }
                    placeholder="https://example.com"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-foreground mb-1 block">
                    Название провайдера
                  </label>
                  <Input
                    value={newPost.providerName}
                    onChange={(e) =>
                      setNewPost({ ...newPost, providerName: e.target.value })
                    }
                    placeholder="Aeza.net"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-semibold text-foreground mb-1 block">
                  Теги
                </label>
                <div className="flex gap-2 mb-2 flex-wrap">
                  {(newPost.tags || []).map((tag) => (
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

              <div>
                <label className="text-sm font-semibold text-foreground mb-1 block">
                  URL изображения (превью)
                </label>
                <Input
                  value={newPost.image}
                  onChange={(e) =>
                    setNewPost({ ...newPost, image: e.target.value })
                  }
                  placeholder="/images/preview.jpg"
                />
              </div>
            </div>
          )}

          {/* Индикатор загрузки контента */}
          {isLoadingContent && (
            <div className="flex items-center justify-center py-12">
              <Icon
                name="Loader2"
                size={32}
                className="animate-spin text-primary"
              />
            </div>
          )}

          {/* Редактор (для существующей статьи или при создании) */}
          {(selectedPost || isCreating) && !isLoadingContent && (
            <>
              {!isCreating && selectedPost && (
                <div className="mb-4 p-4 bg-muted/50 rounded-lg">
                  <h3 className="font-semibold text-foreground mb-2">
                    {selectedPost.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {selectedPost.excerpt}
                  </p>
                </div>
              )}

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
                {isCreating ? (
                  <>
                    <Button variant="outline" onClick={handleCancelCreate}>
                      Отмена
                    </Button>
                    <Button
                      onClick={handleSaveNewPost}
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
                          Создание...
                        </>
                      ) : (
                        <>
                          <Icon name="Save" size={16} className="mr-2" />
                          Создать
                        </>
                      )}
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      variant="outline"
                      onClick={() => setSelectedPost(null)}
                    >
                      Отмена
                    </Button>
                    <Button
                      onClick={handleSaveExisting}
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
                  </>
                )}
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
