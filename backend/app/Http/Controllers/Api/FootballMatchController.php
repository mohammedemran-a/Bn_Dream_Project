<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\FootballMatch;
use Illuminate\Http\Request;

class FootballMatchController extends Controller
{
    /**
     * عرض جميع المباريات
     */
    public function index()
    {
        $matches = FootballMatch::orderBy('date', 'asc')->get();
        return response()->json($matches);
    }

    /**
     * إضافة مباراة جديدة
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
     * عرض مباراة واحدة
     */
    public function show($id)
    {
        $match = FootballMatch::findOrFail($id);
        return response()->json($match);
    }

    /**
     * تحديث بيانات مباراة
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

        return response()->json([
            'message' => '✏️ تم تحديث المباراة بنجاح',
            'data' => $match,
        ]);
    }

    /**
     * حذف مباراة
     */
    public function destroy($id)
    {
        $match = FootballMatch::findOrFail($id);
        $match->delete();

        return response()->json(['message' => '🗑️ تم حذف المباراة بنجاح']);
    }
}
