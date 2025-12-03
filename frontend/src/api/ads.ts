// src/api/ads.ts
import axiosInstance, { BASE_URL } from "./axios"; // استيراد instance و BASE_URL

export interface Ad {
  id: number;
  title: string;
  description: string;
  discount?: string;
  badge?: string;
  image?: string; // مسار الصورة في السيرفر
  type: string;
  link: string;
  gradient?: string;
  isActive: boolean;
}

// جلب كل الإعلانات
export const getAds = () => axiosInstance.get<Ad[]>("/api/ads");

// إنشاء إعلان جديد
export const createAd = (data: FormData) =>
  axiosInstance.post("/api/ads", data, {
    headers: { "Content-Type": "multipart/form-data" },
  });

// تحديث إعلان
export const updateAd = (id: number, data: FormData) =>
  axiosInstance.post(`/api/ads/${id}`, data, {
    headers: { "Content-Type": "multipart/form-data" },
  });

// حذف إعلان
export const deleteAd = (id: number) =>
  axiosInstance.delete(`/api/ads/${id}`);

// تفعيل / إيقاف إعلان
export const toggleAd = (id: number) =>
  axiosInstance.patch(`/api/ads/${id}/toggle`);

// helper لعرض الصورة من السيرفر
export const getAdImageUrl = (imagePath?: string) =>
  imagePath ? `${BASE_URL}/storage/${imagePath}` : null;
