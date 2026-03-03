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

// ==================== Существующие кастомные команды ====================
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

// ==================== НОВЫЕ КОМАНДЫ ДЛЯ ШРИФТОВ И ЦВЕТОВ ====================

// Шрифт Stem
const fontStemCommand: ICommand = {
  name: "fontStem",
  keyCommand: "fontStem",
  buttonProps: { "aria-label": "Шрифт Stem" },
  icon: <span style={{ fontSize: 12 }}>Stem</span>,
  execute: (state, api) => {
    const text = `<span style="font-family: 'Stem', sans-serif;">${state.selectedText || "текст"}</span>`;
    api.replaceSelection(text);
  },
};

// Шрифт TT Travels Next Trial
const fontTTCommand: ICommand = {
  name: "fontTT",
  keyCommand: "fontTT",
  buttonProps: { "aria-label": "Шрифт TT Travels" },
  icon: <span style={{ fontSize: 12 }}>TT</span>,
  execute: (state, api) => {
    const text = `<span style="font-family: 'TT Travels Next Trial', sans-serif;">${state.selectedText || "текст"}</span>`;
    api.replaceSelection(text);
  },
};

// Цвет оранжевый #FF931F (остаётся оранжевым в обеих темах)
const colorOrangeCommand: ICommand = {
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
    const text = `<span class="text-[#FF931F] dark:text-[#FF931F]">${state.selectedText || "текст"}</span>`;
    api.replaceSelection(text);
  },
};

// Цвет тёмный #272932 (в тёмной теме становится белым)
const colorDarkCommand: ICommand = {
  name: "colorDark",
  keyCommand: "colorDark",
  buttonProps: { "aria-label": "Тёмный (#272932)" },
  icon: (
    <div
      style={{
        width: 14,
        height: 14,
        backgroundColor: "#272932",
        borderRadius: 2,
      }}
    />
  ),
  execute: (state, api) => {
    const text = `<span class="text-[#272932] dark:text-white">${state.selectedText || "текст"}</span>`;
    api.replaceSelection(text);
  },
};

// Цвет тёмный 50% прозрачности (в тёмной теме белый с 50% прозрачностью)
const colorDark50Command: ICommand = {
  name: "colorDark50",
  keyCommand: "colorDark50",
  buttonProps: { "aria-label": "Тёмный 50%" },
  icon: (
    <div
      style={{
        width: 14,
        height: 14,
        backgroundColor: "rgba(39, 41, 50, 0.5)",
        borderRadius: 2,
      }}
    />
  ),
  execute: (state, api) => {
    const text = `<span class="text-[#272932]/50 dark:text-white/50">${state.selectedText || "текст"}</span>`;
    api.replaceSelection(text);
  },
};

// ==================== КОМАНДЫ ДЛЯ СТИЛЕЙ (полная версия для основного контента) ====================

// Заголовок 1: TT Travels, bold, 36px, адаптивный цвет, left
const heading1StyleCommand: ICommand = {
  name: "heading1Style",
  keyCommand: "heading1Style",
  buttonProps: { "aria-label": "Заголовок 1 (TT Travels, 36px)" },
  icon: <span style={{ fontSize: 12 }}>H1</span>,
  execute: (state, api) => {
    const text = state.selectedText || "Заголовок 1";
    const wrapped = `<span class="font-heading font-bold text-[36px] text-[#272932] dark:text-white text-left block">${text}</span>`;
    api.replaceSelection(wrapped);
  },
};

// Текст 1: Stem Medium, 18px, адаптивный цвет, justify, красная строка
const body1StyleCommand: ICommand = {
  name: "body1Style",
  keyCommand: "body1Style",
  buttonProps: { "aria-label": "Текст 1 (Stem Medium, 18px)" },
  icon: <span style={{ fontSize: 12 }}>T1</span>,
  execute: (state, api) => {
    const text = state.selectedText || "Текст 1";
    const wrapped = `<span class="font-sans font-medium text-[18px] text-[#272932] dark:text-white text-justify block indent-[2rem]">${text}</span>`;
    api.replaceSelection(wrapped);
  },
};

// Текст 2: Stem Regular, 18px, адаптивный цвет, justify, красная строка
const body2StyleCommand: ICommand = {
  name: "body2Style",
  keyCommand: "body2Style",
  buttonProps: { "aria-label": "Текст 2 (Stem Regular, 18px)" },
  icon: <span style={{ fontSize: 12 }}>T2</span>,
  execute: (state, api) => {
    const text = state.selectedText || "Текст 2";
    const wrapped = `<span class="font-sans font-normal text-[18px] text-[#272932] dark:text-white text-justify block indent-[2rem]">${text}</span>`;
    api.replaceSelection(wrapped);
  },
};

