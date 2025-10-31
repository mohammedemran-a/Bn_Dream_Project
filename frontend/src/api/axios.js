import axios from "axios";

const instance = axios.create({
  baseURL: "http://127.0.0.1:8000", // تأكد من عنوان API الخاص بك
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// ✅ إضافة Authorization تلقائيًا إذا كان التوكن موجودًا
instance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default instance;
