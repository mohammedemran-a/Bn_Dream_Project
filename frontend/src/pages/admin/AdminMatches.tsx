import { useState } from "react";
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

const matchesData = [
  { 
    id: 1, 
    team1: "الأهلي", 
    team2: "الهلال", 
    date: "2025-10-23",
    time: "20:00", 
    channel: "SSC1",
    result: "2-1",
    status: "منتهية"
  },
  { 
    id: 2, 
    team1: "الاتحاد", 
    team2: "النصر", 
    date: "2025-10-24",
    time: "18:00", 
    channel: "SSC2",
    result: null,
    status: "قادمة"
  },
];

const AdminMatches = () => {
  const [matches, setMatches] = useState(matchesData);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <AdminLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">إدارة المباريات</h1>
            <p className="text-muted-foreground">إضافة المباريات وتحديث نتائجها</p>
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2 shadow-elegant">
                <Plus className="w-4 h-4" />
                إضافة مباراة
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>إضافة مباراة جديدة</DialogTitle>
              </DialogHeader>
              <form className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="team1">الفريق الأول</Label>
                    <Input id="team1" placeholder="الأهلي" />
                  </div>
                  <div>
                    <Label htmlFor="team2">الفريق الثاني</Label>
                    <Input id="team2" placeholder="الهلال" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="date">التاريخ</Label>
                    <Input id="date" type="date" />
                  </div>
                  <div>
                    <Label htmlFor="time">الوقت</Label>
                    <Input id="time" type="time" />
                  </div>
                </div>
                <div>
                  <Label htmlFor="channel">القناة الناقلة</Label>
                  <Input id="channel" placeholder="SSC1" />
                </div>
                <div className="flex gap-2 justify-end">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    إلغاء
                  </Button>
                  <Button type="submit">حفظ</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>قائمة المباريات</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>الفريق الأول</TableHead>
                  <TableHead>الفريق الثاني</TableHead>
                  <TableHead>التاريخ</TableHead>
                  <TableHead>الوقت</TableHead>
                  <TableHead>القناة</TableHead>
                  <TableHead>النتيجة</TableHead>
                  <TableHead>الحالة</TableHead>
                  <TableHead className="text-right">العمليات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {matches.map((match) => (
                  <TableRow key={match.id} className="hover:bg-accent/5">
                    <TableCell className="font-medium">{match.team1}</TableCell>
                    <TableCell className="font-medium">{match.team2}</TableCell>
                    <TableCell>{match.date}</TableCell>
                    <TableCell>{match.time}</TableCell>
                    <TableCell>{match.channel}</TableCell>
                    <TableCell>
                      {match.result ? (
                        <span className="font-bold text-primary">{match.result}</span>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant={match.status === "منتهية" ? "outline" : "default"}>
                        {match.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex gap-2 justify-end">
                        <Button size="sm" variant="ghost" className="hover:bg-primary/10">
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="ghost" className="hover:bg-destructive/10 hover:text-destructive">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminMatches;