// ==================== НОВЫЕ КОМАНДЫ ДЛЯ МЕТАДАННЫХ ====================

// Заголовок для метаполей: TT Travels, bold, 48px, адаптивный цвет, left
const metaHeading1Command: ICommand = {
  name: "metaHeading1",
  keyCommand: "metaHeading1",
  buttonProps: { "aria-label": "Заголовок H1 (48px)" },
  icon: <span style={{ fontSize: 12 }}>H1</span>,
  execute: (state, api) => {
    const text = state.selectedText || "Заголовок";
    const wrapped = `<span class="font-heading font-bold text-[48px] text-[#272932] dark:text-white text-left block">${text}</span>`;
    api.replaceSelection(wrapped);
  },
};

// Текст для метаполей: Stem Medium, 24px, адаптивный цвет, left
const metaText1Command: ICommand = {
  name: "metaText1",
  keyCommand: "metaText1",
  buttonProps: { "aria-label": "Текст T1 (24px)" },
  icon: <span style={{ fontSize: 12 }}>T1</span>,
  execute: (state, api) => {
    const text = state.selectedText || "Текст";
    const wrapped = `<span class="font-sans font-medium text-[24px] text-[#272932] dark:text-white text-left block">${text}</span>`;
    api.replaceSelection(wrapped);
  },
};

// ==================== КОМАНДЫ ДЛЯ СПИСКОВ ====================

// Вспомогательная функция для элемента списка (уже с выравниванием по ширине)
const createListItem = (content: string) => {
  return `<li class="font-sans font-normal text-[18px] leading-tight text-[#272932] dark:text-white text-justify">${content}</li>`;
};

// Нумерованный список
const numberedListCommand: ICommand = {
  name: "numberedList",
  keyCommand: "numberedList",
  buttonProps: { "aria-label": "Нумерованный список" },
  icon: <span style={{ fontSize: 12 }}>1.</span>,
  execute: (state, api) => {
    const text = state.selectedText || "Элемент списка";
    const lines = text.split("\n").filter((line) => line.trim() !== "");
    const listItems = lines.map((line) => createListItem(line)).join("");
    const wrapped = `<ol class="list-decimal pl-5 space-y-1">${listItems}</ol>`;
    api.replaceSelection(wrapped);
  },
};

// Маркированный список с кругами
const discListCommand: ICommand = {
  name: "discList",
  keyCommand: "discList",
  buttonProps: { "aria-label": "Маркированный список (круги)" },
  icon: <span style={{ fontSize: 12 }}>•</span>,
  execute: (state, api) => {
    const text = state.selectedText || "Элемент списка";
    const lines = text.split("\n").filter((line) => line.trim() !== "");
    const listItems = lines.map((line) => createListItem(line)).join("");
    const wrapped = `<ul class="list-disc pl-5 space-y-1">${listItems}</ul>`;
    api.replaceSelection(wrapped);
  },
};

// Маркированный список с квадратами
const squareListCommand: ICommand = {
  name: "squareList",
  keyCommand: "squareList",
  buttonProps: { "aria-label": "Маркированный список (квадраты)" },
  icon: <span style={{ fontSize: 12 }}>■</span>,
  execute: (state, api) => {
    const text = state.selectedText || "Элемент списка";
    const lines = text.split("\n").filter((line) => line.trim() !== "");
    const listItems = lines.map((line) => createListItem(line)).join("");
    const wrapped = `<ul class="list-square pl-5 space-y-1">${listItems}</ul>`;
    api.replaceSelection(wrapped);
  },
};

// Список с галочками
const checkListCommand: ICommand = {
  name: "checkList",
  keyCommand: "checkList",
  buttonProps: { "aria-label": "Список с галочками" },
  icon: <span style={{ fontSize: 12 }}>✓</span>,
  execute: (state, api) => {
    const text = state.selectedText || "Элемент списка";
    const lines = text.split("\n").filter((line) => line.trim() !== "");
    const checkItems = lines
      .map(
        (line) =>
          `<li class="font-sans font-normal text-[18px] leading-tight text-[#272932] dark:text-white text-justify list-none pl-5 relative before:content-['✓'] before:absolute before:left-0">${line}</li>`,
      )
      .join("");
    const wrappedWithChecks = `<ul class="space-y-1">${checkItems}</ul>`;
    api.replaceSelection(wrappedWithChecks);
  },
};

