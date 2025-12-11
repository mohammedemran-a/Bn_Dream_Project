<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\Room;
use Illuminate\Http\Request;
use App\Models\User;
use App\Notifications\NewBookingNotification;
use App\Notifications\BookingConfirmedNotification;

class BookingController extends Controller
{
    /**
     * عرض جميع الحجوزات (مع التصفية)
     */
    public function index(Request $request)
    {
        $status = $request->query('status');

        $query = Booking::with(['user', 'room']);

        if ($status && $status !== 'الكل') {
            $query->where('status', $status);
        }

        return response()->json($query->get());
    }

    /**
     * إنشاء حجز جديد (مع حساب السعة)
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'room_id' => 'required|exists:rooms,id',
            'check_in' => 'required|date',
            'check_out' => 'required|date|after:check_in',
            'guests' => 'required|integer|min:1',
            'total_price' => 'required|numeric|min:0',
            'status' => 'nullable|string',
            'duration_type' => 'required|in:hours,days',
            'duration_value' => 'required|integer|min:1',
            'payment_method' => 'required|in:cash,wallet',
            'wallet_type' => 'nullable|in:جوالي,جيب,ون كاش',
            'wallet_code' => 'nullable|string|max:255',
        ]);

        // التحقق من الدفع بالمحفظة
        if ($validated['payment_method'] === 'wallet') {
            if (empty($validated['wallet_type']) || empty($validated['wallet_code'])) {
                return response()->json([
                    'message' => 'يجب إدخال نوع المحفظة وكودها عند اختيار الدفع بالمحفظة.'
                ], 422);
            }
        }

        // جلب الغرفة
        $room = Room::findOrFail($validated['room_id']);

        // -------------------------------
        // 🔥 حساب السعة والحجوزات النشطة
        // -------------------------------
        $activeGuests = Booking::where('room_id', $room->id)
            ->whereNotIn('status', ['ملغى', 'منتهي'])
            ->sum('guests');

        $newTotalGuests = $activeGuests + $validated['guests'];

        if ($newTotalGuests > $room->capacity) {
            return response()->json([
                'message' => 'عدد الأشخاص أكبر من السعة المتاحة حالياً.'
            ], 422);
        }

        // إنشاء الحجز
        $booking = Booking::create([
            'user_id' => $validated['user_id'],
            'room_id' => $validated['room_id'],
            'check_in' => $validated['check_in'],
            'check_out' => $validated['check_out'],
            'guests' => $validated['guests'],
            'total_price' => $validated['total_price'],
            'status' => $validated['status'] ?? 'قيد المراجعة',
            'duration_type' => $validated['duration_type'],
            'duration_value' => $validated['duration_value'],
            'payment_method' => $validated['payment_method'],
            'wallet_type' => $validated['wallet_type'] ?? null,
            'wallet_code' => $validated['wallet_code'] ?? null,
        ]);

        // -------------------------------
        // 🔥 تحديث حالة الغرفة حسب السعة
        // -------------------------------
        if ($newTotalGuests >= $room->capacity) {
            $room->status = 'محجوز';
        } else {
            $room->status = 'متاح';
        }

        $room->save();

        // إشعار الأدمن
        $admins = User::role('admin')->get();
        foreach ($admins as $admin) {
            $admin->notify(new NewBookingNotification($booking));
        }

        return response()->json([
            'message' => 'تم إنشاء الحجز بنجاح',
            'booking' => $booking
        ], 201);
    }

    /**
     * عرض حجز
     */
    public function show(string $id)
    {
        $booking = Booking::with(['user', 'room'])->findOrFail($id);
        return response()->json($booking);
    }

    /**
     * تحديث حجز (مع تعديل السعة والحالة)
     */
    public function update(Request $request, string $id)
    {
        $booking = Booking::findOrFail($id);
        $oldStatus = $booking->status;

        $booking->update($request->all());

        $room = $booking->room;

        // -------------------------------
        // 🔥 إعادة حساب الضيوف لكل الحجوزات النشطة بعد التحديث
        // -------------------------------
        $activeGuests = Booking::where('room_id', $room->id)
            ->whereNotIn('status', ['ملغى', 'منتهي'])
            ->sum('guests');

        if ($activeGuests >= $room->capacity) {
            $room->status = 'محجوز';
        } else {
            $room->status = 'متاح';
        }

        $room->save();

        // إشعار بتأكيد الحجز
        if ($request->status === 'مؤكد' && $oldStatus !== 'مؤكد') {
            $booking->user->notify(new BookingConfirmedNotification($booking));
        }

        return response()->json([
            'message' => 'تم تحديث بيانات الحجز بنجاح',
            'booking' => $booking
        ]);
    }

    /**
     * حذف حجز (وإعادة السعة)
     */
    public function destroy(string $id)
    {
        $booking = Booking::findOrFail($id);
        $room = $booking->room;

        $booking->delete();

        // إعادة حساب السعة بعد الحذف
        $activeGuests = Booking::where('room_id', $room->id)
            ->whereNotIn('status', ['ملغى', 'منتهي'])
            ->sum('guests');

        if ($activeGuests >= $room->capacity) {
            $room->status = 'محجوز';
        } else {
            $room->status = 'متاح';
        }

        $room->save();

        return response()->json([
            'message' => 'تم حذف الحجز بنجاح'
        ]);
    }
}
