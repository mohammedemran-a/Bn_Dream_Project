<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use Illuminate\Http\Request;

class BookingController extends Controller
{
    /**
     * 🟢 index:
     * عرض جميع الحجوزات (مع إمكانية التصفية حسب الحالة).
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
     * 🟡 store:
     * إنشاء حجز جديد.
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
        ]);

        $booking = Booking::create($validated);

        return response()->json([
            'message' => 'تم إنشاء الحجز بنجاح',
            'booking' => $booking
        ], 201);
    }

    /**
     * 🔵 show:
     * عرض تفاصيل حجز واحد.
     */
    public function show(string $id)
    {
        $booking = Booking::with(['user', 'room'])->findOrFail($id);
        return response()->json($booking);
    }

    /**
     * 🟠 update:
     * تحديث بيانات الحجز (مثل الحالة أو التواريخ).
     */
    public function update(Request $request, string $id)
    {
        $booking = Booking::findOrFail($id);

        $booking->update($request->all());

        return response()->json([
            'message' => 'تم تحديث بيانات الحجز بنجاح',
            'booking' => $booking
        ]);
    }

    /**
     * 🔴 destroy:
     * حذف حجز من قاعدة البيانات.
     */
    public function destroy(string $id)
    {
        $booking = Booking::findOrFail($id);
        $booking->delete();

        return response()->json([
            'message' => 'تم حذف الحجز بنجاح'
        ]);
    }
}
