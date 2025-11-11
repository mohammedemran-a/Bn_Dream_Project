import axios from "axios";

const API_URL = "http://127.0.0.1:8000/api/football-matches";

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

// 🟢 جلب كل المباريات
export const getMatches = async () => {
  const response = await axios.get<Match[]>(API_URL);
   return response.data;
};

// 🟢 جلب مباراة واحدة
export const getMatch = async (id: number) => {
  const response = await axios.get<Match>(`${API_URL}/${id}`);
  return response.data;
};

// 🟢 إنشاء مباراة جديدة
export const createMatch = async (data: Omit<Match, "id">) => {
  const response = await axios.post(API_URL, data, {
    headers: { "Content-Type": "application/json" },
  });
  return response;
};

// ✏️ تحديث مباراة
export const updateMatch = async (id: number, data: Partial<Match>) => {
  const response = await axios.post(`${API_URL}/${id}?_method=PUT`, data, {
    headers: { "Content-Type": "application/json" },
  });
  return response;
};

// 🔴 حذف مباراة
export const deleteMatch = async (id: number) => {
  const response = await axios.delete(`${API_URL}/${id}`);
  return response;
};
