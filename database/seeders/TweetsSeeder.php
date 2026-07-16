<?php

namespace Database\Seeders;

use App\Models\Tweet;
use App\Models\User;
use Illuminate\Database\Seeder;

class TweetsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $users = User::all();

        foreach ($users as $user){
            Tweet::factory(rand(5,15))->for($user)->create();
        }
    }
}
