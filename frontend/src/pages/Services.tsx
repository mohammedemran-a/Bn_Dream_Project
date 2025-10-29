/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useCallback } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Coffee, Wifi, Leaf, Fuel, Building2 } from "lucide-react";

// 💡 1. استيراد دالة جلب المنتجات الحقيقية من ملف الاتصال الخاص بك
import { getProducts } from "@/api/products"; // افترض أن ملف الاتصال موجود في مسار "@/api/products"

// 2. الفئات المعتمدة من لوحة التحكم
const categories = ["البقالة", "القات", "الشيشة", "الكروت", "القهوة"];

// أيقونات مرتبطة بالفئات
const categoryIcons = {
    "البقالة": ShoppingCart,
    "القات": Leaf,
    "الشيشة": Fuel, 
    "الكروت": Wifi,
    "القهوة": Coffee,
};

const ServiceCard = ({ item }: { item: any }) => {
    // 3. بناء مسار الصورة بناءً على المنطق في لوحة التحكم
    // إذا كانت الصورة تبدأ بـ 'http' فهي رابط خارجي، وإلا فهي ملف محلي
    const imagePath = item.image && item.image.startsWith("http") 
        ? item.image 
        : `http://127.0.0.1:8000/storage/${item.image}`;

    return (
        <Card className="overflow-hidden hover-lift card-gradient border-2">
            <div className="h-48 overflow-hidden">
                <img src={imagePath} alt={item.name} className="w-full h-full object-cover transition-transform duration-500 hover:scale-110" />
            </div>
            <CardHeader>
                <CardTitle>{item.name}</CardTitle>
                {/* 4. عرض الوصف إذا كان متوفراً (افترض أن البيانات المسترجعة تحوي حقلاً للوصف) */}
                {item.description && (
                    <CardDescription className="text-sm mt-1">{item.description}</CardDescription>
                )}
                <CardDescription className="text-2xl font-bold text-primary mt-2">{item.price} ريال</CardDescription>
            </CardHeader>
            <CardFooter>
                <Button className="w-full shadow-elegant">اطلب الآن</Button>
            </CardFooter>
        </Card>
    );
};

const Services = () => {
    const [products, setProducts] = useState([]); 
    const [loading, setLoading] = useState(true);

    // 5. دالة الجلب التي تستخدم API
    const fetchProducts = useCallback(async () => {
        try {
            setLoading(true);
            // 💡 استدعاء دالة API الحقيقية
            const response = await getProducts(); 
            // 💡 Axios يضع البيانات في حقل 'data'
            setProducts(response.data.data || response.data); 
        } catch (error) {
            console.error("خطأ أثناء جلب المنتجات من API:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    // دالة لتجميع العناصر حسب النوع (Type)
    const groupProductsByType = (items) => {
        return items.reduce((acc, item) => {
            // يتم التجميع بناءً على حقل 'type'
            (acc[item.type] = acc[item.type] || []).push(item); 
            return acc;
        }, {});
    };

    const groupedProducts = groupProductsByType(products);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-xl">جاري تحميل الخدمات... ☕</p>
            </div>
        );
    }

    const defaultTab = categories[0];

    return (
        <div className="min-h-screen">
            <Navbar />
            <main className="pt-16">
                {/* رأس الصفحة */}
                <section className="bg-gradient-to-b from-primary/10 to-background py-20 px-4">
                    <div className="container mx-auto text-center space-y-4 animate-fade-in">
                        <h1 className="text-4xl md:text-6xl font-bold">خدماتنا المتميزة</h1>
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                            اطلب ما تحتاجه من منتجات وخدمات متنوعة بكل سهولة
                        </p>
                    </div>
                </section>

                {/* تبويبات الخدمات */}
                <section className="py-12 px-4">
                    <div className="container mx-auto">
                        <Tabs defaultValue={defaultTab} className="w-full" dir="rtl">
                            <TabsList className="grid w-full grid-cols-5 mb-8 h-auto">
                                {categories.map((cat) => {
                                    const Icon = categoryIcons[cat] || Building2; 
                                    return (
                                        <TabsTrigger key={cat} value={cat} className="gap-2 py-3">
                                            <Icon className="h-5 w-5" />
                                            <span className="hidden sm:inline">{cat}</span>
                                        </TabsTrigger>
                                    );
                                })}
                            </TabsList>

                            {/* محتوى التبويبات بناءً على الفئات والمنتجات المجلوبة من API */}
                            {categories.map((cat) => (
                                <TabsContent key={cat} value={cat} className="animate-fade-in">
                                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                        {(groupedProducts[cat] || []).map((item, index) => (
                                            <div key={item.id} className="animate-scale-in" style={{ animationDelay: `${index * 0.05}s` }}>
                                                <ServiceCard item={item} />
                                            </div>
                                        ))}
                                    </div>
                                    {(groupedProducts[cat]?.length === 0 || !groupedProducts[cat]) && (
                                        <div className="text-center p-10 border rounded-lg bg-card text-muted-foreground">
                                            لا توجد منتجات متاحة في تصنيف **{cat}** حالياً.
                                        </div>
                                    )}
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