// ==================== НОВАЯ КОМАНДА: ОЧИСТКА ФОРМАТИРОВАНИЯ ====================
const clearFormattingCommand: ICommand = {
  name: "clearFormatting",
  keyCommand: "clearFormatting",
  buttonProps: { "aria-label": "Очистить форматирование" },
  icon: <span style={{ fontSize: 12 }}>Tx</span>,
  execute: (state, api) => {
    const text = state.selectedText || "";
    // Удаляем все HTML-теги
    const plainText = text.replace(/<[^>]*>/g, "");
    api.replaceSelection(plainText);
  },
};

// ==================== Массивы команд ====================

// Полный набор для основного редактора контента
const fullCommands = [
  commands.bold,
  commands.italic,
  commands.strikethrough,
  commands.hr,
  commands.title1,
  commands.title2,
  commands.title3,
  commands.title4,
  commands.title5,
  commands.title6,
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
  fontStemCommand,
  fontTTCommand,
  colorOrangeCommand,
  colorDarkCommand,
  colorDark50Command,
  heading1StyleCommand,
  body1StyleCommand,
  body2StyleCommand,
  numberedListCommand,
  discListCommand,
  squareListCommand,
  checkListCommand,
  clearFormattingCommand,
];

// Минимальный набор для метаполей
const metaCommands = [
  metaHeading1Command,
  metaText1Command,
  commands.link,
  colorOrangeCommand,
  colorDarkCommand,
  colorDark50Command,
  clearFormattingCommand,
];

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
  const [providerName, setProviderName] = useState("");
  const [image, setImage] = useState("");
  const [providerUrl, setProviderUrl] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");

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

  const handleTitleChange = (val: string | undefined) => {
    const newTitle = val || "";
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
              <div className="mb-6 space-y-4 p-4 bg-muted/50 rounded-lg">
                {/* Заголовок */}
                <div>
                  <label className="text-sm font-semibold text-foreground mb-1 block">
                    Заголовок *
                  </label>
                  <div
                    data-color-mode="light"
                    className="border rounded-lg overflow-hidden"
                  >
                    <MDEditor
                      value={title}
                      onChange={handleTitleChange}
                      preview="edit"
                      height={80}
                      visibleDragbar={false}
                      commands={metaCommands}
                    />
                  </div>
                </div>

                {/* Краткое описание */}
                <div>
                  <label className="text-sm font-semibold text-foreground mb-1 block">
                    Краткое описание (excerpt)
                  </label>
                  <div
                    data-color-mode="light"
                    className="border rounded-lg overflow-hidden"
                  >
                    <MDEditor
                      value={excerpt}
                      onChange={(val) => setExcerpt(val || "")}
                      preview="edit"
                      height={120}
                      visibleDragbar={false}
                      commands={metaCommands}
                    />
                  </div>
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
                    <div
                      data-color-mode="light"
                      className="border rounded-lg overflow-hidden"
                    >
                      <MDEditor
                        value={category}
                        onChange={(val) => setCategory(val || "")}
                        preview="edit"
                        height={60}
                        visibleDragbar={false}
                        commands={metaCommands}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-foreground mb-1 block">
                      Время чтения
                    </label>
                    <div
                      data-color-mode="light"
                      className="border rounded-lg overflow-hidden"
                    >
                      <MDEditor
                        value={readTime}
                        onChange={(val) => setReadTime(val || "")}
                        preview="edit"
                        height={60}
                        visibleDragbar={false}
                        commands={metaCommands}
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-semibold text-foreground mb-1 block">
                    Автор
                  </label>
                  <div
                    data-color-mode="light"
                    className="border rounded-lg overflow-hidden"
                  >
                    <MDEditor
                      value={author}
                      onChange={(val) => setAuthor(val || "")}
                      preview="edit"
                      height={60}
                      visibleDragbar={false}
                      commands={metaCommands}
                    />
                  </div>
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
                    <div
                      data-color-mode="light"
                      className="border rounded-lg overflow-hidden"
                    >
                      <MDEditor
                        value={providerName}
                        onChange={(val) => setProviderName(val || "")}
                        preview="edit"
                        height={60}
                        visibleDragbar={false}
                        commands={metaCommands}
                      />
                    </div>
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

                {/* Теги */}
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

              {/* Основной контент */}
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
                  commands={fullCommands}
                />
              </div>

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
