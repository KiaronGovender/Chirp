import React, { useState, useRef, useEffect } from 'react';
import { Head, Link, useForm, router } from '@inertiajs/react';
import AppLayout from '@/layouts/AppLayout';
import type { User } from '@/types/auth';

interface Message {
    id: number;
    sender_id: number;
    receiver_id: number;
    body: string;
    created_at: string;
}

interface MessagesProps {
    conversations: User[];
    activeUser: User | null;
    activeConversationMessages: Message[];
    otherUsers: User[];
}

export default function Messages({ conversations, activeUser, activeConversationMessages, otherUsers }: MessagesProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [showNewChatDropdown, setShowNewChatDropdown] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const { data, setData, post, processing, reset } = useForm({
        receiver_id: activeUser ? activeUser.id : '',
        body: '',
    });

    // Keep receiver_id in sync when activeUser changes
    useEffect(() => {
        if (activeUser) {
            setData('receiver_id', activeUser.id);
        }
    }, [activeUser]);

    // Scroll to bottom of messages
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [activeConversationMessages]);

    function selectConversation(userId: number) {
        router.get(`/messages?user=${userId}`);
    }

    function submitMessage(e: React.FormEvent) {
        e.preventDefault();
        if (!data.body.trim()) return;

        post('/messages', {
            onSuccess: () => {
                reset('body');
            },
        });
    }

    // Filter conversations based on search query
    const filteredConversations = conversations.filter(c => 
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.username.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Filter other users based on search query for starting a new chat
    const filteredOtherUsers = otherUsers.filter(u =>
        u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.username.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <AppLayout>
            <Head title="Messages" />

            <div className="flex h-[calc(100vh-2px)] w-full border-r border-gray-100">
                {/* Left panel: Conversations List */}
                <div className="flex w-2/5 flex-col border-r border-gray-100 h-full">
                    <div className="sticky top-0 z-10 bg-white/80 p-4 backdrop-blur-md">
                        <div className="flex items-center justify-between mb-4">
                            <h1 className="text-xl font-bold">Messages</h1>
                            <div className="relative">
                                <button 
                                    onClick={() => setShowNewChatDropdown(!showNewChatDropdown)}
                                    className="rounded-full p-2 transition hover:bg-gray-100"
                                    title="New Message"
                                >
                                    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 fill-current text-gray-700">
                                        <path d="M1.998 5.5C1.998 4.119 3.117 3 4.498 3h15c1.381 0 2.5 1.119 2.5 2.5v13c0 1.381-1.119 2.5-2.5 2.5h-15c-1.381 0-2.5-1.119-2.5-2.5v-13zm2 0v1.25l8 4.31 8-4.31V5.5a.5.5 0 00-.5-.5h-15a.5.5 0 00-.5.5zm16 3.574l-7.504 4.04a1 1 0 01-.992 0L3.998 9.074V18.5a.5.5 0 00.5.5h15a.5.5 0 00.5-.5V9.074z"></path>
                                    </svg>
                                </button>
                                
                                {showNewChatDropdown && (
                                    <div className="absolute right-0 mt-2 w-64 rounded-xl bg-white shadow-xl border border-gray-100 z-20 py-2">
                                        <div className="px-4 py-2 text-xs font-bold text-gray-500 uppercase border-b border-gray-50">
                                            Start new chat
                                        </div>
                                        <div className="max-h-60 overflow-y-auto">
                                            {filteredOtherUsers.length > 0 ? (
                                                filteredOtherUsers.map(user => (
                                                    <button
                                                        key={user.id}
                                                        onClick={() => {
                                                            selectConversation(user.id);
                                                            setShowNewChatDropdown(false);
                                                        }}
                                                        className="flex items-center w-full px-4 py-2 hover:bg-gray-50 transition text-left"
                                                    >
                                                        <img src={user.avatar || `https://ui-avatars.com/api/?name=${user.name}&background=random`} alt={user.name} className="h-8 w-8 rounded-full mr-3" />
                                                        <div>
                                                            <p className="text-sm font-bold text-gray-900 leading-tight">{user.name}</p>
                                                            <p className="text-xs text-gray-500">@{user.username}</p>
                                                        </div>
                                                    </button>
                                                ))
                                            ) : (
                                                <div className="px-4 py-3 text-sm text-gray-500 text-center">
                                                    No other users found.
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Search */}
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                <svg className="h-4 w-4 text-gray-400 group-focus-within:text-[#1d9bf0]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                            </div>
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="block w-full rounded-full border border-gray-100 bg-gray-50 py-2 pl-9 pr-4 text-sm text-gray-900 focus:bg-white focus:ring-1 focus:ring-[#1d9bf0] focus:border-[#1d9bf0]"
                                placeholder="Search Direct Messages"
                            />
                        </div>
                    </div>

                    {/* Conversations Scroll List */}
                    <div className="flex-1 overflow-y-auto pb-20">
                        {filteredConversations.length > 0 ? (
                            filteredConversations.map((user) => {
                                const isActive = activeUser?.id === user.id;
                                return (
                                    <div
                                        key={user.id}
                                        onClick={() => selectConversation(user.id)}
                                        className={`flex items-center px-4 py-3 cursor-pointer border-b border-gray-50 transition hover:bg-gray-50 ${isActive ? 'bg-gray-50 border-r-2 border-[#1d9bf0]' : ''}`}
                                    >
                                        <img
                                            src={user.avatar || `https://ui-avatars.com/api/?name=${user.name}&background=random`}
                                            alt={user.name}
                                            className="h-11 w-11 rounded-full mr-3 flex-shrink-0"
                                        />
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-baseline">
                                                <p className="font-bold text-gray-900 truncate mr-1">{user.name}</p>
                                                {user.latest_message_time && (
                                                    <span className="text-xs text-gray-400 flex-shrink-0">
                                                        {new Date(user.latest_message_time).toLocaleDateString([], {month: 'short', day: 'numeric'})}
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-sm text-gray-500 truncate">@{user.username}</p>
                                            <p className="text-sm text-gray-600 truncate mt-0.5">{user.latest_message}</p>
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <div className="p-8 text-center text-gray-500 text-sm">
                                No chats yet. Start one by clicking the message icon above.
                            </div>
                        )}
                    </div>
                </div>

                {/* Right panel: Chat Area */}
                <div className="flex w-3/5 flex-col h-full bg-white">
                    {activeUser ? (
                        <>
                            {/* Chat Header */}
                            <div className="flex items-center border-b border-gray-100 px-4 py-3 bg-white/80 backdrop-blur-md sticky top-0">
                                <img
                                    src={activeUser.avatar || `https://ui-avatars.com/api/?name=${activeUser.name}&background=random`}
                                    alt={activeUser.name}
                                    className="h-10 w-10 rounded-full mr-3"
                                />
                                <div>
                                    <Link href={`/${activeUser.username}`} className="font-bold text-gray-900 hover:underline block leading-tight">
                                        {activeUser.name}
                                    </Link>
                                    <p className="text-xs text-gray-500">@{activeUser.username}</p>
                                </div>
                            </div>

                            {/* Messages Scroll Area */}
                            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
                                {activeConversationMessages.map((msg) => {
                                    const isSentByMe = msg.sender_id !== activeUser.id;
                                    return (
                                        <div
                                            key={msg.id}
                                            className={`flex w-full ${isSentByMe ? 'justify-end' : 'justify-start'}`}
                                        >
                                            <div
                                                className={`max-w-[70%] rounded-2xl px-4 py-2.5 text-[15px] leading-relaxed shadow-sm ${
                                                    isSentByMe
                                                        ? 'bg-[#1d9bf0] text-white rounded-br-none'
                                                        : 'bg-white text-gray-900 border border-gray-100 rounded-bl-none'
                                                }`}
                                            >
                                                <p className="break-words whitespace-pre-wrap">{msg.body}</p>
                                                <span
                                                    className={`block text-[10px] mt-1 text-right ${
                                                        isSentByMe ? 'text-white/70' : 'text-gray-400'
                                                    }`}
                                                >
                                                    {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            </div>
                                        </div>
                                    );
                                })}
                                <div ref={messagesEndRef} />
                            </div>

                            {/* Message input box */}
                            <form onSubmit={submitMessage} className="border-t border-gray-100 p-3 bg-white flex items-center gap-2">
                                <input
                                    type="text"
                                    value={data.body}
                                    onChange={(e) => setData('body', e.target.value)}
                                    placeholder="Start a new message"
                                    className="flex-1 border-none bg-gray-100 rounded-full px-4 py-2.5 text-sm focus:bg-white focus:ring-1 focus:ring-[#1d9bf0] outline-none"
                                />
                                <button
                                    type="submit"
                                    disabled={processing || !data.body.trim()}
                                    className="rounded-full bg-[#1d9bf0] p-2.5 text-white transition hover:bg-[#1a8cd8] disabled:opacity-40"
                                >
                                    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 fill-current">
                                        <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"></path>
                                    </svg>
                                </button>
                            </form>
                        </>
                    ) : (
                        <div className="flex flex-col items-center justify-center flex-1 p-8 text-center bg-slate-50/20">
                            <h2 className="text-2xl font-extrabold text-gray-900">Select a message</h2>
                            <p className="mt-2 text-sm text-gray-500 max-w-sm">
                                Choose from your existing conversations, start a new one, or just keep swimming.
                            </p>
                            <button
                                onClick={() => setShowNewChatDropdown(true)}
                                className="mt-4 rounded-full bg-[#1d9bf0] px-5 py-2.5 font-bold text-white transition hover:bg-[#1a8cd8]"
                            >
                                New message
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
