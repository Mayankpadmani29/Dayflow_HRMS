const Leave = require('../models/Leave');
const Notification = require('../models/Notification');
const mongoose = require('mongoose');
const {
  addDemoLeave,
  getDemoLeaves,
  getDemoLeave,
  updateDemoLeaveStatus,
  deleteDemoLeave,
  getDemoLeaveStats,
} = require('../middleware/demoAuth');

// Check if we're in demo mode
const isDemoMode = () => mongoose.connection.readyState !== 1;

// @desc    Apply for leave
// @route   POST /api/leaves
// @access  Private
exports.applyLeave = async (req, res) => {
  try {
    const { leaveType, startDate, endDate, reason } = req.body;

    // Demo mode
    if (isDemoMode()) {
      const leave = addDemoLeave({ leaveType, startDate, endDate, reason }, req.user.id);
      return res.status(201).json({
        success: true,
        message: 'Leave request submitted successfully',
        data: leave
      });
    }

    // Check for overlapping leave requests
    const existingLeave = await Leave.findOne({
      user: req.user.id,
      status: { $ne: 'rejected' },
      $or: [
        { startDate: { $lte: new Date(endDate) }, endDate: { $gte: new Date(startDate) } }
      ]
    });

    if (existingLeave) {
      return res.status(400).json({
        success: false,
        message: 'You already have a leave request for these dates'
      });
    }

    const leave = await Leave.create({
      user: req.user.id,
      leaveType,
      startDate,
      endDate,
      reason
    });

    res.status(201).json({
      success: true,
      message: 'Leave request submitted successfully',
      data: leave
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get my leaves
// @route   GET /api/leaves/my
// @access  Private
exports.getMyLeaves = async (req, res) => {
  try {
    const { status, year } = req.query;
    
    // Demo mode
    if (isDemoMode()) {
      let leaves = getDemoLeaves({ userId: req.user.id, status });
      
      const leaveBalance = {
        paid: { total: 20, used: 0, remaining: 20 },
        sick: { total: 10, used: 0, remaining: 10 },
        casual: { total: 5, used: 0, remaining: 5 }
      };
      
      const approvedLeaves = leaves.filter(l => l.status === 'approved');
      approvedLeaves.forEach(leave => {
        if (leaveBalance[leave.leaveType]) {
          leaveBalance[leave.leaveType].used += leave.totalDays;
          leaveBalance[leave.leaveType].remaining = 
            leaveBalance[leave.leaveType].total - leaveBalance[leave.leaveType].used;
        }
      });
      
      return res.status(200).json({
        success: true,
        data: leaves,
        leaveBalance
      });
    }
    
    let query = { user: req.user.id };
    
    if (status) {
      query.status = status;
    }
    
    if (year) {
      query.startDate = {
        $gte: new Date(`${year}-01-01`),
        $lte: new Date(`${year}-12-31`)
      };
    }

    const leaves = await Leave.find(query)
      .populate('approvedBy', 'firstName lastName')
      .sort({ createdAt: -1 });

    // Calculate leave balance (simplified - normally from leave allocation)
    const leaveBalance = {
      paid: { total: 20, used: 0, remaining: 20 },
      sick: { total: 10, used: 0, remaining: 10 },
      casual: { total: 5, used: 0, remaining: 5 }
    };

    const approvedLeaves = leaves.filter(l => l.status === 'approved');
    approvedLeaves.forEach(leave => {
      if (leaveBalance[leave.leaveType]) {
        leaveBalance[leave.leaveType].used += leave.totalDays;
        leaveBalance[leave.leaveType].remaining = 
          leaveBalance[leave.leaveType].total - leaveBalance[leave.leaveType].used;
      }
    });

    res.status(200).json({
      success: true,
      data: leaves,
      leaveBalance
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get all leaves (Admin/HR)
// @route   GET /api/leaves
// @access  Private (Admin/HR)
exports.getAllLeaves = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    
    // Demo mode
    if (isDemoMode()) {
      let leaves = getDemoLeaves({ status });
      const total = leaves.length;
      const startIndex = (page - 1) * limit;
      const paginatedLeaves = leaves.slice(startIndex, startIndex + parseInt(limit));
      
      return res.status(200).json({
        success: true,
        data: paginatedLeaves,
        pagination: {
          total,
          page: parseInt(page),
          pages: Math.ceil(total / limit)
        }
      });
    }
    
    let query = {};
    
    if (status) {
      query.status = status;
    }

    const leaves = await Leave.find(query)
      .populate('user', 'firstName lastName employeeId department avatar')
      .populate('approvedBy', 'firstName lastName')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const count = await Leave.countDocuments(query);

    res.status(200).json({
      success: true,
      data: leaves,
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

// @desc    Get single leave
// @route   GET /api/leaves/:id
// @access  Private
exports.getLeave = async (req, res) => {
  try {
    // Demo mode
    if (isDemoMode()) {
      const leave = getDemoLeave(req.params.id);
      if (!leave) {
        return res.status(404).json({
          success: false,
          message: 'Leave request not found'
        });
      }
      return res.status(200).json({
        success: true,
        data: leave
      });
    }

    const leave = await Leave.findById(req.params.id)
      .populate('user', 'firstName lastName employeeId department')
      .populate('approvedBy', 'firstName lastName');

    if (!leave) {
      return res.status(404).json({
        success: false,
        message: 'Leave request not found'
      });
    }

    // Check if user is authorized
    if (req.user.role === 'employee' && leave.user._id.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this leave request'
      });
    }

    res.status(200).json({
      success: true,
      data: leave
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Approve/Reject leave
// @route   PUT /api/leaves/:id/status
// @access  Private (Admin/HR)
exports.updateLeaveStatus = async (req, res) => {
  try {
    const { status, approverComments } = req.body;

    // Demo mode
    if (isDemoMode()) {
      const leave = updateDemoLeaveStatus(req.params.id, status, req.user.id, approverComments);
      if (!leave) {
        return res.status(404).json({
          success: false,
          message: 'Leave request not found'
        });
      }
      return res.status(200).json({
        success: true,
        message: `Leave request ${status} successfully`,
        data: leave
      });
    }

    const leave = await Leave.findById(req.params.id);

    if (!leave) {
      return res.status(404).json({
        success: false,
        message: 'Leave request not found'
      });
    }

    if (leave.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Leave request has already been processed'
      });
    }

    leave.status = status;
    leave.approvedBy = req.user.id;
    leave.approverComments = approverComments;
    leave.approvedAt = new Date();

    await leave.save();

    // Create notification for the employee
    await Notification.create({
      user: leave.user,
      title: `Leave Request ${status.charAt(0).toUpperCase() + status.slice(1)}`,
      message: `Your leave request from ${leave.startDate.toDateString()} to ${leave.endDate.toDateString()} has been ${status}.`,
      type: 'leave'
    });

    res.status(200).json({
      success: true,
      message: `Leave request ${status} successfully`,
      data: leave
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Cancel leave request
// @route   DELETE /api/leaves/:id
// @access  Private
exports.cancelLeave = async (req, res) => {
  try {
    // Demo mode
    if (isDemoMode()) {
      const leave = getDemoLeave(req.params.id);
      if (!leave) {
        return res.status(404).json({
          success: false,
          message: 'Leave request not found'
        });
      }
      if (leave.status !== 'pending') {
        return res.status(400).json({
          success: false,
          message: 'Only pending leave requests can be cancelled'
        });
      }
      deleteDemoLeave(req.params.id);
      return res.status(200).json({
        success: true,
        message: 'Leave request cancelled successfully'
      });
    }

    const leave = await Leave.findById(req.params.id);

    if (!leave) {
      return res.status(404).json({
        success: false,
        message: 'Leave request not found'
      });
    }

    if (leave.user.toString() !== req.user.id && req.user.role === 'employee') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to cancel this leave request'
      });
    }

    if (leave.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Only pending leave requests can be cancelled'
      });
    }

    await leave.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Leave request cancelled successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get leave stats
// @route   GET /api/leaves/stats
// @access  Private (Admin/HR)
exports.getLeaveStats = async (req, res) => {
  try {
    // Demo mode
    if (isDemoMode()) {
      const stats = getDemoLeaveStats();
      return res.status(200).json({
        success: true,
        data: stats
      });
    }

    const pendingCount = await Leave.countDocuments({ status: 'pending' });
    const approvedCount = await Leave.countDocuments({ status: 'approved' });
    const rejectedCount = await Leave.countDocuments({ status: 'rejected' });

    const leaveTypeStats = await Leave.aggregate([
      { $match: { status: 'approved' } },
      { $group: { _id: '$leaveType', count: { $sum: 1 }, totalDays: { $sum: '$totalDays' } } }
    ]);

    // Monthly trend
    const monthlyStats = await Leave.aggregate([
      { $match: { status: 'approved' } },
      {
        $group: {
          _id: { month: { $month: '$startDate' }, year: { $year: '$startDate' } },
          count: { $sum: 1 },
          totalDays: { $sum: '$totalDays' }
        }
      },
      { $sort: { '_id.year': -1, '_id.month': -1 } },
      { $limit: 12 }
    ]);

    res.status(200).json({
      success: true,
      data: {
        pending: pendingCount,
        approved: approvedCount,
        rejected: rejectedCount,
        total: pendingCount + approvedCount + rejectedCount,
        leaveTypeStats,
        monthlyStats
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get leave balance
// @route   GET /api/leaves/balance
// @access  Private
exports.getLeaveBalance = async (req, res) => {
  try {
    // Demo mode - return default balance
    if (isDemoMode()) {
      return res.status(200).json({
        success: true,
        data: {
          casual: { total: 12, used: 0, remaining: 12 },
          sick: { total: 10, used: 0, remaining: 10 },
          annual: { total: 15, used: 0, remaining: 15 },
          paid: { total: 20, used: 0, remaining: 20 },
        }
      });
    }

    // In real mode, calculate from approved leaves
    const leaveBalance = {
      casual: { total: 12, used: 0, remaining: 12 },
      sick: { total: 10, used: 0, remaining: 10 },
      annual: { total: 15, used: 0, remaining: 15 },
      paid: { total: 20, used: 0, remaining: 20 },
    };

    const approvedLeaves = await Leave.find({
      user: req.user.id,
      status: 'approved',
      startDate: {
        $gte: new Date(new Date().getFullYear(), 0, 1),
        $lte: new Date(new Date().getFullYear(), 11, 31)
      }
    });

    approvedLeaves.forEach(leave => {
      if (leaveBalance[leave.leaveType]) {
        leaveBalance[leave.leaveType].used += leave.totalDays || 0;
        leaveBalance[leave.leaveType].remaining = 
          leaveBalance[leave.leaveType].total - leaveBalance[leave.leaveType].used;
      }
    });

    res.status(200).json({
      success: true,
      data: leaveBalance
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
