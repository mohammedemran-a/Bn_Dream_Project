import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sparkles, Gift, Percent, Star, ChevronLeft } from "lucide-react";
import { Link } from "react-router-dom";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { useEffect, useRef, useState } from "react";

import { getAds, getAdImageUrl } from "@/api/ads";
import type { Ad } from "@/api/ads";

const AdsSection = () => {
  const plugin = useRef(
    Autoplay({ delay: 4000, stopOnInteraction: true })
  );

  const [ads, setAds] = useState<Ad[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAds()
      .then((res) => {
        // عرض الإعلانات المفعلة فقط
        const activeAds = res.data.filter((ad) => ad.isActive);
        setAds(activeAds);
      })
      .finally(() => setLoading(false));
  }, []);

  const getIconByType = (type: string) => {
    switch (type) {
      case "hot":
        return Percent;
      case "new":
        return Gift;
      case "featured":
        return Star;
      default:
        return Sparkles;
    }
  };

  return (
    <section className="py-16 px-4 bg-gradient-to-b from-background via-primary/5 to-background relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-20 w-72 h-72 bg-primary/5 rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute bottom-20 left-20 w-96 h-96 bg-accent/5 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        />
      </div>

      <div className="container mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6 backdrop-blur-sm">
            <Sparkles className="h-5 w-5 text-primary animate-pulse" />
            <span className="font-medium text-primary text-sm">عروض خاصة</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 leading-tight tracking-normal text-primary">
            لا تفوت هذه العروض المميزة
          </h2>
          <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto leading-relaxed px-4">
            عروض حصرية وخصومات مذهلة لفترة محدودة
          </p>
        </div>

        {/* حالات التحميل */}
        {loading && (
          <div className="text-center py-20 text-lg text-muted-foreground">
            جاري تحميل العروض...
          </div>
        )}

        {!loading && ads.length === 0 && (
          <div className="text-center py-20 text-lg text-muted-foreground">
            لا توجد عروض متاحة حاليًا
          </div>
        )}

        {/* Carousel */}
        {!loading && ads.length > 0 && (
          <div className="relative animate-scale-in">
            <Carousel
              opts={{
                align: "start",
                loop: true,
                direction: "rtl",
              }}
              plugins={[plugin.current]}
              className="w-full"
              onMouseEnter={plugin.current.stop}
              onMouseLeave={plugin.current.reset}
            >
              <CarouselContent className="-ml-2 md:-ml-4">
                {ads.map((ad) => {
                  const Icon = getIconByType(ad.type);

                  return (
                    <CarouselItem
                      key={ad.id}
                      className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3"
                    >
                      <div className="group relative overflow-hidden rounded-2xl border-2 border-border/50 hover:border-primary/50 transition-all duration-500 h-full">
                        {/* Image Background */}
                        <div className="relative h-[400px] overflow-hidden">
                          <img
                            src={
                              getAdImageUrl(ad.image) || "/placeholder.jpg"
                            }
                            alt={ad.title}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                          />

                          {/* Gradient Overlay */}
                          <div
                            className={`absolute inset-0 bg-gradient-to-t ${
                              ad.gradient || "from-black/40 to-black/10"
                            } opacity-60 group-hover:opacity-80 transition-opacity duration-500`}
                          />

                          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />

                          {/* Discount Badge */}
                          {ad.discount && (
                            <div className="absolute top-6 right-6">
                              <Badge className="text-lg px-4 py-2 bg-primary/90">
                                <Percent className="h-5 w-5 ml-2" />
                                <span className="font-bold">
                                  {ad.discount}
                                </span>
                              </Badge>
                            </div>
                          )}

                          {/* New Badge */}
                          {ad.badge && (
                            <div className="absolute top-6 right-6">
                              <Badge className="text-base px-4 py-2 bg-accent/90">
                                <Star className="h-4 w-4 ml-2" />
                                {ad.badge}
                              </Badge>
                            </div>
                          )}

                          {/* Floating Icon */}
                          <div className="absolute top-6 left-6 w-14 h-14 rounded-full bg-background/20 backdrop-blur-md flex items-center justify-center">
                            <Icon className="h-7 w-7 text-primary" />
                          </div>

                          {/* Content */}
                          <div className="absolute bottom-0 left-0 right-0 p-6 space-y-3">
                            <h3 className="text-2xl font-bold text-foreground">
                              {ad.title}
                            </h3>
                            <p className="text-foreground/90 text-sm">
                              {ad.description}
                            </p>

                            <Link to={ad.link} className="block">
                              <Button className="w-full gap-2">
                                <span>اطلب الآن</span>
                                <Sparkles className="h-5 w-5" />
                              </Button>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </CarouselItem>
                  );
                })}
              </CarouselContent>

              <div className="hidden md:block">
                <CarouselPrevious className="left-4" />
                <CarouselNext className="right-4" />
              </div>
            </Carousel>
          </div>
        )}

        {/* CTA */}
        <div className="text-center mt-12 animate-fade-in">
          <Link to="/services">
            <Button size="lg" className="gap-2">
              <Sparkles className="h-5 w-5" />
              استكشف جميع العروض
              <ChevronLeft className="h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default AdsSection;
