<?php

namespace App\Models;

use Database\Factories\TweetFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Tweet extends Model
{
    /** @use HasFactory<TweetFactory> */
    use HasFactory;

    protected $fillable = ['body', 'user_id', 'parent_id'];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function parent(): BelongsTo
    {
        return $this->belongsTo(Tweet::class, 'parent_id');
    }

    public function replies(): HasMany
    {
        return $this->hasMany(Tweet::class, 'parent_id');
    }

    public function likes(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'likes')->withTimestamps();
    }

    public function bookmarks(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'bookmarks')->withTimestamps();
    }

    public function retweets(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'retweets')->withTimestamps();
    }

    public function isLikedBy(?User $user): bool
    {
        if (! $user) {
            return false;
        }

        return $this->likes()->where('user_id', $user->id)->exists();
    }

    public function isRetweetedBy(?User $user): bool
    {
        if (! $user) {
            return false;
        }

        return $this->retweets()->where('user_id', $user->id)->exists();
    }

    public function isBookmarkedBy(?User $user): bool
    {
        if (! $user) {
            return false;
        }

        return $this->bookmarks()->where('user_id', $user->id)->exists();
    }
}
