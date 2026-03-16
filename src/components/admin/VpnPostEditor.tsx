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

// ==================== Кастомные команды редактора ====================

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
    api.replaceSelection(
      `<p align="left">${state.selectedText || "текст"}</p>`,
    );
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
    api.replaceSelection(
      `<p align="center">${state.selectedText || "текст"}</p>`,
    );
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
    api.replaceSelection(
      `<p align="right">${state.selectedText || "текст"}</p>`,
    );
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
    api.replaceSelection(
      `<p style="text-align: justify;">${state.selectedText || "текст"}</p>`,
    );
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
    api.replaceSelection(
      `<font size="5">${state.selectedText || "текст"}</font>`,
    );
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
    api.replaceSelection(
      `<font size="2">${state.selectedText || "текст"}</font>`,
    );
  },
};

const fontStemCommand: ICommand = {
  name: "fontStem",
  keyCommand: "fontStem",
  buttonProps: { "aria-label": "Шрифт Stem" },
  icon: <span style={{ fontSize: 12 }}>Stem</span>,
  execute: (state, api) => {
    api.replaceSelection(
      `<span style="font-family: 'Stem', sans-serif;">${state.selectedText || "текст"}</span>`,
    );
  },
};

const fontTTCommand: ICommand = {
  name: "fontTT",
  keyCommand: "fontTT",
  buttonProps: { "aria-label": "Шрифт TT Travels" },
  icon: <span style={{ fontSize: 12 }}>TT</span>,
  execute: (state, api) => {
    api.replaceSelection(
      `<span style="font-family: 'TT Travels Next Trial', sans-serif;">${state.selectedText || "текст"}</span>`,
    );
  },
};

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
    api.replaceSelection(
      `<span class="text-[#FF931F] dark:text-[#FF931F]">${state.selectedText || "текст"}</span>`,
    );
  },
};

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
    api.replaceSelection(
      `<span class="text-[#272932] dark:text-white">${state.selectedText || "текст"}</span>`,
    );
  },
};

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
    api.replaceSelection(
      `<span class="text-[#272932]/50 dark:text-white/50">${state.selectedText || "текст"}</span>`,
    );
  },
};

const heading1AdaptiveCommand: ICommand = {
  name: "heading1Adaptive",
  keyCommand: "heading1Adaptive",
  buttonProps: { "aria-label": "Заголовок раздела (адаптивный)" },
  icon: <span style={{ fontSize: 12 }}>H1</span>,
  execute: (state, api) => {
    api.replaceSelection(
      `<span class="font-heading font-bold text-2xl md:text-3xl lg:text-4xl text-[#272932] dark:text-white text-left block">${state.selectedText || "Заголовок раздела"}</span>`,
    );
  },
};

const body1AdaptiveCommand: ICommand = {
  name: "body1Adaptive",
  keyCommand: "body1Adaptive",
  buttonProps: { "aria-label": "Текст 1 (Stem Medium, адаптивный)" },
  icon: <span style={{ fontSize: 12 }}>T1</span>,
  execute: (state, api) => {
    api.replaceSelection(
      `<span class="font-sans font-medium text-base md:text-lg text-[#272932] dark:text-white text-justify block indent-8">${state.selectedText || "Текст 1"}</span>`,
    );
  },
};

const body2AdaptiveCommand: ICommand = {
  name: "body2Adaptive",
  keyCommand: "body2Adaptive",
  buttonProps: { "aria-label": "Текст 2 (Stem Regular, адаптивный)" },
  icon: <span style={{ fontSize: 12 }}>T2</span>,
  execute: (state, api) => {
    api.replaceSelection(
      `<span class="font-sans font-normal text-base md:text-lg text-[#272932] dark:text-white text-justify block indent-8">${state.selectedText || "Текст 2"}</span>`,
    );
  },
};

const metaHeading1AdaptiveCommand: ICommand = {
  name: "metaHeading1Adaptive",
  keyCommand: "metaHeading1Adaptive",
  buttonProps: { "aria-label": "Заголовок H1 (адаптивный)" },
  icon: <span style={{ fontSize: 12 }}>H1</span>,
  execute: (state, api) => {
    api.replaceSelection(
      `<span class="font-heading font-bold text-4xl md:text-5xl lg:text-6xl text-[#272932] dark:text-white text-left block">${state.selectedText || "Заголовок"}</span>`,
    );
  },
};

const metaText1AdaptiveCommand: ICommand = {
  name: "metaText1Adaptive",
  keyCommand: "metaText1Adaptive",
  buttonProps: { "aria-label": "Текст T1 (адаптивный)" },
  icon: <span style={{ fontSize: 12 }}>T1</span>,
  execute: (state, api) => {
    api.replaceSelection(
      `<span class="font-sans font-medium text-xl md:text-2xl text-[#272932] dark:text-white text-left block">${state.selectedText || "Текст"}</span>`,
    );
  },
};

const createListItem = (content: string) =>
  `<li class="font-sans font-normal text-base md:text-lg leading-tight text-[#272932] dark:text-white text-justify">${content}</li>`;

const numberedListCommand: ICommand = {
  name: "numberedList",
  keyCommand: "numberedList",
  buttonProps: { "aria-label": "Нумерованный список" },
  icon: <span style={{ fontSize: 12 }}>1.</span>,
  execute: (state, api) => {
    const lines = (state.selectedText || "Элемент списка")
      .split("\n")
      .filter(Boolean);
    api.replaceSelection(
      `<ol class="list-decimal pl-5 space-y-1">${lines.map(createListItem).join("")}</ol>`,
    );
  },
};

