import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ShoppingCart, Coffee, Wifi, CreditCard } from "lucide-react";

const services = [
  {
    id: 1,
    name: "البقالة",
    description: "طلب جميع احتياجاتك من المواد الغذائية والمشروبات",
    icon: ShoppingCart,
    color: "from-blue-500 to-cyan-500",
  },
  {
    id: 2,
    name: "القات والشيشة",
    description: "خدمة طلب القات والشيشة بأفضل الأنواع",
    icon: Coffee,
    color: "from-green-500 to-emerald-500",
  },
  {
    id: 3,
    name: "كروت الشبكة",
    description: "كروت إنترنت بسرعات عالية ومختلف الباقات",
    icon: Wifi,
    color: "from-purple-500 to-pink-500",
  },
  {
    id: 4,
    name: "خدمات إضافية",
    description: "المزيد من الخدمات لراحتك",
    icon: CreditCard,
    color: "from-orange-500 to-red-500",
  },
];

const ServicesPreview = () => {
  return (
    <section className="py-20 px-4 bg-muted/30">
      <div className="container mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16 space-y-4 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold">خدماتنا المتميزة</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            نقدم مجموعة شاملة من الخدمات لضمان راحتك وسعادتك
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <Card
              key={service.id}
              className="text-center hover-lift card-gradient border-2 animate-scale-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardHeader>
                <div className="mx-auto mb-4">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${service.color} flex items-center justify-center shadow-elegant`}>
                    <service.icon className="h-8 w-8 text-white" />
                  </div>
                </div>
                <CardTitle className="text-xl">{service.name}</CardTitle>
                <CardDescription className="text-base">{service.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>

        {/* CTA Button */}
        <div className="text-center mt-12 animate-fade-in" style={{ animationDelay: "0.5s" }}>
          <Link to="/services">
            <Button size="lg" className="shadow-elegant">
              استكشف جميع الخدمات
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ServicesPreview;
