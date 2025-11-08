import axios from "axios";

const API_URL = "http://localhost:8000/api/predictions.ts";

export interface PredictionData {
  user_id: number;
  match_id: number;
  team1: number;
  team2: number;
}

export interface LeaderboardItem {
  user_id: number;
  total_points: number;
  user?: {
    name: string;
  };
}

// 🟢 إرسال توقع جديد
export const postPrediction = async (data: PredictionData) => {
  const response = await axios.post(API_URL, data);
  return response.data;
};

// 🟢 جلب توقعات مستخدم واحد
export const getUserPredictions = async (userId: number) => {
  const response = await axios.get(`${API_URL}/user/${userId}`);
  return response.data;
};

// 🟢 جلب قائمة المتصدرين
export const getLeaderboard = async () => {
  const response = await axios.get(`${API_URL}/leaderboard`);
  return response.data as LeaderboardItem[];
};
