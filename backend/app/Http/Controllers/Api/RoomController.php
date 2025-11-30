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
        return response()->json(Room::all());
    }

    /**
     * جلب غرفة واحدة حسب الـ ID
     */
    public function show($id)
    {
        return response()->json(Room::findOrFail($id));
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
            'image' => 'nullable|image|mimes:jpg,jpeg,png|max:10240', // 10 MB
        ]);

        if ($request->hasFile('image')) {
            // حفظ الصورة داخل storage/app/public/rooms
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
            'image' => 'nullable|image|mimes:jpg,jpeg,png|max:10240', // 10 MB
        ]);

        if ($request->hasFile('image')) {
            // حذف الصورة القديمة إن وجدت
            if ($room->image_path && Storage::disk('public')->exists($room->image_path)) {
                Storage::disk('public')->delete($room->image_path);
            }

            // رفع الصورة الجديدة
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

        // حذف الصورة من التخزين إذا كانت موجودة
        if ($room->image_path && Storage::disk('public')->exists($room->image_path)) {
            Storage::disk('public')->delete($room->image_path);
        }

        $room->delete();

        return response()->json(['message' => 'Room deleted successfully']);
    }
}
