import React, { useState, useEffect, lazy, Suspense, useCallback } from "react";
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

// Ленивая загрузка MDEditor (отдельный чанк)
const MDEditor = lazy(() => import("@uiw/react-md-editor"));

interface VpnPostEditorProps {
  onSave?: (updatedPost: VpnPost) => void;
}

export const VpnPostEditor: React.FC<VpnPostEditorProps> = ({ onSave }) => {
  const [selectedPost, setSelectedPost] = useState<VpnPost | null>(null);
  const [content, setContent] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // Состояния для кастомной панели
  const [currentFont, setCurrentFont] = useState("Stem");
  const [currentSize, setCurrentSize] = useState("16");
  const [currentColor, setCurrentColor] = useState("#000000");

  // При смене статьи обновляем контент
  useEffect(() => {
    if (selectedPost) {
      setContent(selectedPost.content);
    }
  }, [selectedPost]);

  // Функция для применения стиля к выделенному тексту (или вставки нового)
  const applyStyle = (api: any, style: string) => {
    const selection = api.getSelection?.() || api.getSelectedText?.();
    const text = selection || "текст";
    const wrapped = `<span style="${style}">${text}</span>`;
    api.replaceSelection(wrapped);
  };

  // Функция для вставки Markdown-заголовка
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

  const handleSave = async () => {
    if (!selectedPost) return;
    setIsSaving(true);
    try {
      // Здесь должен быть вызов API для сохранения
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

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Icon name="Edit" size={20} className="text-primary" />
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
                    renderToolbar={customToolbar}
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
