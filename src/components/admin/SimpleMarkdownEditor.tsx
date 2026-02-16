import React, { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';

interface SimpleMarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  height?: number;
}

export const SimpleMarkdownEditor: React.FC<SimpleMarkdownEditorProps> = ({
  value,
  onChange,
  height = 500,
}) => {
  const [tab, setTab] = useState('edit');

  return (
    <div className="border rounded-lg overflow-hidden bg-background">
      <Tabs value={tab} onValueChange={setTab} className="w-full">
        <div className="flex items-center justify-between px-4 py-2 bg-muted/50 border-b">
          <TabsList>
            <TabsTrigger value="edit">Редактирование</TabsTrigger>
            <TabsTrigger value="preview">Предпросмотр</TabsTrigger>
          </TabsList>
          <span className="text-xs text-muted-foreground">Markdown</span>
        </div>

        <TabsContent value="edit" className="m-0">
          <Textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="font-mono text-sm border-0 rounded-none focus-visible:ring-0 resize-y"
            style={{ height, minHeight: height }}
            placeholder="Введите текст в формате Markdown..."
          />
        </TabsContent>

        <TabsContent value="preview" className="m-0 p-4 overflow-auto prose prose-sm max-w-none dark:prose-invert" style={{ height }}>
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeRaw, rehypeSanitize]}
          >
            {value}
          </ReactMarkdown>
        </TabsContent>
      </Tabs>
    </div>
  );
};
