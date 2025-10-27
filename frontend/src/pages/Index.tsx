import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/home/HeroSection";
import FeaturedRooms from "@/components/home/FeaturedRooms";
import ServicesPreview from "@/components/home/ServicesPreview";
import MatchesWidget from "@/components/home/MatchesWidget";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="pt-16">
        <HeroSection />
        <FeaturedRooms />
        <ServicesPreview />
        <MatchesWidget />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
