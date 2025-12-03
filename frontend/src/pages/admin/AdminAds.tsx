import { useEffect, useState } from "react";
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
  Sparkles,
  Percent,
  Gift,
  Star,
  Search,
  Image as ImageIcon,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

import {
  getAds,
  createAd,
  updateAd,
  deleteAd,
  toggleAd,
  getAdImageUrl,
} from "@/api/ads";

interface Ad {
  id: number;
  title: string;
  description: string;
  discount?: string | null;
  badge?: string | null;
  image?: string | null; // may be path (ads/...) or full URL
  type: string;
  link: string;
  isActive: boolean;
  gradient?: string | null;
}

const adTypes = [
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

const emptyForm = {
  title: "",
  description: "",
  discount: "",
  badge: "",
  // imageFile is used for uploading; imagePreview is used for showing preview
  imageFile: null as File | null,
  imagePreview: "" as string,
  type: "hot",
  link: "/rooms",
  gradient: "from-orange-500/20 via-red-500/20 to-pink-500/20",
};

const AdminAds = () => {
  const [ads, setAds] = useState<Ad[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAd, setEditingAd] = useState<Ad | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [formState, setFormState] = useState(() => ({ ...emptyForm }));
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Fetch ads from API
  const fetchAds = async () => {
    setLoading(true);
    try {
      const res = await getAds();
      // res.data expected to be Ad[]
      setAds(res.data || []);
    } catch (err) {
      console.error("getAds error:", err);
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء جلب الإعلانات",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAds();
  }, []);

  const filteredAds = ads.filter(ad =>
    ad.title.includes(searchQuery) || ad.description.includes(searchQuery)
  );

  const openAddDialog = () => {
    setEditingAd(null);
    setFormState({ ...emptyForm });
    setIsDialogOpen(true);
  };

  const handleOpenDialog = (ad?: Ad) => {
    if (ad) {
      setEditingAd(ad);
      // prepare preview: if image is full url (startsWith http) use it, otherwise use getAdImageUrl
      const preview =
        ad.image && (ad.image.startsWith("http") || ad.image.startsWith("https"))
          ? ad.image
          : getAdImageUrl(ad.image ?? undefined) ?? "";

      setFormState({
        ...emptyForm,
        title: ad.title,
        description: ad.description,
        discount: ad.discount ?? "",
        badge: ad.badge ?? "",
        imageFile: null,
        imagePreview: preview,
        type: ad.type,
        link: ad.link,
        gradient: ad.gradient ?? emptyForm.gradient,
      });
    } else {
      openAddDialog();
    }
    setIsDialogOpen(true);
  };

  const handleImageChange = (file?: File | null) => {
    if (!file) {
      setFormState(prev => ({ ...prev, imageFile: null, imagePreview: "" }));
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      setFormState(prev => ({ ...prev, imagePreview: String(e.target?.result), imageFile: file }));
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    // validation
    if (!formState.title.trim() || !formState.description.trim()) {
      toast({
        title: "خطأ",
        description: "يرجى ملء الحقول المطلوبة (العنوان والوصف).",
        variant: "destructive",
      });
      return;
    }

    setSaving(true);

    try {
      // Build FormData
      const data = new FormData();
      data.append("title", formState.title);
      data.append("description", formState.description);
      if (formState.discount) data.append("discount", formState.discount);
      if (formState.badge) data.append("badge", formState.badge);
      data.append("type", formState.type);
      data.append("link", formState.link);
      if (formState.gradient) data.append("gradient", formState.gradient);

      // If there's an image file chosen, append it
      if (formState.imageFile) {
        data.append("image", formState.imageFile);
      }

      if (editingAd) {
        // When editing, backend expects POST to /api/ads/{id} in your current setup (method spoofing may be on backend).
        const res = await updateAd(editingAd.id, data);
        const updatedAd = res.data.ad ?? res.data; // controller returns 'ad'
        // Update UI: merge local list
        setAds(prev => prev.map(a => (a.id === editingAd.id ? updatedAd : a)));
        toast({
          title: "تم التحديث",
          description: "تم تحديث الإعلان بنجاح",
        });
      } else {
        const res = await createAd(data);
        const newAd = res.data.ad ?? res.data;
        // if backend returns ad with image path etc, use it; otherwise refetch
        if (newAd && newAd.id) {
          setAds(prev => [...prev, newAd]);
        } else {
          // fallback: refetch full list
          await fetchAds();
        }
        toast({
          title: "تمت الإضافة",
          description: "تم إضافة الإعلان بنجاح",
        });
      }
      setIsDialogOpen(false);
        } catch (err: unknown) {
        console.error("save error:", err);

        // نحول الخطأ إلى نوع AxiosError إذا كان فعلاً من axios
        let message = "حدث خطأ أثناء حفظ الإعلان. تحقق من الصورة أو اتصالك.";

        if (typeof err === "object" && err !== null && "response" in err) {
            const axiosErr = err as { response?: { data?: { message?: string } } };
            message = axiosErr.response?.data?.message || message;
        }

        toast({
            title: "خطأ",
            description: message,
            variant: "destructive",
        });
        } finally {
        setSaving(false);
        }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("هل أنت متأكد من حذف هذا الإعلان؟ هذا الإجراء لا يمكن التراجع عنه.")) return;
    try {
      await deleteAd(id);
      setAds(prev => prev.filter(ad => ad.id !== id));
      toast({
        title: "تم الحذف",
        description: "تم حذف الإعلان بنجاح",
      });
    } catch (err) {
      console.error("delete error:", err);
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء حذف الإعلان",
        variant: "destructive",
      });
    }
  };

  const handleToggleActive = async (id: number) => {
    // optimistic update
    setAds(prev => prev.map(ad => ad.id === id ? { ...ad, isActive: !ad.isActive } : ad));
    try {
      const res = await toggleAd(id);
      // res.data.isActive returned by controller
      const newState = typeof res.data.isActive === "boolean" ? res.data.isActive : undefined;
      if (newState !== undefined) {
        setAds(prev => prev.map(a => a.id === id ? { ...a, isActive: newState } : a));
      }
      toast({
        title: res.data.isActive ? "تم التفعيل" : "تم الإيقاف",
        description: res.data.message || "",
      });
    } catch (err) {
      console.error("toggle error:", err);
      // revert on error
      setAds(prev => prev.map(ad => ad.id === id ? { ...ad, isActive: !ad.isActive } : ad));
      toast({
        title: "خطأ",
        description: "تعذر تغيير حالة الإعلان",
        variant: "destructive",
      });
    }
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
              <Button onClick={() => openAddDialog()} className="gap-2">
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
                    value={formState.title}
                    onChange={(e) => setFormState(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="أدخل عنوان الإعلان"
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="description">وصف الإعلان *</Label>
                  <Textarea
                    id="description"
                    value={formState.description}
                    onChange={(e) => setFormState(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="أدخل وصف الإعلان"
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="discount">نسبة الخصم</Label>
                    <Input
                      id="discount"
                      value={formState.discount}
                      onChange={(e) => setFormState(prev => ({ ...prev, discount: e.target.value }))}
                      placeholder="مثال: 30%"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="badge">شارة الإعلان</Label>
                    <Input
                      id="badge"
                      value={formState.badge}
                      onChange={(e) => setFormState(prev => ({ ...prev, badge: e.target.value }))}
                      placeholder="مثال: جديد"
                    />
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label>صورة الإعلان {editingAd ? "(اختياري - اتركه دون تغيير)" : "*"}</Label>
                  <div className="flex gap-2 items-center">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0] ?? null;
                          handleImageChange(file || undefined);
                        }}
                        className="hidden"
                        id="imageFileInput"
                      />
                      <Button variant="outline" onClick={() => {
                        // trigger file input click
                        const el = document.getElementById("imageFileInput") as HTMLInputElement | null;
                        el?.click();
                      }}>
                        <ImageIcon className="h-4 w-4" />
                        {formState.imagePreview ? "تغيير الصورة" : "رفع صورة"}
                      </Button>
                      <span className="text-sm text-muted-foreground">
                        أو اترك الصورة الحالية كما هي
                      </span>
                    </label>
                  </div>

                  {formState.imagePreview ? (
                    <div className="relative h-32 rounded-lg overflow-hidden border">
                      <img
                        src={formState.imagePreview}
                        alt="معاينة"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    editingAd?.image && (
                      <div className="relative h-32 rounded-lg overflow-hidden border">
                        <img
                          src={
                            editingAd.image?.startsWith("http")
                              ? editingAd.image
                              : getAdImageUrl(editingAd.image ?? undefined) ?? ""
                          }
                          alt="معاينة موجودة"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label>نوع الإعلان</Label>
                    <Select
                      value={formState.type}
                      onValueChange={(value) => setFormState(prev => ({ ...prev, type: value }))}
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
                      value={formState.link}
                      onValueChange={(value) => setFormState(prev => ({ ...prev, link: value }))}
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
                    value={formState.gradient}
                    onValueChange={(value) => setFormState(prev => ({ ...prev, gradient: value }))}
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
                  <Button onClick={handleSave} disabled={saving}>
                    {saving ? "جاري الحفظ..." : editingAd ? "حفظ التعديلات" : "إضافة الإعلان"}
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
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6}>
                      <div className="py-8 text-center text-muted-foreground">جاري التحميل...</div>
                    </TableCell>
                  </TableRow>
                ) : filteredAds.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6}>
                      <div className="py-8 text-center text-muted-foreground">لا توجد إعلانات.</div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredAds.map((ad) => {
                    const TypeIcon = getTypeIcon(ad.type);
                    // choose image URL: if ad.image is absolute URL use it, otherwise use getAdImageUrl
                    const imageUrl =
                      ad.image && (ad.image.startsWith("http") || ad.image.startsWith("https"))
                        ? ad.image
                        : getAdImageUrl(ad.image ?? undefined) ?? "";

                    return (
                      <TableRow key={ad.id}>
                        <TableCell>
                          <div className="w-20 h-14 rounded-lg overflow-hidden">
                            {imageUrl ? (
                              <img
                                src={imageUrl}
                                alt={ad.title}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-muted-foreground/10">
                                <ImageIcon className="h-5 w-5 text-muted-foreground" />
                              </div>
                            )}
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
                            <Badge className="bg-primary/10 text-primary mr-2">
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
                  })
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminAds;
