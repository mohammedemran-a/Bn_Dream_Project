import { useEffect, useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Coffee, Wifi } from "lucide-react";
import { getProducts } from "@/api/products";
import { toast } from "sonner";
import { useCart } from "@/contexts/CartContext";
import { CartSheet } from "@/components/cart/CartSheet";

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
  description?: string;
}

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
          <CardDescription className="text-sm mt-1">
            {item.description}
          </CardDescription>
        )}
        <CardDescription className="text-2xl font-bold text-primary mt-2">
          {item.price} ريال
        </CardDescription>

        <div className="flex items-center mt-2 gap-2">
          <Button size="sm" onClick={() => setQuantity((q) => Math.max(1, q - 1))}>
            -
          </Button>
          <input
            type="number"
            className="w-12 text-center border rounded"
            value={quantity}
            min={1}
            onChange={(e) => setQuantity(Number(e.target.value))}
          />
          <Button size="sm" onClick={() => setQuantity((q) => q + 1)}>
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
  const { addItem } = useCart();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await getProducts();
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

  const filterByCategory = (category: string) =>
    Array.isArray(products) ? products.filter((p) => p.category === category) : [];

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
                {["بقالة", "قهوة", "قات", "شيشة", "كروت"].map((c) => (
                  <TabsTrigger key={c} value={c} className="gap-2 py-3">
                    <ShoppingCart className="h-5 w-5" />
                    <span>{c}</span>
                  </TabsTrigger>
                ))}
              </TabsList>

              {["بقالة", "قهوة", "قات", "شيشة", "كروت"].map((category) => (
                <TabsContent key={category} value={category} className="animate-fade-in">
                  <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {filterByCategory(category).map((item, index) => (
                      <div key={item.id} style={{ animationDelay: `${index * 0.05}s` }}>
                        <ServiceCard
                          item={item}
                          addToCart={(product, quantity) =>
                            addItem(
                              {
                                id: product.id,
                                name: product.name,
                                price: product.price,
                                image: product.image,
                                category: product.category,
                              },
                              quantity
                            )
                          }
                        />
                      </div>
                    ))}
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Services;
