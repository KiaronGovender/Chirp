<?php

namespace App\Http\Controllers;

use App\Models\Tweet;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;

class BookmarkController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        $tweets = $user->bookmarks()
            ->with('user')
            ->withCount(['likes', 'retweets', 'replies'])
            ->latest('bookmarks.created_at')
            ->get()
            ->map(function ($tweet) use ($user) {
                $tweet->is_liked = $tweet->isLikedBy($user);
                $tweet->is_retweeted = $tweet->isRetweetedBy($user);
                $tweet->is_bookmarked = true;

                return $tweet;
            });

        return Inertia::render('bookmarks', [
            'tweets' => $tweets,
        ]);
    }

    public function toggle(Tweet $tweet, Request $request)
    {
        $user = $request->user();

        if ($tweet->isBookmarkedBy($user)) {
            $user->bookmarks()->detach($tweet->id);
        } else {
            $user->bookmarks()->attach($tweet->id);
        }

        return Redirect::back();
    }
}
