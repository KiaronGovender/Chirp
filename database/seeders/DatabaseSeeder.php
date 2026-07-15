<?php

namespace Database\Seeders;

use App\Models\tweets;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        $users = User::factory(20)->create();

        $users->each(function ( $user) {
            tweets::factory(rand(0,15))->create([
                'user_id' => $user->id,
            ]);
        });
    }
}
