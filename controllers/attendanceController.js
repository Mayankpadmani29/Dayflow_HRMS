const Attendance = require('../models/Attendance');
const User = require('../models/User');

// @desc    Check in
// @route   POST /api/attendance/check-in
// @access  Private
exports.checkIn = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Check if already checked in today
    let attendance = await Attendance.findOne({
      user: req.user.id,
      date: today
    });

    if (attendance && attendance.checkIn) {
      return res.status(400).json({
        success: false,
        message: 'Already checked in today'
      });
    }

    if (!attendance) {
      attendance = new Attendance({
        user: req.user.id,
        date: today,
        checkIn: new Date(),
        status: 'present'
      });
    } else {
      attendance.checkIn = new Date();
      attendance.status = 'present';
    }

    await attendance.save();

    res.status(200).json({
      success: true,
      message: 'Checked in successfully',
      data: attendance
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Check out
// @route   POST /api/attendance/check-out
// @access  Private
exports.checkOut = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const attendance = await Attendance.findOne({
      user: req.user.id,
      date: today
    });

    if (!attendance || !attendance.checkIn) {
      return res.status(400).json({
        success: false,
        message: 'Please check in first'
      });
    }

    if (attendance.checkOut) {
      return res.status(400).json({
        success: false,
        message: 'Already checked out today'
      });
    }

    attendance.checkOut = new Date();
    
    // Calculate work hours and determine if half-day
    const workHours = (attendance.checkOut - attendance.checkIn) / (1000 * 60 * 60);
    if (workHours < 4) {
      attendance.status = 'half-day';
    }

    await attendance.save();

    res.status(200).json({
      success: true,
      message: 'Checked out successfully',
      data: attendance
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get my attendance
// @route   GET /api/attendance/my
// @access  Private
exports.getMyAttendance = async (req, res) => {
  try {
    const { month, year } = req.query;
    
    let startDate, endDate;
    
    if (month && year) {
      startDate = new Date(year, month - 1, 1);
      endDate = new Date(year, month, 0);
    } else {
      // Default to current month
      const now = new Date();
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    }

    const attendance = await Attendance.find({
      user: req.user.id,
      date: { $gte: startDate, $lte: endDate }
    }).sort({ date: -1 });

    // Calculate summary
    const summary = {
      present: attendance.filter(a => a.status === 'present').length,
      absent: attendance.filter(a => a.status === 'absent').length,
      halfDay: attendance.filter(a => a.status === 'half-day').length,
      leave: attendance.filter(a => a.status === 'leave').length,
      totalWorkHours: attendance.reduce((sum, a) => sum + (a.workHours || 0), 0)
    };

    res.status(200).json({
      success: true,
      data: attendance,
      summary
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get today's attendance status
// @route   GET /api/attendance/today
// @access  Private
exports.getTodayAttendance = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const attendance = await Attendance.findOne({
      user: req.user.id,
      date: today
    });

    res.status(200).json({
      success: true,
      data: attendance
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get all attendance (Admin/HR)
// @route   GET /api/attendance
// @access  Private (Admin/HR)
exports.getAllAttendance = async (req, res) => {
  try {
    const { date, userId, page = 1, limit = 20 } = req.query;
    
    let query = {};
    
    if (date) {
      const queryDate = new Date(date);
      queryDate.setHours(0, 0, 0, 0);
      query.date = queryDate;
    }
    
    if (userId) {
      query.user = userId;
    }

    const attendance = await Attendance.find(query)
      .populate('user', 'firstName lastName employeeId department')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ date: -1 });

    const count = await Attendance.countDocuments(query);

    res.status(200).json({
      success: true,
      data: attendance,
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

// @desc    Update attendance (Admin/HR)
// @route   PUT /api/attendance/:id
// @access  Private (Admin/HR)
exports.updateAttendance = async (req, res) => {
  try {
    const attendance = await Attendance.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!attendance) {
      return res.status(404).json({
        success: false,
        message: 'Attendance record not found'
      });
    }

    res.status(200).json({
      success: true,
      data: attendance
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get attendance stats
// @route   GET /api/attendance/stats
// @access  Private (Admin/HR)
exports.getAttendanceStats = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayStats = await Attendance.aggregate([
      { $match: { date: today } },
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    const totalEmployees = await User.countDocuments({ isActive: true });
    const presentToday = todayStats.find(s => s._id === 'present')?.count || 0;
    const absentToday = totalEmployees - presentToday;

    // Monthly stats
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const monthlyStats = await Attendance.aggregate([
      { $match: { date: { $gte: startOfMonth, $lte: today } } },
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    res.status(200).json({
      success: true,
      data: {
        today: {
          present: presentToday,
          absent: absentToday,
          stats: todayStats
        },
        monthly: monthlyStats,
        totalEmployees
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
