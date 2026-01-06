const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
// Database Connection
const connectDB = async () => {
    try {
        let uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/gym-management-system';

        // Try connecting to the provided URI first
        try {
            await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
            console.log('MongoDB Connected');
        } catch (err) {
            console.log('Local MongoDB not found, starting in-memory database...');
            const { MongoMemoryServer } = require('mongodb-memory-server');
            const mongod = await MongoMemoryServer.create();
            uri = mongod.getUri();
            await mongoose.connect(uri);
            console.log('In-Memory MongoDB Connected at:', uri);

            // Auto-seed for in-memory
            console.log('Seeding in-memory database...');
            const seedData = require('./seed');
            await seedData();
        }
    } catch (err) {
        console.error('MongoDB Connection Error:', err);
    }
};

connectDB();

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/members', require('./routes/members'));
app.use('/api/trainers', require('./routes/trainers'));
app.use('/api/equipment', require('./routes/equipment'));
app.use('/api/attendance', require('./routes/attendance'));
app.use('/api/schedule', require('./routes/schedule'));
app.use('/api/equipment-requests', require('./routes/equipmentRequests'));

app.get('/', (req, res) => {
    res.send('Gym Management System API is running...');
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
