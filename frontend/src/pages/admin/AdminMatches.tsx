"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useAuthStore } from "@/store/useAuthStore";
import { getMatches, createMatch, updateMatch, deleteMatch, Match } from "@/api/football_matches.ts";

export default function AdminMatches() {
  const hasPermission = useAuthStore((state) => state.hasPermission);
  const queryClient = useQueryClient();

  // 🟢 جلب المباريات
  const { data, isLoading, isError } = useQuery({
    queryKey: ["matches"],
    queryFn: async () => {
      const response = await getMatches();
      return response.data;
    },
    enabled: hasPermission("matches_view"),
  });

  // 🎯 Mutations
  const createMutation = useMutation({
    mutationFn: (data: Omit<Match, "id">) => createMatch(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["matches"] }),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Match> }) =>
      updateMatch(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["matches"] }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteMatch(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["matches"] }),
  });

  // 🧩 حالات النموذج
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingMatch, setEditingMatch] = useState<Match | null>(null);
  const [formData, setFormData] = useState<Omit<Match, "id">>({
    team1: "",
    team2: "",
    date: "",
    time: "",
    channel: "",
    result: "",
    status: "قادمة",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingMatch) {
        if (!hasPermission("matches_edit"))
          return alert("🚫 ليس لديك صلاحية التعديل!");
        await updateMutation.mutateAsync({
          id: editingMatch.id!,
          data: formData,
        });
      } else {
        if (!hasPermission("matches_create"))
          return alert("🚫 ليس لديك صلاحية الإضافة!");
        await createMutation.mutateAsync(formData);
      }
      handleCloseDialog();
    } catch (error) {
      console.error("❌ خطأ أثناء الحفظ:", error);
    }
  };

  const handleEdit = (match: Match) => {
    if (!hasPermission("matches_edit"))
      return alert("🚫 ليس لديك صلاحية التعديل!");
    setEditingMatch(match);
    setFormData({
      team1: match.team1,
      team2: match.team2,
      date: match.date,
      time: match.time,
      channel: match.channel,
      result: match.result ?? "",
      status: match.status,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!hasPermission("matches_delete"))
      return alert("🚫 ليس لديك صلاحية الحذف!");
    if (!window.confirm("هل أنت متأكد من حذف المباراة؟")) return;
    await deleteMutation.mutateAsync(id);
  };

  const handleCloseDialog = () => {
    setEditingMatch(null);
    setFormData({
      team1: "",
      team2: "",
      date: "",
      time: "",
      channel: "",
      result: "",
      status: "قادمة",
    });
    setIsDialogOpen(false);
  };

  if (!hasPermission("matches_view")) {
    return (
      <AdminLayout>
        <p className="text-center text-red-600 text-lg mt-10">
          🚫 ليس لديك صلاحية عرض المباريات
        </p>
      </AdminLayout>
    );
  }

  if (isLoading) {
    return (
      <AdminLayout>
        <p className="text-center mt-10">⏳ جارٍ تحميل المباريات...</p>
      </AdminLayout>
    );
  }

  if (isError) {
    return (
      <AdminLayout>
        <p className="text-center text-red-600 mt-10">
          ❌ حدث خطأ أثناء تحميل البيانات
        </p>
      </AdminLayout>
    );
  }

  const matches: Match[] = data || [];

  return (
    <AdminLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">إدارة المباريات</h1>
            <p className="text-muted-foreground">
              إضافة المباريات وتحديث نتائجها
            </p>
          </div>

          {hasPermission("matches_create") && (
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  className="gap-2 shadow-elegant"
                  onClick={() => {
                    setEditingMatch(null);
                    setFormData({
                      team1: "",
                      team2: "",
                      date: "",
                      time: "",
                      channel: "",
                      result: "",
                      status: "قادمة",
                    });
                  }}
                >
                  <Plus className="w-4 h-4" />
                  إضافة مباراة
                </Button>
              </DialogTrigger>

              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    {editingMatch ? "تعديل المباراة" : "إضافة مباراة جديدة"}
                  </DialogTitle>
                  <DialogDescription>
                    {editingMatch
                      ? "قم بتعديل بيانات المباراة ثم اضغط تحديث"
                      : "أدخل بيانات المباراة الجديدة ثم اضغط حفظ"}
                  </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>الفريق الأول</Label>
                      <Input
                        value={formData.team1}
                        onChange={(e) =>
                          setFormData({ ...formData, team1: e.target.value })
                        }
                        required
                      />
                    </div>
                    <div>
                      <Label>الفريق الثاني</Label>
                      <Input
                        value={formData.team2}
                        onChange={(e) =>
                          setFormData({ ...formData, team2: e.target.value })
                        }
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>التاريخ</Label>
                      <Input
                        type="date"
                        value={formData.date}
                        onChange={(e) =>
                          setFormData({ ...formData, date: e.target.value })
                        }
                        required
                      />
                    </div>
                    <div>
                      <Label>الوقت</Label>
                      <Input
                        type="time"
                        value={formData.time}
                        onChange={(e) =>
                          setFormData({ ...formData, time: e.target.value })
                        }
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label>القناة الناقلة</Label>
                    <Input
                      value={formData.channel}
                      onChange={(e) =>
                        setFormData({ ...formData, channel: e.target.value })
                      }
                      required
                    />
                  </div>

                  <div>
                    <Label>النتيجة</Label>
                    <Input
                      placeholder="مثال: 2-1"
                      value={formData.result}
                      onChange={(e) =>
                        setFormData({ ...formData, result: e.target.value })
                      }
                    />
                  </div>

                  <div>
                    <Label>الحالة</Label>
                    <select
                      value={formData.status}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          status: e.target
                            .value as "قادمة" | "جارية" | "منتهية",
                        })
                      }
                      className="border rounded-md w-full p-2"
                    >
                      <option value="قادمة">قادمة</option>
                      <option value="جارية">جارية</option>
                      <option value="منتهية">منتهية</option>
                    </select>
                  </div>

                  <div className="flex gap-2 justify-end">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleCloseDialog}
                    >
                      إلغاء
                    </Button>
                    <Button type="submit">
                      {editingMatch ? "تحديث" : "حفظ"}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          )}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>قائمة المباريات</CardTitle>
          </CardHeader>
          <CardContent>
            <div dir="rtl"  className="overflow-x-auto">
              <Table  className="min-w-full border-collapse text-center">
                <TableHeader>
                  <TableRow>
                <TableHead className="text-center w-[180px]">الفريق الأول</TableHead>
                <TableHead className="text-center w-[180px]">الفريق الثاني</TableHead>
                <TableHead className="text-center w-[140px]">التاريخ</TableHead>
                <TableHead className="text-center w-[120px]">الوقت</TableHead>
                <TableHead className="text-center w-[200px]">القناة</TableHead>
                <TableHead className="text-center w-[120px]">النتيجة</TableHead>
                <TableHead className="text-center w-[120px]">الحالة</TableHead>
                <TableHead className="text-center w-[150px]">العمليات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {matches.map((match) => (
                    <TableRow key={match.id} className="hover:bg-accent/5">
                      <TableCell>{match.team1}</TableCell>
                      <TableCell>{match.team2}</TableCell>
                      <TableCell>{match.date}</TableCell>
                      <TableCell>{match.time}</TableCell>
                      <TableCell>{match.channel}</TableCell>
                      <TableCell>
                        {match.result || (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            match.status === "منتهية"
                              ? "outline"
                              : match.status === "جارية"
                              ? "default"
                              : "secondary"
                          }
                        >
                          {match.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2 justify-end">
                          {hasPermission("matches_edit") && (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleEdit(match)}
                            >
                              <Pencil className="w-4 h-4" />
                            </Button>
                          )}
                          {hasPermission("matches_delete") && (
                            <Button
                              size="sm"
                              variant="ghost"
                              className="hover:bg-destructive/10 hover:text-destructive"
                              onClick={() => handleDelete(match.id!)}
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
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
