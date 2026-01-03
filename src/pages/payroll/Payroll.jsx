import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  BanknotesIcon,
  DocumentArrowDownIcon,
  CalendarIcon,
  ChartBarIcon,
} from '@heroicons/react/24/outline'
import Card, { StatCard } from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import { Select } from '../../components/ui/Input'
import Modal from '../../components/ui/Modal'
import Badge from '../../components/ui/Badge'
import Avatar from '../../components/ui/Avatar'
import EmptyState from '../../components/ui/EmptyState'
import { TableSkeleton } from '../../components/ui/Skeleton'
import {
  getMyPayroll,
  getAllPayroll,
  generatePayroll,
  getPayrollDetails,
} from '../../store/slices/payrollSlice'
import { formatDate, formatCurrency } from '../../utils/helpers'
import toast from 'react-hot-toast'

const Payroll = () => {
  const dispatch = useDispatch()
  const { payrolls, payrollDetails, loading } = useSelector((state) => state.payroll)
  const { user } = useSelector((state) => state.auth)
  const [activeTab, setActiveTab] = useState('my-payroll')
  const [detailsModal, setDetailsModal] = useState(null)
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1)
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())

  const isHRorAdmin = user?.role === 'hr' || user?.role === 'admin'

  useEffect(() => {
    if (activeTab === 'my-payroll') {
      dispatch(getMyPayroll())
    } else {
      dispatch(getAllPayroll({ month: selectedMonth, year: selectedYear }))
    }
  }, [dispatch, activeTab, selectedMonth, selectedYear])

  const handleViewDetails = async (id) => {
    await dispatch(getPayrollDetails(id))
    setDetailsModal(id)
  }

  const handleGeneratePayroll = async () => {
    const result = await dispatch(generatePayroll({ month: selectedMonth, year: selectedYear }))
    if (generatePayroll.fulfilled.match(result)) {
      toast.success('Payroll generated successfully')
    } else {
      toast.error(result.payload || 'Failed to generate payroll')
    }
  }

  const months = [
    { value: 1, label: 'January' },
    { value: 2, label: 'February' },
    { value: 3, label: 'March' },
    { value: 4, label: 'April' },
    { value: 5, label: 'May' },
    { value: 6, label: 'June' },
    { value: 7, label: 'July' },
    { value: 8, label: 'August' },
    { value: 9, label: 'September' },
    { value: 10, label: 'October' },
    { value: 11, label: 'November' },
    { value: 12, label: 'December' },
  ]

  const years = Array.from({ length: 5 }, (_, i) => ({
    value: new Date().getFullYear() - i,
    label: String(new Date().getFullYear() - i),
  }))

  const getStatusBadge = (status) => {
    const variants = {
      pending: 'warning',
      processed: 'info',
      paid: 'success',
    }
    return <Badge variant={variants[status] || 'secondary'}>{status}</Badge>
  }

  // Calculate totals for current user
  const latestPayroll = payrolls[0]
  const totalEarnings = latestPayroll
    ? (latestPayroll.basicSalary || 0) +
      (latestPayroll.hra || 0) +
      (latestPayroll.allowances || 0)
    : 0
  const totalDeductions = latestPayroll?.deductions || 0
  const netSalary = latestPayroll?.netSalary || 0

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Payroll</h1>
          <p className="text-gray-500 dark:text-gray-400">
            View salary slips and payroll details
          </p>
        </div>
        {isHRorAdmin && activeTab === 'all-payroll' && (
          <Button
            variant="primary"
            icon={BanknotesIcon}
            onClick={handleGeneratePayroll}
            loading={loading}
          >
            Generate Payroll
          </Button>
        )}
      </div>

      {/* Stats for Employee */}
      {activeTab === 'my-payroll' && latestPayroll && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Earnings"
            value={formatCurrency(totalEarnings)}
            icon={BanknotesIcon}
            color="green"
          />
          <StatCard
            title="Total Deductions"
            value={formatCurrency(totalDeductions)}
            icon={ChartBarIcon}
            color="red"
          />
          <StatCard
            title="Net Salary"
            value={formatCurrency(netSalary)}
            icon={BanknotesIcon}
            color="blue"
          />
          <StatCard
            title="Last Paid"
            value={latestPayroll?.paidDate ? formatDate(latestPayroll.paidDate) : 'N/A'}
            icon={CalendarIcon}
            color="yellow"
          />
        </div>
      )}

      {/* Tabs for HR/Admin */}
      {isHRorAdmin && (
        <div className="border-b border-gray-200 dark:border-gray-700">
          <div className="flex gap-8">
            <button
              onClick={() => setActiveTab('my-payroll')}
              className={`pb-4 text-sm font-medium transition-colors ${
                activeTab === 'my-payroll'
                  ? 'text-primary-600 border-b-2 border-primary-600'
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'
              }`}
            >
              My Payroll
            </button>
            <button
              onClick={() => setActiveTab('all-payroll')}
              className={`pb-4 text-sm font-medium transition-colors ${
                activeTab === 'all-payroll'
                  ? 'text-primary-600 border-b-2 border-primary-600'
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'
              }`}
            >
              All Payroll
            </button>
          </div>
        </div>
      )}

      {/* Filters for All Payroll */}
      {activeTab === 'all-payroll' && (
        <Card className="p-4">
          <div className="flex flex-wrap gap-4">
            <div className="w-40">
              <Select
                options={months}
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(Number(e.target.value))}
              />
            </div>
            <div className="w-32">
              <Select
                options={years}
                value={selectedYear}
                onChange={(e) => setSelectedYear(Number(e.target.value))}
              />
            </div>
          </div>
        </Card>
      )}

      {/* Payroll List */}
      {loading ? (
        <TableSkeleton rows={5} cols={activeTab === 'all-payroll' ? 8 : 6} />
      ) : payrolls.length > 0 ? (
        <Card>
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  {activeTab === 'all-payroll' && <th>Employee</th>}
                  <th>Month</th>
                  <th>Basic</th>
                  <th>HRA</th>
                  <th>Allowances</th>
                  <th>Deductions</th>
                  <th>Net Salary</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {payrolls.map((payroll) => (
                  <tr key={payroll._id}>
                    {activeTab === 'all-payroll' && (
                      <td>
                        <div className="flex items-center gap-3">
                          <Avatar
                            name={`${payroll.employee?.firstName} ${payroll.employee?.lastName}`}
                            src={payroll.employee?.avatar}
                            size="sm"
                          />
                          <div>
                            <p className="font-medium">
                              {payroll.employee?.firstName} {payroll.employee?.lastName}
                            </p>
                            <p className="text-xs text-gray-500">
                              {payroll.employee?.employeeId}
                            </p>
                          </div>
                        </div>
                      </td>
                    )}
                    <td>
                      {months.find((m) => m.value === payroll.month)?.label} {payroll.year}
                    </td>
                    <td>{formatCurrency(payroll.basicSalary)}</td>
                    <td>{formatCurrency(payroll.hra)}</td>
                    <td>{formatCurrency(payroll.allowances)}</td>
                    <td className="text-red-600">-{formatCurrency(payroll.deductions)}</td>
                    <td className="font-semibold text-green-600">
                      {formatCurrency(payroll.netSalary)}
                    </td>
                    <td>{getStatusBadge(payroll.status)}</td>
                    <td>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleViewDetails(payroll._id)}
                          className="p-1.5 text-gray-500 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/30 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <DocumentArrowDownIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      ) : (
        <Card className="p-12">
          <EmptyState
            icon={BanknotesIcon}
            title="No payroll records"
            description={
              activeTab === 'my-payroll'
                ? 'Your salary slips will appear here once processed.'
                : 'No payroll records found for the selected period.'
            }
          />
        </Card>
      )}

      {/* Payroll Details Modal */}
      <Modal
        isOpen={!!detailsModal}
        onClose={() => setDetailsModal(null)}
        title="Salary Slip"
        size="lg"
      >
        {payrollDetails && (
          <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-gray-200 dark:border-gray-700">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {payrollDetails.employee?.firstName} {payrollDetails.employee?.lastName}
                </h3>
                <p className="text-sm text-gray-500">
                  {payrollDetails.employee?.employeeId} • {payrollDetails.employee?.department}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">Pay Period</p>
                <p className="font-medium">
                  {months.find((m) => m.value === payrollDetails.month)?.label}{' '}
                  {payrollDetails.year}
                </p>
              </div>
            </div>

            {/* Earnings */}
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-3">Earnings</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-500">Basic Salary</span>
                  <span className="font-medium">{formatCurrency(payrollDetails.basicSalary)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">House Rent Allowance (HRA)</span>
                  <span className="font-medium">{formatCurrency(payrollDetails.hra)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Other Allowances</span>
                  <span className="font-medium">{formatCurrency(payrollDetails.allowances)}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-gray-200 dark:border-gray-700">
                  <span className="font-medium text-gray-900 dark:text-white">Gross Earnings</span>
                  <span className="font-semibold text-green-600">
                    {formatCurrency(
                      (payrollDetails.basicSalary || 0) +
                        (payrollDetails.hra || 0) +
                        (payrollDetails.allowances || 0)
                    )}
                  </span>
                </div>
              </div>
            </div>

            {/* Deductions */}
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-3">Deductions</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-500">Tax Deductions</span>
                  <span className="font-medium text-red-600">
                    -{formatCurrency(payrollDetails.deductions * 0.6 || 0)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Provident Fund</span>
                  <span className="font-medium text-red-600">
                    -{formatCurrency(payrollDetails.deductions * 0.3 || 0)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Other Deductions</span>
                  <span className="font-medium text-red-600">
                    -{formatCurrency(payrollDetails.deductions * 0.1 || 0)}
                  </span>
                </div>
                <div className="flex justify-between pt-2 border-t border-gray-200 dark:border-gray-700">
                  <span className="font-medium text-gray-900 dark:text-white">Total Deductions</span>
                  <span className="font-semibold text-red-600">
                    -{formatCurrency(payrollDetails.deductions)}
                  </span>
                </div>
              </div>
            </div>

            {/* Net Salary */}
            <div className="p-4 bg-primary-50 dark:bg-primary-900/30 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold text-gray-900 dark:text-white">
                  Net Salary
                </span>
                <span className="text-2xl font-bold text-primary-600">
                  {formatCurrency(payrollDetails.netSalary)}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-4">
              <Button variant="secondary" onClick={() => setDetailsModal(null)}>
                Close
              </Button>
              <Button variant="primary" icon={DocumentArrowDownIcon}>
                Download PDF
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}

export default Payroll