const discListCommand: ICommand = {
  name: "discList",
  keyCommand: "discList",
  buttonProps: { "aria-label": "Маркированный список (круги)" },
  icon: <span style={{ fontSize: 12 }}>•</span>,
  execute: (state, api) => {
    const lines = (state.selectedText || "Элемент списка")
      .split("\n")
      .filter(Boolean);
    api.replaceSelection(
      `<ul class="list-disc pl-5 space-y-1">${lines.map(createListItem).join("")}</ul>`,
    );
  },
};

const squareListCommand: ICommand = {
  name: "squareList",
  keyCommand: "squareList",
  buttonProps: { "aria-label": "Маркированный список (квадраты)" },
  icon: <span style={{ fontSize: 12 }}>■</span>,
  execute: (state, api) => {
    const lines = (state.selectedText || "Элемент списка")
      .split("\n")
      .filter(Boolean);
    api.replaceSelection(
      `<ul class="list-square pl-5 space-y-1">${lines.map(createListItem).join("")}</ul>`,
    );
  },
};

const checkListCommand: ICommand = {
  name: "checkList",
  keyCommand: "checkList",
  buttonProps: { "aria-label": "Список с галочками" },
  icon: <span style={{ fontSize: 12 }}>✓</span>,
  execute: (state, api) => {
    const lines = (state.selectedText || "Элемент списка")
      .split("\n")
      .filter(Boolean);
    const items = lines
      .map(
        (line) =>
          `<li class="font-sans font-normal text-base md:text-lg leading-tight text-[#272932] dark:text-white text-justify list-none pl-5 relative before:content-['checkmark'] before:absolute before:left-0">${line}</li>`,
      )
      .join("");
    api.replaceSelection(`<ul class="space-y-1">${items}</ul>`);
  },
};

const clearFormattingCommand: ICommand = {
  name: "clearFormatting",
  keyCommand: "clearFormatting",
  buttonProps: { "aria-label": "Очистить форматирование" },
  icon: <span style={{ fontSize: 12 }}>Tx</span>,
  execute: (state, api) => {
    api.replaceSelection((state.selectedText || "").replace(/<[^>]*>/g, ""));
  },
};

// ==================== Массивы команд ====================

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
  heading1AdaptiveCommand,
  body1AdaptiveCommand,
  body2AdaptiveCommand,
  numberedListCommand,
  discListCommand,
  squareListCommand,
  checkListCommand,
  clearFormattingCommand,
];

const metaCommands = [
  metaHeading1AdaptiveCommand,
  metaText1AdaptiveCommand,
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

  // ==================== ИСПРАВЛЕННАЯ generateSlug ====================
  const generateSlug = (title: string): string => {
    const translit: Record<string, string> = {
      "\u0430": "a",
      "\u0431": "b",
      "\u0432": "v",
      "\u0433": "g",
      "\u0434": "d",
      "\u0435": "e",
      "\u0451": "e",
      "\u0436": "zh",
      "\u0437": "z",
      "\u0438": "i",
      "\u0439": "y",
      "\u043a": "k",
      "\u043b": "l",
      "\u043c": "m",
      "\u043d": "n",
      "\u043e": "o",
      "\u043f": "p",
      "\u0440": "r",
      "\u0441": "s",
      "\u0442": "t",
      "\u0443": "u",
      "\u0444": "f",
      "\u0445": "kh",
      "\u0446": "ts",
      "\u0447": "ch",
      "\u0448": "sh",
      "\u0449": "shch",
      "\u044a": "",
      "\u044b": "y",
      "\u044c": "",
      "\u044d": "e",
      "\u044e": "yu",
      "\u044f": "ya",
    };
    const slug = title
      .toLowerCase()
      .split("")
      .map((c) => translit[c] ?? c)
      .join("")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
    return slug.split("-").reduce((acc, part) => {
      const next = acc ? `${acc}-${part}` : part;
      return next.length <= 80 ? next : acc;
    }, "");
  };
  // ==================================================================

  const handleTitleChange = (val: string | undefined) => {
    const newTitle = val || "";
    setTitle(newTitle);
    if (isCreating)
      setNewPost({ ...newPost, title: newTitle, slug: generateSlug(newTitle) });
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
        const created = await createMutation.mutateAsync({
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
        });
        toast.success("Статья создана");
        setSelectedSlug(created.slug);
        setIsCreating(false);
        onSave?.(created);
      } else {
        if (!selectedPost) return;
        const updated = await updateMutation.mutateAsync({
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
        });
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
                ? "Новая статья"
                : selectedPost
                  ? "Редактирование статьи"
                  : "Редактор VPN-статей"}
            </CardTitle>
            {!isCreating && (
              <Button onClick={handleCreateNew} className="gap-2">
                <Icon name="Plus" size={16} />
                Новая статья
              </Button>
            )}
          </div>
        </CardHeader>

        <CardContent>
          {!isCreating && (
            <div className="mb-6">
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
                        {post.title.replace(/<[^>]*>/g, "")}
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
                      placeholder="url-adres-stati"
                      className="w-full"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Генерируется автоматически из заголовка, можно изменить
                      вручную
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
                        className="animate-spin mr-2"
                      />
                      Сохранение...
                    </>
                  ) : (
                    <>
                      <Icon name="Save" size={16} className="mr-2" />
                      Сохранить
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
            <AlertDialogTitle>Удалить статью?</AlertDialogTitle>
            <AlertDialogDescription>
              Это действие нельзя отменить. Статья будет удалена безвозвратно.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Отмена</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground"
            >
              Удалить
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
