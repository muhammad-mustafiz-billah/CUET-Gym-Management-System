import React, { useState, useEffect } from 'react';
import Card from '../components/Card';
import Button from '../components/Button';
import axios from 'axios';

const AdminSchedule = () => {
    const [schedules, setSchedules] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [recordToEdit, setRecordToEdit] = useState(null);
    const [formData, setFormData] = useState({
        day: 'Sunday',
        maleStudentTime: '',
        femaleStudentTime: '',
        staffTime: ''
    });
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [scheduleToDelete, setScheduleToDelete] = useState(null);

    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    useEffect(() => {
        fetchSchedules();
    }, []);

    const fetchSchedules = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/schedule');
            setSchedules(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching schedules:', error);
            setLoading(false);
        }
    };

    const handleOpenModal = (record = null) => {
        if (record) {
            setRecordToEdit(record);
            setFormData({
                day: record.day,
                maleStudentTime: record.maleStudentTime,
                femaleStudentTime: record.femaleStudentTime,
                staffTime: record.staffTime
            });
        } else {
            setRecordToEdit(null);
            setFormData({
                day: 'Sunday',
                maleStudentTime: '',
                femaleStudentTime: '',
                staffTime: ''
            });
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setRecordToEdit(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (recordToEdit) {
                const response = await axios.put(`http://localhost:5000/api/schedule/${recordToEdit._id}`, formData);
                setSchedules(schedules.map(s => s._id === recordToEdit._id ? response.data : s));
            } else {
                const response = await axios.post('http://localhost:5000/api/schedule', formData);
                setSchedules([...schedules, response.data]);
            }
            handleCloseModal();
        } catch (error) {
            console.error('Error saving schedule:', error);
            alert('Failed to save schedule: ' + (error.response?.data?.message || 'Ensure Day is unique.'));
        }
    };

    const handleDeleteClick = (schedule, e) => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        setScheduleToDelete(schedule);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        if (!scheduleToDelete) return;

        try {
            await axios.delete(`http://localhost:5000/api/schedule/${scheduleToDelete._id}`);
            setSchedules(schedules.filter(s => s._id !== scheduleToDelete._id));
            setIsDeleteModalOpen(false);
            setScheduleToDelete(null);
        } catch (error) {
            console.error('Error deleting schedule:', error);
            alert('Failed to delete schedule: ' + (error.response?.data?.message || error.message));
        }
    };

    return (
        <div className="animate-fade-in-up">
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-bold text-white tracking-tight">Gym Schedule Management</h2>
                <Button
                    variant="primary"
                    onClick={() => handleOpenModal()}
                    className="bg-purple-600 hover:bg-purple-700 border-none shadow-lg shadow-purple-900/20"
                >
                    + Add Schedule
                </Button>
            </div>

            <Card className="bg-gray-900 border-gray-800 shadow-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-800">
                        <thead className="bg-black/40">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Day</th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Male Student</th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Female Student</th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Teacher/Staff</th>
                                <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-800">
                            {loading ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-4 text-center text-gray-400">Loading schedule...</td>
                                </tr>
                            ) : schedules.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-4 text-center text-gray-400">No schedule entries found.</td>
                                </tr>
                            ) : (
                                schedules.map((schedule) => (
                                    <tr key={schedule._id} className="hover:bg-gray-800/50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-white">
                                            {schedule.day}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-300">
                                            {schedule.maleStudentTime}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-300">
                                            {schedule.femaleStudentTime}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-300">
                                            {schedule.staffTime}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <button onClick={() => handleOpenModal(schedule)} className="text-blue-400 hover:text-blue-300 mr-4 transition-colors">Edit</button>
                                            <button onClick={(e) => handleDeleteClick(schedule, e)} className="text-red-400 hover:text-red-300 transition-colors">Delete</button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 w-full max-w-md shadow-2xl animate-fade-in-up">
                        <h3 className="text-xl font-bold text-white mb-4">{recordToEdit ? 'Edit Schedule' : 'Add Schedule'}</h3>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Day</label>
                                <select
                                    value={formData.day}
                                    onChange={(e) => setFormData({ ...formData, day: e.target.value })}
                                    className="w-full bg-gray-800 border-gray-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                                    disabled={!!recordToEdit} // Disable day selection when editing to prevent changing to an existing day easily without validation logic complexity (or can leave enabled but blocked by backend)
                                >
                                    {days.map(day => {
                                        // Check if day is already taken (and not the one we are currently editing)
                                        const isTaken = schedules.some(s => s.day === day && (!recordToEdit || recordToEdit.day !== day));
                                        return (
                                            <option key={day} value={day} disabled={isTaken}>
                                                {day} {isTaken ? '(Already Exists)' : ''}
                                            </option>
                                        );
                                    })}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Male Student Time</label>
                                <textarea
                                    rows="3"
                                    value={formData.maleStudentTime}
                                    onChange={(e) => setFormData({ ...formData, maleStudentTime: e.target.value })}
                                    className="w-full bg-gray-800 border-gray-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none resize-none"
                                    placeholder="e.g. 1st Shift: 6:30 AM - 7:30 AM&#10;2nd Shift: 6:30 PM - 10:00 PM"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Female Student Time</label>
                                <textarea
                                    rows="3"
                                    value={formData.femaleStudentTime}
                                    onChange={(e) => setFormData({ ...formData, femaleStudentTime: e.target.value })}
                                    className="w-full bg-gray-800 border-gray-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none resize-none"
                                    placeholder="e.g. 4:00 PM - 6:00 PM"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Teacher/Staff Time</label>
                                <textarea
                                    rows="3"
                                    value={formData.staffTime}
                                    onChange={(e) => setFormData({ ...formData, staffTime: e.target.value })}
                                    className="w-full bg-gray-800 border-gray-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none resize-none"
                                    placeholder="e.g. 7:30 AM - 8:30 AM"
                                />
                            </div>
                            <div className="flex justify-end space-x-3 mt-6">
                                <button
                                    type="button"
                                    onClick={handleCloseModal}
                                    className="px-4 py-2 text-sm font-medium text-gray-400 hover:text-white transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 text-sm font-medium bg-purple-600 hover:bg-purple-700 text-white rounded-lg shadow-lg shadow-purple-900/20 transition-all"
                                >
                                    Save
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {isDeleteModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 w-full max-w-sm shadow-2xl animate-fade-in-up">
                        <div className="text-center">
                            <h3 className="text-xl font-bold text-white mb-2">Delete Schedule?</h3>
                            <p className="text-gray-400 mb-6">
                                Are you sure you want to delete the schedule for <span className="text-white font-semibold">{scheduleToDelete?.day}</span>? This action cannot be undone.
                            </p>
                            <div className="flex justify-center space-x-4">
                                <button
                                    onClick={() => setIsDeleteModalOpen(false)}
                                    className="px-4 py-2 text-sm font-medium text-gray-400 hover:text-white transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={confirmDelete}
                                    className="px-4 py-2 text-sm font-medium bg-red-600 hover:bg-red-700 text-white rounded-lg shadow-lg shadow-red-900/20 transition-all"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminSchedule;
