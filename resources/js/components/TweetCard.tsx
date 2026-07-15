type TweetCardProps = {
    body: string;
    name: string;
};

const TweetCard = ({ body, name }: TweetCardProps) => {
    return (
        <div className="mx-auto max-w-xl border border-gray-200 bg-white p-4 font-sans text-[15px]">
            <div className="flex gap-3">
                <div className="relative flex-shrink-0">
                    <img
                        src="https://i.pravatar.cc/150?img=47"
                        alt="Sam Taylor"
                        className="h-10 w-10 rounded-full bg-gray-200 object-cover"
                    />
                    <div className="absolute -right-1 -bottom-1 rounded-full bg-white p-[2px]">
                        <div className="flex h-4 w-4 items-center justify-center rounded-full bg-[#1d9bf0] text-white">
                            <svg
                                className="h-2.5 w-2.5"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12zm8.508-3.758a.75.75 0 00-.75 1.25l2.677 1.606-2.677 1.606a.75.75 0 10.77 1.284l3.153-1.892a.75.75 0 000-1.284l-3.153-1.892a.75.75 0 00-.02-.012z"></path>
                            </svg>
                        </div>
                    </div>
                </div>

                <div className="min-w-0 flex-1">
                    <div className="mb-0.5 flex items-center text-sm">
                        <span className="cursor-pointer truncate font-bold text-gray-900 hover:underline">
                            {name}
                        </span>
                        <svg
                            className="ml-1 h-4 w-4 text-[#1d9bf0]"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                            aria-hidden="true"
                        >
                            <path d="M22.5 12.5c0-1.58-.875-2.95-2.148-3.6.154-.435.238-.905.238-1.4 0-2.21-1.71-3.998-3.918-3.998-.47 0-.92.084-1.336.25C14.818 2.415 13.51 1.5 12 1.5s-2.816.917-3.337 2.25c-.416-.165-.866-.25-1.336-.25-2.21 0-3.918 1.792-3.918 4 0 .495.084.965.238 1.4-1.273.65-2.148 2.02-2.148 3.6 0 1.442.72 2.722 1.823 3.422-.046.223-.073.454-.073.688 0 2.21 1.71 4 3.918 4 .47 0 .92-.086 1.336-.252C9.184 22.583 10.49 23.5 12 23.5s2.816-.917 3.337-2.25c.416.166.866.252 1.336.252 2.21 0 3.918-1.79 3.918-4 0-.234-.027-.465-.073-.688 1.103-.7 1.823-1.98 1.823-3.422zm-11.46 5.9l-3.26-3.26 1.41-1.41 1.85 1.85 5.25-5.25 1.41 1.41-6.66 6.66z"></path>
                        </svg>
                        <span className="ml-1 truncate text-gray-500">
                            @samtaylor
                        </span>
                        <span className="mx-1 text-gray-500">·</span>
                        <span className="cursor-pointer text-gray-500 hover:underline">
                            2h
                        </span>
                    </div>

                    <div className="mb-3 leading-normal text-gray-900">
                        <p>{body}</p>
                    </div>

                    <div className="mb-3 flex items-center text-[13px] font-medium text-gray-500">
                        <svg
                            className="mr-1.5 h-4 w-4"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                            viewBox="0 0 24 24"
                            aria-hidden="true"
                        >
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                            ></path>
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                            ></path>
                        </svg>
                        <span>144.6K views</span>
                    </div>

                    <div className="flex max-w-md items-center justify-between pr-4 text-gray-500">
                        <button className="group flex items-center">
                            <div className="rounded-full p-2 transition-colors group-hover:bg-blue-50 group-hover:text-blue-500">
                                <svg
                                    className="h-[18px] w-[18px]"
                                    fill="none"
                                    stroke="currentColor"
                                    stroke-width="1.8"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                                    ></path>
                                </svg>
                            </div>
                            <span className="ml-1 text-[13px] transition-colors group-hover:text-blue-500">
                                203
                            </span>
                        </button>

                        <button className="group flex items-center">
                            <div className="rounded-full p-2 transition-colors group-hover:bg-green-50 group-hover:text-green-500">
                                <svg
                                    className="h-[18px] w-[18px]"
                                    fill="none"
                                    stroke="currentColor"
                                    stroke-width="1.8"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                                    ></path>
                                </svg>
                            </div>
                            <span className="ml-1 text-[13px] transition-colors group-hover:text-green-500">
                                891
                            </span>
                        </button>

                        <button className="group flex items-center">
                            <div className="rounded-full p-2 transition-colors group-hover:bg-pink-50 group-hover:text-pink-500">
                                <svg
                                    className="h-[18px] w-[18px]"
                                    fill="none"
                                    stroke="currentColor"
                                    stroke-width="1.8"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                                    ></path>
                                </svg>
                            </div>
                            <span className="ml-1 text-[13px] transition-colors group-hover:text-pink-500">
                                4.8K
                            </span>
                        </button>

                        <button className="group flex items-center">
                            <div className="rounded-full p-2 transition-colors group-hover:bg-blue-50 group-hover:text-blue-500">
                                <svg
                                    className="h-[18px] w-[18px]"
                                    fill="none"
                                    stroke="currentColor"
                                    stroke-width="1.8"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                                    ></path>
                                </svg>
                            </div>
                            <span className="ml-1 text-[13px] transition-colors group-hover:text-blue-500">
                                1.2K
                            </span>
                        </button>

                        <button className="group flex items-center">
                            <div className="rounded-full p-2 transition-colors group-hover:bg-blue-50 group-hover:text-blue-500">
                                <svg
                                    className="h-[18px] w-[18px]"
                                    fill="none"
                                    stroke="currentColor"
                                    stroke-width="1.8"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                                    ></path>
                                </svg>
                            </div>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TweetCard;
