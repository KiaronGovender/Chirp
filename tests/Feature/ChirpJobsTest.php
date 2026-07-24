<?php

use App\Jobs\FanOutPost;
use App\Jobs\ModerateBannedWords;
use App\Jobs\UpdateTrends;
use App\Models\Tweet;
use App\Models\User;
use App\Services\ChirpService;
use App\Services\TimelineService;
use Illuminate\Support\Facades\Bus;
use Illuminate\Support\Facades\Cache;

it('dispatches fanout and trend jobs when creating a tweet', function () {
    Bus::fake([FanOutPost::class, UpdateTrends::class]);

    $user = User::factory()->create();

    $response = $this->actingAs($user)->post('/tweets', [
        'body' => 'Shipping #Laravel work',
    ]);

    $response->assertRedirect('/');
    Bus::assertDispatched(FanOutPost::class);
    Bus::assertDispatched(UpdateTrends::class);
});

it('blocks configured banned words at post time', function () {
    config(['chirp.banned_words' => ['spoiler']]);

    $user = User::factory()->create();

    $response = $this->actingAs($user)->post('/tweets', [
        'body' => 'This has a spoiler in it',
    ]);

    $response->assertSessionHasErrors('body');
    $this->assertDatabaseCount('tweets', 0);
});

it('fans posts out to follower timeline caches', function () {
    config(['chirp.timeline.cache_limit' => 5]);

    $author = User::factory()->create();
    $follower = User::factory()->create();
    $author->followers()->attach($follower->id);
    $tweet = Tweet::factory()->create(['user_id' => $author->id]);

    (new FanOutPost($tweet))->handle(app(TimelineService::class));

    expect(app(TimelineService::class)->cachedTweetIdsFor($follower))->toBe([$tweet->id])
        ->and(app(TimelineService::class)->cachedTweetIdsFor($author))->toBe([$tweet->id]);
});

it('refreshes hashtag trends', function () {
    Tweet::factory()->create(['body' => 'Talking about #Laravel and #PHP']);
    Tweet::factory()->create(['body' => 'More #Laravel notes']);

    (new UpdateTrends)->handle(app(ChirpService::class));

    expect(Cache::get('chirp:trends'))->toMatchArray([
        [
            'tag' => 'laravel',
            'label' => '#laravel',
            'tweets_count' => 2,
        ],
        [
            'tag' => 'php',
            'label' => '#php',
            'tweets_count' => 1,
        ],
    ]);
});

it('removes existing tweets with banned words from the scheduled job', function () {
    config(['chirp.banned_words' => ['spoiler']]);
    Bus::fake([UpdateTrends::class]);

    $clean = Tweet::factory()->create(['body' => 'A clean post']);
    $blocked = Tweet::factory()->create(['body' => 'A spoiler post']);

    (new ModerateBannedWords)->handle(app(ChirpService::class));

    $this->assertModelExists($clean);
    $this->assertModelMissing($blocked);
    Bus::assertDispatched(UpdateTrends::class);
});

it('removes pruned tweets with banned words from the timeline cache', function () {
    config(['chirp.banned_words' => ['spoiler']]);
    Bus::fake([UpdateTrends::class]);

    $author = User::factory()->create();
    $follower = User::factory()->create();
    $author->followers()->attach($follower->id);

    $clean = Tweet::factory()->create(['user_id' => $author->id, 'body' => 'A clean post']);
    $blocked = Tweet::factory()->create(['user_id' => $author->id, 'body' => 'A spoiler post']);

    // Fan them out first (simulate post-creation fan-out caching)
    $timelineService = app(TimelineService::class);
    $timelineService->fanOut($clean);
    $timelineService->fanOut($blocked);

    // Verify initially cached
    expect($timelineService->cachedTweetIdsFor($follower))->toContain($clean->id, $blocked->id);

    // Run the moderation job
    (new ModerateBannedWords)->handle(app(ChirpService::class));

    // Verify missing from database
    $this->assertModelExists($clean);
    $this->assertModelMissing($blocked);

    // Verify timeline cache only contains the clean tweet
    expect($timelineService->cachedTweetIdsFor($follower))->toBe([$clean->id])
        ->and($timelineService->cachedTweetIdsFor($author))->toBe([$clean->id]);
});

it('registers scheduled chirp maintenance jobs', function () {
    $this->artisan('schedule:list')
        ->assertSuccessful()
        ->expectsOutputToContain('chirp.moderate-banned-words')
        ->expectsOutputToContain('chirp.update-trends');
});
