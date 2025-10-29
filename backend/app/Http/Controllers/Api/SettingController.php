<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class SettingController extends Controller
{
    // دالة لجلب جميع الإعدادات
    public function index()
    {
        return response()->json(Setting::all()->pluck('value', 'key'));
    }

    // دالة لتحديث الإعدادات
    public function update(Request $request)
    {
        $dataToUpdate = $request->except(['_token', '_method', 'logo']);

        if ($request->hasFile('logo')) {
            // حذف الشعار القديم إن وجد
            $oldSetting = Setting::where('key', 'logo')->first();
            if ($oldSetting && $oldSetting->value) {
                $oldPath = str_replace(asset('storage') . '/', '', $oldSetting->value);
                Storage::disk('public')->delete($oldPath);
            }

            // حفظ الشعار الجديد
            $path = $request->file('logo')->store('logos', 'public');
            $dataToUpdate['logo'] = asset('storage/' . $path);
        }

        // تحديث أو إنشاء كل إعداد
        foreach ($dataToUpdate as $key => $value) {
            if ($value !== null) {
                Setting::updateOrCreate(['key' => $key], ['value' => $value]);
            }
        }

        // إرجاع جميع الإعدادات المحدثة
        return response()->json(Setting::all()->pluck('value', 'key'));
    }
}
