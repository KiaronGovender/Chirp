<?php

namespace App\Http\Controllers;

use App\Models\tweets;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TweetsController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $tweets = tweets::with('user')->latest()->get();


        return Inertia::render('feed',[
            'tweets' => $tweets
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'body' => ['required','max:1000','string']
        ]);

        $validated['user_id'] = 1;

        tweets::create($validated);

        return redirect('/');
    }

    /**
     * Display the specified resource.
     */
    public function show(tweets $tweets)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(tweets $tweets)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, tweets $tweets)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(tweets $tweets)
    {
        //
    }
}
