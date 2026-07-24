<?php

namespace App\Jobs;

use App\Models\Tweet;
use App\Services\TimelineService;
use Illuminate\Contracts\Queue\ShouldBeUniqueUntilProcessing;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Log;
use Throwable;

class FanOutPost implements ShouldBeUniqueUntilProcessing, ShouldQueue
{
    use Queueable;

    public int $tries = 3;

    public int $timeout = 30;

    public int $uniqueFor = 300;

    /**
     * @var list<int>
     */
    public array $backoff = [1, 5, 10];

    public function __construct(public Tweet $tweet) {}

    public function handle(TimelineService $timelineService): void
    {
        $timelineService->fanOut($this->tweet);
    }

    public function uniqueId(): string
    {
        return (string) $this->tweet->getKey();
    }

    public function failed(?Throwable $exception): void
    {
        Log::error('Failed to fan out post.', [
            'tweet_id' => $this->tweet->getKey(),
            'error' => $exception?->getMessage(),
        ]);
    }
}
