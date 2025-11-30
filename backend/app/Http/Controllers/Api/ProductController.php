<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ProductController extends Controller
{
    /**
     * عرض جميع المنتجات
     */
    public function index()
    {
        return response()->json(Product::all());
    }

    /**
     * إضافة منتج جديد
     */
    public function store(Request $request)
    {
        // التحقق من البيانات المرسلة
        $request->validate([
            'type' => 'required|string',
            'name' => 'required|string',
            'price' => 'required|numeric',
            'stock' => 'required|integer',
            'category' => 'required|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg|max:10240', // 10 MB
        ]);

        $data = $request->all();

        // ✅ رفع الصورة إذا تم إرسالها
        if ($request->hasFile('image')) {
            // حفظ الصورة داخل storage/app/public/products
            $path = $request->file('image')->store('products', 'public');
            // حفظ الرابط الكامل داخل قاعدة البيانات
            $data['image'] = asset('storage/' . $path);
        }

        // إنشاء المنتج
        $product = Product::create($data);

        return response()->json($product, 201);
    }

    /**
     * عرض منتج محدد
     */
    public function show(Product $product)
    {
        return response()->json($product);
    }

    /**
     * تحديث منتج موجود
     */
    public function update(Request $request, Product $product)
    {
        $request->validate([
            'type' => 'sometimes|string',
            'name' => 'sometimes|string',
            'price' => 'sometimes|numeric',
            'stock' => 'sometimes|integer',
            'category' => 'sometimes|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg|max:10240', // 10 MB
        ]);

        $data = $request->all();

        // ✅ في حالة رفع صورة جديدة
        if ($request->hasFile('image')) {
            // حذف الصورة القديمة إن وُجدت
            if ($product->image) {
                $oldPath = str_replace(asset('storage') . '/', '', $product->image);
                Storage::disk('public')->delete($oldPath);
            }

            $path = $request->file('image')->store('products', 'public');
            $data['image'] = asset('storage/' . $path);
        }

        $product->update($data);

        return response()->json($product);
    }

    /**
     * حذف منتج
     */
    public function destroy(Product $product)
    {
        // حذف الصورة من السيرفر إذا وُجدت
        if ($product->image) {
            $oldPath = str_replace(asset('storage') . '/', '', $product->image);
            Storage::disk('public')->delete($oldPath);
        }

        $product->delete();

        return response()->json(null, 204);
    }
}
