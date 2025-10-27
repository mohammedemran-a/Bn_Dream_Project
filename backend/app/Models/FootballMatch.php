<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class FootballMatch extends Model
{
       protected $table = 'football_matches';

    protected $fillable = [
        'team1',
        'team2',
        'date',
        'time',
        'channel',
        'result',
        'status',
    ];
}
