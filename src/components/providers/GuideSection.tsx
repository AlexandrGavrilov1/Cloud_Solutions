import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Icon from "@/components/ui/icon";

export const GuideSection = () => {
  return (
    <section id="guide" className="py-24 relative overflow-hidden">
      <div className="absolute top-20 left-10 w-[400px] h-[400px] bg-primary/20 rounded-full blur-[100px]"></div>
      <div className="absolute bottom-20 right-10 w-[400px] h-[400px] bg-secondary/20 rounded-full blur-[100px]"></div>

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <div className="inline-flex items-center gap-2 bg-accent border border-primary/30 rounded-full px-5 py-2.5">
              <Icon name="Lightbulb" size={16} className="text-primary" />
              <span className="text-sm font-bold text-primary">
                Гайд по выбору
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold text-foreground">
              Как выбрать VDS хостинг?
            </h2>
            <p className="text-xl text-muted-foreground">
              Следуй этим 4 шагам для правильного выбора
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                icon: "Target",
                title: "Определи задачи",
                text: "Понять для чего нужен сервер: сайт, приложение или база данных",
              },
              {
                icon: "Cpu",
                title: "Выбери ресурс",
                text: "Подобрать CPU, RAM и диск с запасом для роста проекта",
              },
              {
                icon: "Globe",
                title: "Проверь локацию",
                text: "Выбрать дата-центр ближе к аудитории для скорости",
              },
              {
                icon: "Headphones",
                title: "Оцени поддержку",
                text: "Убедиться в наличии поддержки 24/7 на русском языке",
              },
            ].map((step, idx) => (
              <Card
                key={idx}
                className="border-2 border-border hover:border-primary/50 transition-all group hover-lift bg-card"
              >
                <CardHeader className="p-6 md:p-8">
                  <div className="relative mb-6 inline-block">
                    <div className="absolute inset-0 bg-primary rounded-2xl blur-lg opacity-40"></div>
                    <div className="relative w-16 h-16 bg-primary rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-neon transition-all">
                      <Icon
                        name={step.icon as any}
                        size={28}
                        className="text-background"
                      />
                    </div>
                  </div>
                  <CardTitle className="text-2xl font-bold text-foreground mb-3">
                    {step.title}
                  </CardTitle>
                  <CardDescription className="text-base text-muted-foreground leading-relaxed font-medium">
                    {step.text}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
