import axios from "axios";

const API_URL = "http://127.0.0.1:8000/api/orders";

// ✅ جلب كل الطلبات
export const getAllOrders = async () => {
  const response = await axios.get(API_URL);
  return response.data.data || response.data;
};

// ✅ إنشاء طلب جديد
export const createOrder = async (orderData) => {
  const response = await axios.post(API_URL, orderData);
  return response.data;
};

// ✅ تحديث حالة الطلب
export const updateOrderStatus = async (id, status) => {
  const response = await axios.put(`${API_URL}/${id}/status`, { status });
  return response.data;
};

// ✅ جلب طلب واحد
export const getOrder = (id) => axios.get(`${API_URL}/${id}`);

// ✅ حذف الطلب
export const deleteOrder = (id) => axios.delete(`${API_URL}/${id}`);
