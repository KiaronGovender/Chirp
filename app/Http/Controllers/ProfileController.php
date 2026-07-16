<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;

class ProfileController extends Controller
{
    public function show(string $username)
    {
        $authUser = auth()->user();

        $user = User::where('username', $username)
            ->withCount(['followers', 'following', 'tweets'])
            ->firstOrFail();

        $tweets = $user->tweets()
            ->with('user')
            ->withCount(['likes', 'retweets', 'replies'])
            ->latest()
            ->get()
            ->map(function ($tweet) use ($authUser) {
                $tweet->is_liked = $tweet->isLikedBy($authUser);
                $tweet->is_retweeted = $tweet->isRetweetedBy($authUser);
                $tweet->is_bookmarked = $tweet->isBookmarkedBy($authUser);

                return $tweet;
            });

        return Inertia::render('profile', [
            'profileUser' => $user,
            'tweets' => $tweets,
            'isFollowing' => auth()->check() ? auth()->user()->isFollowing($user) : false,
        ]);
    }

    public function update(Request $request)
    {
        $user = $request->user();

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'bio' => 'nullable|string|max:160',
        ]);

        // File uploads for avatar, banner, etc. can be handled here

        $user->update($validated);

        return Redirect::back();
    }
}
