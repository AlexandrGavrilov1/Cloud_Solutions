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
import { vpnPosts, VpnPost } from "@/data/vpn-posts";
import Icon from "@/components/ui/icon";
import { toast } from "sonner";
import MDEditor, { commands, ICommand } from "@uiw/react-md-editor";

// Ленивая загрузка MDEditor (отдельный чанк)
// const MDEditor = lazy(() => import("@uiw/react-md-editor"));

// Кастомная команда для выравнивания по левому краю
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

// Кастомная команда для выравнивания по центру
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

// Кастомная команда для выравнивания по правому краю
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

// Кастомная команда для выравнивания по ширине
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

// Кастомная команда для увеличения шрифта
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

// Кастомная команда для уменьшения шрифта
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
  const [selectedPost, setSelectedPost] = useState<VpnPost | null>(null);
  const [content, setContent] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (selectedPost) {
      setContent(selectedPost.content);
    }
  }, [selectedPost]);

  const handleSave = async () => {
    if (!selectedPost) return;
    setIsSaving(true);
    try {
      const updatedPost = { ...selectedPost, content };
      console.log("Сохраняем статью:", updatedPost);
      toast.success("Статья сохранена (локально)");
      onSave?.(updatedPost);
    } catch (error) {
      toast.error("Ошибка при сохранении");
    } finally {
      setIsSaving(false);
    }
  };

  // Собираем все команды для панели инструментов
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
    // Наши новые команды
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
            <Select
              value={selectedPost?.slug || ""}
              onValueChange={(slug) => {
                const post = vpnPosts.find((p) => p.slug === slug) || null;
                setSelectedPost(post);
              }}
            >
              <SelectTrigger className="w-full max-w-md">
                <SelectValue placeholder="Выберите статью для редактирования" />
              </SelectTrigger>
              <SelectContent>
                {vpnPosts.map((post) => (
                  <SelectItem key={post.id} value={post.slug}>
                    {post.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedPost && (
            <>
              <div className="mb-4 p-4 bg-muted/50 rounded-lg">
                <h3 className="font-semibold text-foreground mb-2">
                  {selectedPost.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {selectedPost.excerpt}
                </p>
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
