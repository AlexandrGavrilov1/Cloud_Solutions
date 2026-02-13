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
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

const VpnPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const post = vpnPosts.find((p) => p.slug === slug);

  if (!post) {
    return <Navigate to="/vpn" replace />;
  }

  const relatedPosts = vpnPosts
    .filter((p) => p.id !== post.id && p.category === post.category)
    .slice(0, 3);

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

                <div className="flex items-center gap-3 pb-8 border-b border-border">
                  <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                    <Icon name="User" size={24} className="text-primary" />
                  </div>
                  <div>
                    <div className="font-semibold text-foreground">
                      {post.author}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Эксперт TopCloudhub
                    </div>
                  </div>
                </div>
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

              {/* Основной контент с кастомным рендерингом кода */}
              <div
                className="prose prose-lg max-w-none
                prose-headings:font-bold prose-headings:text-foreground
                prose-h1:text-4xl prose-h1:mb-6
                prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-4 prose-h2:pb-2 prose-h2:border-b prose-h2:border-border
                prose-h3:text-2xl prose-h3:mt-8 prose-h3:mb-3
                prose-p:text-muted-foreground prose-p:leading-relaxed prose-p:mb-6 prose-p:text-justify
                prose-a:text-primary prose-a:no-underline hover:prose-a:underline
                prose-strong:text-foreground prose-strong:font-bold
                prose-ul:my-6 prose-ul:text-muted-foreground
                prose-ol:my-6 prose-ol:text-muted-foreground
                prose-li:my-2
                prose-code:text-primary prose-code:bg-accent prose-code:px-2 prose-code:py-1 prose-code:rounded
                prose-pre:bg-transparent prose-pre:p-0 prose-pre:border-0
                prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:pl-4 prose-blockquote:italic
                prose-table:border-2 prose-table:border-border
                prose-th:bg-accent prose-th:p-3 prose-th:text-foreground
                prose-td:p-3 prose-td:border prose-td:border-border
                prose-img:w-full prose-img:rounded-xl prose-img:my-8 prose-img:shadow-md
              "
              >
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    code({ node, inline, className, children, ...props }) {
                      const match = /language-(\w+)/.exec(className || "");
                      if (!inline && match) {
                        return (
                          <SyntaxHighlighter
                            style={vscDarkPlus}
                            language={match[1]}
                            PreTag="div"
                            className="rounded-xl my-6 overflow-x-auto"
                            {...props}
                          >
                            {String(children).replace(/\n$/, "")}
                          </SyntaxHighlighter>
                        );
                      }
                      return (
                        <code className={className} {...props}>
                          {children}
                        </code>
                      );
                    },
                  }}
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

              <div className="mt-8 text-center">
                <Button
                  asChild
                  className="bg-primary text-background font-bold shadow-lg shadow-primary/30 px-8 py-6 text-lg"
                >
                  <a
                    href="https://aeza.net/?ref=766003"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Перейти на Aeza.net
                  </a>
                </Button>
              </div>
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
