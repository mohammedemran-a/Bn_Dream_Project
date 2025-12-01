// src/api/orders.ts
import instance from "./axios"; // 🔥 استدعاء Axios instance بدل axios

export interface OrderProduct {
  id: number;
  name: string;
  pivot: { quantity: number; price: number };
}

export interface Order {
  id: number;
  user: { name: string; phone?: string } | null;
  total: number;
  status: string;
  products: OrderProduct[];
}

const API_URL = "/api/orders";

// ================================
// 🔹 جلب كل الطلبات
// ================================
export const getAllOrders = async (): Promise<Order[]> => {
  const response = await instance.get(API_URL);
  return response.data?.data || response.data || [];
};

// ================================
// 🔹 إنشاء طلب جديد
// ================================
export const createOrder = async (orderData: unknown): Promise<Order> => {
  const response = await instance.post(API_URL, orderData);
  return response.data || {};
};

// ================================
// 🔹 تحديث حالة الطلب
// ================================
export const updateOrderStatus = async (id: number, status: string): Promise<Order> => {
  const response = await instance.put(`${API_URL}/${id}/status`, { status });
  return response.data || {};
};

// ================================
// 🔹 جلب طلب واحد
// ================================
export const getOrder = async (id: number): Promise<Order> => {
  const response = await instance.get(`${API_URL}/${id}`);
  return response.data || {};
};

// ================================
// 🔹 حذف طلب
// ================================
export const deleteOrder = async (id: number): Promise<void> => {
  const response = await instance.delete(`${API_URL}/${id}`);
  return response.data || {};
};
