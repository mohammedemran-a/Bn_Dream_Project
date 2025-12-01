import instance from "./axios"; // 🟢 استخدام axios instance وإنهاء التكرار

// ===============================
// 🔹 واجهة الإعدادات العامة
// ===============================
export interface Settings {
  siteName?: string;
  logo?: File | string;
  [key: string]: string | number | boolean | File | null | undefined; // مرونة
}

// ===============================
// 🔹 جلب الإعدادات
// GET /api/settings
// ===============================
export const getSettings = async () => {
  return await instance.get<Settings>("/api/settings");
};

// ===============================
// 🔹 تحديث الإعدادات
// POST /api/settings
// FormData (logo + siteName + المزيد)
// ===============================
export const updateSettings = async (formData: FormData) => {
  return await instance.post<Settings>("/api/settings", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};
