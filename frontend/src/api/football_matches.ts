import instance from "./axios"; // 🔥 استدعاء axios instance بدل axios

// 🧩 نوع المباراة
export interface Match {
  id?: number;
  team1: string;
  team2: string;
  date: string;
  time: string;
  channel: string;
  result?: string;
  status: "قادمة" | "جارية" | "منتهية";
}

// رابط API الأساسي
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

// 🟢 إنشاء مباراة جديدة
export const createMatch = async (data: Omit<Match, "id">) => {
  return await instance.post(API_URL, data);
};

// ✏️ تحديث مباراة
export const updateMatch = async (id: number, data: Partial<Match>) => {
  return await instance.post(`${API_URL}/${id}?_method=PUT`, data);
};

// 🔴 حذف مباراة
export const deleteMatch = async (id: number) => {
  return await instance.delete(`${API_URL}/${id}`);
};
