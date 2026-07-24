<?php

namespace App\Services;

use App\Models\Tweet;
use App\Models\User;
use Illuminate\Contracts\Pagination\CursorPaginator;
use Illuminate\Support\Facades\Cache;

class TimelineService
{
    public function paginate(?User $viewer, int $perPage = 15): CursorPaginator
    {
        return Tweet::query()
            ->with(['user', 'parent.user'])
            ->withCount(['likes', 'retweets', 'replies'])
            ->latest()
            ->cursorPaginate($perPage)
            ->through(fn (Tweet $tweet): Tweet => $this->withViewerState($tweet, $viewer));
    }

    public function withViewerState(Tweet $tweet, ?User $viewer): Tweet
    {
        $tweet->is_liked = $tweet->isLikedBy($viewer);
        $tweet->is_retweeted = $tweet->isRetweetedBy($viewer);
        $tweet->is_bookmarked = $tweet->isBookmarkedBy($viewer);

        return $tweet;
    }

    public function fanOut(Tweet $tweet): int
    {
        $tweet->loadMissing('user');

        if (! $tweet->user) {
            return 0;
        }

        $recipientIds = $tweet->user
            ->followers()
            ->pluck('users.id')
            ->push($tweet->user_id)
            ->unique()
            ->values();

        foreach ($recipientIds as $userId) {
            $this->pushTweetId((int) $userId, (int) $tweet->id);
        }

        return $recipientIds->count();
    }

    /**
     * @return list<int>
     */
    public function cachedTweetIdsFor(User $user): array
    {
        $tweetIds = Cache::get($this->cacheKey($user->id), []);

        if (! is_array($tweetIds)) {
            return [];
        }

        return collect($tweetIds)
            ->map(fn (mixed $tweetId): int => (int) $tweetId)
            ->filter()
            ->values()
            ->all();
    }

    public function cacheKey(int $userId): string
    {
        return (string) config('chirp.timeline.cache_prefix', 'chirp:timeline:').$userId;
    }

    private function pushTweetId(int $userId, int $tweetId): void
    {
        $limit = max(1, (int) config('chirp.timeline.cache_limit', 100));
        $cacheKey = $this->cacheKey($userId);
        $cachedTweetIds = Cache::get($cacheKey, []);

        if (! is_array($cachedTweetIds)) {
            $cachedTweetIds = [];
        }

        $tweetIds = collect($cachedTweetIds)
            ->prepend($tweetId)
            ->map(fn (mixed $cachedTweetId): int => (int) $cachedTweetId)
            ->filter()
            ->unique()
            ->take($limit)
            ->values()
            ->all();

        Cache::put($cacheKey, $tweetIds, now()->addDays(2));
    }

    public function removeTweetFromTimeline(Tweet $tweet): int
    {
        $tweet->loadMissing('user');

        if (! $tweet->user) {
            return 0;
        }

        $recipientIds = $tweet->user
            ->followers()
            ->pluck('users.id')
            ->push($tweet->user_id)
            ->unique()
            ->values();

        foreach ($recipientIds as $userId) {
            $this->pullTweetId((int) $userId, (int) $tweet->id);
        }

        return $recipientIds->count();
    }

    private function pullTweetId(int $userId, int $tweetId): void
    {
        $cacheKey = $this->cacheKey($userId);
        $cachedTweetIds = Cache::get($cacheKey, []);

        if (! is_array($cachedTweetIds)) {
            return;
        }

        $tweetIds = collect($cachedTweetIds)
            ->filter(fn (mixed $cachedTweetId): bool => (int) $cachedTweetId !== $tweetId)
            ->values()
            ->all();

        if (empty($tweetIds)) {
            Cache::forget($cacheKey);
        } else {
            Cache::put($cacheKey, $tweetIds, now()->addDays(2));
        }
    }
}
