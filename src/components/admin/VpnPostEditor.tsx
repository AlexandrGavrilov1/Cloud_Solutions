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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { VpnPost } from "@/data/vpn-posts";
import Icon from "@/components/ui/icon";
import { toast } from "sonner";
import MDEditor, { commands, ICommand } from "@uiw/react-md-editor";
import {
  useVpnPosts,
  useVpnPost,
  useCreateVpnPost,
  useUpdateVpnPost,
  useDeleteVpnPost,
} from "@/hooks/useVpnPosts";

// ==================== Кастомные команды ====================

// Выравнивание
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

// Размер шрифта (отдельные команды для увеличения/уменьшения)
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

// ==================== НОВЫЕ ГРУППЫ КОМАНД ====================

// Группа выбора шрифта
const fontGroup: ICommand = {
  type: "group",
  name: "fontGroup",
  keyCommand: "fontGroup",
  buttonProps: { "aria-label": "Выбрать шрифт" },
  icon: <span style={{ fontSize: 12 }}>Шрифт</span>,
  children: [
    {
      name: "fontStem",
      keyCommand: "fontStem",
      buttonProps: { "aria-label": "Stem" },
      icon: <span style={{ fontSize: 12 }}>Stem</span>,
      execute: (state, api) => {
        const text = `<span style="font-family: 'Stem', sans-serif;">${state.selectedText || "текст"}</span>`;
        api.replaceSelection(text);
      },
    },
    {
      name: "fontTT",
      keyCommand: "fontTT",
      buttonProps: { "aria-label": "TT Travels" },
      icon: <span style={{ fontSize: 12 }}>TT Travels</span>,
      execute: (state, api) => {
        const text = `<span style="font-family: 'TT Travels Next Trial', sans-serif;">${state.selectedText || "текст"}</span>`;
        api.replaceSelection(text);
      },
    },
  ],
};

// Группа выбора размера шрифта (готовые значения)
const fontSizeGroup: ICommand = {
  type: "group",
  name: "fontSizeGroup",
  keyCommand: "fontSizeGroup",
  buttonProps: { "aria-label": "Размер шрифта" },
  icon: <span style={{ fontSize: 12 }}>Размер</span>,
  children: [
    {
      name: "size12",
      keyCommand: "size12",
      buttonProps: { "aria-label": "12px" },
      icon: <span>12px</span>,
      execute: (state, api) => {
        const text = `<span style="font-size: 12px;">${state.selectedText || "текст"}</span>`;
        api.replaceSelection(text);
      },
    },
    {
      name: "size14",
      keyCommand: "size14",
      buttonProps: { "aria-label": "14px" },
      icon: <span>14px</span>,
      execute: (state, api) => {
        const text = `<span style="font-size: 14px;">${state.selectedText || "текст"}</span>`;
        api.replaceSelection(text);
      },
    },
    {
      name: "size16",
      keyCommand: "size16",
      buttonProps: { "aria-label": "16px" },
      icon: <span>16px</span>,
      execute: (state, api) => {
        const text = `<span style="font-size: 16px;">${state.selectedText || "текст"}</span>`;
        api.replaceSelection(text);
      },
    },
    {
      name: "size18",
      keyCommand: "size18",
      buttonProps: { "aria-label": "18px" },
      icon: <span>18px</span>,
      execute: (state, api) => {
        const text = `<span style="font-size: 18px;">${state.selectedText || "текст"}</span>`;
        api.replaceSelection(text);
      },
    },
    {
      name: "size20",
      keyCommand: "size20",
      buttonProps: { "aria-label": "20px" },
      icon: <span>20px</span>,
      execute: (state, api) => {
        const text = `<span style="font-size: 20px;">${state.selectedText || "текст"}</span>`;
        api.replaceSelection(text);
      },
    },
    {
      name: "size24",
      keyCommand: "size24",
      buttonProps: { "aria-label": "24px" },
      icon: <span>24px</span>,
      execute: (state, api) => {
        const text = `<span style="font-size: 24px;">${state.selectedText || "текст"}</span>`;
        api.replaceSelection(text);
      },
    },
    {
      name: "size30",
      keyCommand: "size30",
      buttonProps: { "aria-label": "30px" },
      icon: <span>30px</span>,
      execute: (state, api) => {
        const text = `<span style="font-size: 30px;">${state.selectedText || "текст"}</span>`;
        api.replaceSelection(text);
      },
    },
    {
      name: "size36",
      keyCommand: "size36",
      buttonProps: { "aria-label": "36px" },
      icon: <span>36px</span>,
      execute: (state, api) => {
        const text = `<span style="font-size: 36px;">${state.selectedText || "текст"}</span>`;
        api.replaceSelection(text);
      },
    },
  ],
};

