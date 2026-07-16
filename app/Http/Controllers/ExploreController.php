<?php

namespace App\Http\Controllers;

use App\Models\Tweet;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ExploreController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->query('query');

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
            // Trending or popular fallback
            // In a real app we'd load trending but here we just get latest tweets for explore
            $tweets = Tweet::with('user')->inRandomOrder()->limit(15)->get();
            $users = User::inRandomOrder()->limit(5)->get();
        }

        return Inertia::render('explore', [
            'users' => $users,
            'tweets' => $tweets,
            'searchQuery' => $search,
        ]);
    }
}
