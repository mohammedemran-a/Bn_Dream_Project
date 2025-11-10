import axios from "./axios";

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

export const getProducts = async (): Promise<Product[]> => {
  const response = await axios.get(API_URL);
  return response.data;
  
};

export const getProduct = async (id: number): Promise<Product> => {
  const response = await axios.get(`${API_URL}/${id}`);
  return response.data;
};

export const createProduct = async (data: FormData) => {
  const response = await axios.post(API_URL, data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export const updateProduct = async (id: number, data: FormData) => {
  const response = await axios.post(`${API_URL}/${id}?_method=PUT`, data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export const deleteProduct = async (id: number) => {
  const response = await axios.delete(`${API_URL}/${id}`);
  return response.data;
};
