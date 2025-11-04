import { useState, useEffect, useCallback } from "react";
import {
  getRooms,
  createRoom,
  updateRoom,
  deleteRoom,
} from "@/api/rooms";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/context/AuthContext";

const categories = [
  "غرف خاصة",
  "غرف عامة",
  "صالات المناسبات",
  "غرف البلايستيشن",
  "صالات البلياردو",
];

const AdminRooms = () => {
  const { hasPermission } = useAuth();
  const [rooms, setRooms] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);
  const [form, setForm] = useState({
    category: "غرف خاصة",
    name: "",
    price: "",
    capacity: "",
    status: "متاح",
    description: "",
    features: "",
    image: null,
  });

  const fetchRooms = useCallback(async () => {
    try {
      const { data } = await getRooms();
      setRooms(data);
    } catch (error) {
      console.error("خطأ أثناء جلب الغرف:", error);
    }
  }, []);

  useEffect(() => {
    if (hasPermission("rooms_view")) {
      fetchRooms();
    }
  }, [fetchRooms, hasPermission]);

  const resetForm = useCallback(() => {
    setForm({
      category: "غرف خاصة",
      name: "",
      price: "",
      capacity: "",
      status: "متاح",
      description: "",
      features: "",
      image: null,
    });
  }, []);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleFileChange = (e) => {
    setForm((prev) => ({ ...prev, image: e.target.files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if (value !== null) formData.append(key, value);
    });

    try {
      if (editingRoom) {
        if (!hasPermission("rooms_edit")) return alert("🚫 ليس لديك صلاحية التعديل!");
        await updateRoom(editingRoom.id, formData);
      } else {
        if (!hasPermission("rooms_create")) return alert("🚫 ليس لديك صلاحية الإضافة!");
        await createRoom(formData);
      }
      await fetchRooms();
      setIsDialogOpen(false);
      setEditingRoom(null);
      resetForm();
    } catch (error) {
      console.error("خطأ أثناء الحفظ:", error);
    }
  };

  const handleEdit = (room) => {
    if (!hasPermission("rooms_edit")) return alert("🚫 ليس لديك صلاحية التعديل!");
    setEditingRoom(room);
    setForm({
      category: room.category,
      name: room.name,
      price: room.price,
      capacity: room.capacity,
      status: room.status,
      description: room.description,
      features: room.features,
      image: null,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = useCallback(
    async (id) => {
      if (!hasPermission("rooms_delete")) return alert("🚫 ليس لديك صلاحية الحذف!");
      if (confirm("هل أنت متأكد من حذف هذه الغرفة؟")) {
        try {
          await deleteRoom(id);
          await fetchRooms();
        } catch (error) {
          console.error("خطأ أثناء الحذف:", error);
        }
      }
    },
    [fetchRooms, hasPermission]
  );

  const RoomsTable = ({ category }) => {
    const filtered = rooms.filter((room) => room.category === category);
    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>الصورة</TableHead>
            <TableHead>الاسم</TableHead>
            <TableHead>السعر</TableHead>
            <TableHead>السعة</TableHead>
            <TableHead>الحالة</TableHead>
            <TableHead>العمليات</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filtered.map((room) => (
            <TableRow key={room.id}>
              <TableCell>
                <img
                  src={`http://localhost:8000/storage/${room.image_path}`}
                  alt={room.name}
                  className="w-16 h-16 object-cover rounded"
                />
              </TableCell>
              <TableCell>{room.name}</TableCell>
              <TableCell>{room.price} ريال</TableCell>
              <TableCell>{room.capacity}</TableCell>
              <TableCell>
                <Badge variant={room.status === "متاح" ? "default" : "secondary"}>
                  {room.status}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex gap-2 justify-end">
                  {hasPermission("rooms_edit") && (
                    <Button size="sm" variant="ghost" onClick={() => handleEdit(room)}>
                      <Pencil className="w-4 h-4" />
                    </Button>
                  )}
                  {hasPermission("rooms_delete") && (
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-destructive"
                      onClick={() => handleDelete(room.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  };

  if (!hasPermission("rooms_view")) {
    return (
      <AdminLayout>
        <p className="text-center text-red-600 text-lg mt-10">
          🚫 ليس لديك صلاحية عرض الغرف
        </p>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">إدارة الغرف</h1>

          {(hasPermission("rooms_create") || hasPermission("rooms_edit")) && (
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                {hasPermission("rooms_create") && (
                  <Button
                    className="gap-2"
                    onClick={() => {
                      resetForm();
                      setEditingRoom(null);
                    }}
                  >
                    <Plus className="w-4 h-4" />
                    إضافة غرفة جديدة
                  </Button>
                )}
              </DialogTrigger>

              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>
                    {editingRoom ? "تعديل الغرفة" : "إضافة غرفة جديدة"}
                  </DialogTitle>
                  <DialogDescription>
                    {editingRoom
                      ? "قم بتعديل بيانات الغرفة ثم اضغط تحديث"
                      : "أدخل بيانات الغرفة الجديدة ثم اضغط حفظ"}
                  </DialogDescription>
                </DialogHeader>

                <form className="space-y-4" onSubmit={handleSubmit}>
                  <div>
                    <Label>التصنيف</Label>
                    <Select
                      value={form.category}
                      onValueChange={(v) => setForm((p) => ({ ...p, category: v }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="اختر التصنيف" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((c) => (
                          <SelectItem key={c} value={c}>
                            {c}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="name">اسم الغرفة</Label>
                    <Input id="name" value={form.name} onChange={handleChange} required />
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
                      <Label htmlFor="capacity">عدد الأشخاص</Label>
                      <Input
                        id="capacity"
                        type="number"
                        value={form.capacity}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="description">الوصف</Label>
                    <Textarea
                      id="description"
                      value={form.description}
                      onChange={handleChange}
                    />
                  </div>

                  <div>
                    <Label htmlFor="features">المرافق</Label>
                    <Input id="features" value={form.features} onChange={handleChange} />
                  </div>

                  <div>
                    <Label htmlFor="image">الصورة</Label>
                    <Input id="image" type="file" accept="image/*" onChange={handleFileChange} />
                    {editingRoom?.image_path && (
                      <img
                        src={`http://localhost:8000/storage/${editingRoom.image_path}`}
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
                    <Button type="submit">{editingRoom ? "تحديث" : "حفظ"}</Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          )}
        </div>

        <Tabs defaultValue="غرف خاصة">
          <TabsList className="grid grid-cols-5">
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
                  <RoomsTable category={cat} />
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default AdminRooms;
