<?php

namespace App\Http\Controllers;

use App\Models\Tweet;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;

class RetweetController extends Controller
{
    public function toggle(Tweet $tweet, Request $request)
    {
        $user = $request->user();

        if ($tweet->isRetweetedBy($user)) {
            $user->retweets()->detach($tweet->id);
        } else {
            $user->retweets()->attach($tweet->id);
        }

        return Redirect::back();
    }
}
