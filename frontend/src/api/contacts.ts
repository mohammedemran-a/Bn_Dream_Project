// src/api/contacts.ts
import axios from "./axios";

// ================================
// 🔹 واجهة بيانات الرسالة المرسلة
// ================================
export interface ContactMessage {
  name: string;
  email: string;
  message: string;
  phone?: string;        // حقل اختياري
  subject?: string;      // حقل اختياري
  attachments?: string[]; // لو فيه ملفات مرفقة
}

// ==================================
// 🔹 واجهة بيانات الرسالة القادمة من السيرفر
// ==================================
export interface ContactItem extends ContactMessage {
  id: number;
  created_at: string;
  updated_at: string;
}

// ================================
// 🔹 الرد العام من السيرفر
// ================================
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
}

// ================================
// 🔹 إرسال رسالة جديدة إلى Laravel
// ================================
export const sendContactMessage = async (
  data: ContactMessage
): Promise<ApiResponse<ContactItem>> => {
  const response = await axios.post<ApiResponse<ContactItem>>("/api/contact", data);
  return response.data;
};

// ================================
// 🔹 جلب جميع الرسائل من Laravel
// ================================
export const getAllContacts = async (): Promise<ApiResponse<ContactItem[]>> => {
  const response = await axios.get<ApiResponse<ContactItem[]>>("/api/contact");
  return response.data;
};
