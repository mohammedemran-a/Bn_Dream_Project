import { useState, useEffect, useCallback, useMemo } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, Pencil, Trash2 } from "lucide-react";
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "@/api/products";
import { Badge } from "@/components/ui/badge";

const categories = ["البقالة", "القات", "الشيشة", "الكروت"];

const AdminServices = () => {
  const [products, setProducts] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const [form, setForm] = useState({
    type: "البقالة",
    name: "",
    price: "",
    stock: "",
    category: "",
    image: null,
  });

  // 🟢 جلب المنتجات
  const fetchProducts = useCallback(async () => {
    try {
      const { data } = await getProducts();
      setProducts(data);
    } catch (error) {
      console.error("خطأ أثناء جلب المنتجات:", error);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // 🧹 إعادة ضبط النموذج
  const resetForm = useCallback(() => {
    setForm({
      type: "البقالة",
      name: "",
      price: "",
      stock: "",
      category: "",
      image: null,
    });
  }, []);

  // ✍️ تغيير القيم
  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleFileChange = (e) => {
    setForm((prev) => ({ ...prev, image: e.target.files[0] }));
  };

  // 💾 حفظ أو تحديث منتج
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if (value !== null) formData.append(key, value);
    });

    try {
      if (editingProduct) {
        await updateProduct(editingProduct.id, formData);
      } else {
        await createProduct(formData);
      }

      await fetchProducts();
      setIsDialogOpen(false);
      setEditingProduct(null);
      resetForm();
    } catch (error) {
      console.error("خطأ أثناء الحفظ:", error);
    }
  };

  // ✏️ تعديل منتج
  const handleEdit = (product) => {
    setEditingProduct(product);
    setForm({
      type: product.type,
      name: product.name,
      price: product.price,
      stock: product.stock,
      category: product.category,
      image: null,
    });
    setIsDialogOpen(true);
  };

  // 🗑️ حذف منتج
  const handleDelete = useCallback(
    async (id) => {
      if (confirm("هل أنت متأكد من حذف هذا المنتج؟")) {
        try {
          await deleteProduct(id);
          await fetchProducts();
        } catch (error) {
          console.error("خطأ أثناء الحذف:", error);
        }
      }
    },
    [fetchProducts]
  );

  // 📋 جدول المنتجات
  const ProductsTable = useMemo(
    () =>
      ({ type }) => {
        const filtered = products.filter((p) => p.type === type);
        return (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>الصورة</TableHead>
                <TableHead>الاسم</TableHead>
                <TableHead>السعر</TableHead>
                <TableHead>الكمية</TableHead>
                <TableHead>الفئة</TableHead>
                <TableHead>العمليات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <img
                      src={
                        product.image?.startsWith("http")
                          ? product.image
                          : `http://127.0.0.1:8000/storage/${product.image}`
                      }
                      alt={product.name}
                      className="w-16 h-16 object-cover rounded border"
                    />
                  </TableCell>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>{product.price} ريال</TableCell>
                  <TableCell>{product.stock}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{product.category}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2 justify-end">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleEdit(product)}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-destructive"
                        onClick={() => handleDelete(product.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-6 text-gray-500">
                    لا توجد منتجات في هذا التصنيف
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        );
      },
    [products, handleDelete]
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">إدارة المنتجات</h1>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button
                className="gap-2"
                onClick={() => {
                  resetForm();
                  setEditingProduct(null);
                }}
              >
                <Plus className="w-4 h-4" />
                إضافة منتج جديد
              </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>
                  {editingProduct ? "تعديل المنتج" : "إضافة منتج جديد"}
                </DialogTitle>
              </DialogHeader>

              <form className="space-y-4" onSubmit={handleSubmit}>
                <div>
                  <Label>التصنيف</Label>
                  <select
                    className="w-full border rounded-md p-2"
                    value={form.type}
                    onChange={(e) => setForm((p) => ({ ...p, type: e.target.value }))}
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <Label htmlFor="name">اسم المنتج</Label>
                  <Input
                    id="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="price">السعر (ريال)</Label>
                    <Input
                      id="price"
                      type="number"
                      value={form.price}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="stock">الكمية</Label>
                    <Input
                      id="stock"
                      type="number"
                      value={form.stock}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="category">الفئة</Label>
                  <Input
                    id="category"
                    value={form.category}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <Label htmlFor="image">صورة المنتج</Label>
                  <Input
                    id="image"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                  {editingProduct?.image && (
                    <img
                      src={`http://127.0.0.1:8000/storage/${editingProduct.image}`}
                      alt="Current"
                      className="w-24 h-24 object-cover mt-2 rounded"
                    />
                  )}
                </div>

                <div className="flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                  >
                    إلغاء
                  </Button>
                  <Button type="submit">
                    {editingProduct ? "تحديث" : "حفظ"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <Tabs defaultValue="البقالة">
          <TabsList className="grid grid-cols-4">
            {categories.map((cat) => (
              <TabsTrigger key={cat} value={cat}>
                {cat}
              </TabsTrigger>
            ))}
          </TabsList>

          {categories.map((cat) => (
            <TabsContent key={cat} value={cat}>
              <Card>
                <CardHeader>
                  <CardTitle>{cat}</CardTitle>
                </CardHeader>
                <CardContent>
                  <ProductsTable type={cat} />
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default AdminServices;
