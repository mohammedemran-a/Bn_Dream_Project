import axios from './axios';

// تسجيل مستخدم جديد
export const register = async (data) => {
  await axios.get('/sanctum/csrf-cookie');
  return await axios.post('/api/register', data);
};

// تسجيل الدخول
export const login = async (data) => {
  await axios.get('/sanctum/csrf-cookie');
  return await axios.post('/api/login', data);
};

// تسجيل الخروج
export const logout = async () => {
  return await axios.post('/api/logout');
};

// جلب بيانات المستخدم الحالي
export const getUser = async () => {
  return await axios.get('/api/user');
};
