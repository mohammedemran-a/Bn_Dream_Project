import axios from "./axios";

const API_URL = "/api/orders";

// جلب كل الطلبات
export const getAllOrders = async () => {
  const response = await axios.get(API_URL);
  return response.data?.data || response.data || [];
};

// إنشاء طلب جديد
export const createOrder = async (orderData) => {
  const response = await axios.post(API_URL, orderData);
  return response.data || {};
};

// تحديث حالة الطلب
export const updateOrderStatus = async (id, status) => {
  const response = await axios.put(`${API_URL}/${id}/status`, { status });
  return response.data || {};
};

// جلب طلب واحد
export const getOrder = async (id) => {
  const response = await axios.get(`${API_URL}/${id}`);
  return response.data || {};
};

// حذف طلب
export const deleteOrder = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`);
  return response.data || {};
};
