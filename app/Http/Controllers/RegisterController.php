<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;

class RegisterController extends Controller
{
    public function show()
    {
        return Inertia::render('auth/register');
    }

    public function register(Request $request): RedirectResponse
    {
        $username = ltrim((string) $request->input('username', ''), '@');
        $request->merge(['username' => $username]);

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users,email'],
            'username' => ['required', 'string', 'max:50', 'alpha_dash', 'unique:users,username'],
            'password' => ['required', 'string', 'min:8', 'regex:/[A-Z]/', 'regex:/[0-9]/'],
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'username' => $username,
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
        ]);

        Auth::login($user);
        // Send email verification notification if available
        try {
            $user->sendEmailVerificationNotification();
        } catch (\Throwable $e) {
            // ignore if mail not configured
        }

        $request->session()->regenerate();

        return Redirect::route('home');
    }

    public function checkUsername(Request $request)
    {
        $username = ltrim((string) $request->query('username', ''), '@');
        $available = ! User::where('username', $username)->exists();

        return response()->json(['available' => $available, 'username' => $username]);
    }
}
