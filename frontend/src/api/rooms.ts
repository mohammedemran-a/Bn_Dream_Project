// src/api/rooms.ts
import instance from "./axios"; // الاعتماد على axios instance

// ================================
// 📌 API الأساس
// ================================
const API_URL = "/api/rooms";

// ================================
// 📌 شكل بيانات الغرف
// ================================
export interface Room {
  id: number;
  category: string;
  name: string;
  price: number;
  capacity: number;
  status: string;
  description: string;
  features: string | string[];
  image_path?: string;
}

// ================================
// 🟢 جلب كل الغرف
// GET /api/rooms
// ================================
export const getRooms = async (): Promise<Room[]> => {
  const { data } = await instance.get(API_URL);
  return data;
};

// ================================
// ✏️ تحديث غرفة
// PUT /api/rooms/{id} باستخدام _method=PUT
// ================================
export const updateRoom = async (id: number, formData: FormData) => {
  // إرسال formData مع _method=PUT
  return await instance.post(`${API_URL}/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

// ================================
// 🆕 إنشاء غرفة جديدة
// POST /api/rooms
// ================================
export const createRoom = async (formData: FormData) => {
  return await instance.post(API_URL, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

// ================================
// 🔴 حذف غرفة
// DELETE /api/rooms/{id}
// ================================
export const deleteRoom = async (id: number) => {
  return await instance.delete(`${API_URL}/${id}`);
};
