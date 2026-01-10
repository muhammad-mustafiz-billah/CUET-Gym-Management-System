import React from 'react';
import { Link } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import Button from '../components/Button';
import Card from '../components/Card';

const LandingPage = () => {
    // Removed scrollToFeatures as it's no longer needed in single view
    return (
        <MainLayout>
            {/* Adjusted height to account for approx 100px footer, ensuring everything fits in 100vh */}
            <div className="relative h-[calc(100vh-100px)] flex flex-col items-center justify-center overflow-hidden bg-gray-900 pt-20 pb-0">
                {/* Background Image with Overlay */}
                <div className="absolute top-0 left-0 w-full h-full -z-20">
                    <img
                        src="https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&q=80&w=1920"
                        alt="Gym Background"
                        className="w-full h-full object-cover filter blur-sm scale-105"
                    />
                    <div className="absolute top-0 left-0 w-full h-full bg-black/40"></div>
                </div>

                {/* Liquid Blobs Background (Subtle) */}
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 opacity-40">
                    <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-600 rounded-full mix-blend-overlay filter blur-3xl opacity-50 animate-blob"></div>
                    <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-purple-600 rounded-full mix-blend-overlay filter blur-3xl opacity-50 animate-blob animation-delay-2000"></div>
                    <div className="absolute bottom-[-20%] left-[20%] w-96 h-96 bg-pink-600 rounded-full mix-blend-overlay filter blur-3xl opacity-50 animate-blob animation-delay-4000"></div>
                </div>

                {/* Main Content Container - Using Flex to distribute vertically */}
                <div className="w-full max-w-7xl mx-auto px-4 flex flex-col justify-between h-full py-4">

                    {/* Hero Text Section */}
                    <div className="flex-grow flex flex-col justify-center items-center text-center z-10">
                        <div className="backdrop-filter backdrop-blur-sm bg-black/20 border border-white/5 rounded-3xl p-8 shadow-xl max-w-4xl w-full">
                            <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter mb-4 uppercase italic leading-none drop-shadow-md">
                                Unleash Your <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">Inner Beast</span>
                            </h1>
                            <p className="text-xl text-gray-100 mb-8 max-w-2xl mx-auto font-light leading-snug">
                                Stop wishing. Start doing. <span className="font-bold text-blue-400">Pain is weakness leaving the body.</span>
                            </p>
                            <div className="flex justify-center space-x-6">
                                <Link to="/login">
                                    <Button variant="primary" className="px-10 py-4 text-xl font-bold uppercase tracking-wider shadow-lg bg-gradient-to-r from-blue-600 to-purple-600 border-none text-white hover:scale-105 transition-transform">
                                        Start Now
                                    </Button>
                                </Link>
                                <Button className="px-10 py-4 text-xl font-bold uppercase tracking-wider bg-white/10 border border-white/30 text-white hover:bg-white/20 hover:scale-105 transition-all">
                                    Explore
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Features Row - Enlarged Buttons, Compact Layout */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full z-10 mt-2">
                        {/* Equipment Card */}
                        <Link to="/equipment" className="group relative overflow-hidden rounded-xl bg-gray-900/80 border border-gray-700/50 hover:border-blue-500/50 transition-all duration-300 backdrop-blur-md">
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                            <div className="p-6 flex flex-row items-center justify-between">
                                <div>
                                    <h3 className="text-xl font-bold text-white mb-1 group-hover:text-blue-400 transition-colors">Premium Gear</h3>
                                    <p className="text-gray-400 text-sm leading-tight">Modern biomechanical machines.</p>
                                </div>
                                <span className="text-3xl group-hover:scale-110 transition-transform duration-300">💪</span>
                            </div>
                        </Link>

                        {/* Flexible Timing Card */}
                        <Link to="/schedule" className="group relative overflow-hidden rounded-xl bg-gray-900/80 border border-gray-700/50 hover:border-pink-500/50 transition-all duration-300 backdrop-blur-md">
                            <div className="absolute inset-0 bg-gradient-to-tr from-pink-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                            <div className="p-6 flex flex-row items-center justify-between">
                                <div>
                                    <h3 className="text-xl font-bold text-white mb-1 group-hover:text-pink-400 transition-colors">Flexible Time</h3>
                                    <p className="text-gray-400 text-sm leading-tight">Sunrise yoga to late-night HIIT.</p>
                                </div>
                                <span className="text-3xl group-hover:rotate-12 transition-transform duration-300">📅</span>
                            </div>
                        </Link>

                        {/* Expert Guidance Card */}
                        <Link to="/trainers" className="group relative overflow-hidden rounded-xl bg-gray-900/80 border border-gray-700/50 hover:border-purple-500/50 transition-all duration-300 backdrop-blur-md">
                            <div className="absolute inset-0 bg-gradient-to-b from-purple-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                            <div className="p-6 flex flex-row items-center justify-between">
                                <div>
                                    <h3 className="text-xl font-bold text-white mb-1 group-hover:text-purple-400 transition-colors">Expert Pros</h3>
                                    <p className="text-gray-400 text-sm leading-tight">Certified trainers to push limits.</p>
                                </div>
                                <span className="text-3xl group-hover:scale-110 transition-transform duration-300">👥</span>
                            </div>
                        </Link>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
};

export default LandingPage;
