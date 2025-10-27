import axios from "axios";

const API_URL = "http://127.0.0.1:8000/api/football-matches";

// 🟢 جلب كل المباريات
export const getMatches = () => axios.get(API_URL);

// 🟢 جلب مباراة واحدة
export const getMatch = (id) => axios.get(`${API_URL}/${id}`);

// 🟢 إنشاء مباراة جديدة
export const createMatch = (data) => {
  return axios.post(API_URL, data, {
    headers: { "Content-Type": "application/json" },
  });
};

// ✏️ تحديث مباراة
export const updateMatch = (id, data) => {
  return axios.post(`${API_URL}/${id}?_method=PUT`, data, {
    headers: { "Content-Type": "application/json" },
  });
};

// 🔴 حذف مباراة
export const deleteMatch = (id) => axios.delete(`${API_URL}/${id}`);
