<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\PasswordResetController;
use App\Http\Controllers\RegisterController;
use App\Http\Controllers\TweetsController;
use App\Http\Controllers\VerificationController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\BookmarkController;
use App\Http\Controllers\ExploreController;
use App\Http\Controllers\FollowController;
use App\Http\Controllers\LikeController;
use App\Http\Controllers\MessageController;
use App\Http\Controllers\NotificationsController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\RetweetController;

Route::get('/', [TweetsController::class, 'index'])->name('home');

// Authentication
Route::get('/login', [AuthController::class, 'showLogin'])->name('login');
Route::post('/login', [AuthController::class, 'login']);
Route::post('/logout', [AuthController::class, 'logout'])->name('logout');

// Registration
Route::get('/register', [RegisterController::class, 'show'])->name('register');
Route::post('/register', [RegisterController::class, 'register']);
Route::get('/username/check', [RegisterController::class, 'checkUsername']);

// Email verification
Route::get('/email/verify', [VerificationController::class, 'notice'])->middleware('auth')->name('verification.notice');
Route::get('/email/verify/{id}/{hash}', [VerificationController::class, 'verify'])->middleware(['auth', 'signed'])->name('verification.verify');
Route::post('/email/verification-notification', [VerificationController::class, 'resend'])->middleware(['auth', 'throttle:6,1'])->name('verification.send');

// Password reset
Route::get('/forgot-password', [PasswordResetController::class, 'request'])->name('password.request');
Route::post('/forgot-password', [PasswordResetController::class, 'sendResetLink'])->name('password.email');
Route::get('/reset-password/{token}', [PasswordResetController::class, 'showResetForm'])->name('password.reset');
Route::post('/reset-password', [PasswordResetController::class, 'reset'])->name('password.update');

// Tweets
Route::get('/tweets', [TweetsController::class, 'loadMore'])->name('tweets.loadMore');
Route::get('/tweets/{tweet}', [TweetsController::class, 'show'])->name('tweets.show');
Route::post('/tweets', [TweetsController::class, 'store'])->middleware('auth')->name('tweets.store');
Route::delete('/tweets/{tweet}', [TweetsController::class, 'destroy'])->middleware('auth')->name('tweets.destroy');

// Social Features (Authenticated)
Route::middleware('auth')->group(function () {
    Route::post('/tweets/{tweet}/like', [LikeController::class, 'toggle'])->name('likes.toggle');
    Route::post('/tweets/{tweet}/retweet', [RetweetController::class, 'toggle'])->name('retweets.toggle');
    Route::post('/tweets/{tweet}/bookmark', [BookmarkController::class, 'toggle'])->name('bookmarks.toggle');
    Route::get('/bookmarks', [BookmarkController::class, 'index'])->name('bookmarks.index');
    Route::post('/users/{user}/follow', [FollowController::class, 'toggle'])->name('follows.toggle');
    Route::put('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::get('/notifications', [NotificationsController::class, 'index'])->name('notifications.index');
    Route::get('/messages', [MessageController::class, 'index'])->name('messages.index');
    Route::post('/messages', [MessageController::class, 'store'])->name('messages.store');
});

// Explore & Profiles (Public/Mixed)
Route::get('/explore', [ExploreController::class, 'index'])->name('explore.index');
Route::get('/{username}', [ProfileController::class, 'show'])->name('profile.show');
