<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class tweets extends Model
{
    /** @use HasFactory<\Database\Factories\TweetsFactory> */
    use HasFactory;

    protected $fillable = ['body','user_id'];

    public function user(){
        return $this->belongsTo(User::class);
    }
}
