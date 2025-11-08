// import { create } from "zustand";
// import {
//   getMatches as apiGetMatches,
//   createMatch as apiCreateMatch,
//   updateMatch as apiUpdateMatch,
//   deleteMatch as apiDeleteMatch,
// } from "@/api/football_matches";
// import {
//   postPrediction as apiPostPrediction,
//   getUserPredictions as apiGetUserPredictions,
//   getLeaderboard as apiGetLeaderboard,
// } from "@/api/predictions";

// // 💡 تعريف أنواع واضحة
// export interface Match {
//   id: number;
//   team1: string;
//   team2: string;
//   date: string;
//   time: string;
//   channel: string;
//   result?: string;
//   status: "قادمة" | "جارية" | "منتهية";
// }

// export interface Prediction {
//   team1: string;
//   team2: string;
//   submitted?: boolean;
// }

// export interface UserPredictionFromApi {
//   football_match_id: number;
//   team1_score: number;
//   team2_score: number;
// }

// export interface LeaderboardItem {
//   user_id: number;
//   user?: { name: string };
//   total_points: number;
// }

// interface MatchesStore {
//   matches: Match[];
//   loading: boolean;
//   predictions: Record<number, Prediction>;
//   leaderboard: LeaderboardItem[];
//   fetchMatches: () => Promise<void>;
//   createMatch: (data: Partial<Match>) => Promise<void>;
//   updateMatch: (id: number, data: Partial<Match>) => Promise<void>;
//   deleteMatch: (id: number) => Promise<void>;
//   fetchUserPredictions: (userId: number) => Promise<void>;
//   postPrediction: (userId: number, matchId: number) => Promise<void>;
//   fetchLeaderboard: () => Promise<void>;
// }

// export const useMatchesStore = create<MatchesStore>((set, get) => ({
//   matches: [],
//   loading: true,
//   predictions: {},
//   leaderboard: [],

//   fetchMatches: async () => {
//     set({ loading: true });
//     try {
//       const response = await apiGetMatches();
//       set({ matches: response.data });
//     } catch (error) {
//       console.error("❌ خطأ أثناء جلب المباريات:", error);
//     } finally {
//       set({ loading: false });
//     }
//   },

//   createMatch: async (data) => {
//     await apiCreateMatch(data);
//     await get().fetchMatches();
//   },

//   updateMatch: async (id, data) => {
//     await apiUpdateMatch(id, data);
//     await get().fetchMatches();
//   },

//   deleteMatch: async (id) => {
//     await apiDeleteMatch(id);
//     await get().fetchMatches();
//   },

//   fetchUserPredictions: async (userId) => {
//     try {
//       const response = await apiGetUserPredictions(userId);
//       const formatted: Record<number, Prediction> = {};
//       response.data.forEach((p: UserPredictionFromApi) => {
//         formatted[p.football_match_id] = {
//           team1: p.team1_score.toString(),
//           team2: p.team2_score.toString(),
//           submitted: true,
//         };
//       });
//       set({ predictions: formatted });
//     } catch (error) {
//       console.error("❌ خطأ أثناء جلب توقعات المستخدم:", error);
//     }
//   },

//   postPrediction: async (userId, matchId) => {
//     const prediction = get().predictions[matchId];
//     if (!prediction) return;

//     try {
//       await apiPostPrediction({
//         user_id: userId,
//         football_match_id: matchId,
//         team1_score: Number(prediction.team1),
//         team2_score: Number(prediction.team2),
//       });

//       set((state) => ({
//         predictions: {
//           ...state.predictions,
//           [matchId]: { ...state.predictions[matchId], submitted: true },
//         },
//       }));
//     } catch (error) {
//       console.error("❌ خطأ أثناء إرسال التوقع:", error);
//       throw error;
//     }
//   },

//   fetchLeaderboard: async () => {
//     try {
//       const response = await apiGetLeaderboard();
//       set({ leaderboard: response.data });
//     } catch (error) {
//       console.error("❌ خطأ أثناء جلب المتصدرين:", error);
//     }
//   },
// }));
