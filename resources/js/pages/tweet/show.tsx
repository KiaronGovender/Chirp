import React from 'react';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/AppLayout';
import TweetCard from '@/components/TweetCard';
import type { tweet } from '@/types/tweet';
import type { Auth } from '@/types/auth';

export default function TweetShow({ tweet, replies }: { tweet: tweet; replies: tweet[] }) {
    const { data, setData, post, processing, reset } = useForm({
        body: '',
        parent_id: tweet.id,
    });

    const { auth } = usePage<{ auth: Auth }>().props;
    const { post: postLike } = useForm();
    const { post: postRetweet } = useForm();
    const { post: postBookmark } = useForm();

    function submitReply(e: React.FormEvent) {
        e.preventDefault();
        post('/tweets', {
            onSuccess: () => reset('body'),
        });
    }

    function toggleLike() {
        if (!auth?.user) return;
        postLike(`/tweets/${tweet.id}/like`, { preserveScroll: true });
    }

    function toggleRetweet() {
        if (!auth?.user) return;
        postRetweet(`/tweets/${tweet.id}/retweet`, { preserveScroll: true });
    }

    function toggleBookmark() {
        if (!auth?.user) return;
        postBookmark(`/tweets/${tweet.id}/bookmark`, { preserveScroll: true });
    }

    return (
        <AppLayout>
            <Head title={`${tweet.user.name} on Chirp`} />

            <div className="sticky top-0 z-10 flex items-center gap-6 border-b border-gray-100 bg-white/80 px-4 py-2 backdrop-blur-md">
                <Link href="/" className="rounded-full p-2 hover:bg-gray-200 transition relative -left-2">
                    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5"><path d="M7.414 13l5.043 5.04-1.414 1.42L3.586 12l7.457-7.46 1.414 1.42L7.414 11H21v2H7.414z"></path></svg>
                </Link>
                <h1 className="text-xl font-bold">Post</h1>
            </div>

            {/* Main Tweet View */}
            <div className="px-4 pt-3 pb-4 border-b border-gray-100">
                <div className="flex items-center">
                    <Link href={`/${tweet.user.username}`} className="mr-3">
                        <img src={tweet.user.avatar || `https://ui-avatars.com/api/?name=${tweet.user.name}&background=random`} alt={tweet.user.name} className="h-10 w-10 rounded-full hover:opacity-90 transition" />
                    </Link>
                    <div className="flex flex-col">
                        <Link href={`/${tweet.user.username}`} className="font-bold text-gray-900 hover:underline">{tweet.user.name}</Link>
                        <Link href={`/${tweet.user.username}`} className="text-gray-500">@{tweet.user.username}</Link>
                    </div>
                </div>

                <div className="mt-3 text-xl text-gray-900 whitespace-pre-wrap word-break">
                    {tweet.body}
                </div>

                <div className="mt-4 flex items-center gap-1 text-[15px] text-gray-500 pb-4 border-b border-gray-100">
                    <span className="hover:underline cursor-pointer">{new Date(tweet.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    <span>·</span>
                    <span className="hover:underline cursor-pointer">{new Date(tweet.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                </div>

                <div className="flex py-3 border-b border-gray-100 gap-5 text-[15px]">
                    <span className="text-gray-500 hover:underline cursor-pointer"><span className="font-bold text-gray-900">{tweet.retweets_count ?? 0}</span> Retweets</span>
                    <span className="text-gray-500 hover:underline cursor-pointer"><span className="font-bold text-gray-900">{tweet.replies_count ?? 0}</span> Replies</span>
                    <span className="text-gray-500 hover:underline cursor-pointer"><span className="font-bold text-gray-900">{tweet.likes_count ?? 0}</span> Likes</span>
                </div>

                <div className="flex justify-around py-1 border-b border-gray-100">
                    {/* Reply - scroll to reply form */}
                    <button className="group flex items-center text-gray-500 hover:text-[#1d9bf0] transition">
                        <div className="rounded-full p-2 group-hover:bg-[#1d9bf0]/10">
                            <svg viewBox="0 0 24 24" aria-hidden="true" className="h-6 w-6 fill-current"><path d="M1.751 10c0-4.42 3.584-8 8.005-8h4.366c4.49 0 8.129 3.64 8.129 8.13 0 2.96-1.607 5.68-4.196 7.11l-8.054 4.46v-3.69h-.067c-4.49.1-8.183-3.51-8.183-8.01zm8.005-6c-3.317 0-6.005 2.69-6.005 6 0 3.37 2.77 6.08 6.138 6.01l.351-.01h1.761v2.3l5.087-2.81c1.951-1.08 3.163-3.13 3.163-5.36 0-3.39-2.744-6.13-6.129-6.13H9.756z"></path></svg>
                        </div>
                    </button>
                    {/* Retweet Button */}
                    <button onClick={toggleRetweet} className={`group flex items-center transition ${tweet.is_retweeted ? 'text-[#00ba7c]' : 'text-gray-500 hover:text-[#00ba7c]'}`}>
                        <div className="rounded-full p-2 group-hover:bg-[#00ba7c]/10">
                            <svg viewBox="0 0 24 24" aria-hidden="true" className="h-6 w-6 fill-current"><path d="M4.5 3.88l4.432 4.14-1.364 1.46L5.5 7.55V16c0 1.1.896 2 2 2H13v2H7.5c-2.209 0-4-1.79-4-4V7.55L1.432 9.48.068 8.02 4.5 3.88zM16.5 6H11V4h5.5c2.209 0 4 1.79 4 4v8.45l2.068-1.93 1.364 1.46-4.432 4.14-4.432-4.14 1.364-1.46 2.068 1.93V8c0-1.1-.896-2-2-2z"></path></svg>
                        </div>
                    </button>
                    {/* Like Button */}
                    <button onClick={toggleLike} className={`group flex items-center transition ${tweet.is_liked ? 'text-[#f91880]' : 'text-gray-500 hover:text-[#f91880]'}`}>
                        <div className="rounded-full p-2 group-hover:bg-[#f91880]/10">
                            {tweet.is_liked ? (
                                <svg viewBox="0 0 24 24" aria-hidden="true" className="h-6 w-6 fill-current"><path d="M20.884 13.19c-1.351 2.48-4.001 5.12-8.379 7.67l-.503.3-.504-.3c-4.379-2.55-7.029-5.19-8.382-7.67-1.36-2.5-1.41-4.86-.514-6.67.887-1.79 2.647-2.91 4.601-3.01 1.651-.09 3.368.56 4.798 2.01 1.429-1.45 3.146-2.1 4.796-2.01 1.954.1 3.714 1.22 4.601 3.01.896 1.81.846 4.17-.514 6.67z"></path></svg>
                            ) : (
                                <svg viewBox="0 0 24 24" aria-hidden="true" className="h-6 w-6 fill-current"><path d="M16.697 5.5c-1.222-.06-2.679.51-3.89 2.16l-.805 1.09-.806-1.09C9.984 6.01 8.526 5.44 7.304 5.5c-1.243.07-2.349.78-2.91 1.91-.552 1.12-.633 2.78.479 4.82 1.074 1.97 3.257 4.27 7.129 6.61 3.87-2.34 6.052-4.64 7.126-6.61 1.111-2.04 1.03-3.7.477-4.82-.561-1.13-1.666-1.84-2.908-1.91zm4.187 7.69c-1.351 2.48-4.001 5.12-8.379 7.67l-.503.3-.504-.3c-4.379-2.55-7.029-5.19-8.382-7.67-1.36-2.5-1.41-4.86-.514-6.67.887-1.79 2.647-2.91 4.601-3.01 1.651-.09 3.368.56 4.798 2.01 1.429-1.45 3.146-2.1 4.796-2.01 1.954.1 3.714 1.22 4.601 3.01.896 1.81.846 4.17-.514 6.67z"></path></svg>
                            )}
                        </div>
                    </button>
                    {/* Bookmark */}
                    <button onClick={toggleBookmark} className={`group flex items-center transition ${tweet.is_bookmarked ? 'text-[#1d9bf0]' : 'text-gray-500 hover:text-[#1d9bf0]'}`}>
                        <div className="rounded-full p-2 group-hover:bg-[#1d9bf0]/10">
                            {tweet.is_bookmarked ? (
                                <svg viewBox="0 0 24 24" aria-hidden="true" className="h-6 w-6 fill-current"><path d="M4 4.5C4 3.12 5.119 2 6.5 2h11C18.881 2 20 3.12 20 4.5v18.44l-8-5.71-8 5.71V4.5z"></path></svg>
                            ) : (
                                <svg viewBox="0 0 24 24" aria-hidden="true" className="h-6 w-6 fill-current"><path d="M4 4.5C4 3.12 5.119 2 6.5 2h11C18.881 2 20 3.12 20 4.5v18.44l-8-5.71-8 5.71V4.5zM6.5 4c-.276 0-.5.22-.5.5v14.56l6-4.29 6 4.29V4.5c0-.28-.224-.5-.5-.5h-11z"></path></svg>
                            )}
                        </div>
                    </button>
                </div>
            </div>

            {/* Reply Area */}
            {auth?.user && (
                <form onSubmit={submitReply} className="flex px-4 py-3 border-b border-gray-100">
                    <img src={auth.user.avatar || `https://ui-avatars.com/api/?name=${auth.user.name}&background=random`} alt={auth.user.name} className="h-10 w-10 rounded-full mr-3" />
                    <div className="flex flex-1 items-center">
                        <input
                            type="text"
                            className="bg-transparent border-none focus:ring-0 flex-1 text-xl py-3 placeholder-gray-500"
                            placeholder="Post your reply"
                            value={data.body}
                            onChange={(e) => setData('body', e.target.value)}
                        />
                        <button type="submit" disabled={!data.body || processing} className="bg-[#1d9bf0] text-white rounded-full px-4 py-1.5 font-bold disabled:opacity-50 transition hover:bg-[#1a8cd8]">
                            Reply
                        </button>
                    </div>
                </form>
            )}

            {/* Replies */}
            <div className="pb-[80vh]">
                {replies && replies.length > 0 ? (
                    replies.map((reply) => (
                        <TweetCard key={reply.id} tweet={reply} />
                    ))
                ) : (
                    <div className="p-8 text-center text-gray-500 text-[15px]">
                        No replies yet. Be the first to reply!
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
