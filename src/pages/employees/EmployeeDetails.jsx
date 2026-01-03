import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import toast from 'react-hot-toast'
import {
  ArrowLeftIcon,
  PencilIcon,
  EnvelopeIcon,
  PhoneIcon,
  BuildingOfficeIcon,
  BriefcaseIcon,
  CalendarIcon,
  MapPinIcon,
} from '@heroicons/react/24/outline'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Avatar from '../../components/ui/Avatar'
import Badge from '../../components/ui/Badge'
import Modal from '../../components/ui/Modal'
import Input from '../../components/ui/Input'
import { Select } from '../../components/ui/Input'
import { getEmployee, updateEmployee, clearEmployee } from '../../store/slices/employeeSlice'
import { formatDate, formatCurrency } from '../../utils/helpers'
import { useFormik } from 'formik'

const EmployeeDetails = () => {
  const { id } = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { employee, loading } = useSelector((state) => state.employees)
  const { user } = useSelector((state) => state.auth)
  const [editModal, setEditModal] = useState(false)

  const isAdmin = user?.role === 'admin'

  useEffect(() => {
    dispatch(getEmployee(id))
    return () => {
      dispatch(clearEmployee())
    }
  }, [dispatch, id])

  const formik = useFormik({
    initialValues: {
      firstName: employee?.firstName || '',
      lastName: employee?.lastName || '',
      phone: employee?.phone || '',
      department: employee?.department || '',
      designation: employee?.designation || '',
      role: employee?.role || 'employee',
      salary: {
        basic: employee?.salary?.basic || 0,
        hra: employee?.salary?.hra || 0,
        allowances: employee?.salary?.allowances || 0,
        deductions: employee?.salary?.deductions || 0,
      },
    },
    enableReinitialize: true,
    onSubmit: async (values) => {
      const result = await dispatch(updateEmployee({ id, data: values }))
      if (updateEmployee.fulfilled.match(result)) {
        toast.success('Employee updated successfully')
        setEditModal(false)
      } else {
        toast.error(result.payload || 'Failed to update employee')
      }
    },
  })

  if (loading || !employee) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  const roleOptions = [
    { value: 'employee', label: 'Employee' },
    { value: 'hr', label: 'HR' },
    { value: 'admin', label: 'Admin' },
  ]

  const departmentOptions = [
    { value: 'Engineering', label: 'Engineering' },
    { value: 'Design', label: 'Design' },
    { value: 'Marketing', label: 'Marketing' },
    { value: 'Sales', label: 'Sales' },
    { value: 'HR', label: 'Human Resources' },
    { value: 'Finance', label: 'Finance' },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/employees')}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
        >
          <ArrowLeftIcon className="w-5 h-5 text-gray-500" />
        </button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Employee Details
          </h1>
        </div>
        {isAdmin && (
          <Button variant="outline" icon={PencilIcon} onClick={() => setEditModal(true)}>
            Edit
          </Button>
        )}
      </div>

      {/* Profile Card */}
      <Card className="p-6">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <Avatar
            name={`${employee.firstName} ${employee.lastName}`}
            src={employee.avatar}
            size="2xl"
          />
          <div className="flex-1 text-center md:text-left">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {employee.firstName} {employee.lastName}
            </h2>
            <p className="text-gray-500 dark:text-gray-400">
              {employee.designation || 'Employee'}
            </p>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mt-3">
              <Badge variant="primary" size="lg">
                {employee.employeeId}
              </Badge>
              <Badge
                variant={employee.role === 'admin' ? 'danger' : employee.role === 'hr' ? 'warning' : 'info'}
                size="lg"
                className="capitalize"
              >
                {employee.role}
              </Badge>
              <Badge variant={employee.isActive ? 'success' : 'danger'} size="lg">
                {employee.isActive ? 'Active' : 'Inactive'}
              </Badge>
            </div>
          </div>
        </div>
      </Card>

      {/* Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Contact Info */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Contact Information
          </h3>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                <EnvelopeIcon className="w-5 h-5 text-gray-500" />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
                <p className="font-medium text-gray-900 dark:text-white">{employee.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                <PhoneIcon className="w-5 h-5 text-gray-500" />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Phone</p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {employee.phone || 'Not provided'}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center flex-shrink-0">
                <MapPinIcon className="w-5 h-5 text-gray-500" />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Address</p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {employee.address?.street || 'Not provided'}
                </p>
                {employee.address?.city && (
                  <p className="text-gray-500 dark:text-gray-400">
                    {employee.address.city}, {employee.address.state} {employee.address.zipCode}
                  </p>
                )}
              </div>
            </div>
          </div>
        </Card>

        {/* Job Info */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Job Information
          </h3>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                <BuildingOfficeIcon className="w-5 h-5 text-gray-500" />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Department</p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {employee.department || 'Not assigned'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                <BriefcaseIcon className="w-5 h-5 text-gray-500" />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Designation</p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {employee.designation || 'Not assigned'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                <CalendarIcon className="w-5 h-5 text-gray-500" />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Date of Joining</p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {formatDate(employee.dateOfJoining)}
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Salary Structure */}
        {isAdmin && (
          <Card className="p-6 lg:col-span-2">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Salary Structure
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <p className="text-sm text-gray-500 dark:text-gray-400">Basic Salary</p>
                <p className="text-xl font-bold text-green-600 dark:text-green-400">
                  {formatCurrency(employee.salary?.basic || 0)}
                </p>
              </div>
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <p className="text-sm text-gray-500 dark:text-gray-400">HRA</p>
                <p className="text-xl font-bold text-blue-600 dark:text-blue-400">
                  {formatCurrency(employee.salary?.hra || 0)}
                </p>
              </div>
              <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <p className="text-sm text-gray-500 dark:text-gray-400">Allowances</p>
                <p className="text-xl font-bold text-purple-600 dark:text-purple-400">
                  {formatCurrency(employee.salary?.allowances || 0)}
                </p>
              </div>
              <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                <p className="text-sm text-gray-500 dark:text-gray-400">Deductions</p>
                <p className="text-xl font-bold text-red-600 dark:text-red-400">
                  {formatCurrency(employee.salary?.deductions || 0)}
                </p>
              </div>
            </div>
          </Card>
        )}
      </div>

      {/* Edit Modal */}
      <Modal isOpen={editModal} onClose={() => setEditModal(false)} title="Edit Employee" size="lg">
        <form onSubmit={formik.handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="First Name"
              name="firstName"
              value={formik.values.firstName}
              onChange={formik.handleChange}
              required
            />
            <Input
              label="Last Name"
              name="lastName"
              value={formik.values.lastName}
              onChange={formik.handleChange}
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Phone"
              name="phone"
              value={formik.values.phone}
              onChange={formik.handleChange}
            />
            <Select
              label="Role"
              name="role"
              options={roleOptions}
              value={formik.values.role}
              onChange={formik.handleChange}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Department"
              name="department"
              options={departmentOptions}
              value={formik.values.department}
              onChange={formik.handleChange}
            />
            <Input
              label="Designation"
              name="designation"
              value={formik.values.designation}
              onChange={formik.handleChange}
            />
          </div>

          {isAdmin && (
            <>
              <h4 className="font-medium text-gray-900 dark:text-white pt-4">Salary Structure</h4>
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Basic Salary"
                  name="salary.basic"
                  type="number"
                  value={formik.values.salary.basic}
                  onChange={formik.handleChange}
                />
                <Input
                  label="HRA"
                  name="salary.hra"
                  type="number"
                  value={formik.values.salary.hra}
                  onChange={formik.handleChange}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Allowances"
                  name="salary.allowances"
                  type="number"
                  value={formik.values.salary.allowances}
                  onChange={formik.handleChange}
                />
                <Input
                  label="Deductions"
                  name="salary.deductions"
                  type="number"
                  value={formik.values.salary.deductions}
                  onChange={formik.handleChange}
                />
              </div>
            </>
          )}

          <div className="flex justify-end gap-3 pt-4">
            <Button variant="secondary" onClick={() => setEditModal(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" loading={loading}>
              Save Changes
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}

export default EmployeeDetails
