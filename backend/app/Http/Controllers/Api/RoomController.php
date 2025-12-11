<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Room;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
    
class RoomController extends Controller
{
    /**
     * جلب جميع الغرف
     */
    public function index()
    {
        $rooms = Room::all(); // الحقل remaining_capacity يظهر تلقائياً من الـ Model
        return response()->json($rooms);
    }

    /**
     * جلب غرفة واحدة حسب الـ ID
     */
    public function show($id)
    {
        $room = Room::findOrFail($id); // الحقل remaining_capacity يظهر تلقائياً
        return response()->json($room);
    }

    /**
     * إنشاء غرفة جديدة
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'category' => 'required|in:غرف خاصة,غرف عامة,صالات المناسبات,غرف البلايستيشن,صالات البلياردو',
            'name' => 'required|string|max:255',
            'price' => 'required|numeric|min:0',
            'status' => 'required|in:متاح,محجوز',
            'capacity' => 'required|integer|min:1',
            'description' => 'nullable|string',
            'features' => 'nullable|string',
            'image' => 'nullable|image|mimes:jpg,jpeg,png|max:10240',
        ]);

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('rooms', 'public');
            $validated['image_path'] = $path;
        }

        $room = Room::create($validated);

        return response()->json($room, 201);
    }

    /**
     * تحديث غرفة موجودة
     */
    public function update(Request $request, $id)
    {
        $room = Room::findOrFail($id);

        $validated = $request->validate([
            'category' => 'required|in:غرف خاصة,غرف عامة,صالات المناسبات,غرف البلايستيشن,صالات البلياردو',
            'name' => 'required|string|max:255',
            'price' => 'required|numeric|min:0',
            'status' => 'required|in:متاح,محجوز',
            'capacity' => 'required|integer|min:1',
            'description' => 'nullable|string',
            'features' => 'nullable|string',
            'image' => 'nullable|image|mimes:jpg,jpeg,png|max:10240',
        ]);

        if ($request->hasFile('image')) {
            if ($room->image_path && Storage::disk('public')->exists($room->image_path)) {
                Storage::disk('public')->delete($room->image_path);
            }
            $path = $request->file('image')->store('rooms', 'public');
            $validated['image_path'] = $path;
        }

        $room->update($validated);

        return response()->json($room);
    }

    /**
     * حذف غرفة
     */
    public function destroy($id)
    {
        $room = Room::findOrFail($id);

        if ($room->image_path && Storage::disk('public')->exists($room->image_path)) {
            Storage::disk('public')->delete($room->image_path);
        }

        $room->delete();

        return response()->json(['message' => 'Room deleted successfully']);
    }
}
