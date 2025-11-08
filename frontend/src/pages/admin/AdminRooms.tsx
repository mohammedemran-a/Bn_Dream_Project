// src/pages/admin/AdminRooms.tsx
import { useEffect, useState, ChangeEvent, FormEvent } from "react";
import { useQuery, useMutation, useQueryClient, UseQueryResult } from "@tanstack/react-query";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import axios from "@/api/axios";

// ===========================================
// 📦 API FUNCTIONS
// ===========================================
export interface Room {
  id: number;
  category: string;
  name: string;
  price: number;
  capacity: number;
  status: string;
  description: string;
  features: string;
  image_path?: string;
}

const API_URL = "/api/rooms";

const getRooms = async (): Promise<Room[]> => {
  const response = await axios.get(API_URL);
  return response.data;
};

const createRoom = async (data: FormData) => {
  const response = await axios.post(API_URL, data);
  return response.data;
};

const updateRoom = async (id: number, data: FormData) => {
  const response = await axios.post(`${API_URL}/${id}?_method=PUT`, data);
  return response.data;
};

const deleteRoom = async (id: number) => {
  await axios.delete(`${API_URL}/${id}`);
};

// ===========================================
// 🧩 COMPONENT
// ===========================================
const categories = [
  "غرف خاصة",
  "غرف عامة",
  "صالات المناسبات",
  "غرف البلايستيشن",
  "صالات البلياردو",
];

interface RoomForm {
  category: string;
  name: string;
  price: string;
  capacity: string;
  status: string;
  description: string;
  features: string;
  image: File | null;
}

const AdminRooms = () => {
  const queryClient = useQueryClient();
  const hasPermission = useAuthStore((s) => s.hasPermission);

  // ✅ جلب الغرف عبر React Query
  const { data: rooms = [], isLoading }: UseQueryResult<Room[], Error> = useQuery({
    queryKey: ["rooms"],
    queryFn: getRooms,
  });

  // ✅ Mutations
  const createMutation = useMutation({
    mutationFn: (formData: FormData) => createRoom(formData),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["rooms"] }),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: FormData }) => updateRoom(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["rooms"] }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteRoom(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["rooms"] }),
  });

  // ✅ الحالة المحلية للنموذج
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);
  const [form, setForm] = useState<RoomForm>({
    category: "غرف خاصة",
    name: "",
    price: "",
    capacity: "",
    status: "متاح",
    description: "",
    features: "",
    image: null,
  });

  // ✅ التعامل مع تغييرات الحقول
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setForm((prev) => ({ ...prev, [id]: value }));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setForm((prev) => ({ ...prev, image: e.target.files![0] }));
    }
  };

  // ✅ حفظ أو تحديث الغرفة
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if (value !== null) formData.append(key, value as string | Blob);
    });

    if (editingRoom) {
      if (!hasPermission("rooms_edit")) return alert("🚫 ليس لديك صلاحية التعديل!");
      updateMutation.mutate({ id: editingRoom.id, data: formData });
    } else {
      if (!hasPermission("rooms_create")) return alert("🚫 ليس لديك صلاحية الإضافة!");
      createMutation.mutate(formData);
    }

    setIsDialogOpen(false);
    setEditingRoom(null);
    resetForm();
  };

  const resetForm = () => {
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
  };

  // ✅ تعديل غرفة
  const handleEdit = (room: Room) => {
    setEditingRoom(room);
    setForm({
      category: room.category,
      name: room.name,
      price: room.price.toString(),
      capacity: room.capacity.toString(),
      status: room.status,
      description: room.description,
      features: room.features,
      image: null,
    });
    setIsDialogOpen(true);
  };

  // ✅ حذف غرفة
  const handleDelete = (id: number) => {
    if (!hasPermission("rooms_delete")) return alert("🚫 ليس لديك صلاحية الحذف!");
    if (confirm("هل أنت متأكد من حذف هذه الغرفة؟")) {
      deleteMutation.mutate(id);
    }
  };

  // ✅ جدول الغرف حسب التصنيف
  const RoomsTable = ({ category }: { category: string }) => {
    const filtered = rooms.filter((r) => r.category === category);
    return (
      <div dir="rtl" className="overflow-x-auto">
        <Table className="text-right w-full">
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
            {filtered.length > 0 ? (
              filtered.map((room) => (
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
                    <div className="flex gap-2 justify-start">
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
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-6">
                  لا توجد غرف في هذا التصنيف
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
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
        {/* ✅ العنوان + زر الإضافة */}
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">إدارة الغرف</h1>

          {(hasPermission("rooms_create") || hasPermission("rooms_edit")) && (
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                {hasPermission("rooms_create") && (
                  <Button
                    className="gap-2"
                    onClick={() => {
                      setEditingRoom(null);
                      resetForm();
                    }}
                  >
                    <Plus className="w-4 h-4" /> إضافة غرفة جديدة
                  </Button>
                )}
              </DialogTrigger>
              <DialogContent dir="rtl" className="sm:max-w-[600px] text-right">
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
                      <Input id="price" type="number" value={form.price} onChange={handleChange} required />
                    </div>
                    <div>
                      <Label htmlFor="capacity">عدد الأشخاص</Label>
                      <Input id="capacity" type="number" value={form.capacity} onChange={handleChange} />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="description">الوصف</Label>
                    <Textarea id="description" value={form.description} onChange={handleChange} />
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
                    <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                      إلغاء
                    </Button>
                    <Button type="submit">{editingRoom ? "تحديث" : "حفظ"}</Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          )}
        </div>

        {/* ✅ التبويبات */}
        <Tabs defaultValue="غرف خاصة" dir="rtl" className="text-right">
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
                  {isLoading ? (
                    <p className="text-center py-6">جاري تحميل الغرف...</p>
                  ) : (
                    <RoomsTable category={cat} />
                  )}
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
