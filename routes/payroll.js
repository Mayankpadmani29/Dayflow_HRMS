const express = require('express');
const router = express.Router();
const {
  getMyPayroll,
  getPayrollSlip,
  getAllPayroll,
  generatePayroll,
  updatePayroll,
  processPayroll,
  getPayrollStats
} = require('../controllers/payrollController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

router.get('/my', getMyPayroll);
router.get('/stats', authorize('admin', 'hr'), getPayrollStats);

router.route('/')
  .get(authorize('admin', 'hr'), getAllPayroll);

router.post('/generate', authorize('admin'), generatePayroll);

router.route('/:id')
  .get(getPayrollSlip)
  .put(authorize('admin'), updatePayroll);

router.put('/:id/process', authorize('admin'), processPayroll);

module.exports = router;
