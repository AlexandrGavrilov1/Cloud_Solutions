import React, { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
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

interface VpnPostEditorProps {
  onSave?: (updatedPost: VpnPost) => void;
}

export const VpnPostEditor: React.FC<VpnPostEditorProps> = ({ onSave }) => {
  const [selectedPost, setSelectedPost] = useState<VpnPost | null>(null);
  const [content, setContent] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<"edit" | "preview">("edit");

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

              <div className="w-full">
                <div className="inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground mb-2">
                  <button
                    onClick={() => setActiveTab("edit")}
                    className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium transition-all ${activeTab === "edit" ? "bg-background text-foreground shadow-sm" : ""}`}
                  >
                    <Icon name="Edit" size={14} className="mr-1" />
                    Редактирование
                  </button>
                  <button
                    onClick={() => setActiveTab("preview")}
                    className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium transition-all ${activeTab === "preview" ? "bg-background text-foreground shadow-sm" : ""}`}
                  >
                    <Icon name="Eye" size={14} className="mr-1" />
                    Предпросмотр
                  </button>
                </div>
                {activeTab === "edit" ? (
                  <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="flex min-h-[500px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 font-mono"
                    placeholder="Введите текст в формате Markdown..."
                  />
                ) : (
                  <div className="min-h-[500px] border rounded-md p-4 prose prose-sm max-w-none dark:prose-invert">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {content}
                    </ReactMarkdown>
                  </div>
                )}
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

export default VpnPostEditor;