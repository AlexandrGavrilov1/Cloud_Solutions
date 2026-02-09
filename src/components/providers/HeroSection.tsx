import { Button } from "@/components/ui/button";

export const HeroSection = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-orange-300 via-orange-200 to-orange-100 pt-20 pb-32">
      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="max-w-4xl space-y-8">
          <h1 className="text-6xl md:text-7xl lg:text-8xl font-extrabold leading-[1.1] tracking-tight">
            <span className="block text-gray-900">НАЙДИ</span>
            <span className="block text-orange-500">ИДЕАЛЬНОЕ ОБЛАКО</span>
            <span className="block text-gray-900">ДЛЯ СВОЕГО ПРОЕКТА</span>
          </h1>

          <p className="text-xl text-gray-900 max-w-2xl leading-relaxed">
            Сравни характеристики, цены и отзывы. Выбери лучшее решение<br />
            за пару минут
          </p>

          <div className="pt-4">
            <Button
              size="lg"
              className="h-14 px-8 text-base font-medium bg-orange-500 hover:bg-orange-600 text-white shadow-xl rounded-full"
              onClick={() => {
                const providersSection = document.getElementById("providers");
                if (providersSection) {
                  providersSection.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                  });
                }
              }}
            >
              Выбрать
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
