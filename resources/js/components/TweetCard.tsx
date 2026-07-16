import React from 'react';
import { Link, useForm, usePage } from '@inertiajs/react';
import type { tweet } from '@/types/tweet';
import type { Auth } from '@/types/auth';

interface TweetCardProps {
    tweet: tweet;
}

export default function TweetCard({ tweet }: TweetCardProps) {
    const { auth } = usePage<{ auth: Auth }>().props;
    const { post: postLike } = useForm();
    const { post: postRetweet } = useForm();
    const { post: postBookmark } = useForm();
    const { delete: deleteTweet } = useForm();

    const timeAgo = (dateStr: string) => {
        const date = new Date(dateStr);
        const now = new Date();
        const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

        if (diffInSeconds < 60) return `${diffInSeconds}s`;
        const diffInMinutes = Math.floor(diffInSeconds / 60);
        if (diffInMinutes < 60) return `${diffInMinutes}m`;
        const diffInHours = Math.floor(diffInMinutes / 60);
        if (diffInHours < 24) return `${diffInHours}h`;
        const diffInDays = Math.floor(diffInHours / 24);
        if (diffInDays < 365) return `${diffInDays}d`;
        return `${Math.floor(diffInDays / 365)}y`;
    };

    function toggleLike(e: React.MouseEvent) {
        e.preventDefault();
        if (!auth?.user) return;
        postLike(`/tweets/${tweet.id}/like`, { preserveScroll: true });
    }

    function toggleRetweet(e: React.MouseEvent) {
        e.preventDefault();
        if (!auth?.user) return;
        postRetweet(`/tweets/${tweet.id}/retweet`, { preserveScroll: true });
    }

    function toggleBookmark(e: React.MouseEvent) {
        e.preventDefault();
        if (!auth?.user) return;
        postBookmark(`/tweets/${tweet.id}/bookmark`, { preserveScroll: true });
    }

    function handleDelete(e: React.MouseEvent) {
        e.preventDefault();
        if (!confirm('Delete this tweet?')) return;
        deleteTweet(`/tweets/${tweet.id}`, { preserveScroll: true });
    }

    const isOwner = auth?.user?.id === tweet.user_id;

    return (
        <article className="flex cursor-pointer border-b border-gray-100 px-4 py-3 transition hover:bg-gray-50 focus-within:bg-gray-50">
            <div className="mr-3 flex-shrink-0">
                <Link href={`/${tweet.user.username}`} className="block h-10 w-10 overflow-hidden rounded-full hover:opacity-90 transition" onClick={(e) => e.stopPropagation()}>
                    <img src={tweet.user.avatar || `https://ui-avatars.com/api/?name=${tweet.user.name}&background=random`} alt={tweet.user.name} />
                </Link>
            </div>

            <div className="flex-1 min-w-0">
                <div className="flex items-center text-[15px]">
                    <div className="flex flex-1 items-center gap-1 overflow-hidden">
                        <Link href={`/${tweet.user.username}`} className="font-bold text-gray-900 hover:underline truncate" onClick={(e) => e.stopPropagation()}>
                            {tweet.user.name}
                        </Link>
                        <Link href={`/${tweet.user.username}`} className="text-gray-500 truncate min-w-0" onClick={(e) => e.stopPropagation()}>
                            @{tweet.user.username}
                        </Link>
                        <span className="text-gray-500 flex-shrink-0">·</span>
                        <Link href={`/tweets/${tweet.id}`} className="text-gray-500 flex-shrink-0 hover:underline">
                            {timeAgo(tweet.created_at)}
                        </Link>
                    </div>

                    {isOwner && (
                        <button
                            onClick={handleDelete}
                            className="text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full p-1.5 transition ml-2 flex-shrink-0"
                            title="Delete tweet"
                        >
                            <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 fill-current">
                                <path d="M16 6V4.5C16 3.12 14.88 2 13.5 2h-3C9.12 2 8 3.12 8 4.5V6H3v2h1.06l.81 11.21C4.98 20.78 6.28 22 7.86 22h8.27c1.58 0 2.88-1.22 2.99-2.79L19.93 8H21V6h-5zm-6-1.5c0-.28.22-.5.5-.5h3c.28 0 .5.22.5.5V6h-4V4.5zm7.13 14.57c-.04.54-.49.93-1.04.93H7.86c-.55 0-1-.39-1.04-.93L6.07 8h11.85l-.79 11.07z" />
                            </svg>
                        </button>
                    )}

                    {!isOwner && (
                        <button className="text-gray-500 hover:text-[#1d9bf0] hover:bg-[#1d9bf0]/10 rounded-full p-1.5 transition ml-2 flex-shrink-0 group">
                            <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 fill-current">
                                <path d="M3 12c0-1.1.9-2 2-2s2 .9 2 2-.9 2-2 2-2-.9-2-2zm9 2c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm7 0c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2z"></path>
                            </svg>
                        </button>
                    )}
                </div>

                <Link href={`/tweets/${tweet.id}`} className="block mt-1 text-[15px] text-gray-900 break-words whitespace-pre-wrap">
                    {tweet.body}
                </Link>

                <div className="mt-3 max-w-md flex justify-between text-gray-500">
                    {/* Reply */}
                    <Link
                        href={`/tweets/${tweet.id}`}
                        className="group flex items-center gap-2 hover:text-[#1d9bf0] transition w-1/4"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="rounded-full p-2 group-hover:bg-[#1d9bf0]/10">
                            <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 fill-current"><path d="M1.751 10c0-4.42 3.584-8 8.005-8h4.366c4.49 0 8.129 3.64 8.129 8.13 0 2.96-1.607 5.68-4.196 7.11l-8.054 4.46v-3.69h-.067c-4.49.1-8.183-3.51-8.183-8.01zm8.005-6c-3.317 0-6.005 2.69-6.005 6 0 3.37 2.77 6.08 6.138 6.01l.351-.01h1.761v2.3l5.087-2.81c1.951-1.08 3.163-3.13 3.163-5.36 0-3.39-2.744-6.13-6.129-6.13H9.756z"></path></svg>
                        </div>
                        <span className="text-[13px]">{tweet.replies_count ?? 0}</span>
                    </Link>

                    {/* Retweet */}
                    <button
                        onClick={toggleRetweet}
                        className={`group flex items-center gap-2 transition w-1/4 ${tweet.is_retweeted ? 'text-[#00ba7c]' : 'hover:text-[#00ba7c]'}`}
                    >
                        <div className="rounded-full p-2 group-hover:bg-[#00ba7c]/10">
                            <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 fill-current"><path d="M4.5 3.88l4.432 4.14-1.364 1.46L5.5 7.55V16c0 1.1.896 2 2 2H13v2H7.5c-2.209 0-4-1.79-4-4V7.55L1.432 9.48.068 8.02 4.5 3.88zM16.5 6H11V4h5.5c2.209 0 4 1.79 4 4v8.45l2.068-1.93 1.364 1.46-4.432 4.14-4.432-4.14 1.364-1.46 2.068 1.93V8c0-1.1-.896-2-2-2z"></path></svg>
                        </div>
                        <span className="text-[13px]">{tweet.retweets_count ?? 0}</span>
                    </button>

                    {/* Like */}
                    <button
                        onClick={toggleLike}
                        className={`group flex items-center gap-2 transition w-1/4 ${tweet.is_liked ? 'text-[#f91880]' : 'hover:text-[#f91880]'}`}
                    >
                        <div className="rounded-full p-2 group-hover:bg-[#f91880]/10">
                            {tweet.is_liked ? (
                                <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 fill-current"><path d="M20.884 13.19c-1.351 2.48-4.001 5.12-8.379 7.67l-.503.3-.504-.3c-4.379-2.55-7.029-5.19-8.382-7.67-1.36-2.5-1.41-4.86-.514-6.67.887-1.79 2.647-2.91 4.601-3.01 1.651-.09 3.368.56 4.798 2.01 1.429-1.45 3.146-2.1 4.796-2.01 1.954.1 3.714 1.22 4.601 3.01.896 1.81.846 4.17-.514 6.67z"></path></svg>
                            ) : (
                                <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 fill-current"><path d="M16.697 5.5c-1.222-.06-2.679.51-3.89 2.16l-.805 1.09-.806-1.09C9.984 6.01 8.526 5.44 7.304 5.5c-1.243.07-2.349.78-2.91 1.91-.552 1.12-.633 2.78.479 4.82 1.074 1.97 3.257 4.27 7.129 6.61 3.87-2.34 6.052-4.64 7.126-6.61 1.111-2.04 1.03-3.7.477-4.82-.561-1.13-1.666-1.84-2.908-1.91zm4.187 7.69c-1.351 2.48-4.001 5.12-8.379 7.67l-.503.3-.504-.3c-4.379-2.55-7.029-5.19-8.382-7.67-1.36-2.5-1.41-4.86-.514-6.67.887-1.79 2.647-2.91 4.601-3.01 1.651-.09 3.368.56 4.798 2.01 1.429-1.45 3.146-2.1 4.796-2.01 1.954.1 3.714 1.22 4.601 3.01.896 1.81.846 4.17-.514 6.67z"></path></svg>
                            )}
                        </div>
                        <span className="text-[13px]">{tweet.likes_count ?? 0}</span>
                    </button>

                    {/* Bookmark */}
                    <button
                        onClick={toggleBookmark}
                        className={`group flex items-center gap-2 transition w-1/4 ${tweet.is_bookmarked ? 'text-[#1d9bf0]' : 'hover:text-[#1d9bf0]'}`}
                    >
                        <div className="rounded-full p-2 group-hover:bg-[#1d9bf0]/10">
                            {tweet.is_bookmarked ? (
                                <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 fill-current"><path d="M4 4.5C4 3.12 5.119 2 6.5 2h11C18.881 2 20 3.12 20 4.5v18.44l-8-5.71-8 5.71V4.5z"></path></svg>
                            ) : (
                                <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 fill-current"><path d="M4 4.5C4 3.12 5.119 2 6.5 2h11C18.881 2 20 3.12 20 4.5v18.44l-8-5.71-8 5.71V4.5zM6.5 4c-.276 0-.5.22-.5.5v14.56l6-4.29 6 4.29V4.5c0-.28-.224-.5-.5-.5h-11z"></path></svg>
                            )}
                        </div>
                    </button>
                </div>
            </div>
        </article>
    );
}
