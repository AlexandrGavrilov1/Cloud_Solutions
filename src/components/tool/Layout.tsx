import { Link, useLocation } from "react-router-dom";
import { ReactNode } from "react";
import Icon from "@/components/ui/icon";
import ThemeToggle from "@/components/ui/ThemeToggle";

const NAV = [
  { to: "/", label: "Tool" },
  { to: "/vpn", label: "VPN" },
  { to: "/methodology", label: "Methodology" },
  { to: "/faq", label: "FAQ" },
  { to: "/about", label: "About" },
];

export default function Layout({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-40 bg-background/70 backdrop-blur-xl border-b border-border">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link
            to="/"
            className="flex items-center gap-2 font-semibold tracking-tight hover:opacity-80 transition-opacity"
          >
            <div className="w-6 h-6 rounded-md bg-foreground flex items-center justify-center">
              <Icon
                name="Triangle"
                size={12}
                className="text-background fill-background"
              />
            </div>
            <span>top-vds</span>
          </Link>
          <div className="flex items-center gap-3">
            <nav className="flex items-center gap-1">
              {NAV.map((n) => {
                const active =
                  n.to === "/" ? pathname === "/" : pathname.startsWith(n.to);
                return (
                  <Link
                    key={n.to}
                    to={n.to}
                    className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                      active
                        ? "text-foreground bg-secondary"
                        : "text-muted-foreground hover:text-foreground hover:bg-secondary/60"
                    }`}
                  >
                    {n.label}
                  </Link>
                );
              })}
            </nav>
            <div className="w-px h-5 bg-border" />
            <ThemeToggle size="sm" />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12">{children}</main>

      <footer className="border-t border-border mt-24">
        <div className="max-w-7xl mx-auto px-6 py-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <div className="w-5 h-5 rounded bg-foreground flex items-center justify-center">
              <Icon
                name="Triangle"
                size={10}
                className="text-background fill-background"
              />
            </div>
            <span>© {new Date().getFullYear()} top-vds</span>
          </div>
          <div className="flex flex-wrap gap-6 text-sm">
            <Link
              to="/privacy"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Privacy
            </Link>
            <Link
              to="/uptime"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Uptime
            </Link>
            <Link
              to="/about"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              About
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}