const express = require('express');
const router = express.Router();
const {
  getEmployees,
  getEmployee,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  getEmployeeStats
} = require('../controllers/employeeController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

router.route('/')
  .get(authorize('admin', 'hr'), getEmployees)
  .post(authorize('admin', 'hr'), createEmployee);

router.get('/stats', authorize('admin', 'hr'), getEmployeeStats);

router.route('/:id')
  .get(getEmployee)
  .put(updateEmployee)
  .delete(authorize('admin'), deleteEmployee);

module.exports = router;
