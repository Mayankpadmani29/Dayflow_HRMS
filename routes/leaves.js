const express = require('express');
const router = express.Router();
const {
  applyLeave,
  getMyLeaves,
  getAllLeaves,
  getLeave,
  updateLeaveStatus,
  cancelLeave,
  getLeaveStats,
  getLeaveBalance
} = require('../controllers/leaveController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

router.route('/')
  .get(authorize('admin', 'hr'), getAllLeaves)
  .post(applyLeave);

router.get('/my', getMyLeaves);
router.get('/balance', getLeaveBalance);
router.get('/stats', authorize('admin', 'hr'), getLeaveStats);

router.route('/:id')
  .get(getLeave)
  .delete(cancelLeave);

router.put('/:id/status', authorize('admin', 'hr'), updateLeaveStatus);

module.exports = router;
