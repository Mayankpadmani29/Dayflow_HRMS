const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  checkIn: {
    type: Date
  },
  checkOut: {
    type: Date
  },
  status: {
    type: String,
    enum: ['present', 'absent', 'half-day', 'leave', 'holiday'],
    default: 'absent'
  },
  workHours: {
    type: Number,
    default: 0
  },
  notes: {
    type: String
  }
}, {
  timestamps: true
});

// Index for efficient queries
attendanceSchema.index({ user: 1, date: 1 }, { unique: true });

// Calculate work hours before save
attendanceSchema.pre('save', function(next) {
  if (this.checkIn && this.checkOut) {
    const diff = this.checkOut - this.checkIn;
    this.workHours = Math.round((diff / (1000 * 60 * 60)) * 100) / 100;
  }
  next();
});

module.exports = mongoose.model('Attendance', attendanceSchema);
