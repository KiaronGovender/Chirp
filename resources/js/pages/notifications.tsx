import React from 'react';
import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/AppLayout';

export default function Notifications() {
    return (
        <AppLayout>
            <Head title="Notifications" />

            <div className="sticky top-0 z-10 border-b border-gray-100 bg-white/80 backdrop-blur-md">
                <div className="flex px-4 pt-3 flex-col pb-3">
                    <h1 className="text-xl font-bold">Notifications</h1>
                    <div className="mt-2 flex w-full">
                        <div className="group relative flex flex-1 w-full justify-center pb-3 transition cursor-pointer hover:bg-gray-100">
                            <span className="font-bold text-gray-900">All</span>
                            <div className="absolute bottom-0 h-1 w-14 rounded-full bg-[#1d9bf0]"></div>
                        </div>
                        <div className="group relative flex flex-1 w-full justify-center pb-3 text-gray-500 transition cursor-pointer hover:bg-gray-100">
                            <span className="font-medium group-hover:text-gray-900">Mentions</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-10 flex flex-col items-center justify-center px-8 text-center">
                <div className="rounded-full bg-[#1d9bf0]/10 p-5 mb-4">
                    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-10 w-10 fill-[#1d9bf0]">
                        <path d="M11.996 2C6.479 2 2 6.479 2 11.996S6.479 22 11.996 22s9.996-4.479 9.996-9.996S17.513 2 11.996 2zm.75 14.496h-1.5v-6.5h1.5v6.5zm-.75-8.5c-.553 0-1-.447-1-1s.447-1 1-1 1 .447 1 1-.447 1-1 1z"></path>
                    </svg>
                </div>
                <h2 className="text-3xl font-extrabold text-gray-900">Nothing to see here — yet</h2>
                <p className="mt-2 text-gray-500 max-w-sm">
                    From likes and reposts to follows, you'll get notified about all the activity around you here.
                </p>
            </div>
        </AppLayout>
    );
}
