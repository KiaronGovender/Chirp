<?php

namespace App\Http\Controllers;

use App\Models\Tweet;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;

class LikeController extends Controller
{
    public function toggle(Tweet $tweet, Request $request)
    {
        $user = $request->user();

        if ($tweet->isLikedBy($user)) {
            $user->likes()->detach($tweet->id);
        } else {
            $user->likes()->attach($tweet->id);
        }

        return Redirect::back();
    }
}
