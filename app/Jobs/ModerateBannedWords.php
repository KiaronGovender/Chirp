<?php

namespace App\Jobs;

use App\Services\ChirpService;
use Illuminate\Contracts\Queue\ShouldBeUnique;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Log;
use Throwable;

class ModerateBannedWords implements ShouldBeUnique, ShouldQueue
{
    use Queueable;

    public int $tries = 3;

    public int $timeout = 60;

    public int $uniqueFor = 3600;

    /**
     * @var list<int>
     */
    public array $backoff = [10, 30, 60];

    public function handle(ChirpService $chirpService): void
    {
        $deleted = $chirpService->pruneTweetsWithBannedWords();

        if ($deleted > 0) {
            UpdateTrends::dispatch();
        }
    }

    public function uniqueId(): string
    {
        return 'chirp-banned-words-moderation';
    }

    public function failed(?Throwable $exception): void
    {
        Log::error('Failed to moderate banned words.', [
            'error' => $exception?->getMessage(),
        ]);
    }
}
