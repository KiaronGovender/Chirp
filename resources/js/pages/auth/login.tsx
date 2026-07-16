import { useForm } from '@inertiajs/react';
import React from 'react';

const Login = () => {
    const { data, setData, post, processing, errors } = useForm({
        identifier: '',
        password: '',
        remember: false,
    });

    function submit(e: React.FormEvent) {
        e.preventDefault();
        // normalize identifier (strip leading @ for usernames)
        setData('identifier', data.identifier.replace(/^@+/, ''));
        post('/login');
    }

    return (
        <div className="flex min-h-screen w-full font-sans text-slate-900">
            <div className="relative hidden w-1/2 flex-col items-center justify-center bg-gradient-to-br from-slate-50 to-sky-50 p-12 lg:flex">
                <div className="flex w-full max-w-md flex-col items-center text-center">
                    <div className="mb-8 flex h-20 w-20 items-center justify-center rounded-2xl bg-sky-500 shadow-lg shadow-sky-500/30">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-10 w-10 text-white"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                            />
                        </svg>
                    </div>

                    <h1 className="mb-4 text-4xl font-black tracking-tight text-slate-900">
                        Chirp
                    </h1>
                    <p className="mb-12 text-lg leading-relaxed text-slate-500">
                        The conversation platform for ideas that matter.
                        Real-time, everywhere.
                    </p>

                    <div className="grid w-full grid-cols-2 gap-4">
                        <div className="rounded-2xl border border-slate-100 bg-white p-6 text-left shadow-sm">
                            <div className="text-2xl font-black text-sky-500">
                                2.1M+
                            </div>
                            <div className="mt-1 text-sm text-slate-500">
                                Active users
                            </div>
                        </div>
                        <div className="rounded-2xl border border-slate-100 bg-white p-6 text-left shadow-sm">
                            <div className="text-2xl font-black text-sky-500">
                                50ms
                            </div>
                            <div className="mt-1 text-sm text-slate-500">
                                Global latency
                            </div>
                        </div>
                        <div className="rounded-2xl border border-slate-100 bg-white p-6 text-left shadow-sm">
                            <div className="text-2xl font-black text-sky-500">
                                99.9%
                            </div>
                            <div className="mt-1 text-sm text-slate-500">
                                Uptime SLA
                            </div>
                        </div>
                        <div className="rounded-2xl border border-slate-100 bg-white p-6 text-left shadow-sm">
                            <div className="text-2xl font-black text-sky-500">
                                140+
                            </div>
                            <div className="mt-1 text-sm text-slate-500">
                                Countries
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="relative flex w-full flex-col items-center justify-center bg-white p-8 sm:p-12 lg:w-1/2 xl:p-24">
                <div className="w-full max-w-[420px]">
                    <h2 className="mb-2 text-3xl font-black tracking-tight">
                        Welcome back
                    </h2>
                    <p className="mb-8 text-slate-500">
                        Sign in to your Chirp account
                    </p>

                    <div className="space-y-3">
                        <button
                            type="button"
                            className="flex w-full items-center justify-center gap-3 rounded-xl border border-slate-200 py-2.5 text-sm font-bold text-slate-700 transition-colors hover:bg-slate-50"
                        >
                            <div className="h-5 w-5 rounded-full bg-slate-200"></div>{' '}
                            Continue with Google
                        </button>
                        <button
                            type="button"
                            className="flex w-full items-center justify-center gap-3 rounded-xl border border-slate-200 py-2.5 text-sm font-bold text-slate-700 transition-colors hover:bg-slate-50"
                        >
                            <div className="h-5 w-5 rounded-full bg-slate-200"></div>{' '}
                            Continue with Apple
                        </button>
                    </div>

                    <div className="my-8 flex items-center">
                        <div className="flex-grow border-t border-slate-200"></div>
                        <span className="px-4 text-sm text-slate-400">or</span>
                        <div className="flex-grow border-t border-slate-200"></div>
                    </div>

                    <form onSubmit={submit} className="space-y-5">
                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-slate-700">
                                Email or username
                            </label>
                            <input
                                name="identifier"
                                value={data.identifier}
                                onChange={(e) =>
                                    setData('identifier', e.target.value)
                                }
                                type="text"
                                placeholder="you@example.com"
                                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm transition-all outline-none placeholder:text-slate-400 focus:border-sky-500 focus:bg-white focus:ring-2 focus:ring-sky-500"
                            />
                            {errors.identifier && (
                                <div className="mt-1 text-sm text-red-600">
                                    {errors.identifier}
                                </div>
                            )}
                        </div>

                        <div>
                            <div className="mb-1.5 flex items-center justify-between">
                                <label className="block text-sm font-medium text-slate-700">
                                    Password
                                </label>
                                <a
                                    href="/forgot-password"
                                    className="text-sm font-medium text-sky-500 transition-colors hover:text-sky-600"
                                >
                                    Forgot password?
                                </a>
                            </div>
                            <input
                                name="password"
                                value={data.password}
                                onChange={(e) =>
                                    setData('password', e.target.value)
                                }
                                type="password"
                                placeholder="••••••••"
                                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm tracking-widest transition-all outline-none placeholder:tracking-normal placeholder:text-slate-400 focus:border-sky-500 focus:bg-white focus:ring-2 focus:ring-sky-500"
                            />
                            {errors.password && (
                                <div className="mt-1 text-sm text-red-600">
                                    {errors.password}
                                </div>
                            )}
                        </div>

                        <div className="flex items-center justify-between">
                            <label className="inline-flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={data.remember}
                                    onChange={(e) =>
                                        setData('remember', e.target.checked)
                                    }
                                    className="accent-sky-500"
                                />
                                <span className="text-sm text-slate-600">
                                    Remember me
                                </span>
                            </label>
                        </div>

                        <button
                            type="submit"
                            disabled={processing}
                            className="mt-4 w-full rounded-xl bg-sky-500 py-3 font-bold text-white shadow-sm shadow-sky-500/20 transition-colors hover:bg-sky-600"
                        >
                            Sign in
                        </button>
                    </form>

                    <p className="mt-8 text-center text-sm text-slate-500">
                        Don't have an account?{' '}
                        <a
                            href="/register"
                            className="font-bold text-sky-500 transition-colors hover:text-sky-600"
                        >
                            Create one
                        </a>
                    </p>
                </div>

                <button className="absolute right-6 bottom-6 flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 font-bold text-white shadow-lg transition-transform hover:-translate-y-0.5">
                    ?
                </button>
            </div>
        </div>
    );
};

export default Login;
