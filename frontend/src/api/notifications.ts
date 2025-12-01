import instance from "./axios"; // 🔥 استدعاء axios instance بدلاً من axios

// رابط الإشعارات
const API_URL = "/api/notifications";

// ============================
// 🔹 جلب جميع الإشعارات
// ============================
export const getNotifications = async () => {
  const res = await instance.get(API_URL);
  return res.data;
};

// ============================
// 🔹 جلب الإشعارات غير المقروءة
// ============================
export const getUnreadNotifications = async () => {
  const res = await instance.get(`${API_URL}/unread`);
  return res.data;
};

// ============================
// 🔹 تحديد إشعار كمقروء
// ============================
export const markNotificationAsRead = async (id: string) => {
  const res = await instance.post(`${API_URL}/${id}/read`);
  return res.data;
};

// ============================
// 🔹 حذف إشعار
// ============================
export const deleteNotification = async (id: string) => {
  const res = await instance.delete(`${API_URL}/${id}`);
  return res.data;
};

// ============================
// 🔹 حذف جميع الإشعارات
// ============================
export const clearAllNotifications = async () => {
  const res = await instance.delete(API_URL);
  return res.data;
};
