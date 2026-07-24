<?php

namespace App\Http\Controllers;

use App\Models\Tweet;
use App\Models\User;
use App\Services\ChirpService;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ExploreController extends Controller
{
    public function __construct(private ChirpService $chirpService) {}

    public function index(Request $request): Response
    {
        $search = $request->query('query');
        $search = is_string($search) ? trim($search) : null;
        $trends = $this->chirpService->trends();

        $users = [];
        $tweets = [];

        if ($search) {
            $users = User::where('name', 'like', "%{$search}%")
                ->orWhere('username', 'like', "%{$search}%")
                ->limit(5)
                ->get();

            $tweets = Tweet::where('body', 'like', "%{$search}%")
                ->with('user')
                ->latest()
                ->get();
        } else {
            $tweets = $this->trendingTweets($trends);
            $users = User::inRandomOrder()->limit(5)->get();
        }

        return Inertia::render('explore', [
            'users' => $users,
            'tweets' => $tweets,
            'searchQuery' => $search,
            'trends' => $trends,
        ]);
    }

    /**
     * @param  list<array{tag: string, label: string, tweets_count: int}>  $trends
     * @return Collection<int, Tweet>
     */
    private function trendingTweets(array $trends): Collection
    {
        $tags = collect($trends)->pluck('tag')->filter()->values();

        if ($tags->isEmpty()) {
            return Tweet::with('user')->latest()->limit(15)->get();
        }

        $tweets = Tweet::query()
            ->with('user')
            ->where(function (Builder $query) use ($tags): void {
                foreach ($tags as $tag) {
                    $query->orWhere('body', 'like', '%#'.$tag.'%');
                }
            })
            ->latest()
            ->limit(15)
            ->get();

        return $tweets->isNotEmpty()
            ? $tweets
            : Tweet::with('user')->latest()->limit(15)->get();
    }
}
