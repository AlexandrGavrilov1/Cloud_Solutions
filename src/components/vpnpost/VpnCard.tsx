// src/components/vpnpost/VpnCard.tsx
import React from "react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import Icon from "@/components/ui/icon";
import { VpnPost } from "@/data/vpn-posts";

// Функция для удаления Markdown-разметки и HTML-тегов
const cleanText = (text: string): string => {
  if (!text) return "";
  // Удаляем HTML-теги
  let result = text.replace(/<[^>]*>/g, "");
  // Удаляем Markdown-ссылки [text](url)
  result = result.replace(/\[([^\]]+)\]\([^\)]+\)/g, "$1");
  // Удаляем Markdown-жирный и курсив (**text** или *text*)
  result = result.replace(/(\*\*|__)(.*?)\1/g, "$2");
  result = result.replace(/(\*|_)(.*?)\1/g, "$2");
  // Удаляем Markdown-заголовки (# text)
  result = result.replace(/^#+\s+/gm, "");
  // Удаляем Markdown-списки (- text или * text)
  result = result.replace(/^[\*\-\+]\s+/gm, "");
  // Удаляем оставшиеся обратные кавычки (ко;д)
  result = result.replace(/`/g, "");
  return result;
};

interface VpnCardProps {
  post: VpnPost;
}

export const VpnCard: React.FC<VpnCardProps> = ({ post }) => {
  return (
    <Link to={`/vpn/${post.slug}`} className="group">
      <article className="relative bg-card border border-border rounded-2xl overflow-hidden hover:border-[#FF931F]/50 transition-all hover:shadow-lg h-full flex flex-col group-hover:-translate-y-1 duration-300">
        {/* Оранжевое пятно при наведении (снизу) */}
        <div
          className="absolute left-1/2 -translate-x-1/2 w-[300px] h-[250px] opacity-0 group-hover:opacity-80 transition-opacity duration-700 pointer-events-none rounded-full -z-10"
          style={{
            bottom: "-100px",
            background:
              "radial-gradient(circle at center 70%, #FF931F 0%, #FFB366 25%, #FFD9B3 50%, rgba(255,245,235,0.4) 75%, transparent 90%)",
            filter: "blur(35px)",
          }}
        />

        {/* Изображение */}
        <div className="aspect-video bg-gradient-to-br from-primary/20 to-secondary/20 relative overflow-hidden rounded-2xl">
          {post.image ? (
            <img
              src={post.image}
              alt={cleanText(post.title)}
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
            {/* <Badge className="bg-primary/10 text-primary border-primary/30 text-xs">
              {cleanText(post.category)}
            </Badge>*/}
            <span className="text-xs text-muted-foreground">
              {cleanText(post.readTime)}
            </span>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Icon name="Eye" size={12} />
              <span>{post.views?.toLocaleString() ?? 0}</span>
            </div>
          </div>

          {/* Заголовок – очищенный от разметки */}
          <h2 className="font-heading text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors line-clamp-2">
            {(() => {
              const title = cleanText(post.title);
              // Ищем позицию первого вхождения " на " (с пробелами)
              const index = title.indexOf(" на Aeza ");
              if (index === -1) return title; // если нет — просто текст
              return (
                <>
                  {title.substring(0, index)}
                  <br />
                  {title.substring(index + 1)} {/* "на Aeza.net за 10 минут" */}
                </>
              );
            })()}
          </h2>
          {/* Описание – очищенное */}
          <p className="text-muted-foreground text-sm leading-relaxed mb-4 flex-1 line-clamp-3">
            {cleanText(post.excerpt)}
          </p>

          {/* Нижняя часть с тегами и кнопкой */}
          <div className="flex items-center justify-between pt-4 border-t border-border">
            <div className="flex flex-wrap gap-0">
              {post.tags.slice(0, 2).map((tag, idx) => (
                <Badge
                  key={idx}
                  variant="outline"
                  className="text-sm text-[#272932]/50 border-[#272932]/50 dark:text-white/50 dark:border-white/50"
                  style={{ fontWeight: 200 }}
                >
                  #{tag}
                </Badge>
              ))}
            </div>
            <div className="flex items-center gap-1 text-primary text-sm">
              Читать
              <Icon
                name="ArrowRight"
                size={16}
                className="group-hover:translate-x-1 transition-transform"
              />
            </div>
          </div>

          {/* Дата */}
          <div className="mt-3 text-xs text-muted-foreground">{post.date}</div>
        </div>
      </article>
    </Link>
  );
};
