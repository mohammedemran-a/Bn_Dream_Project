import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { Badge } from "@/components/ui/badge";
import {
  getMatches,
  createMatch,
  updateMatch,
  deleteMatch,
} from "@/api/football_matches";

const AdminMatches = () => {
  const [matches, setMatches] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingMatch, setEditingMatch] = useState(null);
  const [formData, setFormData] = useState({
    team1: "",
    team2: "",
    date: "",
    time: "",
    channel: "",
    result: "",
    status: "قادمة",
  });

  // 🟢 تحميل جميع المباريات عند فتح الصفحة
  useEffect(() => {
    fetchMatches();
  }, []);

  const fetchMatches = async () => {
    try {
      const response = await getMatches();
      setMatches(response.data);
    } catch (error) {
      console.error("❌ خطأ أثناء جلب المباريات:", error);
    }
  };

  // 🟡 حفظ أو تعديل مباراة
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingMatch) {
        await updateMatch(editingMatch.id, formData);
      } else {
        await createMatch(formData);
      }

      fetchMatches();
      handleCloseDialog();
    } catch (error) {
      console.error("❌ خطأ أثناء الحفظ:", error);
    }
  };

  // ✏️ فتح النموذج للتعديل
  const handleEdit = (match) => {
    setEditingMatch(match);
    setFormData({
      team1: match.team1,
      team2: match.team2,
      date: match.date,
      time: match.time,
      channel: match.channel,
      result: match.result || "",
      status: match.status,
    });
    setIsDialogOpen(true);
  };

  // 🔴 حذف مباراة
  const handleDelete = async (id) => {
    if (!window.confirm("هل أنت متأكد من حذف المباراة؟")) return;
    try {
      await deleteMatch(id);
      fetchMatches();
    } catch (error) {
      console.error("❌ خطأ أثناء الحذف:", error);
    }
  };

  // 📦 إغلاق النافذة وإعادة التهيئة
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

  return (
    <AdminLayout>
      <div className="space-y-6 animate-fade-in">
        {/* رأس الصفحة */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">إدارة المباريات</h1>
            <p className="text-muted-foreground">
              إضافة المباريات وتحديث نتائجها
            </p>
          </div>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button
                className="gap-2 shadow-elegant"
                onClick={() => setEditingMatch(null)}
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
              </DialogHeader>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="team1">الفريق الأول</Label>
                    <Input
                      id="team1"
                      value={formData.team1}
                      onChange={(e) =>
                        setFormData({ ...formData, team1: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="team2">الفريق الثاني</Label>
                    <Input
                      id="team2"
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
                    <Label htmlFor="date">التاريخ</Label>
                    <Input
                      id="date"
                      type="date"
                      value={formData.date}
                      onChange={(e) =>
                        setFormData({ ...formData, date: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="time">الوقت</Label>
                    <Input
                      id="time"
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
                  <Label htmlFor="channel">القناة الناقلة</Label>
                  <Input
                    id="channel"
                    value={formData.channel}
                    onChange={(e) =>
                      setFormData({ ...formData, channel: e.target.value })
                    }
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="result">النتيجة</Label>
                  <Input
                    id="result"
                    value={formData.result}
                    onChange={(e) =>
                      setFormData({ ...formData, result: e.target.value })
                    }
                  />
                </div>

                <div>
                  <Label htmlFor="status">الحالة</Label>
                  <select
                    id="status"
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({ ...formData, status: e.target.value })
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
        </div>

        {/* جدول عرض المباريات */}
        <Card>
          <CardHeader>
            <CardTitle>قائمة المباريات</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table className="w-full text-right">
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-right">الفريق الأول</TableHead>
                    <TableHead className="text-right">الفريق الثاني</TableHead>
                    <TableHead className="text-right">التاريخ</TableHead>
                    <TableHead className="text-right">الوقت</TableHead>
                    <TableHead className="text-right">القناة</TableHead>
                    <TableHead className="text-right">النتيجة</TableHead>
                    <TableHead className="text-right">الحالة</TableHead>
                    <TableHead className="text-right">العمليات</TableHead>
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
                        {match.result ? (
                          <span className="font-bold text-primary">
                            {match.result}
                          </span>
                        ) : (
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
                      <TableCell className="text-right">
                        <div className="flex gap-2 justify-end">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleEdit(match)}
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="hover:bg-destructive/10 hover:text-destructive"
                            onClick={() => handleDelete(match.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
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
