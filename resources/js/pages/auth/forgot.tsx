import React from 'react';
import { useForm } from '@inertiajs/react';

const ForgotPassword = () => {
    const { data, setData, post, processing, errors } = useForm({ email: '' });

    function submit(e: React.FormEvent) {
        e.preventDefault();
        post('/forgot-password');
    }

    return (
        <div className="flex min-h-screen items-center justify-center">
            <div className="w-full max-w-md rounded-lg bg-white p-8 shadow">
                <h2 className="mb-4 text-2xl font-bold">Reset your password</h2>
                <p className="mb-4 text-sm text-slate-500">
                    Enter your email and we'll send you a link to reset your
                    password.
                </p>
                <form onSubmit={submit} className="space-y-4">
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
                    <button
                        type="submit"
                        disabled={processing}
                        className="w-full rounded bg-sky-500 py-2 text-white"
                    >
                        Send reset link
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ForgotPassword;
