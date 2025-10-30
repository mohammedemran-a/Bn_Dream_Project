import { useEffect, useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Users,
  Wifi,
  Coffee,
  Tv,
  Gamepad2,
  CircleDot,
  PartyPopper,
} from "lucide-react";
import { getRooms } from "@/api/rooms.js";
import { createBooking } from "@/api/bookings.js"; // 🟢 استيراد واجهة الحجز

// 🟡 مكون عرض كل غرفة
const RoomCard = ({ room, onBooked }) => {
  const handleBooking = async () => {
    if (room.status === "محجوز") {
      alert("❌ هذه الغرفة محجوزة بالفعل.");
      return;
    }

    const confirmBooking = window.confirm(`هل ترغب في حجز "${room.name}"؟`);
    if (!confirmBooking) return;

    try {
      const bookingData = {
        user_id: 1, // 🔸 مؤقتًا، غيّر لاحقًا إلى المستخدم الحالي
        room_id: room.id,
        check_in: new Date().toISOString().split("T")[0], // اليوم
        check_out: new Date(Date.now() + 24 * 60 * 60 * 1000)
          .toISOString()
          .split("T")[0], // الغد
        guests: 1,
        total_price: room.price,
        status: "قيد المراجعة",
      };

      const response = await createBooking(bookingData);

      alert("✅ تم إنشاء الحجز بنجاح!");
      console.log("Booking response:", response);

      // تحديث حالة الغرفة في الواجهة
      onBooked(room.id);
    } catch (error) {
      console.error("خطأ أثناء الحجز:", error);
      alert("⚠️ حدث خطأ أثناء تنفيذ الحجز.");
    }
  };

  return (
    <Card className="overflow-hidden hover-lift card-gradient border-2 animate-scale-in">
      <div className="relative h-64 overflow-hidden">
        <img
          src={
            room.image_path
              ? `http://localhost:8000/storage/${room.image_path}`
              : "https://via.placeholder.com/800x600?text=No+Image"
          }
          alt={room.name}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
        />
        <Badge
          className={`absolute top-4 right-4 ${
            room.status === "متاح" ? "bg-green-500" : "bg-red-500"
          }`}
        >
          {room.status}
        </Badge>
      </div>

      <CardHeader>
        <CardTitle className="text-2xl">{room.name}</CardTitle>
        <CardDescription className="text-base">
          {room.description}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold text-primary">{room.price}</span>
          <span className="text-muted-foreground">
            ريال / {room.capacity > 20 ? "مناسبة" : "ليلة"}
          </span>
        </div>

        <div className="flex flex-wrap gap-2">
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Users className="h-4 w-4" />
            <span>
              {room.capacity} {room.capacity > 20 ? "شخص" : "أشخاص"}
            </span>
          </div>

          {room.features?.includes("واي فاي") && (
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Wifi className="h-4 w-4" />
              <span>واي فاي</span>
            </div>
          )}
          {room.features?.includes("تلفاز") && (
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Tv className="h-4 w-4" />
              <span>تلفاز</span>
            </div>
          )}
          {room.features?.includes("قهوة") && (
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Coffee className="h-4 w-4" />
              <span>قهوة</span>
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter>
        <Button
          className="w-full shadow-elegant"
          onClick={handleBooking}
          disabled={room.status === "محجوز"}
        >
          {room.status === "محجوز" ? "محجوزة" : "احجز الآن"}
        </Button>
      </CardFooter>
    </Card>
  );
};

// 🟣 الصفحة الرئيسية للغرف
const Rooms = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const { data } = await getRooms();
        setRooms(data);
      } catch (err) {
        console.error("حدث خطأ أثناء جلب البيانات:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchRooms();
  }, []);

  // 🔵 تحديث حالة الغرفة بعد الحجز
  const handleRoomBooked = (roomId) => {
    setRooms((prev) =>
      prev.map((r) =>
        r.id === roomId ? { ...r, status: "محجوز" } : r
      )
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen text-xl">
        جاري التحميل...
      </div>
    );
  }

  const privateRooms = rooms.filter((r) => r.category === "غرف خاصة");
  const publicRooms = rooms.filter((r) => r.category === "غرف عامة");
  const eventHalls = rooms.filter((r) => r.category === "صالات المناسبات");
  const playstationRooms = rooms.filter(
    (r) => r.category === "غرف البلايستيشن"
  );
  const billiardRooms = rooms.filter((r) => r.category === "صالات البلياردو");

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="pt-16">
        <section className="bg-gradient-to-b from-primary/10 to-background py-20 px-4">
          <div className="container mx-auto text-center space-y-4 animate-fade-in">
            <h1 className="text-4xl md:text-6xl font-bold">غرفنا ومرافقنا</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              اختر من بين مجموعة متنوعة من الغرف والمرافق المجهزة بأفضل
              الإمكانيات
            </p>
          </div>
        </section>

        <section className="py-12 px-4">
          <div className="container mx-auto">
            <Tabs defaultValue="private" className="w-full" dir="rtl">
              <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 mb-8 h-auto">
                <TabsTrigger value="private" className="gap-2 py-3">
                  <Users className="h-5 w-5" />
                  <span>غرف خاصة</span>
                </TabsTrigger>
                <TabsTrigger value="public" className="gap-2 py-3">
                  <Users className="h-5 w-5" />
                  <span>غرف عامة</span>
                </TabsTrigger>
                <TabsTrigger value="events" className="gap-2 py-3">
                  <PartyPopper className="h-5 w-5" />
                  <span>صالات المناسبات</span>
                </TabsTrigger>
                <TabsTrigger value="playstation" className="gap-2 py-3">
                  <Gamepad2 className="h-5 w-5" />
                  <span>بلايستيشن</span>
                </TabsTrigger>
                <TabsTrigger value="billiard" className="gap-2 py-3">
                  <CircleDot className="h-5 w-5" />
                  <span>بلياردو</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="private">
                <CategorySection
                  title="الغرف الخاصة"
                  rooms={privateRooms}
                  onBooked={handleRoomBooked}
                />
              </TabsContent>

              <TabsContent value="public">
                <CategorySection
                  title="الغرف العامة"
                  rooms={publicRooms}
                  onBooked={handleRoomBooked}
                />
              </TabsContent>

              <TabsContent value="events">
                <CategorySection
                  title="صالات المناسبات"
                  rooms={eventHalls}
                  onBooked={handleRoomBooked}
                />
              </TabsContent>

              <TabsContent value="playstation">
                <CategorySection
                  title="غرف البلايستيشن"
                  rooms={playstationRooms}
                  onBooked={handleRoomBooked}
                />
              </TabsContent>

              <TabsContent value="billiard">
                <CategorySection
                  title="صالات البلياردو"
                  rooms={billiardRooms}
                  onBooked={handleRoomBooked}
                />
              </TabsContent>
            </Tabs>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

// 🟠 مكون عرض الفئة
const CategorySection = ({ title, rooms, onBooked }) => (
  <>
    <div className="mb-6 p-6 bg-card rounded-lg border">
      <h3 className="text-2xl font-bold mb-2">{title}</h3>
      <p className="text-muted-foreground">
        عرض جميع {title} المتاحة لدينا
      </p>
    </div>

    {rooms.length === 0 ? (
      <p className="text-center text-muted-foreground">
        لا توجد غرف في هذه الفئة حاليا.
      </p>
    ) : (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {rooms.map((room, index) => (
          <div key={room.id} style={{ animationDelay: `${index * 0.05}s` }}>
            <RoomCard room={room} onBooked={onBooked} />
          </div>
        ))}
      </div>
    )}
  </>
);

export default Rooms;
