<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    protected $table = 'products';
    protected $fillable = [
        'type',
        'name',
        'price',
        'stock',
        'category',
        'image',
    ];
}
