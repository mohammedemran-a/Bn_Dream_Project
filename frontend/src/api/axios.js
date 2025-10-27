import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:8000'; // عنوان السيرفر Laravel
axios.defaults.withCredentials = true; // ضروري جداً لـ Sanctum

export default axios;
