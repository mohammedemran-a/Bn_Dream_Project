import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sparkles, Gift, Percent, Star, ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { useRef } from "react";

const ads = [
  {
    id: 1,
    title: "عرض خاص على الغرف الملكية",
    description: "احجز الآن واحصل على خصم 30% على جميع الغرف الملكية لفترة محدودة",
    discount: "30%",
    image: "https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=1200&q=80",
    type: "hot",
    link: "/rooms",
    icon: Percent,
    gradient: "from-orange-500/20 via-red-500/20 to-pink-500/20",
  },
  {
    id: 2,
    title: "هدايا مجانية مع كل حجز",
    description: "اطلب خدماتنا الآن واحصل على هدية قيمة مجانية مع كل طلب",
    badge: "جديد",
    image: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=1200&q=80",
    type: "new",
    link: "/services",
    icon: Gift,
    gradient: "from-blue-500/20 via-cyan-500/20 to-teal-500/20",
  },
  {
    id: 3,
    title: "عروض المباريات الحصرية",
    description: "شاهد أهم المباريات مع تخفيضات خاصة على المشروبات والقهوة",
    badge: "مميز",
    image: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=1200&q=80",
    type: "featured",
    link: "/matches",
    icon: Star,
    gradient: "from-purple-500/20 via-pink-500/20 to-rose-500/20",
  },
  {
    id: 4,
    title: "تجربة البلايستيشن الحصرية",
    description: "ساعة مجانية عند حجز 3 ساعات في غرف البلايستيشن VIP",
    discount: "1+3",
    image: "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=1200&q=80",
    type: "gaming",
    link: "/rooms",
    icon: Sparkles,
    gradient: "from-green-500/20 via-emerald-500/20 to-teal-500/20",
  },
];

const AdsSection = () => {
  const plugin = useRef(
    Autoplay({ delay: 4000, stopOnInteraction: true })
  );

  return (
    <section className="py-16 px-4 bg-gradient-to-b from-background via-primary/5 to-background relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-20 w-72 h-72 bg-primary/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-accent/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
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

        {/* Carousel */}
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
                const Icon = ad.icon;
                return (
                  <CarouselItem key={ad.id} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3">
                    <div className="group relative overflow-hidden rounded-2xl border-2 border-border/50 hover:border-primary/50 transition-all duration-500 h-full">
                      {/* Image Background with Gradient Overlay */}
                      <div className="relative h-[400px] overflow-hidden">
                        <img
                          src={ad.image}
                          alt={ad.title}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        
                        {/* Animated Gradient Overlay */}
                        <div className={`absolute inset-0 bg-gradient-to-t ${ad.gradient} opacity-60 group-hover:opacity-80 transition-opacity duration-500`} />
                        
                        {/* Dark Overlay for Text Readability */}
                        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
                        
                        {/* Discount Badge */}
                        {ad.discount && (
                          <div className="absolute top-6 right-6">
                            <Badge className="text-lg px-4 py-2 bg-primary/90 backdrop-blur-sm shadow-elegant animate-bounce-in border-2 border-primary-foreground/20">
                              <Percent className="h-5 w-5 ml-2" />
                              <span className="font-bold">{ad.discount}</span>
                            </Badge>
                          </div>
                        )}
                        
                        {/* New/Featured Badge */}
                        {ad.badge && (
                          <div className="absolute top-6 right-6">
                            <Badge className="text-base px-4 py-2 bg-accent/90 backdrop-blur-sm shadow-elegant animate-bounce-in border-2 border-accent-foreground/20">
                              <Star className="h-4 w-4 ml-2 animate-pulse" />
                              {ad.badge}
                            </Badge>
                          </div>
                        )}

                        {/* Floating Icon */}
                        <div className="absolute top-6 left-6 w-14 h-14 rounded-full bg-background/20 backdrop-blur-md flex items-center justify-center border-2 border-primary/30 group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 shadow-elegant">
                          <Icon className="h-7 w-7 text-primary drop-shadow-lg" />
                        </div>

                        {/* Content Overlay */}
                        <div className="absolute bottom-0 left-0 right-0 p-6 space-y-3">
                          <h3 className="text-2xl font-bold text-foreground drop-shadow-lg group-hover:text-primary transition-colors duration-300">
                            {ad.title}
                          </h3>
                          <p className="text-foreground/90 text-sm leading-relaxed drop-shadow-md">
                            {ad.description}
                          </p>
                          
                          <Link to={ad.link} className="block">
                            <Button className="w-full shadow-elegant gap-2 group/btn backdrop-blur-sm bg-primary/90 hover:bg-primary text-lg py-6 border-2 border-primary-foreground/20">
                              <span>اطلب الآن</span>
                              <Sparkles className="h-5 w-5 group-hover/btn:rotate-180 group-hover/btn:scale-125 transition-all duration-500" />
                            </Button>
                          </Link>
                        </div>
                      </div>

                      {/* Animated Glow Effect */}
                      <div className={`absolute -inset-1 bg-gradient-to-r ${ad.gradient} rounded-2xl opacity-0 group-hover:opacity-100 blur-2xl transition-opacity duration-700 -z-10`} />
                    </div>
                  </CarouselItem>
                );
              })}
            </CarouselContent>
            
            {/* Custom Navigation Buttons */}
            <div className="hidden md:block">
              <CarouselPrevious className="left-4 h-12 w-12 border-2 shadow-elegant hover:scale-110 transition-transform bg-background/80 backdrop-blur-sm" />
              <CarouselNext className="right-4 h-12 w-12 border-2 shadow-elegant hover:scale-110 transition-transform bg-background/80 backdrop-blur-sm" />
            </div>
          </Carousel>
        </div>

        {/* CTA Button */}
        <div className="text-center mt-12 animate-fade-in" style={{ animationDelay: '0.3s' }}>
          <Link to="/services">
            <Button size="lg" className="shadow-elegant gap-2 text-lg px-8 py-6 group hover:scale-105 transition-all duration-300 border-2">
              <Sparkles className="h-5 w-5 group-hover:rotate-180 transition-transform duration-500" />
              استكشف جميع العروض
              <ChevronLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default AdsSection;
