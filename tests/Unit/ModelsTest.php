<?php

use App\Models\Bookmark;
use App\Models\Follow;
use App\Models\Like;
use App\Models\Retweet;
use App\Models\Tweet;
use App\Models\User;

it('creates a user with a tweet', function () {
    $user = User::factory()->create();
    $tweet = Tweet::factory()->create(['user_id' => $user->id]);

    expect($user->tweets)->toHaveCount(1);
    expect($tweet->user->id)->toBe($user->id);
});

it('tests like relationship', function () {
    $user = User::factory()->create();
    $tweet = Tweet::factory()->create();
    Like::factory()->create(['user_id' => $user->id, 'tweet_id' => $tweet->id]);

    expect($user->likes)->toHaveCount(1);
    expect($tweet->likes)->toHaveCount(1);
    expect($tweet->isLikedBy($user))->toBeTrue();
});

it('tests retweet relationship', function () {
    $user = User::factory()->create();
    $tweet = Tweet::factory()->create();
    Retweet::factory()->create(['user_id' => $user->id, 'tweet_id' => $tweet->id]);

    expect($user->retweets)->toHaveCount(1);
    expect($tweet->retweets)->toHaveCount(1);
    expect($tweet->isRetweetedBy($user))->toBeTrue();
});

it('tests bookmark relationship', function () {
    $user = User::factory()->create();
    $tweet = Tweet::factory()->create();
    Bookmark::factory()->create(['user_id' => $user->id, 'tweet_id' => $tweet->id]);

    expect($user->bookmarks)->toHaveCount(1);
    expect($tweet->bookmarks)->toHaveCount(1);
    expect($tweet->isBookmarkedBy($user))->toBeTrue();
});

it('tests follow relationship', function () {
    $follower = User::factory()->create();
    $following = User::factory()->create();

    Follow::factory()->create([
        'follower_id' => $follower->id,
        'following_id' => $following->id,
    ]);

    expect($follower->following)->toHaveCount(1);
    expect($following->followers)->toHaveCount(1);
    expect($follower->isFollowing($following))->toBeTrue();
    expect($following->isFollowedBy($follower))->toBeTrue();
});
