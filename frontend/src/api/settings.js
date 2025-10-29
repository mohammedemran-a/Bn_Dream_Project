import axios from "axios";

// تأكد من أن هذا هو الرابط الصحيح لخادم Laravel الخاص بك
const API_BASE_URL = "http://127.0.0.1:8000"; 
const API_URL = `${API_BASE_URL}/api/settings`;

// دالة لجلب الإعدادات
export const getSettings = ( ) => axios.get(API_URL);

// دالة لإرسال التحديثات
export const updateSettings = (formData) => {
    // استخدام POST مع ترويسة خاصة بـ FormData
    return axios.post(API_URL, formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
};
