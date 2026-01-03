import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useFormik } from 'formik'
import toast from 'react-hot-toast'
import {
  UserCircleIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  BuildingOfficeIcon,
  BriefcaseIcon,
  CalendarIcon,
  PencilIcon,
  CameraIcon,
} from '@heroicons/react/24/outline'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import { TextArea } from '../../components/ui/Input'
import Avatar from '../../components/ui/Avatar'
import Badge from '../../components/ui/Badge'
import Modal from '../../components/ui/Modal'
import { updateEmployee } from '../../store/slices/employeeSlice'
import { loadUser } from '../../store/slices/authSlice'
import { formatDate, formatCurrency } from '../../utils/helpers'

const Profile = () => {
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.auth)
  const { loading } = useSelector((state) => state.employees)
  const [editModal, setEditModal] = useState(false)
  const [activeTab, setActiveTab] = useState('personal')

  const tabs = [
    { id: 'personal', label: 'Personal Info' },
    { id: 'job', label: 'Job Details' },
    { id: 'salary', label: 'Salary Structure' },
    { id: 'documents', label: 'Documents' },
  ]

  const formik = useFormik({
    initialValues: {
      phone: user?.phone || '',
      address: {
        street: user?.address?.street || '',
        city: user?.address?.city || '',
        state: user?.address?.state || '',
        zipCode: user?.address?.zipCode || '',
        country: user?.address?.country || '',
      },
      emergencyContact: {
        name: user?.emergencyContact?.name || '',
        relationship: user?.emergencyContact?.relationship || '',
        phone: user?.emergencyContact?.phone || '',
      },
    },
    enableReinitialize: true,
    onSubmit: async (values) => {
      const result = await dispatch(updateEmployee({ id: user?.id, data: values }))
      if (updateEmployee.fulfilled.match(result)) {
        toast.success('Profile updated successfully')
        setEditModal(false)
        dispatch(loadUser())
      } else {
        toast.error(result.payload || 'Failed to update profile')
      }
    },
  })

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <Card className="p-6">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="relative">
            <Avatar
              name={`${user?.firstName} ${user?.lastName}`}
              src={user?.avatar}
              size="2xl"
            />
            <button className="absolute bottom-0 right-0 p-2 bg-primary-600 text-white rounded-full hover:bg-primary-700 transition-colors">
              <CameraIcon className="w-4 h-4" />
            </button>
          </div>
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {user?.firstName} {user?.lastName}
            </h1>
            <p className="text-gray-500 dark:text-gray-400">{user?.designation || 'Employee'}</p>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mt-3">
              <Badge variant="primary" size="lg">
                {user?.employeeId}
              </Badge>
              <Badge variant="success" size="lg" className="capitalize">
                {user?.role}
              </Badge>
              {user?.department && (
                <Badge variant="info" size="lg">
                  {user?.department}
                </Badge>
              )}
            </div>
          </div>
          <Button
            variant="outline"
            icon={PencilIcon}
            onClick={() => setEditModal(true)}
          >
            Edit Profile
          </Button>
        </div>
      </Card>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <div className="flex gap-8 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-4 px-1 text-sm font-medium whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? 'text-primary-600 border-b-2 border-primary-600'
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'personal' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Basic Info */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Basic Information
            </h3>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                  <EnvelopeIcon className="w-5 h-5 text-gray-500" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
                  <p className="font-medium text-gray-900 dark:text-white">{user?.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                  <PhoneIcon className="w-5 h-5 text-gray-500" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Phone</p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {user?.phone || 'Not provided'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                  <CalendarIcon className="w-5 h-5 text-gray-500" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Date of Birth</p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {user?.dateOfBirth ? formatDate(user.dateOfBirth) : 'Not provided'}
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {/* Address */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Address
            </h3>
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center flex-shrink-0">
                <MapPinIcon className="w-5 h-5 text-gray-500" />
              </div>
              <div>
                <p className="font-medium text-gray-900 dark:text-white">
                  {user?.address?.street || 'Street not provided'}
                </p>
                <p className="text-gray-500 dark:text-gray-400">
                  {user?.address?.city && user?.address?.state
                    ? `${user.address.city}, ${user.address.state} ${user.address.zipCode || ''}`
                    : 'City not provided'}
                </p>
                <p className="text-gray-500 dark:text-gray-400">
                  {user?.address?.country || 'Country not provided'}
                </p>
              </div>
            </div>
          </Card>

          {/* Emergency Contact */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Emergency Contact
            </h3>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center">
                  <UserCircleIcon className="w-5 h-5 text-red-500" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Name</p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {user?.emergencyContact?.name || 'Not provided'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center">
                  <PhoneIcon className="w-5 h-5 text-red-500" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Phone</p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {user?.emergencyContact?.phone || 'Not provided'}
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}

      {activeTab === 'job' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
                    {user?.department || 'Not assigned'}
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
                    {user?.designation || 'Not assigned'}
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
                    {user?.dateOfJoining ? formatDate(user.dateOfJoining) : 'Not provided'}
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}

      {activeTab === 'salary' && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Salary Structure
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <p className="text-sm text-gray-500 dark:text-gray-400">Basic Salary</p>
              <p className="text-xl font-bold text-green-600 dark:text-green-400">
                {formatCurrency(user?.salary?.basic || 0)}
              </p>
            </div>
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <p className="text-sm text-gray-500 dark:text-gray-400">HRA</p>
              <p className="text-xl font-bold text-blue-600 dark:text-blue-400">
                {formatCurrency(user?.salary?.hra || 0)}
              </p>
            </div>
            <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <p className="text-sm text-gray-500 dark:text-gray-400">Allowances</p>
              <p className="text-xl font-bold text-purple-600 dark:text-purple-400">
                {formatCurrency(user?.salary?.allowances || 0)}
              </p>
            </div>
            <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
              <p className="text-sm text-gray-500 dark:text-gray-400">Deductions</p>
              <p className="text-xl font-bold text-red-600 dark:text-red-400">
                {formatCurrency(user?.salary?.deductions || 0)}
              </p>
            </div>
          </div>
        </Card>
      )}

      {activeTab === 'documents' && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Documents
          </h3>
          {user?.documents && user.documents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {user.documents.map((doc, index) => (
                <div
                  key={index}
                  className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg flex items-center gap-4"
                >
                  <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center">
                    📄
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 dark:text-white truncate">
                      {doc.name}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {formatDate(doc.uploadedAt)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 dark:text-gray-400 py-8">
              No documents uploaded
            </p>
          )}
        </Card>
      )}

      {/* Edit Modal */}
      <Modal isOpen={editModal} onClose={() => setEditModal(false)} title="Edit Profile" size="lg">
        <form onSubmit={formik.handleSubmit} className="space-y-4">
          <Input
            label="Phone"
            name="phone"
            placeholder="Enter phone number"
            value={formik.values.phone}
            onChange={formik.handleChange}
          />

          <div className="space-y-2">
            <h4 className="font-medium text-gray-900 dark:text-white">Address</h4>
            <Input
              name="address.street"
              placeholder="Street"
              value={formik.values.address.street}
              onChange={formik.handleChange}
            />
            <div className="grid grid-cols-2 gap-2">
              <Input
                name="address.city"
                placeholder="City"
                value={formik.values.address.city}
                onChange={formik.handleChange}
              />
              <Input
                name="address.state"
                placeholder="State"
                value={formik.values.address.state}
                onChange={formik.handleChange}
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Input
                name="address.zipCode"
                placeholder="Zip Code"
                value={formik.values.address.zipCode}
                onChange={formik.handleChange}
              />
              <Input
                name="address.country"
                placeholder="Country"
                value={formik.values.address.country}
                onChange={formik.handleChange}
              />
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="font-medium text-gray-900 dark:text-white">Emergency Contact</h4>
            <div className="grid grid-cols-2 gap-2">
              <Input
                name="emergencyContact.name"
                placeholder="Name"
                value={formik.values.emergencyContact.name}
                onChange={formik.handleChange}
              />
              <Input
                name="emergencyContact.relationship"
                placeholder="Relationship"
                value={formik.values.emergencyContact.relationship}
                onChange={formik.handleChange}
              />
            </div>
            <Input
              name="emergencyContact.phone"
              placeholder="Phone"
              value={formik.values.emergencyContact.phone}
              onChange={formik.handleChange}
            />
          </div>

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

export default Profile
