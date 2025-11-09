// src/api/bookings.ts
import axios from "./axios";

export interface Booking {
  id: number;
  user?: { name: string };
  room?: { name: string };
  user_id?: number;
  room_id?: number;
  check_in: string;
  check_out: string;
  guests: number;
  total_price: number;
  status: string;
  duration_type?: "hours" | "days";  // ✅ مهم
  duration_value?: number;           // ✅ مهم

}

const API_URL = "/api/bookings";

// جلب الحجوزات مع إمكانية الفلترة
export const getBookings = async (status?: string): Promise<Booking[]> => {
  const params = status && status !== "الكل" ? { status } : {};
  const response = await axios.get(API_URL, { params });
  return response.data;
};
// إضافة هذا في bookings.ts
export const createBooking = async (formData: Partial<Booking>) => {
  const response = await axios.post("/api/bookings", formData);
  return response.data;
};

// تعديل حالة الحجز
export const updateBookingStatus = async (id: number, status: string) => {
  const response = await axios.put(`${API_URL}/${id}`, { status });
  return response.data;
};

// حذف الحجز
export const deleteBooking = async (id: number) => {
  await axios.delete(`${API_URL}/${id}`);
};
