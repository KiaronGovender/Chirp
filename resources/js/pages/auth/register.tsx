import { useForm } from '@inertiajs/react';
import React, { useState, useMemo, useEffect } from 'react';

const Register = () => {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        username: '',
        password: '',
    });

    const [step, setStep] = useState<number>(1);
    const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(
        null,
    );

    const passwordChecks = useMemo(() => {
        const pwd = data.password || '';

        return {
            length: pwd.length >= 8,
            uppercase: /[A-Z]/.test(pwd),
            number: /[0-9]/.test(pwd),
        };
    }, [data.password]);

    const [localErrors, setLocalErrors] = useState<{ name?: string; email?: string; username?: string }>({});

    // revert to step 1 if step 1 errors are returned from backend
    useEffect(() => {
        if (errors.name || errors.email || errors.username) {
            setStep(1);
        }
    }, [errors]);

    // debounce username availability
    useEffect(() => {
        const username = data.username ? data.username.replace(/^@+/, '') : '';

        if (!username) {
            setUsernameAvailable(null);

            return;
        }

        const id = setTimeout(() => {
            fetch(`/username/check?username=${encodeURIComponent(username)}`)
                .then((r) => r.json())
                .then((json) => setUsernameAvailable(Boolean(json.available)))
                .catch(() => setUsernameAvailable(null));
        }, 350);

        return () => clearTimeout(id);
    }, [data.username]);

    function next(e?: React.FormEvent) {
        e?.preventDefault();

        if (step === 1) {
            const errs: typeof localErrors = {};
            if (!data.name.trim()) {
                errs.name = 'Name is required';
            }
            if (!data.email.trim()) {
                errs.email = 'Email is required';
            } else if (!/\S+@\S+\.\S+/.test(data.email)) {
                errs.email = 'Email is invalid';
            }
            if (!data.username.trim()) {
                errs.username = 'Username is required';
            } else if (usernameAvailable === false) {
                errs.username = 'Username is already taken';
            }

            if (Object.keys(errs).length > 0) {
                setLocalErrors(errs);
                return;
            }

            setLocalErrors({});
            setStep(2);
            return;
        }
    }

    function back() {
        setStep((s) => Math.max(1, s - 1));
    }

    function submit(e: React.FormEvent) {
        e.preventDefault();
        post('/register', {
            transform: (data) => ({
                ...data,
                username: data.username.replace(/^@+/, ''),
            }),
        });
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
                    {step === 1 ? (
                        <>
                            <div className="mb-6">
                                <div className="h-1.5 rounded-full bg-slate-100">
                                    <div
                                        className="h-1.5 rounded-full bg-sky-400"
                                        style={{ width: '50%' }}
                                    />
                                </div>
                            </div>
                            <h2 className="mb-2 text-3xl font-black tracking-tight">
                                Create your account
                            </h2>
                            <p className="mb-8 text-slate-500">Step 1 of 2</p>

                            <form onSubmit={next} className="space-y-5">
                                <div>
                                    <label className="mb-1.5 block text-sm font-medium text-slate-700">
                                        Full name
                                    </label>
                                    <input
                                        name="name"
                                        value={data.name}
                                        onChange={(e) =>
                                            setData('name', e.target.value)
                                        }
                                        type="text"
                                        placeholder="Your name"
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm transition-all outline-none placeholder:text-slate-400 focus:border-sky-500 focus:bg-white focus:ring-2 focus:ring-sky-500"
                                    />
                                    {(errors.name || localErrors.name) && (
                                        <div className="mt-1 text-sm text-red-600">
                                            {errors.name || localErrors.name}
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <label className="mb-1.5 block text-sm font-medium text-slate-700">
                                        Email address
                                    </label>
                                    <input
                                        name="email"
                                        value={data.email}
                                        onChange={(e) =>
                                            setData('email', e.target.value)
                                        }
                                        type="email"
                                        placeholder="you@example.com"
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm transition-all outline-none placeholder:text-slate-400 focus:border-sky-500 focus:bg-white focus:ring-2 focus:ring-sky-500"
                                    />
                                    {(errors.email || localErrors.email) && (
                                        <div className="mt-1 text-sm text-red-600">
                                            {errors.email || localErrors.email}
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <label className="mb-1.5 block text-sm font-medium text-slate-700">
                                        Username
                                    </label>
                                    <input
                                        name="username"
                                        value={data.username}
                                        onChange={(e) =>
                                            setData('username', e.target.value)
                                        }
                                        type="text"
                                        placeholder="@yourhandle"
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm transition-all outline-none placeholder:text-slate-400 focus:border-sky-500 focus:bg-white focus:ring-2 focus:ring-sky-500"
                                    />
                                    {(errors.username || localErrors.username) && (
                                        <div className="mt-1 text-sm text-red-600">
                                            {errors.username || localErrors.username}
                                        </div>
                                    )}
                                    {usernameAvailable === true && !errors.username && !localErrors.username && (
                                        <div className="mt-1 text-sm text-emerald-600">
                                            Username is available
                                        </div>
                                    )}
                                    {usernameAvailable === false && !errors.username && !localErrors.username && (
                                        <div className="mt-1 text-sm text-red-600">
                                            Username is taken
                                        </div>
                                    )}
                                </div>

                                <button
                                    type="submit"
                                    className="mt-4 w-full rounded-xl bg-sky-500 py-3 font-bold text-white shadow-sm shadow-sky-500/20 transition-colors hover:bg-sky-600"
                                >
                                    Continue
                                </button>
                            </form>
                        </>
                    ) : (
                        <>
                            <div className="mb-6">
                                <div className="h-1.5 rounded-full bg-slate-100">
                                    <div
                                        className="h-1.5 rounded-full bg-sky-400"
                                        style={{ width: '100%' }}
                                    />
                                </div>
                            </div>
                            <h2 className="mb-2 text-3xl font-black tracking-tight">
                                Secure your account
                            </h2>
                            <p className="mb-8 text-slate-500">Step 2 of 2</p>

                            <form onSubmit={submit} className="space-y-5">
                                <div>
                                    <label className="mb-1.5 block text-sm font-medium text-slate-700">
                                        Password
                                    </label>
                                    <input
                                        name="password"
                                        value={data.password}
                                        onChange={(e) =>
                                            setData('password', e.target.value)
                                        }
                                        type="password"
                                        placeholder="At least 8 characters"
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm transition-all outline-none placeholder:text-slate-400 focus:border-sky-500 focus:bg-white focus:ring-2 focus:ring-sky-500"
                                    />
                                    {errors.password && (
                                        <div className="mt-1 text-sm text-red-600">
                                            {errors.password}
                                        </div>
                                    )}
                                </div>

                                <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4 text-sm text-slate-500">
                                    <div className="flex items-center gap-3">
                                        <div
                                            className={`h-4 w-4 rounded-full border ${passwordChecks.length ? 'border-sky-500 bg-sky-500' : 'border-slate-200'}`}
                                        />
                                        <div>8+ characters</div>
                                    </div>
                                    <div className="mt-3 flex items-center gap-3">
                                        <div
                                            className={`h-4 w-4 rounded-full border ${passwordChecks.uppercase ? 'border-sky-500 bg-sky-500' : 'border-slate-200'}`}
                                        />
                                        <div>One uppercase letter</div>
                                    </div>
                                    <div className="mt-3 flex items-center gap-3">
                                        <div
                                            className={`h-4 w-4 rounded-full border ${passwordChecks.number ? 'border-sky-500 bg-sky-500' : 'border-slate-200'}`}
                                        />
                                        <div>One number</div>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="mt-4 w-full rounded-xl bg-sky-500 py-3 font-bold text-white shadow-sm shadow-sky-500/20 transition-colors hover:bg-sky-600"
                                >
                                    Create account
                                </button>

                                <button
                                    type="button"
                                    onClick={back}
                                    className="mt-2 w-full rounded-xl border border-slate-200 bg-white py-3 font-medium text-slate-700"
                                >
                                    Back
                                </button>
                            </form>
                        </>
                    )}

                    <p className="mt-8 text-center text-sm text-slate-500">
                        Already have an account?{' '}
                        <a
                            href="/login"
                            className="font-bold text-sky-500 transition-colors hover:text-sky-600"
                        >
                            Sign in
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

export default Register;
