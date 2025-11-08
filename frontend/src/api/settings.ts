// src/api/settings.ts
import axios, { AxiosResponse } from "axios";

// رابط API
const API_BASE_URL = "http://127.0.0.1:8000";
const API_URL = `${API_BASE_URL}/api/settings`;

// ===============================
// 🔹 واجهة بيانات الإعدادات العامة
// ===============================
export interface Settings {
  siteName?: string;
  logo?: File | string;
  // مرونة للحقول الإضافية
  [key: string]: string | number | boolean | File | null | undefined;
}

// ===============================
// 🔹 جلب الإعدادات
// ===============================
export const getSettings = async (): Promise<AxiosResponse<Settings>> => {
  return axios.get<Settings>(API_URL);
};

// ===============================
// 🔹 تحديث الإعدادات
// ===============================
export const updateSettings = async (
  formData: FormData
): Promise<AxiosResponse<Settings>> => {
  return axios.post<Settings>(API_URL, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
