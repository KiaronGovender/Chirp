import React, { useState } from 'react';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/AppLayout';
import TweetCard from '@/components/TweetCard';
import type { tweet } from '@/types/tweet';
import type { User, Auth } from '@/types/auth';

export default function Profile({
    profileUser,
    tweets,
    isFollowing,
}: {
    profileUser: User;
    tweets: tweet[];
    isFollowing: boolean;
}) {
    const { auth } = usePage<{ auth: Auth }>().props;
    const isOwner = auth?.user?.id === profileUser.id;

    const [activeTab, setActiveTab] = useState('tweets');
    const [showEditModal, setShowEditModal] = useState(false);
    const [localIsFollowing, setLocalIsFollowing] = useState(isFollowing);

    const { post: postFollow, processing: followProcessing } = useForm();

    const {
        data,
        setData,
        put,
        processing: editProcessing,
        errors,
        reset,
    } = useForm({
        name: profileUser.name,
        bio: profileUser.bio || '',
    });

    function toggleFollow() {
        if (!auth?.user) return;

        setLocalIsFollowing(!localIsFollowing);
        postFollow(`/users/${profileUser.id}/follow`, {
            preserveScroll: true,
            onError: () => setLocalIsFollowing(localIsFollowing),
        });
    }

    function submitEdit(e: React.FormEvent) {
        e.preventDefault();
        put('/profile', {
            preserveScroll: true,
            onSuccess: () => setShowEditModal(false),
        });
    }

    return (
        <AppLayout>
            <Head title={`${profileUser.name} (@${profileUser.username})`} />

            <div className="sticky top-0 z-10 flex items-center gap-6 border-b border-gray-100 bg-white/80 px-4 py-2 backdrop-blur-md">
                <Link
                    href="/"
                    className="rounded-full p-2 transition hover:bg-gray-200"
                >
                    <svg
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                        className="h-5 w-5"
                    >
                        <path d="M7.414 13l5.043 5.04-1.414 1.42L3.586 12l7.457-7.46 1.414 1.42L7.414 11H21v2H7.414z"></path>
                    </svg>
                </Link>
                <div>
                    <h1 className="text-xl font-bold">{profileUser.name}</h1>
                    <p className="text-sm text-gray-500">
                        {profileUser.tweets_count || tweets.length} Tweets
                    </p>
                </div>
            </div>

            {/* Banner */}
            <div className="h-[200px] w-full bg-gray-300">
                {profileUser.banner && (
                    <img
                        src={profileUser.banner}
                        alt="Banner"
                        className="h-full w-full object-cover"
                    />
                )}
            </div>

            {/* Profile Info */}
            <div className="px-4 pb-4">
                <div className="flex items-start justify-between">
                    <div className="-mt-[15%] w-[30%] max-w-[134px] min-w-[48px]">
                        <div className="relative aspect-square w-full overflow-hidden rounded-full border-4 border-white bg-gray-200 shadow-sm">
                            <img
                                src={
                                    profileUser.avatar ||
                                    `https://ui-avatars.com/api/?name=${profileUser.name}&background=random&size=200`
                                }
                                alt={profileUser.name}
                                className="absolute inset-0 h-full w-full object-cover"
                            />
                        </div>
                    </div>

                    <div className="pt-3">
                        {isOwner ? (
                            <button
                                onClick={() => setShowEditModal(true)}
                                className="rounded-full border border-gray-300 px-4 py-1.5 font-bold transition hover:bg-gray-100"
                            >
                                Edit profile
                            </button>
                        ) : (
                            <button
                                onClick={toggleFollow}
                                disabled={followProcessing}
                                className={`rounded-full px-5 py-1.5 font-bold transition ${localIsFollowing ? 'border border-gray-300 bg-white text-gray-900 after:content-["Following"] hover:border-red-100 hover:bg-red-100 hover:text-red-500 hover:after:content-["Unfollow"]' : 'bg-[#0f1419] text-white hover:bg-gray-800'}`}
                            >
                                {!localIsFollowing && 'Follow'}
                            </button>
                        )}
                    </div>
                </div>

                <div className="mt-2 text-gray-900">
                    <h2 className="text-xl font-extrabold">
                        {profileUser.name}
                    </h2>
                    <p className="text-gray-500">@{profileUser.username}</p>
                </div>

                {profileUser.bio && (
                    <div className="mt-3 text-[15px]">{profileUser.bio}</div>
                )}

                <div className="mt-3 flex items-center gap-1 text-[15px] text-gray-500">
                    <svg
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                        className="h-4 w-4 fill-current"
                    >
                        <path d="M7 4V3h2v1h6V3h2v1h1.5C19.88 4 21 5.12 21 6.5v12c0 1.38-1.12 2.5-2.5 2.5h-13C4.12 21 3 19.88 3 18.5v-12C3 5.12 4.12 4 5.5 4H7zm0 2H5.5c-.27 0-.5.22-.5.5v12c0 .28.23.5.5.5h13c.28 0 .5-.22.5-.5v-12c0-.28-.22-.5-.5-.5H17v1h-2V6H9v1H7V6zm0 6h2v-2H7v2zm0 4h2v-2H7v2zm4-4h2v-2h-2v2zm0 4h2v-2h-2v2zm4-4h2v-2h-2v2z"></path>
                    </svg>
                    <span>
                        Joined{' '}
                        {new Date(profileUser.created_at).toLocaleDateString(
                            'en-US',
                            { month: 'long', year: 'numeric' },
                        )}
                    </span>
                </div>

                <div className="mt-3 flex items-center gap-5 text-[15px]">
                    <span className="cursor-pointer hover:underline">
                        <span className="font-bold text-gray-900">
                            {profileUser.following_count || 0}
                        </span>{' '}
                        <span className="text-gray-500">Following</span>
                    </span>
                    <span className="cursor-pointer hover:underline">
                        <span className="font-bold text-gray-900">
                            {profileUser.followers_count || 0}
                        </span>{' '}
                        <span className="text-gray-500">Followers</span>
                    </span>
                </div>
            </div>

            {/* Tabs */}
            <div className="scrollbar-hide flex w-full overflow-x-auto border-b border-gray-100 text-[15px] font-bold text-gray-500">
                {['Tweets', 'Replies', 'Media', 'Likes'].map((tab) => (
                    <div
                        key={tab}
                        onClick={() => setActiveTab(tab.toLowerCase())}
                        className={`group relative flex w-full min-w-max flex-1 cursor-pointer justify-center px-4 py-4 transition hover:bg-gray-100 ${activeTab === tab.toLowerCase() ? 'text-gray-900' : 'hover:text-gray-900'}`}
                    >
                        <span>{tab}</span>
                        {activeTab === tab.toLowerCase() && (
                            <div className="absolute bottom-0 h-1 w-14 rounded-full bg-[#1d9bf0]"></div>
                        )}
                    </div>
                ))}
            </div>

            {/* Profile Feed */}
            <div className="pb-[80vh]">
                {tweets.length > 0 ? (
                    tweets.map((tweet) => (
                        <TweetCard key={tweet.id} tweet={tweet} />
                    ))
                ) : (
                    <div className="mx-auto mt-8 max-w-[400px] text-center">
                        <h2 className="text-3xl font-extrabold text-gray-900">
                            @{profileUser.username} hasn't posted
                        </h2>
                        <p className="mt-2 text-gray-500">
                            When they do, their posts will show up here.
                        </p>
                    </div>
                )}
            </div>

            {/* Edit Profile Modal */}
            {showEditModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl">
                        <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
                            <div className="flex items-center gap-6">
                                <button
                                    onClick={() => {
                                        setShowEditModal(false);
                                        reset();
                                    }}
                                    className="rounded-full p-2 transition hover:bg-gray-200"
                                >
                                    <svg
                                        viewBox="0 0 24 24"
                                        aria-hidden="true"
                                        className="h-5 w-5"
                                    >
                                        <path d="M10.59 12L4.54 5.96l1.42-1.42L12 10.59l6.04-6.05 1.42 1.42L13.41 12l6.05 6.04-1.42 1.42L12 13.41l-6.04 6.05-1.42-1.42L10.59 12z"></path>
                                    </svg>
                                </button>
                                <h2 className="text-xl font-bold">
                                    Edit profile
                                </h2>
                            </div>
                            <button
                                onClick={submitEdit}
                                disabled={editProcessing}
                                className="rounded-full bg-gray-900 px-4 py-1.5 font-bold text-white transition hover:bg-gray-700 disabled:opacity-50"
                            >
                                Save
                            </button>
                        </div>

                        {/* Banner Placeholder */}
                        <div className="relative h-[150px] bg-gray-300">
                            {profileUser.banner && (
                                <img
                                    src={profileUser.banner}
                                    alt="Banner"
                                    className="h-full w-full object-cover"
                                />
                            )}
                        </div>

                        <form onSubmit={submitEdit} className="px-4 pb-4">
                            {/* Avatar Placeholder */}
                            <div className="-mt-[60px] mb-4 h-[80px] w-[80px] overflow-hidden rounded-full border-4 border-white bg-gray-200">
                                <img
                                    src={
                                        profileUser.avatar ||
                                        `https://ui-avatars.com/api/?name=${profileUser.name}&background=random&size=200`
                                    }
                                    alt={profileUser.name}
                                    className="h-full w-full object-cover"
                                />
                            </div>

                            <div className="mt-4 space-y-4">
                                <div className="relative rounded-md border border-gray-300 px-3 pt-4 pb-2 focus-within:border-[#1d9bf0]">
                                    <label className="absolute top-1 left-3 text-xs text-gray-500">
                                        Name
                                    </label>
                                    <input
                                        type="text"
                                        value={data.name}
                                        onChange={(e) =>
                                            setData('name', e.target.value)
                                        }
                                        className="block w-full border-none bg-transparent pt-1 text-[15px] focus:ring-0"
                                        maxLength={50}
                                    />
                                    {errors.name && (
                                        <p className="mt-1 text-xs text-red-500">
                                            {errors.name}
                                        </p>
                                    )}
                                </div>

                                <div className="relative rounded-md border border-gray-300 px-3 pt-4 pb-2 focus-within:border-[#1d9bf0]">
                                    <label className="absolute top-1 left-3 text-xs text-gray-500">
                                        Bio
                                    </label>
                                    <textarea
                                        value={data.bio}
                                        onChange={(e) =>
                                            setData('bio', e.target.value)
                                        }
                                        className="block w-full resize-none border-none bg-transparent pt-1 text-[15px] focus:ring-0"
                                        rows={3}
                                        maxLength={160}
                                    />
                                    <p className="text-right text-xs text-gray-500">
                                        {data.bio.length}/160
                                    </p>
                                    {errors.bio && (
                                        <p className="mt-1 text-xs text-red-500">
                                            {errors.bio}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AppLayout>
    );
}
