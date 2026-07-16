<?php

namespace Database\Seeders;

use App\Models\Like;
use App\Models\Tweet;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class LikeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $users = User::all();
        $tweets = Tweet::all();

        foreach ($tweets as $tweet){
            $users->random(rand(0,min(10,$users->count())))->each(function ($user) use ($tweet){
                Like::firstorCreate([
                    'user_id' => $user->id,
                    'tweet_id' => $tweet->id,
                ]);
            });
        }
    }
}
