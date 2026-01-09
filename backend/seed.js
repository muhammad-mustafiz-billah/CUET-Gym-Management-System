const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Member = require('./models/Member');
const Trainer = require('./models/Trainer');
const Equipment = require('./models/Equipment');
const Attendance = require('./models/Attendance');
const Schedule = require('./models/Schedule');

dotenv.config();

// Connection logic moved to main execution block
// mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/gym-management-system')
//    .then(() => console.log('MongoDB Connected for Seeding'))
//    .catch(err => {
//        console.error('MongoDB Connection Error:', err);
//        process.exit(1);
//    });

const seedData = async () => {
    try {
        // Clear existing data
        await User.deleteMany({});
        await Member.deleteMany({});
        await Trainer.deleteMany({});
        await Equipment.deleteMany({});
        await Attendance.deleteMany({});
        await Schedule.deleteMany({});

        console.log('Data Cleared');

        // Create Users
        const salt = await bcrypt.genSalt(10);
        const adminPassword = await bcrypt.hash('admin123', salt);
        const userPassword = await bcrypt.hash('user123', salt);

        const users = await User.create([
            {
                name: 'Admin User',
                email: 'admin@cuet.ac.bd',
                password: adminPassword,
                role: 'admin',
                gender: 'Male',
                memberId: 'ADMIN01'
            },
            {
                name: 'Student 128',
                email: 'u2104128@student.cuet.ac.bd',
                password: userPassword,
                role: 'user',
                gender: 'Male',
                memberId: '2104128'
            },
            {
                name: 'Student 129',
                email: 'u2104129@student.cuet.ac.bd',
                password: userPassword,
                role: 'user',
                gender: 'Female',
                memberId: '2104129'
            },
            {
                name: 'Teacher User',
                email: 'teacher@cuet.ac.bd',
                password: userPassword,
                role: 'user',
                gender: 'Male',
                memberId: 'T1001'
            }
        ]);

        console.log('Users Created');

        // Create Members
        const members = await Member.create([
            { name: 'Alex Morgan', email: 'alex@example.com', status: 'Active', plan: 'Premium', gender: 'Female' },
            { name: 'John Wick', email: 'john@example.com', status: 'Active', plan: 'Standard', gender: 'Male' },
            { name: 'Sarah Connor', email: 'sarah@example.com', status: 'Inactive', plan: 'Basic', gender: 'Female' }
        ]);

        console.log('Members Created');

        // Create Trainers
        const trainers = await Trainer.create([
            { name: 'Mike Tyson', specialty: 'Boxing', status: 'Available' },
            { name: 'Arnold S', specialty: 'Bodybuilding', status: 'Booked' },
            { name: 'Ronda Rousey', specialty: 'MMA', status: 'Available' }
        ]);

        console.log('Trainers Created');

        const equipment = await Equipment.create([
            { name: 'Treadmill X1', status: 'Available', lastService: new Date() },
            { name: 'Rowing Machine', status: 'Under Maintenance', lastService: new Date() },
            { name: 'Cable Machine', status: 'Available', lastService: new Date() },
            { name: 'Dumbbells Set (5-50kg)', status: 'Available', lastService: new Date() },
            { name: 'Olympic Bench Press', status: 'Available', lastService: new Date() },
            { name: 'Elliptical Trainer Pro', status: 'Available', lastService: new Date() }
        ]);

        console.log('Equipment Created');

        // Create Attendance
        await Attendance.create([
            { userId: 'U001', name: 'Alex Morgan', gender: 'Female', hall: 'Main Gym', date: '2023-10-25', time: '08:30 AM', status: 'Present' },
            { userId: 'U002', name: 'John Wick', gender: 'Male', hall: 'Cardio Zone', date: '2023-10-25', time: '09:15 AM', status: 'Present' }
        ]);

        console.log('Attendance Created');

        // Create Schedules
        const weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'];
        const weekendDays = ['Friday', 'Saturday'];

        const scheduleData = [];

        // Weekdays (Sunday to Thursday)
        weekDays.forEach(day => {
            scheduleData.push({
                day: day,
                maleStudentTime: '1st Shift: 06:30 AM - 07:30 AM\n2nd Shift: 06:30 PM - 10:00 PM',
                femaleStudentTime: '04:00 PM - 06:00 PM',
                staffTime: '07:30 AM - 08:30 AM'
            });
        });

        // Friday
        scheduleData.push({
            day: 'Friday',
            maleStudentTime: '04:00 PM - 09:00 PM',
            femaleStudentTime: '10:00 AM - 12:00 PM',
            staffTime: '09:00 AM - 10:00 AM'
        });

        // Saturday
        scheduleData.push({
            day: 'Saturday',
            maleStudentTime: '04:00 PM - 09:00 PM',
            femaleStudentTime: '10:00 AM - 12:00 PM',
            staffTime: '09:00 AM - 10:00 AM'
        });

        await Schedule.create(scheduleData);
        console.log('Schedules Created');

        console.log('Database Seeded Successfully');
        console.log('Database Seeded Successfully');
        // process.exit(); // Do not exit if called programmatically
    } catch (err) {
        console.error('Error Seeding Database:', err);
        // process.exit(1); // Do not exit if called programmatically
        throw err; // Re-throw to handle in caller
    }
};

if (require.main === module) {
    mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/gym-management-system')
        .then(() => {
            console.log('MongoDB Connected for Seeding');
            return seedData();
        })
        .then(() => process.exit())
        .catch(err => {
            console.error(err);
            process.exit(1);
        });
}

module.exports = seedData;
