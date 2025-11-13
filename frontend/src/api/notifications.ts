import axios from "axios";

const API_URL = "http://127.0.0.1:8000/api/notifications";

// 🔹 إعداد التوكن مرة واحدة
const authHeaders = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

// ✅ جلب جميع الإشعارات
export const getNotifications = async () => {
  const res = await axios.get(API_URL, authHeaders());
  return res.data;
};

// ✅ جلب الإشعارات غير المقروءة فقط
export const getUnreadNotifications = async () => {
  const res = await axios.get(`${API_URL}/unread`, authHeaders());
  return res.data;
};

// ✅ تحديد إشعار كمقروء
export const markNotificationAsRead = async (id: string) => {
  const res = await axios.post(`${API_URL}/${id}/read`, {}, authHeaders());
  return res.data;
};

// ✅ حذف إشعار واحد
export const deleteNotification = async (id: string) => {
  const res = await axios.delete(`${API_URL}/${id}`, authHeaders());
  return res.data;
};

// ✅ حذف جميع الإشعارات
export const clearAllNotifications = async () => {
  const res = await axios.delete(API_URL, authHeaders());
  return res.data;
};
