import instance from "./axios";

// 🧩 نوع المباراة
export interface Match {
  id?: number;
  team1: string;
  team2: string;
  team1_logo?: File | string | null;
  team2_logo?: File | string | null;
  date: string;
  time: string;
  channel: string;
  result?: string;
  status: "قادمة" | "جارية" | "منتهية";
}

const API_URL = "/api/football-matches";

// 🟢 جلب كل المباريات
export const getMatches = async () => {
  const response = await instance.get<Match[]>(API_URL);
  return response.data;
};

// 🟢 جلب مباراة واحدة
export const getMatch = async (id: number) => {
  const response = await instance.get<Match>(`${API_URL}/${id}`);
  return response.data;
};

// 🟢 إنشاء مباراة جديدة + رفع الشعارات
export const createMatch = async (formData: FormData) => {
  return await instance.post(API_URL, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

// ✏️ تحديث مباراة + رفع الشعارات
export const updateMatch = async (id: number, formData: FormData) => {
  formData.append("_method", "PUT"); // لأن Laravel يحتاج method spoofing
  return await instance.post(`${API_URL}/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

// 🔴 حذف مباراة
export const deleteMatch = async (id: number) => {
  return await instance.delete(`${API_URL}/${id}`);
};
