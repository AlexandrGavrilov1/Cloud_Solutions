import React from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import { Header } from "@/components/providers/Header";
import { Footer } from "@/components/providers/Footer";
import { StructuredData as SEOStructuredData } from "@/components/SEO/StructuredData";
import { StructuredData } from "@/components/StructuredData";
import { OpenGraph } from "@/components/SEO/OpenGraph";
import { vpnPosts } from "@/data/vpn-posts"; // для похожих статей (пока статика)
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Icon from "@/components/ui/icon";
import MDEditor from "@uiw/react-md-editor"; // импортируем MDEditor
import { useVpnPost } from "@/hooks/useVpnPosts";

const VpnPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data: post, isLoading, error } = useVpnPost(slug);

  // Похожие статьи (пока из статики)
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
          <div className="container mx-auto px-4 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <Link
                to="/vpn"
                className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors mb-8"
              >
                <Icon name="ArrowLeft" size={20} />
                <span className="font-semibold">Вернуться к разделу VPN</span>
              </Link>

              <div className="mb-8">
                <div className="flex flex-wrap items-center gap-3 mb-6">
                  <Badge className="bg-primary/10 text-primary border-primary/30">
                    {post.category}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    {post.readTime}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {post.date}
                  </span>
                </div>

                <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-foreground mb-6 leading-tight">
                  {post.title}
                </h1>

                <p className="text-lg text-muted-foreground mb-6">
                  {post.excerpt}
                </p>
              </div>

              {post.image && (
                <div className="w-full mb-12">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-auto rounded-2xl shadow-lg"
                  />
                </div>
              )}

              {/* Контент с использованием MDEditor.Markdown — добавлены отступы */}
              <div data-color-mode="light" className="markdown-body">
                <div className="px-12 py-8">
                  <MDEditor.Markdown source={post.content} />
                </div>
              </div>

              <div className="mt-12 pt-8 border-t border-border">
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag, idx) => (
                    <Badge key={idx} variant="outline" className="text-sm">
                      #{tag}
                    </Badge>
                  ))}
                </div>
              </div>

              {post.providerUrl && post.providerName && (
                <div className="mt-8 text-center">
                  <Button
                    asChild
                    className="bg-primary text-background font-bold shadow-lg shadow-primary/30 px-8 py-6 text-lg"
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
          </div>
        </article>

        {relatedPosts.length > 0 && (
          <section className="py-16 bg-accent/30">
            <div className="container mx-auto px-4 lg:px-8">
              <div className="max-w-6xl mx-auto">
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
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default VpnPost;
