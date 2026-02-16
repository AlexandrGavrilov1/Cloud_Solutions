import React, { useState, useEffect } from 'react';
import { useMarkdownEditor, MarkdownEditorView } from '@gravity-ui/markdown-editor';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { vpnPosts, VpnPost } from '@/data/vpn-posts';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';

interface VpnPostEditorProps {
  onSave?: (updatedPost: VpnPost) => void;
}

export const VpnPostEditor: React.FC<VpnPostEditorProps> = ({ onSave }) => {
  const [selectedPost, setSelectedPost] = useState<VpnPost | null>(null);
  const [content, setContent] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const editor = useMarkdownEditor({
    initial: {
      markdown: content,
    },
    allowHTML: true,
  });

  // Следим за изменениями в редакторе
  useEffect(() => {
    const handleChange = () => {
      const value = editor.getValue();
      setContent(value);
    };
    editor.on('change', handleChange);
    return () => {
      editor.off('change', handleChange);
    };
  }, [editor]);

  // При смене статьи обновляем контент в редакторе
  useEffect(() => {
    if (selectedPost) {
      setContent(selectedPost.content);
      // Принудительно обновляем значение в редакторе
      editor.setValue(selectedPost.content);
    }
  }, [selectedPost, editor]);

  const handleSave = async () => {
    if (!selectedPost) return;
    setIsSaving(true);
    try {
      // Здесь должен быть вызов API для сохранения
      // Пока просто имитируем сохранение
      const updatedPost = { ...selectedPost, content };
      // В реальности вы отправите на сервер и обновите данные
      console.log('Сохраняем статью:', updatedPost);
      
      // Можно обновить в массиве vpnPosts (но это не сохранится после перезагрузки)
      // Для демо покажем уведомление
      toast.success('Статья сохранена (локально)');
      onSave?.(updatedPost);
    } catch (error) {
      toast.error('Ошибка при сохранении');
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
              value={selectedPost?.slug || ''}
              onValueChange={(slug) => {
                const post = vpnPosts.find(p => p.slug === slug) || null;
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
                <h3 className="font-semibold text-foreground mb-2">{selectedPost.title}</h3>
                <p className="text-sm text-muted-foreground">{selectedPost.excerpt}</p>
              </div>

              <div className="border rounded-lg overflow-hidden bg-white dark:bg-gray-800">
                <MarkdownEditorView
                  editor={editor}
                  stickyToolbar
                  className="min-h-[500px]"
                />
              </div>

              <div className="mt-6 flex justify-end gap-4">
                <Button
                  variant="outline"
                  onClick={() => setSelectedPost(null)}
                >
                  Отмена
                </Button>
                <Button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="bg-primary text-background"
                >
                  {isSaving ? (
                    <>
                      <Icon name="Loader2" size={16} className="mr-2 animate-spin" />
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
