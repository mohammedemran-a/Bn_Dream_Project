<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Ad;
use Illuminate\Support\Facades\Storage;

class AdController extends Controller
{
    /**
     * جلب جميع الإعلانات
     */
    public function index()
    {
        return response()->json(Ad::all());
    }

    /**
     * إنشاء إعلان جديد
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title'       => 'required|string|max:255',
            'description' => 'required|string',
            'type'        => 'required|string',
            'link'        => 'required|string',
            'badge'       => 'nullable|string',
            'discount'    => 'nullable|string',
            'gradient'    => 'nullable|string',
            'image'       => 'nullable|image|mimes:jpg,jpeg,png,webp|max:10240', // 10MB
        ]);

        if ($request->hasFile('image')) {
            // حفظ الصورة داخل storage/app/public/ads
            $path = $request->file('image')->store('ads', 'public');
            $validated['image'] = $path;
        }

        // قيمة افتراضية
        $validated['isActive'] = true;

        // إنشاء الإعلان
        $ad = Ad::create($validated);

        return response()->json([
            'message' => 'تم إنشاء الإعلان بنجاح',
            'ad' => $ad,
            'image_url' => $ad->image ? asset('storage/' . $ad->image) : null,
        ], 201);
    }

    /**
     * تحديث إعلان
     */
    public function update(Request $request, $id)
    {
        $ad = Ad::findOrFail($id);

        $validated = $request->validate([
            'title'       => 'required|string|max:255',
            'description' => 'required|string',
            'type'        => 'required|string',
            'link'        => 'required|string',
            'badge'       => 'nullable|string',
            'discount'    => 'nullable|string',
            'gradient'    => 'nullable|string',
            'image'       => 'nullable|image|mimes:jpg,jpeg,png,webp|max:10240',
        ]);

        // إذا تم رفع صورة جديدة
        if ($request->hasFile('image')) {

            // حذف الصورة القديمة إن وُجدت
            if ($ad->image && Storage::disk('public')->exists($ad->image)) {
                Storage::disk('public')->delete($ad->image);
            }

            // رفع الصورة الجديدة
            $path = $request->file('image')->store('ads', 'public');
            $validated['image'] = $path;
        }

        // تحديث الإعلان
        $ad->update($validated);

        return response()->json([
            'message' => 'تم تحديث الإعلان بنجاح',
            'ad' => $ad,
            'image_url' => $ad->image ? asset('storage/' . $ad->image) : null,
        ]);
    }

    /**
     * حذف إعلان
     */
    public function destroy($id)
    {
        $ad = Ad::findOrFail($id);

        // حذف الصورة من التخزين إذا كانت موجودة
        if ($ad->image && Storage::disk('public')->exists($ad->image)) {
            Storage::disk('public')->delete($ad->image);
        }

        $ad->delete();

        return response()->json(['message' => 'تم حذف الإعلان بنجاح']);
    }

    /**
     * تفعيل / إيقاف الإعلان
     */
    public function toggle($id)
    {
        $ad = Ad::findOrFail($id);

        $ad->isActive = !$ad->isActive;
        $ad->save();

        return response()->json([
            'message'  => $ad->isActive ? "تم تفعيل الإعلان" : "تم إيقاف الإعلان",
            'isActive' => $ad->isActive
        ]);
    }
}
