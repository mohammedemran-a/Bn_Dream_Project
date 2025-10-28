import axios from "axios";

// 👇 إعداد Axios الأساسي
const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api", // 🔁 غيّر هذا الرابط حسب عنوان السيرفر لديك
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// 🟢 1. جلب كل الطلبات
export const getAllOrders = async () => {
  const response = await api.get("/orders");
  return response.data;
};

// 🟢 2. جلب طلب واحد بالتفصيل
export const getOrderById = async (id) => {
  const response = await api.get(`/orders/${id}`);
  return response.data;
};

// 🟢 3. إنشاء طلب جديد
export const createOrder = async (orderData) => {
  // orderData = { user_id, total, products: [{id, quantity}] }
  const response = await api.post("/orders", orderData);
  return response.data;
};

// 🟢 4. تحديث حالة الطلب
export const updateOrderStatus = async (id, status) => {
  // status = "جديد" أو "قيد التنفيذ" أو "تم التسليم" أو "ملغي"
  const response = await api.put(`/orders/${id}/status`, { status });
  return response.data;
};

// 🟢 5. حذف طلب
export const deleteOrder = async (id) => {
  const response = await api.delete(`/orders/${id}`);
  return response.data;
};

// 🟢 6. جلب الطلبات حسب المستخدم
export const getOrdersByUser = async (userId) => {
  const response = await api.get(`/orders/user/${userId}`);
  return response.data;
};
