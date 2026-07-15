import { useForm } from '@inertiajs/react';
import React from 'react';

const CreatePost = () => {
    const { data, setData, post, processing, errors, reset } = useForm({
        body: '',
    });

    function handleSubmit(e: React.MouseEvent<HTMLButtonElement>) {
        e.preventDefault();

        post('/tweets', {
            onSuccess: () => reset('body'),
        });
    }

    return (
        <div className="mx-auto max-w-xl border-b border-gray-200 bg-white p-4 font-sans">
            <div className="flex gap-4">
                <div className="flex-shrink-0">
                    <img
                        src="https://i.pravatar.cc/150?img=47"
                        alt="Sam Taylor"
                        className="h-12 w-12 rounded-full bg-gray-200 object-cover"
                    />
                </div>

                <div className="min-w-0 flex-1 pt-2">
                    <div className="mb-4">
                        <input
                            type="text"
                            value={data.body}
                            onChange={(e) => setData('body', e.target.value)}
                            placeholder="What's chirping?"
                            className="w-full border-none bg-transparent text-xl text-gray-600 placeholder-gray-400 focus:ring-0 focus:outline-none"
                        />
                    </div>

                    <div className="flex items-center justify-between border-t border-transparent pt-2">
                        <div className="-ml-2 flex items-center gap-1 text-[#38bdf8]">
                            <button className="rounded-full p-2 transition-colors hover:bg-blue-50">
                                <svg
                                    className="h-[20px] w-[20px]"
                                    fill="none"
                                    stroke="currentColor"
                                    stroke-width="2"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                    ></path>
                                </svg>
                            </button>

                            <button className="rounded-full p-2 transition-colors hover:bg-blue-50">
                                <svg
                                    className="h-[20px] w-[20px]"
                                    fill="none"
                                    stroke="currentColor"
                                    stroke-width="2"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                    ></path>
                                </svg>
                            </button>

                            <button className="rounded-full p-2 transition-colors hover:bg-blue-50">
                                <svg
                                    className="h-[20px] w-[20px]"
                                    fill="none"
                                    stroke="currentColor"
                                    stroke-width="2"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                    ></path>
                                </svg>
                            </button>

                            <button className="rounded-full p-2 transition-colors hover:bg-blue-50">
                                <svg
                                    className="h-[20px] w-[20px]"
                                    fill="none"
                                    stroke="currentColor"
                                    stroke-width="2"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                    ></path>
                                    <path
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                    ></path>
                                </svg>
                            </button>
                        </div>
                        {errors.body && <div>{errors.body}</div>}
                        <button
                            type="button"
                            onClick={handleSubmit}
                            disabled={processing}
                            className="cursor-pointer rounded-full bg-[#9cd4fa] px-5 py-2 text-[15px] font-bold text-white transition-colors hover:bg-blue-300"
                        >
                            Post
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreatePost;
