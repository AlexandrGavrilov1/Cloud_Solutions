import { useState, useEffect } from "react";
import Layout from "@/components/tool/Layout";
import { vpnPosts } from "@/data/vpn-posts";
import Icon from "@/components/ui/icon";
import { Link } from "react-router-dom";

const Vpn = () => {
  const [search, setSearch] = useState("");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const filtered = vpnPosts.filter(
    (p) =>
      search === "" ||
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.excerpt.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <Layout>
      <section className="mb-10 max-w-3xl">
        <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground mb-3">
          <Icon name="Shield" size={12} />
          <span>vpn гайды</span>
        </div>
        <h1 className="text-4xl font-light tracking-tight mb-3">
          VPN на своём сервере
        </h1>
        <p className="text-muted-foreground text-sm">
          Подборка инструкций: запусти свой VPN за 10 минут на любом провайдере.
        </p>
      </section>

      <div className="relative max-w-md mb-8">
        <Icon
          name="Search"
          size={14}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
        />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Поиск гайдов"
          className="w-full pl-9 pr-3 py-2 bg-card border border-border rounded text-sm focus:outline-none focus:border-primary"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((post) => (
          <Link
            key={post.id}
            to={`/vpn/${post.slug}`}
            className="group bg-card border border-border rounded-lg p-5 hover:border-primary transition-colors"
          >
            <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-muted-foreground mb-3">
              <span className="text-primary">{post.category}</span>
              <span>·</span>
              <span>{post.readTime}</span>
            </div>
            <h3 className="font-medium mb-2">{post.title}</h3>
            <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
              {post.excerpt}
            </p>
            <div className="flex items-center justify-between text-xs">
              <div className="flex flex-wrap gap-1">
                {post.tags.slice(0, 3).map((t) => (
                  <span
                    key={t}
                    className="px-1.5 py-0.5 rounded bg-secondary text-[10px]"
                  >
                    {t}
                  </span>
                ))}
              </div>
              <span className="flex items-center gap-1 text-primary">
                Открыть
                <Icon name="ArrowRight" size={12} />
              </span>
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

export default Vpn;
