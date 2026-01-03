import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import {
  PlusIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  UserGroupIcon,
} from '@heroicons/react/24/outline'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import { Select } from '../../components/ui/Input'
import Modal from '../../components/ui/Modal'
import Avatar from '../../components/ui/Avatar'
import Badge from '../../components/ui/Badge'
import EmptyState from '../../components/ui/EmptyState'
import { TableSkeleton } from '../../components/ui/Skeleton'
import { getEmployees, deleteEmployee, createEmployee } from '../../store/slices/employeeSlice'
import { formatDate } from '../../utils/helpers'
import toast from 'react-hot-toast'
import { useFormik } from 'formik'
import { employeeSchema } from '../../utils/validations'

const Employees = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { employees, loading, pagination } = useSelector((state) => state.employees)
  const { user } = useSelector((state) => state.auth)

  const [search, setSearch] = useState('')
  const [department, setDepartment] = useState('')
  const [role, setRole] = useState('')
  const [page, setPage] = useState(1)
  const [addModal, setAddModal] = useState(false)
  const [deleteModal, setDeleteModal] = useState(null)

  const isAdmin = user?.role === 'admin'

  useEffect(() => {
    dispatch(getEmployees({ page, search, department, role }))
  }, [dispatch, page, search, department, role])

  const handleSearch = (e) => {
    setSearch(e.target.value)
    setPage(1)
  }

  const handleDelete = async () => {
    const result = await dispatch(deleteEmployee(deleteModal))
    if (deleteEmployee.fulfilled.match(result)) {
      toast.success('Employee deleted successfully')
      setDeleteModal(null)
    } else {
      toast.error(result.payload || 'Failed to delete employee')
    }
  }

  const formik = useFormik({
    initialValues: {
      employeeId: '',
      firstName: '',
      lastName: '',
      email: '',
      password: 'Password@123',
      phone: '',
      department: '',
      designation: '',
      role: 'employee',
    },
    validationSchema: employeeSchema,
    onSubmit: async (values, { resetForm }) => {
      const result = await dispatch(createEmployee(values))
      if (createEmployee.fulfilled.match(result)) {
        toast.success('Employee created successfully')
        setAddModal(false)
        resetForm()
      } else {
        toast.error(result.payload || 'Failed to create employee')
      }
    },
  })

  const departmentOptions = [
    { value: '', label: 'All Departments' },
    { value: 'Engineering', label: 'Engineering' },
    { value: 'Design', label: 'Design' },
    { value: 'Marketing', label: 'Marketing' },
    { value: 'Sales', label: 'Sales' },
    { value: 'HR', label: 'Human Resources' },
    { value: 'Finance', label: 'Finance' },
  ]

  const roleOptions = [
    { value: '', label: 'All Roles' },
    { value: 'employee', label: 'Employee' },
    { value: 'hr', label: 'HR' },
    { value: 'admin', label: 'Admin' },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Employees</h1>
          <p className="text-gray-500 dark:text-gray-400">
            Manage your organization's employees
          </p>
        </div>
        {isAdmin && (
          <Button variant="primary" icon={PlusIcon} onClick={() => setAddModal(true)}>
            Add Employee
          </Button>
        )}
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Search employees..."
              icon={MagnifyingGlassIcon}
              value={search}
              onChange={handleSearch}
            />
          </div>
          <div className="w-full md:w-48">
            <Select
              options={departmentOptions}
              value={department}
              onChange={(e) => {
                setDepartment(e.target.value)
                setPage(1)
              }}
              placeholder="Department"
            />
          </div>
          <div className="w-full md:w-40">
            <Select
              options={roleOptions}
              value={role}
              onChange={(e) => {
                setRole(e.target.value)
                setPage(1)
              }}
              placeholder="Role"
            />
          </div>
        </div>
      </Card>

      {/* Employee List */}
      {loading ? (
        <TableSkeleton rows={5} cols={5} />
      ) : employees.length > 0 ? (
        <Card>
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Employee</th>
                  <th>Employee ID</th>
                  <th>Department</th>
                  <th>Role</th>
                  <th>Joined</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {employees.map((employee) => (
                  <tr key={employee._id}>
                    <td>
                      <div className="flex items-center gap-3">
                        <Avatar
                          name={`${employee.firstName} ${employee.lastName}`}
                          src={employee.avatar}
                          size="sm"
                        />
                        <div>
                          <p className="font-medium">
                            {employee.firstName} {employee.lastName}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {employee.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td>{employee.employeeId}</td>
                    <td>{employee.department || '-'}</td>
                    <td>
                      <Badge variant={employee.role === 'admin' ? 'danger' : employee.role === 'hr' ? 'warning' : 'info'}>
                        {employee.role}
                      </Badge>
                    </td>
                    <td>{formatDate(employee.dateOfJoining)}</td>
                    <td>
                      <Badge variant={employee.isActive ? 'success' : 'danger'}>
                        {employee.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </td>
                    <td>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => navigate(`/employees/${employee._id}`)}
                          className="p-1.5 text-gray-500 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/30 rounded-lg transition-colors"
                        >
                          <EyeIcon className="w-4 h-4" />
                        </button>
                        {isAdmin && (
                          <>
                            <button
                              onClick={() => navigate(`/employees/${employee._id}`)}
                              className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                            >
                              <PencilIcon className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setDeleteModal(employee._id)}
                              className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                            >
                              <TrashIcon className="w-4 h-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 dark:border-gray-700">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Showing {employees.length} of {pagination.total} employees
              </p>
              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  disabled={page === 1}
                  onClick={() => setPage(page - 1)}
                >
                  Previous
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  disabled={page === pagination.pages}
                  onClick={() => setPage(page + 1)}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </Card>
      ) : (
        <Card className="p-12">
          <EmptyState
            icon={UserGroupIcon}
            title="No employees found"
            description="Get started by adding your first employee to the system."
            action={
              isAdmin && (
                <Button variant="primary" icon={PlusIcon} onClick={() => setAddModal(true)}>
                  Add Employee
                </Button>
              )
            }
          />
        </Card>
      )}

      {/* Add Employee Modal */}
      <Modal isOpen={addModal} onClose={() => setAddModal(false)} title="Add New Employee" size="lg">
        <form onSubmit={formik.handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Employee ID"
              name="employeeId"
              placeholder="EMP001"
              value={formik.values.employeeId}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.errors.employeeId}
              touched={formik.touched.employeeId}
              required
            />
            <Select
              label="Role"
              name="role"
              options={roleOptions.filter((r) => r.value)}
              value={formik.values.role}
              onChange={formik.handleChange}
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="First Name"
              name="firstName"
              placeholder="John"
              value={formik.values.firstName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.errors.firstName}
              touched={formik.touched.firstName}
              required
            />
            <Input
              label="Last Name"
              name="lastName"
              placeholder="Doe"
              value={formik.values.lastName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.errors.lastName}
              touched={formik.touched.lastName}
              required
            />
          </div>
          <Input
            label="Email"
            name="email"
            type="email"
            placeholder="john@example.com"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.errors.email}
            touched={formik.touched.email}
            required
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Phone"
              name="phone"
              placeholder="+1 234 567 890"
              value={formik.values.phone}
              onChange={formik.handleChange}
            />
            <Select
              label="Department"
              name="department"
              options={departmentOptions.filter((d) => d.value)}
              value={formik.values.department}
              onChange={formik.handleChange}
            />
          </div>
          <Input
            label="Designation"
            name="designation"
            placeholder="Software Engineer"
            value={formik.values.designation}
            onChange={formik.handleChange}
          />
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Default password: <code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">Password@123</code>
          </p>
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="secondary" onClick={() => setAddModal(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" loading={loading}>
              Add Employee
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!deleteModal}
        onClose={() => setDeleteModal(null)}
        title="Delete Employee"
        size="sm"
      >
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Are you sure you want to delete this employee? This action cannot be undone.
        </p>
        <div className="flex justify-end gap-3">
          <Button variant="secondary" onClick={() => setDeleteModal(null)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete} loading={loading}>
            Delete
          </Button>
        </div>
      </Modal>
    </div>
  )
}

export default Employees
