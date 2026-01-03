import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useFormik } from 'formik'
import toast from 'react-hot-toast'
import {
  PlusIcon,
  CalendarDaysIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
} from '@heroicons/react/24/outline'
import Card, { StatCard } from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import { Select, TextArea } from '../../components/ui/Input'
import Modal from '../../components/ui/Modal'
import Badge from '../../components/ui/Badge'
import Avatar from '../../components/ui/Avatar'
import EmptyState from '../../components/ui/EmptyState'
import { TableSkeleton } from '../../components/ui/Skeleton'
import {
  getMyLeaves,
  getAllLeaves,
  applyLeave,
  updateLeaveStatus,
  getLeaveBalance,
} from '../../store/slices/leaveSlice'
import { formatDate, calculateDays } from '../../utils/helpers'
import { leaveSchema } from '../../utils/validations'

const Leaves = () => {
  const dispatch = useDispatch()
  const { leaves, leaveBalance, loading } = useSelector((state) => state.leaves)
  const { user } = useSelector((state) => state.auth)
  const [applyModal, setApplyModal] = useState(false)
  const [activeTab, setActiveTab] = useState('my-leaves')

  const isHRorAdmin = user?.role === 'hr' || user?.role === 'admin'

  useEffect(() => {
    if (activeTab === 'my-leaves') {
      dispatch(getMyLeaves())
    } else {
      dispatch(getAllLeaves())
    }
    dispatch(getLeaveBalance())
  }, [dispatch, activeTab])

  const formik = useFormik({
    initialValues: {
      leaveType: '',
      startDate: '',
      endDate: '',
      reason: '',
    },
    validationSchema: leaveSchema,
    onSubmit: async (values, { resetForm }) => {
      const result = await dispatch(applyLeave(values))
      if (applyLeave.fulfilled.match(result)) {
        toast.success('Leave applied successfully')
        setApplyModal(false)
        resetForm()
      } else {
        toast.error(result.payload || 'Failed to apply leave')
      }
    },
  })

  const handleStatusUpdate = async (id, status) => {
    const result = await dispatch(updateLeaveStatus({ id, status }))
    if (updateLeaveStatus.fulfilled.match(result)) {
      toast.success(`Leave ${status} successfully`)
    } else {
      toast.error(result.payload || 'Failed to update leave status')
    }
  }

  const leaveTypes = [
    { value: 'casual', label: 'Casual Leave' },
    { value: 'sick', label: 'Sick Leave' },
    { value: 'annual', label: 'Annual Leave' },
    { value: 'maternity', label: 'Maternity Leave' },
    { value: 'paternity', label: 'Paternity Leave' },
    { value: 'unpaid', label: 'Unpaid Leave' },
  ]

  const getStatusBadge = (status) => {
    const variants = {
      pending: 'warning',
      approved: 'success',
      rejected: 'danger',
    }
    return <Badge variant={variants[status] || 'secondary'}>{status}</Badge>
  }

  const getLeaveTypeBadge = (type) => {
    const variants = {
      casual: 'info',
      sick: 'danger',
      annual: 'success',
      maternity: 'purple',
      paternity: 'purple',
      unpaid: 'secondary',
    }
    return <Badge variant={variants[type] || 'secondary'}>{type}</Badge>
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Leave Management</h1>
          <p className="text-gray-500 dark:text-gray-400">
            Apply for leaves and track your requests
          </p>
        </div>
        <Button variant="primary" icon={PlusIcon} onClick={() => setApplyModal(true)}>
          Apply Leave
        </Button>
      </div>

      {/* Leave Balance */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card className="p-4 text-center">
          <p className="text-2xl font-bold text-green-600">{leaveBalance?.casual?.remaining ?? leaveBalance?.casual ?? 12}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">Casual</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-2xl font-bold text-red-600">{leaveBalance?.sick?.remaining ?? leaveBalance?.sick ?? 10}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">Sick</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-2xl font-bold text-blue-600">{leaveBalance?.annual?.remaining ?? leaveBalance?.annual ?? 15}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">Annual</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-2xl font-bold text-purple-600">{leaveBalance?.paid?.remaining ?? leaveBalance?.paid ?? 20}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">Paid</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-2xl font-bold text-purple-600">
            {(leaveBalance?.casual?.used ?? 0) + (leaveBalance?.sick?.used ?? 0) + (leaveBalance?.annual?.used ?? 0) + (leaveBalance?.paid?.used ?? 0)}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">Used</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-2xl font-bold text-gray-600">
            {(leaveBalance?.casual?.total ?? 12) + (leaveBalance?.sick?.total ?? 10) + (leaveBalance?.annual?.total ?? 15) + (leaveBalance?.paid?.total ?? 20)}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">Total</p>
        </Card>
      </div>

      {/* Tabs for HR/Admin */}
      {isHRorAdmin && (
        <div className="border-b border-gray-200 dark:border-gray-700">
          <div className="flex gap-8">
            <button
              onClick={() => setActiveTab('my-leaves')}
              className={`pb-4 text-sm font-medium transition-colors ${
                activeTab === 'my-leaves'
                  ? 'text-primary-600 border-b-2 border-primary-600'
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'
              }`}
            >
              My Leaves
            </button>
            <button
              onClick={() => setActiveTab('all-leaves')}
              className={`pb-4 text-sm font-medium transition-colors ${
                activeTab === 'all-leaves'
                  ? 'text-primary-600 border-b-2 border-primary-600'
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'
              }`}
            >
              All Leave Requests
            </button>
          </div>
        </div>
      )}

      {/* Leave List */}
      {loading ? (
        <TableSkeleton rows={5} cols={activeTab === 'all-leaves' ? 7 : 6} />
      ) : leaves.length > 0 ? (
        <Card>
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  {activeTab === 'all-leaves' && <th>Employee</th>}
                  <th>Type</th>
                  <th>From</th>
                  <th>To</th>
                  <th>Days</th>
                  <th>Reason</th>
                  <th>Status</th>
                  {activeTab === 'all-leaves' && <th>Actions</th>}
                </tr>
              </thead>
              <tbody>
                {leaves.map((leave) => (
                  <tr key={leave._id}>
                    {activeTab === 'all-leaves' && (
                      <td>
                        <div className="flex items-center gap-3">
                          <Avatar
                            name={`${leave.employee?.firstName} ${leave.employee?.lastName}`}
                            src={leave.employee?.avatar}
                            size="sm"
                          />
                          <div>
                            <p className="font-medium">
                              {leave.employee?.firstName} {leave.employee?.lastName}
                            </p>
                            <p className="text-xs text-gray-500">{leave.employee?.employeeId}</p>
                          </div>
                        </div>
                      </td>
                    )}
                    <td>{getLeaveTypeBadge(leave.leaveType)}</td>
                    <td>{formatDate(leave.startDate)}</td>
                    <td>{formatDate(leave.endDate)}</td>
                    <td>{calculateDays(leave.startDate, leave.endDate)}</td>
                    <td>
                      <p className="max-w-xs truncate">{leave.reason}</p>
                    </td>
                    <td>{getStatusBadge(leave.status)}</td>
                    {activeTab === 'all-leaves' && leave.status === 'pending' && (
                      <td>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleStatusUpdate(leave._id, 'approved')}
                            className="p-1.5 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/30 rounded-lg transition-colors"
                          >
                            <CheckCircleIcon className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleStatusUpdate(leave._id, 'rejected')}
                            className="p-1.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                          >
                            <XCircleIcon className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      ) : (
        <Card className="p-12">
          <EmptyState
            icon={CalendarDaysIcon}
            title="No leave requests"
            description={
              activeTab === 'my-leaves'
                ? "You haven't applied for any leaves yet."
                : 'There are no leave requests to review.'
            }
            action={
              activeTab === 'my-leaves' && (
                <Button variant="primary" icon={PlusIcon} onClick={() => setApplyModal(true)}>
                  Apply Leave
                </Button>
              )
            }
          />
        </Card>
      )}

      {/* Apply Leave Modal */}
      <Modal
        isOpen={applyModal}
        onClose={() => setApplyModal(false)}
        title="Apply for Leave"
        size="md"
      >
        <form onSubmit={formik.handleSubmit} className="space-y-4">
          <Select
            label="Leave Type"
            name="leaveType"
            options={leaveTypes}
            value={formik.values.leaveType}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.errors.leaveType}
            touched={formik.touched.leaveType}
            required
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Start Date"
              name="startDate"
              type="date"
              value={formik.values.startDate}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.errors.startDate}
              touched={formik.touched.startDate}
              required
            />
            <Input
              label="End Date"
              name="endDate"
              type="date"
              value={formik.values.endDate}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.errors.endDate}
              touched={formik.touched.endDate}
              required
            />
          </div>
          {formik.values.startDate && formik.values.endDate && (
            <div className="flex items-center gap-2 p-3 bg-primary-50 dark:bg-primary-900/30 rounded-lg">
              <ClockIcon className="w-5 h-5 text-primary-600" />
              <span className="text-sm text-primary-600 dark:text-primary-400">
                Total: {calculateDays(formik.values.startDate, formik.values.endDate)} day(s)
              </span>
            </div>
          )}
          <TextArea
            label="Reason"
            name="reason"
            placeholder="Provide a reason for your leave request..."
            value={formik.values.reason}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.errors.reason}
            touched={formik.touched.reason}
            rows={4}
            required
          />
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="secondary" onClick={() => setApplyModal(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" loading={loading}>
              Submit Request
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}

export default Leaves
