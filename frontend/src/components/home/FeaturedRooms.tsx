// src/components/home/FeaturedRooms.tsx
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getRooms, Room } from "@/api/rooms";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, Wifi, Coffee, Tv } from "lucide-react";
import { BASE_URL } from "@/api/axios";
import { useState } from "react";
import { toast } from "sonner";
import { useAuthStore } from "@/store/useAuthStore";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createBooking } from "@/api/bookings";

const FeaturedRooms = () => {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();

  const { data: rooms, isLoading, isError } = useQuery<Room[]>({
    queryKey: ["rooms"],
    queryFn: getRooms,
  });

  const [showModal, setShowModal] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [durationType, setDurationType] = useState<"hours" | "days">("days");
  const [durationValue, setDurationValue] = useState<number>(1);
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "wallet">("cash");
  const [walletType, setWalletType] = useState<"جوالي" | "جيب" | "ون كاش" | null>(null);
  const [walletCode, setWalletCode] = useState("");

  const bookingMutation = useMutation({
    mutationFn: async () => {
      if (!user?.id || !selectedRoom) {
        toast.error("⚠️ يجب تسجيل الدخول أولاً");
        throw new Error("User not logged in or room not selected");
      }

      const now = new Date();
      const checkOut = new Date(now);
      if (durationType === "hours") checkOut.setHours(now.getHours() + durationValue);
      else checkOut.setDate(now.getDate() + durationValue);

      const totalPrice =
        durationType === "hours"
          ? selectedRoom.price * (durationValue / 24)
          : selectedRoom.price * durationValue;

      if (paymentMethod === "wallet" && (!walletType || !walletCode.trim())) {
        toast.error("⚠️ يرجى اختيار نوع المحفظة وإدخال الكود.");
        throw new Error("Wallet details missing");
      }

      const bookingData = {
        user_id: user.id,
        room_id: selectedRoom.id,
        check_in: now.toISOString().slice(0, 19).replace("T", " "),
        check_out: checkOut.toISOString().slice(0, 19).replace("T", " "),
        guests: selectedRoom.capacity,
        total_price: totalPrice,
        status: "قيد المراجعة",
        duration_type: durationType,
        duration_value: durationValue,
        payment_method: paymentMethod,
        wallet_type: paymentMethod === "wallet" ? walletType : null,
        wallet_code: paymentMethod === "wallet" ? walletCode : null,
      };

      return await createBooking(bookingData);
    },
    onSuccess: () => {
      toast.success("✅ تم إنشاء الحجز بنجاح!");
      setShowModal(false);
      queryClient.invalidateQueries({ queryKey: ["rooms"] });
      setDurationValue(1);
      setDurationType("days");
      setPaymentMethod("cash");
      setWalletType(null);
      setWalletCode("");
    },
    onError: () => toast.error("⚠️ حدث خطأ أثناء تنفيذ الحجز."),
  });

  const handleOpenModal = (room: Room) => {
    if (!user) {
      toast.error("⚠️ يرجى تسجيل الدخول أولاً");
      return;
    }
    if (room.status === "محجوز") {
      toast.error("❌ هذه الغرفة محجوزة بالفعل.");
      return;
    }
    setSelectedRoom(room);
    setShowModal(true);
  };

  const handleConfirmBooking = () => {
    if (!durationValue || durationValue <= 0) {
      toast.error("⚠️ يرجى تحديد مدة الحجز بشكل صحيح.");
      return;
    }
    bookingMutation.mutate();
  };

  if (isLoading) return <p className="text-center py-20">جاري تحميل الغرف...</p>;
  if (isError) return <p className="text-center text-red-500 py-20">حدث خطأ أثناء تحميل الغرف.</p>;

  return (
    <section className="py-20 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-16 space-y-4 animate-fade-in">
          <Badge className="text-sm px-4 py-2">الغرف المميزة</Badge>
          <h2 className="text-4xl md:text-5xl font-bold">اختر غرفتك المثالية</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            نوفر مجموعة متنوعة من الغرف الفاخرة المجهزة بأحدث المرافق
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {rooms?.slice(0, 3).map((room, index) => (
            <Card
              key={room.id}
              className="overflow-hidden hover-lift card-gradient border-2 animate-scale-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="relative h-64 overflow-hidden">
                <img
                  src={
                    room.image_path
                      ? room.image_path.startsWith("http")
                        ? room.image_path
                        : `${BASE_URL}/storage/${room.image_path}`
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
                  <span className="text-muted-foreground">ريال / لليوم</span>
                </div>

                <div className="flex flex-wrap gap-2">
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Users className="h-4 w-4" />
                    <span>{room.capacity} أشخاص</span>
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
                    room.status === "محجوز" ? "bg-gray-400 cursor-not-allowed hover:bg-gray-400" : ""
                  }`}
                  onClick={() => handleOpenModal(room)}
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
          ))}
        </div>
      </div>

      {/* Modal الحجز */}
      {showModal && selectedRoom && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md relative">
            <h4 className="text-lg font-bold mb-4">تأكيد الحجز: {selectedRoom.name}</h4>

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
                    onValueChange={(val: "hours" | "days") => setDurationType(val)}
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
                <p className="text-lg font-bold">
                  {durationType === "hours"
                    ? selectedRoom.price * (durationValue / 24)
                    : selectedRoom.price * durationValue}{" "}
                  ريال
                </p>
              </div>

              <div>
                <Label>طريقة الدفع</Label>
                <Select
                  value={paymentMethod}
                  onValueChange={(val: "cash" | "wallet") => setPaymentMethod(val)}
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
                      onValueChange={(val: "جوالي" | "جيب" | "ون كاش") => setWalletType(val)}
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
              <Button onClick={handleConfirmBooking} disabled={bookingMutation.isPending}>
                {bookingMutation.isPending ? "جاري الحجز..." : "تأكيد"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default FeaturedRooms;
