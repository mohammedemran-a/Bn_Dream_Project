<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use Illuminate\Http\Request;
use App\Models\User;
use App\Notifications\NewOrderNotification;
use App\Notifications\OrderProcessedNotification;

class OrderController extends Controller
{
    // 🟢 عرض جميع الطلبات
    public function index()
    {
        $orders = Order::with(['user', 'products'])->latest()->get();
        return response()->json($orders);
    }

    // 🟢 عرض تفاصيل طلب معين
    public function show($id)
    {
        $order = Order::with(['user', 'products'])->find($id);
        if (!$order) {
            return response()->json(['message' => 'الطلب غير موجود'], 404);
        }
        return response()->json($order);
    }

    // 🟢 إنشاء طلب جديد
    public function store(Request $request)
    {
        $request->validate([
            'user_id' => 'required|exists:users,id',
            'products' => 'required|array',
            'products.*.id' => 'required|exists:products,id',
            'products.*.quantity' => 'required|integer|min:1',
            'total' => 'required|numeric|min:0',
        ]);

        // إنشاء الطلب
        $order = Order::create([
            'user_id' => $request->user_id,
            'total' => $request->total,
            'status' => 'جديد',
        ]);

        // إضافة المنتجات إلى الطلب
        foreach ($request->products as $item) {
            $product = Product::find($item['id']);
            OrderItem::create([
                'order_id' => $order->id,
                'product_id' => $product->id,
                'quantity' => $item['quantity'],
                'price' => $product->price,
            ]);
        }

         // 🟢 إشعار المشرفين بوجود طلب جديد
        $admins = User::role('admin')->get(); // تأكد أنك تستخدم Spatie Roles
        foreach ($admins as $admin) {
            $admin->notify(new NewOrderNotification($order));
        }

        return response()->json([
            'message' => 'تم إنشاء الطلب بنجاح',
            'order' => $order->load('products')
        ], 201);
    }

 public function updateStatus(Request $request, $id)
{


    $request->validate([
        'status' => 'required|in:جديد,قيد التنفيذ,تم التسليم,ملغي',
    ]);

    $order = Order::find($id);
    if (!$order) {
        return response()->json(['message' => 'الطلب غير موجود'], 404);
    }

    // ✅ احفظ الحالة القديمة قبل التحديث
    $oldStatus = $order->status;
    // ✅ حدث الحالة الجديدة
    $order->update(['status' => $request->status]);

    // ✅ تحقق إذا تغيرت الحالة فعلاً
    if ($order->user && $oldStatus !== $request->status) {
        $order->user->notify(new OrderProcessedNotification($order, $request->status));
    }

    return response()->json([
        'message' => 'تم تحديث حالة الطلب',
        'order' => $order
    ]);
}


    // 🟢 حذف طلب
    public function destroy($id)
    {
        $order = Order::find($id);
        if (!$order) {
            return response()->json(['message' => 'الطلب غير موجود'], 404);
        }

        $order->delete();
        return response()->json(['message' => 'تم حذف الطلب بنجاح']);
    }

    // 🟢 عرض الطلبات الخاصة بمستخدم معين
    public function getOrdersByUser($userId)
    {
        $orders = Order::with('products')->where('user_id', $userId)->get();
        return response()->json($orders);
    }
}

