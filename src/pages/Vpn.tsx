import { useState, useEffect, useMemo } from "react";
import { Header } from "@/components/providers/Header";
import { Footer } from "@/components/providers/Footer";
import { OpenGraph } from "@/components/SEO/OpenGraph";
import { StructuredData } from "@/components/SEO/StructuredData";
import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";
import { useVpnPosts } from "@/hooks/useVpnPosts";
import { VpnCard } from "@/components/vpnpost/VpnCard";
import { useTrackEvent } from "@/hooks/useTrackEvent";
import { usePageTimer } from "@/hooks/usePageTimer";

const Vpn = () => {
  const { data: posts = [], isLoading, error } = useVpnPosts();
  const track = useTrackEvent();
  usePageTimer("section_visit", "vpn-list");

  // Меняем местами карточки Aeza и Timeweb
  const sortedPosts = useMemo(() => {
    const postsCopy = [...posts];
    const aezaIndex = postsCopy.findIndex((p) => p.slug === "aeza-vpn");
    const timewebIndex = postsCopy.findIndex((p) => p.slug === "timeweb-vpn");
    if (aezaIndex !== -1 && timewebIndex !== -1) {
      [postsCopy[aezaIndex], postsCopy[timewebIndex]] = [
        postsCopy[timewebIndex],
        postsCopy[aezaIndex],
      ];
    }
    return postsCopy;
  }, [posts]);

  // Сброс прокрутки в начало при монтировании
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    console.log("🔵 MOUNT Vpn");
    return () => console.log("🔴 UNMOUNT Vpn");
  }, []);

  useEffect(() => {
    console.log("🟢 Vpn component mounted, calling track section_visit");
    track("section_visit", "vpn-list");
  }, [track]);

  const scrollToArticles = () => {
    const articlesSection = document.getElementById("vpn-articles");
    if (articlesSection) {
      articlesSection.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Icon name="Loader2" size={48} className="animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Icon
            name="AlertCircle"
            size={48}
            className="text-destructive mx-auto mb-4"
          />
          <p className="text-xl text-muted-foreground">
            Ошибка загрузки статей
          </p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => window.location.reload()}
          >
            Повторить
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <OpenGraph
        title="VPN инструкции — Как развернуть свой VPN на VPS"
        description="Пошаговые руководства по настройке VPN серверов на облачных провайдерах: XRay, WireGuard, OpenVPN и другие."
        url="https://topcloudhub.ru/vpn"
      />
      <StructuredData
        type="breadcrumb"
        breadcrumbs={[
          { name: "Главная", url: "https://topcloudhub.ru" },
          { name: "VPN инструкции", url: "https://topcloudhub.ru/vpn" },
        ]}
      />
      <Header />

      <main>
        {/* Hero-секция — кнопка опущена, общая высота сохранена */}
        <section
          className="relative pt-16 pb-10 sm:pt-20 sm:pb-14 md:pt-24 md:pb-10 overflow-hidden"
          style={{
            background:
              "linear-gradient(90deg, #FFD9B3 0%, #FFE4CC 25%, #FFF0E6 50%, #FFF9F2 75%, #FFFDF9 100%)",
          }}
        >
          {/* Пятно над словом */}
          <div className="absolute top-0 left-0 w-full pointer-events-none z-1 h-[250px] sm:h-[350px] md:h-[450px] lg:h-[550px]">
            <div
              className="absolute left-[5%] top-0 
                   w-[200px] sm:w-[300px] md:w-[400px] lg:w-[500px] xl:w-[600px] 2xl:w-[700px]
                   h-[200px] sm:h-[300px] md:h-[400px] lg:h-[500px] xl:h-[600px] 2xl:h-[700px]
                   rounded-full
                   blur-[40px] sm:blur-[50px] md:blur-[60px] lg:blur-[70px] xl:blur-[80px] 2xl:blur-[90px]
                   opacity-65"
              style={{
                background:
                  "radial-gradient(circle at 30% 20%, #FF931F 0%, #FF8000 25%, #FFB366 45%, rgba(255, 147, 31, 0.4) 70%, transparent 90%)",
                transform: "translate(-10%, -35%)",
              }}
            />
          </div>

          {/* Пятно у правой границы */}
          <div
            className="absolute top-1/2 -translate-y-1/2 pointer-events-none z-1
                 right-0 sm:right-[1%] md:right-[2%] lg:right-[3%] xl:right-[4%] 2xl:right-[5%]
                 w-[350px] sm:w-[450px] md:w-[500px] lg:w-[600px] xl:w-[700px] 2xl:w-[800px]
                 h-[350px] sm:h-[450px] md:h-[500px] lg:h-[600px] xl:h-[700px] 2xl:h-[800px]"
          >
            <div
              className="absolute right-0 top-1/2 -translate-y-1/2 
                         w-full h-full
                         rounded-full
                         blur-[60px] sm:blur-[70px] md:blur-[80px] lg:blur-[90px] xl:blur-[100px] 2xl:blur-[110px]
                         opacity-70"
              style={{
                background:
                  "radial-gradient(circle at 70% 50%, #FF931F 0%, #FF8000 25%, #FFB366 45%, rgba(255, 147, 31, 0.35) 70%, transparent 90%)",
                transform: "translate(20%, -50%)",
              }}
            />
          </div>

          {/* Контент */}
          <div className="w-full px-4 3xl:px-[185px] relative z-10">
            <h1 className="font-heading text-[30px] sm:text-5xl md:text-6xl lg:text-7xl leading-[1.1] tracking-tight font-bold max-w-6xl">
              <span className="block text-[#2B3038]">
                Собственный <span className="text-[#FF7A00]">VPN</span>
              </span>
              <span className="block text-[#2B3038]">
                на <span className="text-[#FF7A00]">VPS</span>
              </span>
            </h1>

            <p className="font-light text-[24px] text-[#272932] max-w-3xl leading-tight mt-4">
              Пошаговые руководства по развертыванию безопасных VPN серверов
            </p>

            {/* Увеличен верхний отступ кнопки */}
            <div className="pt-10">
              <Button
                className="font-light tracking-widest h-[1.7cm] w-[6.5cm] text-[17px] bg-[#FF931F] hover:bg-[#FF8000] text-white shadow-xl rounded-full transition-all"
                onClick={scrollToArticles}
              >
                К СТАТЬЯМ
              </Button>
            </div>
          </div>
        </section>

        {/* Сетка статей — уменьшены вертикальные отступы и расстояние между карточками */}
        <section id="vpn-articles" className="py-10">
          <div className="w-full px-4 3xl:px-[185px]">
            {sortedPosts.length === 0 ? (
              <div className="text-center py-16">
                <Icon
                  name="FileQuestion"
                  size={64}
                  className="mx-auto text-muted-foreground mb-4"
                />
                <p className="text-xl text-muted-foreground">
                  Инструкции не найдены
                </p>
              </div>
            ) : (
              <div className="flex flex-wrap justify-center gap-2">
                {sortedPosts.map((post) => (
                  <div
                    key={post.id}
                    className="w-full min-[950px]:w-[calc((100%-8px)/2)] 3xl:w-[calc((100%-16px)/3)]"
                  >
                    <VpnCard post={post} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Vpn;
