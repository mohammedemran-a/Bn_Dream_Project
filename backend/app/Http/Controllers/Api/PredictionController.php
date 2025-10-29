<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Prediction;
use Illuminate\Http\Request;

class PredictionController extends Controller
{
    /**
     * 🟢 حفظ توقع جديد
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'football_match_id' => 'required|exists:football_matches,id',
            'team1_score' => 'required|integer|min:0',
            'team2_score' => 'required|integer|min:0',
        ]);

        $existing = Prediction::where('user_id', $validated['user_id'])
            ->where('football_match_id', $validated['football_match_id'])
            ->first();

        if ($existing) {
            $existing->update($validated);
            return response()->json([
                'message' => 'تم تحديث التوقع بنجاح ✅',
                'data' => $existing
            ]);
        }

        $prediction = Prediction::create($validated);

        return response()->json([
            'message' => 'تم حفظ التوقع بنجاح ✅',
            'data' => $prediction
        ], 201);
    }

    /**
     * 🟢 جلب جميع توقعات مستخدم
     */
    public function getUserPredictions($userId)
    {
        $predictions = Prediction::with('match')
            ->where('user_id', $userId)
            ->get();

        return response()->json($predictions);
    }

    /**
     * 🏆 عرض المتصدرين
     */
    public function leaderboard()
    {
        $leaders = Prediction::selectRaw('user_id, SUM(points) as total_points')
            ->groupBy('user_id')
            ->orderByDesc('total_points')
            ->with('user')
            ->take(10)
            ->get();

        return response()->json($leaders);
    }
}
