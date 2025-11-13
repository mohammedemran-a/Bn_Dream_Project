<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    // 🔹 جلب جميع الإشعارات
    public function index(Request $request)
    {
        return $request->user()->notifications;
    }

    // 🔹 جلب الإشعارات غير المقروءة فقط
    public function unread(Request $request)
    {
        return $request->user()->unreadNotifications;
    }

    // 🔹 تحديد إشعار كمقروء
    public function markAsRead($id, Request $request)
    {
        $notification = $request->user()->notifications()->findOrFail($id);
        $notification->markAsRead();

        return response()->json(['message' => 'تمت قراءة الإشعار']);
    }

    // 🔹 حذف إشعار واحد
    public function destroy($id, Request $request)
    {
        $notification = $request->user()->notifications()->findOrFail($id);
        $notification->delete();

        return response()->json(['message' => 'تم حذف الإشعار بنجاح']);
    }

    // 🔹 حذف جميع الإشعارات
    public function clearAll(Request $request)
    {
        $request->user()->notifications()->delete();

        return response()->json(['message' => 'تم حذف جميع الإشعارات']);
    }
}
