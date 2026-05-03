import { Link, useLocation } from "react-router-dom";
import { ReactNode } from "react";
import Icon from "@/components/ui/icon";

const NAV = [
  { to: "/", label: "tool" },
  { to: "/vpn", label: "vpn" },
  { to: "/blog", label: "blog" },
  { to: "/faq", label: "faq" },
  { to: "/about", label: "about" },
];

export default function Layout({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();

  return (
    <div className="min-h-screen bg-background text-foreground font-mono">
      <div className="scan-line" />
      <header className="sticky top-0 z-40 bg-background/85 backdrop-blur-md border-b border-primary/40">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 font-bold uppercase tracking-widest">
            <span className="text-primary text-glow">▊</span>
            <span>
              cloud<span className="text-foreground/40">::</span>
              <span className="text-primary text-glow">picker</span>
            </span>
          </Link>
          <nav className="flex items-center gap-1">
            {NAV.map((n) => {
              const active =
                n.to === "/" ? pathname === "/" : pathname.startsWith(n.to);
              return (
                <Link
                  key={n.to}
                  to={n.to}
                  className={`px-3 py-1.5 text-xs uppercase tracking-widest border transition-all ${
                    active
                      ? "bg-primary text-primary-foreground border-primary shadow-neon"
                      : "text-muted-foreground border-transparent hover:text-primary hover:border-primary/40"
                  }`}
                >
                  ./{n.label}
                </Link>
              );
            })}
          </nav>
        </div>
        <div className="max-w-7xl mx-auto px-6 py-1 text-[10px] text-muted-foreground border-t border-primary/20 flex items-center gap-3">
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            <span className="text-primary">CONNECTED</span>
          </span>
          <span>uptime: 99.99%</span>
          <span>region: ru-central-1</span>
          <span className="ml-auto">v2.0.0</span>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">{children}</main>

      <footer className="border-t border-primary/40 mt-16">
        <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <span className="text-primary">$</span>
            <span>echo "© {new Date().getFullYear()} cloud::picker"</span>
          </div>
          <div className="flex gap-4">
            <Link
              to="/privacy"
              className="hover:text-primary hover:text-glow transition-colors"
            >
              ./privacy
            </Link>
            <Link
              to="/uptime"
              className="hover:text-primary hover:text-glow transition-colors"
            >
              ./uptime
            </Link>
            <Link
              to="/about"
              className="hover:text-primary hover:text-glow transition-colors"
            >
              ./about
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
