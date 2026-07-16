<?php

namespace App\Http\Controllers;

use App\Models\Message;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class MessageController extends Controller
{
    public function index(Request $request)
    {
        $currentUser = $request->user();

        // Get active chat user if query param is set
        $activeUserId = $request->query('user');
        $activeUser = null;
        if ($activeUserId) {
            $activeUser = User::find($activeUserId);
        }

        // Get messages for the active conversation
        $activeConversationMessages = [];
        if ($activeUser) {
            $activeConversationMessages = Message::where(function ($query) use ($currentUser, $activeUser) {
                $query->where('sender_id', $currentUser->id)
                      ->where('receiver_id', $activeUser->id);
            })->orWhere(function ($query) use ($currentUser, $activeUser) {
                $query->where('sender_id', $activeUser->id)
                      ->where('receiver_id', $currentUser->id);
            })
            ->oldest()
            ->get();
        }

        // Get list of recent contacts (users we have sent or received messages to/from)
        // Group by user and find the latest message
        $recentMessages = Message::where('sender_id', $currentUser->id)
            ->orWhere('receiver_id', $currentUser->id)
            ->latest()
            ->get();

        $contactIds = [];
        foreach ($recentMessages as $msg) {
            $contactId = $msg->sender_id === $currentUser->id ? $msg->receiver_id : $msg->sender_id;
            if (!in_array($contactId, $contactIds)) {
                $contactIds[] = $contactId;
            }
        }

        // Get contacts users
        $conversations = User::whereIn('id', $contactIds)
            ->get()
            ->map(function ($user) use ($currentUser) {
                // Find latest message for this contact
                $latest = Message::where(function ($q) use ($currentUser, $user) {
                    $q->where('sender_id', $currentUser->id)->where('receiver_id', $user->id);
                })->orWhere(function ($q) use ($currentUser, $user) {
                    $q->where('sender_id', $user->id)->where('receiver_id', $currentUser->id);
                })->latest()->first();

                $user->latest_message = $latest ? $latest->body : '';
                $user->latest_message_time = $latest ? $latest->created_at->toISOString() : null;
                return $user;
            })
            ->sortByDesc('latest_message_time')
            ->values();

        // Get other users we can start a new message with (excluding self and current contacts)
        $otherUsers = User::where('id', '!=', $currentUser->id)
            ->whereNotIn('id', $contactIds)
            ->limit(10)
            ->get();

        return Inertia::render('messages', [
            'conversations' => $conversations,
            'activeUser' => $activeUser,
            'activeConversationMessages' => $activeConversationMessages,
            'otherUsers' => $otherUsers,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'receiver_id' => ['required', 'exists:users,id'],
            'body' => ['required', 'string', 'max:2000'],
        ]);

        $message = Message::create([
            'sender_id' => $request->user()->id,
            'receiver_id' => $validated['receiver_id'],
            'body' => $validated['body'],
        ]);

        return redirect()->route('messages.index', ['user' => $validated['receiver_id']]);
    }
}
