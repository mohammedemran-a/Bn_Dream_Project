// src/api/products.ts
import instance from "./axios"; // 🔥 استدعاء Axios instance بدل axios

export interface Product {
  id: number;
  name: string;
  price: number | string;
  stock: number | string;
  category: string;
  type: string;
  image?: string | null;
  description?: string;
  userId?: number;
}

const API_URL = "/api/products";

// ================================
// 🔹 جلب كل المنتجات
// ================================
export const getProducts = async (): Promise<Product[]> => {
  const response = await instance.get(API_URL);
  return response.data;
};

// ================================
// 🔹 جلب منتج واحد
// ================================
export const getProduct = async (id: number): Promise<Product> => {
  const response = await instance.get(`${API_URL}/${id}`);
  return response.data;
};

// ================================
// 🔹 إنشاء منتج جديد
// ================================
export const createProduct = async (data: FormData) => {
  const response = await instance.post(API_URL, data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

// ================================
// 🔹 تحديث منتج (Laravel method spoofing)
// ================================
export const updateProduct = async (id: number, data: FormData) => {
  const response = await instance.post(`${API_URL}/${id}?_method=PUT`, data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

// ================================
// 🔹 حذف منتج
// ================================
export const deleteProduct = async (id: number) => {
  const response = await instance.delete(`${API_URL}/${id}`);
  return response.data;
};
