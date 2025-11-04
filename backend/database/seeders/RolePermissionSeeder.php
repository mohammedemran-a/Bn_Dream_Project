<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use Illuminate\Support\Facades\Hash;

class RolePermissionSeeder extends Seeder
{
    public function run()
    {
        // 🧹 تنظيف الكاش
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        // 🔹 جميع الصلاحيات (من ملفك الأول)
        $permissions = [
            "dashboard_access",
            "dashboard_view",
            "rooms_view",
            "rooms_create",
            "rooms_edit",
            "rooms_delete",
            "bookings_view",
            "bookings_edit",
            "bookings_delete",
            "services_view",
            "services_create",
            "services_edit",
            "services_delete",
            "orders_view",
            "orders_process",
            "orders_delete",
            "matches_view",
            "matches_create",
            "matches_edit",
            "matches_delete",
            "users_view",
            "users_create",
            "users_edit",
            "users_delete",
            "roles_view",
            "roles_create",
            "roles_edit",
            "roles_delete",
            "notifications_view",
            "notifications_send",
            "notifications_delete",
            "settings_view",
            "settings_edit",
        ];

        // 🔹 إنشاء الصلاحيات
        foreach ($permissions as $permission) {
            Permission::firstOrCreate(['name' => $permission]);
        }

        // 🔹 إنشاء الأدوار
        $adminRole = Role::firstOrCreate(['name' => 'admin']);
        $userRole  = Role::firstOrCreate(['name' => 'user']);

        // 🔹 المدير يحصل على جميع الصلاحيات
        $adminRole->givePermissionTo(Permission::all());

        // 🔹 المستخدم بدون صلاحيات — يمكن تعديلها لاحقًا من لوحة التحكم
        $userRole->syncPermissions([]);

        // 🔹 إنشاء حساب المدير الأساسي
        $admin = User::firstOrCreate(
            ['email' => 'admin@example.com'],
            [
                'name' => 'Super Admin',
                'phone' => '0123456789',
                'password' => Hash::make('admin1234567'),
            ]
        );

        $admin->assignRole('admin');

        $this->command->info('✅ Roles & permissions seeded. Admin has all permissions, user has none.');
    }
}

