<?php

namespace App\Http\Controllers;

use Inertia\Inertia;

class NotificationsController extends Controller
{
    public function index()
    {
        return Inertia::render('notifications');
    }
}
