<?php

namespace App\Services;

use App\Jobs\FanOutPost;
use App\Jobs\UpdateTrends;
use App\Models\Tweet;
use App\Models\User;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class ChirpService
{
    /**
     * @param  array{body: string, parent_id?: int|null}  $attributes
     */
    public function createTweet(User $user, array $attributes): Tweet
    {
        $this->ensureBodyIsAllowed($attributes['body']);

        return DB::transaction(function () use ($user, $attributes): Tweet {
            $tweet = $user->tweets()->create([
                'body' => $attributes['body'],
                'parent_id' => $attributes['parent_id'] ?? null,
            ]);

            FanOutPost::dispatch($tweet)->afterCommit();
            UpdateTrends::dispatch()->afterCommit();

            return $tweet;
        });
    }

    /**
     * @return list<string>
     */
    public function bannedWords(): array
    {
        $words = config('chirp.banned_words', []);

        if (is_string($words)) {
            $words = explode(',', $words);
        }

        if (! is_array($words)) {
            return [];
        }

        return collect($words)
            ->filter(fn (mixed $word): bool => is_string($word))
            ->map(fn (string $word): string => mb_strtolower(trim($word)))
            ->filter()
            ->unique()
            ->values()
            ->all();
    }

    public function ensureBodyIsAllowed(string $body): void
    {
        if ($this->containsBannedWord($body)) {
            throw ValidationException::withMessages([
                'body' => 'This post contains a banned word.',
            ]);
        }
    }

    public function containsBannedWord(string $body): bool
    {
        return $this->matchingBannedWords($body) !== [];
    }

    /**
     * @return list<string>
     */
    public function matchingBannedWords(string $body): array
    {
        $body = mb_strtolower($body);

        return collect($this->bannedWords())
            ->filter(fn (string $word): bool => preg_match($this->wordPattern($word), $body) === 1)
            ->values()
            ->all();
    }

    /**
     * @return list<array{tag: string, label: string, tweets_count: int}>
     */
    public function trends(): array
    {
        $trends = Cache::get($this->trendCacheKey(), []);

        return is_array($trends) ? $trends : [];
    }

    /**
     * @return list<array{tag: string, label: string, tweets_count: int}>
     */
    public function refreshTrends(): array
    {
        $counts = [];
        $windowHours = max(1, (int) config('chirp.trends.window_hours', 24));
        $limit = max(1, (int) config('chirp.trends.limit', 10));

        Tweet::query()
            ->where('created_at', '>=', now()->subHours($windowHours))
            ->select(['id', 'body'])
            ->chunkById(200, function ($tweets) use (&$counts): void {
                foreach ($tweets as $tweet) {
                    foreach ($this->extractHashtags((string) $tweet->body) as $tag) {
                        $counts[$tag] = ($counts[$tag] ?? 0) + 1;
                    }
                }
            });

        arsort($counts);

        $trends = collect($counts)
            ->take($limit)
            ->map(fn (int $count, string $tag): array => [
                'tag' => $tag,
                'label' => '#'.$tag,
                'tweets_count' => $count,
            ])
            ->values()
            ->all();

        Cache::put($this->trendCacheKey(), $trends, now()->addHours(2));

        return $trends;
    }

    public function pruneTweetsWithBannedWords(int $chunkSize = 100): int
    {
        $deleted = 0;

        Tweet::query()
            ->select(['id', 'body', 'user_id'])
            ->chunkById($chunkSize, function ($tweets) use (&$deleted): void {
                foreach ($tweets as $tweet) {
                    if (! $this->containsBannedWord((string) $tweet->body)) {
                        continue;
                    }

                    $tweet->delete();
                    $deleted++;
                }
            });

        return $deleted;
    }

    /**
     * @return list<string>
     */
    public function extractHashtags(string $body): array
    {
        preg_match_all('/(?<![\pL\pN_])#([\pL\pN_]{2,50})/u', $body, $matches);

        return collect($matches[1] ?? [])
            ->map(fn (string $tag): string => mb_strtolower($tag))
            ->unique()
            ->values()
            ->all();
    }

    public function trendCacheKey(): string
    {
        return (string) config('chirp.trends.cache_key', 'chirp:trends');
    }

    private function wordPattern(string $word): string
    {
        return '/(?<![\pL\pN_])'.preg_quote($word, '/').'(?![\pL\pN_])/iu';
    }
}
