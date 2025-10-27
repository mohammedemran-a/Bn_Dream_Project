import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "react-router-dom";
import { Users, Wifi, Coffee, Tv, Gamepad2, CircleDot, PartyPopper } from "lucide-react";

const privateRooms = [
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
    id: 5,
    name: "الجناح الفاخر",
    description: "جناح بمساحة كبيرة مع جميع المرافق الحديثة",
    price: 600,
    capacity: 8,
    image: "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&q=80",
    features: ["واي فاي", "تلفاز", "مطبخ", "حمام خاص", "شرفة"],
    status: "متاحة",
  },
  {
    id: 6,
    name: "غرفة الزوجين",
    description: "غرفة رومانسية مع إطلالة جميلة",
    price: 280,
    capacity: 2,
    image: "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=800&q=80",
    features: ["واي فاي", "تلفاز", "قهوة"],
    status: "متاحة",
  },
  {
    id: 4,
    name: "غرفة الهدوء",
    description: "غرفة هادئة مثالية للاسترخاء والراحة",
    price: 250,
    capacity: 2,
    image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&q=80",
    features: ["واي فاي", "تلفاز"],
    status: "متاحة",
  },
];

const publicRooms = [
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

const eventHalls = [
  {
    id: 7,
    name: "صالة المناسبات الكبرى",
    description: "صالة واسعة مجهزة لاستضافة المناسبات والحفلات الكبيرة",
    price: 1500,
    capacity: 100,
    image: "https://images.unsplash.com/photo-1519167758481-83f29da8ae39?w=800&q=80",
    features: ["واي فاي", "نظام صوت", "إضاءة احترافية", "ديكور مناسبات"],
    status: "متاحة",
  },
  {
    id: 8,
    name: "صالة المناسبات الصغيرة",
    description: "صالة مريحة للمناسبات العائلية والاجتماعات",
    price: 800,
    capacity: 50,
    image: "https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&q=80",
    features: ["واي فاي", "نظام صوت", "تلفاز كبير"],
    status: "متاحة",
  },
];

const playstationRooms = [
  {
    id: 9,
    name: "غرفة البلايستيشن VIP",
    description: "غرفة مجهزة بأحدث أجهزة البلايستيشن 5 وشاشات 4K",
    price: 100,
    capacity: 6,
    image: "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=800&q=80",
    features: ["PlayStation 5", "شاشات 4K", "مقاعد مريحة", "مكتبة ألعاب ضخمة"],
    status: "متاحة",
  },
  {
    id: 10,
    name: "غرفة البلايستيشن العادية",
    description: "غرفة مناسبة للعب الجماعي والمنافسات",
    price: 70,
    capacity: 4,
    image: "https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?w=800&q=80",
    features: ["PlayStation 4", "شاشات HD", "ألعاب متنوعة"],
    status: "متاحة",
  },
];

const billiardRooms = [
  {
    id: 11,
    name: "صالة البلياردو الفاخرة",
    description: "صالة مجهزة بطاولات بلياردو احترافية في بيئة راقية",
    price: 120,
    capacity: 8,
    image: "https://images.unsplash.com/photo-1626682936672-6fa90f1a3396?w=800&q=80",
    features: ["طاولات احترافية", "إضاءة مخصصة", "مقاعد مريحة", "مشروبات"],
    status: "متاحة",
  },
  {
    id: 12,
    name: "صالة البلياردو العامة",
    description: "صالة مريحة للعب والاستمتاع مع الأصدقاء",
    price: 80,
    capacity: 6,
    image: "https://images.unsplash.com/photo-1604004555489-723a93d6ce74?w=800&q=80",
    features: ["طاولات بلياردو", "إضاءة جيدة", "مقاعد"],
    status: "متاحة",
  },
];

const RoomCard = ({ room }: { room: any }) => (
  <Card className="overflow-hidden hover-lift card-gradient border-2 animate-scale-in">
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
      <div className="flex items-baseline gap-2">
        <span className="text-3xl font-bold text-primary">{room.price}</span>
        <span className="text-muted-foreground">ريال / {room.capacity > 20 ? 'مناسبة' : 'ليلة'}</span>
      </div>

      <div className="flex flex-wrap gap-2">
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <Users className="h-4 w-4" />
          <span>{room.capacity} {room.capacity > 20 ? 'شخص' : 'أشخاص'}</span>
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
          {room.status === "متاحة" ? "عرض التفاصيل" : "غير متاحة"}
        </Button>
      </Link>
    </CardFooter>
  </Card>
);

const Rooms = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="pt-16">
        {/* Page Header */}
        <section className="bg-gradient-to-b from-primary/10 to-background py-20 px-4">
          <div className="container mx-auto text-center space-y-4 animate-fade-in">
            <h1 className="text-4xl md:text-6xl font-bold">غرفنا ومرافقنا</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              اختر من بين مجموعة متنوعة من الغرف والمرافق المجهزة بأفضل الإمكانيات
            </p>
          </div>
        </section>

        {/* Rooms Tabs */}
        <section className="py-12 px-4">
          <div className="container mx-auto">
            <Tabs defaultValue="private" className="w-full" dir="rtl">
              <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 mb-8 h-auto">
                <TabsTrigger value="private" className="gap-2 py-3">
                  <Users className="h-5 w-5" />
                  <span className="hidden sm:inline">غرف خاصة</span>
                </TabsTrigger>
                <TabsTrigger value="public" className="gap-2 py-3">
                  <Users className="h-5 w-5" />
                  <span className="hidden sm:inline">غرف عامة</span>
                </TabsTrigger>
                <TabsTrigger value="events" className="gap-2 py-3">
                  <PartyPopper className="h-5 w-5" />
                  <span className="hidden sm:inline">صالة مناسبات</span>
                </TabsTrigger>
                <TabsTrigger value="playstation" className="gap-2 py-3">
                  <Gamepad2 className="h-5 w-5" />
                  <span className="hidden sm:inline">بلايستيشن</span>
                </TabsTrigger>
                <TabsTrigger value="billiard" className="gap-2 py-3">
                  <CircleDot className="h-5 w-5" />
                  <span className="hidden sm:inline">بلياردو</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="private" className="animate-fade-in">
                <div className="mb-6 p-6 bg-card rounded-lg border">
                  <h3 className="text-2xl font-bold mb-2">الغرف الخاصة</h3>
                  <p className="text-muted-foreground">
                    غرف خاصة فاخرة مصممة لتوفير أقصى درجات الخصوصية والراحة، مثالية للأفراد والعائلات الصغيرة
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {privateRooms.map((room, index) => (
                    <div key={room.id} style={{ animationDelay: `${index * 0.05}s` }}>
                      <RoomCard room={room} />
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="public" className="animate-fade-in">
                <div className="mb-6 p-6 bg-card rounded-lg border">
                  <h3 className="text-2xl font-bold mb-2">الغرف العامة</h3>
                  <p className="text-muted-foreground">
                    غرف واسعة مصممة للعائلات والمجموعات، توفر مساحة كافية للاجتماعات والتجمعات
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {publicRooms.map((room, index) => (
                    <div key={room.id} style={{ animationDelay: `${index * 0.05}s` }}>
                      <RoomCard room={room} />
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="events" className="animate-fade-in">
                <div className="mb-6 p-6 bg-card rounded-lg border">
                  <h3 className="text-2xl font-bold mb-2">صالات المناسبات</h3>
                  <p className="text-muted-foreground">
                    صالات مجهزة بالكامل لاستضافة المناسبات والحفلات، مع أنظمة صوت وإضاءة احترافية
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {eventHalls.map((room, index) => (
                    <div key={room.id} style={{ animationDelay: `${index * 0.05}s` }}>
                      <RoomCard room={room} />
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="playstation" className="animate-fade-in">
                <div className="mb-6 p-6 bg-card rounded-lg border">
                  <h3 className="text-2xl font-bold mb-2">غرف البلايستيشن</h3>
                  <p className="text-muted-foreground">
                    غرف مجهزة بأحدث أجهزة البلايستيشن ومكتبة ألعاب ضخمة، لتجربة ألعاب استثنائية
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {playstationRooms.map((room, index) => (
                    <div key={room.id} style={{ animationDelay: `${index * 0.05}s` }}>
                      <RoomCard room={room} />
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="billiard" className="animate-fade-in">
                <div className="mb-6 p-6 bg-card rounded-lg border">
                  <h3 className="text-2xl font-bold mb-2">صالات البلياردو</h3>
                  <p className="text-muted-foreground">
                    صالات مريحة مجهزة بطاولات بلياردو احترافية لأوقات ممتعة مع الأصدقاء
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {billiardRooms.map((room, index) => (
                    <div key={room.id} style={{ animationDelay: `${index * 0.05}s` }}>
                      <RoomCard room={room} />
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Rooms;
