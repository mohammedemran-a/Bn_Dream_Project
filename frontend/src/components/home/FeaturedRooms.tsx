import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { Users, Wifi, Coffee, Tv } from "lucide-react";

const rooms = [
  {
    id: 1,
    name: "الجناح الملكي",
    description: "جناح فاخر بإطلالة رائعة ومرافق متكاملة",
    price: 500,
    capacity: 6,
    image: "https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800&q=80",
    features: ["واي فاي", "تلفاز", "مطبخ", "حمام خاص"],
    status: "متاحة",
  },
  {
    id: 2,
    name: "غرفة العائلة",
    description: "مثالية للعائلات مع مساحة واسعة ومريحة",
    price: 350,
    capacity: 4,
    image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800&q=80",
    features: ["واي فاي", "تلفاز", "مطبخ صغير"],
    status: "متاحة",
  },
  {
    id: 3,
    name: "غرفة الأصدقاء",
    description: "مثالية للقاءات والاجتماعات مع الأصدقاء",
    price: 300,
    capacity: 5,
    image: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=80",
    features: ["واي فاي", "تلفاز", "قهوة"],
    status: "محجوزة",
  },
];

const FeaturedRooms = () => {
  return (
    <section className="py-20 px-4">
      <div className="container mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16 space-y-4 animate-fade-in">
          <Badge className="text-sm px-4 py-2">الغرف المميزة</Badge>
          <h2 className="text-4xl md:text-5xl font-bold">اختر غرفتك المثالية</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            نوفر مجموعة متنوعة من الغرف الفاخرة المجهزة بأحدث المرافق
          </p>
        </div>

        {/* Rooms Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {rooms.map((room, index) => (
            <Card
              key={room.id}
              className="overflow-hidden hover-lift card-gradient border-2 animate-scale-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Room Image */}
              <div className="relative h-64 overflow-hidden">
                <img
                  src={room.image}
                  alt={room.name}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                />
                <Badge
                  className={`absolute top-4 right-4 ${
                    room.status === "متاحة" ? "bg-green-500" : "bg-red-500"
                  }`}
                >
                  {room.status}
                </Badge>
              </div>

              <CardHeader>
                <CardTitle className="text-2xl">{room.name}</CardTitle>
                <CardDescription className="text-base">{room.description}</CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Price */}
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-primary">{room.price}</span>
                  <span className="text-muted-foreground">ريال / ليلة</span>
                </div>

                {/* Features */}
                <div className="flex flex-wrap gap-2">
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Users className="h-4 w-4" />
                    <span>{room.capacity} أشخاص</span>
                  </div>
                  {room.features.includes("واي فاي") && (
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Wifi className="h-4 w-4" />
                      <span>واي فاي</span>
                    </div>
                  )}
                  {room.features.includes("تلفاز") && (
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Tv className="h-4 w-4" />
                      <span>تلفاز</span>
                    </div>
                  )}
                  {room.features.includes("قهوة") && (
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Coffee className="h-4 w-4" />
                      <span>قهوة</span>
                    </div>
                  )}
                </div>
              </CardContent>

              <CardFooter>
                <Link to={`/rooms/${room.id}`} className="w-full">
                  <Button className="w-full shadow-elegant" disabled={room.status === "محجوزة"}>
                    {room.status === "متاحة" ? "احجز الآن" : "غير متاحة"}
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12 animate-fade-in" style={{ animationDelay: "0.4s" }}>
          <Link to="/rooms">
            <Button size="lg" variant="outline" className="hover-lift">
              عرض جميع الغرف
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedRooms;
