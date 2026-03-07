import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";
import { ContactForm } from "@/components/contact/ContactForm";
import { Link } from "react-router-dom"; // импортируем Link из react-router-dom

export const Footer = () => {
  return (
    <footer className="bg-card border-t border-border py-16">
      <div className="w-full px-4 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mb-12">
            <div className="col-span-2 md:col-span-2">
              {/* ... остальной код без изменений ... */}
            </div>

            <div>
              <h4 className="font-bold text-foreground mb-4 text-sm uppercase tracking-wider">
                Провайдеры
              </h4>
              <ul className="space-y-3">
                <li>
                  <Link
                    to="/" // для react-router-dom используется to вместо href
                    className="text-muted-foreground hover:text-primary transition-colors text-sm font-medium"
                  >
                    Рейтинг
                  </Link>
                </li>
                <li>
                  <a
                    href="#providers"
                    className="text-muted-foreground hover:text-primary transition-colors text-sm font-medium"
                  >
                    Отзывы
                  </a>
                </li>
                <li>
                  <Link
                    to="/promo"
                    className="text-muted-foreground hover:text-primary transition-colors text-sm font-medium"
                  >
                    Акции
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-foreground mb-4 text-sm uppercase tracking-wider">
                Помощь
              </h4>
              <ul className="space-y-3">
                <li>
                  <Link
                    to="/vpn"
                    className="text-muted-foreground hover:text-primary transition-colors text-sm font-medium"
                  >
                    VPN
                  </Link>
                </li>
                <li>
                  <Link
                    to="/faq"
                    className="text-muted-foreground hover:text-primary transition-colors text-sm font-medium"
                  >
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link
                    to="/about"
                    className="text-muted-foreground hover:text-primary transition-colors text-sm font-medium"
                  >
                    О нас
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground font-medium">
              © TopCloudHub. Все права защищены.
            </p>
            <div className="flex gap-6 text-sm text-muted-foreground font-medium">
              <Link
                to="/privacy"
                className="hover:text-primary transition-colors"
              >
                Политика конфиденциальности
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
