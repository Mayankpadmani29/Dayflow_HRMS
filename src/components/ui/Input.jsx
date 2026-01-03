import { ExclamationCircleIcon } from '@heroicons/react/24/outline'

const Input = ({
  label,
  name,
  type = 'text',
  placeholder,
  value,
  onChange,
  onBlur,
  error,
  touched,
  icon: Icon,
  disabled = false,
  required = false,
  className = '',
  ...props
}) => {
  const hasError = error && touched

  return (
    <div className={className}>
      {label && (
        <label htmlFor={name} className="label">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icon className="w-5 h-5 text-gray-400" />
          </div>
        )}
        <input
          id={name}
          name={name}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          disabled={disabled}
          className={`${hasError ? 'input-error' : 'input'} ${Icon ? 'pl-10' : ''} ${
            hasError ? 'pr-10' : ''
          }`}
          {...props}
        />
        {hasError && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <ExclamationCircleIcon className="w-5 h-5 text-red-500" />
          </div>
        )}
      </div>
      {hasError && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  )
}

export const TextArea = ({
  label,
  name,
  placeholder,
  value,
  onChange,
  onBlur,
  error,
  touched,
  rows = 4,
  disabled = false,
  required = false,
  className = '',
  ...props
}) => {
  const hasError = error && touched

  return (
    <div className={className}>
      {label && (
        <label htmlFor={name} className="label">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <textarea
        id={name}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        disabled={disabled}
        rows={rows}
        className={hasError ? 'input-error' : 'input'}
        {...props}
      />
      {hasError && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  )
}

export const Select = ({
  label,
  name,
  options,
  value,
  onChange,
  onBlur,
  error,
  touched,
  placeholder = 'Select an option',
  disabled = false,
  required = false,
  className = '',
  ...props
}) => {
  const hasError = error && touched

  return (
    <div className={className}>
      {label && (
        <label htmlFor={name} className="label">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        disabled={disabled}
        className={hasError ? 'input-error' : 'input'}
        {...props}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {hasError && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  )
}

export default Input