// Группа выбора цвета с предустановками и возможностью ввода произвольного кода
const colorGroup: ICommand = {
  type: "group",
  name: "colorGroup",
  keyCommand: "colorGroup",
  buttonProps: { "aria-label": "Цвет текста" },
  icon: (
    <div
      style={{
        width: 14,
        height: 14,
        backgroundColor: "#FF931F",
        borderRadius: 2,
      }}
    />
  ),
  children: [
    {
      name: "colorOrange",
      keyCommand: "colorOrange",
      buttonProps: { "aria-label": "Оранжевый (#FF931F)" },
      icon: (
        <div
          style={{
            width: 14,
            height: 14,
            backgroundColor: "#FF931F",
            borderRadius: 2,
          }}
        />
      ),
      execute: (state, api) => {
        const text = `<span style="color: #FF931F;">${state.selectedText || "текст"}</span>`;
        api.replaceSelection(text);
      },
    },
    {
      name: "colorDark",
      keyCommand: "colorDark",
      buttonProps: { "aria-label": "Тёмный (#272832)" },
      icon: (
        <div
          style={{
            width: 14,
            height: 14,
            backgroundColor: "#272832",
            borderRadius: 2,
          }}
        />
      ),
      execute: (state, api) => {
        const text = `<span style="color: #272832;">${state.selectedText || "текст"}</span>`;
        api.replaceSelection(text);
      },
    },
    {
      name: "colorBlue",
      keyCommand: "colorBlue",
      buttonProps: { "aria-label": "Синий (#424BFF)" },
      icon: (
        <div
          style={{
            width: 14,
            height: 14,
            backgroundColor: "#424BFF",
            borderRadius: 2,
          }}
        />
      ),
      execute: (state, api) => {
        const text = `<span style="color: #424BFF;">${state.selectedText || "текст"}</span>`;
        api.replaceSelection(text);
      },
    },
    {
      name: "colorCustom",
      keyCommand: "colorCustom",
      buttonProps: { "aria-label": "Ввести свой цвет" },
      icon: <span style={{ fontSize: 12 }}>🎨</span>,
      execute: (state, api) => {
        const colorCode = window.prompt("Введите цвет в HEX (без #)", "");
        if (colorCode && /^[0-9A-Fa-f]{6}$/.test(colorCode)) {
          const text = `<span style="color: #${colorCode};">${state.selectedText || "текст"}</span>`;
          api.replaceSelection(text);
        } else if (colorCode) {
          alert("Неверный формат. Введите 6 символов (0-9, A-F).");
        }
      },
    },
  ],
};

// ==================== Основной компонент ====================

interface VpnPostEditorProps {
  onSave?: (updatedPost: VpnPost) => void;
}

