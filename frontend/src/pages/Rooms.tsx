// src/pages/Rooms.tsx
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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
import { getRooms, Room } from "@/api/rooms";
import { createBooking } from "@/api/bookings.ts";
import { toast } from "sonner";

const RoomCard = ({ room }: { room: Room }) => {
  const queryClient = useQueryClient();

  const bookingMutation = useMutation({
    mutationFn: async () => {
      const bookingData = {
        user_id: 1,
        room_id: room.id,
        check_in: new Date().toISOString().split("T")[0],
        check_out: new Date(Date.now() + 24 * 60 * 60 * 1000)
          .toISOString()
          .split("T")[0],
        guests: 1,
        total_price: room.price,
        status: "قيد المراجعة",
      };
      return await createBooking(bookingData);
    },
    onSuccess: () => {
      toast.success("✅ تم إنشاء الحجز بنجاح!");
      queryClient.invalidateQueries({ queryKey: ["rooms"] }); // تحديث الغرف
    },
    onError: () => toast.error("⚠️ حدث خطأ أثناء تنفيذ الحجز."),
  });

  const handleBooking = () => {
    if (room.status === "محجوز") {
      toast.error("❌ هذه الغرفة محجوزة بالفعل.");
      return;
    }
    if (confirm(`هل ترغب في حجز "${room.name}"؟`)) {
      bookingMutation.mutate();
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
        <CardDescription>{room.description}</CardDescription>
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
            <span>{room.capacity} {room.capacity > 20 ? "شخص" : "أشخاص"}</span>
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
          disabled={room.status === "محجوز" || bookingMutation.isPending}
        >
          {room.status === "محجوز"
            ? "محجوزة"
            : bookingMutation.isPending
            ? "جاري الحجز..."
            : "احجز الآن"}
        </Button>
      </CardFooter>
    </Card>
  );
};

const CategorySection = ({
  title,
  rooms,
}: {
  title: string;
  rooms: Room[];
}) => (
  <>
    <div className="mb-6 p-6 bg-card rounded-lg border">
      <h3 className="text-2xl font-bold mb-2">{title}</h3>
      <p className="text-muted-foreground">عرض جميع {title} المتاحة لدينا</p>
    </div>

    {rooms.length === 0 ? (
      <p className="text-center text-muted-foreground">
        لا توجد غرف في هذه الفئة حاليا.
      </p>
    ) : (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {rooms.map((room, index) => (
          <div key={room.id} style={{ animationDelay: `${index * 0.05}s` }}>
            <RoomCard room={room} />
          </div>
        ))}
      </div>
    )}
  </>
);

const Rooms = () => {
  const { data: rooms = [], isLoading } = useQuery<Room[], Error>({
    queryKey: ["rooms"],
    queryFn: getRooms,
  });

  const privateRooms = rooms.filter((r) => r.category === "غرف خاصة");
  const publicRooms = rooms.filter((r) => r.category === "غرف عامة");
  const eventHalls = rooms.filter((r) => r.category === "صالات المناسبات");
  const playstationRooms = rooms.filter((r) => r.category === "غرف البلايستيشن");
  const billiardRooms = rooms.filter((r) => r.category === "صالات البلياردو");

  if (isLoading)
    return (
      <div className="flex justify-center items-center min-h-screen text-xl">
        جاري تحميل الغرف...
      </div>
    );

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="pt-16">
        <section className="bg-gradient-to-b from-primary/10 to-background py-20 px-4">
          <div className="container mx-auto text-center space-y-4 animate-fade-in">
            <h1 className="text-4xl md:text-6xl font-bold">غرفنا ومرافقنا</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              اختر من بين مجموعة متنوعة من الغرف والمرافق المجهزة بأفضل الإمكانيات
            </p>
          </div>
        </section>

        <section className="py-12 px-4">
          <div className="container mx-auto">
            <Tabs defaultValue="private" className="w-full" dir="rtl">
              <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 mb-8 h-auto">
                <TabsTrigger value="private">غرف خاصة</TabsTrigger>
                <TabsTrigger value="public">غرف عامة</TabsTrigger>
                <TabsTrigger value="events">صالات المناسبات</TabsTrigger>
                <TabsTrigger value="playstation">بلايستيشن</TabsTrigger>
                <TabsTrigger value="billiard">بلياردو</TabsTrigger>
              </TabsList>

              <TabsContent value="private">
                <CategorySection title="الغرف الخاصة" rooms={privateRooms} />
              </TabsContent>
              <TabsContent value="public">
                <CategorySection title="الغرف العامة" rooms={publicRooms} />
              </TabsContent>
              <TabsContent value="events">
                <CategorySection title="صالات المناسبات" rooms={eventHalls} />
              </TabsContent>
              <TabsContent value="playstation">
                <CategorySection
                  title="غرف البلايستيشن"
                  rooms={playstationRooms}
                />
              </TabsContent>
              <TabsContent value="billiard">
                <CategorySection title="صالات البلياردو" rooms={billiardRooms} />
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
