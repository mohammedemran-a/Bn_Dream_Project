"use client";

import { useEffect, useState } from "react";
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
import { useMatchesStore, Match } from "@/store/useMatchesStore";

const AdminMatches = () => {
  const hasPermission = useAuthStore(state => state.hasPermission);

  const { matches, fetchMatches, createMatch, updateMatch, deleteMatch } = useMatchesStore();
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingMatch, setEditingMatch] = useState<Match | null>(null);
  const [formData, setFormData] = useState<Partial<Match>>({
    team1: "",
    team2: "",
    date: "",
    time: "",
    channel: "",
    result: "",
    status: "قادمة",
  });

  useEffect(() => {
    if (hasPermission("matches_view")) fetchMatches();
  }, [hasPermission, fetchMatches]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingMatch) {
        if (!hasPermission("matches_edit")) return alert("🚫 ليس لديك صلاحية التعديل!");
        await updateMatch(editingMatch.id, formData);
      } else {
        if (!hasPermission("matches_create")) return alert("🚫 ليس لديك صلاحية الإضافة!");
        await createMatch(formData);
      }
      fetchMatches();
      handleCloseDialog();
    } catch (error) {
      console.error("❌ خطأ أثناء الحفظ:", error);
    }
  };

  const handleEdit = (match: Match) => {
    if (!hasPermission("matches_edit")) return alert("🚫 ليس لديك صلاحية التعديل!");
    setEditingMatch(match);
    setFormData({ ...match });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!hasPermission("matches_delete")) return alert("🚫 ليس لديك صلاحية الحذف!");
    if (!window.confirm("هل أنت متأكد من حذف المباراة؟")) return;
    await deleteMatch(id);
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

  return (
    <AdminLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">إدارة المباريات</h1>
            <p className="text-muted-foreground">إضافة المباريات وتحديث نتائجها</p>
          </div>

          {(hasPermission("matches_create") || hasPermission("matches_edit")) && (
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                {hasPermission("matches_create") && (
                  <Button className="gap-2 shadow-elegant" onClick={() => setEditingMatch(null)}>
                    <Plus className="w-4 h-4" />
                    إضافة مباراة
                  </Button>
                )}
              </DialogTrigger>

              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{editingMatch ? "تعديل المباراة" : "إضافة مباراة جديدة"}</DialogTitle>
                  <DialogDescription>
                    {editingMatch
                      ? "قم بتعديل بيانات المباراة ثم اضغط تحديث"
                      : "أدخل بيانات المباراة الجديدة ثم اضغط حفظ"}
                  </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="team1">الفريق الأول</Label>
                      <Input
                        id="team1"
                        value={formData.team1 || ""}
                        onChange={(e) => setFormData({ ...formData, team1: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="team2">الفريق الثاني</Label>
                      <Input
                        id="team2"
                        value={formData.team2 || ""}
                        onChange={(e) => setFormData({ ...formData, team2: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="date">التاريخ</Label>
                      <Input
                        id="date"
                        type="date"
                        value={formData.date || ""}
                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="time">الوقت</Label>
                      <Input
                        id="time"
                        type="time"
                        value={formData.time || ""}
                        onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="channel">القناة الناقلة</Label>
                    <Input
                      id="channel"
                      value={formData.channel || ""}
                      onChange={(e) => setFormData({ ...formData, channel: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="result">النتيجة</Label>
                    <Input
                      id="result"
                      placeholder="مثال: 2-1"
                      value={formData.result || ""}
                      onChange={(e) => setFormData({ ...formData, result: e.target.value })}
                    />
                  </div>

                  <div>
                    <Label htmlFor="status">الحالة</Label>
                    <select
                      id="status"
                      value={formData.status || "قادمة"}
                      onChange={(e) =>
                        setFormData({ ...formData, status: e.target.value as "قادمة" | "جارية" | "منتهية" })
                      }
                      className="border rounded-md w-full p-2"
                    >
                      <option value="قادمة">قادمة</option>
                      <option value="جارية">جارية</option>
                      <option value="منتهية">منتهية</option>
                    </select>
                  </div>

                  <div className="flex gap-2 justify-end">
                    <Button type="button" variant="outline" onClick={handleCloseDialog}>إلغاء</Button>
                    <Button type="submit">{editingMatch ? "تحديث" : "حفظ"}</Button>
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
            <div className="overflow-x-auto">
              <Table className="w-full text-right">
                <TableHeader>
                  <TableRow>
                    <TableHead>الفريق الأول</TableHead>
                    <TableHead>الفريق الثاني</TableHead>
                    <TableHead>التاريخ</TableHead>
                    <TableHead>الوقت</TableHead>
                    <TableHead>القناة</TableHead>
                    <TableHead>النتيجة</TableHead>
                    <TableHead>الحالة</TableHead>
                    <TableHead>العمليات</TableHead>
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
                      <TableCell>{match.result || <span className="text-muted-foreground">-</span>}</TableCell>
                      <TableCell>
                        <Badge variant={match.status === "منتهية" ? "outline" : match.status === "جارية" ? "default" : "secondary"}>
                          {match.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2 justify-end">
                          {hasPermission("matches_edit") && <Button size="sm" variant="ghost" onClick={() => handleEdit(match)}><Pencil className="w-4 h-4" /></Button>}
                          {hasPermission("matches_delete") && <Button size="sm" variant="ghost" className="hover:bg-destructive/10 hover:text-destructive" onClick={() => handleDelete(match.id)}><Trash2 className="w-4 h-4" /></Button>}
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
};

export default AdminMatches;
