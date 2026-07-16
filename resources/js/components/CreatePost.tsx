import React, { useState } from 'react';
import { useForm, usePage } from '@inertiajs/react';
import { Auth } from '@/types/auth';

export default function CreatePost() {
    const { auth } = usePage<{ auth: Auth }>().props;
    const { data, setData, post, processing, reset } = useForm({
        body: '',
    });

    const [isFocused, setIsFocused] = useState(false);

    if (!auth?.user) return null; // Only show if logged in

    function submit(e: React.FormEvent) {
        e.preventDefault();
        post('/tweets', {
            onSuccess: () => reset('body'),
        });
    }

    return (
        <form onSubmit={submit} className="flex px-4 py-3 border-gray-100 pb-2">
            <div className="mr-3 flex-shrink-0 pt-1">
                <img
                    src={auth.user.avatar || `https://ui-avatars.com/api/?name=${auth.user.name}&background=random`}
                    alt={auth.user.name}
                    className="h-10 w-10 rounded-full"
                />
            </div>

            <div className="flex-1">
                <textarea
                    value={data.body}
                    onChange={(e) => setData('body', e.target.value)}
                    onFocus={() => setIsFocused(true)}
                    placeholder="What is happening?!"
                    className="w-full resize-none border-none bg-transparent pt-3 text-xl placeholder-gray-500 focus:ring-0"
                    rows={isFocused || data.body.length > 0 ? 3 : 1}
                ></textarea>

                {(isFocused || data.body.length > 0) && (
                    <div className="mt-2 text-[#1d9bf0] font-bold text-sm px-2 pb-3 border-b border-gray-100">
                        <span className="cursor-pointer hover:bg-[#1d9bf0]/10 px-3 py-1 rounded-full transition">
                            Everyone can reply
                        </span>
                    </div>
                )}

                <div className="mt-3 flex items-center justify-between pb-1">
                    <div className="flex items-center text-[#1d9bf0]">
                        <button type="button" className="rounded-full p-2 transition hover:bg-[#1d9bf0]/10">
                            <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 fill-current"><path d="M3 5.5C3 4.119 4.119 3 5.5 3h13C19.881 3 21 4.119 21 5.5v13c0 1.381-1.119 2.5-2.5 2.5h-13C4.119 21 3 19.881 3 18.5v-13zM5.5 5c-.276 0-.5.224-.5.5v9.086l3-3 3 3 5-5 3 3V5.5c0-.276-.224-.5-.5-.5h-13zM19 15.414l-3-3-5 5-3-3-3 3V18.5c0 .276.224.5.5.5h13c.276 0 .5-.224.5-.5v-3.086zM9.75 7C8.784 7 8 7.784 8 8.75s.784 1.75 1.75 1.75 1.75-.784 1.75-1.75S10.716 7 9.75 7z"></path></svg>
                        </button>
                        <button type="button" className="rounded-full p-2 transition hover:bg-[#1d9bf0]/10">
                            <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 fill-current"><path d="M19 10.5V8.8h-4.4v-1.6h4.4V5.5h1.6v1.7h4.4v1.6h-4.4v1.7H19zm-7.3-1.55l1.7 2.5c.2.3.2.7 0 1l-1.7 2.5c-.3.4-.9.5-1.4.1-.1-.1-.2-.2-.2-.3l-.4-1.7c-.1-.3-.3-.5-.6-.5h-2c-.3 0-.6.2-.6.5l-.4 1.7c-.1.3-.4.6-.7.6-.2 0-.4-.1-.5-.2-.1-.2-.2-.3-.2-.5l1.6-7.8c.2-.5.8-.8 1.4-.7.1 0 .3.1.4.2l3.4 2.1c.3.2.6.2.8 0zm-1.8 1.6l-1.9-1.2-1.2 5.6h1.2l.6-2.5c.1-.4.5-.7 1-.6h1.5l.8-3.4c0-.3-.4-.5-.7-.3l-1.3 2.4z"></path></svg>
                        </button>
                        {/* More icons... */}
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={data.body.length === 0 || processing}
                            className="rounded-full bg-[#1d9bf0] px-5 py-2 font-bold text-white transition hover:bg-[#1a8cd8] disabled:opacity-50"
                        >
                            Post
                        </button>
                    </div>
                </div>
            </div>
        </form>
    );
}
