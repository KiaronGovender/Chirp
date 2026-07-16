import { Head } from '@inertiajs/react';
import axios from 'axios';
import { useCallback, useEffect, useRef, useState } from 'react';

import CreatePost from '@/components/CreatePost';
import TweetCard from '@/components/TweetCard';
import AppLayout from '@/layouts/AppLayout';

import type { CursorPaginated } from '@/types/pagination';
import type { tweet } from '@/types/tweet';

type Props = {
    tweets: CursorPaginated<tweet>;
};

export default function Feed({ tweets }: Props) {
    const [feed, setFeed] = useState(tweets.data);
    const [nextCursor, setNextCursor] = useState(tweets.next_cursor);
    const [hasMore, setHasMore] = useState(!!tweets.next_cursor);
    const [loading, setLoading] = useState(false);

    const observer = useRef<IntersectionObserver | null>(null);

    const loadMoreRef = useCallback(
        (node: HTMLDivElement | null) => {
            if (loading) return;

            if (observer.current) {
                observer.current.disconnect();
            }

            observer.current = new IntersectionObserver(async (entries) => {
                if (!entries[0].isIntersecting) return;

                if (!hasMore) return;

                setLoading(true);

                try {
                    const response = await axios.get('/tweets', {
                        params: {
                            cursor: nextCursor,
                        },
                    });

                    setFeed((previous) => [...previous, ...response.data.data]);

                    setNextCursor(response.data.next_cursor);

                    setHasMore(!!response.data.next_cursor);
                } catch (error) {
                    console.error(error);
                } finally {
                    setLoading(false);
                }
            });

            if (node) {
                observer.current.observe(node);
            }
        },
        [loading, hasMore, nextCursor],
    );

    useEffect(() => {
        return () => observer.current?.disconnect();
    }, []);

    useEffect(() => {
        setFeed(tweets.data);
    }, [tweets]);

    return (
        <AppLayout>
            <Head title="Home" />

            <div className="sticky top-0 z-10 border-b border-gray-100 bg-white/80 backdrop-blur-md">
                <div className="flex flex-col px-4 pt-3">
                    <h1 className="text-xl font-bold">Home</h1>

                    <div className="mt-2 flex w-full">
                        <div className="group relative flex flex-1 cursor-pointer justify-center pb-3 transition hover:bg-gray-100">
                            <span className="font-bold text-gray-900">
                                For you
                            </span>

                            <div className="absolute bottom-0 h-1 w-14 rounded-full bg-[#1d9bf0]" />
                        </div>

                        <div className="group relative flex flex-1 cursor-pointer justify-center pb-3 text-gray-500 transition hover:bg-gray-100">
                            <span className="font-medium group-hover:text-gray-900">
                                Following
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="border-b border-gray-100">
                <CreatePost />
            </div>

            <div className="pb-[80vh]">
                {feed.map((tweet) => (
                    <TweetCard key={tweet.id} tweet={tweet} />
                ))}

                {feed.length === 0 && (
                    <div className="p-8 text-center text-gray-500">
                        No tweets down here. Want to post something?
                    </div>
                )}

                {loading && (
                    <div className="flex justify-center py-8">
                        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-[#1d9bf0]" />
                    </div>
                )}

                {!loading && hasMore && (
                    <div ref={loadMoreRef} className="h-10" />
                )}

                {!hasMore && feed.length > 0 && (
                    <div className="py-8 text-center text-gray-500">
                        You've reached the end.
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
