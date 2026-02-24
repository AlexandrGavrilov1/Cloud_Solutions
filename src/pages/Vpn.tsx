// src/pages/Vpn.tsx
import { useState } from "react";
import { Header } from "@/components/providers/Header";
import { Footer } from "@/components/providers/Footer";
import { OpenGraph } from "@/components/SEO/OpenGraph";
import { StructuredData } from "@/components/SEO/StructuredData";
import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";
import { useVpnPosts } from "@/hooks/useVpnPosts";
import { VpnCard } from "@/components/vpnpost/VpnCard";

const Vpn = () => {
  const { data: posts = [], isLoading, error } = useVpnPosts();

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
        {/* Hero-секция */}
        <section className="pt-32 pb-16 relative overflow-hidden">
          <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px]"></div>
          <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-secondary/20 rounded-full blur-[120px]"></div>
          {/* Изменено: container mx-auto px-4 lg:px-8 → w-full px-4 3xl:px-[185px] */}
          <div className="w-full px-4 3xl:px-[185px] relative z-10">
            <div className="max-w-4xl mx-auto text-center space-y-6">
              <div className="inline-flex items-center gap-2 bg-accent border border-primary/30 rounded-full px-5 py-2.5">
                <Icon name="Shield" size={16} className="text-primary" />
                <span className="text-sm font-bold text-primary">
                  VPN инструкции
                </span>
              </div>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-foreground leading-tight">
                Собственный VPN на VPS
              </h1>
              <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
                Пошаговые руководства по развертыванию безопасных VPN серверов
              </p>
            </div>
          </div>
        </section>

        {/* Сетка статей */}
        <section className="py-12 pb-24">
          {/* Изменено: container mx-auto px-4 lg:px-8 → w-full px-4 3xl:px-[185px] */}
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
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
                {posts.map((post) => (
                  <VpnCard key={post.id} post={post} />
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
