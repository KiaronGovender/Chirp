<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;

class FollowController extends Controller
{
    public function toggle(User $user, Request $request)
    {
        $currentUser = $request->user();

        if ($currentUser->id === $user->id) {
            return Redirect::back()->withErrors(['message' => 'Cannot follow yourself.']);
        }

        if ($currentUser->isFollowing($user)) {
            $currentUser->following()->detach($user->id);
        } else {
            $currentUser->following()->attach($user->id);
        }

        return Redirect::back();
    }
}
