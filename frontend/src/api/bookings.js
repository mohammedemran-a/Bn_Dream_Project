import axios from "./axios";

const API_URL = "/api/bookings";

// جلب كل الحجوزات
export const getBookings = async () => {
  const response = await axios.get(API_URL);
  return response.data ? response : { data: [] };
};

// إنشاء حجز جديد
export const createBooking = async (formData) => {
  const response = await axios.post(API_URL, formData);
  return response.data || {};
};

// تعديل حجز
export const updateBooking = async (id, formData) => {
  const response = await axios.put(`${API_URL}/${id}`, formData);
  return response.data || {};
};

// حذف حجز
export const deleteBooking = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`);
  return response.data || {};
};
