// src/pages/Vpn.tsx
import { Link } from "react-router-dom";
import { Header } from "@/components/providers/Header";
import { Footer } from "@/components/providers/Footer";
import { vpnPosts, vpnCategories } from "@/data/vpn-posts";
import { Badge } from "@/components/ui/badge";
import Icon from "@/components/ui/icon";
import { useState } from "react";

const Vpn = () => {
  const [selectedCategory, setSelectedCategory] = useState("Все");

  const filteredPosts =
    selectedCategory === "Все"
      ? vpnPosts
      : vpnPosts.filter((post) => post.category === selectedCategory);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-32 pb-16">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-extrabold text-foreground mb-4">
              VPN инструкции
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Как развернуть свой VPN на облачных серверах
            </p>

            {/* Фильтр по категориям */}
            <div className="flex flex-wrap gap-2 mb-8">
              {vpnCategories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedCategory === cat
                      ? "bg-primary text-background"
                      : "bg-accent text-foreground hover:bg-accent/80"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Сетка статей */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPosts.map((post) => (
                <Link key={post.id} to={`/vpn/${post.slug}`} className="group">
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
                            name="Lock"
                            size={48}
                            className="text-primary/30"
                          />
                        </div>
                      )}
                    </div>

                    <div className="p-5 flex-1 flex flex-col">
                      <div className="flex items-center gap-2 mb-3">
                        <Badge className="bg-primary/10 text-primary border-primary/30 text-xs">
                          {post.category}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {post.readTime}
                        </span>
                      </div>

                      <h2 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-2">
                        {post.title}
                      </h2>

                      <p className="text-muted-foreground text-sm leading-relaxed flex-1 line-clamp-3 mb-4">
                        {post.excerpt}
                      </p>

                      <div className="flex items-center gap-1 text-primary font-semibold text-sm mt-auto">
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

            {filteredPosts.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">Статьи не найдены</p>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Vpn;
