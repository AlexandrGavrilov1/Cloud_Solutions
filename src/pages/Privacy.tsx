import { useEffect } from "react";
import { Header } from "@/components/providers/Header";
import { PrivacySection } from "@/components/privacy/PrivacySection";
import { Footer } from "@/components/providers/Footer";

const Privacy = () => {
  // ✅ Сброс прокрутки в начало при монтировании
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <PrivacySection />
      <Footer />
    </div>
  );
};

export default Privacy;
