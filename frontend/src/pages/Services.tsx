/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Coffee, Wifi } from "lucide-react";
import { getProducts } from "@/api/products";
import { createOrder } from "@/api/orders";
import { toast } from "sonner";

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
  description?: string;
}

interface CartItem {
  product: Product;
  quantity: number;
}

// ✅ بطاقة المنتج مع التحكم في الكمية وزر إضافة للسلة
const ServiceCard = ({
  item,
  addToCart,
}: {
  item: Product;
  addToCart: (product: Product, quantity: number) => void;
}) => {
  const [quantity, setQuantity] = useState(1);

  return (
    <Card className="overflow-hidden hover-lift card-gradient border-2">
      <div className="h-48 overflow-hidden">
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
        />
      </div>
      <CardHeader>
        <CardTitle>{item.name}</CardTitle>
        {item.description && (
          <CardDescription className="text-sm mt-1">{item.description}</CardDescription>
        )}
        <CardDescription className="text-2xl font-bold text-primary mt-2">
          {item.price} ريال
        </CardDescription>

        {/* حقل تحديد الكمية */}
        <div className="flex items-center mt-2 gap-2">
          <Button size="sm" onClick={() => setQuantity(q => Math.max(1, q - 1))}>
            -
          </Button>
          <input
            type="number"
            className="w-12 text-center border rounded"
            value={quantity}
            min={1}
            onChange={e => setQuantity(Number(e.target.value))}
          />
          <Button size="sm" onClick={() => setQuantity(q => q + 1)}>
            +
          </Button>
        </div>
      </CardHeader>
      <CardFooter>
        <Button onClick={() => addToCart(item, quantity)} className="w-full shadow-elegant">
          أضف إلى السلة
        </Button>
      </CardFooter>
    </Card>
  );
};

const Services = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await getProducts();
        console.log("Products data:", response.data);
        const productList = Array.isArray(response.data)
          ? response.data
          : response.data.data || [];
        setProducts(productList);
      } catch (error) {
        console.error("حدث خطأ أثناء جلب المنتجات:", error);
        toast.error("تعذر تحميل المنتجات ❌");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // ✅ إضافة منتج للسلة
  const addToCart = (product: Product, quantity: number) => {
    setCart(prev => {
      const existing = prev.find(p => p.product.id === product.id);
      if (existing) {
        existing.quantity += quantity;
        return [...prev];
      }
      return [...prev, { product, quantity }];
    });
    toast.success(`${product.name} أضيف إلى السلة ✅`);
  };

  // ✅ إنشاء الطلب لجميع منتجات السلة
  const handleCreateOrder = async () => {
    const userId = localStorage.getItem("user_id");
    if (!userId) return toast.error("يرجى تسجيل الدخول أولاً.");
    if (cart.length === 0) return toast.error("السلة فارغة!");

    const productsData = cart.map(p => ({ id: p.product.id, quantity: p.quantity }));
    const total = cart.reduce((sum, p) => sum + p.product.price * p.quantity, 0);

    try {
      const response = await createOrder({ user_id: Number(userId), products: productsData, total });
      toast.success("تم إنشاء الطلب بنجاح ✅");
      setCart([]); // تفريغ السلة بعد الطلب
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

  const filterByCategory = (category: string) => {
    if (!Array.isArray(products)) return [];
    return products.filter(p => p.category === category);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-xl font-bold">
        جاري تحميل المنتجات...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="pt-16">
        <section className="bg-gradient-to-b from-primary/10 to-background py-20 px-4">
          <div className="container mx-auto text-center space-y-4 animate-fade-in">
            <h1 className="text-4xl md:text-6xl font-bold">خدماتنا المتميزة</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              اطلب ما تحتاجه من خدمات متنوعة بكل سهولة
            </p>
          </div>
        </section>

        <section className="py-12 px-4">
          <div className="container mx-auto">
            <Tabs defaultValue="بقالة" className="w-full" dir="rtl">
              <TabsList className="grid w-full grid-cols-5 mb-8 h-auto">
                <TabsTrigger value="بقالة" className="gap-2 py-3">
                  <ShoppingCart className="h-5 w-5" />
                  <span>البقالة</span>
                </TabsTrigger>
                <TabsTrigger value="قهوة" className="gap-2 py-3">
                  <Coffee className="h-5 w-5" />
                  <span>القهوة</span>
                </TabsTrigger>
                <TabsTrigger value="قات" className="gap-2 py-3">
                  <Coffee className="h-5 w-5" />
                  <span>القات</span>
                </TabsTrigger>
                <TabsTrigger value="شيشة" className="gap-2 py-3">
                  <Coffee className="h-5 w-5" />
                  <span>الشيشة</span>
                </TabsTrigger>
                <TabsTrigger value="كروت" className="gap-2 py-3">
                  <Wifi className="h-5 w-5" />
                  <span>كروت الشبكة</span>
                </TabsTrigger>
              </TabsList>

              {["بقالة", "قهوة", "قات", "شيشة", "كروت"].map(category => (
                <TabsContent key={category} value={category} className="animate-fade-in">
                  <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {filterByCategory(category).map((item, index) => (
                      <div
                        key={item.id}
                        className="animate-scale-in"
                        style={{ animationDelay: `${index * 0.05}s` }}
                      >
                        <ServiceCard item={item} addToCart={addToCart} />
                      </div>
                    ))}
                    {filterByCategory(category).length === 0 && (
                      <p className="text-center col-span-full text-muted-foreground">
                        لا توجد منتجات في هذا القسم حالياً.
                      </p>
                    )}
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </div>
        </section>

        {/* زر إنشاء الطلب من السلة */}
        {cart.length > 0 && (
          <div className="fixed bottom-4 right-4 bg-white border p-4 rounded shadow-lg z-50">
            <p className="mb-2 font-bold">السلة: {cart.length} منتجات</p>
            <p className="mb-2">المجموع: {cart.reduce((sum, p) => sum + p.product.price * p.quantity, 0)} ريال</p>
            <Button onClick={handleCreateOrder} className="w-full">
              إنشاء الطلب
            </Button>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Services;
