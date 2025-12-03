import { useEffect, useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import BottomNav from "@/components/layout/BottomNav";
import HeroSection from "@/components/home/HeroSection";
import FeaturedRooms from "@/components/home/FeaturedRooms";
import ServicesPreview from "@/components/home/ServicesPreview";
import MatchesWidget from "@/components/home/MatchesWidget";
import AdsSection from "@/components/home/AdsSection";
import { NotificationSheet } from "@/components/notifications/NotificationSheet";

const Index = () => {
  const [notificationOpen, setNotificationOpen] = useState(false);

  useEffect(() => {
    // فتح الإشعارات تلقائياً عند تحميل الصفحة
    setNotificationOpen(true);
  }, []);

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="pt-16 pb-20 lg:pb-0">
        <HeroSection />
        <AdsSection />
        <FeaturedRooms />
        <ServicesPreview />
        <MatchesWidget />
      </main>
      <Footer />
      <BottomNav />
      <NotificationSheet 
        open={notificationOpen} 
        onOpenChange={setNotificationOpen}
        showTrigger={false}
      />
    </div>
  );
};

export default Index;
