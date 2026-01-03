require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/error');

// Try to connect to database (will continue in demo mode if fails)
connectDB().catch(err => {
  console.log('⚠️  MongoDB connection failed. Running in DEMO MODE.');
  console.log('   Demo credentials:');
  console.log('   - Admin: admin@demo.com / admin123');
  console.log('   - HR: hr@demo.com / hr123');
  console.log('   - Employee: employee@demo.com / emp123');
});

const app = express();

// Body parser
app.use(express.json());

// Enable CORS
app.use(cors({
  origin: [process.env.FRONTEND_URL || 'http://localhost:5173', 'http://localhost:5174'],
  credentials: true
}));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/employees', require('./routes/employees'));
app.use('/api/attendance', require('./routes/attendance'));
app.use('/api/leaves', require('./routes/leaves'));
app.use('/api/payroll', require('./routes/payroll'));
app.use('/api/notifications', require('./routes/notifications'));

// Health check
app.get('/api/health', (req, res) => {
  const dbConnected = mongoose.connection.readyState === 1;
  res.json({ 
    status: 'OK', 
    message: 'Dayflow HRMS API is running',
    demoMode: !dbConnected,
    database: dbConnected ? 'connected' : 'not connected (demo mode)'
  });
});

// Error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
