const mongoose = require('mongoose');

const payrollSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  month: {
    type: Number,
    required: true,
    min: 1,
    max: 12
  },
  year: {
    type: Number,
    required: true
  },
  basic: {
    type: Number,
    required: true
  },
  hra: {
    type: Number,
    default: 0
  },
  allowances: {
    type: Number,
    default: 0
  },
  overtime: {
    type: Number,
    default: 0
  },
  bonus: {
    type: Number,
    default: 0
  },
  deductions: {
    pf: { type: Number, default: 0 },
    tax: { type: Number, default: 0 },
    other: { type: Number, default: 0 }
  },
  totalEarnings: {
    type: Number,
    required: true
  },
  totalDeductions: {
    type: Number,
    required: true
  },
  netSalary: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'processed', 'paid'],
    default: 'pending'
  },
  paidAt: {
    type: Date
  },
  remarks: {
    type: String
  }
}, {
  timestamps: true
});

// Index for efficient queries
payrollSchema.index({ user: 1, month: 1, year: 1 }, { unique: true });

// Calculate totals before save
payrollSchema.pre('save', function(next) {
  this.totalEarnings = this.basic + this.hra + this.allowances + this.overtime + this.bonus;
  this.totalDeductions = this.deductions.pf + this.deductions.tax + this.deductions.other;
  this.netSalary = this.totalEarnings - this.totalDeductions;
  next();
});

module.exports = mongoose.model('Payroll', payrollSchema);
