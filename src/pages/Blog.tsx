import { useState, useEffect } from "react";
import Layout from "@/components/tool/Layout";
import { blogPosts } from "@/data/blog-posts";
import Icon from "@/components/ui/icon";
import { Link } from "react-router-dom";

const Blog = () => {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Все");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const categories = [
    "Все",
    ...Array.from(new Set(blogPosts.map((p) => p.category))),
  ];

  const filtered = blogPosts.filter((p) => {
    const okCat = category === "Все" || p.category === category;
    const okSearch =
      search === "" ||
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.excerpt.toLowerCase().includes(search.toLowerCase());
    return okCat && okSearch;
  });

  return (
    <Layout>
      <section className="mb-10 max-w-3xl">
        <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground mb-3">
          <Icon name="BookOpen" size={12} />
          <span>{blogPosts.length} статей</span>
        </div>
        <h1 className="text-4xl font-light tracking-tight mb-3">Блог</h1>
        <p className="text-muted-foreground text-sm">
          Гайды, сравнения и инсайты о хостинге.
        </p>
      </section>

      <div className="flex flex-col md:flex-row gap-3 mb-8">
        <div className="relative flex-1">
          <Icon
            name="Search"
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Поиск статей"
            className="w-full pl-9 pr-3 py-2 bg-card border border-border rounded text-sm focus:outline-none focus:border-primary"
          />
        </div>
        <div className="flex flex-wrap gap-1">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`px-3 py-2 text-xs rounded border transition-colors ${
                category === c
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-card border-border hover:border-primary"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((post) => (
          <Link
            key={post.id}
            to={`/blog/${post.slug}`}
            className="group bg-card border border-border rounded-lg overflow-hidden hover:border-primary transition-colors flex flex-col"
          >
            <div className="aspect-video bg-background overflow-hidden">
              <img
                src={post.image}
                alt={post.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
            </div>
            <div className="p-4 flex flex-col flex-1">
              <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-muted-foreground mb-2">
                <span className="text-primary">{post.category}</span>
                <span>·</span>
                <span>{post.readTime}</span>
              </div>
              <h3 className="font-medium text-sm mb-2 line-clamp-2">
                {post.title}
              </h3>
              <p className="text-xs text-muted-foreground line-clamp-2 flex-1">
                {post.excerpt}
              </p>
              <div className="flex items-center gap-1 mt-3 text-xs text-primary">
                Читать
                <Icon name="ArrowRight" size={12} />
              </div>
            </div>
          </Link>
        ))}
        {filtered.length === 0 && (
          <div className="col-span-full text-center py-12 text-muted-foreground text-sm">
            Ничего не найдено
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Blog;
