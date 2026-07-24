<?php

namespace App\Http\Controllers;

use App\Models\Tweet;
use App\Models\User;
use App\Services\ChirpService;
use App\Services\TimelineService;
use Illuminate\Contracts\Pagination\CursorPaginator;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response as HttpResponse;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Inertia\Response;

class TweetsController extends Controller
{
    public function __construct(
        private ChirpService $chirpService,
        private TimelineService $timelineService,
    ) {}

    public function index(Request $request): Response
    {
        $user = $request->user();

        return Inertia::render('feed', [
            'tweets' => $this->getTweets($user instanceof User ? $user : null),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'body' => ['required', 'max:1000', 'string'],
            'parent_id' => ['nullable', 'integer', 'exists:tweets,id'],
        ]);

        $user = $request->user();

        abort_unless($user instanceof User, HttpResponse::HTTP_FORBIDDEN);

        $this->chirpService->createTweet($user, [
            'body' => (string) $validated['body'],
            'parent_id' => $validated['parent_id'] ?? null,
        ]);

        return Redirect::to('/');
    }

    public function show(Tweet $tweet, Request $request): Response
    {
        $user = $request->user();
        $user = $user instanceof User ? $user : null;

        $tweet->load(['user', 'replies.user']);
        $tweet->loadCount(['likes', 'retweets', 'replies']);

        $this->timelineService->withViewerState($tweet, $user);

        /** @var Collection<int, Tweet> $replies */
        $replies = $tweet->replies->map(function (Tweet $reply) use ($user): Tweet {
            $reply->loadCount(['likes', 'retweets', 'replies']);

            return $this->timelineService->withViewerState($reply, $user);
        });

        return Inertia::render('tweet/show', [
            'tweet' => $tweet,
            'replies' => $replies,
        ]);
    }

    public function destroy(Tweet $tweet, Request $request): RedirectResponse
    {
        $user = $request->user();

        if (! $user instanceof User || $user->id !== $tweet->user_id) {
            abort(403);
        }

        $tweet->delete();

        return Redirect::to('/');
    }

    public function getTweets(?User $user): CursorPaginator
    {
        return $this->timelineService->paginate($user);
    }

    public function loadMore(Request $request): JsonResponse
    {
        $user = $request->user();

        return response()->json($this->getTweets($user instanceof User ? $user : null));
    }
}
