import axios from "axios";

const API_URL = "http://localhost:8000/api/predictions";

// 🟢 إرسال توقع جديد
export const postPrediction = async (data) => {
  try {
    const response = await axios.post(API_URL, data);
    return response;
  } catch (error) {
    console.error("❌ خطأ أثناء إرسال التوقع:", error);
    throw error;
  }
};

// 🟢 جلب توقعات مستخدم واحد
export const getUserPredictions = async (userId) => {
  try {
    const response = await axios.get(`${API_URL}/user/${userId}`);
    return response;
  } catch (error) {
    console.error("❌ خطأ أثناء جلب توقعات المستخدم:", error);
    throw error;
  }
};

// 🟢 جلب قائمة المتصدرين
export const getLeaderboard = async () => {
  try {
    const response = await axios.get(`${API_URL}/leaderboard`);
    return response;
  } catch (error) {
    console.error("❌ خطأ أثناء جلب المتصدرين:", error);
    throw error;
  }
};
