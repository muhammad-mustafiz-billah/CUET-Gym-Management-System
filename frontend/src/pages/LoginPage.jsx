import React, { useState } from 'react';
import Button from '../components/Button';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const response = await axios.post('http://localhost:5000/api/auth/login', {
                email,
                password
            });

            const { user, token } = response.data;
            login(user, token);

            if (user.role === 'admin') {
                navigate('/dashboard');
            } else {
                navigate('/user-dashboard');
            }
        } catch (err) {
            console.error('Login error:', err);
            setError(err.response?.data?.message || 'Failed to login');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-black">
            {/* Liquid Blobs Background */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 opacity-50">
                <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-600 rounded-full mix-blend-screen filter blur-3xl opacity-40 animate-blob"></div>
                <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-purple-600 rounded-full mix-blend-screen filter blur-3xl opacity-40 animate-blob animation-delay-2000"></div>
                <div className="absolute bottom-[-20%] left-[20%] w-96 h-96 bg-pink-600 rounded-full mix-blend-screen filter blur-3xl opacity-40 animate-blob animation-delay-4000"></div>
            </div>

            <div className="max-w-md w-full space-y-8 p-10 backdrop-filter backdrop-blur-xl bg-gray-900/40 border border-white/10 rounded-3xl shadow-2xl relative z-10 animate-fade-in-up">
                <div>
                    <h2 className="mt-6 text-center text-4xl font-black tracking-tighter text-white">
                        Welcome Back
                    </h2>

                </div>
                {error && (
                    <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded-xl text-sm text-center">
                        {error}
                    </div>
                )}
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <input type="hidden" name="remember" value="true" />
                    <div className="rounded-md shadow-sm space-y-4">
                        <div>
                            <label htmlFor="email-address" className="sr-only">Email address</label>
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
                            <label htmlFor="password" className="sr-only">Password</label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                required
                                className="appearance-none rounded-xl relative block w-full px-4 py-3 border border-gray-700 placeholder-gray-500 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:z-10 sm:text-sm bg-gray-800/50 backdrop-blur-sm transition-all"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <input
                                id="remember-me"
                                name="remember-me"
                                type="checkbox"
                                className="h-4 w-4 text-blue-500 focus:ring-blue-500 border-gray-600 rounded bg-gray-700"
                            />
                            <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-300">
                                Remember me
                            </label>
                        </div>

                        <div className="text-sm">
                            <Link to="/forgot-password" className="font-medium text-blue-400 hover:text-blue-300 transition-colors">
                                Forgot password?
                            </Link>
                        </div>
                    </div>

                    <div>
                        <Button type="submit" variant="primary" className="w-full py-3 text-lg font-bold shadow-lg shadow-blue-900/30 hover:shadow-blue-900/50 transform hover:-translate-y-0.5 transition-all bg-gradient-to-r from-blue-600 to-purple-600 border-none">
                            Sign in
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;
