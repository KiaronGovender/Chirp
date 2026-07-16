<?php

namespace Database\Seeders;

use App\Models\Retweet;
use App\Models\Tweet;
use App\Models\User;
use Illuminate\Database\Seeder;

class RetweetSeeder extends Seeder
{
    public function run(): void
    {
        $users = User::all();
        $tweets = Tweet::all();

        foreach ($tweets as $tweet) {
            $users
                ->random(rand(0, min(5, $users->count())))
                ->each(function ($user) use ($tweet) {
                    Retweet::firstOrCreate([
                        'user_id' => $user->id,
                        'tweet_id' => $tweet->id,
                    ]);
                });
        }
    }
}