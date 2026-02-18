import React from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import { Header } from "@/components/providers/Header";
import { Footer } from "@/components/providers/Footer";
import { StructuredData as SEOStructuredData } from "@/components/SEO/StructuredData";
import { StructuredData } from "@/components/StructuredData";
import { OpenGraph } from "@/components/SEO/OpenGraph";
import { vpnPosts } from "@/data/vpn-posts"; // для похожих статей
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Icon from "@/components/ui/icon";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { useVpnPost } from "@/hooks/useVpnPosts";

const VpnPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data: post, isLoading, error } = useVpnPost(slug);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Icon name="Loader2" size={32} className="animate-spin text-primary" />
      </div>
    );
  }

  if (error || !post) {
    return <Navigate to="/vpn" replace />;
  }

  // Похожие статьи пока берём из статического массива (можно потом заменить на API)
  const relatedPosts = vpnPosts
    .filter((p) => p.id !== post.id && p.category === post.category)
    .slice(0, 3);

  const handleProviderClick = () => {
    if (typeof window !== "undefined" && (window as any).ym) {
      (window as any).ym(105466349, "reachGoal", "handleProviderClick", {
        provider_name: post.providerName,
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* ... OpenGraph, SEO, Header (без изменений) ... */}
      <main>
        <article className="pt-32 pb-16">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="max-w-4xl mx-auto">
              {/* ... навигация, заголовок, метаданные ... */}

              {post.image && (
                <div className="w-full mb-12">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-auto rounded-2xl shadow-lg"
                  />
                </div>
              )}

              <div className="prose prose-lg max-w-none ...">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={
                    {
                      /* ... */
                    }
                  }
                >
                  {post.content}
                </ReactMarkdown>
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

              {/* Кнопка провайдера */}
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

        {/* Похожие статьи (без изменений) */}
      </main>
      <Footer />
    </div>
  );
};

export default VpnPost;
