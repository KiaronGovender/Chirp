<?php

use App\Models\Tweet;
use App\Models\User;

it('authenticated user can create a tweet', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->post('/tweets', [
        'body' => 'Hello, Chirp!',
    ]);

    $response->assertRedirect();

    $this->assertDatabaseHas('tweets', [
        'body' => 'Hello, Chirp!',
        'user_id' => $user->id,
        'parent_id' => null,
    ]);
});

it('guest cannot create a tweet', function () {
    $response = $this->post('/tweets', [
        'body' => 'Hello, Chirp!',
    ]);

    $response->assertRedirect('/login');
    $this->assertDatabaseMissing('tweets', ['body' => 'Hello, Chirp!']);
});

it('tweet body is required', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->post('/tweets', [
        'body' => '',
    ]);

    $response->assertSessionHasErrors('body');
});

it('tweet body cannot exceed 1000 characters', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->post('/tweets', [
        'body' => str_repeat('a', 1001),
    ]);

    $response->assertSessionHasErrors('body');
});

it('authenticated user can reply to a tweet', function () {
    $user = User::factory()->create();
    $tweet = Tweet::factory()->create();

    $this->actingAs($user)->post('/tweets', [
        'body' => 'This is a reply!',
        'parent_id' => $tweet->id,
    ]);

    $this->assertDatabaseHas('tweets', [
        'body' => 'This is a reply!',
        'user_id' => $user->id,
        'parent_id' => $tweet->id,
    ]);
});

it('tweet owner can delete their tweet', function () {
    $user = User::factory()->create();
    $tweet = Tweet::factory()->create(['user_id' => $user->id]);

    $response = $this->actingAs($user)->delete("/tweets/{$tweet->id}");

    $response->assertRedirect('/');
    $this->assertDatabaseMissing('tweets', ['id' => $tweet->id]);
});

it('non-owner cannot delete a tweet', function () {
    $owner = User::factory()->create();
    $other = User::factory()->create();
    $tweet = Tweet::factory()->create(['user_id' => $owner->id]);

    $response = $this->actingAs($other)->delete("/tweets/{$tweet->id}");

    $response->assertStatus(403);
    $this->assertDatabaseHas('tweets', ['id' => $tweet->id]);
});

it('can view a single tweet', function () {
    $tweet = Tweet::factory()->create();

    $response = $this->get("/tweets/{$tweet->id}");

    $response->assertStatus(200);
});
