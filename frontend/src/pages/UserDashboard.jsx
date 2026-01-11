import React, { useState, useEffect } from 'react';
import MainLayout from '../layouts/MainLayout';
import Card from '../components/Card';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const UserDashboard = () => {
    const { user } = useAuth();
    const [status, setStatus] = useState({ title: 'Loading...', subtitle: 'Please wait', color: 'text-blue-400' });

    // Helper to parse time strings like "06:30 AM - 07:30 AM" or multi-line
    const parseTimeRanges = (timeString) => {
        if (!timeString || timeString === '--') return [];

        // Regex to find times like 6:30 AM
        const regex = /(\d{1,2}:\d{2})\s*([APap][Mm])/g;
        let match;
        const times = [];

        while ((match = regex.exec(timeString)) !== null) {
            times.push(match[0]);
        }

        // Group into pairs [start, end]
        const ranges = [];
        for (let i = 0; i < times.length; i += 2) {
            if (times[i + 1]) {
                ranges.push({ start: times[i], end: times[i + 1] });
            }
        }
        return ranges;
    };

    // Helper to create Date object for a specific time string on a specific date
    const getDateForTime = (dateBase, timeStr) => {
        const [time, period] = timeStr.split(/\s+/);
        let [hours, minutes] = time.split(':').map(Number);

        if (period.toUpperCase() === 'PM' && hours !== 12) hours += 12;
        if (period.toUpperCase() === 'AM' && hours === 12) hours = 0;

        const date = new Date(dateBase);
        date.setHours(hours, minutes, 0, 0);
        return date;
    };

    useEffect(() => {
        const fetchScheduleAndCalculate = async () => {
            try {
                // Determine gender-based field
                // Logic: If email contains 'student', use gender times. Else (Teacher/Staff), use staffTime.
                const isStudent = user?.email?.toLowerCase().includes('student');
                let timeField;

                if (isStudent) {
                    const gender = user?.gender || 'Male';
                    timeField = gender.toLowerCase() === 'female' ? 'femaleStudentTime' : 'maleStudentTime';
                } else {
                    timeField = 'staffTime'; // Default for teachers/admins
                }

                // Fetch schedules
                // Note: In a real app we might cache this or store in context
                const response = await axios.get('http://localhost:5000/api/schedule');
                const schedules = response.data;

                const daysMap = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
                const now = new Date();
                const currentDayIndex = now.getDay();

                let foundNext = false;

                // Check next 7 days (including today)
                for (let i = 0; i < 7; i++) {
                    const checkDate = new Date(now);
                    checkDate.setDate(now.getDate() + i);

                    const dayName = daysMap[checkDate.getDay()];
                    const daySchedule = schedules.find(s => s.day === dayName);

                    if (daySchedule && daySchedule[timeField]) {
                        const ranges = parseTimeRanges(daySchedule[timeField]);

                        for (const range of ranges) {
                            const startTime = getDateForTime(checkDate, range.start);
                            const endTime = getDateForTime(checkDate, range.end);

                            // Adjust for overnight shifts (if end < start) - assumed not creating this complexity yet per simple seed

                            if (i === 0) {
                                // Today
                                if (now >= startTime && now < endTime) {
                                    // ACTIVE SESSION
                                    const diffMs = endTime - now;
                                    const diffMins = Math.ceil(diffMs / (1000 * 60));
                                    const hours = Math.floor(diffMins / 60);
                                    const mins = diffMins % 60;

                                    setStatus({
                                        title: `${hours > 0 ? `${hours}h ` : ''}${mins}m Remaining`,
                                        subtitle: 'Session in Progress',
                                        color: 'text-green-400'
                                    });
                                    foundNext = true;
                                    break;
                                } else if (now < startTime) {
                                    // UPCOMING TODAY
                                    setStatus({
                                        title: `Today, ${range.start}`,
                                        subtitle: 'Upcoming Workout',
                                        color: 'text-blue-400'
                                    });
                                    foundNext = true;
                                    break;
                                }
                            } else {
                                // Future Day
                                setStatus({
                                    title: `${dayName}, ${range.start}`,
                                    subtitle: 'Next Workout',
                                    color: 'text-blue-400'
                                });
                                foundNext = true;
                                break;
                            }
                        }
                    }
                    if (foundNext) break;
                }

                if (!foundNext) {
                    setStatus({ title: 'No Upcoming', subtitle: 'Check Schedule', color: 'text-gray-400' });
                }

            } catch (error) {
                console.error('Error fetching schedule:', error);
                setStatus({ title: 'Error', subtitle: 'Could not load', color: 'text-red-400' });
            }
        };

        fetchScheduleAndCalculate();
        const interval = setInterval(fetchScheduleAndCalculate, 60000); // Check every minute
        return () => clearInterval(interval);
    }, [user]);

    const [attendanceCount, setAttendanceCount] = useState(0);
    const [attendanceHistory, setAttendanceHistory] = useState([]);

    // ... (existing helper functions) ...

    useEffect(() => {
        const fetchData = async () => {
            if (!user) return;
            try {
                // Determine Schedule Field
                // Logic: If email contains 'student', use gender times. Else (Teacher/Staff), use staffTime.
                const isStudent = user.email.toLowerCase().includes('student');
                let timeField;

                if (isStudent) {
                    const gender = user?.gender || 'Male';
                    timeField = gender.toLowerCase() === 'female' ? 'femaleStudentTime' : 'maleStudentTime';
                } else {
                    timeField = 'staffTime';
                }

                const scheduleRes = await axios.get('http://localhost:5000/api/schedule');
                const schedules = scheduleRes.data;

                // ... (time calculation logic same as before, essentially) ...
                // Re-implementing the calculate logic inside this combined effect or keeping it separate.
                // To minimize diff noise, I will keep the original effect separate if possible, 
                // but since I'm rewriting the logic block, I'll merge or add parallel effect.

                // Let's add independent fetch for attendance
                let idToFetch = user.memberId || user.id;

                // Try to parse ID from email if memberId is not explicitly set (common for new signups)
                // Format: u1704128@student.cuet.ac.bd -> 1704128
                if (!user.memberId && user.email) {
                    const studentMatch = user.email.match(/^u(\d+)@student\.cuet\.ac\.bd$/);
                    if (studentMatch) {
                        idToFetch = studentMatch[1];
                    }
                }

                const attendanceRes = await axios.get(`http://localhost:5000/api/attendance/${idToFetch}`);
                const myAttendance = attendanceRes.data;

                // Filter for current month
                const now = new Date();
                const currentMonth = now.getMonth();
                const currentYear = now.getFullYear();

                const thisMonthCount = myAttendance.filter(record => {
                    const recordDate = new Date(record.date);
                    return recordDate.getMonth() === currentMonth && recordDate.getFullYear() === currentYear;
                }).length;

                setAttendanceCount(thisMonthCount);
                // Sort by date/time descending
                setAttendanceHistory(myAttendance.sort((a, b) => new Date(b.date + ' ' + b.time) - new Date(a.date + ' ' + a.time)));

            } catch (error) {
                console.error('Error loading dashboard data:', error);
            }
        };
        fetchData();
    }, [user]);

    // Original Schedule Effect (kept for simplicity of editing, assuming it handles status update)
    // NOTE: In previous step I added an interval. I should probably inject the attendance fetch there or separate it.
    // For safety, I will ADD a new useEffect for Attendance so I don't break the complex schedule logic I just wrote.

    useEffect(() => {
        if (user?.id) {
            let idToFetch = user.memberId || user.id;
            // Try to parse ID from email if memberId is not explicitly set
            if (!user.memberId && user.email) {
                const studentMatch = user.email.match(/^u(\d+)@student\.cuet\.ac\.bd$/);
                if (studentMatch) {
                    idToFetch = studentMatch[1];
                }
            }
            axios.get(`http://localhost:5000/api/attendance/${idToFetch}`)
                .then(res => {
                    const now = new Date();
                    const count = res.data.filter(r => {
                        const d = new Date(r.date);
                        return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
                    }).length;
                    setAttendanceCount(count);
                })
                .catch(err => console.error(err));
        }
    }, [user]);

    return (
        <MainLayout>
            <div className="bg-black min-h-screen py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="mb-12 animate-fade-in-up">
                        <div className="flex justify-between items-end">
                            <div>
                                <h1 className="text-4xl font-bold text-white tracking-tight mb-2">Welcome back, {user?.name || 'User'}!</h1>
                                <p className="text-gray-400 text-lg">Here's what's happening today.</p>
                            </div>
                            <div className="text-right hidden sm:block">
                                <p className="text-xs text-gray-500 uppercase tracking-wider">Your Member ID</p>
                                <p className="text-xl font-mono text-blue-400">
                                    {user?.memberId || (user?.email && user.email.match(/^u(\d+)@student\.cuet\.ac\.bd$/) ? user.email.match(/^u(\d+)@student\.cuet\.ac\.bd$/)[1] : user?.id)}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Quick Stats */}
                        <div className="bg-gray-900 rounded-3xl p-8 border border-gray-800 hover:border-gray-700 transition-all duration-300 animate-fade-in-up delay-100">
                            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">
                                {status.subtitle === 'Session in Progress' ? 'Current Session' : 'Next Workout'}
                            </h3>
                            <p className={`text-3xl font-bold ${status.color} mb-1`}>{status.title}</p>
                            <p className="text-gray-400">{status.subtitle}</p>
                        </div>

                        <div className="bg-gray-900 rounded-3xl p-8 border border-gray-800 hover:border-gray-700 transition-all duration-300 animate-fade-in-up delay-300">
                            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Attendance</h3>
                            <p className="text-3xl font-bold text-purple-400 mb-1">{attendanceCount} Days</p>
                            <p className="text-gray-400">This month</p>
                        </div>


                        {/* Quick Actions */}
                        <div className="md:col-span-3 bg-gray-900 rounded-3xl p-8 border border-gray-800 animate-fade-in-up delay-400">
                            <h3 className="text-xl font-bold text-white mb-6">Quick Actions</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                <Link to="/equipment" className="group block p-6 bg-gray-800/50 rounded-2xl hover:bg-blue-900/20 border border-gray-700 hover:border-blue-800 transition-all duration-300 text-center">
                                    <span className="text-4xl block mb-3 group-hover:scale-110 transition-transform duration-300">🏋️</span>
                                    <span className="font-semibold text-gray-300 group-hover:text-blue-400 transition-colors">Check Equipment</span>
                                </Link>
                                <Link to="/schedule" className="group block p-6 bg-gray-800/50 rounded-2xl hover:bg-green-900/20 border border-gray-700 hover:border-green-800 transition-all duration-300 text-center">
                                    <span className="text-4xl block mb-3 group-hover:scale-110 transition-transform duration-300">📅</span>
                                    <span className="font-semibold text-gray-300 group-hover:text-green-400 transition-colors">View Schedule</span>
                                </Link>
                                <Link to="/trainers" className="group block p-6 bg-gray-800/50 rounded-2xl hover:bg-purple-900/20 border border-gray-700 hover:border-purple-800 transition-all duration-300 text-center">
                                    <span className="text-4xl block mb-3 group-hover:scale-110 transition-transform duration-300">👥</span>
                                    <span className="font-semibold text-gray-300 group-hover:text-purple-400 transition-colors">Book Trainer</span>
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Attendance History Section */}
                    <div className="md:col-span-3 bg-gray-900 rounded-3xl p-8 border border-gray-800 animate-fade-in-up delay-500 mt-6">
                        <h3 className="text-xl font-bold text-white mb-6">Recent Activity</h3>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-800">
                                <thead>
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Check In</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Check Out</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-800">
                                    {attendanceHistory.length > 0 ? (
                                        attendanceHistory.slice(0, 5).map((record) => (
                                            <tr key={record._id} className="hover:bg-gray-800/50 transition-colors">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                                    {record.date}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                                                    {record.time}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                                                    {record.exitTime || '-'}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${record.status === 'Checked Out'
                                                        ? 'bg-blue-900/20 text-blue-400 border border-blue-900/50'
                                                        : 'bg-green-900/20 text-green-400 border border-green-900/50'
                                                        }`}>
                                                        {record.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="4" className="px-6 py-4 text-center text-sm text-gray-500">
                                                No recent activity found.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
};

export default UserDashboard;
