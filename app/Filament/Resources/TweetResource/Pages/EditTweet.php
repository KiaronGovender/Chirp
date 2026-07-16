<?php

namespace App\Filament\Resources\TweetResource\Pages;

use App\Filament\Resources\TweetResource;
use Filament\Actions;
use Filament\Resources\Pages\EditRecord;

class EditTweet extends EditRecord
{
    protected static string $resource = TweetResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\DeleteAction::make(),
        ];
    }
}
