<?php

use App\Jobs\ModerateBannedWords;
use App\Jobs\UpdateTrends;
use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

Schedule::job(new ModerateBannedWords)
    ->hourly()
    ->name('chirp.moderate-banned-words')
    ->withoutOverlapping()
    ->onOneServer();

Schedule::job(new UpdateTrends)
    ->everyFifteenMinutes()
    ->name('chirp.update-trends')
    ->withoutOverlapping()
    ->onOneServer();
