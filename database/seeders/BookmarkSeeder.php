<?php

namespace Database\Seeders;

use App\Models\Bookmark;
use App\Models\Tweet;
use App\Models\User;
use Illuminate\Database\Seeder;

class BookmarkSeeder extends Seeder
{
    public function run(): void
    {
        $users = User::all();
        $tweets = Tweet::all();

        foreach ($users as $user) {
            $tweets
                ->random(rand(1, min(10, $tweets->count())))
                ->each(function ($tweet) use ($user) {
                    Bookmark::firstOrCreate([
                        'user_id' => $user->id,
                        'tweet_id' => $tweet->id,
                    ]);
                });
        }
    }
}