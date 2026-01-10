import React, { useState, useEffect } from 'react';
import Card from '../components/Card';
import Button from '../components/Button';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Dashboard = () => {
    const navigate = useNavigate();
    const [totalMembers, setTotalMembers] = useState('0');
    const [activeTrainers, setActiveTrainers] = useState(0);
    const [todayAttendance, setTodayAttendance] = useState(0);
    const [activityFeed, setActivityFeed] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch Members
                const membersRes = await axios.get('http://localhost:5000/api/members');
                if (Array.isArray(membersRes.data)) {
                    setTotalMembers(membersRes.data.length);
                }

                // Fetch Trainers
                const trainersRes = await axios.get('http://localhost:5000/api/trainers');
                if (Array.isArray(trainersRes.data)) {
                    // Count 'active/available' trainers. adjusting logic as needed based on schema
                    // Assuming 'status' field exists and 'Available' is the key
                    const activeCount = trainersRes.data.filter(t => t.status === 'Available').length;
                    setActiveTrainers(activeCount);
                }

                // Fetch Attendance for Today & Live Activity
                const attendanceRes = await axios.get('http://localhost:5000/api/attendance');
                if (Array.isArray(attendanceRes.data)) {
                    const now = new Date();
                    const todayStr = now.toISOString().split('T')[0]; // YYYY-MM-DD

                    // Filter for today
                    const todaysRecords = attendanceRes.data.filter(a => a.date === todayStr);
                    setTodayAttendance(todaysRecords.length);

                    // Generate Activity Feed
                    // We consider ALL records for history or just today? 
                    // "Live activity" usually implies recent. Let's take all recent records (e.g. last 50) and process them to find the very latest events across dates if needed, 
                    // BUT user said "when a user is checked in ... it will show up". 
                    // Let's process ALL fetched records to find the latest events.

                    let events = [];
                    attendanceRes.data.forEach(record => {
                        // Check In Event
                        // Create a timestamp for sorting
                        // Note: record.date is YYYY-MM-DD, record.time is HH:MM AM/PM
                        const dateStr = record.date;
                        const timeStr = record.time;
                        // specific parsing might be strictly needed if we want perfect sorting across days
                        // For simply "Live", string comparison of date + time is roughly okay if format is consistent, 
                        // but let's try to be decent.

                        events.push({
                            user: record.name,
                            action: 'Checked in',
                            timeString: record.time, // Display time
                            dateString: record.date,
                            rawTime: new Date(`${dateStr} ${timeStr}`), // Best effort parse
                            icon: '📍',
                            color: 'bg-green-500/10 text-green-400'
                        });

                        // Check Out Event
                        if (record.exitTime) {
                            events.push({
                                user: record.name,
                                action: 'Checked out',
                                timeString: record.exitTime,
                                dateString: record.date,
                                rawTime: new Date(`${dateStr} ${record.exitTime}`),
                                icon: '👋',
                                color: 'bg-gray-700/50 text-gray-400'
                            });
                        }
                    });

                    // Sort by rawTime descending
                    events.sort((a, b) => b.rawTime - a.rawTime);

                    // Add relative time text (e.g., "Just now", "2 hours ago")
                    const enrichedEvents = events.slice(0, 10).map(e => {
                        const diffInSeconds = Math.floor((new Date() - e.rawTime) / 1000);
                        let timeAgo = '';
                        if (diffInSeconds < 60) timeAgo = 'Just now';
                        else if (diffInSeconds < 3600) timeAgo = `${Math.floor(diffInSeconds / 60)} mins ago`;
                        else if (diffInSeconds < 86400) timeAgo = `${Math.floor(diffInSeconds / 3600)} hours ago`;
                        else timeAgo = e.dateString; // Show date if older than 24h

                        return { ...e, time: timeAgo };
                    });

                    setActivityFeed(enrichedEvents);
                }

            } catch (error) {
                console.error("Error fetching dashboard stats:", error);
            }
        };
        fetchData();
        // Poll every 30 seconds for live updates
        const interval = setInterval(fetchData, 30000);
        return () => clearInterval(interval);
    }, []);

    return (
        // Adjusted height to strictly fit within MainLayout (100vh - Header 80px - Footer ~75px - Padding)
        // Increased height to close the bottom gap as per user request
        <div className="h-[calc(100vh-155px)] flex flex-col p-6 pt-2 animate-fade-in-up overflow-hidden">
            {/* Header Section */}
            <div className="flex justify-between items-end mb-2 shrink-0">
                <div>
                    <h2 className="text-3xl font-black text-white tracking-tighter">Overview</h2>
                    <p className="text-gray-400 font-medium">Welcome back, Admin</p>
                </div>
                <div className="flex space-x-3">
                </div>
            </div>

            {/* KPI Cards Row (Fixed Height) */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4 shrink-0 h-32">
                <Card
                    onClick={() => navigate('/dashboard/members')}
                    className="cursor-pointer bg-gray-900/60 border-gray-800/50 backdrop-blur-xl p-5 flex flex-col justify-center relative overflow-hidden group hover:border-blue-500/30 transition-all duration-300"
                >
                    <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <span className="text-6xl">👥</span>
                    </div>
                    <p className="text-gray-400 text-sm font-semibold uppercase tracking-wider mb-1">Total Members</p>
                    <div className="flex items-baseline space-x-2">
                        <span className="text-3xl font-black text-white">{totalMembers}</span>
                        <span className="text-green-400 text-sm font-bold flex items-center bg-green-400/10 px-2 py-0.5 rounded-full">
                            ↑ 12%
                        </span>
                    </div>
                </Card>

                <Card className="bg-gray-900/60 border-gray-800/50 backdrop-blur-xl p-5 flex flex-col justify-center relative overflow-hidden group hover:border-purple-500/30 transition-all duration-300">
                    <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <span className="text-6xl">💪</span>
                    </div>
                    <p className="text-gray-400 text-sm font-semibold uppercase tracking-wider mb-1">Active Trainers</p>
                    <div className="flex items-baseline space-x-2">
                        <span className="text-3xl font-black text-white">{activeTrainers}</span>
                        <span className="text-gray-500 text-xs font-medium bg-gray-800 px-2 py-0.5 rounded-full">Available Now</span>
                    </div>
                </Card>

                <Card className="bg-gray-900/60 border-gray-800/50 backdrop-blur-xl p-5 flex flex-col justify-center relative overflow-hidden group hover:border-pink-500/30 transition-all duration-300">
                    <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <span className="text-6xl">📍</span>
                    </div>
                    <p className="text-gray-400 text-sm font-semibold uppercase tracking-wider mb-1">Avg. Attendance</p>
                    <div className="flex items-baseline space-x-2">
                        <span className="text-3xl font-black text-white">{todayAttendance}</span>
                        <span className="text-blue-400 text-sm font-bold">Today</span>
                    </div>
                </Card>

                <Card className="bg-gray-900/60 border-gray-800/50 backdrop-blur-xl p-5 flex flex-col justify-center relative overflow-hidden group hover:border-yellow-500/30 transition-all duration-300">
                    <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <span className="text-6xl">🔧</span>
                    </div>
                    <p className="text-gray-400 text-sm font-semibold uppercase tracking-wider mb-1">Equipment</p>
                    <div className="flex items-baseline space-x-2">
                        <span className="text-3xl font-black text-white">98%</span>
                        <span className="text-yellow-500 text-sm font-bold bg-yellow-500/10 px-2 py-0.5 rounded-full">2 Alerts</span>
                    </div>
                </Card>
            </div>

            {/* Bottom Section (Fill remaining height) */}
            <div className="flex-1 min-h-0 overflow-hidden">
                {/* Activity Feed (Full Width & Height) */}
                <Card className="w-full h-full bg-gray-900/60 border-gray-800/50 backdrop-blur-xl flex flex-col overflow-hidden">
                    <div className="p-6 border-b border-gray-800/50 flex justify-between items-center shrink-0">
                        <h3 className="text-lg font-bold text-white flex items-center">
                            <span className="mr-2">📡</span> Live Activity
                        </h3>
                        <button className="text-xs text-blue-400 hover:text-blue-300 font-medium uppercase tracking-wider">View All</button>
                    </div>
                    <div className="flex-1 overflow-y-auto p-0 scrollbar-thin scrollbar-thumb-gray-800 scrollbar-track-transparent hover:scrollbar-thumb-gray-700">
                        <div className="divide-y divide-gray-800/50">
                            {activityFeed.length > 0 ? (
                                activityFeed.map((item, index) => (
                                    <div key={index} className="flex items-center justify-between p-6 hover:bg-white/5 transition-colors">
                                        <div className="flex items-center space-x-5">
                                            <div className={`h-14 w-14 rounded-2xl flex items-center justify-center text-2xl ${item.color} border border-white/5`}>
                                                {item.icon}
                                            </div>
                                            <div>
                                                <p className="text-gray-200 font-bold text-lg">{item.user}</p>
                                                <p className="text-gray-500 text-sm mt-1">{item.action}</p>
                                            </div>
                                        </div>
                                        <span className="text-gray-600 text-sm font-medium whitespace-nowrap">{item.time}</span>
                                    </div>
                                ))
                            ) : (
                                <div className="p-6 text-center text-gray-500 text-sm">No recent activity</div>
                            )}
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default Dashboard;
