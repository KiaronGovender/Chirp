<?php

use App\Models\Tweet;
use App\Models\User;

it('displays the home feed', function () {
    $response = $this->get('/');
    $response->assertStatus(200);
});

it('tests exploring users and tweets', function () {
    $response = $this->get('/explore');
    $response->assertStatus(200);
});

it('tests liking a tweet', function () {
    $user = User::factory()->create();
    $tweet = Tweet::factory()->create();

    $this->actingAs($user)->post("/tweets/{$tweet->id}/like");
    expect($tweet->isLikedBy($user))->toBeTrue();

    $this->actingAs($user)->post("/tweets/{$tweet->id}/like");
    expect($tweet->isLikedBy($user))->toBeFalse();
});

it('tests bookmarking a tweet', function () {
    $user = User::factory()->create();
    $tweet = Tweet::factory()->create();

    $this->actingAs($user)->post("/tweets/{$tweet->id}/bookmark");
    expect($tweet->isBookmarkedBy($user))->toBeTrue();

    $this->actingAs($user)->post("/tweets/{$tweet->id}/bookmark");
    expect($tweet->isBookmarkedBy($user))->toBeFalse();
});

it('tests following a user', function () {
    $follower = User::factory()->create();
    $following = User::factory()->create();

    $this->actingAs($follower)->post("/users/{$following->id}/follow");
    expect($follower->isFollowing($following))->toBeTrue();

    $this->actingAs($follower)->post("/users/{$following->id}/follow");
    expect($follower->isFollowing($following))->toBeFalse();
});

it('tests retweeting', function () {
    $user = User::factory()->create();
    $tweet = Tweet::factory()->create();

    $this->actingAs($user)->post("/tweets/{$tweet->id}/retweet");
    expect($tweet->isRetweetedBy($user))->toBeTrue();

    $this->actingAs($user)->post("/tweets/{$tweet->id}/retweet");
    expect($tweet->isRetweetedBy($user))->toBeFalse();
});

it('views a profile', function () {
    $user = User::factory()->create(['username' => 'testuser']);
    $response = $this->get('/testuser');
    $response->assertStatus(200);
});
