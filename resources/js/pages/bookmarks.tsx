import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/AppLayout';
import TweetCard from '@/components/TweetCard';
import type { tweet } from '@/types/tweet';

export default function Bookmarks({ tweets }: { tweets: tweet[] }) {
    return (
        <AppLayout>
            <Head title="Bookmarks" />

            <div className="sticky top-0 z-10 border-b border-gray-100 bg-white/80 backdrop-blur-md">
                <div className="flex px-4 pt-3 flex-col pb-3">
                    <h1 className="text-xl font-bold">Bookmarks</h1>
                    <p className="text-sm text-gray-500">@{tweets[0]?.user?.username || 'user'}</p>
                </div>
            </div>

            <div className="pb-[80vh]">
                {tweets.length > 0 ? tweets.map((tweet) => (
                    <TweetCard key={tweet.id} tweet={tweet} />
                )) : (
                    <div className="mx-auto max-w-[400px] mt-8 text-center">
                        <h2 className="text-3xl font-extrabold text-gray-900">Save Tweets for later</h2>
                        <p className="mt-2 text-gray-500">Don’t let the good ones fly away! Bookmark Tweets to easily find them again in the future.</p>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
