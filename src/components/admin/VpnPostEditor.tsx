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
import { useVpnPosts, useUpdateVpnPost } from "@/hooks/useVpnPosts";

// Кастомные команды для редактора (без изменений, можно оставить как есть)
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
  const updateMutation = useUpdateVpnPost();

  const [selectedPost, setSelectedPost] = useState<VpnPost | null>(null);
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

  // Заполняем форму при выборе статьи
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
      setSelectedPost(updatedPost);
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
                  const post = posts?.find((p) => p.slug === slug) || null;
                  setSelectedPost(post);
                }}
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

          {selectedPost && (
            <>
              {/* Форма метаданных */}
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

              <div className="mt-6 flex justify-end gap-4">
                <Button variant="outline" onClick={() => setSelectedPost(null)}>
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
