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
        // 🧹 مسح الكاش
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        // 🔹 إنشاء الصلاحيات
        $permissions = [
            'can view',
            'can create',
            'can edit',
            'can delete',
            'can manage users',
            'can manage settings',
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate(['name' => $permission]);
        }

        // 🔹 إنشاء دور المشرف Admin مع كل الصلاحيات
        $adminRole = Role::firstOrCreate(['name' => 'admin']);
        $adminRole->givePermissionTo(Permission::all());

        // 🔹 إنشاء دور المستخدم User مع صلاحية العرض فقط
        $userRole = Role::firstOrCreate(['name' => 'user']);
        $userRole->givePermissionTo(['can view']);

        // 🔹 إنشاء مشرف كامل
        $admin = User::firstOrCreate(
            ['email' => 'admin@example.com'], // يتحقق إذا كان موجود بالفعل
            [
                'name' => 'Super Admin',
                'phone' => '0123456789',
                'password' => Hash::make('admin1234567'),
            ]
        );

        // تعيين الدور Admin
        $admin->assignRole('admin');

        $this->command->info('✅ Admin user created with all fields and full permissions!');
    }
}
