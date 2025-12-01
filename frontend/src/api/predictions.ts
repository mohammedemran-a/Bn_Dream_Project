import instance from "./axios"; // 🔥 استخدام axios instance بدل axios

// ========================
// 📌 الـ API الأساسي
// ========================
const API_URL = "/api/predictions";

// ========================
// 📌 أنواع البيانات
// ========================
export interface PredictionData {
  user_id: number;
  match_id: number;
  team1: number;
  team2: number;
}

export interface PredictionResponse {
  id: number;
  user_id: number;
  football_match_id: number;
  team1_score: number;
  team2_score: number;
  points: number | null;
  created_at: string;
  updated_at: string;
  match?: {
    id: number;
    team1: string;
    team2: string;
    date: string;
    time: string;
  };
}

export interface LeaderboardItem {
  user_id: number;
  total_points: number;
  user?: {
    name: string;
  };
}

// ===============================
// 🟢 إرسال توقع أو تحديث توقع
// POST /api/predictions
// ===============================
export const postPrediction = async (data: PredictionData) => {
  const payload = {
    user_id: data.user_id,
    football_match_id: data.match_id,
    team1_score: data.team1,
    team2_score: data.team2,
  };

  const response = await instance.post(API_URL, payload);
  return response.data as { message: string; data: PredictionResponse };
};

// ===============================
// 🟢 جلب توقعات المستخدم
// GET /api/predictions/user/{id}
// ===============================
export const getUserPredictions = async (userId: number) => {
  if (!userId) return []; // ✨ حماية إذا لم يوجد user

  const response = await instance.get(`${API_URL}/user/${userId}`);
  return Array.isArray(response.data) ? response.data : [];
};

// ===============================
// 🏆 جلب قائمة المتصدرين
// GET /api/predictions/leaderboard
// ===============================
export const getLeaderboard = async () => {
  const response = await instance.get(`${API_URL}/leaderboard`);
  return Array.isArray(response.data) ? response.data : [];
};
