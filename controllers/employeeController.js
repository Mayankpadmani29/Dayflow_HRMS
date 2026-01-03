const User = require('../models/User');
const mongoose = require('mongoose');
const { 
  getAllDemoUsers, 
  getDemoEmployee, 
  addDemoEmployee, 
  updateDemoEmployee, 
  deleteDemoEmployee 
} = require('../middleware/demoAuth');

// Check if we're in demo mode
const isDemoMode = () => mongoose.connection.readyState !== 1;

// @desc    Get all employees
// @route   GET /api/employees
// @access  Private (Admin/HR)
exports.getEmployees = async (req, res) => {
  try {
    const { page = 1, limit = 10, search, department, role } = req.query;
    
    // Demo mode
    if (isDemoMode()) {
      let employees = getAllDemoUsers();
      
      // Apply filters
      if (search) {
        const searchLower = search.toLowerCase();
        employees = employees.filter(e => 
          e.firstName?.toLowerCase().includes(searchLower) ||
          e.lastName?.toLowerCase().includes(searchLower) ||
          e.email?.toLowerCase().includes(searchLower) ||
          e.employeeId?.toLowerCase().includes(searchLower)
        );
      }
      if (department) {
        employees = employees.filter(e => e.department === department);
      }
      if (role) {
        employees = employees.filter(e => e.role === role);
      }
      
      const total = employees.length;
      const startIndex = (page - 1) * limit;
      const paginatedEmployees = employees.slice(startIndex, startIndex + parseInt(limit));
      
      return res.status(200).json({
        success: true,
        data: paginatedEmployees,
        pagination: {
          total,
          page: parseInt(page),
          pages: Math.ceil(total / limit)
        }
      });
    }
    
    let query = {};
    
    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { employeeId: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (department) {
      query.department = department;
    }
    
    if (role) {
      query.role = role;
    }

    const employees = await User.find(query)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const count = await User.countDocuments(query);

    res.status(200).json({
      success: true,
      data: employees,
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

// @desc    Get single employee
// @route   GET /api/employees/:id
// @access  Private
exports.getEmployee = async (req, res) => {
  try {
    // Demo mode
    if (isDemoMode()) {
      const employee = getDemoEmployee(req.params.id);
      if (!employee) {
        return res.status(404).json({
          success: false,
          message: 'Employee not found'
        });
      }
      return res.status(200).json({
        success: true,
        data: employee
      });
    }

    const employee = await User.findById(req.params.id);

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found'
      });
    }

    // Employees can only view their own profile
    if (req.user.role === 'employee' && req.user.id !== req.params.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this profile'
      });
    }

    res.status(200).json({
      success: true,
      data: employee
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Create employee
// @route   POST /api/employees
// @access  Private (Admin/HR)
exports.createEmployee = async (req, res) => {
  try {
    // Demo mode
    if (isDemoMode()) {
      const employee = addDemoEmployee(req.body);
      return res.status(201).json({
        success: true,
        data: employee
      });
    }

    const employee = await User.create(req.body);

    res.status(201).json({
      success: true,
      data: employee
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update employee
// @route   PUT /api/employees/:id
// @access  Private
exports.updateEmployee = async (req, res) => {
  try {
    // Demo mode
    if (isDemoMode()) {
      const employee = updateDemoEmployee(req.params.id, req.body);
      if (!employee) {
        return res.status(404).json({
          success: false,
          message: 'Employee not found'
        });
      }
      return res.status(200).json({
        success: true,
        data: employee
      });
    }

    let employee = await User.findById(req.params.id);

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found'
      });
    }

    // Employees can only update limited fields of their own profile
    if (req.user.role === 'employee') {
      if (req.user.id !== req.params.id) {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to update this profile'
        });
      }
      // Limit fields that employees can update
      const allowedFields = ['phone', 'address', 'emergencyContact', 'avatar'];
      Object.keys(req.body).forEach(key => {
        if (!allowedFields.includes(key)) {
          delete req.body[key];
        }
      });
    }

    employee = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: employee
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete employee
// @route   DELETE /api/employees/:id
// @access  Private (Admin)
exports.deleteEmployee = async (req, res) => {
  try {
    // Demo mode
    if (isDemoMode()) {
      const deleted = deleteDemoEmployee(req.params.id);
      if (!deleted) {
        return res.status(404).json({
          success: false,
          message: 'Employee not found'
        });
      }
      return res.status(200).json({
        success: true,
        message: 'Employee deleted successfully'
      });
    }

    const employee = await User.findById(req.params.id);

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found'
      });
    }

    await employee.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Employee deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get employee stats
// @route   GET /api/employees/stats
// @access  Private (Admin/HR)
exports.getEmployeeStats = async (req, res) => {
  try {
    const totalEmployees = await User.countDocuments();
    const activeEmployees = await User.countDocuments({ isActive: true });
    const departmentStats = await User.aggregate([
      { $group: { _id: '$department', count: { $sum: 1 } } }
    ]);
    const roleStats = await User.aggregate([
      { $group: { _id: '$role', count: { $sum: 1 } } }
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalEmployees,
        activeEmployees,
        inactiveEmployees: totalEmployees - activeEmployees,
        departmentStats,
        roleStats
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
