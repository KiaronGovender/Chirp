<?php

namespace Database\Seeders;

use App\Models\Follow;
use App\Models\User;
use Illuminate\Database\Seeder;

class FollowSeeder extends Seeder
{
    public function run(): void
    {
        $users = User::all();

        foreach ($users as $user) {

            $following = $users
                ->where('id', '!=', $user->id)
                ->random(rand(3, min(8, $users->count() - 1)));

            foreach ($following as $followedUser) {
                Follow::firstOrCreate([
                    'follower_id' => $user->id,
                    'following_id' => $followedUser->id,
                ]);
            }
        }
    }
}