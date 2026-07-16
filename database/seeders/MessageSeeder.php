<?php

namespace Database\Seeders;

use App\Models\Message;
use App\Models\User;
use Illuminate\Database\Seeder;

class MessageSeeder extends Seeder
{
    public function run(): void
    {
        $users = User::all();

        for ($i = 0; $i < 100; $i++) {

            $sender = $users->random();

            $receiver = $users
                ->where('id', '!=', $sender->id)
                ->random();

            Message::create([
                'sender_id' => $sender->id,
                'receiver_id' => $receiver->id,
                'body' => fake()->sentence(),
            ]);
        }
    }
}