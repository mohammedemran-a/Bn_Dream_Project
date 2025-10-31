<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Contact;

class ContactController extends Controller
{
    /**
     * تخزين الرسالة الجديدة
     */
    public function store(Request $request)
    {
        // التحقق من صحة البيانات
        $validated = $request->validate([
            'name' => 'required|string|max:100',
            'email' => 'required|email|max:255',
            'phone' => 'nullable|string|max:20',
            'message' => 'required|string|max:1000',
        ]);

        // إنشاء سجل جديد في قاعدة البيانات
        $contact = Contact::create($validated);

        return response()->json([
            'message' => 'تم استلام رسالتك بنجاح!',
            'data' => $contact
        ], 201);
    }

    /**
     * عرض جميع الرسائل (اختياري)
     */
    public function index()
    {
        return response()->json(Contact::latest()->get());
    }
}
