<?php

namespace App\Jobs;

use App\Services\ChirpService;
use Illuminate\Contracts\Queue\ShouldBeUnique;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Log;
use Throwable;

class UpdateTrends implements ShouldBeUnique, ShouldQueue
{
    use Queueable;

    public int $tries = 3;

    public int $timeout = 30;

    public int $uniqueFor = 300;

    /**
     * @var list<int>
     */
    public array $backoff = [5, 15, 30];

    public function handle(ChirpService $chirpService): void
    {
        $chirpService->refreshTrends();
    }

    public function uniqueId(): string
    {
        return 'chirp-trends';
    }

    public function failed(?Throwable $exception): void
    {
        Log::error('Failed to update trends.', [
            'error' => $exception?->getMessage(),
        ]);
    }
}
