// استيراد axios الذي قمنا بإعداده مسبقاً
import axios from "./axios";

// إرسال رسالة جديدة إلى Laravel
export const sendContactMessage = async (data) => {
  // أضف /api هنا فقط لصفحة Contact
  return await axios.post("/api/contact", data);
};

// (اختياري) جلب جميع الرسائل من Laravel
export const getAllContacts = async () => {
  return await axios.get("/api/contact");
};
