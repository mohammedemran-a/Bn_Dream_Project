/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCart } from "@/contexts/CartContext";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Trash2, Plus, Minus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { createOrder } from "@/api/orders.ts";
import { toast } from "sonner";
import { useAuthStore } from "@/store/useAuthStore"; // ✅ تم الاستدعاء من هنا

export const CartSheet = () => {
  const { items, totalItems, totalPrice, removeItem, updateQuantity, clearCart } = useCart();
  const { user } = useAuthStore(); // ✅ أخذ بيانات المستخدم من Zustand

  // 🟢 دالة إنشاء الطلب
  const handleCreateOrder = async () => {
    if (!user) {
      toast.error("يرجى تسجيل الدخول أولاً.");
      return;
    }

    if (items.length === 0) {
      toast.error("السلة فارغة!");
      return;
    }

    const productsData = items.map((p) => ({
      id: p.id,
      quantity: p.quantity,
    }));

    try {
      const response = await createOrder({
        user_id: user.id, // ✅ أخذ id المستخدم من Zustand
        products: productsData,
        total: totalPrice,
      });

      toast.success("تم إنشاء الطلب بنجاح ✅");
      clearCart();
      console.log("Order created:", response);
    } catch (error: any) {
      if (error.response?.data?.errors) {
        const messages = Object.values(error.response.data.errors).flat().join(", ");
        toast.error("فشل إنشاء الطلب: " + messages);
      } else {
        toast.error("فشل إنشاء الطلب 😢");
      }
    }
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <ShoppingCart className="h-5 w-5" />
          {totalItems > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-2 -left-2 h-5 w-5 flex items-center justify-center p-0 text-xs"
            >
              {totalItems}
            </Badge>
          )}
        </Button>
      </SheetTrigger>

      <SheetContent side="left" className="w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>السلة</SheetTitle>
          <SheetDescription>
            {totalItems > 0 ? `لديك ${totalItems} منتج في السلة` : "السلة فارغة"}
          </SheetDescription>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
            <ShoppingCart className="h-24 w-24 text-muted-foreground" />
            <p className="text-muted-foreground text-lg">السلة فارغة</p>
          </div>
        ) : (
          <>
            <ScrollArea className="h-[calc(100vh-280px)] mt-6">
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={`${item.category}-${item.id}`} className="flex gap-4 p-4 border rounded-lg">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded-md"
                    />
                    <div className="flex-1 space-y-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-semibold">{item.name}</h4>
                          <p className="text-sm text-muted-foreground">{item.category}</p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeItem(item.id)}
                          className="hover:bg-destructive/10 hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2 border rounded-md">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="w-8 text-center">{item.quantity}</span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                        <p className="font-bold text-primary">
                          {item.price * item.quantity} ريال
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            <Separator className="my-4" />

            <SheetFooter className="flex-col gap-4">
              <div className="flex justify-between items-center w-full text-lg font-bold">
                <span>المجموع:</span>
                <span className="text-primary">{totalPrice} ريال</span>
              </div>

              <div className="flex gap-2 w-full">
                <Button variant="outline" onClick={clearCart} className="flex-1">
                  تفريغ السلة
                </Button>
                <Button onClick={handleCreateOrder} className="flex-1 shadow-elegant">
                  إتمام الطلب
                </Button>
              </div>
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
};
