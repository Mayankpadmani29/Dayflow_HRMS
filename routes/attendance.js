const express = require('express');
const router = express.Router();
const {
  checkIn,
  checkOut,
  getMyAttendance,
  getTodayAttendance,
  getAllAttendance,
  updateAttendance,
  getAttendanceStats
} = require('../controllers/attendanceController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

router.post('/check-in', checkIn);
router.post('/check-out', checkOut);
router.get('/my', getMyAttendance);
router.get('/today', getTodayAttendance);

router.get('/', authorize('admin', 'hr'), getAllAttendance);
router.get('/stats', authorize('admin', 'hr'), getAttendanceStats);
router.put('/:id', authorize('admin', 'hr'), updateAttendance);

module.exports = router;
