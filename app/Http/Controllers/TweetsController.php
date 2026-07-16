<?php

namespace App\Http\Controllers;

use App\Models\Tweet;
use App\Models\User;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TweetsController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $user = auth()->user();

        $tweets = $this->getTweets($user);

        return Inertia::render('feed', [
            'tweets' => $tweets,
        ]);
}

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'body' => ['required', 'max:1000', 'string'],
            'parent_id' => ['nullable', 'integer', 'exists:tweets,id'],
        ]);

        $validated['user_id'] = auth()->id();

        Tweet::create($validated);

        return redirect('/');
    }

    /**
     * Display the specified resource.
     */
    public function show(Tweet $tweet)
    {
        $user = auth()->user();

        $tweet->load(['user', 'replies.user']);
        $tweet->loadCount(['likes', 'retweets', 'replies']);

        $tweet->is_liked = $tweet->isLikedBy($user);
        $tweet->is_retweeted = $tweet->isRetweetedBy($user);
        $tweet->is_bookmarked = $tweet->isBookmarkedBy($user);

        /** @var Collection<int, Tweet> $replies */
        $replies = $tweet->replies->map(function (Tweet $reply) use ($user) {
            $reply->loadCount(['likes', 'retweets', 'replies']);
            $reply->is_liked = $reply->isLikedBy($user);
            $reply->is_retweeted = $reply->isRetweetedBy($user);
            $reply->is_bookmarked = $reply->isBookmarkedBy($user);

            return $reply;
        });

        return Inertia::render('tweet/show', [
            'tweet' => $tweet,
            'replies' => $replies,
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Tweet $tweet, Request $request)
    {
        if ($request->user()->id !== $tweet->user_id) {
            abort(403);
        }

        $tweet->delete();

        return redirect('/');
    }

    public function getTweets(User $user){
            return Tweet::with([
            'user',
            'parent.user'
        ])
        ->withCount([
            'likes',
            'retweets',
            'replies'
        ])
        ->latest()
        ->cursorPaginate(15)
        ->through(function (Tweet $tweet) use ($user) {

            $tweet->is_liked =
                $tweet->isLikedBy($user);

            $tweet->is_retweeted =
                $tweet->isRetweetedBy($user);

            $tweet->is_bookmarked =
                $tweet->isBookmarkedBy($user);

            return $tweet;
        });
    }

    public function loadMore(){
        $user = auth()->user();

        return response()->json(
            $this->getTweets($user)
        );
    }
}
