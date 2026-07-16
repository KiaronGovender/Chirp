import React from 'react';
import { useForm } from '@inertiajs/react';

const Reset = ({ token, email }: { token?: string; email?: string }) => {
    const { data, setData, post, processing, errors } = useForm({
        token: token || '',
        email: email || '',
        password: '',
        password_confirmation: '',
    });

    function submit(e: React.FormEvent) {
        e.preventDefault();
        post('/reset-password');
    }

    return (
        <div className="flex min-h-screen items-center justify-center">
            <div className="w-full max-w-md rounded-lg bg-white p-8 shadow">
                <h2 className="mb-4 text-2xl font-bold">
                    Create a new password
                </h2>
                <form onSubmit={submit} className="space-y-4">
                    <input type="hidden" name="token" value={data.token} />
                    <div>
                        <label className="block text-sm font-medium text-slate-700">
                            Email
                        </label>
                        <input
                            name="email"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            className="mt-1 w-full rounded border px-3 py-2"
                        />
                        {errors.email && (
                            <div className="text-sm text-red-600">
                                {errors.email}
                            </div>
                        )}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700">
                            New password
                        </label>
                        <input
                            name="password"
                            type="password"
                            value={data.password}
                            onChange={(e) =>
                                setData('password', e.target.value)
                            }
                            className="mt-1 w-full rounded border px-3 py-2"
                        />
                        {errors.password && (
                            <div className="text-sm text-red-600">
                                {errors.password}
                            </div>
                        )}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700">
                            Confirm password
                        </label>
                        <input
                            name="password_confirmation"
                            type="password"
                            value={data.password_confirmation}
                            onChange={(e) =>
                                setData('password_confirmation', e.target.value)
                            }
                            className="mt-1 w-full rounded border px-3 py-2"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={processing}
                        className="w-full rounded bg-sky-500 py-2 text-white"
                    >
                        Reset password
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Reset;
