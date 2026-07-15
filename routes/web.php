<?php

use App\Http\Controllers\TweetsController;
use Illuminate\Support\Facades\Route;

Route::get('/', [TweetsController::class, 'index'])->name('home');
Route::post('/tweets',[TweetsController::class, 'store']);

