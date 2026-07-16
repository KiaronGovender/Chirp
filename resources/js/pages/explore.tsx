import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/AppLayout';
import TweetCard from '@/components/TweetCard';
import type { tweet } from '@/types/tweet';
import type { User } from '@/types/auth';

export default function Explore({ users, tweets, searchQuery }: { users: User[]; tweets: tweet[]; searchQuery?: string }) {
    const { data, setData, get } = useForm({
        query: searchQuery || '',
    });

    function submit(e: React.FormEvent) {
        e.preventDefault();
        get('/explore');
    }

    return (
        <AppLayout>
            <Head title="Explore" />

            <div className="sticky top-0 z-10 border-b border-gray-100 bg-white/80 backdrop-blur-md px-4 py-2">
                <form onSubmit={submit} className="relative group">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                        <svg className="h-5 w-5 text-gray-500 group-focus-within:text-[#1d9bf0]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                    </div>
                    <input
                        type="text"
                        value={data.query}
                        onChange={e => setData('query', e.target.value)}
                        className="block w-full rounded-full border-none bg-gray-100 py-3 pl-12 pr-4 text-sm text-gray-900 focus:bg-white focus:ring-1 focus:ring-[#1d9bf0]"
                        placeholder="Search users or tweets"
                    />
                </form>
            </div>

            <div className="pb-[80vh]">
                {users.length > 0 && (
                    <div className="border-b border-gray-100">
                        <h2 className="px-4 py-3 text-xl font-extrabold text-gray-900 border-b border-gray-100">People</h2>
                        {users.map(user => (
                            <Link href={`/${user.username}`} key={user.id} className="flex px-4 py-3 hover:bg-gray-50 transition border-b border-gray-100 last:border-b-0">
                                <img src={user.avatar || `https://ui-avatars.com/api/?name=${user.name}&background=random`} alt={user.name} className="h-10 w-10 rounded-full mr-3" />
                                <div className="flex-1">
                                    <p className="font-bold text-gray-900">{user.name}</p>
                                    <p className="text-gray-500">@{user.username}</p>
                                    <p className="mt-1 text-sm text-gray-900">{user.bio}</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}

                <div className="mt-2">
                    <h2 className="px-4 py-3 text-xl font-extrabold text-gray-900 border-b border-gray-100">Tweets</h2>
                    {tweets.map((tweet) => (
                        <TweetCard key={tweet.id} tweet={tweet} />
                    ))}

                    {tweets.length === 0 && (
                        <div className="p-8 text-center text-gray-500">
                            No matching tweets found.
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
