import { router } from '@inertiajs/react';

const VerifyNotice = () => {
    return (
        <div className="flex min-h-screen items-center justify-center">
            <div className="w-full max-w-md rounded-lg bg-white p-8 text-center shadow">
                <h2 className="mb-4 text-2xl font-bold">Verify your email</h2>
                <p className="mb-4 text-sm text-slate-500">
                    A verification link was sent to your email. Please check
                    your inbox.
                </p>
                <div className="space-y-3">
                    <button
                        onClick={() =>
                            router.post('/email/verification-notification')
                        }
                        className="w-full rounded bg-sky-500 py-2 text-white"
                    >
                        Resend verification email
                    </button>
                    <a href="/" className="block text-sm text-slate-600">
                        Back to home
                    </a>
                </div>
            </div>
        </div>
    );
};

export default VerifyNotice;
