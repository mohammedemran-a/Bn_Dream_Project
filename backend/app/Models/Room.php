<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Room extends Model
{
      protected $table = 'rooms';
     protected $fillable = [
        'category', 'name', 'price', 'status', 'capacity', 'description', 'features', 'image_path'
    ];

        public function bookings()
    {
        return $this->hasMany(Booking::class);
    }
}
