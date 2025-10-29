<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\FootballMatch;
use App\Models\Prediction;
use Illuminate\Http\Request;

class FootballMatchController extends Controller
{
    /**
     * 🟢 عرض جميع المباريات
     */
    public function index()
    {
        $matches = FootballMatch::orderBy('date', 'asc')->get();
        return response()->json($matches);
    }

    /**
     * 🟢 إضافة مباراة جديدة
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'team1' => 'required|string|max:255',
            'team2' => 'required|string|max:255',
            'date' => 'required|date',
            'time' => 'required',
            'channel' => 'required|string|max:255',
            'result' => 'nullable|string|max:255',
            'status' => 'required|in:قادمة,منتهية,جارية',
        ]);

        $match = FootballMatch::create($validated);

        return response()->json([
            'message' => '✅ تمت إضافة المباراة بنجاح',
            'data' => $match,
        ], 201);
    }

    /**
     * 🟢 عرض مباراة واحدة
     */
    public function show($id)
    {
        $match = FootballMatch::findOrFail($id);
        return response()->json($match);
    }

    /**
     * ✏️ تحديث بيانات مباراة + حساب النقاط عند انتهاء المباراة
     */
    public function update(Request $request, $id)
    {
        $match = FootballMatch::findOrFail($id);

        $validated = $request->validate([
            'team1' => 'sometimes|string|max:255',
            'team2' => 'sometimes|string|max:255',
            'date' => 'sometimes|date',
            'time' => 'sometimes',
            'channel' => 'sometimes|string|max:255',
            'result' => 'nullable|string|max:255',
            'status' => 'sometimes|in:قادمة,منتهية,جارية',
        ]);

        $match->update($validated);

        /**
         * 🎯 إذا كانت المباراة منتهية وتم إدخال النتيجة
         * نحسب النقاط لجميع توقعات هذه المباراة
         */
        if ($match->status === 'منتهية' && !empty($match->result)) {
            if (strpos($match->result, '-') !== false) {
                [$team1Score, $team2Score] = explode('-', $match->result);

                // ✅ تعديل الاسم ليتوافق مع قاعدة البيانات
                $predictions = Prediction::where('football_match_id', $match->id)->get();

                foreach ($predictions as $prediction) {
                    $points = 0;

                    // ✅ إذا التوقع صحيح تماماً
                    if (
                        $prediction->team1_score == $team1Score &&
                        $prediction->team2_score == $team2Score
                    ) {
                        $points = 3;
                    }
                    // ⚽ إذا التوقع للفريق الفائز صحيح فقط
                    elseif (
                        ($team1Score > $team2Score && $prediction->team1_score > $prediction->team2_score) ||
                        ($team1Score < $team2Score && $prediction->team1_score < $prediction->team2_score) ||
                        ($team1Score == $team2Score && $prediction->team1_score == $prediction->team2_score)
                    ) {
                        $points = 1;
                    }

                    // 🧮 تحديث النقاط في جدول التوقعات
                    $prediction->update(['points' => $points]);
                }
            }
        }

        return response()->json([
            'message' => '✏️ تم تحديث المباراة بنجاح وتم حساب النقاط (إن وجدت)',
            'data' => $match,
        ]);
    }

    /**
     * 🗑️ حذف مباراة
     */
    public function destroy($id)
    {
        $match = FootballMatch::findOrFail($id);
        $match->delete();

        return response()->json(['message' => '🗑️ تم حذف المباراة بنجاح']);
    }
}
