// src/pages/Rooms.tsx
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import BottomNav from "@/components/layout/BottomNav";
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
import { Users, Wifi, Coffee, Tv } from "lucide-react";
import { getRooms, Room } from "@/api/rooms";
import { createBooking } from "@/api/bookings";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuthStore } from "@/store/useAuthStore";
import { BASE_URL } from "@/api/axios";

const RoomCard = ({ room }: { room: Room }) => {
  const queryClient = useQueryClient();
  const { user } = useAuthStore();
  const [showModal, setShowModal] = useState(false);
  const [durationType, setDurationType] = useState<"hours" | "days">("days");
  const [durationValue, setDurationValue] = useState<number>(1);

  const [paymentMethod, setPaymentMethod] = useState<"cash" | "wallet">("cash");
  const [walletType, setWalletType] = useState<"جوالي" | "جيب" | "ون كاش" | null>(null);
  const [walletCode, setWalletCode] = useState("");

  const totalPrice =
    durationType === "hours"
      ? room.price * (durationValue / 24)
      : room.price * durationValue;

  const formatDate = (date: Date) =>
    date.toISOString().slice(0, 19).replace("T", " ");

  const bookingMutation = useMutation({
    mutationFn: async () => {
      if (!user?.id) {
        toast.error("⚠️ يجب تسجيل الدخول أولاً");
        throw new Error("User not logged in");
      }

      const now = new Date();
      const checkOut = new Date(now);
      if (durationType === "hours") checkOut.setHours(now.getHours() + durationValue);
      else checkOut.setDate(now.getDate() + durationValue);

      const bookingData = {
        user_id: user.id,
        room_id: room.id,
        check_in: formatDate(now),
        check_out: formatDate(checkOut),
        guests: room.capacity,
        total_price: totalPrice,
        status: "قيد المراجعة",
        duration_type: durationType,
        duration_value: durationValue,
        payment_method: paymentMethod,
        wallet_type: paymentMethod === "wallet" ? walletType : null,
        wallet_code: paymentMethod === "wallet" ? walletCode : null,
      };

      if (paymentMethod === "wallet") {
        if (!walletType || !walletCode.trim()) {
          toast.error("⚠️ يرجى اختيار نوع المحفظة وإدخال الكود.");
          throw new Error("Wallet details missing");
        }
      }

      return await createBooking(bookingData);
    },
    onSuccess: () => {
      toast.success("✅ تم إنشاء الحجز بنجاح!");
      setShowModal(false);
      queryClient.invalidateQueries({ queryKey: ["rooms"] });
    },
    onError: () => toast.error("⚠️ حدث خطأ أثناء تنفيذ الحجز."),
  });

  // ✅ التعديل هنا فقط
  const handleOpenModal = () => {
    if (!user) {
      toast.error("⚠️ يرجى تسجيل الدخول أولاً");
      return;
    }

    if (room.status === "محجوز") {
      toast.error("❌ هذه الغرفة محجوزة بالفعل.");
      return;
    }

    setShowModal(true);
  };

  const handleConfirmBooking = () => {
    if (!durationValue || durationValue <= 0) {
      toast.error("⚠️ يرجى تحديد مدة الحجز بشكل صحيح.");
      return;
    }
    bookingMutation.mutate();
  };

  return (
    <>
      <Card className="overflow-hidden hover-lift card-gradient border-2 animate-scale-in">
        <div className="relative h-64 overflow-hidden">
          <img
            src={
              room.image_path
                ? `${BASE_URL}/storage/${room.image_path}`
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
            className={`w-full shadow-elegant ${
              room.status === "محجوز"
                ? "bg-gray-400 cursor-not-allowed hover:bg-gray-400"
                : ""
            }`}
            onClick={handleOpenModal}
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

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md relative">
            <h4 className="text-lg font-bold mb-4">تأكيد الحجز: {room.name}</h4>
            <div className="space-y-4">
              <div>
                <Label>المدة</Label>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    min={1}
                    value={durationValue}
                    onChange={(e) => setDurationValue(Number(e.target.value))}
                  />
                  <Select
                    onValueChange={(val: "hours" | "days") =>
                      setDurationType(val)
                    }
                    defaultValue="days"
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="اختر النوع" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hours">ساعات</SelectItem>
                      <SelectItem value="days">أيام</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label>السعر الإجمالي</Label>
                <p className="text-lg font-bold">{totalPrice} ريال</p>
              </div>

              <div>
                <Label>طريقة الدفع</Label>
                <Select
                  value={paymentMethod}
                  onValueChange={(val: "cash" | "wallet") =>
                    setPaymentMethod(val)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="اختر طريقة الدفع" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cash">نقدًا عند الوصول</SelectItem>
                    <SelectItem value="wallet">عبر المحفظة</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {paymentMethod === "wallet" && (
                <>
                  <div>
                    <Label>نوع المحفظة</Label>
                    <Select
                      value={walletType || ""}
                      onValueChange={(val: "جوالي" | "جيب" | "ون كاش") =>
                        setWalletType(val)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="اختر نوع المحفظة" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="جوالي">جوالي</SelectItem>
                        <SelectItem value="جيب">جيب</SelectItem>
                        <SelectItem value="ون كاش">ون كاش</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>كود المحفظة</Label>
                    <Input
                      type="text"
                      value={walletCode}
                      onChange={(e) => setWalletCode(e.target.value)}
                      placeholder="أدخل كود المحفظة هنا"
                    />
                  </div>
                </>
              )}
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <Button variant="outline" onClick={() => setShowModal(false)}>
                إلغاء
              </Button>
              <Button
                onClick={handleConfirmBooking}
                disabled={bookingMutation.isPending}
              >
                {bookingMutation.isPending ? "جاري الحجز..." : "تأكيد"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

// باقي الصفحة بدون تعديل
const CategorySection = ({ title, rooms }: { title: string; rooms: Room[] }) => (
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
                <CategorySection title="غرف البلايستيشن" rooms={playstationRooms} />
              </TabsContent>
              <TabsContent value="billiard">
                <CategorySection title="صالات البلياردو" rooms={billiardRooms} />
              </TabsContent>
            </Tabs>
          </div>
        </section>
      </main>
      <Footer />
      <BottomNav />
    </div>
  );
};

export default Rooms;
