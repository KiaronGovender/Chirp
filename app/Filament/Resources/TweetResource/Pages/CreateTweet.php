<?php

namespace App\Filament\Resources\TweetResource\Pages;

use App\Filament\Resources\TweetResource;
use Filament\Resources\Pages\CreateRecord;

class CreateTweet extends CreateRecord
{
    protected static string $resource = TweetResource::class;
}
