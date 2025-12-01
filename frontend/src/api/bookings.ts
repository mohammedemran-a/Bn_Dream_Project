import instance from "./axios"; // 🔥 استدعاء Axios instance بدل axios

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
  duration_type?: "hours" | "days";  
  duration_value?: number;   
  payment_method?: "cash" | "wallet";
  wallet_type?: "جوالي" | "جيب" | "ون كاش";
  wallet_code?: string;
}

const API_URL = "/api/bookings";

// جلب الحجوزات مع إمكانية الفلترة
export const getBookings = async (status?: string): Promise<Booking[]> => {
  const params = status && status !== "الكل" ? { status } : {};
  const response = await instance.get(API_URL, { params });
  return response.data;
};

// إنشاء حجز جديد
export const createBooking = async (formData: Partial<Booking>) => {
  const response = await instance.post(API_URL, formData);
  return response.data;
};

// تعديل حالة الحجز
export const updateBookingStatus = async (id: number, status: string) => {
  const response = await instance.put(`${API_URL}/${id}`, { status });
  return response.data;
};

// حذف الحجز
export const deleteBooking = async (id: number) => {
  await instance.delete(`${API_URL}/${id}`);
};
