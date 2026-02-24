import React, { useState, useEffect } from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import { Header } from "@/components/providers/Header";
import { Footer } from "@/components/providers/Footer";
import { StructuredData as SEOStructuredData } from "@/components/SEO/StructuredData";
import { StructuredData } from "@/components/StructuredData";
import { OpenGraph } from "@/components/SEO/OpenGraph";
import { vpnPosts } from "@/data/vpn-posts";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Icon from "@/components/ui/icon";
import MDEditor from "@uiw/react-md-editor";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useVpnPost } from "@/hooks/useVpnPosts";
import { useTheme } from "@/contexts/ThemeContext";

const VpnPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data: post, isLoading, error } = useVpnPost(slug);
  const { theme } = useTheme();

  const [showScrollTop, setShowScrollTop] = useState(false);

  const relatedPosts = vpnPosts
    .filter((p) => p.id !== post?.id && p.category === post?.category)
    .slice(0, 3);

  const handleProviderClick = () => {
    if (typeof window !== "undefined" && (window as any).ym) {
      (window as any).ym(105466349, "reachGoal", "handleProviderClick", {
        provider_name: post?.providerName,
      });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Icon name="Loader2" size={48} className="animate-spin text-primary" />
      </div>
    );
  }

  if (error || !post) {
    return <Navigate to="/vpn" replace />;
  }

  return (
    <div className="min-h-screen bg-background">
      <OpenGraph
        title={post.title}
        description={post.excerpt}
        url={`https://topcloudhub.ru/vpn/${post.slug}`}
        image={post.image || "https://topcloudhub.ru/og-image.png"}
        type="article"
        article={{
          publishedTime: post.datePublished || post.date,
          modifiedTime: post.dateModified || post.date,
          author: post.author,
          section: post.category,
          tags: post.tags,
        }}
      />
      <SEOStructuredData
        type="article"
        article={{
          headline: post.title,
          description: post.excerpt,
          author: post.author,
          datePublished: post.datePublished || post.date,
          dateModified: post.dateModified || post.date,
          image: post.image || "https://topcloudhub.ru/og-image.png",
          url: `https://topcloudhub.ru/vpn/${post.slug}`,
        }}
      />
      <SEOStructuredData
        type="breadcrumb"
        breadcrumbs={[
          { name: "Главная", url: "https://topcloudhub.ru" },
          { name: "VPN", url: "https://topcloudhub.ru/vpn" },
          { name: post.title, url: `https://topcloudhub.ru/vpn/${post.slug}` },
        ]}
      />
      <StructuredData type="article" data={post} />
      <Header />

      <main>
        <article className="pt-32 pb-16">
          {/* Внешний контейнер на всю ширину с отступами 3.5 см (как в Header) */}
          <div className="w-full px-4 lg:px-[3.5cm]">
            {/* Кнопка возврата */}
            <Link
              to="/vpn"
              className="inline-flex items-center gap-2 text-foreground hover:text-primary transition-colors mb-8"
            >
              <Icon name="ArrowLeft" size={20} />
              <span className="font-semibold">Вернуться к разделу VPN</span>
            </Link>

            {/* Заголовок статьи */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-foreground mb-6 leading-tight text-left">
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
                  code: ({ inline, className, children, ...props }) => {
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
                {post.title}
              </ReactMarkdown>
            </h1>

            {/* Краткое описание */}
            <p className="text-lg text-muted-foreground mb-6 text-left">
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
                  code: ({ inline, className, children, ...props }) => {
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

            {/* Тонкая линия */}
            <hr className="border-t border-border/50 my-6" />

            {/* Метаданные */}
            <div className="flex items-center gap-6 text-sm text-foreground mb-8">
              <span className="text-primary font-medium">{post.category}</span>
              <span>{post.date}</span>
              <span className="flex items-center gap-1">
                <Icon name="Clock" size={14} className="text-foreground" />
                {post.readTime}
              </span>
            </div>

            {/* Изображение статьи */}
            {post.image && (
              <div className="w-full mb-12">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-auto rounded-2xl shadow-lg"
                />
              </div>
            )}

            {/* Контент */}
            <div data-color-mode={theme === "dark" ? "dark" : "light"}>
              <MDEditor.Markdown
                source={post.content}
                components={{
                  img({ node, ...props }) {
                    return (
                      <a
                        href={props.src}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <img {...props} />
                      </a>
                    );
                  },
                }}
              />
            </div>

            {/* Теги */}
            <div className="mt-12 pt-8 border-t border-border">
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag, idx) => (
                  <Badge key={idx} variant="outline" className="text-sm">
                    #{tag}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Кнопка провайдера */}
            {post.providerUrl && post.providerName && (
              <div className="mt-8 text-center">
                <Button
                  asChild
                  className="bg-primary text-background font-bold shadow-lg shadow-primary/30 px-8 py-6 text-lg hover:bg-primary/90 transition-all"
                >
                  <a
                    href={post.providerUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={handleProviderClick}
                  >
                    Перейти на {post.providerName}
                  </a>
                </Button>
              </div>
            )}
          </div>
        </article>

        {/* Похожие статьи */}
        {relatedPosts.length > 0 && (
          <section className="py-16 bg-accent/30">
            <div className="w-full px-4 lg:px-[3.5cm]">
              <h2 className="text-3xl font-extrabold text-foreground mb-8">
                Похожие статьи
              </h2>
              <div className="grid md:grid-cols-3 gap-6">
                {relatedPosts.map((relatedPost) => (
                  <Link
                    key={relatedPost.id}
                    to={`/vpn/${relatedPost.slug}`}
                    className="group"
                  >
                    <article className="bg-card border-2 border-border rounded-2xl overflow-hidden hover:border-primary/50 transition-all hover:shadow-lg h-full flex flex-col">
                      <div className="aspect-video bg-gradient-to-br from-primary/20 to-secondary/20 relative overflow-hidden">
                        {relatedPost.image ? (
                          <img
                            src={relatedPost.image}
                            alt={relatedPost.title}
                            className="object-cover w-full h-full"
                          />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <Icon
                              name="FileText"
                              size={48}
                              className="text-primary/30"
                            />
                          </div>
                        )}
                      </div>
                      <div className="p-5 flex-1 flex flex-col">
                        <Badge className="bg-primary/10 text-primary border-primary/30 text-xs w-fit mb-3">
                          {relatedPost.category}
                        </Badge>
                        <h3 className="text-lg font-bold text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-2">
                          {relatedPost.title}
                        </h3>
                        <p className="text-muted-foreground text-sm leading-relaxed flex-1 line-clamp-2">
                          {relatedPost.excerpt}
                        </p>
                        <div className="flex items-center gap-1 text-primary font-semibold text-sm mt-4">
                          Читать
                          <Icon
                            name="ArrowRight"
                            size={16}
                            className="group-hover:translate-x-1 transition-transform"
                          />
                        </div>
                      </div>
                    </article>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>

      {/* Кнопка прокрутки вверх */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed right-8 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-background shadow-lg border border-border flex items-center justify-center hover:bg-primary transition-colors z-50"
          aria-label="Прокрутить вверх"
        >
          <Icon
            name="ArrowUp"
            size={20}
            className="text-foreground hover:text-background transition-colors"
          />
        </button>
      )}

      <Footer />
    </div>
  );
};

export default VpnPost;
