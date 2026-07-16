<?php

namespace Database\Factories;

use App\Models\Retweet;
use App\Models\Tweet;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Retweet>
 */
class RetweetFactory extends Factory
{
    protected $model = Retweet::class;

    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'tweet_id' => Tweet::factory(),
        ];
    }
}
