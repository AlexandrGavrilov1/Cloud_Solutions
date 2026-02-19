// src/components/vpnpost/VpnCard.tsx
import React from "react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import Icon from "@/components/ui/icon";
import { VpnPost } from "@/data/vpn-posts";

// Функция для удаления Markdown-ссылок (оставляет только текст)
const stripMarkdownLinks = (text: string): string => {
  return text.replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1');
};

interface VpnCardProps {
  post: VpnPost;
}

export const VpnCard: React.FC<VpnCardProps> = ({ post }) => {
  return (
    <Link to={`/vpn/${post.slug}`} className="group">
      <article className="bg-card border-2 border-border rounded-2xl overflow-hidden hover:border-primary/50 transition-all hover:shadow-lg h-full flex flex-col">
        {/* Изображение */}
        <div className="aspect-video bg-gradient-to-br from-primary/20 to-secondary/20 relative overflow-hidden">
          {post.image ? (
            <img
              src={post.image}
              alt={post.title}
              className="object-cover w-full h-full"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <Icon name="Shield" size={64} className="text-primary/30" />
            </div>
          )}
        </div>

        {/* Контент карточки */}
        <div className="p-6 flex-1 flex flex-col">
          <div className="flex items-center gap-2 mb-3 flex-wrap">
            <Badge className="bg-primary/10 text-primary border-primary/30 text-xs">
              {post.category}
            </Badge>
            <span className="text-xs text-muted-foreground">{post.readTime}</span>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Icon name="Eye" size={12} />
              <span>{post.views?.toLocaleString() ?? 0}</span>
            </div>
          </div>

          {/* Заголовок – удаляем Markdown-ссылки */}
          <h2 className="text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors line-clamp-2">
            {stripMarkdownLinks(post.title)}
          </h2>

          {/* Описание – удаляем Markdown-ссылки */}
          <p className="text-muted-foreground text-sm leading-relaxed mb-4 flex-1 line-clamp-3">
            {stripMarkdownLinks(post.excerpt)}
          </p>

          {/* Нижняя часть с тегами и кнопкой */}
          <div className="flex items-center justify-between pt-4 border-t border-border">
            <div className="flex flex-wrap gap-1">
              {post.tags.slice(0, 2).map((tag, idx) => (
                <Badge key={idx} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
            <div className="flex items-center gap-1 text-primary font-semibold text-sm">
              Читать
              <Icon name="ArrowRight" size={16} className="group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Дата */}
          <div className="mt-3 text-xs text-muted-foreground">
            {post.date}
          </div>
        </div>
      </article>
    </Link>
  );
};
