import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/Button';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        // Mock API call
        console.log('Reset password for:', email);
        setSubmitted(true);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-black py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            {/* Liquid Blobs Background */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 opacity-50">
                <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-blue-600 rounded-full mix-blend-screen filter blur-3xl opacity-30 animate-blob"></div>
                <div className="absolute top-[20%] left-[-10%] w-96 h-96 bg-purple-600 rounded-full mix-blend-screen filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
            </div>

            <div className="max-w-md w-full space-y-8 bg-gray-900/40 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl animate-fade-in-up">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-black tracking-tighter text-white">
                        Reset Password
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-400">
                        Enter your email address and we'll send you a link to reset your password.
                    </p>
                </div>

                {!submitted ? (
                    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="email-address" className="sr-only">
                                Email address
                            </label>
                            <input
                                id="email-address"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                className="appearance-none rounded-xl relative block w-full px-4 py-3 border border-gray-700 placeholder-gray-500 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:z-10 sm:text-sm bg-gray-800/50 backdrop-blur-sm transition-all"
                                placeholder="Email address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>

                        <div>
                            <Button type="submit" className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-lg shadow-blue-900/30 transition-all">
                                Send Reset Link
                            </Button>
                        </div>

                        <div className="text-center">
                            <Link to="/login" className="font-medium text-blue-400 hover:text-blue-300 transition-colors">
                                Back to Login
                            </Link>
                        </div>
                    </form>
                ) : (
                    <div className="mt-8 space-y-6">
                        <div className="rounded-xl bg-green-900/20 border border-green-900/50 p-4">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <span className="text-green-400">✅</span>
                                </div>
                                <div className="ml-3">
                                    <h3 className="text-sm font-medium text-green-400">
                                        Check your email
                                    </h3>
                                    <div className="mt-2 text-sm text-green-300/80">
                                        <p>
                                            We have sent a password reset link to <strong>{email}</strong>.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="text-center">
                            <Link to="/login" className="font-medium text-blue-400 hover:text-blue-300 transition-colors">
                                Back to Login
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ForgotPassword;
