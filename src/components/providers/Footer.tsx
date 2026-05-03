import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";
import { ContactForm } from "@/components/contact/ContactForm";
import { Link } from "react-router-dom"; // для навигации внутри сайта

export const Footer = () => {
  return (
    <footer className="bg-card border-t border-border py-10">
      <div className="w-full px-4 lg:px-8">
        <div className="max-w-5xl mx-auto">
          {/* Сетка: на мобильных две колонки, на md и выше — четыре */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mb-12">
            {/* Блок с логотипом и описанием — занимает две колонки на всеех экранах */}
            <div className="col-span-2 md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="relative">
                  <div className="absolute inset-0 bg-primary rounded-2xl blur-lg opacity-50"></div>
                  <div className="relative w-12 h-12 bg-primary rounded-2xl flex items-center justify-center">
                    <Icon name="Zap" className="text-background" size={22} />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-primary">
                    top-vds
                  </h3>
                  <p className="text-xs text-muted-foreground font-medium">
                    Топ хостингов
                  </p>
                </div>
              </div>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                Независимая платформа для сравнения облачных провайдеров.
                Помогаем найти идеальное решение для вашего проекта.
              </p>
              <div className="flex gap-3">
                <ContactForm />
                {/* Внешняя ссылка на Telegram — остаётся <a> */}
                <Button
                  size="icon"
                  variant="outline"
                  className="rounded-xl hover:border-primary hover:bg-primary/10 hover:text-primary transition-all"
                  asChild
                >
                  <a
                    href="https://t.me/top_vds_com"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Icon name="Send" size={18} />
                  </a>
                </Button>
              </div>
            </div>

            {/* Блок "Провайдеры" */}
            <div>
              <h4 className="font-bold text-foreground mb-4 text-sm uppercase tracking-wider">
                Провайдеры
              </h4>
              <ul className="space-y-3">
                <li>
                  <Link
                    to="/"
                    className="text-muted-foreground hover:text-primary transition-colors text-sm font-medium"
                  >
                    Рейтинг
                  </Link>
                </li>
                <li>
                  {/* Якорь на той же странице —- оставляем <a> */}
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

            {/* Блок "Помощь" */}
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

          {/* Нижняя часть с копирайтом и политикой конфиденциальности */}
          <div className="pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground font-medium">
              © top-vds. Все права защищены.
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