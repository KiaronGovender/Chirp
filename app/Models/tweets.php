<?php

namespace App\Models;

use Database\Factories\TweetsFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class tweets extends Model
{
    /** @use HasFactory<TweetsFactory> */
    use HasFactory;

    protected $fillable = ['body', 'user_id'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
