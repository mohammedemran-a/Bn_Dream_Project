<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class RolePermissionSeeder extends Seeder
{
    public function run()
    {
        // 🧹 مسح الكاش
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        // 🟢 إنشاء الصلاحيات
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

        // 🧑‍💼 إنشاء الأدوار

        // المدير (Admin) — يمتلك كل الصلاحيات
        $admin = Role::firstOrCreate(['name' => 'admin']);
        $admin->givePermissionTo(Permission::all());

        // المستخدم العادي (User) — صلاحية عرض فقط
        $user = Role::firstOrCreate(['name' => 'user']);
        $user->givePermissionTo(['can view']);
    }
}
