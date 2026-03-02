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

// ==================== Все существующие кастомные команды (оставлены без изменений) ====================
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
const fontStemCommand: ICommand = {
  /* ... */
};
const fontTTCommand: ICommand = {
  /* ... */
};
const colorOrangeCommand: ICommand = {
  /* ... */
};
const colorDarkCommand: ICommand = {
  /* ... */
};
const colorDark50Command: ICommand = {
  /* ... */
};
const heading1StyleCommand: ICommand = {
  /* ... */
};
const body1StyleCommand: ICommand = {
  /* ... */
};
const body2StyleCommand: ICommand = {
  /* ... */
};
const numberedListCommand: ICommand = {
  /* ... */
};
const discListCommand: ICommand = {
  /* ... */
};
const squareListCommand: ICommand = {
  /* ... */
};
const checkListCommand: ICommand = {
  /* ... */
};

// Собираем все команды для панели инструментов (можно использовать тот же массив)
const allCommands = [
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

  // Поля метаданных (теперь все текстовые поля будут редакторами)
  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [category, setCategory] = useState("");
  const [readTime, setReadTime] = useState("");
  const [author, setAuthor] = useState("");
  const [providerName, setProviderName] = useState("");

  // Поля, которые остаются обычными Input (URL)
  const [image, setImage] = useState("");
  const [providerUrl, setProviderUrl] = useState("");

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
              {/* Форма метаданных */}
              <div className="mb-6 space-y-4 p-4 bg-muted/50 rounded-lg">
                {/* Заголовок (MDEditor) */}
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
                      commands={allCommands}
                    />
                  </div>
                </div>

                {/* Краткое описание (excerpt) */}
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
                      commands={allCommands}
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
                  {/* Категория */}
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
                        commands={allCommands}
                      />
                    </div>
                  </div>
                  {/* Время чтения */}
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
                        commands={allCommands}
                      />
                    </div>
                  </div>
                </div>

                {/* Автор */}
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
                      commands={allCommands}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* URL провайдера (оставляем Input) */}
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
                  {/* Название провайдера (MDEditor) */}
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
                        commands={allCommands}
                      />
                    </div>
                  </div>
                </div>

                {/* URL изображения (оставляем Input) */}
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

                {/* Теги (без изменений) */}
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

              {/* Основной редактор контента (без изменений) */}
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
