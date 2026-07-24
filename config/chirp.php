<?php

return [
    'banned_words' => array_values(array_filter(array_map(
        static fn (string $word): string => mb_strtolower(trim($word)),
        explode(',', (string) env('CHIRP_BANNED_WORDS', '')),
    ))),

    'trends' => [
        'cache_key' => env('CHIRP_TRENDS_CACHE_KEY', 'chirp:trends'),
        'limit' => (int) env('CHIRP_TRENDS_LIMIT', 10),
        'window_hours' => (int) env('CHIRP_TRENDS_WINDOW_HOURS', 24),
    ],

    'timeline' => [
        'cache_prefix' => env('CHIRP_TIMELINE_CACHE_PREFIX', 'chirp:timeline:'),
        'cache_limit' => (int) env('CHIRP_TIMELINE_CACHE_LIMIT', 100),
    ],
];
