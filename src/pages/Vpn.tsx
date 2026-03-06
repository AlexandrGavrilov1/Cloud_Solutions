import { useState, useEffect } from "react";
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

  // ✅ Сброс прокрутки в начало при монтировании страницы
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
        {/* Hero-секция (без изменений) */}
        <section
          className="relative py-16 sm:py-20 md:py-24 overflow-hidden"
          style={{
            background:
              "linear-gradient(90deg, #FFD9B3 0%, #FFE4CC 25%, #FFF0E6 50%, #FFF9F2 75%, #FFFDF9 100%)",
          }}
        >
          {/* ... (оставляем как было) ... */}
        </section>

        {/* Сетка статей */}
        <section id="vpn-articles" className="py-12 pb-24">
          <div className="w-full px-4 3xl:px-[185px]">
            {posts.length === 0 ? (
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
              // Flex-контейнер с центрированием (как мы обсуждали ранее)
              <div className="flex flex-wrap justify-center gap-6">
                {posts.map((post) => (
                  <div
                    key={post.id}
                    className="w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] max-w-md"
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
