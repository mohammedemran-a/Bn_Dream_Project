<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\Room;
use Illuminate\Http\Request;
use Carbon\Carbon;

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
     * عند الإنشاء، يتم تغيير حالة الغرفة إلى "محجوز".
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
            'status' => 'nullable|string', // يمكن أن يكون "قيد المراجعة" أو "مؤكد"
            'duration_type' => 'required|in:hours,days',
            'duration_value' => 'required|integer|min:1',
        ]);

        // إنشاء الحجز
        $booking = Booking::create($validated);

        // تحديث حالة الغرفة إلى محجوزة
        $room = Room::findOrFail($validated['room_id']);
        $room->status = 'محجوز';
        $room->save();

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
     * تحديث بيانات الحجز، بما في ذلك الحالة.
     * إذا تم الإلغاء أو الانتهاء، يتم إعادة الغرفة إلى "متاح".
     */
    public function update(Request $request, string $id)
    {
        $booking = Booking::findOrFail($id);

        $booking->update($request->all());

        // التعامل مع تغيير حالة الغرفة
        if (isset($request->status)) {
            $room = $booking->room;
            
            // إذا أصبح الحجز ملغى أو انتهى، نعيد الغرفة متاحة
            if (in_array($request->status, ['ملغى', 'منتهي'])) {
                $room->status = 'متاح';
                $room->save();
            }
            // إذا أصبح الحجز مؤكد أو قيد المراجعة، نجعل الغرفة محجوزة
            elseif (in_array($request->status, ['مؤكد', 'قيد المراجعة'])) {
                $room->status = 'محجوز';
                $room->save();
            }
        }

        return response()->json([
            'message' => 'تم تحديث بيانات الحجز بنجاح',
            'booking' => $booking
        ]);
    }

    /**
     * 🔴 destroy:
     * حذف حجز من قاعدة البيانات.
     * عند الحذف، تعود الغرفة متاحة تلقائيًا.
     */
    public function destroy(string $id)
    {
        $booking = Booking::findOrFail($id);

        $room = $booking->room;
        $booking->delete();

        // إعادة الغرفة متاحة
        if ($room) {
            $room->status = 'متاح';
            $room->save();
        }

        return response()->json([
            'message' => 'تم حذف الحجز بنجاح'
        ]);
    }
}
