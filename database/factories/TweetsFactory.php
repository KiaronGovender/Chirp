<?php

namespace Database\Factories;

use App\Models\tweets;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<tweets>
 */
class TweetsFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'body' => fake()->paragraph(),
            'user_id' => User::factory()
        ];
    }
}
