<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Room extends Model
{
    protected $table = 'rooms';

    protected $fillable = [
        'category', 'name', 'price', 'status', 'capacity', 'description', 'features', 'image_path'
    ];

    // إضافة الحقل المحسوب تلقائياً عند التحويل إلى JSON
    protected $appends = ['remaining_capacity'];

    public function bookings()
    {
        return $this->hasMany(Booking::class);
    }

    // الحقل المحسوب
    public function getRemainingCapacityAttribute()
    {
        $activeGuests = $this->bookings()
                             ->whereNotIn('status', ['ملغى', 'منتهي'])
                             ->sum('guests');

        return max($this->capacity - $activeGuests, 0);
    }
}
