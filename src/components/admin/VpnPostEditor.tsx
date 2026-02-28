import React, { useState, useEffect, useCallback } from "react";
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

// ==================== Кастомные команды (оставляем для совместимости) ====================
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

  // Состояния для кастомной панели
  const [currentFont, setCurrentFont] = useState("Stem");
  const [currentSize, setCurrentSize] = useState("16");
  const [currentColor, setCurrentColor] = useState("#000000");

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

  // Функция для вставки стиля
  const applyStyle = (api: any, style: string) => {
    const selection = api.getSelection?.() || api.getSelectedText?.();
    const text = selection || "текст";
    const wrapped = `<span style="${style}">${text}</span>`;
    api.replaceSelection(wrapped);
  };

  // Вставка заголовка (Markdown)
  const insertHeading = (api: any, level: number) => {
    const prefix = "#".repeat(level) + " ";
    api.replaceSelection(prefix);
  };

  // Кастомная панель инструментов
  const customToolbar = useCallback(
    (commands: any, api: any) => {
      return (
        <div
          style={{
            display: "flex",
            gap: "8px",
            padding: "8px",
            flexWrap: "wrap",
            borderBottom: "1px solid #e2e8f0",
            backgroundColor: "#f8fafc",
          }}
        >
          {/* Выпадающий список для заголовков */}
          <select
            onChange={(e) => {
              const level = parseInt(e.target.value);
              if (!isNaN(level)) {
                insertHeading(api, level);
              }
            }}
            defaultValue=""
            style={{
              padding: "4px 8px",
              borderRadius: "4px",
              border: "1px solid #cbd5e1",
            }}
          >
            <option value="" disabled>
              Заголовок
            </option>
            <option value="1">H1</option>
            <option value="2">H2</option>
            <option value="3">H3</option>
            <option value="4">H4</option>
            <option value="5">H5</option>
            <option value="6">H6</option>
          </select>

          {/* Кнопки жирный / курсив / подчёркнутый */}
          <button
            onClick={() => {
              const selection = api.getSelection?.() || api.getSelectedText?.();
              const text = selection || "текст";
              api.replaceSelection(`<b>${text}</b>`);
            }}
            style={{
              padding: "4px 8px",
              borderRadius: "4px",
              border: "1px solid #cbd5e1",
              background: "white",
              cursor: "pointer",
            }}
          >
            <b>B</b>
          </button>
          <button
            onClick={() => {
              const selection = api.getSelection?.() || api.getSelectedText?.();
              const text = selection || "текст";
              api.replaceSelection(`<i>${text}</i>`);
            }}
            style={{
              padding: "4px 8px",
              borderRadius: "4px",
              border: "1px solid #cbd5e1",
              background: "white",
              cursor: "pointer",
            }}
          >
            <i>I</i>
          </button>
          <button
            onClick={() => {
              const selection = api.getSelection?.() || api.getSelectedText?.();
              const text = selection || "текст";
              api.replaceSelection(`<u>${text}</u>`);
            }}
            style={{
              padding: "4px 8px",
              borderRadius: "4px",
              border: "1px solid #cbd5e1",
              background: "white",
              cursor: "pointer",
            }}
          >
            <u>U</u>
          </button>

          {/* Кнопки выравнивания (используем готовые команды) */}
          <button
            onClick={() => api.executeCommand(alignLeftCommand)}
            style={{
              padding: "4px 8px",
              borderRadius: "4px",
              border: "1px solid #cbd5e1",
              background: "white",
              cursor: "pointer",
            }}
          >
            <svg width="14" height="14" viewBox="0 0 20 20">
              <path
                d="M17 5H3V3h14v2zm0 4H3v2h14V9zM3 15h10v-2H3v2z"
                fill="currentColor"
              />
            </svg>
          </button>
          <button
            onClick={() => api.executeCommand(alignCenterCommand)}
            style={{
              padding: "4px 8px",
              borderRadius: "4px",
              border: "1px solid #cbd5e1",
              background: "white",
              cursor: "pointer",
            }}
          >
            <svg width="14" height="14" viewBox="0 0 20 20">
              <path
                d="M17 5H3V3h14v2zm-2 4H5v2h10V9zM3 15h14v-2H3v2z"
                fill="currentColor"
              />
            </svg>
          </button>
          <button
            onClick={() => api.executeCommand(alignRightCommand)}
            style={{
              padding: "4px 8px",
              borderRadius: "4px",
              border: "1px solid #cbd5e1",
              background: "white",
              cursor: "pointer",
            }}
          >
            <svg width="14" height="14" viewBox="0 0 20 20">
              <path
                d="M17 5H3V3h14v2zm0 4H7v2h10V9zM3 15h14v-2H3v2z"
                fill="currentColor"
              />
            </svg>
          </button>
          <button
            onClick={() => api.executeCommand(alignJustifyCommand)}
            style={{
              padding: "4px 8px",
              borderRadius: "4px",
              border: "1px solid #cbd5e1",
              background: "white",
              cursor: "pointer",
            }}
          >
            <svg width="14" height="14" viewBox="0 0 20 20">
              <path
                d="M17 5H3V3h14v2zm0 4H3v2h14V9zM3 15h14v-2H3v2z"
                fill="currentColor"
              />
            </svg>
          </button>

          {/* Увеличение/уменьшение шрифта */}
          <button
            onClick={() => api.executeCommand(fontSizeIncreaseCommand)}
            style={{
              padding: "4px 8px",
              borderRadius: "4px",
              border: "1px solid #cbd5e1",
              background: "white",
              cursor: "pointer",
            }}
          >
            A+
          </button>
          <button
            onClick={() => api.executeCommand(fontSizeDecreaseCommand)}
            style={{
              padding: "4px 8px",
              borderRadius: "4px",
              border: "1px solid #cbd5e1",
              background: "white",
              cursor: "pointer",
            }}
          >
            A-
          </button>

          {/* Выбор шрифта */}
          <select
            value={currentFont}
            onChange={(e) => {
              const font = e.target.value;
              setCurrentFont(font);
              applyStyle(api, `font-family: '${font}', sans-serif;`);
            }}
            style={{
              padding: "4px 8px",
              borderRadius: "4px",
              border: "1px solid #cbd5e1",
            }}
          >
            <option value="Stem">Stem</option>
            <option value="TT Travels Next Trial">TT Travels</option>
          </select>

          {/* Размер шрифта (числовое поле с подсказками) */}
          <input
            type="number"
            value={currentSize}
            onChange={(e) => setCurrentSize(e.target.value)}
            onBlur={() => applyStyle(api, `font-size: ${currentSize}px;`)}
            list="sizeList"
            style={{
              width: "80px",
              padding: "4px 8px",
              borderRadius: "4px",
              border: "1px solid #cbd5e1",
            }}
          />
          <datalist id="sizeList">
            <option value="12" />
            <option value="14" />
            <option value="16" />
            <option value="18" />
            <option value="20" />
            <option value="24" />
            <option value="30" />
            <option value="36" />
          </datalist>

          {/* Цвет (выбор из палитры) */}
          <input
            type="color"
            value={currentColor}
            onChange={(e) => {
              setCurrentColor(e.target.value);
              applyStyle(api, `color: ${e.target.value};`);
            }}
            style={{
              width: "40px",
              height: "30px",
              border: "1px solid #cbd5e1",
              borderRadius: "4px",
            }}
          />

          {/* Ручной ввод цвета (HEX без #) */}
          <input
            type="text"
            placeholder="HEX без #"
            value={currentColor.replace("#", "")}
            onChange={(e) => {
              const val = e.target.value
                .replace(/[^0-9A-Fa-f]/g, "")
                .slice(0, 6);
              setCurrentColor("#" + val);
            }}
            onBlur={() => applyStyle(api, `color: ${currentColor};`)}
            style={{
              width: "100px",
              padding: "4px 8px",
              borderRadius: "4px",
              border: "1px solid #cbd5e1",
            }}
          />
        </div>
      );
    },
    [currentFont, currentSize, currentColor],
  );

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

              {/* Редактор с кастомной панелью */}
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
                  renderToolbar={customToolbar}
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
