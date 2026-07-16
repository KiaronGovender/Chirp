import { Link, usePage } from '@inertiajs/react';
import React, { PropsWithChildren } from 'react';
import { Auth } from '@/types/auth';

export default function AppLayout({ children }: PropsWithChildren) {
    const { auth } = usePage<{ auth: Auth }>().props;
    const { url } = usePage();

    return (
        <div className="min-h-screen bg-white">
            <div className="mx-auto flex w-full max-w-7xl justify-between">
                {/* Left Sidebar */}
                <header className="sticky top-0 h-screen w-20 flex-shrink-0 flex-col border-r border-gray-100 sm:w-24 md:w-64 lg:w-72 items-end pt-2 pr-2 sm:pr-4 md:pr-6 pb-4">
                    <div className="flex h-full w-full flex-col justify-between items-center md:items-start pl-2 md:pl-8">
                        <nav className="flex flex-col gap-2 mt-4">
                            <Link href="/" className="mb-4 inline-flex items-center justify-center md:justify-start">
                                <svg viewBox="0 0 24 24" aria-hidden="true" className="h-8 w-8 text-[#1d9bf0]">
                                    <g>
                                        <path d="M23.643 4.937c-.835.37-1.732.62-2.675.733.962-.576 1.7-1.49 2.048-2.578-.9.534-1.897.922-2.958 1.13-.85-.904-2.06-1.47-3.4-1.47-2.572 0-4.658 2.086-4.658 4.66 0 .364.042.718.12 1.06-3.873-.195-7.304-2.05-9.602-4.868-.4.69-.63 1.49-.63 2.342 0 1.616.823 3.043 2.072 3.878-.764-.025-1.482-.234-2.11-.583v.06c0 2.257 1.605 4.14 3.737 4.568-.392.106-.803.162-1.227.162-.3 0-.593-.028-.877-.082.593 1.85 2.313 3.198 4.352 3.234-1.595 1.25-3.604 1.995-5.786 1.995-.376 0-.747-.022-1.112-.065 2.062 1.323 4.51 2.093 7.14 2.093 8.57 0 13.255-7.098 13.255-13.254 0-.2-.005-.402-.014-.602.91-.658 1.7-1.477 2.323-2.41z" fill="currentColor"></path>
                                    </g>
                                </svg>
                            </Link>

                            <Link href="/" className={`inline-flex items-center gap-4 rounded-full p-3 text-xl transition hover:bg-gray-200 ${url === '/' || url.startsWith('/?') ? 'font-bold' : ''}`}>
                                <svg className="h-7 w-7" fill="currentColor" viewBox="0 0 24 24"><path d="M12 1.696L.622 8.807l1.06 1.696L3 9.679V19.5C3 20.881 4.119 22 5.5 22h13c1.381 0 2.5-1.119 2.5-2.5V9.679l1.318.824 1.06-1.696L12 1.696zM19 19.5c0 .276-.224.5-.5.5h-13c-.276 0-.5-.224-.5-.5V8.429l7-4.375 7 4.375V19.5zM10 16h4v4h-4v-4z"></path></svg>
                                <span className="hidden md:inline">Home</span>
                            </Link>

                            <Link href="/explore" className={`inline-flex items-center gap-4 rounded-full p-3 text-xl transition hover:bg-gray-200 ${url.startsWith('/explore') ? 'font-bold' : ''}`}>
                                <svg className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                                <span className="hidden md:inline">Explore</span>
                            </Link>

                            <Link href="/notifications" className={`inline-flex items-center gap-4 rounded-full p-3 text-xl transition hover:bg-gray-200 ${url.startsWith('/notifications') ? 'font-bold' : ''}`}>
                                <svg className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>
                                <span className="hidden md:inline">Notifications</span>
                            </Link>

                            <Link href="/messages" className={`inline-flex items-center gap-4 rounded-full p-3 text-xl transition hover:bg-gray-200 ${url.startsWith('/messages') ? 'font-bold' : ''}`}>
                                <svg className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                                <span className="hidden md:inline">Messages</span>
                            </Link>

                            <Link href="/bookmarks" className={`inline-flex items-center gap-4 rounded-full p-3 text-xl transition hover:bg-gray-200 ${url.startsWith('/bookmarks') ? 'font-bold' : ''}`}>
                                <svg className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"></path></svg>
                                <span className="hidden md:inline">Bookmarks</span>
                            </Link>

                            {auth?.user && (
                                <Link href={`/${auth.user.username}`} className={`inline-flex items-center gap-4 rounded-full p-3 text-xl transition hover:bg-gray-200 ${url.startsWith(`/${auth.user.username}`) ? 'font-bold' : ''}`}>
                                    <svg className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                                    <span className="hidden md:inline">Profile</span>
                                </Link>
                            )}

                            <button className="mt-4 hidden w-full rounded-full bg-[#1d9bf0] py-3 text-lg font-bold text-white shadow-sm hover:bg-[#1a8cd8] md:block">
                                Post
                            </button>
                            <button className="mt-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#1d9bf0] text-white shadow-sm hover:bg-[#1a8cd8] md:hidden">
                                <svg viewBox="0 0 24 24" aria-hidden="true" className="h-6 w-6" fill="currentColor"><path d="M23 3c-6.62-.1-10.38 2.421-13.05 6.095C7.94 12.587 6.39 15.521 5.31 19.115l-.23.774H2.43l-.4-1.2A2.001 2.001 0 0 1 4 16h2.29c.64-1.637 1.48-3.084 2.5-4.296C11.96 7.828 16.59 5.093 23 5V3zM3 18a1 1 0 0 0-1 1v4h4a1 1 0 0 0 1-1v-4H3z"></path></svg>
                            </button>
                        </nav>

                        {auth?.user ? (
                            <Link href="/logout" method="post" as="button" className="mb-4 flex w-full items-center gap-3 rounded-full p-3 transition hover:bg-gray-200">
                                <img src={auth.user.avatar || `https://ui-avatars.com/api/?name=${auth.user.name}&background=random`} alt={auth.user.name} className="h-10 w-10 rounded-full" />
                                <div className="hidden text-left md:block">
                                    <p className="text-sm font-bold">{auth.user.name}</p>
                                    <p className="text-sm text-gray-500">@{auth.user.username}</p>
                                </div>
                            </Link>
                        ) : (
                            <Link href="/login" className="mb-4 flex w-full items-center justify-center gap-3 rounded-full p-3 transition hover:bg-gray-200 text-lg font-bold text-[#1d9bf0]">
                                Login
                            </Link>
                        )}
                    </div>
                </header>

                {/* Main Content */}
                <main className="min-h-screen w-full max-w-[600px] flex-1 border-r border-gray-100 sm:w-[600px]">
                    {children}
                </main>

                {/* Right Sidebar */}
                <aside className="hidden w-80 lg:block flex-shrink-0 pt-3 pl-8 lg:w-[350px]">
                    <div className="sticky top-0 pb-8">
                        {/* Search Bar */}
                        <div className="group relative mb-4">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                                <svg className="h-5 w-5 text-gray-500 group-focus-within:text-[#1d9bf0]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                            </div>
                            <input type="text" className="block w-full rounded-full border-none bg-gray-100 py-3 pl-12 pr-4 text-sm text-gray-900 focus:bg-white focus:ring-1 focus:ring-[#1d9bf0]" placeholder="Search" />
                        </div>

                        {/* What's happening block */}
                        <div className="rounded-2xl bg-gray-50 pt-3">
                            <h2 className="px-4 pb-3 text-xl font-extrabold text-gray-900">What's happening</h2>

                            <div className="px-4 py-3 cursor-pointer transition hover:bg-gray-100">
                                <p className="text-[13px] text-gray-500">Trending in Tech</p>
                                <p className="font-bold text-gray-900 leading-5 mt-0.5">#Laravel</p>
                                <p className="mt-1 text-[13px] text-gray-500">12.5K Tweets</p>
                            </div>

                            <div className="px-4 py-3 cursor-pointer transition hover:bg-gray-100 rounded-b-2xl">
                                <span className="text-[#1d9bf0] text-[15px] cursor-pointer hover:underline">Show more</span>
                            </div>
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
}
