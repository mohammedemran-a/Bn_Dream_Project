import { useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { 
  Plus, 
  Pencil, 
  Trash2, 
  Megaphone, 
  Eye,
  EyeOff,
  Image,
  Sparkles,
  Percent,
  Gift,
  Star,
  Search
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface Ad {
  id: number;
  title: string;
  description: string;
  discount?: string;
  badge?: string;
  image: string;
  type: string;
  link: string;
  isActive: boolean;
  gradient: string;
}

const initialAds: Ad[] = [
  {
    id: 1,
    title: "عرض خاص على الغرف الملكية",
    description: "احجز الآن واحصل على خصم 30% على جميع الغرف الملكية لفترة محدودة",
    discount: "30%",
    image: "https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=1200&q=80",
    type: "hot",
    link: "/rooms",
    isActive: true,
    gradient: "from-orange-500/20 via-red-500/20 to-pink-500/20",
  },
  {
    id: 2,
    title: "هدايا مجانية مع كل حجز",
    description: "اطلب خدماتنا الآن واحصل على هدية قيمة مجانية مع كل طلب",
    badge: "جديد",
    image: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=1200&q=80",
    type: "new",
    link: "/services",
    isActive: true,
    gradient: "from-blue-500/20 via-cyan-500/20 to-teal-500/20",
  },
  {
    id: 3,
    title: "عروض المباريات الحصرية",
    description: "شاهد أهم المباريات مع تخفيضات خاصة على المشروبات والقهوة",
    badge: "مميز",
    image: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=1200&q=80",
    type: "featured",
    link: "/matches",
    isActive: true,
    gradient: "from-purple-500/20 via-pink-500/20 to-rose-500/20",
  },
  {
    id: 4,
    title: "تجربة البلايستيشن الحصرية",
    description: "ساعة مجانية عند حجز 3 ساعات في غرف البلايستيشن VIP",
    discount: "1+3",
    image: "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=1200&q=80",
    type: "gaming",
    link: "/rooms",
    isActive: false,
    gradient: "from-green-500/20 via-emerald-500/20 to-teal-500/20",
  },
];

const adTypes = [
  { value: "hot", label: "عرض ساخن", icon: Percent },
  { value: "new", label: "جديد", icon: Gift },
  { value: "featured", label: "مميز", icon: Star },
  { value: "gaming", label: "ألعاب", icon: Sparkles },
];

const gradientOptions = [
  { value: "from-orange-500/20 via-red-500/20 to-pink-500/20", label: "برتقالي - أحمر" },
  { value: "from-blue-500/20 via-cyan-500/20 to-teal-500/20", label: "أزرق - سماوي" },
  { value: "from-purple-500/20 via-pink-500/20 to-rose-500/20", label: "بنفسجي - وردي" },
  { value: "from-green-500/20 via-emerald-500/20 to-teal-500/20", label: "أخضر - زمردي" },
];

const AdminAds = () => {
  const [ads, setAds] = useState<Ad[]>(initialAds);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAd, setEditingAd] = useState<Ad | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    discount: "",
    badge: "",
    image: "",
    type: "hot",
    link: "/rooms",
    gradient: "from-orange-500/20 via-red-500/20 to-pink-500/20",
  });

  const filteredAds = ads.filter(ad => 
    ad.title.includes(searchQuery) || ad.description.includes(searchQuery)
  );

  const handleOpenDialog = (ad?: Ad) => {
    if (ad) {
      setEditingAd(ad);
      setFormData({
        title: ad.title,
        description: ad.description,
        discount: ad.discount || "",
        badge: ad.badge || "",
        image: ad.image,
        type: ad.type,
        link: ad.link,
        gradient: ad.gradient,
      });
    } else {
      setEditingAd(null);
      setFormData({
        title: "",
        description: "",
        discount: "",
        badge: "",
        image: "",
        type: "hot",
        link: "/rooms",
        gradient: "from-orange-500/20 via-red-500/20 to-pink-500/20",
      });
    }
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    if (!formData.title || !formData.description || !formData.image) {
      toast({
        title: "خطأ",
        description: "يرجى ملء جميع الحقول المطلوبة",
        variant: "destructive",
      });
      return;
    }

    if (editingAd) {
      setAds(ads.map(ad => 
        ad.id === editingAd.id 
          ? { ...ad, ...formData, isActive: ad.isActive }
          : ad
      ));
      toast({
        title: "تم التحديث",
        description: "تم تحديث الإعلان بنجاح",
      });
    } else {
      const newAd: Ad = {
        id: Math.max(...ads.map(a => a.id)) + 1,
        ...formData,
        isActive: true,
      };
      setAds([...ads, newAd]);
      toast({
        title: "تمت الإضافة",
        description: "تم إضافة الإعلان بنجاح",
      });
    }
    setIsDialogOpen(false);
  };

  const handleDelete = (id: number) => {
    setAds(ads.filter(ad => ad.id !== id));
    toast({
      title: "تم الحذف",
      description: "تم حذف الإعلان بنجاح",
    });
  };

  const handleToggleActive = (id: number) => {
    setAds(ads.map(ad => 
      ad.id === id ? { ...ad, isActive: !ad.isActive } : ad
    ));
    const ad = ads.find(a => a.id === id);
    toast({
      title: ad?.isActive ? "تم الإيقاف" : "تم التفعيل",
      description: ad?.isActive ? "تم إيقاف عرض الإعلان" : "تم تفعيل عرض الإعلان",
    });
  };

  const getTypeIcon = (type: string) => {
    const adType = adTypes.find(t => t.value === type);
    return adType ? adType.icon : Sparkles;
  };

  const getTypeLabel = (type: string) => {
    const adType = adTypes.find(t => t.value === type);
    return adType ? adType.label : type;
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <Megaphone className="h-8 w-8 text-primary" />
              إدارة الإعلانات
            </h1>
            <p className="text-muted-foreground mt-1">
              إدارة إعلانات الصفحة الرئيسية والعروض الترويجية
            </p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => handleOpenDialog()} className="gap-2">
                <Plus className="h-4 w-4" />
                إضافة إعلان جديد
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingAd ? "تعديل الإعلان" : "إضافة إعلان جديد"}
                </DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="title">عنوان الإعلان *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="أدخل عنوان الإعلان"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">وصف الإعلان *</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="أدخل وصف الإعلان"
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="discount">نسبة الخصم</Label>
                    <Input
                      id="discount"
                      value={formData.discount}
                      onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
                      placeholder="مثال: 30%"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="badge">شارة الإعلان</Label>
                    <Input
                      id="badge"
                      value={formData.badge}
                      onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                      placeholder="مثال: جديد"
                    />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="image">رابط الصورة *</Label>
                  <Input
                    id="image"
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    placeholder="أدخل رابط صورة الإعلان"
                  />
                  {formData.image && (
                    <div className="relative h-32 rounded-lg overflow-hidden border">
                      <img 
                        src={formData.image} 
                        alt="معاينة" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label>نوع الإعلان</Label>
                    <Select
                      value={formData.type}
                      onValueChange={(value) => setFormData({ ...formData, type: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {adTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            <span className="flex items-center gap-2">
                              <type.icon className="h-4 w-4" />
                              {type.label}
                            </span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label>الرابط</Label>
                    <Select
                      value={formData.link}
                      onValueChange={(value) => setFormData({ ...formData, link: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="/rooms">الغرف</SelectItem>
                        <SelectItem value="/services">الخدمات</SelectItem>
                        <SelectItem value="/matches">المباريات</SelectItem>
                        <SelectItem value="/contact">التواصل</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label>لون التدرج</Label>
                  <Select
                    value={formData.gradient}
                    onValueChange={(value) => setFormData({ ...formData, gradient: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {gradientOptions.map((gradient) => (
                        <SelectItem key={gradient.value} value={gradient.value}>
                          <span className="flex items-center gap-2">
                            <div className={`w-4 h-4 rounded bg-gradient-to-l ${gradient.value}`} />
                            {gradient.label}
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex justify-end gap-2 pt-4">
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                    إلغاء
                  </Button>
                  <Button onClick={handleSave}>
                    {editingAd ? "حفظ التعديلات" : "إضافة الإعلان"}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">إجمالي الإعلانات</CardTitle>
              <Megaphone className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{ads.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">الإعلانات النشطة</CardTitle>
              <Eye className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-500">
                {ads.filter(ad => ad.isActive).length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">الإعلانات المتوقفة</CardTitle>
              <EyeOff className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-muted-foreground">
                {ads.filter(ad => !ad.isActive).length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="بحث في الإعلانات..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pr-10"
          />
        </div>

        {/* Ads Table */}
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-right">الصورة</TableHead>
                  <TableHead className="text-right">العنوان</TableHead>
                  <TableHead className="text-right">النوع</TableHead>
                  <TableHead className="text-right">الخصم/الشارة</TableHead>
                  <TableHead className="text-right">الحالة</TableHead>
                  <TableHead className="text-right">الإجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAds.map((ad) => {
                  const TypeIcon = getTypeIcon(ad.type);
                  return (
                    <TableRow key={ad.id}>
                      <TableCell>
                        <div className="w-20 h-14 rounded-lg overflow-hidden">
                          <img 
                            src={ad.image} 
                            alt={ad.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{ad.title}</p>
                          <p className="text-sm text-muted-foreground line-clamp-1">
                            {ad.description}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="gap-1">
                          <TypeIcon className="h-3 w-3" />
                          {getTypeLabel(ad.type)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {ad.discount && (
                          <Badge className="bg-primary/10 text-primary">
                            {ad.discount}
                          </Badge>
                        )}
                        {ad.badge && (
                          <Badge variant="outline">{ad.badge}</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Switch
                            checked={ad.isActive}
                            onCheckedChange={() => handleToggleActive(ad.id)}
                          />
                          <span className={ad.isActive ? "text-green-500" : "text-muted-foreground"}>
                            {ad.isActive ? "نشط" : "متوقف"}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleOpenDialog(ad)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-destructive hover:text-destructive"
                            onClick={() => handleDelete(ad.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminAds;
