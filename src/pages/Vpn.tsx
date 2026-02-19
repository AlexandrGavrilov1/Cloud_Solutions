import { useState } from "react";
import { Link } from "react-router-dom";
import { Header } from "@/components/providers/Header";
import { Footer } from "@/components/providers/Footer";
import { OpenGraph } from "@/components/SEO/OpenGraph";
import { StructuredData } from "@/components/SEO/StructuredData";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Icon from "@/components/ui/icon";
import { useVpnPosts } from "@/hooks/useVpnPosts";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const Vpn = () => {
  const { data: posts = [], isLoading, error } = useVpnPosts();

  // Обработка загрузки
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Icon name="Loader2" size={48} className="animate-spin text-primary" />
      </div>
    );
  }

  // Обработка ошибки
  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Icon
            name="AlertCircle"
            size={48}
            className="text-destructive mx-auto mb-4"
          />
          <p className="text-xl text-muted-foreground">
            Ошибка загрузки статей
          </p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => window.location.reload()}
          >
            Повторить
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <OpenGraph
        title="VPN инструкции — Как развернуть свой VPN на VPS"
        description="Пошаговые руководства по настройке VPN серверов на облачных провайдерах: XRay, WireGuard, OpenVPN и другие."
        url="https://topcloudhub.ru/vpn"
      />
      <StructuredData
        type="breadcrumb"
        breadcrumbs={[
          { name: "Главная", url: "https://topcloudhub.ru" },
          { name: "VPN инструкции", url: "https://topcloudhub.ru/vpn" },
        ]}
      />
      <Header />

      <main>
        <section className="pt-32 pb-16 relative overflow-hidden">
          <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px]"></div>
          <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-secondary/20 rounded-full blur-[120px]"></div>

          <div className="container mx-auto px-4 lg:px-8 relative z-10">
            <div className="max-w-4xl mx-auto text-center space-y-6">
              <div className="inline-flex items-center gap-2 bg-accent border border-primary/30 rounded-full px-5 py-2.5">
                <Icon name="Shield" size={16} className="text-primary" />
                <span className="text-sm font-bold text-primary">
                  VPN инструкции
                </span>
              </div>

              <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-foreground leading-tight">
                Собственный VPN на VPS
              </h1>

              <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
                Пошаговые руководства по развертыванию безопасных VPN серверов
              </p>
            </div>
          </div>
        </section>

        <section className="py-12 pb-24">
          <div className="container mx-auto px-4 lg:px-8">
            {posts.length === 0 ? (
              <div className="text-center py-16">
                <Icon
                  name="FileQuestion"
                  size={64}
                  className="mx-auto text-muted-foreground mb-4"
                />
                <p className="text-xl text-muted-foreground">
                  Инструкции не найдены
                </p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
                {posts.map((post) => (
                  <Link
                    key={post.id}
                    to={`/vpn/${post.slug}`}
                    className="group"
                  >
                    <article className="bg-card border-2 border-border rounded-2xl overflow-hidden hover:border-primary/50 transition-all hover:shadow-lg h-full flex flex-col">
                      <div className="aspect-video bg-gradient-to-br from-primary/20 to-secondary/20 relative overflow-hidden">
                        {post.image ? (
                          <img
                            src={post.image}
                            alt={post.title}
                            className="object-cover w-full h-full"
                          />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <Icon
                              name="Shield"
                              size={64}
                              className="text-primary/30"
                            />
                          </div>
                        )}
                      </div>

                      <div className="p-6 flex-1 flex flex-col">
                        <div className="flex items-center gap-2 mb-3 flex-wrap">
                          <Badge className="bg-primary/10 text-primary border-primary/30 text-xs">
                            {post.category}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {post.readTime}
                          </span>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Icon name="Eye" size={12} />
                            <span>{post.views?.toLocaleString() ?? 0}</span>
                          </div>
                        </div>

                        {/* Заголовок остаётся обычной ссылкой на статью (без Markdown) */}
                        <h2 className="text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors line-clamp-2">
                          {post.title}
                        </h2>

                        {/* Описание с поддержкой Markdown (чтобы ссылки работали) */}
                        <p className="text-muted-foreground text-sm leading-relaxed mb-4 flex-1 line-clamp-3">
                          <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            components={{
                              p: ({ children }) => <span>{children}</span>,
                              h1: "span",
                              h2: "span",
                              h3: "span",
                              h4: "span",
                              h5: "span",
                              h6: "span",
                              ul: "span",
                              ol: "span",
                              li: "span",
                              blockquote: "span",
                              pre: "span",
                              code: ({
                                inline,
                                className,
                                children,
                                ...props
                              }) => {
                                if (inline)
                                  return (
                                    <code className={className} {...props}>
                                      {children}
                                    </code>
                                  );
                                return <span>{children}</span>;
                              },
                              a: ({ href, children, ...props }) => (
                                <a
                                  href={href}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  {...props}
                                >
                                  {children}
                                </a>
                              ),
                              img: () => null,
                            }}
                          >
                            {post.excerpt}
                          </ReactMarkdown>
                        </p>

                        <div className="flex items-center justify-between pt-4 border-t border-border">
                          <div className="flex flex-wrap gap-1">
                            {post.tags.slice(0, 2).map((tag, idx) => (
                              <Badge
                                key={idx}
                                variant="outline"
                                className="text-xs"
                              >
                                {tag}
                              </Badge>
                            ))}
                          </div>
                          <div className="flex items-center gap-1 text-primary font-semibold text-sm">
                            Читать
                            <Icon
                              name="ArrowRight"
                              size={16}
                              className="group-hover:translate-x-1 transition-transform"
                            />
                          </div>
                        </div>

                        <div className="mt-3 text-xs text-muted-foreground">
                          {post.date}
                        </div>
                      </div>
                    </article>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Vpn;