export const VpnPostEditor: React.FC<VpnPostEditorProps> = ({ onSave }) => {
  const { data: posts, isLoading: isLoadingPosts } = useVpnPosts();
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);
  const {
    data: selectedPost,
    isLoading: isLoadingContent,
    error,
  } = useVpnPost(selectedSlug || undefined);
  const createMutation = useCreateVpnPost();
  const updateMutation = useUpdateVpnPost();
  const deleteMutation = useDeleteVpnPost();

  const [content, setContent] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

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

  // Новая статья – пустая форма
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

  // Заполняем форму при выборе существующей статьи
  useEffect(() => {
    if (selectedPost) {
      setContent(selectedPost.content || "");
      setTitle(selectedPost.title || "");
      setExcerpt(selectedPost.excerpt || "");
      setCategory(selectedPost.category || "");
      setReadTime(selectedPost.readTime || "");
      setAuthor(selectedPost.author || "");
      setImage(selectedPost.image || "");
      setProviderUrl(selectedPost.providerUrl || "");
      setProviderName(selectedPost.providerName || "");
      setTags(selectedPost.tags || []);
      setIsCreating(false);
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

  const handleCreateNew = () => {
    setIsCreating(true);
    setSelectedSlug(null);
    setContent("");
    setTitle("");
    setExcerpt("");
    setCategory("VPN");
    setReadTime("5 мин");
    setAuthor("Команда TopCloudHub");
    setImage("");
    setProviderUrl("");
    setProviderName("");
    setTags([]);
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

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-zа-яё0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    if (isCreating) {
      setNewPost({ ...newPost, title: newTitle, slug: generateSlug(newTitle) });
    }
  };

  const handleCancel = () => {
    setIsCreating(false);
    setSelectedSlug(null);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      if (isCreating) {
        if (!title || !content) {
          toast.error("Заголовок и содержимое обязательны");
          return;
        }
        const newData = {
          title,
          content,
          excerpt,
          category,
          read_time: readTime,
          author,
          image,
          provider_url: providerUrl,
          provider_name: providerName,
          tags,
          slug: generateSlug(title),
        };
        const created = await createMutation.mutateAsync(newData);
        toast.success("Статья создана");
        setSelectedSlug(created.slug);
        setIsCreating(false);
        onSave?.(created);
      } else {
        if (!selectedPost) return;
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
        const updated = await updateMutation.mutateAsync(updatedData);
        toast.success("Статья сохранена");
        setSelectedSlug(updated.slug);
        onSave?.(updated);
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Ошибка при сохранении",
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedPost) return;
    try {
      await deleteMutation.mutateAsync(selectedPost.slug);
      toast.success("Статья удалена");
      setSelectedSlug(null);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Ошибка при удалении",
      );
    } finally {
      setIsDeleteDialogOpen(false);
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
    fontGroup,
    fontSizeGroup,
    colorGroup,
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
          )}

          {error && (
            <div className="mb-4 p-4 bg-destructive/10 text-destructive rounded-lg">
              <p>Ошибка загрузки статьи: {error.message}</p>
            </div>
          )}

          {isLoadingContent && (
            <div className="flex items-center justify-center py-12">
              <Icon
                name="Loader2"
                size={32}
                className="animate-spin text-primary"
              />
            </div>
          )}

          {(selectedPost || isCreating) && !isLoadingContent && (
            <>
              {/* Форма метаданных */}
              <div className="mb-6 space-y-4 p-4 bg-muted/50 rounded-lg">
                <div>
                  <label className="text-sm font-semibold text-foreground mb-1 block">
                    Заголовок *
                  </label>
                  <Input
                    value={title}
                    onChange={handleTitleChange}
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

                {isCreating && (
                  <div>
                    <label className="text-sm font-semibold text-foreground mb-1 block">
                      Slug (URL) *
                    </label>
                    <Input
                      value={newPost.slug || generateSlug(title)}
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
                )}

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

              {/* Редактор */}
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

              {/* Кнопки действий */}
              <div className="mt-6 flex justify-end gap-4">
                {!isCreating && selectedPost && (
                  <Button
                    variant="destructive"
                    onClick={() => setIsDeleteDialogOpen(true)}
                    disabled={deleteMutation.isPending}
                    className="gap-2"
                  >
                    {deleteMutation.isPending ? (
                      <Icon name="Loader2" size={16} className="animate-spin" />
                    ) : (
                      <Icon name="Trash2" size={16} />
                    )}
                    Удалить
                  </Button>
                )}

                <Button variant="outline" onClick={handleCancel}>
                  Отмена
                </Button>
                <Button
                  onClick={handleSave}
                  disabled={
                    isSaving ||
                    createMutation.isPending ||
                    updateMutation.isPending
                  }
                  className="bg-primary text-background"
                >
                  {isSaving ||
                  createMutation.isPending ||
                  updateMutation.isPending ? (
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
                      {isCreating ? "Создать" : "Сохранить изменения"}
                    </>
                  )}
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Диалог подтверждения удаления */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Вы уверены?</AlertDialogTitle>
            <AlertDialogDescription>
              Это действие нельзя отменить. Статья "{selectedPost?.title}" будет
              навсегда удалена.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Отмена</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Удалить
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
