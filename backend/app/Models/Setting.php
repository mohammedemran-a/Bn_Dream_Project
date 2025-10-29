<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Setting extends Model
{
    use HasFactory;
    
    // قائمة الحقول المسموح بتعبئتها بشكل جماعي
    protected $fillable = [
        'key',
        'value',
    ];
}
