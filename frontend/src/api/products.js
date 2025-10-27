import axios from "axios";

const API_URL = "http://127.0.0.1:8000/api/products";

export const getProducts = () => axios.get(API_URL);
export const getProduct = (id) => axios.get(`${API_URL}/${id}`);

export const createProduct = (data) => {
  return axios.post(API_URL, data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const updateProduct = (id, data) => {
  return axios.post(`${API_URL}/${id}?_method=PUT`, data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const deleteProduct = (id) => axios.delete(`${API_URL}/${id}`);
    