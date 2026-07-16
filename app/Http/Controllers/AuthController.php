<?php

namespace App\Http\Controllers;

use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;

class AuthController extends Controller
{
    public function showLogin()
    {
        return Inertia::render('auth/login');
    }

    public function login(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'identifier' => ['required', 'string'],
            'password' => ['required', 'string'],
            'remember' => ['sometimes', 'boolean'],
        ]);

        $identifier = $data['identifier'];
        $remember = isset($data['remember']) ? (bool) $data['remember'] : false;

        $credentials = ['email' => $identifier, 'password' => $data['password']];

        // Try by email first, then by username
        if (! Auth::attempt($credentials, $remember)) {
            $credentials = ['username' => ltrim($identifier, '@'), 'password' => $data['password']];
            if (! Auth::attempt($credentials, $remember)) {
                return Redirect::back()->withErrors(['identifier' => 'These credentials do not match our records.']);
            }
        }

        $request->session()->regenerate();

        return Redirect::intended('/');
    }

    public function logout(Request $request): RedirectResponse
    {
        Auth::logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return Redirect::route('home');
    }
}
