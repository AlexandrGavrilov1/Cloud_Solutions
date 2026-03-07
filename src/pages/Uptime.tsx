import { useEffect } from "react";
import { Header } from "@/components/providers/Header";
import { UptimeChart } from "@/components/providers/UptimeChart";
import { MethodologySection } from "@/components/providers/MethodologySection";
import { Footer } from "@/components/providers/Footer";
import { providers as providersData } from "@/data/providers";

const Uptime = () => {
  // ✅ Сброс прокрутки в начало при монтировании
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const providers = providersData;
  const lastCheckTime = "";
  const isLoading = false;
  const monthlyDowntime: never[] = [];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <UptimeChart
        providers={providers}
        lastCheckTime={lastCheckTime}
        isChecking={isLoading}
        monthlyDowntime={monthlyDowntime}
      />
      <MethodologySection />
      <Footer />
    </div>
  );
};

export default Uptime;
