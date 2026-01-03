const Payroll = require('../models/Payroll');
const User = require('../models/User');

// @desc    Get my payroll
// @route   GET /api/payroll/my
// @access  Private
exports.getMyPayroll = async (req, res) => {
  try {
    const { year } = req.query;
    
    let query = { user: req.user.id };
    
    if (year) {
      query.year = parseInt(year);
    }

    const payroll = await Payroll.find(query).sort({ year: -1, month: -1 });

    res.status(200).json({
      success: true,
      data: payroll
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get payroll slip
// @route   GET /api/payroll/:id
// @access  Private
exports.getPayrollSlip = async (req, res) => {
  try {
    const payroll = await Payroll.findById(req.params.id)
      .populate('user', 'firstName lastName employeeId department designation bankDetails');

    if (!payroll) {
      return res.status(404).json({
        success: false,
        message: 'Payroll record not found'
      });
    }

    // Check authorization
    if (req.user.role === 'employee' && payroll.user._id.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this payroll'
      });
    }

    res.status(200).json({
      success: true,
      data: payroll
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get all payroll (Admin/HR)
// @route   GET /api/payroll
// @access  Private (Admin/HR)
exports.getAllPayroll = async (req, res) => {
  try {
    const { month, year, status, page = 1, limit = 10 } = req.query;
    
    let query = {};
    
    if (month) query.month = parseInt(month);
    if (year) query.year = parseInt(year);
    if (status) query.status = status;

    const payroll = await Payroll.find(query)
      .populate('user', 'firstName lastName employeeId department designation')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ year: -1, month: -1 });

    const count = await Payroll.countDocuments(query);

    res.status(200).json({
      success: true,
      data: payroll,
      pagination: {
        total: count,
        page: parseInt(page),
        pages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Generate payroll
// @route   POST /api/payroll/generate
// @access  Private (Admin)
exports.generatePayroll = async (req, res) => {
  try {
    const { month, year, employeeIds } = req.body;

    // Get employees
    let query = { isActive: true };
    if (employeeIds && employeeIds.length > 0) {
      query._id = { $in: employeeIds };
    }

    const employees = await User.find(query);

    const payrollRecords = [];
    const errors = [];

    for (const employee of employees) {
      try {
        // Check if payroll already exists
        const existing = await Payroll.findOne({
          user: employee._id,
          month,
          year
        });

        if (existing) {
          errors.push(`Payroll already exists for ${employee.firstName} ${employee.lastName}`);
          continue;
        }

        const salary = employee.salary || { basic: 0, hra: 0, allowances: 0, deductions: 0 };
        
        const payroll = await Payroll.create({
          user: employee._id,
          month,
          year,
          basic: salary.basic,
          hra: salary.hra,
          allowances: salary.allowances,
          deductions: {
            pf: Math.round(salary.basic * 0.12),
            tax: Math.round((salary.basic + salary.hra + salary.allowances) * 0.1),
            other: salary.deductions
          },
          totalEarnings: salary.basic + salary.hra + salary.allowances,
          totalDeductions: 0, // Will be calculated by pre-save hook
          netSalary: 0 // Will be calculated by pre-save hook
        });

        payrollRecords.push(payroll);
      } catch (err) {
        errors.push(`Error generating payroll for ${employee.firstName}: ${err.message}`);
      }
    }

    res.status(201).json({
      success: true,
      message: `Generated ${payrollRecords.length} payroll records`,
      data: payrollRecords,
      errors
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update payroll
// @route   PUT /api/payroll/:id
// @access  Private (Admin)
exports.updatePayroll = async (req, res) => {
  try {
    const payroll = await Payroll.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!payroll) {
      return res.status(404).json({
        success: false,
        message: 'Payroll record not found'
      });
    }

    res.status(200).json({
      success: true,
      data: payroll
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Process payroll (mark as paid)
// @route   PUT /api/payroll/:id/process
// @access  Private (Admin)
exports.processPayroll = async (req, res) => {
  try {
    const payroll = await Payroll.findById(req.params.id);

    if (!payroll) {
      return res.status(404).json({
        success: false,
        message: 'Payroll record not found'
      });
    }

    payroll.status = 'paid';
    payroll.paidAt = new Date();
    await payroll.save();

    res.status(200).json({
      success: true,
      message: 'Payroll processed successfully',
      data: payroll
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get payroll stats
// @route   GET /api/payroll/stats
// @access  Private (Admin/HR)
exports.getPayrollStats = async (req, res) => {
  try {
    const { year = new Date().getFullYear() } = req.query;

    const monthlyStats = await Payroll.aggregate([
      { $match: { year: parseInt(year) } },
      {
        $group: {
          _id: '$month',
          totalNetSalary: { $sum: '$netSalary' },
          totalEarnings: { $sum: '$totalEarnings' },
          totalDeductions: { $sum: '$totalDeductions' },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    const statusStats = await Payroll.aggregate([
      { $match: { year: parseInt(year) } },
      { $group: { _id: '$status', count: { $sum: 1 }, total: { $sum: '$netSalary' } } }
    ]);

    const yearlyTotal = await Payroll.aggregate([
      { $match: { year: parseInt(year) } },
      {
        $group: {
          _id: null,
          totalNetSalary: { $sum: '$netSalary' },
          totalEarnings: { $sum: '$totalEarnings' },
          totalDeductions: { $sum: '$totalDeductions' }
        }
      }
    ]);

    res.status(200).json({
      success: true,
      data: {
        monthlyStats,
        statusStats,
        yearlyTotal: yearlyTotal[0] || { totalNetSalary: 0, totalEarnings: 0, totalDeductions: 0 }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
